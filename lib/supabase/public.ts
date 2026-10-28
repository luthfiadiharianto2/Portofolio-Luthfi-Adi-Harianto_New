import { createClient } from "@supabase/supabase-js";
import { publicEnv } from "@/lib/env";
import type { Database } from "./database.types";

// Klien tanpa sesi untuk data publik. Tidak membaca cookie, sehingga aman dipakai
// di dalam fungsi "use cache" dan di Server Action pengunjung.
export const createPublicClient = () =>
  createClient<Database>(
    publicEnv.supabaseUrl,
    publicEnv.supabasePublishableKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );
