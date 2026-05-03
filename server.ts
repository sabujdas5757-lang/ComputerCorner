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

  app.post("/api/scrape-amazon-search", async (req, res) => {
    let hasResponded = false;
    const { query: searchQuery } = req.body;
    
    if (!searchQuery) {
      return res.status(400).json({ error: "Search query is required" });
    }
    
    const url = `https://www.amazon.in/s?k=${encodeURIComponent(searchQuery)}`;
    console.log(`[Search Scraper] Initiating search for: "${searchQuery}"`);

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    try {
      let html = '';
      const uas = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0'
      ];

      const getHeaders = () => ({
        'User-Agent': uas[Math.floor(Math.random() * uas.length)],
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.google.com/',
        'DNT': '1',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'cross-site',
        'Sec-Fetch-User': '?1'
      });

      const methods = [
        async () => {
           console.log("[Search Scraper] Trying Method 1: Direct Fetch");
           const response = await axios.get(url, {
             headers: getHeaders(),
             timeout: 10000,
             validateStatus: () => true
           });
           return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
        },
        async () => {
           console.log("[Search Scraper] Trying Method 2: AllOrigins Proxy");
           const proxyRes = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, { timeout: 15000 });
           const content = proxyRes.data?.contents;
           return typeof content === 'string' ? content : '';
        },
        async () => {
           console.log("[Search Scraper] Trying Method 3: CorsProxy.io");
           const proxyRes = await axios.get(`https://corsproxy.io/?${encodeURIComponent(url)}`, { timeout: 15000 });
           return typeof proxyRes.data === 'string' ? proxyRes.data : JSON.stringify(proxyRes.data);
        }
      ];

      for (let i = 0; i < methods.length; i++) {
        try {
          html = await methods[i]();
          if (html && (html.includes('s-result-item') || html.includes('s-main-slot')) && !html.includes('Robot Check')) {
            console.log(`[Search Scraper] Method ${i+1} succeeded. Length: ${html.length}`);
            break;
          }
          console.warn(`[Search Scraper] Method ${i+1} insufficient/blocked. Length: ${html?.length || 0}`);
          if (i < methods.length - 1) await sleep(1000 + Math.random() * 1000); 
        } catch (e: any) {
          console.warn(`[Search Scraper] Method ${i+1} error: ${e.message}`);
        }
      }

      if (!html || html.includes('Robot Check') || html.includes('api-services-support@amazon.com')) {
        console.error("[Search Scraper] All methods failed to bypass bot detection.");
        hasResponded = true;
        return res.status(503).json({ error: "Amazon blocked the request. Please try a different search term or wait a few minutes." });
      }

      const $ = cheerio.load(html);
      const results: any[] = [];

      $('.s-result-item').each((_, el) => {
        const $el = $(el);
        const asin = $el.attr('data-asin');
        if (!asin) return;

        let title = $el.find('h2 a span').first().text().trim();
        if (!title) title = $el.find('.a-size-medium.a-color-base.a-text-normal').first().text().trim();
        if (!title) title = $el.find('.a-size-base-plus.a-color-base.a-text-normal').first().text().trim();
        
        let price = $el.find('.a-price-whole').first().text().trim();
        let symbol = $el.find('.a-price-symbol').first().text().trim() || '₹';
        
        let image = $el.find('.s-image').attr('src');
        let rating = $el.find('.a-icon-star-small .a-icon-alt, .a-icon-star .a-icon-alt').first().text().trim();
        let reviews = $el.find('.a-size-small .a-link-normal .a-size-base, .a-section.a-spacing-none.a-spacing-top-micro .a-row.a-size-small .a-size-base').first().text().trim();
        
        const path = $el.find('h2 a').attr('href');
        const link = path ? (path.startsWith('http') ? path : 'https://www.amazon.in' + path) : '';

        if (title && (price || image)) {
          results.push({
            title,
            price: price ? `${symbol}${price}` : 'Check Price',
            image,
            rating,
            reviews,
            url: link,
            asin
          });
        }
      });

      console.log(`[Search Scraper] Successfully extracted ${results.length} items.`);
      hasResponded = true;
      res.json({ results });
    } catch (error: any) {
      console.error("[Search Scraper Fatal Error]", error.message);
      if (!hasResponded) {
        res.status(500).json({ error: "Internal server error during scraping: " + error.message });
      }
    }
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
          const proxyRes = await axios.get(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, { 
            timeout: 20000,
            headers: { 'User-Agent': 'Mozilla/5.0' }
          });
          return proxyRes.data?.contents || '';
        },
        // Method 4: Codetabs Proxy
        async () => {
          const proxyRes = await axios.get(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`, { 
            timeout: 20000,
            validateStatus: () => true 
          });
          if (proxyRes.status !== 200) throw new Error(`Codetabs returned ${proxyRes.status}`);
          return proxyRes.data;
        },
        // Method 5: CorsProxy.io
        async () => {
          const proxyRes = await axios.get(`https://corsproxy.io/?${encodeURIComponent(url)}`, { 
            timeout: 20000,
            validateStatus: () => true
          });
          if (proxyRes.status !== 200) throw new Error(`CorsProxy returned ${proxyRes.status}`);
          return proxyRes.data;
        },
        // Method 6: ThingProxy
        async () => {
          const proxyRes = await axios.get(`https://thingproxy.freeboard.io/fetch/${encodeURIComponent(url)}`, { timeout: 15000 });
          return proxyRes.data;
        },
        // Method 7: Proxy.io (different endpoint)
        async () => {
          const proxyRes = await axios.get(`https://proxy.cors.sh/${url}`, { 
            timeout: 15000,
            headers: { 'x-cors-gratis': 'true' }
          });
          return proxyRes.data;
        },
        // Method 8: Direct fetch using native fetch (sometimes axios headers are flagged)
        async () => {
          const response = await fetch(url, {
            headers: { 
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            },
            signal: AbortSignal.timeout(10000)
          } as any);
          if (!response.ok) throw new Error(`Fetch returned ${response.status}`);
          return await response.text();
        }
      ];

      for (const method of fetchMethods) {
        try {
          html = await method();
          
          // Check if we got a real page or a block
          if (html && 
              typeof html === 'string' &&
              html.includes('<html') && 
              !html.includes('Robot Check') && 
              !html.includes('Bot Check') &&
              !html.includes('captcha') &&
              !html.includes('503 Service Unavailable') &&
              !html.includes('503 - Service Unavailable') &&
              html.length > 500) { // Lowered threshold slightly
            console.log(`[Scraper] Successfully fetched content (${html.length} chars) using a fetch method.`);
            break;
          } else {
            console.log(`[Scraper] Content too short, blocked, or invalid (Length: ${html?.length}), trying next...`);
            html = '';
          }
        } catch (error: any) {
          const status = error.response?.status || 'network error';
          console.warn(`[Scraper] A fetch method failed (${status}): ${error.message}`);
        }
      }

      if (!html || !html.includes('<html')) {
        console.error("[Scraper] All fetch methods failed for URL:", url);
        throw new Error("The target website is heavily protected or temporarily unavailable (all 8 attempt methods failed). Please add product details manually.");
      }

      const $ = cheerio.load(html);
      
      const name = $('meta[property="og:title"]').attr('content') || $('title').text() || $('h1').first().text().trim() || 'Unknown Product';
      
      const priceRaw = $('meta[property="product:price:amount"]').attr('content') || 
                  $('[itemprop="price"]').attr('content') ||
                  $('.price, .product-price, .amount, .a-price-whole').first().text();

      const formatPrice = (p: string | undefined) => {
        if (!p) return '';
        let cleaned = String(p).replace(/[^0-9.]/g, '');
        if (!cleaned || cleaned === '.' || cleaned === '0') return '₹0.00';
        
        const num = parseFloat(cleaned);
        if (isNaN(num)) return p;
        
        // Manual formatting to ensure it works even if Intl isn't fully supported in node env
        const rounded = num.toFixed(2);
        const [intPart, decimalPart] = rounded.split('.');
        // Simple comma formatting for Indian style: last 3 digits, then every 2
        let lastThree = intPart.substring(intPart.length - 3);
        let otherParts = intPart.substring(0, intPart.length - 3);
        if (otherParts !== '') {
            lastThree = ',' + lastThree;
        }
        const formattedInt = otherParts.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        return `₹${formattedInt}.${decimalPart}`;
      };

      const cleanedPrice = formatPrice(priceRaw);
      const oldPriceText = $('.old-price, .a-text-strike, del').first().text();
      const oldPrice = formatPrice(oldPriceText);
      
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
