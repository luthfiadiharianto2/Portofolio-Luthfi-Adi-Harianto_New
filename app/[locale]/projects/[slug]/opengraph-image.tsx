import { hasLocale } from "next-intl";
import { getProject } from "@/lib/data/content";
import { publicEnv } from "@/lib/env";
import { pick } from "@/lib/localized";
import { imageDataUri, OG_CONTENT_TYPE, OG_SIZE, ogImage } from "@/lib/og";
import { routing } from "@/i18n/routing";
import { SITE_NAME } from "@/lib/seo";

export const alt = `Proyek ${SITE_NAME}`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

// Gambar bagikan per proyek: judul, label, tagline, dan sampul proyek.
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: param, slug } = await params;
  const locale = hasLocale(routing.locales, param)
    ? param
    : routing.defaultLocale;
  const project = await getProject(slug);
  const host = new URL(publicEnv.siteUrl).host;
  if (!project)
    return ogImage({
      eyebrow: "Portfolio",
      title: SITE_NAME,
      subtitle: "",
      footer: host,
    });

  return ogImage({
    eyebrow: pick(project.label, locale),
    title: project.title,
    subtitle: pick(project.tagline, locale),
    footer: `${SITE_NAME} · ${host}`,
    image: await imageDataUri(project.thumbnail),
  });
}
