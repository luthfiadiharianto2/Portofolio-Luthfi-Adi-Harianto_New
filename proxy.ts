import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { updateSession } from "./lib/supabase/proxy";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

const isAdminPath = (pathname: string) =>
  pathname === "/admin" || pathname.startsWith("/admin/");

// /admin tidak dilokalkan: hanya sesi Supabase-nya yang diperbarui. Halaman lain lewat
// next-intl (pengalihan ke /id atau /en).
export default function proxy(request: NextRequest) {
  if (isAdminPath(request.nextUrl.pathname)) return updateSession(request);
  return intl(request);
}

export const config = {
  matcher: [
    // Halaman publik: semua path kecuali api, admin, file internal Next/Vercel, dan file
    // bertitik (favicon.ico, dll.)
    "/((?!api|admin|_next|_vercel|.*\..*).*)",
    "/admin",
    "/admin/:path*",
  ],
};
