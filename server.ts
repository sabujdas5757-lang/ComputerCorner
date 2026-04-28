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
    console.log(`[Scraper] Attempting to scrape: ${url}`);
    
    try {
      let response;
      for (let i = 0; i < 3; i++) {
        try {
          response = await axios.get(url, {
            timeout: 15000,
            headers: { 
              'User-Agent': i === 0 
                ? 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
                : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Referer': 'https://www.google.com/',
              'Connection': 'keep-alive',
            }
          });
          break;
        } catch (error: any) {
          console.warn(`[Scraper] Attempt ${i + 1} failed: ${error.message}`);
          if (i === 2) throw error;
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      if (!response || !response.data) {
        throw new Error("No data received from target URL");
      }

      const $ = cheerio.load(response.data);
      
      const name = $('meta[property="og:title"]').attr('content') || $('title').text() || 'Unknown Product';
      let price = $('meta[property="product:price:amount"]').attr('content') || 
                  $('[itemprop="price"]').attr('content') ||
                  $('.price, .product-price, .amount').first().text();
      
      const image = $('meta[property="og:image"]').attr('content') || 
                    $('meta[name="twitter:image"]').attr('content') ||
                    $('img[itemprop="image"]').attr('src');
                    
      const description = $('meta[property="og:description"]').attr('content') || 
                          $('meta[name="description"]').attr('content') ||
                          $('.description, .product-description').first().text();
      
      const cleanedPrice = price ? String(price).replace(/[^0-9.]/g, '') : '0';
      
      console.log(`[Scraper] Successfully parsed: ${name}`);
      res.json({ name, price: cleanedPrice, image, description });
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
