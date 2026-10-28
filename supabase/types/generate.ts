// Membuat lib/supabase/database.types.ts dari skema migrasi, dalam format yang sama
// dengan `supabase gen types typescript`. Dipakai selama belum ada proyek Supabase
// untuk dihubungkan; setelah ada, file itu bisa dibuat ulang dengan CLI resmi.
// Jalankan: pnpm db:types

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { PGlite } from "@electric-sql/pglite";
import { createLocalDb } from "../local-db.ts";

type Column = {
  table_name: string;
  column_name: string;
  type_name: string;
  base_type: string;
  type_category: string;
  element_type: string | null;
  is_nullable: boolean;
  has_default: boolean;
};

type ForeignKey = {
  constraint_name: string;
  table_name: string;
  columns: string[];
  referenced_table: string;
  referenced_columns: string[];
  is_one_to_one: boolean;
};

type Fn = { name: string; return_type: string; arg_count: number };

const scalar: Record<string, string> = {
  bool: "boolean",
  int2: "number",
  int4: "number",
  int8: "number",
  float4: "number",
  float8: "number",
  numeric: "number",
  text: "string",
  varchar: "string",
  uuid: "string",
  date: "string",
  timestamptz: "string",
  timestamp: "string",
  json: "Json",
  jsonb: "Json",
};

const introspect = async (db: PGlite) => {
  const columns = await db.query<Column>(`
    select c.relname as table_name,
           a.attname as column_name,
           t.typname as type_name,
           coalesce(bt.typname, t.typname) as base_type,
           t.typcategory as type_category,
           et.typname as element_type,
           not a.attnotnull as is_nullable,
           a.atthasdef as has_default
      from pg_attribute a
      join pg_class c on c.oid = a.attrelid
      join pg_namespace n on n.oid = c.relnamespace
      join pg_type t on t.oid = a.atttypid
      left join pg_type bt on t.typtype = 'd' and bt.oid = t.typbasetype
      left join pg_type et on et.oid = t.typelem and t.typcategory = 'A'
     where n.nspname = 'public' and c.relkind = 'r' and a.attnum > 0 and not a.attisdropped
     order by c.relname, a.attnum
  `);

  const enums = await db.query<{ name: string; labels: string[] }>(`
    select t.typname as name, array_agg(e.enumlabel order by e.enumsortorder) as labels
      from pg_type t
      join pg_enum e on e.enumtypid = t.oid
      join pg_namespace n on n.oid = t.typnamespace
     where n.nspname = 'public'
     group by t.typname
     order by t.typname
  `);

  const foreignKeys = await db.query<ForeignKey>(`
    select con.conname as constraint_name,
           src.relname as table_name,
           array(select attname from pg_attribute where attrelid = con.conrelid and attnum = any(con.conkey)) as columns,
           dst.relname as referenced_table,
           array(select attname from pg_attribute where attrelid = con.confrelid and attnum = any(con.confkey)) as referenced_columns,
           exists (
             select 1 from pg_index i
              where i.indrelid = con.conrelid and i.indisunique and i.indkey::int2[] @> con.conkey and array_length(con.conkey, 1) = i.indnatts
           ) as is_one_to_one
      from pg_constraint con
      join pg_class src on src.oid = con.conrelid
      join pg_class dst on dst.oid = con.confrelid
      join pg_namespace n on n.oid = src.relnamespace
     where con.contype = 'f' and n.nspname = 'public'
     order by con.conname
  `);

  const functions = await db.query<Fn>(`
    select p.proname as name, pg_catalog.format_type(p.prorettype, null) as return_type, p.pronargs as arg_count
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public' and p.prokind = 'f'
     order by p.proname
  `);

  return {
    columns: columns.rows,
    enums: enums.rows,
    foreignKeys: foreignKeys.rows,
    functions: functions.rows,
  };
};

