import { expect, test } from "@playwright/test";

// Metadata, data terstruktur, sitemap, robots, dan gambar Open Graph.
// Cukup diuji sekali: isinya tidak bergantung pada ukuran layar.

test.describe("SEO", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "Cukup diuji sekali");
  });

  test("beranda punya canonical, hreflang, dan Open Graph per bahasa", async ({
    page,
  }) => {
    await page.goto("/en");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/en$/,
    );
    for (const [lang, path] of [
      ["id", /\/id$/],
      ["en", /\/en$/],
      ["x-default", /\/id$/],
    ] as const) {
      await expect(
        page.locator(`link[rel="alternate"][hreflang="${lang}"]`),
      ).toHaveAttribute("href", path);
    }
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute(
      "content",
      "en_US",
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /\/en\/opengraph-image/,
    );
  });

  test("halaman proyek memakai canonical dan gambar OG-nya sendiri", async ({
    page,
    request,
  }) => {
    await page.goto("/id/projects/borrowit");
    await expect(page).toHaveTitle("BorrowIt | Luthfi Adi Harianto");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/id\/projects\/borrowit$/,
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      "content",
      "article",
    );
    const image = await page
      .locator('meta[property="og:image"]')
      .getAttribute("content");
    expect(image).toMatch(/\/id\/projects\/borrowit\/opengraph-image/);
    const response = await request.get(image!);
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toBe("image/png");
  });

  test("beranda memuat JSON-LD Person", async ({ page }) => {
    await page.goto("/id");
    const raw = await page
      .locator('script[type="application/ld+json"]')
      .textContent();
    const person = JSON.parse(raw ?? "{}");
    expect(person).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Luthfi Adi Harianto",
    });
    expect(person.sameAs).toContain("https://github.com/LuthfiAdiHarianto");
    expect(person.knowsAbout.length).toBeGreaterThan(0);
  });

  test("sitemap berisi beranda dan proyek dalam dua bahasa", async ({
    request,
  }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    expect(xml).toContain("/id/projects/borrowit</loc>");
    expect(xml).toContain("/en/projects/borrowit</loc>");
    expect(xml).toMatch(/hreflang="en"/);
    expect(xml).not.toContain("/admin");
  });

  test("robots.txt menutup admin dan menunjuk sitemap", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toContain("Disallow: /admin");
    expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/);
  });

  test("path tanpa awalan bahasa dialihkan, ikon tidak", async ({
    request,
  }) => {
    const project = await request.get("/projects/borrowit", {
      maxRedirects: 0,
    });
    expect(project.status()).toBe(307);
    expect(project.headers()["location"]).toMatch(/\/id\/projects\/borrowit$/);
    for (const path of ["/icon.svg", "/apple-icon", "/sitemap.xml"]) {
      expect((await request.get(path, { maxRedirects: 0 })).status()).toBe(200);
    }
  });
});
