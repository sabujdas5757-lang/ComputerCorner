import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import 'dotenv/config';
import axios from 'axios';
import * as cheerio from 'cheerio';

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(express.json());

  // Cloudinary configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } 
  });

  app.use((req, res, next) => {
    console.log(`REQ: ${req.method} ${req.path}`);
    next();
  });

  app.post("/api/scrape-product", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });
    try {
      let response;
      for (let i = 0; i < 5; i++) {
        try {
          response = await axios.get(url, {
            headers: { 
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5',
              'Referer': 'https://www.google.com/',
              'Connection': 'keep-alive',
              'Upgrade-Insecure-Requests': '1'
            }
          });
          break;
        } catch (error: any) {
          if (i === 4 || (error.response?.status !== 529 && error.response?.status !== 429 && error.response?.status !== 403)) throw error;
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
      const $ = cheerio.load(response!.data);
      
      const name = $('meta[property="og:title"]').attr('content') || $('title').text();
      const price = $('meta[property="product:price:amount"]').attr('content') || $('.price').first().text().trim();
      const image = $('meta[property="og:image"]').attr('content');
      const description = $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content');
      
      res.json({ name, price: price.replace(/[^0-9.]/g, ''), image, description });
    } catch (error: any) {
      console.error("Scraping error:", error);
      if (error.response?.status === 529 || error.response?.status === 429 || error.response?.status === 403) {
        return res.status(500).json({ error: "The target website is blocking automated access. Please paste the details manually." });
      }
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/upload-file", async (req, res) => {
    console.log("POST /api/upload-file received");
    try {
      const { file } = req.body;
      if (!file) {
        console.log("No file in request");
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      console.log("Starting Cloudinary upload...", "preset:", process.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      if (!process.env.VITE_CLOUDINARY_UPLOAD_PRESET) {
         return res.status(500).json({ error: "VITE_CLOUDINARY_UPLOAD_PRESET is not configured." });
      }

      cloudinary.uploader.upload(file, { 
        resource_type: "auto",
        upload_preset: process.env.VITE_CLOUDINARY_UPLOAD_PRESET 
      }, (error, result) => {
        if (error) {
          console.error("Cloudinary error:", error);
          return res.status(500).json({ error: error.message });
        }
        console.log("Cloudinary upload successful:", result?.secure_url);
        res.json({ secure_url: result?.secure_url });
      });
      
    } catch (error: any) {
      console.error("Server API upload error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // API health
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
