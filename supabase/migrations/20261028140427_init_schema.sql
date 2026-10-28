-- Skema awal portofolio: tabel konten dwibahasa, pesan kontak, buku tamu,
-- penghitung kunjungan, dan daftar admin. RLS aktif di semua tabel.
--
-- Hak akses ditulis eksplisit (bukan mengandalkan auto-expose Data API):
-- setiap tabel mulai dari "revoke all", lalu diberi grant seperlunya.

-- ───────────────────────── Skema privat ─────────────────────────
-- Tidak diekspos ke Data API. Berisi fungsi pembantu untuk kebijakan RLS.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated, service_role;

-- ───────────────────────── Tipe ─────────────────────────
-- Teks dwibahasa berbentuk {"id": "...", "en": "..."}; keduanya wajib dan tidak kosong.
-- coalesce(..., false) perlu karena CHECK meloloskan hasil NULL (misalnya kunci "en" hilang).
create domain public.localized_text as jsonb
  check (
    value is null
    or coalesce(
      jsonb_typeof(value) = 'object'
      and jsonb_typeof(value -> 'id') = 'string'
      and jsonb_typeof(value -> 'en') = 'string'
      and length(btrim(value ->> 'id')) > 0
      and length(btrim(value ->> 'en')) > 0,
      false
    )
  );

-- Daftar dwibahasa berbentuk {"id": ["..."], "en": ["..."]} dengan panjang sama.
create domain public.localized_text_list as jsonb
  check (
    value is null
    or coalesce(
      jsonb_typeof(value) = 'object'
      and jsonb_typeof(value -> 'id') = 'array'
      and jsonb_typeof(value -> 'en') = 'array'
      and jsonb_array_length(value -> 'id') = jsonb_array_length(value -> 'en'),
      false
    )
  );

create type public.project_category as enum ('uiux', 'web', 'data', 'qa');

-- ───────────────────────── Admin ─────────────────────────
create table public.admins (
  email text primary key check (email = lower(email) and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at timestamptz not null default now()
);

-- Benar bila pengguna yang login (bukan anonim) memakai email yang terdaftar di admins.
-- SECURITY DEFINER agar bisa membaca admins tanpa membuka tabel itu ke klien.
-- Klaim email berasal dari auth.users (bukan user_metadata yang bisa diubah pengguna).
create function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
    and exists (
      select 1
      from public.admins a
      where a.email = lower(auth.jwt() ->> 'email')
    );
$$;

create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

-- ───────────────────────── Proyek ─────────────────────────
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  category public.project_category not null,
  color text not null check (color ~ '^#[0-9A-Fa-f]{6}$'),
  thumbnail text not null check (length(thumbnail) between 1 and 500),
  title text not null check (length(btrim(title)) between 1 and 120),
  label public.localized_text not null,
  tagline public.localized_text not null,
  description public.localized_text not null,
  features public.localized_text_list not null,
  technologies text[] not null default '{}',
  demo_url text check (demo_url ~ '^https://'),
  repo_url text check (repo_url ~ '^https://'),
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index projects_published_order_idx on public.projects (is_published, sort_order);
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function private.set_updated_at();

create table public.project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  path text not null check (length(path) between 1 and 500),
  alt public.localized_text not null,
  sort_order integer not null default 0
);
create index project_images_project_order_idx on public.project_images (project_id, sort_order);

create table public.project_steps (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  title public.localized_text not null,
  description public.localized_text not null,
  sort_order integer not null default 0
);
create index project_steps_project_order_idx on public.project_steps (project_id, sort_order);

-- ───────────────────────── Latar belakang ─────────────────────────
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  category public.localized_text not null,
  icon text not null check (length(icon) between 1 and 40),
  items text[] not null default '{}',
  sort_order integer not null default 0
);

create table public.experiences (
  id uuid primary key default gen_random_uuid(),
  title public.localized_text not null,
  place public.localized_text not null,
  period public.localized_text not null,
  description public.localized_text not null,
  sort_order integer not null default 0
);

create table public.education (
  id uuid primary key default gen_random_uuid(),
  institution text not null check (length(btrim(institution)) between 1 and 120),
  degree public.localized_text not null,
  period public.localized_text not null,
  icon text not null check (length(icon) between 1 and 40),
  sort_order integer not null default 0
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  title public.localized_text not null,
  detail public.localized_text not null,
  icon text not null check (length(icon) between 1 and 40),
  sort_order integer not null default 0
);

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  role public.localized_text not null,
  organization text not null check (length(btrim(organization)) between 1 and 120),
  period public.localized_text not null,
  description public.localized_text not null,
  sort_order integer not null default 0
);

create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  title public.localized_text not null,
  issuer text not null check (length(btrim(issuer)) between 1 and 120),
  year smallint not null check (year between 2000 and 2100),
  image_path text check (length(image_path) between 1 and 500),
  credential_url text check (credential_url ~ '^https://'),
  sort_order integer not null default 0,
  is_published boolean not null default false
);

