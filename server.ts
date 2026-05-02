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
    console.log(`[Scrapy Spider] Crawl Request: ${url}`);
    
    try {
      let html = '';
      
      // Enhanced Scrapy-Style Spider profiles with diverse fingerprints
      const spiderProfiles = [
        {
          ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Sec-Fetch-User': '?1',
            'Cache-Control': 'max-age=0',
            'DNT': '1',
            'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
            'Sec-Ch-Ua-Mobile': '?0',
            'Sec-Ch-Ua-Platform': '"Windows"',
            'Referer': 'https://www.google.com/'
          }
        },
        {
          ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-GB,en;q=0.9',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'same-origin',
            'Referer': 'https://www.bing.com/'
          }
        },
        {
          ua: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://www.google.com/',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
          }
        },
        {
          ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Referer': 'https://www.amazon.in/',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'cross-site'
          }
        }
      ];

      for (let i = 0; i < spiderProfiles.length; i++) {
        const profile = spiderProfiles[i];
        try {
          console.log(`[Scrapy Spider] Profile ${i+1}/${spiderProfiles.length} - Crawling via: ${profile.ua.substring(0, 40)}...`);
          
          // Mimic Scrapy's DOWNLOAD_DELAY - Random wait (200-800ms)
          await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 600));
          
          const response = await axios.get(url, {
            timeout: 25000,
            headers: { 
              'User-Agent': profile.ua,
              ...profile.headers
            },
            validateStatus: (status) => status < 500 
          });
          
          html = response.data;
          
          // Validate content: Scrapy often checks for specific success markers
          const isBlocked = html && (html.includes('Robot Check') || html.includes('To discuss automated access') || html.includes('captcha'));
          const isTooShort = html && typeof html === 'string' && html.length < 2500;

          if (html && typeof html === 'string' && !isBlocked && !isTooShort) {
            console.log(`[Scrapy Spider] Direct Crawl SUCCESS (${html.length} bytes)`);
            break;
          } else {
            console.log(`[Scrapy Spider] Profile ${i+1} ${isBlocked ? 'Blocked' : 'Incomplete'}. Next profile...`);
            html = '';
          }
        } catch (error: any) {
          console.warn(`[Scrapy Spider] Profile ${i+1} attempt failed: ${error.message}`);
        }
      }

      if (!html || !html.includes('<html')) {
        console.error("[Scraper] Spider Engine: All direct profiles blocked.");
        throw new Error("Scrapy Spider blocked by Amazon anti-bot. Please manually enter details or try a different URL.");
      }

      const $ = cheerio.load(html);
      
      // Attempt AI parsing if Gemini is available
      let aiResult: any = null;
      if (genAI) {
        try {
          console.log("[Scrapy Spider] Attempting AI-assisted extraction...");
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          
          // Only send essential parts of HTML to save tokens and avoid noise
          // Amazon often has huge IDs and class names, we prioritize readable text
          const bodyText = $('body').text().replace(/\s+/g, ' ').substring(0, 15000); 
          const titleText = $('title').text();
          
          const prompt = `Act as a professional data scraper (Scrapy-style). Extract product details from this Amazon/E-commerce content:
          Title: ${titleText}
          Content Area: ${bodyText}
          
          Return JSON only with these fields:
          - name (concise, professional product title)
          - price (current price with ₹)
          - oldPrice (original MRP if visible)
          - discount (percentage or amount off)
          - brand (extracted brand name)
          - category (logical store category)
          - description (comprehensive but clean 3-4 sentence feature summary)
          - specificationJson (detailed object of all technical specs found)
          
          Strictly return pure valid JSON. If info is missing, use empty string.`;

          const result = await model.generateContent(prompt);
          const responseText = result.response.text();
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            aiResult = JSON.parse(jsonMatch[0]);
            console.log("[Scrapy Spider] AI extraction successful:", aiResult.name);
          }
        } catch (aiErr: any) {
          if (aiErr.message?.includes('API_KEY_INVALID')) {
             console.error("[Scraper] Gemini API Key is invalid.");
          } else {
             console.warn("[Scraper] AI fallback failed:", aiErr.message);
          }
        }
      }

      const name = aiResult?.name || $('meta[property="og:title"]').attr('content') || $('title').text() || $('h1').first().text().trim() || 'Unknown Product';
      
      const priceRaw = aiResult?.price || $('meta[property="product:price:amount"]').attr('content') || 
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
      const oldPriceText = aiResult?.oldPrice || $('.old-price, .a-text-strike, del').first().text();
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
                    
      const description = aiResult?.description || $('meta[property="og:description"]').attr('content') || 
                          $('meta[name="description"]').attr('content') ||
                          $('.description, .product-description, #feature-bullets').first().text().trim();
      
      let brand = aiResult?.brand || $('meta[property="product:brand"]').attr('content') || 
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

      const category = aiResult?.category || $('meta[property="product:category"]').attr('content') || 
                       $('[itemprop="category"]').attr('content') ||
                       $('.nav-a-content').first().text().trim() || '';

      const discount = aiResult?.discount || $('.savingsPercentage, .discount, .badge').first().text().trim();
      
      const specifications: Record<string, string> = aiResult?.specificationJson || {};
      
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
      res.json({ name, price: cleanedPrice, oldPrice, image, additionalImages, description, brand, category, discount, specifications, aiUsed: !!aiResult });
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
      appType: "spa", // Changed from custom to spa for better standard behavior
    });
    app.use(vite.middlewares);
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
