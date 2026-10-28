import { readFileSync } from "node:fs";
import { format, resolveConfig } from "prettier";
import { describe, expect, it } from "vitest";
import { buildDatabaseTypes } from "@/supabase/types/generate";

const target = new URL("../../lib/supabase/database.types.ts", import.meta.url);

describe("tipe TypeScript Supabase", () => {
  it("sinkron dengan migrasi (jalankan pnpm db:types bila gagal)", async () => {
    const options = await resolveConfig(target);
    const expected = await format(await buildDatabaseTypes(), {
      ...options,
      filepath: target.pathname,
    });
    expect(readFileSync(target, "utf8")).toBe(expected);
  }, 60_000);
});
