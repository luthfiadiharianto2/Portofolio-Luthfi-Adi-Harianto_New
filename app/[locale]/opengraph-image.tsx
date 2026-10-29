import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { publicEnv } from "@/lib/env";
import { OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";
import { SITE_NAME } from "@/lib/seo";

export const alt = `${SITE_NAME}: UI/UX, frontend, data, QA`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Gambar bagikan beranda per bahasa; juga dipakai halaman lain tanpa gambarnya sendiri.
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: param } = await params;
  const locale = hasLocale(routing.locales, param)
    ? param
    : routing.defaultLocale;
  const t = await getTranslations({ locale, namespace: "Hero" });
  return ogImage({
    eyebrow: "Portfolio",
    title: t("name"),
    subtitle: t("roles").split("|").join(" · "),
    footer: `Telkom University Purwokerto · ${new URL(publicEnv.siteUrl).host}`,
  });
}
