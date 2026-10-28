import { expect, test } from "@playwright/test";

// Chromium headless memakai renderer perangkat lunak (SwiftShader). Kanvas 3D mendeteksinya
// saat dibuat lalu mundur ke tampilan statis; ?3d=force melewati pemeriksaan itu.
// three.js menandai kanvas WebGL-nya dengan atribut data-engine.
const WEBGL_CANVAS = "canvas[data-engine]";

test.describe("tampilan cadangan statis", () => {
  test("tanpa GPU: kartu statis tampil dan tidak ada kanvas 3D", async ({
    page,
  }) => {
    await page.goto("/id");
    await expect(
      page.getByRole("img", { name: "Kartu identitas Luthfi Adi Harianto" }),
    ).toBeVisible();
    await expect(page.getByTestId("id-card-3d")).toHaveCount(0);
    // Kanvas dibuat dulu lalu dilepas setelah renderer perangkat lunak terdeteksi.
    await expect(page.locator(WEBGL_CANVAS)).toHaveCount(0, {
      timeout: 15_000,
    });
    await expect(page.getByRole("status").filter({ hasText: "%" })).toHaveCount(
      0,
      { timeout: 2000 },
    );
  });

  test.describe("gerak dikurangi", () => {
    test.use({ reducedMotion: "reduce" });

    test("tetap statis walau 3D dipaksa", async ({ page }) => {
      await page.goto("/id?3d=force");
      await expect(page.getByTestId("id-card-3d")).toHaveCount(0);
      await expect(page.locator("canvas")).toHaveCount(0);
      await expect(page.getByText("Luthfi Adi Harianto").first()).toBeVisible();
    });
  });
});

test.describe("adegan 3D", () => {
  // Render perangkat lunak lambat bila banyak tes berjalan paralel.
  test.describe.configure({ timeout: 60_000 });
  test.skip(
    ({ isMobile }) => isMobile,
    "Render SwiftShader terlalu lambat untuk semua ukuran; cukup di desktop",
  );

  test("memuat kanvas bintang dan kartu ID yang tersembunyi dari pembaca layar", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/id?3d=force");
    await expect(page.getByTestId("id-card-3d").locator("canvas")).toBeAttached(
      { timeout: 15_000 },
    );
    await expect(page.locator("canvas")).toHaveCount(2);
    // R3F memasang aria-hidden di pembungkus kanvas; cukup ada leluhur yang menyembunyikannya.
    const hidden = await page
      .locator("canvas")
      .evaluateAll((canvases) =>
        canvases.map(
          (canvas) => canvas.closest('[aria-hidden="true"]') !== null,
        ),
      );
    expect(hidden).toEqual([true, true]);
    // touch-action efektif adalah irisan elemen dan leluhurnya: pan-y di pembungkus R3F
    // membuat scroll vertikal tetap jalan di atas kanvas.
    const touchActions = await page
      .getByTestId("id-card-3d")
      .locator("canvas")
      .evaluate((canvas) => {
        const values: string[] = [];
        for (
          let node: Element | null = canvas;
          node && values.length < 3;
          node = node.parentElement
        ) {
          values.push(getComputedStyle(node).touchAction);
        }
        return values;
      });
    expect(touchActions).toContain("pan-y");
    expect(touchActions).not.toContain("none");
    expect(errors).toEqual([]);
  });

  test("preloader tersembunyi paling lambat detik ke-4", async ({ page }) => {
    await page.goto("/id?3d=force");
    const preloader = page.getByRole("status").filter({ hasText: "%" });
    await page.waitForFunction(() => performance.now() > 4100);
    await expect(preloader).toBeHidden({ timeout: 100 });
  });

  test("kartu bisa diseret tanpa galat", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/id?3d=force");
    const card = page.getByTestId("id-card-3d");
    await expect(card.locator("canvas")).toBeAttached({ timeout: 15_000 });
    await page.waitForFunction(() => performance.now() > 5000);
    const box = await card.boundingBox();
    if (!box) throw new Error("Kanvas kartu tidak ditemukan");
    const x = box.x + box.width / 2;
    const y = box.y + box.height * 0.72;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x - 150, y - 40, { steps: 8 });
    await page.mouse.up();
    expect(errors).toEqual([]);
  });
});