-- ───────────────────────── Kiriman pengunjung ─────────────────────────
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 2 and 60),
  email text not null check (length(email) <= 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  body text not null check (length(btrim(body)) between 5 and 1000),
  ip_hash text not null check (ip_hash ~ '^[0-9a-f]{64}$'),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);
create index messages_ip_hash_created_idx on public.messages (ip_hash, created_at desc);
create index messages_created_idx on public.messages (created_at desc);

create table public.guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(btrim(name)) between 2 and 60),
  message text not null check (length(btrim(message)) between 5 and 1000),
  avatar_path text check (avatar_path ~ '^[0-9a-f-]{36}\.(png|jpe?g|webp|gif|avif)$'),
  ip_hash text not null check (ip_hash ~ '^[0-9a-f]{64}$'),
  is_approved boolean not null default false,
  created_at timestamptz not null default now()
);
create index guestbook_ip_hash_created_idx on public.guestbook (ip_hash, created_at desc);
create index guestbook_approved_created_idx on public.guestbook (is_approved, created_at desc);

-- Batas kiriman: 3 per 10 menit per pengunjung (hash IP), 30 per 10 menit secara total.
-- Batas total membatasi spam yang memalsukan hash IP lewat API langsung.
-- SECURITY DEFINER karena pengunjung tidak boleh membaca tabelnya sendiri.
create function private.enforce_submission_limits()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  per_visitor integer;
  overall integer;
