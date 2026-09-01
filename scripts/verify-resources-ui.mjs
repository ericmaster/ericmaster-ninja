import { chromium } from "playwright";
import { resolve } from "path";

const ARTIFACTS_DIR = "/home/ericmaster/.gemini/antigravity-ide/brain/97a350bb-2176-479d-988e-cb39ddb73b7f";
const BASE_URL = "http://127.0.0.1:4321";

async function run() {
  console.log("Launching local browser...");
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // ── 1. Desktop Test ──────────────────────────────────────────────
    console.log("1. Testing Desktop (1280x800)...");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/resources/`, { waitUntil: "networkidle" });

    // Verify page title
    const title = await page.title();
    console.log(`Page title: ${title}`);

    // Verify sections order
    const projectHeading = await page.$("#projects h3");
    const cheatsheetHeading = await page.$("#cheatsheets h3");
    console.log("Projects heading text:", await projectHeading?.innerText());
    console.log("Cheatsheets heading text:", await cheatsheetHeading?.innerText());

    // Verify project cards count
    const projectCards = await page.$$("#projects article");
    console.log(`Found ${projectCards.length} project cards in #projects`);

    // Verify cheatsheet cards count
    const cheatsheetCards = await page.$$("#cheatsheets .grid > div");
    console.log(`Found ${cheatsheetCards.length} cheatsheet cards in #cheatsheets`);

    // Verify sticky nav exists
    const nav = await page.$("nav[aria-label='Resource categories navigation']");
    console.log("Sticky nav present:", !!nav);

    // Take Desktop Screenshots
    await page.screenshot({
      path: resolve(ARTIFACTS_DIR, "desktop_resources_top.png"),
    });

    // Scroll to projects
    await page.locator("#projects").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: resolve(ARTIFACTS_DIR, "desktop_resources_projects.png"),
    });

    // Scroll to cheatsheets
    await page.locator("#cheatsheets").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: resolve(ARTIFACTS_DIR, "desktop_resources_cheatsheets.png"),
    });

    // Full page screenshot
    await page.screenshot({
      path: resolve(ARTIFACTS_DIR, "desktop_resources_full.png"),
      fullPage: true,
    });

    // ── 2. Test Mobile Viewport ───────────────────────────────────────
    console.log("2. Testing Mobile (375x667)...");
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${BASE_URL}/resources/`, { waitUntil: "networkidle" });

    await page.screenshot({
      path: resolve(ARTIFACTS_DIR, "mobile_resources_top.png"),
    });

    await page.locator("#projects").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: resolve(ARTIFACTS_DIR, "mobile_resources_projects.png"),
    });

    await page.locator("#cheatsheets").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: resolve(ARTIFACTS_DIR, "mobile_resources_cheatsheets.png"),
    });

    await page.screenshot({
      path: resolve(ARTIFACTS_DIR, "mobile_resources_full.png"),
      fullPage: true,
    });

    // ── 3. Test Spanish Page ──────────────────────────────────────────
    console.log("3. Testing Spanish /es/resources/...");
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${BASE_URL}/es/resources/`, { waitUntil: "networkidle" });
    await page.screenshot({
      path: resolve(ARTIFACTS_DIR, "desktop_es_resources.png"),
    });

    console.log("✅ All visual verifications completed successfully!");
  } finally {
    await page.close();
    await browser.close();
  }
}

run().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
