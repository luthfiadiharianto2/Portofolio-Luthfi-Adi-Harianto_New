import { expect, test } from "@playwright/test";

test.describe("browser berbahasa Indonesia", () => {
  test.use({ locale: "id-ID" });

  test("akar situs diarahkan ke /id", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/id$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
  });
});

test.describe("browser berbahasa Inggris", () => {
  test.use({ locale: "en-US" });

  test("akar situs diarahkan ke /en", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/en$/);
  });
});

test.describe("bahasa browser lain", () => {
  test.use({ locale: "ja-JP" });

  test("akar situs memakai bahasa default id", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/id$/);
  });
});

test("versi Inggris tersedia di /en", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("link", { name: "View Projects" })).toBeVisible();
});

test("tidak ada scroll horizontal", async ({ page }) => {
  await page.goto("/id");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("tautan lewati ke konten muncul saat difokuskan", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Navigasi keyboard diuji di desktop");
  await page.goto("/id");
  await page.keyboard.press("Tab");
  const skip = page.getByRole("link", { name: "Lewati ke konten" });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
});

test("rute yang tidak ada menampilkan 404", async ({ page }) => {
  const response = await page.goto("/id/tidak-ada");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { name: "Halaman tidak ditemukan" }),
  ).toBeVisible();
});
