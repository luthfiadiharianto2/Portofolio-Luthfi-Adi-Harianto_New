import { expect, test } from "@playwright/test";

// Audit responsif: enam ukuran wajib ditambah landscape tablet dan layar lipat.
const SIZES = [
  { name: "hp-360", width: 360, height: 640, touch: true },
  { name: "hp-390", width: 390, height: 844, touch: true },
  { name: "tablet-768", width: 768, height: 1024, touch: true },
  { name: "tablet-820", width: 820, height: 1180, touch: true },
  { name: "desktop-1024", width: 1024, height: 768, touch: false },
  { name: "desktop-1440", width: 1440, height: 900, touch: false },
  { name: "tablet-landscape-1180", width: 1180, height: 820, touch: true },
  { name: "lipat-280", width: 280, height: 653, touch: true },
] as const;

const PAGES = ["/id", "/en", "/id/projects/borrowit"] as const;
const MIN_TARGET = 44;

type Issue = { size: string; page: string; problem: string };

test("tata letak rapi di semua ukuran layar", async ({ browser }, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-1440",
    "Audit menjalankan semua ukuran sendiri",
  );
  test.setTimeout(240_000);
  const issues: Issue[] = [];

  for (const size of SIZES) {
    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      isMobile: size.touch,
      hasTouch: size.touch,
    });
    const page = await context.newPage();

    for (const path of PAGES) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");

      const result = await page.evaluate((minTarget) => {
        const viewportWidth = document.documentElement.clientWidth;
        const describe = (element: Element) => {
          const label =
            element.getAttribute("aria-label") ??
            element.textContent?.trim().slice(0, 30) ??
            "";
          return `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""} "${label}"`;
        };
        const isVisible = (element: Element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return (
            style.visibility !== "hidden" &&
            style.display !== "none" &&
            rect.width > 0 &&
            rect.height > 0 &&
            !element.closest(
              '[aria-hidden="true"], .sr-only, [hidden], dialog:not([open])',
            )
          );
        };

        const overflow = document.documentElement.scrollWidth - viewportWidth;

        // Elemen yang keluar dari sisi layar (terpotong). Konten scroll horizontal
        // yang disengaja (galeri, marquee, tablist) dikecualikan lewat leluhurnya.
        const clipped = [
          ...document.querySelectorAll("main *, header *, footer *"),
        ]
          .filter(isVisible)
          .filter((element) => {
            if (
              element.closest(
                ".overflow-x-auto, .marquee, [role='tablist'], .overflow-hidden",
              )
            )
              return false;
            const rect = element.getBoundingClientRect();
            return rect.right > viewportWidth + 1 || rect.left < -1;
          })
          .slice(0, 5)
          .map(describe);

        // Area sentuh: tombol, tautan, tab, dan input yang bisa diklik.
        const small = [
          ...document.querySelectorAll(
            "a[href], button, [role='tab'], input:not([type='hidden']), textarea, select",
          ),
        ]
          .filter(isVisible)
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            return (
              rect.width < minTarget - 0.5 || rect.height < minTarget - 0.5
            );
          })
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return `${describe(element)} ${Math.round(rect.width)}x${Math.round(rect.height)}`;
          });

        return { overflow, clipped, small };
      }, MIN_TARGET);

      if (result.overflow > 0)
        issues.push({
          size: size.name,
          page: path,
          problem: `scroll horizontal ${result.overflow}px`,
        });
      for (const element of result.clipped)
        issues.push({
          size: size.name,
          page: path,
          problem: `terpotong: ${element}`,
        });
      for (const element of result.small)
        issues.push({
          size: size.name,
          page: path,
          problem: `area sentuh kecil: ${element}`,
        });
    }
    await context.close();
  }

  testInfo.annotations.push({
    type: "temuan",
    description: JSON.stringify(issues, null, 2),
  });
  expect(issues).toEqual([]);
});
