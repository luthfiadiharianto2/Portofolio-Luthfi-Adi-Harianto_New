import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// robots.txt: semua halaman publik boleh dirayapi, area admin dan API tidak.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
