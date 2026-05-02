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
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
const PORT = 3000;

const genAI = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY" 
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) 
  : null;

async function startServer() {
  // Supabase Configuration (Used for any other future client needs)
  const rawSupabaseUrl = process.env.SUPABASE_URL || "https://zrvduoxsaqtiixsknpnv.supabase.co";
  let supabaseUrl = rawSupabaseUrl.split('/rest/v1')[0].split('/storage/v1')[0].replace(/\/+$/, "");
  const supabaseKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpydmR1b3hzYXF0aWl4c2tucG52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjg3MjksImV4cCI6MjA5MjcwNDcyOX0.hfM5tjamYmPKe9t2way_tm0fVQMdnG980u4K_HWUPso";
  const supabaseBucket = process.env.SUPABASE_BUCKET || "products";

  const supabase = supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;
  
  // Initialize body parsers early
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Debug logging for all requests
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      console.log(`[API REQUEST] ${req.method} ${req.path}`);
    }
    next();
  });

  // Dedicated API Router to ensure routes are grouped and checked first
  const apiRouter = express.Router();

  apiRouter.post("/scrape-product", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });
    console.log(`[Scrapy Spider] Initiating crawl for: ${url}`);
    
    try {
      let html = '';
      
      // Diverse spider profiles to bypass Amazon bot detection
      const spiderProfiles = [
        {
          name: "Chrome Windows",
          ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0'
          }
        },
        {
          name: "Safari Mac",
          ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Safari/605.1.15',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-GB,en;q=0.9',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none'
          }
        },
        {
          name: "Mobile iPhone",
          ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4.1 Mobile/15E148 Safari/604.1',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.google.com/'
          }
        },
        {
          name: "Edge Windows",
          ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none'
          }
        }
      ];

      // Scrapy-style download loop with profile rotation
      for (let i = 0; i < spiderProfiles.length; i++) {
        const profile = spiderProfiles[i];
        try {
          console.log(`[Scrapy Spider] Attempt ${i+1}/${spiderProfiles.length} using ${profile.name}...`);
          
          // Download delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));
          
          const response = await axios.get(url, {
            timeout: 25000,
            maxRedirects: 15, // High redirect limit for Amazon shortlinks
            headers: { 
              'User-Agent': profile.ua,
              ...profile.headers
            },
            validateStatus: (status) => status < 500 
          });
          
          const isJsonResponse = response.headers['content-type']?.includes('application/json');
          const responseData = response.data;
          html = typeof responseData === 'string' ? responseData : JSON.stringify(responseData);
          
          // Anti-bot check
          const isBlocked = html && (
            html.includes('Robot Check') || 
            html.includes('To discuss automated access') || 
            html.includes('captcha') ||
            html.includes('/errors/validateCaptcha')
          );
          
          // Detection: Amazon sometimes returns a JSON 404/Error for bot-detected redirects
          const isExplicitError = isJsonResponse && (response.status === 404 || (responseData && (responseData.code === '404' || responseData.message)));
          
          const isInvalid = !html || html.length < 2000 || !html.includes('<html');

          if (html && !isBlocked && !isInvalid && !isExplicitError) {
            console.log(`[Scrapy Spider] Success! Extracted ${html.length} bytes.`);
            break;
          } else {
            console.log(`[Scrapy Spider] Profile ${profile.name} failed: ${isBlocked ? 'Blocked' : (isExplicitError ? 'Gatekeeper Rejected' : 'Incomplete HTML')}. Rotating...`);
            html = '';
          }
        } catch (error: any) {
          console.warn(`[Scrapy Spider] Profile ${profile.name} failed: ${error.message}`);
        }
      }

      if (!html || !html.includes('<html')) {
        return res.status(403).json({ error: "Target website (Amazon) blocked all spider attempts. Please manually enter product details." });
      }

      const $ = cheerio.load(html);
      
      // Extraction logic (Same as before but wrapped in AI check)
      let aiResult: any = null;
      if (genAI) {
        try {
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const bodyText = $('body').text().replace(/\s+/g, ' ').substring(0, 10000); 
          
          const prompt = `Act as an expert Scrapy parser. Extract from this HTML text:
          ${bodyText}
          
          JSON schema:
          {
            "name": "Title",
            "price": "₹Value",
            "oldPrice": "₹MRP",
            "brand": "Brand",
            "category": "Category",
            "description": "3-4 sentence summary",
            "specifications": {"key": "value"}
          }`;

          const result = await model.generateContent(prompt);
          const responseText = result.response.text();
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) aiResult = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.warn("[Scrapy Spider] AI extraction skipped:", (e as Error).message);
        }
      }

      // Final dataset assembly
      const name = aiResult?.name || $('title').text().trim().split('|')[0].trim();
      const priceRaw = aiResult?.price || $('.a-price-whole').first().text() || $('[itemprop="price"]').attr('content');
      const image = $('meta[property="og:image"]').attr('content') || $('#landingImage').attr('src');
      
      const specifications = aiResult?.specifications || {};
      if (Object.keys(specifications).length === 0) {
        $('.po-row').each((_, el) => {
          const k = $(el).find('.a-span3').text().trim();
          const v = $(el).find('.a-span9').text().trim();
          if (k && v) specifications[k] = v;
        });
      }

      res.json({
        name,
        price: priceRaw || '₹0',
        oldPrice: aiResult?.oldPrice || '',
        image,
        description: aiResult?.description || '',
        brand: aiResult?.brand || 'Generic',
        category: aiResult?.category || 'Electronics',
        specifications,
        aiUsed: !!aiResult
      });

    } catch (error: any) {
      console.error("[Scrapy Spider Error]", error.message || error);
      res.status(500).json({ error: String(error.message || error || "Unknown scraping error") });
    }
  });

  // RESTORED: Proxy-save an external image to Vercel Blob
  apiRouter.post("/upload-from-url", async (req, res) => {
    const { url } = req.body;
    if (!url || !url.startsWith('http')) return res.status(400).json({ error: "Valid URL is required" });

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn("[Upload-From-URL] BLOB_READ_WRITE_TOKEN is missing.");
      return res.status(503).json({ error: "Cloud storage is not configured (missing token)." });
    }

    try {
      console.log(`[Upload-From-URL] Fetching external asset: ${url.substring(0, 50)}...`);
      const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
      const buffer = Buffer.from(response.data);
      const contentType = response.headers['content-type'] || 'image/jpeg';
      
      const rawFilename = url.split('/').pop()?.split(/[#?]/)[0] || 'scraped-image.jpg';
      const filename = rawFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
      const blob = await put(filename, buffer, {
        access: 'public',
        contentType: String(contentType),
        addRandomSuffix: true
      });

      console.log(`[Upload-From-URL] Saved to cloud: ${blob.url}`);
      res.json({ secure_url: blob.url });
    } catch (error: any) {
      console.error("[Upload-From-URL Error]", error.message || error);
      res.status(500).json({ error: "Storage error: " + (error.message || "Unknown error") });
    }
  });

  const uploadMiddleware = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } 
  });

  // RESTORED: Direct file upload to Vercel Blob
  apiRouter.post("/upload-file", uploadMiddleware.single('file'), async (req, res) => {
    try {
      const file = (req as any).file;
      if (!file) return res.status(400).json({ error: "No file uploaded" });

      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        return res.status(503).json({ error: "Cloud storage is not configured." });
      }

      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
      const blob = await put(sanitizedName, file.buffer, {
        access: 'public',
        contentType: file.mimetype,
        addRandomSuffix: true
      });

      res.json({ secure_url: blob.url });
    } catch (error: any) {
      console.error("[Upload Error]", error.message || error);
      res.status(500).json({ error: String(error.message || "Upload failed") });
    }
  });

  apiRouter.get("/storage-status", (req, res) => {
    res.json({ 
      configured: !!process.env.BLOB_READ_WRITE_TOKEN,
      provider: "Vercel Blob"
    });
  });

  apiRouter.get("/health", (req, res) => res.json({ status: "ok" }));

  // Mount API router FIRST before anything else
  app.use("/api", apiRouter);

  // Fallback for missing API routes to prevent landing on HTML
  app.all("/api/*", (req, res) => {
    res.status(404).json({ error: `API route not found: ${req.method} ${req.path}` });
  });

  // Vite/SPA middleware comes AFTER API routes
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom", // Reverted to custom for more control over SPA fallback
    });
    app.use(vite.middlewares);
    
    app.get('*', async (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      try {
        const url = req.originalUrl;
        const indexPath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).send(template);
      } catch (e: any) {
        if (vite) vite.ssrFixStacktrace(e);
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
      
      // Safety: Don't serve index.html for assets that are missing (prevent MIME type errors)
      if (req.path.includes('.') && 
          !req.path.endsWith('.html') && 
          !req.path.startsWith('/assets/')) {
        return res.status(404).end();
      }
      
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Start listening (Cloud Run needs this, Vercel doesn't)
  if (!process.env.VERCEL) {
    try {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`[Spider Engine] Server active on port ${PORT}`);
      });
    } catch (listenError) {
      console.error("Critical error starting server:", listenError);
    }
  }
}

// Global error handler for the app
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Global Error]', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

startServer().catch(err => {
  console.error("Failed to initialize spider application:", err);
});

export default app;
