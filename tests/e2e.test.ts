import puppeteer from "puppeteer";

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("Starting Puppeteer tests...\n");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  let passed = 0;
  let failed = 0;

  const test = async (name: string, fn: () => Promise<boolean>) => {
    try {
      const result = await fn();
      if (result) {
        console.log(`✓ ${name}`);
        passed++;
      } else {
        console.log(`✗ ${name}`);
        failed++;
      }
    } catch (error) {
      console.log(`✗ ${name} - Error: ${error}`);
      failed++;
    }
  };

  try {
    // Test 1: Homepage loads
    await test("Homepage loads successfully", async () => {
      const response = await page.goto(BASE_URL, { waitUntil: "networkidle0" });
      return response?.status() === 200;
    });

    // Test 2: Check dark background
    await test("Dark background is applied", async () => {
      const bgColor = await page.evaluate(() => {
        return getComputedStyle(document.body).backgroundColor;
      });
      const rgb = bgColor.match(/\d+/g)?.map(Number) || [];
      return rgb.length >= 3 && rgb[0] < 50 && rgb[1] < 50 && rgb[2] < 50;
    });

    // Test 3: Header exists
    await test("Header with name exists", async () => {
      const header = await page.$("h1");
      const text = await page.evaluate((el) => el?.textContent, header);
      return text?.toLowerCase().includes("muhammad") || false;
    });

    // Test 4: Social links are clickable (3 links: GitHub, LinkedIn, Instagram)
    await test("Social links are clickable", async () => {
      const socialLinks = await page.$$("footer a[target='_blank']");
      return socialLinks.length >= 3;
    });

    // Test 5: Portfolio items link correctly
    await test("Portfolio items are clickable links", async () => {
      const links = await page.$$("a[href^='/portfolio']");
      return links.length > 0;
    });

    // Test 6: Notes items link correctly
    await test("Notes items are clickable links", async () => {
      const links = await page.$$("a[href^='/notes']");
      return links.length > 0;
    });

    // Test 7: Canvas items link correctly
    await test("Canvas items are clickable links", async () => {
      const links = await page.$$("a[href^='/canvas']");
      return links.length > 0;
    });

    // Test 8: MDX Portfolio page loads dynamically
    await test("Portfolio MDX page loads (ai-creative-suite-dashboard)", async () => {
      await page.goto(`${BASE_URL}/portfolio/ai-creative-suite-dashboard`, {
        waitUntil: "networkidle0",
      });
      await page.waitForSelector("h1", { timeout: 5000 });
      const title = await page.$("h1");
      const text = await page.evaluate((el) => el?.textContent, title);
      return text?.toLowerCase().includes("ai creative suite") || false;
    });

    // Test 9: MDX Notes page loads dynamically
    await test("Notes MDX page loads (building-with-ai)", async () => {
      await page.goto(`${BASE_URL}/notes/building-with-ai`, {
        waitUntil: "networkidle0",
      });
      await page.waitForSelector("h1", { timeout: 5000 });
      const title = await page.$("h1");
      const text = await page.evaluate((el) => el?.textContent, title);
      return text?.toLowerCase().includes("building with ai") || false;
    });

    // Test 10: Canvas page loads with animation (TSX component)
    await test("Canvas page loads (generative-art-experiments)", async () => {
      await page.goto(`${BASE_URL}/canvas/generative-art-experiments`, {
        waitUntil: "networkidle0",
      });
      // Canvas pages should have a back button
      const backButton = await page.$('a[href="/"]');
      return backButton !== null;
    });

    // Test 11: Canvas page has animated elements (dots)
    await test("Canvas page has animated elements", async () => {
      // Wait a bit for animation to start
      await new Promise(resolve => setTimeout(resolve, 500));
      const hasElements = await page.evaluate(() => {
        const dots = document.querySelectorAll('.dot');
        return dots.length > 0;
      });
      return hasElements;
    });

    // Test 12: Shader playground canvas loads
    await test("Canvas page loads (shader-playground)", async () => {
      await page.goto(`${BASE_URL}/canvas/shader-playground`, {
        waitUntil: "networkidle0",
      });
      const backButton = await page.$('a[href="/"]');
      return backButton !== null;
    });

    // Test 13: Typography studies canvas loads
    await test("Canvas page loads (3d-typography-studies)", async () => {
      await page.goto(`${BASE_URL}/canvas/3d-typography-studies`, {
        waitUntil: "networkidle0",
      });
      const backButton = await page.$('a[href="/"]');
      return backButton !== null;
    });

    // Test 14: Back button works on canvas page
    await test("Back button works on canvas page", async () => {
      await page.goto(`${BASE_URL}/canvas/motion-design-explorations`, {
        waitUntil: "networkidle0",
      });
      await page.waitForSelector('a[href="/"]', { timeout: 5000 });
      await Promise.all([
        page.click('a[href="/"]'),
        page.waitForNavigation({ waitUntil: "domcontentloaded", timeout: 10000 }),
      ]);
      const url = page.url();
      return url === BASE_URL + "/" || url === BASE_URL;
    });

    // Test 15: Footer exists on homepage
    await test("Footer with personal details exists", async () => {
      await page.goto(BASE_URL, { waitUntil: "networkidle0" });
      const footer = await page.$("footer");
      const text = await page.evaluate((el) => el?.textContent, footer);
      return text?.toLowerCase().includes("creative developer") || false;
    });

    // Test 16: Contact email is clickable
    await test("Contact email is clickable", async () => {
      const emailLink = await page.$('a[href^="mailto:"]');
      return emailLink !== null;
    });

    // Test 17: Content columns have scroll capability
    await test("Content columns have scroll capability", async () => {
      const hasScrollableContent = await page.evaluate(() => {
        const scrollableElements = document.querySelectorAll('[class*="overflow-y-auto"]');
        return scrollableElements.length > 0;
      });
      return hasScrollableContent;
    });

    // Test 18: Unknown canvas route shows coming soon
    await test("Unknown canvas route shows coming soon page", async () => {
      await page.goto(`${BASE_URL}/canvas/unknown-animation-12345`, {
        waitUntil: "networkidle0",
      });
      await page.waitForSelector("h1", { timeout: 5000 });
      const content = await page.content();
      return content.toLowerCase().includes("coming soon");
    });

    // Test 19: Particle systems canvas page works
    await test("Canvas page loads (particle-systems-study)", async () => {
      await page.goto(`${BASE_URL}/canvas/particle-systems-study`, {
        waitUntil: "networkidle0",
      });
      const backButton = await page.$('a[href="/"]');
      return backButton !== null;
    });

    // Test 20: Procedural textures canvas page works
    await test("Canvas page loads (procedural-textures)", async () => {
      await page.goto(`${BASE_URL}/canvas/procedural-textures`, {
        waitUntil: "networkidle0",
      });
      const backButton = await page.$('a[href="/"]');
      return backButton !== null;
    });

  } catch (error) {
    console.error("Test suite error:", error);
  }

  await browser.close();

  console.log(`\n${"=".repeat(40)}`);
  console.log(`Tests passed: ${passed}`);
  console.log(`Tests failed: ${failed}`);
  console.log(`Total: ${passed + failed}`);
  console.log(`${"=".repeat(40)}`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
