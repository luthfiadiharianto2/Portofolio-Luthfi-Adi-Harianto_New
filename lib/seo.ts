import type { Metadata } from "next";
import type { Locale } from "next-intl";
import { routing } from "@/i18n/routing";
import { publicEnv } from "@/lib/env";

export const SITE_NAME = "Luthfi Adi Harianto";

const OG_LOCALE: Record<Locale, string> = { id: "id_ID", en: "en_US" };

/** URL absolut situs untuk path tertentu (sitemap, JSON-LD). */
export const absoluteUrl = (path: string) =>
  new URL(path, publicEnv.siteUrl).toString();

/**
 * Canonical dan hreflang untuk path yang sama di setiap bahasa. `path` tanpa awalan
 * bahasa, misalnya "" (beranda) atau "/projects/borrowit". x-default ke bahasa bawaan.
 */
export const localeAlternates = (
  locale: Locale,
  path: string,
): Metadata["alternates"] => ({
  canonical: `/${locale}${path}`,
  languages: {
    ...Object.fromEntries(
      routing.locales.map((item) => [item, `/${item}${path}`]),
    ),
    "x-default": `/${routing.defaultLocale}${path}`,
  },
});

/** Open Graph lengkap untuk satu halaman (Next tidak menggabungkan openGraph induk). */
export const openGraphFor = (
  locale: Locale,
  {
    title,
    description,
    path,
    type = "website",
  }: {
    title: string;
    description: string;
    path: string;
    type?: "website" | "article";
  },
): Metadata["openGraph"] => ({
  type,
  siteName: SITE_NAME,
  title,
  description,
  url: `/${locale}${path}`,
  locale: OG_LOCALE[locale],
  alternateLocale: routing.locales
    .filter((item) => item !== locale)
    .map((item) => OG_LOCALE[item]),
});
