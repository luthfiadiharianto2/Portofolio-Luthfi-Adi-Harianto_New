-- Pemeriksaan admin untuk aplikasi (halaman /admin dan Server Action admin).
--
-- private.is_admin() tidak terekspos ke Data API, dan tabel admins sengaja tertutup.
-- Fungsi ini hanya meneruskan hasilnya untuk pengguna yang sedang login, tanpa membuka
-- daftar email admin. SECURITY INVOKER: tidak menambah hak apa pun; hak membaca admins
-- tetap hanya milik private.is_admin().
create function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select private.is_admin();
$$;

revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated, service_role;
