import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import 'dotenv/config';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Cloudinary configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const upload = multer({ storage: multer.memoryStorage() });

  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }
      
      cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        res.json({ secure_url: result?.secure_url });
      }).end(req.file.buffer);
      
    } catch (error: any) {
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
