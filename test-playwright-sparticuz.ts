import { chromium } from "playwright-core";
import chromiumSparticuz from "@sparticuz/chromium";

(async () => {
    try {
        console.log("Attempting Playwright with Sparticuz...");
        const executablePath = await chromiumSparticuz.executablePath();
        console.log("Using executable path:", executablePath);
        const browser = await chromium.launch({
            executablePath: executablePath,
            args: chromiumSparticuz.args,
            headless: true
        });
        console.log("Browser launched!");
        const page = await browser.newPage();
        await page.goto("https://example.com");
        console.log("Navigated to example.com");
        await browser.close();
    } catch (e) {
        console.error("Browser error", e);
    }
})();
