import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import cors from "cors";
import 'dotenv/config';
import axios from 'axios';
import * as cheerio from 'cheerio';
import multer from "multer";
import { put } from '@vercel/blob';
import { createClient } from '@supabase/supabase-js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Supabase Configuration (Used for any other future client needs)
  const rawSupabaseUrl = process.env.SUPABASE_URL || "https://zrvduoxsaqtiixsknpnv.supabase.co";
  let supabaseUrl = rawSupabaseUrl.split('/rest/v1')[0].split('/storage/v1')[0].replace(/\/+$/, "");
  const supabaseKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydmR1b3hzYXF0aWl4c2tucG52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjg3MjksImV4cCI6MjA5MjcwNDcyOX0.hfM5tjamYmPKe9t2way_tm0fVQMdnG980u4K_HWUPso";
  const supabaseBucket = process.env.SUPABASE_BUCKET || "products";

  const supabase = supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
  
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.use((req, res, next) => {
    console.log(`REQ: ${req.method} ${req.path}`);
    next();
  });

  app.post("/api/scrape-product", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });
    console.log(`[Scraper] [${req.method}] ${req.path} - URL: ${url}`);
    
    try {
      let html = '';
      
      const fetchMethods = [
        // Method 1: Direct fetch with standard UA
        async () => {
          const response = await axios.get(url, {
            timeout: 10000,
            headers: { 
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Referer': 'https://www.google.com/',
            }
          });
          return response.data;
        },
        // Method 2: Direct fetch with different UA
        async () => {
          const response = await axios.get(url, {
            timeout: 10000,
            headers: { 
              'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            }
          });
          return response.data;
        },
        // Method 3: AllOrigins Proxy
        async () => {
          const proxyRes = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, { timeout: 15000 });
          return proxyRes.data?.contents || '';
        },
        // Method 4: Codetabs Proxy
        async () => {
          const proxyRes = await axios.get(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`, { timeout: 15000 });
          return proxyRes.data;
        },
        // Method 5: CorsProxy.io
        async () => {
          const proxyRes = await axios.get(`https://corsproxy.io/?${encodeURIComponent(url)}`, { timeout: 15000 });
          return proxyRes.data;
        }
      ];

      for (const method of fetchMethods) {
        try {
          html = await method();
          
          // Check if we got a real page or a block
          if (html && 
              html.includes('<html') && 
              !html.includes('Robot Check') && 
              !html.includes('Bot Check') &&
              !html.includes('captcha') &&
              !html.includes('503 Service Unavailable') &&
              !html.includes('503 - Service Unavailable')) {
            break;
          } else {
            console.log(`[Scraper] Blocked or invalid content from method, trying next...`);
            html = '';
          }
        } catch (error: any) {
          console.warn(`[Scraper] A fetch method failed: ${error.message}`);
        }
      }

      if (!html || !html.includes('<html')) {
        throw new Error("Target website blocked the request (Anti-bot protection).");
      }

      const $ = cheerio.load(html);
      
      const name = $('meta[property="og:title"]').attr('content') || $('title').text() || $('h1').first().text().trim() || 'Unknown Product';
      
      let price = $('meta[property="product:price:amount"]').attr('content') || 
                  $('[itemprop="price"]').attr('content') ||
                  $('.price, .product-price, .amount, .a-price-whole').first().text();
      let cleanedPrice = price ? String(price).replace(/[^0-9.]/g, '') : '0';
      if (cleanedPrice && !cleanedPrice.startsWith('₹') && cleanedPrice !== '0') {
        cleanedPrice = `₹${cleanedPrice}`;
      }

      const oldPriceText = $('.old-price, .a-text-strike, del').first().text();
      let oldPrice = oldPriceText ? String(oldPriceText).replace(/[^0-9.]/g, '') : '';
      if (oldPrice && !oldPrice.startsWith('₹')) {
        oldPrice = `₹${oldPrice}`;
      }
      
      const image = $('meta[property="og:image"]').attr('content') || 
                    $('meta[name="twitter:image"]').attr('content') ||
                    $('img[itemprop="image"]').attr('src') ||
                    $('#landingImage, #imgBlkFront').attr('src');
                    
      const additionalImages: string[] = [];
      $('#altImages img, .a-dynamic-image, .product-image-gallery img, .thumbnail img').each((_, el) => {
        let srcRaw = $(el).attr('src') || $(el).attr('data-old-hires') || $(el).data('src');
        if (srcRaw) {
          let src = String(srcRaw);
          // Amazon specific: remove small image constraint to get full size
          if (src.includes('amazon.com') || src.includes('images-amazon.com')) {
            src = src.replace(/\._[A-Z0-9_]+_\./, '.');
          }
          if (src !== image && !additionalImages.includes(src) && src.startsWith('http')) {
            additionalImages.push(src);
          }
        }
      });
      // also try to find amazon image array in js scripts
      if (additionalImages.length === 0) {
        const scriptMatch = html.match(/'colorImages':\s*({.+?}),/);
        if (scriptMatch && scriptMatch[1]) {
          try {
            const data = JSON.parse(scriptMatch[1].replace(/'/g, '"'));
            if (data.initial && Array.isArray(data.initial)) {
              data.initial.forEach((imgObj: any) => {
                if (imgObj.hiRes && imgObj.hiRes !== image && !additionalImages.includes(imgObj.hiRes)) {
                  additionalImages.push(imgObj.hiRes);
                } else if (imgObj.large && imgObj.large !== image && !additionalImages.includes(imgObj.large)) {
                  additionalImages.push(imgObj.large);
                }
              });
            }
          } catch (e) {}
        }
      }
                    
      const description = $('meta[property="og:description"]').attr('content') || 
                          $('meta[name="description"]').attr('content') ||
                          $('.description, .product-description, #feature-bullets').first().text().trim();
      
      let brand = $('meta[property="product:brand"]').attr('content') || 
                    $('[itemprop="brand"] [itemprop="name"]').text().trim() ||
                    $('[itemprop="brand"]').text().trim() ||
                    $('#bylineInfo').text().trim() || '';

      if (brand) {
         if (brand.toLowerCase().startsWith('visit the ')) {
            brand = brand.replace(/visit the /i, '').replace(/ store/i, '').trim();
         }
         if (brand.toLowerCase().startsWith('brand: ')) {
            brand = brand.replace(/brand: /i, '').trim();
         }
      } else {
         brand = 'Unknown';
      }

      const category = $('meta[property="product:category"]').attr('content') || 
                       $('[itemprop="category"]').attr('content') ||
                       $('.nav-a-content').first().text().trim() || '';

      const discount = $('.savingsPercentage, .discount, .badge').first().text().trim();
      
      const specifications: Record<string, string> = {};
      
      const parseSpecRow = (_: any, el: any) => {
        const key = $(el).find('th').first().text().trim() || $(el).find('td').first().text().trim();
        const value = $(el).find('td').not(':first-child').first().text().trim() || $(el).find('td').last().text().trim();
        
        if (key && value && !key.toLowerCase().includes('customer reviews') && !key.toLowerCase().includes('sellers')) {
          const cleanKey = key.replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\n/g, ' ').trim();
          const cleanVal = value.replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\n/g, ' ').trim();
          if (cleanKey && cleanVal) {
            specifications[cleanKey] = cleanVal;
          }
        }
      };

      $('#productDetails_techSpec_section_1 tr').each(parseSpecRow);
      $('#productDetails_techSpec_section_2 tr').each(parseSpecRow);
      $('table.spec-table tr, table._14cfVK tr, table.a-keyvalue tr, #productOverview_feature_div tr').each(parseSpecRow);

      $('.po-row').each((_, el) => {
        const key = $(el).find('.a-span3').text().replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\n/g, ' ').trim();
        const value = $(el).find('.a-span9').text().replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\n/g, ' ').trim();
        if (key && value) {
          specifications[key] = value;
        }
      });

      let featureCount = 1;
      $('#feature-bullets ul li:not(.a-hidden) span.a-list-item').each((_, el) => {
        const text = $(el).text().trim();
        if (text && !text.includes('Hide') && !text.includes('Show more')) {
          specifications[`Feature ${featureCount++}`] = text;
        }
      });

      if ((!brand || brand === 'Unknown') && specifications['Brand']) {
        brand = specifications['Brand'];
      }

      console.log(`[Scraper] Successfully parsed: ${name}`);
      res.json({ name, price: cleanedPrice, oldPrice, image, additionalImages, description, brand, category, discount, specifications });
    } catch (error: any) {
      console.error("[Scraper Error]", error.message);
      const status = error.response?.status || 500;
      let message = error.message;
      
      if (status === 403 || status === 429) {
        message = "Access denied by target website. They might be blocking automated tools.";
      }
      
      res.status(status).json({ error: message });
    }
  });

  const uploadMiddleware = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } 
  });

  app.post("/api/upload-file", uploadMiddleware.single('file'), async (req, res) => {
    try {
      const file = (req as any).file;
      if (!file) return res.status(400).json({ error: "No file uploaded" });

      // Using Vercel Blob
      const blob = await put(file.originalname, file.buffer, {
        access: 'public',
      });

      res.json({ secure_url: blob.url });
    } catch (error: any) {
      console.error("[Upload Error]", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API proxy for appwrite images (for backwards compatibility with old products)
  app.get("/api/images/:fileId", async (req, res) => {
    try {
      const fileId = req.params.fileId;
      if (!process.env.APPWRITE_ENDPOINT || !process.env.APPWRITE_PROJECT_ID || !process.env.APPWRITE_API_KEY || !process.env.APPWRITE_BUCKET_ID) {
        return res.status(500).send("Appwrite configuration missing");
      }
      
      const response = await axios.get(
        `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_BUCKET_ID}/files/${fileId}/view?project=${process.env.APPWRITE_PROJECT_ID}`, 
        {
          headers: {
            'X-Appwrite-Project': process.env.APPWRITE_PROJECT_ID,
            'X-Appwrite-Key': process.env.APPWRITE_API_KEY
          },
          responseType: 'arraybuffer'
        }
      );
      
      const contentType = response.headers['content-type'];
      if (typeof contentType === 'string') {
        res.setHeader('Content-Type', contentType);
      }
      
      res.setHeader('Cache-Control', 'public, max-age=2592000');
      res.send(response.data);
    } catch (err: any) {
      console.error("Image proxy error:", err.message);
      res.status(err.response?.status || 500).send(err.message);
    }
  });

  // API health
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Fallback for missing API routes to ensure they return JSON, not HTML
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.path}` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
    
    app.get('*', async (req, res, next) => {
      // Skip API routes as they should have been handled or returned 404 in JSON
      if (req.path.startsWith('/api')) return next();
      
      // For any other route, serve index.html to support SPA routing
      try {
        const url = req.originalUrl;
        const indexPath = path.resolve(process.cwd(), 'index.html');
        
        if (!fs.existsSync(indexPath)) {
          console.warn("index.html not found, falling back to basic response");
          return res.status(404).send("Internal Error: Application entry point missing");
        }

        let template = fs.readFileSync(indexPath, 'utf-8');
        // Transform the HTML with Vite's dev server to inject scripts and HMR
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).send(template);
      } catch (e: any) {
        if (vite) vite.ssrFixStacktrace(e);
        console.error("Vite Transform Error:", e);
        res.status(500).send(e.toString());
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    
    // Support SPA routing in production
    app.get('*', (req, res) => {
      // If it's an API route that reached here, it's missing
      if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: "API route not found" });
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Start listening
  try {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server successfully started and listening on 0.0.0.0:${PORT}`);
    });
  } catch (listenError) {
    console.error("Critical error starting server:", listenError);
  }
}

startServer().catch(err => {
  console.error("Failed to initialize server application:", err);
});
