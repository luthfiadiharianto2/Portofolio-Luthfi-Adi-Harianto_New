import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: supabaseUrl
      ? [new URL(`${supabaseUrl}/storage/v1/object/public/**`)]
      : [],
  },
  experimental: {
    // Foto buku tamu maksimal 1 MB, ditambah ruang untuk overhead multipart.
    serverActions: { bodySizeLimit: "1.1mb" },
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Pesan ICU dikompilasi saat build: parser pesan tidak ikut terkirim ke browser.
const withNextIntl = createNextIntlPlugin({
  experimental: {
    messages: {
      path: "./messages",
      format: "json",
      locales: "infer",
      precompile: true,
    },
  },
});

export default withNextIntl(nextConfig);