begin
  new.created_at := now();

  execute format(
    'select count(*) filter (where ip_hash = $1), count(*)
       from %I.%I
      where created_at > now() - interval ''10 minutes''',
    tg_table_schema, tg_table_name
  )
  into per_visitor, overall
  using new.ip_hash;

  if per_visitor >= 3 or overall >= 30 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  return new;
end;
$$;

create trigger messages_enforce_limits
  before insert on public.messages
  for each row execute function private.enforce_submission_limits();

create trigger guestbook_enforce_limits
  before insert on public.guestbook
  for each row execute function private.enforce_submission_limits();

-- ───────────────────────── Penghitung kunjungan ─────────────────────────
create table public.site_stats (
  id smallint primary key default 1 check (id = 1),
  visits bigint not null default 0 check (visits >= 0),
  updated_at timestamptz not null default now()
);
insert into public.site_stats (id, visits) values (1, 0);

-- Satu-satunya jalan publik ke site_stats: menambah 1 dan mengembalikan totalnya.
create function public.increment_visit()
returns bigint
language sql
security definer
set search_path = ''
as $$
  update public.site_stats
     set visits = visits + 1,
         updated_at = now()
   where id = 1
  returning visits;
$$;

-- ───────────────────────── Hak akses fungsi ─────────────────────────
revoke all on function private.is_admin() from public, anon, authenticated;
revoke all on function private.set_updated_at() from public, anon, authenticated;
revoke all on function private.enforce_submission_limits() from public, anon, authenticated;
revoke all on function public.increment_visit() from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated, service_role;
grant execute on function public.increment_visit() to anon, authenticated, service_role;

-- ───────────────────────── RLS ─────────────────────────
alter table public.admins enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.project_steps enable row level security;
alter table public.skills enable row level security;
alter table public.experiences enable row level security;
alter table public.education enable row level security;
alter table public.achievements enable row level security;
alter table public.organizations enable row level security;
alter table public.certificates enable row level security;
alter table public.messages enable row level security;
alter table public.guestbook enable row level security;
alter table public.site_stats enable row level security;

-- admins dan site_stats sengaja tanpa kebijakan: tertutup untuk anon dan authenticated.

-- Proyek dan sertifikat: pengunjung melihat yang terbit, admin melihat semuanya.
create policy "Pengunjung membaca proyek terbit" on public.projects
  for select to anon using (is_published);
create policy "Pengguna membaca proyek terbit, admin semua" on public.projects
  for select to authenticated using (is_published or (select private.is_admin()));
create policy "Admin menambah proyek" on public.projects
  for insert to authenticated with check ((select private.is_admin()));
create policy "Admin mengubah proyek" on public.projects
  for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admin menghapus proyek" on public.projects
  for delete to authenticated using ((select private.is_admin()));

create policy "Pengunjung membaca sertifikat terbit" on public.certificates
  for select to anon using (is_published);
create policy "Pengguna membaca sertifikat terbit, admin semua" on public.certificates
  for select to authenticated using (is_published or (select private.is_admin()));
create policy "Admin menambah sertifikat" on public.certificates
  for insert to authenticated with check ((select private.is_admin()));
create policy "Admin mengubah sertifikat" on public.certificates
  for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admin menghapus sertifikat" on public.certificates
  for delete to authenticated using ((select private.is_admin()));

-- Gambar dan langkah proyek mengikuti status terbit proyeknya.
create policy "Pengunjung membaca gambar proyek terbit" on public.project_images
  for select to anon using (
    exists (select 1 from public.projects p where p.id = project_id and p.is_published)
  );
create policy "Pengguna membaca gambar proyek terbit, admin semua" on public.project_images
  for select to authenticated using (
    (select private.is_admin())
    or exists (select 1 from public.projects p where p.id = project_id and p.is_published)
  );
create policy "Admin menambah gambar proyek" on public.project_images
  for insert to authenticated with check ((select private.is_admin()));
create policy "Admin mengubah gambar proyek" on public.project_images
  for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admin menghapus gambar proyek" on public.project_images
  for delete to authenticated using ((select private.is_admin()));

create policy "Pengunjung membaca langkah proyek terbit" on public.project_steps
  for select to anon using (
    exists (select 1 from public.projects p where p.id = project_id and p.is_published)
  );
create policy "Pengguna membaca langkah proyek terbit, admin semua" on public.project_steps
  for select to authenticated using (
    (select private.is_admin())
    or exists (select 1 from public.projects p where p.id = project_id and p.is_published)
  );
create policy "Admin menambah langkah proyek" on public.project_steps
  for insert to authenticated with check ((select private.is_admin()));
create policy "Admin mengubah langkah proyek" on public.project_steps
  for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admin menghapus langkah proyek" on public.project_steps
  for delete to authenticated using ((select private.is_admin()));

-- Data latar belakang: dibaca semua orang, ditulis admin.
do $$
declare
  t text;
begin
  foreach t in array array['skills', 'experiences', 'education', 'achievements', 'organizations']
  loop
    execute format(
      'create policy "Semua orang membaca %1$s" on public.%1$I for select to anon, authenticated using (true)', t);
    execute format(
      'create policy "Admin menambah %1$s" on public.%1$I for insert to authenticated with check ((select private.is_admin()))', t);
    execute format(
      'create policy "Admin mengubah %1$s" on public.%1$I for update to authenticated using ((select private.is_admin())) with check ((select private.is_admin()))', t);
    execute format(
      'create policy "Admin menghapus %1$s" on public.%1$I for delete to authenticated using ((select private.is_admin()))', t);
  end loop;
end;
$$;

-- Pesan kontak: pengunjung hanya bisa menambah; admin membaca, menandai dibaca, menghapus.
create policy "Pengunjung mengirim pesan" on public.messages
  for insert to anon, authenticated with check (is_read = false);
create policy "Admin membaca pesan" on public.messages
  for select to authenticated using ((select private.is_admin()));
create policy "Admin menandai pesan" on public.messages
  for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admin menghapus pesan" on public.messages
  for delete to authenticated using ((select private.is_admin()));

-- Buku tamu: komentar baru selalu belum disetujui; publik hanya melihat yang disetujui.
create policy "Pengunjung membaca buku tamu yang disetujui" on public.guestbook
  for select to anon using (is_approved);
create policy "Pengguna membaca buku tamu yang disetujui, admin semua" on public.guestbook
  for select to authenticated using (is_approved or (select private.is_admin()));
create policy "Pengunjung menulis buku tamu" on public.guestbook
  for insert to anon, authenticated with check (is_approved = false);
create policy "Admin memoderasi buku tamu" on public.guestbook
  for update to authenticated
  using ((select private.is_admin())) with check ((select private.is_admin()));
create policy "Admin menghapus buku tamu" on public.guestbook
  for delete to authenticated using ((select private.is_admin()));

-- ───────────────────────── Hak akses tabel ─────────────────────────
revoke all on all tables in schema public from anon, authenticated;

grant select on public.projects, public.project_images, public.project_steps, public.skills,
  public.experiences, public.education, public.achievements, public.organizations,
  public.certificates
  to anon, authenticated;
grant insert, update, delete on public.projects, public.project_images, public.project_steps,
  public.skills, public.experiences, public.education, public.achievements,
  public.organizations, public.certificates
  to authenticated;

-- Kolom yang boleh diisi pengunjung dibatasi; is_read, is_approved, dan created_at tidak.
grant insert (name, email, body, ip_hash) on public.messages to anon, authenticated;
grant select, delete on public.messages to authenticated;
grant update (is_read) on public.messages to authenticated;

-- ip_hash buku tamu tidak pernah dikirim ke klien.
grant select (id, name, message, avatar_path, is_approved, created_at) on public.guestbook
  to anon, authenticated;
grant insert (name, message, avatar_path, ip_hash) on public.guestbook to anon, authenticated;
grant update (is_approved) on public.guestbook to authenticated;
grant delete on public.guestbook to authenticated;

grant all on all tables in schema public to service_role;
