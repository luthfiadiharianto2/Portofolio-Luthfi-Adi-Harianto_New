# Portofolio Luthfi Adi Harianto

Portofolio dwibahasa (Indonesia dan Inggris) bertema luar angkasa, dengan kartu ID 3D yang
bisa diseret. Dibangun ulang dari versi Laravel dengan Next.js (App Router), React, three.js,
dan Supabase. Konten dibaca dari Supabase dan dikelola lewat halaman admin.

- **Halaman publik**: `/id` dan `/en` (beranda, About, Portfolio, Contact, detail proyek)
- **Admin**: `/admin` (login magic link, kelola proyek, moderasi buku tamu, baca pesan)
- **Teknologi**: Next.js 16, React 19, TypeScript, Tailwind CSS 4, three.js lewat React
  Three Fiber, GSAP dan Lenis, next-intl, Supabase (Postgres, Auth, Storage, Realtime),
  React Hook Form dan Zod, Vitest, Playwright

## Menjalankan secara lokal

Butuh Node.js 22 ke atas dan pnpm.

1. Salin `.env.example` menjadi `.env.local`, lalu isi minimal:
   - `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, dari
     Supabase Dashboard → Project Settings → API Keys
   - `NEXT_PUBLIC_SITE_URL=http://localhost:3000`
   - `IP_HASH_SALT`, berupa string acak panjang (misalnya hasil `openssl rand -hex 32`)
2. Pasang dependensi dan jalankan:

   ```bash
   pnpm install
   pnpm dev
   ```

3. Buka http://localhost:3000. Pengunjung diarahkan ke `/id` atau `/en` sesuai bahasa
   browser.

Build membaca data dari Supabase, jadi variabel Supabase juga wajib saat `pnpm build`.
Aplikasi tidak butuh kunci rahasia Supabase (service role atau secret key): semua akses
lewat kunci publishable dan dibatasi RLS.

## Perintah

| Perintah                | Fungsi                                                      |
| ----------------------- | ----------------------------------------------------------- |
| `pnpm dev`              | Server pengembangan                                         |
| `pnpm build`            | Build produksi                                              |
| `pnpm start`            | Menjalankan hasil build                                     |
| `pnpm lint`             | ESLint                                                      |
| `pnpm typecheck`        | Membuat tipe rute, lalu `tsc --noEmit`                      |
| `pnpm format`           | Prettier                                                    |
| `pnpm test`             | Tes unit dan tes database (Vitest + PGlite)                 |
| `pnpm test:e2e`         | Tes Playwright di enam ukuran layar (butuh `pnpm build`)    |
| `pnpm check`            | Lint, typecheck, format, tes unit, dan build sekaligus      |
| `pnpm db:seed:generate` | Membuat `supabase/seed.sql` dari `supabase/seed/content.ts` |
| `pnpm db:types`         | Membuat ulang tipe TypeScript dari skema Supabase           |

Browser Playwright dipasang sekali dengan `pnpm exec playwright install chromium`. Bila
drive sistem sempit, set `PLAYWRIGHT_BROWSERS_PATH` ke folder di drive lain sebelum memasang
dan menjalankan tes.

## Database (Supabase)

| Lokasi                           | Isi                                                        |
| -------------------------------- | ---------------------------------------------------------- |
| `supabase/migrations/`           | Skema, RLS, hak akses, bucket Storage, Realtime, cek admin |
| `supabase/seed/content.ts`       | Konten awal dwibahasa dari portofolio lama                 |
| `supabase/seed.sql`              | Dibuat dari `content.ts` dengan `pnpm db:seed:generate`    |
| `lib/supabase/database.types.ts` | Tipe dari skema, dibuat dengan `pnpm db:types`             |

### Menyiapkan proyek Supabase baru

1. Buat proyek di Supabase.
2. Terapkan migrasi secara berurutan, lalu seed. Dengan Supabase CLI:

   ```bash
   npx supabase link --project-ref <ref-proyek>
   npx supabase db push
   ```

   Jalankan isi `supabase/seed.sql` di SQL Editor. Jalankan sekali saja: seed menambah
   baris baru, bukan memperbarui baris yang ada.

