import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { publicEnv } from "@/lib/env";
import type { Database } from "./database.types";

// Memperbarui token sesi admin sebelum halaman dirender (Server Component tidak bisa
// menulis cookie). Respons admin tidak boleh di-cache CDN karena bisa membawa Set-Cookie.
export const updateSession = async (request: NextRequest) => {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    publicEnv.supabaseUrl,
    publicEnv.supabasePublishableKey,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet, headers) => {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            response.headers.set(key, value),
          );
        },
      },
    },
  );

  // Jangan menaruh kode lain di antara pembuatan klien dan getClaims(): getClaims()
  // yang menyegarkan token bila sudah kedaluwarsa.
  const { data } = await supabase.auth.getClaims();

  // Tanpa sesi sama sekali, langsung alihkan ke halaman masuk. Ini hanya jalan pintas;
  // pemeriksaan admin yang sebenarnya ada di lib/admin/auth.ts dan di RLS.
  const { pathname } = request.nextUrl;
  const isPublic =
    pathname === "/admin/login" || pathname.startsWith("/admin/auth/");
  if (!data?.claims && !isPublic) {
    const redirect = NextResponse.redirect(
      new URL("/admin/login", request.nextUrl.origin),
    );
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    response = redirect;
  }

  response.headers.set("Cache-Control", "private, no-store");
  return response;
};
