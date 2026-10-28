import { expect, type Page, test } from "@playwright/test";

const expectNoHorizontalScroll = async (page: Page) => {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
};

test.describe("beranda", () => {
  test("menampilkan semua section dan 9 proyek dari Supabase", async ({
    page,
  }) => {
    await page.goto("/id");
    for (const id of ["home", "about", "portfolio", "contact"]) {
      await expect(page.locator(`section#${id}`)).toBeAttached();
    }
    await expect(page.getByRole("tabpanel").getByRole("article")).toHaveCount(
      9,
    );
    await expect(
      page.getByText("Penyisihan Nasional GEMASTIK 2025").first(),
    ).toBeAttached();
    await expectNoHorizontalScroll(page);
  });

  test("filter kategori menyaring kartu proyek", async ({ page }) => {
    await page.goto("/id");
    const panel = page.getByRole("tabpanel");
    await page.getByRole("button", { name: "QA", exact: true }).click();
    await expect(panel.getByRole("article")).toHaveCount(1);
    await page.getByRole("button", { name: "UI/UX", exact: true }).click();
    await expect(panel.getByRole("article")).toHaveCount(4);
    await page.getByRole("button", { name: "Semua", exact: true }).click();
    await expect(panel.getByRole("article")).toHaveCount(9);
  });

  test("tab bisa dioperasikan dengan keyboard", async ({ page, isMobile }) => {
    test.skip(isMobile, "Navigasi keyboard diuji di desktop");
    await page.goto("/id");
    // Tunggu hidrasi selesai sebelum menekan tombol (penanganan keyboard ada di client).
    await page.waitForLoadState("networkidle");
    const projects = page.getByRole("tab", { name: "Projects" });
    await projects.focus();
    await page.keyboard.press("ArrowRight");
    await expect(page.getByRole("tab", { name: "Certificates" })).toBeFocused();
    await expect(page.getByText("Segera hadir")).toBeVisible();
    await page.keyboard.press("End");
    await expect(page.getByRole("tab", { name: "Tech Stack" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await expect(
      page
        .getByRole("tabpanel", { name: "Tech Stack" })
        .getByText("Scikit-learn"),
    ).toBeVisible();
  });

  test("versi Inggris memakai terjemahan dari database", async ({ page }) => {
    await page.goto("/en");
    await expect(page.getByText("Campus Item Lending Platform")).toBeVisible();
    await expect(
      page
        .getByText("National Preliminary Round (Penyisihan) GEMASTIK 2025")
        .first(),
    ).toBeAttached();
    await expect(page.getByText("National Finalist")).toHaveCount(0);
  });

  test("form kontak menampilkan galat validasi tanpa mengirim", async ({
    page,
  }) => {
    await page.goto("/id");
    const form = page.locator("#contact form").first();
    await form.getByLabel("Nama Anda").fill("A");
    await form.getByLabel("Alamat Email").fill("bukan-email");
    await form.getByRole("button", { name: "Kirim Pesan" }).click();
    await expect(form.getByText("Nama minimal 2 karakter.")).toBeVisible();
    await expect(
      form.getByText("Masukkan alamat email yang valid."),
    ).toBeVisible();
    await expect(form.getByText("Pesan minimal 5 karakter.")).toBeVisible();
  });
});

test.describe("navigasi", () => {
  test("pemilih bahasa pindah ke /en", async ({ page, isMobile }) => {
    await page.goto("/id");
    await page.getByRole("link", { name: "Ganti ke English" }).click();
    await expect(page).toHaveURL(/\/en$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    test.info().annotations.push({
      type: "layar",
      description: isMobile ? "sentuh" : "desktop",
    });
  });

  test("menu HP membuka sheet navigasi", async ({ page, isMobile }) => {
    test.skip(!isMobile, "Hanya di layar sentuh");
    await page.goto("/id");
    const menu = page.getByRole("button", { name: "Buka menu" });
    if (!(await menu.isVisible()))
      test.skip(true, "Layar ini memakai navbar penuh");
    await menu.click();
    const sheet = page.getByRole("dialog", { name: "Navigasi utama" });
    await expect(sheet).toBeVisible();
    await sheet.getByRole("link", { name: "Contact" }).click();
    await expect(sheet).toBeHidden();
    await expect(page).toHaveURL(/#contact$/);
  });
});

test.describe("detail proyek", () => {
  test("menampilkan isi lengkap dan bisa kembali", async ({ page }) => {
    await page.goto("/id/projects/borrowit");
    await expect(
      page.getByRole("heading", { level: 1, name: "BorrowIt" }),
    ).toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Jejak navigasi" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Langkah Pengerjaan" }),
    ).toBeVisible();
    await expect(
      page.locator("ol li").filter({ hasText: "Riset Pengguna" }),
    ).toHaveCount(1);
    await expect(
      page.getByRole("heading", { name: "Technologies Used" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Proyek berikutnya/ }),
    ).toContainText("E-Kost Manager");
    await expectNoHorizontalScroll(page);
    await page.getByRole("link", { name: "Kembali" }).click();
    await expect(page).toHaveURL(/\/id#portfolio$/);
  });

  test("lightbox galeri: buka, panah, dan Esc", async ({ page, isMobile }) => {
    test.skip(isMobile, "Keyboard diuji di desktop");
    await page.goto("/id/projects/spr");
    const opener = page.getByRole("button", {
      name: "Perbesar gambar 1 dari 6",
    });
    await opener.click();
    const lightbox = page.getByRole("dialog", {
      name: "Galeri gambar layar penuh",
    });
    await expect(lightbox).toBeVisible();
    await expect(lightbox.getByText("Gambar 1 dari 6")).toBeVisible();
    await page.keyboard.press("ArrowRight");
    await expect(lightbox.getByText("Gambar 2 dari 6")).toBeVisible();
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    await expect(lightbox.getByText("Gambar 6 dari 6")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(lightbox).toBeHidden();
    await expect(opener).toBeFocused();
  });

  // Dengan Partial Prerendering, kerangka halaman sudah terkirim sebelum notFound()
  // dipanggil, jadi statusnya 200; Next.js menandainya noindex agar tidak diindeks.
  test("slug yang tidak ada menampilkan halaman 404 yang tidak diindeks", async ({
    page,
  }) => {
    await page.goto("/id/projects/tidak-ada");
    await expect(
      page.getByRole("heading", { name: "Halaman tidak ditemukan" }),
    ).toBeVisible();
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      "content",
      /noindex/,
    );
  });
});