3. Daftarkan email admin, dengan huruf kecil semua:

   ```sql
   insert into public.admins (email) values ('email-anda@contoh.com');
   ```

4. Buat akun login untuk email itu di **Authentication → Users → Add user**. Form login
   admin tidak bisa dipakai untuk mendaftar.
5. Di **Authentication → URL Configuration**, isi **Site URL** dengan alamat produksi, lalu
   tambahkan ke **Redirect URLs**:
   - `http://localhost:3000/admin/auth/callback`
   - `https://<domain-produksi>/admin/auth/callback`
6. Buat ulang tipe dengan `pnpm db:types`. Perintah ini butuh `SUPABASE_ACCESS_TOKEN`
   berupa token akses berizin terbatas; ganti juga ID proyek di skrip `db:types` pada
   `package.json`.

Tes `pnpm test` menjalankan semua migrasi dan seed di Postgres tertanam (PGlite), lalu
memeriksa aturan RLS sebagai pengunjung, pengguna biasa, dan admin. Setiap mengubah migrasi,
jalankan tes ini sebelum menerapkannya ke proyek.

Proyek saat ini: `yyudfgfjbqakxampehmn` (Singapura). Semua migrasi dan seed sudah diterapkan.

## Mengisi dan mengubah data

### Lewat halaman admin (`/admin`)

Masuk dengan email admin. Tautan masuk dikirim ke email itu; buka tautannya di browser yang
sama dengan tempat kamu memintanya.

- **Proyek**: tambah, ubah, urutkan, terbitkan atau jadikan draf, dan hapus. Semua teks
  diisi dalam bahasa Indonesia dan Inggris. Galeri (dengan teks alternatif ID/EN) dan
  langkah pengerjaan diatur di halaman ubah proyek. Gambar diunggah langsung ke bucket
  `project-media` (PNG, JPG, WebP, AVIF, atau GIF, maksimal 5 MB). Menghapus proyek ikut
  menghapus semua gambarnya.
- **Buku tamu**: komentar baru baru tampil di situs setelah disetujui. Menghapus komentar
  ikut menghapus fotonya.
- **Pesan**: pesan dari form kontak, bisa ditandai dibaca, dihapus, atau dibalas lewat email.

Setiap perubahan dari admin langsung memperbarui halaman publik (`updateTag`). Tanpa itu,
halaman publik diperbarui otomatis tiap jam.

### Data yang belum ada di admin

Keahlian, pengalaman, pendidikan, prestasi, organisasi, dan sertifikat diubah lewat
Supabase Table Editor. Format teks dwibahasa adalah `{"id": "...", "en": "..."}`; database
menolak teks yang kosong di salah satu bahasa. Bila mengubah lewat Table Editor, halaman
publik baru diperbarui dalam satu jam.

Untuk proyek Supabase baru, ubah `supabase/seed/content.ts`, jalankan
`pnpm db:seed:generate`, lalu terapkan `supabase/seed.sql`.

### Identitas dan tautan sosial

Nama, email, dan tautan sosial ada di `lib/site.ts`. Teks antarmuka ada di
`messages/id.json` dan `messages/en.json`; kedua berkas harus memiliki kunci yang sama
(diperiksa oleh tes).

## Deploy ke Vercel

1. Unggah repositori ke GitHub, lalu di Vercel pilih **Add New → Project** dan impor
   repositori itu. Framework terdeteksi otomatis sebagai Next.js, dan pnpm terdeteksi
   dari `pnpm-lock.yaml`.
2. Di **Project Settings → Environment Variables**, isi semua variabel dari `.env.example`
   untuk lingkungan Production (dan Preview bila perlu):
   - `NEXT_PUBLIC_SITE_URL` berisi alamat produksi, misalnya `https://luthfi.vercel.app`
   - `IP_HASH_SALT` dan `TURNSTILE_SECRET_KEY` adalah nilai rahasia. Isi hanya di
     dashboard, jangan di kode atau chat.
