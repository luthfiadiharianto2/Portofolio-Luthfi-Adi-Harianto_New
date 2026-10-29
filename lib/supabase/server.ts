import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { publicEnv } from "@/lib/env";
import type { Database } from "./database.types";

// Klien dengan sesi pengguna (cookie). Hanya untuk admin: membaca cookie membuat render
// bergantung pada permintaan, jadi jangan dipakai di halaman publik yang di-cache.
export const createSessionClient = async () => {
  // Prefetch runtime boleh membaca cookie, tetapi klien Supabase memakai Date.now() untuk
  // memeriksa token, dan itu tidak boleh terjadi saat prerender. connection() menghentikan
  // prerender di sini, sehingga sesi hanya dibaca saat permintaan sungguhan.
  await connection();
  const cookieStore = await cookies();
  return createServerClient<Database>(
    publicEnv.supabaseUrl,
    publicEnv.supabasePublishableKey,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component tidak bisa menulis cookie; proxy.ts yang memperbarui sesi.
          }
        },
      },
    },
  );
};
