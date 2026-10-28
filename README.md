# Portofolio Luthfi Adi Harianto

Portofolio 3D bertema luar angkasa, dibangun ulang dengan Next.js, React, dan Supabase.
README lengkap (mengisi data dan deploy) menyusul di Tahap 8.

## Menjalankan secara lokal

Butuh Node.js 22+ dan pnpm. Salin `.env.example` menjadi `.env.local`, lalu isi minimal
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, dan `IP_HASH_SALT`
(string acak panjang). Build membaca data dari Supabase, jadi variabel ini juga wajib saat build.

```bash
pnpm install
pnpm dev
```

Buka http://localhost:3000 (diarahkan ke `/id` atau `/en` sesuai bahasa browser).

## Perintah

| Perintah         | Fungsi                                                   |
| ---------------- | -------------------------------------------------------- |
| `pnpm lint`      | ESLint                                                   |
| `pnpm typecheck` | Membuat tipe rute, lalu `tsc --noEmit`                   |
| `pnpm format`    | Prettier                                                 |
| `pnpm test`      | Tes unit (Vitest)                                        |
| `pnpm build`     | Build produksi                                           |
| `pnpm test:e2e`  | Tes Playwright di enam ukuran layar (butuh `pnpm build`) |
| `pnpm check`     | Lint, typecheck, format, tes unit, dan build             |

Browser Playwright dipasang sekali dengan `pnpm exec playwright install chromium`.
Bila drive C: sempit, set `PLAYWRIGHT_BROWSERS_PATH` ke folder di drive lain sebelum
memasang dan menjalankan tes.

## Database (Supabase)

- `supabase/migrations/`: skema, RLS, hak akses, bucket Storage, dan Realtime
- `supabase/seed/content.ts`: konten dwibahasa dari portofolio lama (sumber kebenaran)
- `supabase/seed.sql`: dibuat dari content.ts dengan `pnpm db:seed:generate`
- `lib/supabase/database.types.ts`: dibuat dari proyek Supabase dengan `pnpm db:types`
  (butuh `SUPABASE_ACCESS_TOKEN` berupa token akses berizin terbatas)

Tes `pnpm test` menjalankan semua migrasi dan seed di Postgres tertanam (PGlite)
dan memeriksa aturan RLS sebagai pengunjung, pengguna biasa, dan admin.
Variabel lingkungan dicontohkan di `.env.example`.

Proyek Supabase: `yyudfgfjbqakxampehmn` (Singapura). Migrasi dan seed sudah diterapkan.
Setelah mengubah migrasi, terapkan ke proyek lalu jalankan `pnpm db:types`.

## Konten yang masih TODO

- Username Instagram: isi `socialLinks.instagram` di `lib/site.ts` (selama kosong, ikon tidak tampil).
- Musik latar navbar: isi `NEXT_PUBLIC_BACKGROUND_MUSIC_URL` dengan file audio milik sendiri.
- Kartu musik Spotify: isi `NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID`.

## Struktur

- `app/[locale]/`: halaman untuk `/id` dan `/en`
- `i18n/`, `proxy.ts`, `messages/`: next-intl
- `app/globals.css`: token desain (warna, radius, font, jarak)
- `public/images/`: gambar asli dari portofolio lama, nama file tidak diubah
- `assets-lama/`: salinan referensi kode Laravel lama
- `tests/unit`, `tests/e2e`: Vitest dan Playwright
