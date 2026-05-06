import { chromium } from "playwright-extra";
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
chromium.use(stealthPlugin());

(async () => {
    try {
        console.log("Attempting Playwright...");
        const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        console.log("Browser launched!");
        await browser.close();
    } catch (e) {
        console.error("Browser error", e);
    }
})();
