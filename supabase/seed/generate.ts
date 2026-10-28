// Membuat supabase/seed.sql dari supabase/seed/content.ts.
// Jalankan: pnpm db:seed:generate

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  achievements,
  education,
  experiences,
  organizations,
  projects,
  skills,
} from "./content.ts";

const text = (value: string) => `'${value.replaceAll("'", "''")}'`;
const json = (value: unknown) => `${text(JSON.stringify(value))}::jsonb`;
const textArray = (values: string[]) =>
  values.length === 0
    ? "'{}'::text[]"
    : `array[${values.map(text).join(", ")}]`;

const insert = (table: string, columns: string[], rows: string[][]) =>
  [
    `insert into public.${table} (${columns.join(", ")}) values`,
    rows.map((row) => `  (${row.join(", ")})`).join(",\n") + ";",
  ].join("\n");

const projectChildren = (
  table: string,
  columns: string[],
  rows: { slug: string; values: string[] }[],
) =>
  [
    `insert into public.${table} (project_id, ${columns.join(", ")})`,
    `select p.id, v.${columns.join(", v.")}`,
    `from (values`,
    rows
      .map(({ slug, values }) => `  (${text(slug)}, ${values.join(", ")})`)
      .join(",\n"),
    `) as v (slug, ${columns.join(", ")})`,
    `join public.projects p on p.slug = v.slug;`,
  ].join("\n");

export const buildSeedSql = () =>
  [
    "-- File ini dibuat otomatis oleh supabase/seed/generate.ts. Jangan diedit langsung.",
    "-- Sumber: supabase/seed/content.ts (konten portofolio Laravel lama).",
    "",
    "-- TODO: tambahkan email admin, misalnya:",
    "-- insert into public.admins (email) values ('email-admin@contoh.com');",
    "",
    insert(
      "projects",
      [
        "slug",
        "title",
        "category",
        "label",
        "color",
        "thumbnail",
        "tagline",
        "description",
        "features",
        "technologies",
        "sort_order",
        "is_published",
      ],
      projects.map((p, index) => [
        text(p.slug),
        text(p.title),
        text(p.category),
        json(p.label),
        text(p.color),
        text(p.thumbnail),
        json(p.tagline),
        json(p.description),
        json(p.features),
        textArray(p.technologies),
        String(index + 1),
        "true",
      ]),
    ),
    "",
    projectChildren(
      "project_images",
      ["path", "alt", "sort_order"],
      projects.flatMap((p) =>
        p.images.map((image, index) => ({
          slug: p.slug,
          values: [text(image.path), json(image.alt), String(index + 1)],
        })),
      ),
    ),
    "",
    projectChildren(
      "project_steps",
      ["title", "description", "sort_order"],
      projects.flatMap((p) =>
        p.steps.map((step, index) => ({
          slug: p.slug,
          values: [json(step.title), json(step.description), String(index + 1)],
        })),
      ),
    ),
    "",
    insert(
      "skills",
      ["category", "icon", "items", "sort_order"],
      skills.map((s, index) => [
        json(s.category),
        text(s.icon),
        textArray(s.items),
        String(index + 1),
      ]),
    ),
    "",
    insert(
      "experiences",
      ["title", "place", "period", "description", "sort_order"],
      experiences.map((e, index) => [
        json(e.title),
        json(e.place),
        json(e.period),
        json(e.description),
        String(index + 1),
      ]),
    ),
    "",
    insert(
      "education",
      ["institution", "degree", "period", "icon", "sort_order"],
      education.map((e, index) => [
        text(e.institution),
        json(e.degree),
        json(e.period),
        text(e.icon),
        String(index + 1),
      ]),
    ),
    "",
    insert(
      "achievements",
      ["title", "detail", "icon", "sort_order"],
      achievements.map((a, index) => [
        json(a.title),
        json(a.detail),
        text(a.icon),
        String(index + 1),
      ]),
    ),
    "",
    insert(
      "organizations",
      ["role", "organization", "period", "description", "sort_order"],
      organizations.map((o, index) => [
        json(o.role),
        text(o.organization),
        json(o.period),
        json(o.description),
        String(index + 1),
      ]),
    ),
    "",
    "-- Sertifikat sengaja kosong: portofolio lama belum punya datanya.",
    "",
  ].join("\n");

if (
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
  const target = new URL("../seed.sql", import.meta.url);
  writeFileSync(target, buildSeedSql());
  console.log(`Ditulis: ${target.pathname}`);
}
