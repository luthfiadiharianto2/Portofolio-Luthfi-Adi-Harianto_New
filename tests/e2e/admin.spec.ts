import { expect, test } from "@playwright/test";

// Tanpa sesi: semua halaman panel dialihkan ke /admin/login, dan halaman login tidak
// pernah memanggil Supabase untuk isian yang tidak valid. Alur setelah login butuh akun
// admin sungguhan, jadi diuji lewat kebijakan RLS di tests/db.

test.describe("admin tanpa sesi", () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(
      !["desktop-1440", "hp-360"].includes(testInfo.project.name),
      "Cukup satu layar lebar dan satu HP",
    );
  });

  for (const path of [
    "/admin",
    "/admin/projects",
    "/admin/projects/new",
    "/admin/guestbook",
    "/admin/messages",
  ]) {
    test(`${path} dialihkan ke halaman masuk`, async ({ page }) => {
      const response = await page.goto(path);
      await expect(page).toHaveURL(/\/admin\/login$/);
      expect(response?.headers()["cache-control"]).toContain("no-store");
      await expect(
        page.getByRole("heading", { level: 1, name: "Masuk" }),
      ).toBeVisible();
    });
  }

  test("halaman masuk tidak diindeks dan tidak dilokalkan", async ({
    page,
  }) => {
    await page.goto("/admin/login");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    await expect(page.locator("html")).toHaveAttribute("lang", "id");
    await expect(page.getByRole("navigation")).toHaveCount(0);
  });

  test("email tidak valid ditolak dan isian tetap ada", async ({ page }) => {
    await page.goto("/admin/login");
    const email = page.getByLabel("Email admin");
    await email.fill("bukan-email");
    await page.getByRole("button", { name: "Kirim tautan masuk" }).click();
    await expect(
      page.getByText("Masukkan alamat email yang valid."),
    ).toBeVisible();
    await expect(email).toHaveValue("bukan-email");
    await expect(email).toHaveAttribute("aria-invalid", "true");
  });

  test("tautan masuk yang tidak valid kembali ke halaman masuk", async ({
    page,
  }) => {
    await page.goto("/admin/auth/callback?code=palsu");
    await expect(page).toHaveURL(/\/admin\/login\?galat=tautan$/);
    await expect(
      page.getByRole("alert").filter({ hasText: "Tautan masuk tidak valid" }),
    ).toBeVisible();
  });
});
