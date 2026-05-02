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
import { GoogleGenAI } from "@google/genai";

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

// Global Logging Middleware
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.originalUrl} - Content-Type: ${req.headers['content-type']}`);
  next();
});

// Define API Routes first
const apiRouter = express.Router();

apiRouter.post("/scrape-product", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });
  console.log(`[Scraper] Processing URL: ${url}`);
  
  try {
    let productData: any = null;
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

    // If direct fetch succeeded, extract initial data
    if (html && html.includes('<html')) {
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

      productData = { 
        name, 
        price: priceRaw, 
        oldPrice: oldPriceText, 
        image, 
        additionalImages, 
        description, 
        brand, 
        category, 
        discount, 
        specifications 
      };
    }

    // If direct fetch was blocked, OR it's Amazon (often messy), use Magic AI as primary or refiner
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && (!productData || isAmazon || !productData.name || productData.name === 'Unknown Product')) {
      console.log(`[Scraper] Invoking Magic AI Scraper for ${isAmazon ? 'Amazon refinement' : 'fallback'}...`);
      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        Extract product details from this URL: ${url}
        ${productData ? `Use this partially extracted data as an anchor: ${JSON.stringify(productData)}` : 'The website blocked direct automated access, so use your internal knowledge and search tools to find the specifics.'}
        
        Focus on:
        1. Clean, professional product name.
        2. Accurate price in INR (₹).
        3. Detailed technical specifications.
        4. High-resolution main image URL.
        
        Return ONLY a JSON object:
        {
          "name": "string",
          "brand": "string",
          "category": "string",
          "description": "string",
          "price": "string (e.g. ₹45,990)",
          "oldPrice": "string",
          "discount": "string",
          "image": "string (URL)",
          "additionalImages": ["URL_strings"],
          "specifications": {"key": "value"}
        }
      `;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }],
          toolConfig: { includeServerSideToolInvocations: true }
        }
      });

      if (aiResponse.text) {
        const aiData = JSON.parse(aiResponse.text);
        productData = { ...productData, ...aiData };
      }
    }

    if (!productData || !productData.name) {
      throw new Error("Could not extract any product details from this URL.");
    }

    console.log(`[Scraper] Finalized extraction for: ${productData.name}`);
    res.json(productData);
  } catch (error: any) {
    console.error("[Scraper Error]", error.message);
    res.status(500).json({ error: error.message });
  }
});

apiRouter.post("/upload-from-url", async (req, res) => {
  const { url } = req.body;
  if (!url || !url.startsWith('http')) return res.status(400).json({ error: "Valid URL is required" });

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.warn("[Upload-From-URL] BLOB_READ_WRITE_TOKEN is missing.");
    return res.status(503).json({ error: "Vercel Blob storage is not configured." });
  }

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
    const buffer = Buffer.from(response.data);
    const contentType = response.headers['content-type'] as string || 'image/jpeg';
    
    const rawFilename = url.split('/').pop()?.split(/[#?]/)[0] || 'scraped-image.jpg';
    const filename = rawFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: contentType,
      addRandomSuffix: true
    });

    res.json({ secure_url: blob.url });
  } catch (error: any) {
    console.error("[Upload-From-URL Error]", error.message);
    res.status(500).json({ error: "Storage error: " + error.message });
  }
});

const uploadMiddleware = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } 
});

apiRouter.post("/upload-file", uploadMiddleware.single('file'), async (req, res) => {
  try {
    const file = (req as any).file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(503).json({ error: "Vercel Blob storage is not configured." });
    }

    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const blob = await put(sanitizedName, file.buffer, {
      access: 'public',
      contentType: file.mimetype,
      addRandomSuffix: true
    });

    res.json({ secure_url: blob.url });
  } catch (error: any) {
    console.error("[Upload Error]", error.message);
    res.status(500).json({ error: "Upload failed: " + error.message });
  }
});

apiRouter.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

apiRouter.get("/storage-status", (req, res) => {
  res.json({ 
    configured: !!process.env.BLOB_READ_WRITE_TOKEN,
    provider: "Vercel Blob",
    aiConfigured: !!process.env.GEMINI_API_KEY,
    message: process.env.BLOB_READ_WRITE_TOKEN ? "Storage is ready" : "BLOB_READ_WRITE_TOKEN is missing"
  });
});

// Mounted at /api
app.use("/api", apiRouter);

// Fallback for missing API routes
app.all("/api/*", (req, res) => {
  res.status(404).json({ error: `API route not found: ${req.method} ${req.path}` });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);
    
    app.get('*', async (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      
      try {
        const url = req.originalUrl;
        const indexPath = path.resolve(process.cwd(), 'index.html');
        
        if (!fs.existsSync(indexPath)) {
          return res.status(404).send("Internal Error: Application entry point missing");
        }

        let template = fs.readFileSync(indexPath, 'utf-8');
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
    app.get('*', (req, res) => {
      if (req.path.startsWith('/api')) return res.status(404).json({ error: "API route not found" });
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started on 0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to initialize server application:", err);
});

export default app;
