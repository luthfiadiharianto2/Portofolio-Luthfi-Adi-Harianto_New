import { expect, test } from "@playwright/test";

const ROLES_STATIC =
  "Desainer UI/UX · Pengembang Frontend · Analis Data · Quality Assurance";

test.describe("gerak dikurangi", () => {
  test.use({ reducedMotion: "reduce" });

  test("menampilkan versi statis penuh", async ({ page }) => {
    await page.goto("/id");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText(ROLES_STATIC)).toBeVisible();
    await expect(page.locator(".cursor-follower")).toHaveCount(0);
    const marquee = page.locator(".marquee-track").first();
    await expect(marquee).toHaveCSS("animation-name", "none");
    // Kartu di bawah layar tidak disembunyikan untuk dianimasikan.
    const card = page.locator("#contact [data-reveal]").first();
    await expect(card).toHaveCSS("opacity", "1");
  });
});

test.describe("animasi", () => {
  test.skip(
    ({ isMobile }) => isMobile,
    "Efek pointer dan kursor khusus desktop",
  );

  test("teks peran mengetik bergantian", async ({ page }) => {
    await page.goto("/id");
    const typed = page.locator("#home .text-gradient-primary").last();
    await expect(typed).toHaveText("Desainer UI/UX");
    await expect(typed).not.toHaveText("Desainer UI/UX", { timeout: 6000 });
  });

  test("kursor pengikut muncul dan konten muncul saat di-scroll", async ({
    page,
  }) => {
    await page.goto("/id");
    await page.waitForLoadState("networkidle");
    const reveal = page.locator("#contact [data-reveal]").first();
    // Setelah modul adegan dimuat, elemen di bawah layar menunggu untuk dianimasikan.
    await expect
      .poll(async () =>
        Number(await reveal.evaluate((el) => getComputedStyle(el).opacity)),
      )
      .toBeLessThan(1);
    await page.mouse.move(400, 300);
    await page.mouse.move(420, 320);
    await expect(page.locator(".cursor-follower")).toHaveCount(1);
    await reveal.scrollIntoViewIfNeeded();
    await expect(reveal).toHaveCSS("opacity", "1", { timeout: 4000 });
  });

  test("konten yang belum muncul tetap bisa dicapai dengan keyboard", async ({
    page,
  }) => {
    await page.goto("/id");
    await page.waitForLoadState("networkidle");
    const details = page.getByRole("link", { name: /Details BorrowIt/ });
    await details.focus();
    await expect(details).toBeFocused();
  });
});
