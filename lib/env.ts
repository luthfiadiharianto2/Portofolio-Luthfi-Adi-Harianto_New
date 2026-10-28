import { z } from "zod";

// Variabel publik dibaca langsung lewat process.env.NEXT_PUBLIC_* agar Next.js
// bisa menanamkannya ke bundel browser.
const publicEnvSchema = z.object({
  supabaseUrl: z.url(),
  supabasePublishableKey: z.string().min(1),
  siteUrl: z.url(),
  spotifyPlaylistId: z.string().optional(),
  turnstileSiteKey: z.string().optional(),
  backgroundMusicUrl: z.string().optional(),
});

export const publicEnv = publicEnvSchema.parse({
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  spotifyPlaylistId: process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID || undefined,
  turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || undefined,
  backgroundMusicUrl: process.env.NEXT_PUBLIC_BACKGROUND_MUSIC_URL || undefined,
});

export const storagePublicUrl = (bucket: string, path: string) =>
  `${publicEnv.supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
