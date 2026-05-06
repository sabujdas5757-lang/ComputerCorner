import { chromium } from "playwright";

(async () => {
    const url = `https://www.flipkart.com/search?q=laptop`;
    try {
        console.log("[Flipkart Search] Attempting Playwright...");
        const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        try {
          const context = await browser.newContext({
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
          });
          const page = await context.newPage();
          await page.route('**/*', (route) => {
            const type = route.request().resourceType();
            if (['media', 'font', 'websocket', 'image'].includes(type) && !route.request().url().includes('images')) {
                // Modified abort logic just in case image abort was failing
              route.abort();
            } else {
              route.continue();
            }
          });
          await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
          await page.waitForTimeout(2000);
          const html = await page.content();
          console.log("HTML:", html.substring(0, 1000));
          console.log("Loaded page length", html.length);
          await browser.close();
        } catch (e) {
          console.log("Browser error", e);
        }
      } catch (pwError) {
        console.log("PW Error", pwError);
      }
})();
