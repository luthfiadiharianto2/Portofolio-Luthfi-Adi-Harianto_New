import { readFileSync } from "node:fs";
import type { PGlite } from "@electric-sql/pglite";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createLocalDb } from "@/supabase/local-db";
import { buildSeedSql } from "@/supabase/seed/generate";

type Role = "anon" | "authenticated" | "service_role";
type Claims = Record<string, unknown>;
type Query = <T>(sql: string, params?: unknown[]) => Promise<T[]>;

const root = new URL("../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

const ADMIN_EMAIL = "admin@contoh.test";
const admin: Claims = {
  sub: "00000000-0000-0000-0000-00000000000a",
  email: ADMIN_EMAIL,
};
const visitor: Claims = {
  sub: "00000000-0000-0000-0000-00000000000b",
  email: "orang@contoh.test",
};
const hash = (n: number) => n.toString(16).padStart(64, "0");

let db: PGlite;

// Menjalankan fn sebagai role tertentu di dalam transaksi yang selalu dibatalkan.
const as = async <T>(
  role: Role,
  claims: Claims,
  fn: (q: Query) => Promise<T>,
) => {
  await db.exec("begin");
  try {
    await db.query(
      "select set_config('role', $1, true), set_config('request.jwt.claims', $2, true)",
      [role, JSON.stringify(claims)],
    );
    return await fn(
      async <R>(sql: string, params?: unknown[]) =>
        (await db.query<R>(sql, params)).rows,
    );
  } finally {
    await db.exec("rollback");
  }
};

const anon = <T>(fn: (q: Query) => Promise<T>) => as("anon", {}, fn);

const sendMessage = (q: Query, ipHash: string) =>
  q(
    "insert into public.messages (name, email, body, ip_hash) values ($1, $2, $3, $4)",
    ["Pengunjung", "pengunjung@contoh.test", "Halo, salam kenal!", ipHash],
  );

beforeAll(async () => {
  db = await createLocalDb({ seed: true });
  await db.query("insert into public.admins (email) values ($1)", [
    ADMIN_EMAIL,
  ]);
}, 60_000);

afterAll(async () => {
  await db.close();
});

describe("migrasi dan seed", () => {
  it("seed.sql sinkron dengan supabase/seed/content.ts", () => {
    expect(read("supabase/seed.sql")).toBe(buildSeedSql());
  });

  it("memuat semua konten lama", async () => {
    const counts = await db.query<Record<string, number>>(`
      select
        (select count(*)::int from public.projects) as projects,
        (select count(*)::int from public.project_images) as images,
        (select count(*)::int from public.project_steps) as steps,
        (select count(*)::int from public.skills) as skills,
        (select count(*)::int from public.experiences) as experiences,
        (select count(*)::int from public.education) as education,
        (select count(*)::int from public.achievements) as achievements,
        (select count(*)::int from public.organizations) as organizations,
        (select count(*)::int from public.certificates) as certificates
    `);
    expect(counts.rows[0]).toEqual({
      projects: 9,
      images: 38,
      steps: 47,
      skills: 5,
      experiences: 4,
      education: 2,
      achievements: 5,
      organizations: 4,
      certificates: 0,
    });
  });

  it("memakai slug yang ditentukan", async () => {
    const { rows } = await db.query<{ slug: string }>(
      "select slug from public.projects order by sort_order",
    );
    expect(rows.map((r) => r.slug)).toEqual([
      "borrowit",
      "ekost",
      "melodean",
      "nusantara",
      "paynow",
      "warasa",
      "spr",
      "pixora",
      "qa-cazh",
    ]);
  });

  it("menerjemahkan Penyisihan Nasional dengan benar", async () => {
    const { rows } = await db.query<{ en: string }>(
      "select title ->> 'en' as en from public.achievements",
    );
    const titles = rows.map((r) => r.en).join("\n");
    expect(titles).toContain("National Preliminary Round (Penyisihan)");
    expect(titles).not.toContain("National Finalist");
  });

  it("menolak teks yang tidak dwibahasa", async () => {
    await expect(
      as("service_role", {}, (q) =>
        q(
          "insert into public.achievements (title, detail, icon) values ($1, $2, 'x')",
          [
            JSON.stringify({ id: "Hanya Indonesia" }),
            JSON.stringify({ id: "a", en: "b" }),
          ],
        ),
      ),
    ).rejects.toThrow(/localized_text/);
    await expect(
      as("service_role", {}, (q) =>
        q(
          "insert into public.achievements (title, detail, icon) values ($1, $2, 'x')",
          [
            JSON.stringify({ id: "Ada", en: "  " }),
            JSON.stringify({ id: "a", en: "b" }),
          ],
        ),
      ),
    ).rejects.toThrow(/localized_text/);
    await expect(
      as("service_role", {}, (q) =>
        q(
          `insert into public.projects (slug, category, color, thumbnail, title, label, tagline, description, features)
           values ('x', 'web', '#000000', '/x.png', 'X', $1, $1, $1, $2)`,
          [
            JSON.stringify({ id: "a", en: "a" }),
            JSON.stringify({ id: ["satu", "dua"], en: ["one"] }),
          ],
        ),
      ),
    ).rejects.toThrow(/localized_text_list/);
  });

  it("mengaktifkan RLS di setiap tabel public", async () => {
    const { rows } = await db.query<{ relname: string }>(`
      select c.relname from pg_class c
      join pg_namespace n on n.oid = c.relnamespace
      where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity
    `);
    expect(rows).toEqual([]);
  });
});

describe("akses pengunjung (anon)", () => {
  it("hanya melihat proyek yang terbit", async () => {
    await db.exec("begin");
    try {
      await db.exec(`
        insert into public.projects (slug, category, color, thumbnail, title, label, tagline, description, features)
        values ('draf', 'web', '#000000', '/x.png', 'Draf',
          '{"id":"a","en":"a"}', '{"id":"a","en":"a"}', '{"id":"a","en":"a"}', '{"id":[],"en":[]}');
      `);
      await db.query("select set_config('role', 'anon', true)");
      const { rows } = await db.query<{ slug: string }>(
        "select slug from public.projects",
      );
      expect(rows).toHaveLength(9);
      expect(rows.map((r) => r.slug)).not.toContain("draf");
    } finally {
      await db.exec("rollback");
    }
  });

  it("membaca data latar belakang", async () => {
    const rows = await anon((q) =>
      q<{ n: number }>("select count(*)::int as n from public.skills"),
    );
    expect(rows[0]?.n).toBe(5);
  });

  it.each(["admins", "messages", "site_stats"])(
    "tidak bisa membaca %s",
    async (table) => {
      await expect(
        anon((q) => q(`select * from public.${table}`)),
      ).rejects.toThrow(/permission denied/);
    },
  );

  it("tidak bisa menulis konten", async () => {
    await expect(anon((q) => q("delete from public.projects"))).rejects.toThrow(
      /permission denied/,
    );
    await expect(
      anon((q) => q("update public.skills set icon = 'x'")),
    ).rejects.toThrow(/permission denied/);
  });

  it("bisa mengirim pesan, tapi tidak bisa mengatur is_read", async () => {
    await expect(anon((q) => sendMessage(q, hash(1)))).resolves.toEqual([]);
    await expect(
      anon((q) =>
        q(
          "insert into public.messages (name, email, body, ip_hash, is_read) values ('Ani', 'a@b.co', 'Halo semua', $1, true)",
          [hash(1)],
        ),
      ),
    ).rejects.toThrow(/permission denied/);
  });

  it("menolak pesan dengan nama atau isi di luar batas", async () => {
    await expect(
      anon((q) =>
        q(
          "insert into public.messages (name, email, body, ip_hash) values ('A', 'a@b.co', 'Halo semua', $1)",
          [hash(1)],
        ),
      ),
    ).rejects.toThrow(/check constraint/);
    await expect(
      anon((q) =>
        q(
          "insert into public.messages (name, email, body, ip_hash) values ('Ani', 'a@b.co', $1, $2)",
          ["x".repeat(1001), hash(1)],
        ),
      ),
    ).rejects.toThrow(/check constraint/);
  });

  it("dibatasi tiga pesan per 10 menit per pengunjung", async () => {
    await expect(
      anon(async (q) => {
        for (let i = 0; i < 4; i += 1) await sendMessage(q, hash(7));
      }),
    ).rejects.toThrow(/rate_limited/);
    await expect(
      anon(async (q) => {
        for (let i = 0; i < 3; i += 1) await sendMessage(q, hash(7));
      }),
    ).resolves.toBeUndefined();
  });

  it("dibatasi 30 pesan per 10 menit secara total", async () => {
    await expect(
      anon(async (q) => {
        for (let i = 0; i < 31; i += 1) await sendMessage(q, hash(100 + i));
      }),
    ).rejects.toThrow(/rate_limited/);
  });

  it("menulis buku tamu yang belum disetujui dan tidak melihatnya", async () => {
    const rows = await anon(async (q) => {
      await q(
        "insert into public.guestbook (name, message, ip_hash) values ('Budi', 'Keren sekali!', $1)",
        [hash(2)],
      );
      return q("select id from public.guestbook");
    });
    expect(rows).toEqual([]);
  });

  it("tidak bisa menyetujui komentarnya sendiri", async () => {
    await expect(
      anon((q) =>
        q(
          "insert into public.guestbook (name, message, ip_hash, is_approved) values ('Budi', 'Keren sekali!', $1, true)",
          [hash(2)],
        ),
      ),
    ).rejects.toThrow(/permission denied/);
  });

  it("tidak bisa membaca hash IP di buku tamu", async () => {
    await expect(
      anon((q) => q("select ip_hash from public.guestbook")),
    ).rejects.toThrow(/permission denied/);
    await expect(
      anon((q) => q("select id, name, message from public.guestbook")),
    ).resolves.toEqual([]);
  });

  it("menambah penghitung kunjungan hanya lewat increment_visit()", async () => {
    const visits = await anon(async (q) => {
      await q("select public.increment_visit()");
      return q<{ visits: string }>("select public.increment_visit() as visits");
    });
    expect(Number(visits[0]?.visits)).toBe(2);
    await expect(
      anon((q) => q("update public.site_stats set visits = 999")),
    ).rejects.toThrow(/permission denied/);
  });

  it("tidak bisa memanggil fungsi privat", async () => {
    await expect(anon((q) => q("select private.is_admin()"))).rejects.toThrow(
      /permission denied/,
    );
  });
});

describe("akses pengguna login", () => {
  it("pengguna biasa tidak bisa mengubah proyek", async () => {
    const rows = await as("authenticated", visitor, (q) =>
      q("update public.projects set title = 'Diretas' returning id"),
    );
    expect(rows).toEqual([]);
  });

  it("pengguna anonim dengan email admin tetap bukan admin", async () => {
    const rows = await as(
      "authenticated",
      { ...admin, is_anonymous: true },
      (q) => q("update public.projects set title = 'Diretas' returning id"),
    );
    expect(rows).toEqual([]);
  });

  it("admin bisa mengubah proyek dan membaca pesan", async () => {
    const result = await as("authenticated", admin, async (q) => {
      const updated = await q(
        "update public.projects set sort_order = sort_order returning id",
      );
      await q("reset role");
      await sendMessage(q, hash(3));
      await q("select set_config('role', 'authenticated', true)");
      const messages = await q("select id from public.messages");
      return { updated: updated.length, messages: messages.length };
    });
    expect(result).toEqual({ updated: 9, messages: 1 });
  });

  it("admin bisa menyetujui buku tamu", async () => {
    const visible = await as("authenticated", admin, async (q) => {
      await q(
        "insert into public.guestbook (name, message, ip_hash) values ('Citra', 'Mantap sekali', $1)",
        [hash(4)],
      );
      await q("update public.guestbook set is_approved = true");
      await q("select set_config('role', 'anon', true)");
      return q<{ name: string }>("select name from public.guestbook");
    });
    expect(visible).toEqual([{ name: "Citra" }]);
  });
});

describe("storage dan realtime", () => {
  it("membuat dua bucket dengan batas ukuran", async () => {
    const { rows } = await db.query<{
      id: string;
      public: boolean;
      file_size_limit: string;
    }>("select id, public, file_size_limit from storage.buckets order by id");
    expect(
      rows.map((r) => [r.id, r.public, Number(r.file_size_limit)]),
    ).toEqual([
      ["guestbook-avatars", true, 1048576],
      ["project-media", true, 5242880],
    ]);
  });

  it("pengunjung hanya bisa mengunggah foto buku tamu bernama UUID", async () => {
    const name = "3f2b8c1e-9a4d-4c7e-8f1a-2b3c4d5e6f70.webp";
    await expect(
      anon((q) =>
        q(
          "insert into storage.objects (bucket_id, name) values ('guestbook-avatars', $1)",
          [name],
        ),
      ),
    ).resolves.toEqual([]);
    await expect(
      anon((q) =>
        q(
          "insert into storage.objects (bucket_id, name) values ('guestbook-avatars', '../x.webp')",
        ),
      ),
    ).rejects.toThrow(/row-level security/);
    await expect(
      anon((q) =>
        q(
          "insert into storage.objects (bucket_id, name) values ('project-media', $1)",
          [name],
        ),
      ),
    ).rejects.toThrow(/row-level security/);
  });

  it("hanya menyiarkan kolom publik buku tamu", async () => {
    const { rows } = await db.query<{ tablename: string; attnames: string[] }>(
      "select tablename, attnames from pg_publication_tables where pubname = 'supabase_realtime'",
    );
    expect(rows).toHaveLength(1);
    expect(rows[0]?.tablename).toBe("guestbook");
    expect(rows[0]?.attnames).not.toContain("ip_hash");
  });
});
