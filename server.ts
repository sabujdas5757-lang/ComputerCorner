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
import FirecrawlApp from '@mendable/firecrawl-js';
import { chromium } from 'playwright';

const app = express();
const PORT = 3000;

// Initialize AI SDK at top level
// MOVED TO FRONTEND PER SDK GUIDELINES


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function startServer() {
  // Supabase Configuration
  const rawSupabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const supabaseBucket = process.env.SUPABASE_BUCKET || "products";

  let supabase = null;
  if (rawSupabaseUrl && supabaseKey) {
    try {
      const supabaseUrl = rawSupabaseUrl.split('/rest/v1')[0].split('/storage/v1')[0].replace(/\/+$/, "");
      supabase = createClient(supabaseUrl, supabaseKey);
      console.log("[Storage] Supabase client initialized.");
    } catch (e: any) {
      console.error("[Storage] Failed to initialize Supabase:", e.message);
    }
  } else {
    console.log("[Storage] Supabase not configured (missing URL or Key).");
  }

  const firecrawlApiKey = process.env.FIRECRAWL_API_KEY || "fc-41fffa08d219415a98e026b53da7a8e4";
  const firecrawl = firecrawlApiKey ? new FirecrawlApp({ apiKey: firecrawlApiKey }) : null;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));


  app.use((req, res, next) => {
    console.log(`REQ: ${req.method} ${req.path}`);
    next();
  });

  // Proxy-save an external image to Vercel Blob or Supabase
  app.post("/api/upload-from-url", async (req, res) => {
    const { url } = req.body;
    if (!url || !url.startsWith('http')) return res.status(400).json({ error: "Valid URL is required" });

    try {
      console.log(`[Upload-From-URL] Processing image: ${url.substring(0, 50)}...`);
      const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
      const buffer = Buffer.from(response.data);
      const contentTypeHeader = response.headers['content-type'] as string;
      const contentType = typeof contentTypeHeader === 'string' ? contentTypeHeader : 'image/jpeg';
      
      const rawFilename = url.split('/').pop()?.split(/[#?]/)[0] || 'scraped-image.jpg';
      const cleanName = rawFilename.replace(/[^a-zA-Z0-9.-]/g, '_');

      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(cleanName, buffer, {
          access: 'public',
          contentType: contentType,
          addRandomSuffix: true
        });
        console.log(`[Upload-From-URL] Saved to Vercel: ${blob.url}`);
        return res.json({ secure_url: blob.url });
      } else if (supabase) {
        const uniqueName = `${Date.now()}-${cleanName}`;
        const { data, error } = await supabase.storage
          .from(supabaseBucket)
          .upload(uniqueName, buffer, { contentType: contentType, upsert: true });

        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from(supabaseBucket)
          .getPublicUrl(uniqueName);

        console.log(`[Upload-From-URL] Saved to Supabase: ${publicUrl}`);
        return res.json({ secure_url: publicUrl });
      } else {
        return res.status(503).json({ error: "No storage provider configured." });
      }
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
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log(`[Upload] Processing file: ${file.originalname}`);
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');

      if (process.env.BLOB_READ_WRITE_TOKEN) {
        const blob = await put(sanitizedName, file.buffer, {
          access: 'public',
          contentType: file.mimetype,
          addRandomSuffix: true
        });
        console.log(`[Upload] Saved to Vercel: ${blob.url}`);
        return res.json({ secure_url: blob.url });
      } else if (supabase) {
        const uniqueName = `${Date.now()}-${sanitizedName}`;
        const { data, error } = await supabase.storage
          .from(supabaseBucket)
          .upload(uniqueName, file.buffer, { contentType: file.mimetype, upsert: true });

        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from(supabaseBucket)
          .getPublicUrl(uniqueName);

        console.log(`[Upload] Saved to Supabase: ${publicUrl}`);
        return res.json({ secure_url: publicUrl });
      } else {
        return res.status(503).json({ error: "No storage provider configured." });
      }
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
    const vercelConfigured = !!process.env.BLOB_READ_WRITE_TOKEN;
    const supabaseConfigured = !!supabase;
    
    console.log(`[Storage] Check requested. Vercel: ${vercelConfigured}, Supabase: ${supabaseConfigured}`);
    
    // Check if configuration is actually valid (not just truthy)
    // Sometimes the tokens are placeholders or empty strings
    const isVercelReady = vercelConfigured && process.env.BLOB_READ_WRITE_TOKEN !== '';
    
    res.json({ 
      configured: isVercelReady || supabaseConfigured,
      provider: isVercelReady ? "Vercel Blob" : (supabaseConfigured ? "Supabase Storage" : "None"),
      vercel: isVercelReady,
      supabase: supabaseConfigured,
      message: isVercelReady 
        ? "Storage is ready (Vercel Blob)" 
        : (supabaseConfigured 
            ? "Storage is ready (Supabase Fallback)" 
            : "No storage tokens found in environment. Please set BLOB_READ_WRITE_TOKEN or SUPABASE_ANON_KEY.")
    });
  });


  // Scrape product via Playwright
  app.post("/api/playwright-scrape", async (req, res) => {
    const { url } = req.body;
    if (!url || !url.startsWith('http')) return res.status(400).json({ error: "Valid URL is required" });

    let browser;
    try {
      console.log(`[Playwright] Scraping URL: ${url}`);
      browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
        viewport: { width: 1920, height: 1080 }
      });
      const page = await context.newPage();
      
      // Navigate to URL with 45s timeout
      await page.goto(url, { waitUntil: 'load', timeout: 45000 });
      
      // Additional wait for network to settle and potential redirects
      try {
        await page.waitForLoadState('networkidle', { timeout: 10000 });
      } catch (e) {
        console.warn("[Playwright] Network idle timeout, proceeding anyway...");
      }
      
      // Wait for at least some content to stabilize
      await page.waitForTimeout(3000);

      // Scroll to trigger lazy loading of images
      await page.evaluate(async () => {
        window.scrollBy(0, window.innerHeight);
        await new Promise(r => setTimeout(r, 1000));
        window.scrollBy(0, window.innerHeight);
        await new Promise(r => setTimeout(r, 1000));
      });

      // Extract raw data with error handling for content retrieval
      let content = '';
      try {
        content = await page.content();
      } catch (contentErr: any) {
        console.error("[Playwright] Failed to get content on first try, waiting and retrying...", contentErr.message);
        await page.waitForTimeout(3000);
        content = await page.content();
      }

      const pageTitle = await page.title();
      const $ = cheerio.load(content);

      // Basic extraction
      const name = $('h1').first().text().trim() || pageTitle;
      
      // Price extraction logic remains similar but more targeted
      const priceSelectors = [
        '.a-price .a-offscreen',
        '._30jeq3',
        '.price',
        '[data-testid="price"]',
        '.product-price',
        '.current-price',
        '.price-container'
      ];
      let price = 'Unknown';
      for (const sel of priceSelectors) {
        const p = $(sel).first().text().trim();
        if (p) {
          price = p;
          break;
        }
      }

      // Return raw data and text content for frontend refinement
      // Clean up text content to remove excessive whitespace and scripts
      const bodyText = $('body').clone();
      bodyText.find('script, style, noscript, iframe, .header, .footer, footer, header, nav').remove();
      // Extract Meta Images (often the best quality)
      const metaImages: string[] = [];
      $('meta[property="og:image"], meta[name="twitter:image"]').each((_, el) => {
        const content = $(el).attr('content');
        if (content) metaImages.push(content.startsWith('/') ? new URL(content, url).toString() : content);
      });

      // Extract images with dimension analysis in the browser
      const browserImages = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('img'));
        return imgs
          .map(img => ({
            src: img.currentSrc || img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src'),
            width: img.naturalWidth,
            height: img.naturalHeight,
            alt: img.alt,
            isVisible: img.offsetWidth > 0 && img.offsetHeight > 0
          }))
          .filter(img => img.src && img.isVisible && img.width > 200 && img.height > 200) // Filter tiny images
          .sort((a, b) => (b.width * b.height) - (a.width * a.height)); // Prioritize biggest
      });

      const textContent = bodyText.text().replace(/\s\s+/g, ' ').substring(0, 45000);
      
      const foundImages = [
        ...metaImages,
        ...browserImages.map(img => img.src)
      ].filter(src => {
        if (!src) return false;
        const lower = src.toLowerCase();
        return !lower.includes('logo') && !lower.includes('icon') && !lower.includes('sprite') && !lower.includes('badge');
      });

      const uniqueImages = [...new Set(foundImages)];

      res.json({
        name,
        price,
        image: uniqueImages[0] || '',
        additionalImages: uniqueImages.slice(1, 15),
        specifications: {},
        category: 'Uncategorized',
        textContent
      });

    } catch (error: any) {
      console.error("[Playwright Error]", error.message);
      res.status(500).json({ error: "Playwright scrape failed: " + error.message });
    } finally {
      if (browser) await browser.close();
    }
  });

  // Scrape product via URL (Original refined version)
  app.post("/api/scrape-product", async (req, res) => {
    const { url } = req.body;
    if (!url || !url.startsWith('http')) return res.status(400).json({ error: "Valid URL is required" });

    try {
      console.log(`[Scrape] Processing URL: ${url}`);
      const response = await axios.get(url, { 
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Referer': 'https://www.google.com/',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
          'Sec-Ch-Ua-Mobile': '?0',
          'Sec-Ch-Ua-Platform': '"Windows"',
        }
      });
      const html = response.data;
      const $ = cheerio.load(html);
      
      // Selectors attempt to cover Amazon, Flipkart, and Asus
      const name = $('h1').first().text().trim() || $('title').text().trim();
      
      const price = $('.a-price .a-offscreen').first().text().trim() || 
                    $('.price').first().text().trim() || 
                    $('._30jeq3').first().text().trim() || 'Unknown';
                    
      const brand = $('a#bylineInfo').text().trim() || $('.brand').text().trim() || 'Unknown';
      
      const description = $('meta[name="description"]').attr('content') || '';
      
      const images: string[] = [];
      $('img[src]').each((_, el) => {
          const src = $(el).attr('src');
          if (src && (src.includes('http') || src.startsWith('/'))) {
              images.push(src);
          }
      });
      const uniqueImages = [...new Set(images)];

      const specs: { [key: string]: string } = {};
      $('table tr').each((_, el) => {
          const key = $(el).find('th, td:first-child').text().trim();
          const value = $(el).find('td:last-child').text().trim();
          if (key && value) specs[key] = value;
      });

      res.json({
        name,
        price,
        brand,
        description,
        image: uniqueImages[0] || '',
        additionalImages: uniqueImages.slice(1, 5),
        specifications: specs,
        category: 'Uncategorized'
      });
    } catch (error: any) {
      console.error("[Scrape Error]", error);
      res.status(500).json({ error: "Scrape failed" });
    }
  });

  // Scrape product via Firecrawl
  app.post("/api/firecrawl-scrape", async (req, res) => {
    const { url } = req.body;
    if (!url || !url.startsWith('http')) return res.status(400).json({ error: "Valid URL is required" });

    if (!firecrawl) {
      return res.status(503).json({ error: "Firecrawl is not configured. Please set FIRECRAWL_API_KEY." });
    }

    try {
      console.log(`[Firecrawl] Scraping URL: ${url}`);
      // Use scrape with schema for structured data
      const scrapeResult = await firecrawl.scrape(url, {
        formats: [{
            type: "json",
            schema: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    price: { type: "string" },
                    brand: { type: "string" },
                    description: { type: "string" },
                    image: { type: "string" },
                    additionalImages: { 
                        type: "array", 
                        items: { type: "string" } 
                    },
                    specifications: { 
                        type: "object",
                        description: "All technical specifications found on the page. Be exhaustive. Include Processor, RAM, GPU, Storage, Display, Battery, OS, ports, dimensions, and weight.",
                        properties: {
                            processor: { type: "string" },
                            ram: { type: "string" },
                            graphics: { type: "string" },
                            storage: { type: "string" },
                            display: { type: "string" },
                            battery: { type: "string" },
                            os: { type: "string" },
                            weight: { type: "string" },
                            ports: { type: "string" },
                            warranty: { type: "string" }
                        }
                    },
                    category: { type: "string" },
                    modelNumber: { type: "string" },
                    sku: { type: "string" }
                },
                required: ["name", "price"]
            }
        }]
      }) as any;

      if (!scrapeResult) {
        throw new Error("Firecrawl failed to return a result");
      }

      // If use Firecrawl succeeded, it returns the Document with json property
      res.json(scrapeResult.json || scrapeResult);
    } catch (error: any) {
      console.error("[Firecrawl Error]", error);
      res.status(500).json({ error: "Firecrawl scrape failed: " + (error.message || "Unknown error") });
    }
  });

  // Fallback for missing API routes to ensure they return JSON, not HTML

  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.path}` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
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
