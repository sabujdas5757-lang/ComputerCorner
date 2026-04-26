import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Client, Storage, ID } from "node-appwrite";
import { InputFile } from "node-appwrite/file";
import multer from "multer";
import cors from "cors";
import 'dotenv/config';
import axios from 'axios';
import * as cheerio from 'cheerio';

async function startServer() {
  const app = express();
  const PORT = 3000;
  
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Appwrite configuration
  const client = new Client()
    .setEndpoint(process.env.APPWRITE_ENDPOINT || "")
    .setProject(process.env.APPWRITE_PROJECT_ID || "")
    .setKey(process.env.APPWRITE_API_KEY || "");
  const storage = new Storage(client);

  const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 } 
  }).single('file');

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

  // API proxy for appwrite images
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

  app.post("/api/upload-file", (req, res) => {
    console.log("POST /api/upload-file received");
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        console.error("Multer Error:", err);
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      } else if (err) {
        console.error("Unknown Upload Error:", err);
        return res.status(500).json({ error: `Unknown upload error: ${err.message}` });
      }
      
      try {
        const file = req.file;
        if (!file) {
          console.log("No file in request");
          return res.status(400).json({ error: "No file uploaded" });
        }
        
        console.log("Starting Appwrite upload...");

        if (!process.env.APPWRITE_BUCKET_ID) {
           return res.status(500).json({ error: "APPWRITE_BUCKET_ID is not configured." });
        }

        const inputFile = InputFile.fromBuffer(file.buffer, file.originalname || 'image.png');

        const result = await storage.createFile(process.env.APPWRITE_BUCKET_ID, ID.unique(), inputFile);
        
        const fileUrl = `/api/images/${result.$id}`;
        
        console.log("Appwrite upload successful:", fileUrl);
        res.json({ secure_url: fileUrl });
        
      } catch (error: any) {
        console.error("Server API upload error:", error);
        res.status(500).json({ error: error.message });
      }
    });
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
