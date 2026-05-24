import puppeteer from "puppeteer";
import { createHtml } from "../helpers/createHtmlForPDF.js";
let browser = null;
export async function createPDF(data) {
    const browser = await createBrowser();
    const page = await browser.newPage();
    try {
        const html = createHtml(data);
        await page.setContent(html, { waitUntil: "domcontentloaded" });
        const pdfBuffer = Buffer.from(await page.pdf({
            format: "A4",
            printBackground: true,
        }));
        return pdfBuffer;
    }
    finally {
        await page.close();
    }
}
async function createBrowser() {
    if (!browser) {
        browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox"],
        });
        browser.on("disconnected", () => {
            console.log("Browser disconnected");
            browser = null;
        });
    }
    return browser;
}
export function getBrowserInstance() {
    return browser;
}
