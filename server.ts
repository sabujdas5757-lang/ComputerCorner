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
import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import chromiumSparticuz from '@sparticuz/chromium';

chromium.use(stealthPlugin());

const app = express();
const PORT = 3000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

  app.post("/api/scrape-amazon-search", async (req, res) => {
    let hasResponded = false;
    const { query: searchQuery } = req.body;
    
    if (!searchQuery) {
      return res.status(400).json({ error: "Search query is required" });
    }
    
    const url = `https://www.amazon.in/s?k=${encodeURIComponent(searchQuery)}`;
    console.log(`[Search Scraper] SCRAPING_START: "${searchQuery}"`);
    
    try {
      let html = '';
      const fetchMethods = [
        // Method 0: Scraper API (If configured)
        async () => {
           const apiKey = req.body.scraperApiKey || process.env.SCRAPER_API_KEY || "5d5e88487260af181c9730311f19d12a";
           if (!apiKey) throw new Error("SCRAPER_API_KEY is not configured");
           console.log("[Search Scraper] Attempting Scraper API...");
           let apiUrl = `https://api.scraperapi.com?api_key=${apiKey}&premium=true&url=${encodeURIComponent(url)}`;
           if (url.includes('.in/')) {
               apiUrl += '&country_code=in';
           }
           const response = await axios.get(apiUrl, { 
             timeout: 50000,
             maxContentLength: 5000000
           });
           return typeof response.data === 'string' ? response.data : '';
        },
        // Method 1: Jina AI (Most reliable)
        async () => {
           console.log("[Search Scraper] Attempting M1 (Jina)...");
           const response = await axios.get(`https://r.jina.ai/${url}`, { 
             headers: { 'X-Return-Format': 'html', 'Accept': 'text/html' },
             timeout: 8000,
             maxContentLength: 5000000
           });
           return typeof response.data === 'string' ? response.data : '';
        },
        // Method 2: Googlebot UA
        async () => {
           console.log("[Search Scraper] Attempting M2 (Direct/Googlebot)...");
           const response = await axios.get(url, { 
             headers: { 
               'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
               'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
               'Accept-Language': 'en-US,en;q=0.5'
             },
             timeout: 8000,
             maxContentLength: 5000000
           });
           return typeof response.data === 'string' ? response.data : '';
        }
      ];

      // Sequential execution to prevent OOM crashes (which cause the "Starting Server..." page)
      for (let i = 0; i < fetchMethods.length; i++) {
        try {
          const res = await fetchMethods[i]();
          if (res && res.length > 500 && (res.includes('s-result-item') || res.includes('s-main-slot') || res.includes('aria-label="Results"'))) {
            if (!res.includes('Robot Check')) {
              html = res;
              console.log(`[Search Scraper] Method ${i + 1} Success! Content size: ${res.length}`);
              break;
            }
          }
          console.warn(`[Search Scraper] Method ${i + 1} returned invalid content or Robot Check.`);
        } catch (e: any) {
          console.warn(`[Search Scraper] Method ${i + 1} failed: ${e.message}`);
        }
      }

      if (!html) {
        hasResponded = true;
        return res.status(503).json({ 
          error: "Amazon detection is active. Your search was throttled. Please try a more specific search term (e.g., 'Asus Vivobook Ryzen 5') or try again in a few minutes." 
        });
      }

      const $ = cheerio.load(html);
      const results: any[] = [];

      $('.s-result-item').each((_, el) => {
        const $el = $(el);
        const asin = $el.attr('data-asin');
        if (!asin) return;

        let title = $el.find('h2 a span').first().text().trim();
        if (!title) title = $el.find('.a-size-medium.a-color-base.a-text-normal').first().text().trim();
        
        let price = $el.find('.a-price-whole').first().text().trim();
        let symbol = $el.find('.a-price-symbol').first().text().trim() || '₹';
        
        let image = $el.find('.s-image').attr('src');
        let rating = $el.find('.a-icon-star-small .a-icon-alt, .a-icon-star .a-icon-alt').first().text().trim();
        let reviews = $el.find('.a-size-small .a-link-normal .a-size-base').first().text().trim();
        
        const path = $el.find('h2 a').attr('href');
        const link = path ? (path.startsWith('http') ? path : 'https://www.amazon.in' + path) : '';

        if (title && (price || image)) {
          results.push({ title, price: price ? `${symbol}${price}` : 'Check Price', image, rating, reviews, url: link, asin });
        }
      });

      console.log(`[Search Scraper] SUCCESS: Found ${results.length} items.`);
      hasResponded = true;
      res.json({ results });
    } catch (error: any) {
      console.error("[Search Scraper Error]", error.message);
      if (!hasResponded) {
        res.status(500).json({ error: "Internal scraper failure: " + error.message });
      }
    }
  });

  app.post("/api/scrape-flipkart-search", async (req, res) => {
    const { query: searchQuery } = req.body;
    if (!searchQuery) return res.status(400).json({ error: "Search query is required" });
    
    // Using a simpler URL or Jina AI to bypass basic blocks
    const url = `https://www.flipkart.com/search?q=${encodeURIComponent(searchQuery)}`;
    console.log(`[Flipkart Search] SCRAPING: "${searchQuery}"`);
    
    try {
      let html = '';
      try {
        console.log("[Flipkart Search] Attempting Playwright...");
        const executablePath = await chromiumSparticuz.executablePath();
        const browser = await chromium.launch({ 
            executablePath,
            args: chromiumSparticuz.args,
            headless: true
        });
        try {
          const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
          });
          const page = await context.newPage();
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => console.log('Goto err:', e.message));
          await page.waitForTimeout(2000).catch(() => {});
          html = await page.content();
          await browser.close().catch(() => {});
          if (html.length < 5000 || html.includes('captcha') || html.includes('Robot Check')) {
            throw new Error(`Flipkart blocked Playwright (HTML size: ${html.length})`);
          }
        } catch (e) {
          await browser.close();
          throw e;
        }
      } catch (pwError) {
        console.log("[Flipkart Search] Playwright failed, falling back...");
        try {
          const response = await axios.get(`https://r.jina.ai/${url}`, { 
            headers: { 'X-Return-Format': 'html' },
            timeout: 10000 
          });
          html = response.data;
        } catch (e) {
          const direct = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            timeout: 10000
          });
          html = direct.data;
        }
      }

      const $ = cheerio.load(html);
      const results: any[] = [];

      $('div._1AtVbE, div._2k06S3, div._4dd8fX, div._1xHGtK, div._13oc-S, div[data-id]').each((_, el) => {
        const $el = $(el);
        let title = $el.find('div._4rR01T, a.s1Q9rs, a.IRpwTa, div.y6766L, div._2Wk9S9').first().text().trim();
        let price = $el.find('div._30jeq3, div._3ut_uV, div._16016e').first().text().trim();
        let image = $el.find('img._396cs4, img._2puEPr, img._2r_T1I').attr('src');
        let path = $el.find('a._1fQY7K, a.s1Q9rs, a._2rpwqI, a.IRpwTa').attr('href');
        
        if (!path && $(el).is('a')) path = $(el).attr('href');

        const link = path ? (path.startsWith('http') ? path : 'https://www.flipkart.com' + path) : '';

        if (title && (price || image)) {
          results.push({ title, price, image, url: link, store: 'Flipkart' });
        }
      });

      res.json({ results: results.filter((v, i, a) => a.findIndex(t => t.url === v.url) === i) });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/scrape-asus-search", async (req, res) => {
    const { query: searchQuery } = req.body;
    if (!searchQuery) return res.status(400).json({ error: "Search query is required" });
    
    const url = `https://store.asus.com/in/catalogsearch/result/?q=${encodeURIComponent(searchQuery)}`;
    
    try {
      let html = '';
      try {
        console.log("[Asus Search] Attempting Playwright...");
        const executablePath = await chromiumSparticuz.executablePath();
        const browser = await chromium.launch({ 
            executablePath,
            args: chromiumSparticuz.args,
            headless: true
        });
        try {
          const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
          });
          const page = await context.newPage();
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => console.log('Goto err:', e.message));
          await page.waitForTimeout(2000).catch(() => {});
          html = await page.content();
          await browser.close().catch(() => {});
          if (html.length < 5000 || html.includes('captcha') || html.includes('Robot Check')) {
            throw new Error(`Asus blocked Playwright (HTML size: ${html.length})`);
          }
        } catch (e) {
          await browser.close();
          throw e;
        }
      } catch (pwError) {
        console.log("[Asus Search] Playwright failed, falling back...");
        try {
          const response = await axios.get(`https://r.jina.ai/${url}`, { timeout: 12000 });
          html = response.data;
        } catch (e) {
          const direct = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
            timeout: 10000
          });
          html = direct.data;
        }
      }

      const $ = cheerio.load(html);
      const results: any[] = [];

      $('li.item.product.product-item, div.product-item-info').each((_, el) => {
        const $el = $(el);
        const title = $el.find('.product-item-link').text().trim();
        const price = $el.find('.price').first().text().trim();
        const image = $el.find('.product-image-photo').attr('src');
        const link = $el.find('.product-item-link').attr('href');

        if (title && link) {
          results.push({ title, price, image, url: link, store: 'Asus' });
        }
      });

      res.json({ results });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/scrape-product", async (req, res) => {
    const { url, scraperApiKey } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });
    console.log(`[Scraper] START: ${url.substring(0, 50)}...`);
    
    try {
      let html = '';
      
      const fetchMethodsMap = [
        // Method 0: Playwright (Full DOM render)
        async () => {
          console.log("[Scraper] Attempting Method 0 (Playwright)...");
          const executablePath = await chromiumSparticuz.executablePath();
          const browser = await chromium.launch({ 
            executablePath,
            args: chromiumSparticuz.args,
            headless: true
          });
          try {
            const context = await browser.newContext({
              userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
            });
            const page = await context.newPage();
            // Block heavy non-essential resources to speed up but keep scripts for DOM building
            await page.route('**/*', async (route) => {
              try {
                const type = route.request().resourceType();
                if (['media', 'font', 'websocket'].includes(type) || 
                    (type === 'image' && !route.request().url().includes('images'))) {
                  await route.abort().catch(() => {});
                } else {
                  await route.continue().catch(() => {});
                }
              } catch (e) {}
            });
            
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => console.log('Goto err:', e.message));
            await page.waitForTimeout(4000).catch(() => {}); // Allow time for Vue/React to render specs and descriptions
            
            // Expand all content (Amazon 'See more', Flipkart 'Read more', etc)
            try {
              const expandButtons = await page.$$('text="Read more", text="Read More", text="Show more", text="See more"');
              for (const btn of expandButtons) {
                 if (await btn.isVisible()) {
                    await btn.click({ timeout: 1000 }).catch(() => {});
                 }
              }
              await page.waitForTimeout(1000);
            } catch (e) {}

            const html = await page.content();
            await browser.close();
            return html;
          } catch (e) {
             await browser.close();
             throw e;
          }
        }
      ];

      // Sequential fetch to prevent OOM
      for (let i = 0; i < fetchMethodsMap.length; i++) {
        try {
          console.log(`[Scraper] Attempting Method ${i + 1}...`);
          const fetchedData = await fetchMethodsMap[i]();
          if (fetchedData && typeof fetchedData === 'object' && !fetchedData.includes && !fetchedData.error) {
             // ScraperAPI AutoParse / Spider returned JSON directly!
             console.log(`[Scraper] Success with Method ${i + 1} (JSON)`);
             
             // Format price from ScraperAPI format
             let parsedPrice = fetchedData.pricing || fetchedData.price || '';
             if (parsedPrice) parsedPrice = String(parsedPrice).replace(/[^0-9.]/g, '');
             
             return res.json({
               name: fetchedData.name || fetchedData.title || '',
               price: `₹${parsedPrice}`,
               oldPrice: fetchedData.list_price || fetchedData.oldPrice || '',
               discount: '',
               image: (fetchedData.images && fetchedData.images.length > 0) ? fetchedData.images[0] : fetchedData.image || '',
               additionalImages: fetchedData.images ? fetchedData.images.slice(1, 4) : [],
               brand: fetchedData.brand || 'Unknown',
               category: fetchedData.category || '',
               description: fetchedData.description || fetchedData.full_description || '',
               specifications: fetchedData.product_information || fetchedData.specifications || {},
               usageTags: []
             });
          }
          if (fetchedData && typeof fetchedData === 'string' && fetchedData.includes('<html') && !fetchedData.includes('Robot Check') && fetchedData.length > 500) {
            if (fetchedData.includes('503 - Service Unavailable') || fetchedData.includes('503 Service Unavailable') || fetchedData.includes('captcha')) {
              console.warn(`[Scraper] Method ${i + 1} returned a blocked/error page. Skipping.`);
              continue;
            }
            html = fetchedData;
            console.log(`[Scraper] Success with Method ${i + 1}`);
            break;
          }
        } catch (e: any) {
          console.warn(`[Scraper] Method ${i + 1} failed: ${e.message}`);
          if (e.response && e.response.status === 404) {
             console.warn(`[Scraper] 404 Not Found received from Amazon. Throwing directly.`);
             throw new Error("This product does not exist on Amazon (404 Page Not Found).");
          }
        }
      }

      if (!html) {
        console.error("[Scraper] ALL product fetch methods failed.");
        throw new Error("The website is currently blocking extraction. Please try one more time or add details manually.");
      }

      const $ = cheerio.load(html);
      
      let ldName, ldPrice, ldBrand, ldImage, ldDescription;
      try {
        const ldJsonStr = $('script[type="application/ld+json"]').html();
        if (ldJsonStr) {
          const ldData = JSON.parse(ldJsonStr);
          const pData = Array.isArray(ldData) ? ldData[0] : ldData;
          if (pData) {
            ldName = pData.name;
            ldPrice = pData.offers?.price;
            ldBrand = pData.brand?.name;
            ldDescription = pData.description;
            if (pData.image) {
              ldImage = Array.isArray(pData.image) ? pData.image[0] : pData.image;
            }
          }
        }
      } catch(e) {}

      const name = ldName || $('meta[property="og:title"]').attr('content') || 
                   $('.B_NuE7, .yhBndX, .sku-title, .product-item-name, h1').first().text().trim() || 
                   $('title').text() || 'Unknown Product';
      
      if (name && (name.includes('503') || name.includes('Service Unavailable') || name.includes('Page Not Found') || name === 'Unknown Product' || name.includes('Robot Check'))) {
          console.error(`[Scraper] Parsed name is ${name}. This means the scrape failed or the page isn't a product.`);
          throw new Error(`The target website returned an error page or invalid content (${name}). Please add details manually.`);
      }
      
      const priceRaw = ldPrice ? String(ldPrice) : ($('meta[property="product:price:amount"]').attr('content') || 
                  $('[itemprop="price"]').attr('content') ||
                  $('.Nx9bqj._4b5DiR, ._30jeq3._16016e, .price, .product-price, .amount, .a-price-whole, ._30jeq3, ._16016e, .Nx9bqj').first().text());

      const formatPrice = (p: string | undefined) => {
        if (!p) return '';
        let cleaned = String(p).replace(/[^0-9.]/g, '');
        if (!cleaned || cleaned === '.' || cleaned === '0') return '₹0.00';
        
        const num = parseFloat(cleaned);
        if (isNaN(num)) return p;
        
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(num);
      };

      const cleanedPrice = formatPrice(priceRaw);
      const oldPriceText = $('.old-price, .a-text-strike, del').first().text();
      const oldPrice = formatPrice(oldPriceText);
      
      const image = ldImage || $('meta[property="og:image"]').attr('content') || 
                    $('meta[name="twitter:image"]').attr('content') ||
                    $('img[itemprop="image"]').attr('src') ||
                    $('.DByoCore img, ._396cs4, .product-image-photo, #landingImage, #imgBlkFront').first().attr('src');
                    
      const additionalImages: string[] = [];
      if (ldImage) additionalImages.push(ldImage);
      const imageSelectors = ['img._2r_T1I', 'img.q6DClP', '.product-image-thumbs img', '.altImages img', '.a-button-thumbnail img', '#altImages img', '.a-dynamic-image', '.product-image-gallery img', '.thumbnail img'];
      
      $(imageSelectors.join(', ')).each((_, el) => {
        let srcRaw = $(el).attr('src') || $(el).attr('data-old-hires') || $(el).attr('data-src') || $(el).attr('data-a-dynamic-image');
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
                    
      const description = ldDescription || $('meta[property="og:description"]').attr('content') || 
                          $('meta[name="description"]').attr('content') ||
                          $('.y_m6H_, ._1mXo7f, #feature-bullets, .product-info-main-content, ._21l_82, #product-description').first().text().trim();
      
      const category = $('meta[property="product:category"]').attr('content') || 
                       $('.nav-a-content, ._2whKao').first().text().trim() || '';

      const discount = $('.Uk_O9r, .savingsPercentage, .discount, .badge').first().text().trim();
      
      const specifications: Record<string, string> = {};
      
      const parseSpecRow = (_: any, el: any) => {
        const key = $(el).find('td:nth-child(1), ._1hAy30, .label, th').first().text().trim();
        const value = $(el).find('td:nth-child(2), ._21l_82, .value, td').last().text().trim();
        
        if (key && value && key !== value && !key.toLowerCase().includes('customer reviews')) {
          const cleanKey = key.replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\n/g, ' ').trim();
          const cleanVal = value.replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/\n/g, ' ').trim();
          if (cleanKey.length > 1 && cleanKey.length < 100) {
            specifications[cleanKey] = cleanVal;
          }
        }
      };

      $('#productDetails_techSpec_section_1 tr, #productDetails_techSpec_section_2 tr, tr._1s_Z6p, tr._1-M87M, div._14cfVK tr, ._1Kndrq, ._2RngUh tr, table.spec-table tr, table.a-keyvalue tr, #productOverview_feature_div tr').each(parseSpecRow);

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

      let brand = ldBrand || $('meta[property="product:brand"]').attr('content') || 
                    $('[itemprop="brand"] [itemprop="name"]').text().trim() ||
                    $('[itemprop="brand"]').text().trim() || 
                    $('#bylineInfo').text().trim() || 
                    specifications['Brand'] || 
                    specifications['Brand Name'] || '';

      if (brand) {
         if (brand.toLowerCase().startsWith('visit the ')) {
            brand = brand.replace(/visit the /i, '').replace(/ store/i, '').trim();
         }
         if (brand.toLowerCase().startsWith('brand: ')) {
            brand = brand.replace(/brand: /i, '').trim();
         }
      } else {
         brand = name.split(" ")[0] || 'Unknown';
      }

      // Fallback spec extraction from title if specs are empty
      if (Object.keys(specifications).length === 0) {
        if (name.includes('Intel Core')) specifications['Processor Name'] = 'Intel Core ' + (name.match(/Intel Core (i[3579]|Ultra \w+ \w+)/)?.[1] || '');
        if (name.includes('Ryzen')) specifications['Processor Name'] = 'AMD Ryzen ' + (name.match(/Ryzen \d \d{4}U?/)?.[0] || '');
        if (name.includes('Apple M')) specifications['Processor Name'] = name.match(/Apple M\d( Pro| Max)?/)?.[0] || '';
        
        const ramMatch = name.match(/(\d+\s*GB)\s*(RAM|LPDDR|DDR)/i) || name.match(/\((\d+\s*GB)\//);
        if (ramMatch) specifications['RAM'] = ramMatch[1];
        
        const ssdMatch = name.match(/(\d+\s*(GB|TB))\s*SSD/i);
        if (ssdMatch) specifications['SSD'] = ssdMatch[1];
        
        const osMatch = name.match(/(Windows 11|Windows 10|Mac OS)/i);
        if (osMatch) specifications['Operating System'] = osMatch[1];
        
        if (name.includes('Thin and Light')) specifications['Type'] = 'Thin and Light Laptop';
        if (name.includes('Gaming')) specifications['Type'] = 'Gaming Laptop';
      }

      console.log(`[Scraper] Successfully parsed: ${name}`);
      res.json({ name, price: cleanedPrice, oldPrice, image, additionalImages, description, brand, category, discount, specifications });
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

export default app;
