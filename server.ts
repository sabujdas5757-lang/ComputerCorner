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

const app = express();
const PORT = 3000;

async function startServer() {
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
      const isAmazon = url.includes('amazon.');
      
      const fetchMethods = [
        async () => {
          const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'
          ];
          
          const headers: any = {
            'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.google.com/',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          };
          
          if (isAmazon) {
            headers['device-memory'] = '8';
            headers['downlink'] = '10';
          }

          const response = await axios.get(url, { 
            timeout: 10000, 
            headers, 
            maxRedirects: 5, 
            validateStatus: () => true 
          });
          
          if (response.status !== 200) throw new Error(`Status ${response.status}`);
          return response.data;
        },
        async () => {
          const response = await axios.get(url, {
            timeout: 8000,
            headers: { 
              'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
              'Accept': 'text/html'
            }
          });
          return response.data;
        }
      ];

      for (let i = 0; i < fetchMethods.length; i++) {
        try {
          if (i > 0) await new Promise(r => setTimeout(r, 1000));
          html = await fetchMethods[i]();
          const low = (html || '').toLowerCase() as string;
          const blocked = low.includes('robot check') || low.includes('captcha') || low.includes('503 service') || (isAmazon && low.length < 5000);
          if (html && html.includes('<html') && !blocked) break;
          html = '';
        } catch (e) {}
      }

      if (!html || !html.includes('<html')) {
        return res.status(403).json({ error: "Access denied by target website. Falling back to AI Magic Scraper...", needsAI: true });
      }

      const $ = cheerio.load(html);
      
      const name = isAmazon ? $('#productTitle').text().trim() : 
                  ($('meta[property="og:title"]').attr('content') || $('title').text() || $('h1').first().text().trim());
      
      let priceRaw = '';
      if (isAmazon) {
        priceRaw = $('.a-price-whole').first().text() || 
                   $('.a-offscreen').first().text() || 
                   $('#priceblock_ourprice').text() || 
                   $('#priceblock_dealprice').text();
      } else {
        priceRaw = $('meta[property="product:price:amount"]').attr('content') || 
                   $('[itemprop="price"]').attr('content') ||
                   $('.price, .product-price, .amount, .a-price-whole, .pdp-price').first().text();
      }

      const oldPriceText = $('.old-price, .a-text-strike, del, .pdp-mrp').first().text();
      
      const image = $('meta[property="og:image"]').attr('content') || 
                    $('meta[name="twitter:image"]').attr('content') ||
                    $('img[itemprop="image"]').attr('src') ||
                    $('#landingImage, #imgBlkFront').attr('src');
                    
      const additionalImages: string[] = [];
      $('#altImages img, .a-dynamic-image, .product-image-gallery img, .thumbnail img').each((_, el) => {
        let srcRaw = $(el).attr('src') || $(el).attr('data-old-hires') || $(el).data('src');
        if (srcRaw) {
          let src = String(srcRaw);
          if (src.includes('amazon.com') || src.includes('images-amazon.com')) {
            src = src.replace(/\._[A-Z0-9_]+_\./, '.');
          }
          if (src !== image && !additionalImages.includes(src) && src.startsWith('http')) {
            additionalImages.push(src);
          }
        }
      });
                    
      const description = $('meta[property="og:description"]').attr('content') || 
                          $('meta[name="description"]').attr('content') ||
                          $('.description, .product-description, #feature-bullets').first().text().trim();
      
      let brand = $('meta[property="product:brand"]').attr('content') || 
                    $('[itemprop="brand"] [itemprop="name"]').text().trim() ||
                    $('[itemprop="brand"]').text().trim() ||
                    $('#bylineInfo').text().trim() || '';

      if (brand) {
         brand = brand.replace(/visit the /i, '').replace(/ store/i, '').replace(/brand: /i, '').trim();
      }

      const category = $('meta[property="product:category"]').attr('content') || 
                       $('[itemprop="category"]').attr('content') ||
                       $('.nav-a-content').first().text().trim() || '';

      const discount = $('.savingsPercentage, .discount, .badge').first().text().trim();
      
      const specifications: Record<string, string> = {};
      const parseSpecRow = (_: any, el: any) => {
        const key = $(el).find('th').first().text().trim() || $(el).find('td').first().text().trim();
        const value = $(el).find('td').not(':first-child').first().text().trim() || $(el).find('td').last().text().trim();
        if (key && value && !key.toLowerCase().includes('customer reviews')) {
          specifications[key] = value;
        }
      };

      $('#productDetails_techSpec_section_1 tr, #productDetails_techSpec_section_2 tr, table.spec-table tr, table.a-keyvalue tr').each(parseSpecRow);

      console.log(`[Scraper] Successfully parsed: ${name}`);
      res.json({ name, price: priceRaw, oldPrice: oldPriceText, image, additionalImages, description, brand, category, discount, specifications });
    } catch (error: any) {
      console.error("[Scraper Error]", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // Proxy-save an external image to Vercel Blob
  app.post("/api/upload-from-url", async (req, res) => {
    const { url } = req.body;
    if (!url || !url.startsWith('http')) return res.status(400).json({ error: "Valid URL is required" });

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn("[Upload-From-URL] BLOB_READ_WRITE_TOKEN is missing. Skipping external upload.");
      return res.status(503).json({ error: "Vercel Blob storage is not configured (missing token). Please set it in secrets." });
    }

    try {
      console.log(`[Upload-From-URL] Processing image: ${url.substring(0, 50)}...`);
      const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
      const buffer = Buffer.from(response.data);
      const contentTypeHeader = response.headers['content-type'] as string;
      const contentType = typeof contentTypeHeader === 'string' ? contentTypeHeader : 'image/jpeg';
      
      const rawFilename = url.split('/').pop()?.split(/[#?]/)[0] || 'scraped-image.jpg';
      const filename = rawFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
      const blob = await put(filename, buffer, {
        access: 'public',
        contentType: contentType,
        addRandomSuffix: true
      });

      console.log(`[Upload-From-URL] Successfully saved to Vercel: ${blob.url}`);
      res.json({ secure_url: blob.url });
    } catch (error: any) {
      console.error("[Upload-From-URL Error]", error.message);
      res.status(500).json({ error: "Storage error: " + (error.message || "Unknown error") });
    }
  });

  const uploadMiddleware = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } 
  });

  app.post("/api/upload-file", uploadMiddleware.single('file'), async (req, res) => {
    try {
      const file = (req as any).file;
      if (!file) {
        console.warn("[Upload] No file provided in request");
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log(`[Upload] Processing file: ${file.originalname} (${file.size} bytes)`);

      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error("[Upload] BLOB_READ_WRITE_TOKEN is missing");
        return res.status(503).json({ error: "Vercel Blob storage is not configured (missing token)." });
      }

      // Using Vercel Blob
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const blob = await put(sanitizedName, file.buffer, {
        access: 'public',
        contentType: file.mimetype,
        addRandomSuffix: true
      });

      console.log(`[Upload] Success: ${blob.url}`);
      res.json({ secure_url: blob.url });
    } catch (error: any) {
      console.error("[Upload Error]", error.message || error);
      res.status(500).json({ error: "Upload failed: " + (error.message || "Unknown server error") });
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

  app.get("/api/storage-status", (req, res) => {
    res.json({ 
      configured: !!process.env.BLOB_READ_WRITE_TOKEN,
      provider: "Vercel Blob",
      message: process.env.BLOB_READ_WRITE_TOKEN ? "Storage is ready" : "BLOB_READ_WRITE_TOKEN is missing in environment variables"
    });
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

export default app;
