import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { expect, type Page, test } from "@playwright/test";

// Anggaran JavaScript dari spesifikasi, diukur dari build produksi (.next/static).
const INITIAL_BUDGET_KB = 200;
const THREE_D_BUDGET_KB = 600;

const gzipKb = (paths: string[]) =>
  paths.reduce(
    (total, path) =>
      total +
      gzipSync(readFileSync(`.next${path.replace(/^\/_next/, "")}`)).length,
    0,
  ) / 1024;

const scriptsLoaded = async (page: Page, url: string, waitMs: number) => {
  const scripts = new Set<string>();
  page.on("response", (response) => {
    const { pathname } = new URL(response.url());
    if (pathname.startsWith("/_next/static/") && pathname.endsWith(".js"))
      scripts.add(pathname);
  });
  await page.goto(url, { waitUntil: "load" });
  const initial = [...scripts];
  await page.waitForTimeout(waitMs);
  return { initial, all: [...scripts] };
};

test.describe("anggaran JavaScript", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-1440", "Cukup diukur sekali");
  });
  test.describe.configure({ timeout: 60_000 });

  test(`JS awal ≤ ${INITIAL_BUDGET_KB} kB gzip`, async ({ page }) => {
    const { initial } = await scriptsLoaded(page, "/id", 0);
    const size = gzipKb(initial);
    test.info().annotations.push({
      type: "JS awal",
      description: `${size.toFixed(1)} kB gzip`,
    });
    expect(size).toBeLessThanOrEqual(INITIAL_BUDGET_KB);
  });

  test(`potongan 3D ≤ ${THREE_D_BUDGET_KB} kB gzip`, async ({ browser }) => {
    // Pembanding: halaman tanpa WebGL sama sekali, sehingga potongan 3D tidak pernah dimuat.
    const noWebgl = await browser.newPage();
    await noWebgl.addInitScript(() => {
      Reflect.deleteProperty(window, "WebGLRenderingContext");
      Reflect.deleteProperty(window, "WebGL2RenderingContext");
    });
    const plain = await scriptsLoaded(noWebgl, "/id", 4000);
    const forced = await scriptsLoaded(
      await browser.newPage(),
      "/id?3d=force",
      10_000,
    );
    const threeD = forced.all.filter((path) => !plain.all.includes(path));
    const size = gzipKb(threeD);
    test.info().annotations.push({
      type: "Potongan 3D",
      description: `${size.toFixed(1)} kB gzip`,
    });
    expect(threeD.length).toBeGreaterThan(0);
    expect(size).toBeLessThanOrEqual(THREE_D_BUDGET_KB);
  });
});
