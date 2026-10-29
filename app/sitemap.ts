import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getProjectSitemapEntries } from "@/lib/data/content";
import { absoluteUrl } from "@/lib/seo";

// sitemap.xml: beranda dan setiap proyek terbit, dalam semua bahasa, lengkap dengan
// tautan hreflang antarbahasa. Diperbarui bersama tag cache "projects".
const entry = (
  path: string,
  options: Omit<MetadataRoute.Sitemap[number], "url" | "alternates">,
): MetadataRoute.Sitemap =>
  routing.locales.map((locale) => ({
    url: absoluteUrl(`/${locale}${path}`),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((item) => [item, absoluteUrl(`/${item}${path}`)]),
      ),
    },
    ...options,
  }));

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjectSitemapEntries();
  const latest = projects
    .map((project) => project.updated_at)
    .sort()
    .at(-1);

  return [
    ...entry("", {
      lastModified: latest,
      changeFrequency: "monthly",
      priority: 1,
    }),
    ...projects.flatMap((project) =>
      entry(`/projects/${project.slug}`, {
        lastModified: project.updated_at,
        changeFrequency: "yearly",
        priority: 0.8,
      }),
    ),
  ];
}
