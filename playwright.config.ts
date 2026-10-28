import { defineConfig } from "@playwright/test";

const PORT = 3100;

// Enam ukuran layar wajib dari spesifikasi.
const viewports = [
  { name: "hp-360", width: 360, height: 640, isMobile: true, hasTouch: true },
  { name: "hp-390", width: 390, height: 844, isMobile: true, hasTouch: true },
  {
    name: "tablet-768",
    width: 768,
    height: 1024,
    isMobile: true,
    hasTouch: true,
  },
  {
    name: "tablet-820",
    width: 820,
    height: 1180,
    isMobile: true,
    hasTouch: true,
  },
  {
    name: "desktop-1024",
    width: 1024,
    height: 768,
    isMobile: false,
    hasTouch: false,
  },
  {
    name: "desktop-1440",
    width: 1440,
    height: 900,
    isMobile: false,
    hasTouch: false,
  },
] as const;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
    browserName: "chromium",
  },
  projects: viewports.map(({ name, width, height, isMobile, hasTouch }) => ({
    name,
    use: { viewport: { width, height }, isMobile, hasTouch },
  })),
  webServer: {
    command: `pnpm start --port ${PORT}`,
    url: `http://localhost:${PORT}/id`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
