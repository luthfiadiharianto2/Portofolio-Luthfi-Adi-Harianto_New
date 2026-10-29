import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { publicEnv } from "@/lib/env";
import type { Database } from "./database.types";

// Klien dengan sesi pengguna (cookie). Hanya untuk admin: membaca cookie membuat render
// bergantung pada permintaan, jadi jangan dipakai di halaman publik yang di-cache.
export const createSessionClient = async () => {
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
