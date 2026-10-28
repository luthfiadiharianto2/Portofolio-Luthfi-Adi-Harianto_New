// Database Postgres tertanam (PGlite) berisi semua migrasi, untuk tes dan pembuatan tipe.
// Lingkungan Supabase (role, auth, storage, realtime) ditiru oleh tests/db/supabase-stub.sql.

import { readdirSync, readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";

const root = new URL("../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");

export const migrationFiles = () =>
  readdirSync(new URL("supabase/migrations/", root))
    .filter((file) => file.endsWith(".sql"))
    .sort();

export const createLocalDb = async ({ seed = false } = {}) => {
  const db = new PGlite();
  await db.exec(read("tests/db/supabase-stub.sql"));
  for (const file of migrationFiles())
    await db.exec(read(`supabase/migrations/${file}`));
  if (seed) await db.exec(read("supabase/seed.sql"));
  return db;
};
