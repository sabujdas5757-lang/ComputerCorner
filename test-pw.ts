import { chromium } from 'playwright';

(async () => {
  try {
    const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    console.log("SUCCESS");
    await browser.close();
  } catch (e) {
    console.error("ERROR:", e);
  }
})();
