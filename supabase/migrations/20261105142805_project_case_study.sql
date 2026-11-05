-- Studi kasus proyek (opsional): masalah yang diselesaikan, peran saya, dan hasilnya.
-- Langkah pengerjaan tetap di project_steps. Teks dwibahasa memakai domain
-- localized_text, jadi bila diisi, bahasa Indonesia dan Inggris sama-sama wajib.
-- Hak akses mengikuti grant tingkat tabel yang sudah ada (baca publik untuk proyek
-- terbit, tulis hanya admin lewat RLS).
alter table public.projects
  add column problem public.localized_text,
  add column my_role public.localized_text,
  add column outcome public.localized_text;
