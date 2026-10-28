-- Bucket Storage dan Realtime.

-- ───────────────────────── Bucket ─────────────────────────
-- Keduanya publik untuk dibaca lewat URL publik. Tidak ada kebijakan select untuk
-- pengunjung, jadi isi bucket tidak bisa didaftar (list) lewat API.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('project-media', 'project-media', true, 5242880,
    array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif']),
  ('guestbook-avatars', 'guestbook-avatars', true, 1048576,
    array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- project-media: hanya admin yang menulis. Upsert butuh insert, select, dan update.
create policy "Admin membaca project-media" on storage.objects
  for select to authenticated
  using (bucket_id = 'project-media' and (select private.is_admin()));
create policy "Admin mengunggah project-media" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'project-media' and (select private.is_admin()));
create policy "Admin mengganti project-media" on storage.objects
  for update to authenticated
  using (bucket_id = 'project-media' and (select private.is_admin()))
  with check (bucket_id = 'project-media' and (select private.is_admin()));
create policy "Admin menghapus project-media" on storage.objects
  for delete to authenticated
  using (bucket_id = 'project-media' and (select private.is_admin()));

-- guestbook-avatars: pengunjung boleh menambah file baru dengan nama UUID di akar bucket,
-- tanpa menimpa atau menghapus. Batas 1 MB dan tipe gambar diatur di bucket.
create policy "Pengunjung mengunggah foto buku tamu" on storage.objects
  for insert to anon, authenticated
  with check (
    bucket_id = 'guestbook-avatars'
    and name ~ '^[0-9a-f-]{36}\.(png|jpe?g|webp|gif|avif)$'
  );
create policy "Admin membaca foto buku tamu" on storage.objects
  for select to authenticated
  using (bucket_id = 'guestbook-avatars' and (select private.is_admin()));
create policy "Admin menghapus foto buku tamu" on storage.objects
  for delete to authenticated
  using (bucket_id = 'guestbook-avatars' and (select private.is_admin()));

-- ───────────────────────── Realtime ─────────────────────────
-- Hanya buku tamu, dan hanya kolom publik (ip_hash tidak ikut disiarkan).
-- Pelanggan tetap disaring RLS: anon hanya menerima baris yang disetujui.
alter publication supabase_realtime
  add table public.guestbook (id, name, message, avatar_path, is_approved, created_at);
