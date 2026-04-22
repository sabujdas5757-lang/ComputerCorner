# Computer Corner - Website

This is a modern, high-contrast tech-oriented website for **Computer Corner**, a computer sales and service business in Jhargram.

## Features

- **Dark Theme**: Professional charcoal theme with vibrant green accents.
- **Product Catalog**: Filterable inventory with WhatsApp integration.
- **Service Desk**: Clear communication channels for Sales, Service, and Office.
- **Workshop Logs**: Showcase of technical expertise.
- **AMC Section**: Information on Annual Maintenance Contracts.
- **Responsive Design**: Optimized for mobile, tablet, and desktop.

## Deployment on Vercel

This project is configured for seamless deployment on [Vercel](https://vercel.com/).

### Steps to Deploy:

1. **Connect your Repository**: Push this code to GitHub, GitLab, or Bitbucket.
2. **Import to Vercel**: 
   - Log in to your Vercel account.
   - Click **"Add New"** > **"Project"**.
   - Import your repository.
3. **Configure Build Settings**:
   - Vercel will automatically detect **Vite**.
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variables**:
   - If you use the Gemini AI features, add `GEMINI_API_KEY` to the Environment Variables section in Vercel settings.
5. **Deploy**: Click **"Deploy"**.

### Why `vercel.json`?

We have included a `vercel.json` file to handle **SPA Routing**. This ensures that if you navigate to a sub-route or refresh the page, the server correctly serves the `index.html` file, allowing React Router (if used) or simple hash/path routing to function correctly.

## Development

Run the development server:

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```
