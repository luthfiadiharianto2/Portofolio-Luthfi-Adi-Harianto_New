import { createBrowserClient } from "@supabase/ssr";
import { publicEnv } from "@/lib/env";
import type { Database } from "./database.types";

// Klien browser dengan sesi admin (cookie yang sama dengan server). Dipakai hanya untuk
// mengunggah gambar langsung ke Storage: kebijakan project-media memastikan hanya admin
// yang bisa menulis, dan file besar tidak perlu melewati batas body Server Action.
export const createBrowserSupabase = () =>
  createBrowserClient<Database>(
    publicEnv.supabaseUrl,
    publicEnv.supabasePublishableKey,
  );
