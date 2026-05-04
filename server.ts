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

import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

// Initialize AI SDK at top level
const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
if (!apiKey) {
    console.error("CRITICAL: GEMINI_API_KEY or GOOGLE_API_KEY is not set in the server environment.");
} else {
    // SECURITY NOTE: Only log the first few characters
    console.log("DEBUG: API_KEY value check:", apiKey.substring(0, 5));
}
// Initialize the AI SDK
const ai = null;


const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function startServer() {
  // Supabase Configuration (Used for any other future client needs)
  const rawSupabaseUrl = process.env.SUPABASE_URL || "https://zrvduoxsaqtiixsknpnv.supabase.co";
  let supabaseUrl = rawSupabaseUrl.split('/rest/v1')[0].split('/storage/v1')[0].replace(/\/+$/, "");
  const supabaseKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydmR1b3hzYXF0aWl4c2tucG52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjg3MjksImV4cCI6MjA5MjcwNDcyOX0.hfM5tjamYmPKe9t2way_tm0fVQMdnG980u4K_HWUPso";
  const supabaseBucket = process.env.SUPABASE_BUCKET || "products";

  const firecrawlApiKey = process.env.FIRECRAWL_API_KEY || "fc-41fffa08d219415a98e026b53da7a8e4";
  const firecrawl = firecrawlApiKey ? new FirecrawlApp({ apiKey: firecrawlApiKey }) : null;

  const supabase = supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
  
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));


  app.use((req, res, next) => {
    console.log(`REQ: ${req.method} ${req.path}`);
    next();
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
    console.log(`[Storage] Check requested. Token present: ${!!process.env.BLOB_READ_WRITE_TOKEN}`);
    res.json({ 
      configured: !!process.env.BLOB_READ_WRITE_TOKEN,
      provider: "Vercel Blob",
      message: process.env.BLOB_READ_WRITE_TOKEN ? "Storage is ready" : "BLOB_READ_WRITE_TOKEN is missing in environment variables"
    });
  });


  // Scrape product via URL
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
