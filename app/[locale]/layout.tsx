import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { Footer } from "@/components/sections/footer";
import { Navbar } from "@/components/sections/navbar";
import { MotionRuntime } from "@/components/motion/motion-runtime";
import { TechIconSprite } from "@/components/icons/tech-icon";
import { Starfield } from "@/components/three/starfield";
import { routing } from "@/i18n/routing";
import { publicEnv } from "@/lib/env";
import { openGraphFor, SITE_NAME } from "@/lib/seo";
import { fontVariables } from "../fonts";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Bawaan untuk semua halaman publik. Canonical dan hreflang ditulis per halaman
// (lihat lib/seo.ts), agar halaman detail tidak mewarisi canonical beranda.
export async function generateMetadata(): Promise<Metadata> {
  const [t, locale] = await Promise.all([
    getTranslations("Metadata"),
    getLocale(),
  ]);
  return {
    metadataBase: new URL(publicEnv.siteUrl),
    title: { default: t("title"), template: `%s | ${SITE_NAME}` },
    description: t("description"),
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: publicEnv.siteUrl }],
    creator: SITE_NAME,
    openGraph: openGraphFor(locale, {
      title: t("title"),
      description: t("description"),
      path: "",
    }),
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({
  children,
}: LayoutProps<"/[locale]">) {
  const locale = await getLocale();
  const t = await getTranslations("Common");

  return (
    <html lang={locale} className={fontVariables}>
      <body>
        <TechIconSprite />
        <a
          href="#konten"
          className="fixed top-3 left-3 z-50 -translate-y-24 rounded-control bg-surface px-4 py-3 text-fg transition-transform duration-200 ease-(--ease-standard) focus-visible:translate-y-0"
        >
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider>
          <Starfield />
          <MotionRuntime />
          <Navbar musicUrl={publicEnv.backgroundMusicUrl} />
          <main id="konten" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
