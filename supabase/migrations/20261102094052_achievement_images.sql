-- Foto sertifikat/piagam untuk prestasi (opsional).
-- Path dari public/ (misalnya /images/achievements/...) atau URL publik bucket storage.
alter table public.achievements
  add column image_path text check (length(image_path) between 1 and 500);