const tsType = (column: Column, enumNames: Set<string>) => {
  const typeOf = (name: string) =>
    enumNames.has(name)
      ? `Database["public"]["Enums"]["${name}"]`
      : (scalar[name] ?? "unknown");
  const base =
    column.type_category === "A" && column.element_type
      ? `${typeOf(column.element_type)}[]`
      : typeOf(column.base_type);
  return column.is_nullable ? `${base} | null` : base;
};

const block = (entries: string[], indent: string) =>
  entries.length === 0
    ? "{\n" + `${indent}[_ in never]: never\n` + indent.slice(2) + "}"
    : `{\n${entries.join("\n")}\n${indent.slice(2)}}`;

export const buildDatabaseTypes = async () => {
  const db = await createLocalDb();
  const { columns, enums, foreignKeys, functions } = await introspect(db);
  await db.close();

  const enumNames = new Set(enums.map((e) => e.name));
  const tables = [...new Set(columns.map((c) => c.table_name))];
  const pad = (n: number) => " ".repeat(n);

  const tableTypes = tables.map((table) => {
    const cols = columns.filter((c) => c.table_name === table);
    const row = cols.map(
      (c) => `${pad(10)}${c.column_name}: ${tsType(c, enumNames)}`,
    );
    const insert = cols.map(
      (c) =>
        `${pad(10)}${c.column_name}${c.is_nullable || c.has_default ? "?" : ""}: ${tsType(c, enumNames)}`,
    );
    const update = cols.map(
      (c) => `${pad(10)}${c.column_name}?: ${tsType(c, enumNames)}`,
    );
    const relationships = foreignKeys
      .filter((fk) => fk.table_name === table)
      .map((fk) =>
        [
          `${pad(10)}{`,
          `${pad(12)}foreignKeyName: "${fk.constraint_name}"`,
          `${pad(12)}columns: [${fk.columns.map((c) => `"${c}"`).join(", ")}]`,
          `${pad(12)}isOneToOne: ${fk.is_one_to_one}`,
          `${pad(12)}referencedRelation: "${fk.referenced_table}"`,
          `${pad(12)}referencedColumns: [${fk.referenced_columns.map((c) => `"${c}"`).join(", ")}]`,
          `${pad(10)}},`,
        ].join("\n"),
      );
    return [
      `${pad(6)}${table}: {`,
      `${pad(8)}Row: {\n${row.join("\n")}\n${pad(8)}}`,
      `${pad(8)}Insert: {\n${insert.join("\n")}\n${pad(8)}}`,
      `${pad(8)}Update: {\n${update.join("\n")}\n${pad(8)}}`,
      `${pad(8)}Relationships: ${relationships.length ? `[\n${relationships.join("\n")}\n${pad(8)}]` : "[]"}`,
      `${pad(6)}}`,
    ].join("\n");
  });

  const functionTypes = functions.map(
    (fn) =>
      `${pad(6)}${fn.name}: {\n${pad(8)}Args: ${fn.arg_count === 0 ? "never" : "Record<string, unknown>"}\n${pad(8)}Returns: ${scalar[fn.return_type === "bigint" ? "int8" : fn.return_type] ?? "unknown"}\n${pad(6)}}`,
  );

  const enumTypes = enums.map(
    (e) =>
      `${pad(6)}${e.name}: ${e.labels.map((label) => `"${label}"`).join(" | ")}`,
  );

  return `// File ini dibuat otomatis oleh supabase/types/generate.ts dari supabase/migrations.
// Jangan diedit langsung. Jalankan \`pnpm db:types\` setelah mengubah migrasi.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
${tableTypes.join("\n")}
    }
    Views: ${block([], pad(6))}
    Functions: ${block(functionTypes, pad(6))}
    Enums: ${block(enumTypes, pad(6))}
    CompositeTypes: ${block([], pad(6))}
  }
}

type PublicSchema = Database["public"]

export type Tables<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Row"]
export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"]
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T]
`;
};

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
  const target = new URL(
    "../../lib/supabase/database.types.ts",
    import.meta.url,
  );
  writeFileSync(target, await buildDatabaseTypes());
  console.log(`Ditulis: ${target.pathname}`);
}