3. Deploy. Sesudahnya:
   - tambahkan `https://<domain>/admin/auth/callback` ke Redirect URLs Supabase, lalu
     ganti Site URL ke domain produksi;
   - buka `https://<domain>/sitemap.xml` dan `/robots.txt` untuk memastikan alamatnya
     sudah domain produksi;
   - bila memakai domain sendiri, tambahkan di **Project Settings → Domains**, lalu
     perbarui `NEXT_PUBLIC_SITE_URL` dan Redirect URLs Supabase, kemudian deploy ulang.

Variabel `NEXT_PUBLIC_*` ditanamkan saat build, jadi setiap mengubahnya perlu deploy ulang.

Fungsi server dijalankan di region Singapura (`sin1`, diatur di `vercel.json`), dekat
dengan database Supabase dan pengunjung dari Indonesia. Bila proyek Supabase pindah region,
sesuaikan nilai ini.

## Fitur teknis

- **SEO**: metadata per bahasa, canonical dan hreflang (`id`, `en`, `x-default`), gambar
  Open Graph dinamis untuk beranda dan tiap proyek, `sitemap.xml` dan `robots.txt`
  otomatis, serta data terstruktur JSON-LD `Person` di beranda. `/admin` tidak diindeks.
- **Keamanan**: RLS aktif di semua tabel. Pengunjung hanya membaca konten terbit dan
  menulis ke pesan dan buku tamu (honeypot, Turnstile opsional, batas 3 kiriman per 10
  menit per hash IP). Admin diperiksa di server untuk setiap halaman dan aksi, lalu sekali
  lagi oleh RLS.
- **3D dan gerak**: kartu ID dan latar bintang dimuat setelah halaman siap, hanya bila
  perangkat mendukung WebGL dengan GPU. Tanpa itu, atau bila pengguna memilih gerak
  dikurangi, situs menampilkan versi statis. Tambahkan `?3d=force` di URL untuk memaksa 3D
  saat pengujian.
- **Performa**: JS awal sekitar 163 kB gzip dan potongan 3D sekitar 281 kB gzip; keduanya
  dijaga oleh tes `tests/e2e/budget.spec.ts`.

## Konten yang masih TODO

- Username Instagram: isi `socialLinks.instagram` di `lib/site.ts` (selama kosong, ikon
  tidak tampil).
- Musik latar navbar: isi `NEXT_PUBLIC_BACKGROUND_MUSIC_URL` dengan file audio milik sendiri.
- Kartu musik Spotify: isi `NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID`.
- Notifikasi email untuk pesan baru (opsional, lewat Supabase Edge Function dan Resend)
  belum dibuat.

## Struktur

| Lokasi                                | Isi                                                   |
| ------------------------------------- | ----------------------------------------------------- |
| `app/[locale]/`                       | Halaman publik untuk `/id` dan `/en`, gambar OG       |
| `app/admin/`                          | Halaman dan Server Action admin                       |
| `app/sitemap.ts`, `app/robots.ts`     | sitemap.xml dan robots.txt                            |
| `components/`                         | Komponen per bagian (`sections`, `three`, `admin`, …) |
| `lib/data/`                           | Pembacaan konten publik ber-cache                     |
| `lib/admin/`                          | Akses admin, data admin, dan aturan gambar            |
| `lib/supabase/`                       | Klien Supabase (publik, sesi server, proxy, browser)  |
| `i18n/`, `proxy.ts`, `messages/`      | next-intl dan pembaruan sesi admin                    |
| `app/globals.css`                     | Token desain (warna, radius, font, jarak)             |
| `public/images/`                      | Gambar asli dari portofolio lama                      |
| `assets-lama/`                        | Salinan referensi kode Laravel lama                   |
| `tests/unit`, `tests/db`, `tests/e2e` | Vitest, tes RLS (PGlite), dan Playwright              |
