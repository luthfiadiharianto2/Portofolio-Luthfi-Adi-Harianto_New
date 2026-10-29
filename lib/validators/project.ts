import { z } from "zod";
import { isAllowedProjectImage } from "@/lib/admin/media";

// Validasi form admin (server). Batas panjang mengikuti CHECK di database, ditambah batas
// wajar untuk teks bebas. Pesan galat langsung berbahasa Indonesia karena admin satu bahasa.

export const PROJECT_CATEGORIES = ["uiux", "web", "data", "qa"] as const;
export const CATEGORY_LABELS: Record<
  (typeof PROJECT_CATEGORIES)[number],
  string
> = {
  uiux: "UI/UX",
  web: "Web",
  data: "Data",
  qa: "QA",
};

const text = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} wajib diisi.`)
    .max(max, `${label} maksimal ${max} karakter.`);

const lines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const optionalHttps = (label: string) =>
  z
    .string()
    .trim()
    .max(500, `${label} terlalu panjang.`)
    .refine(
      (value) => value === "" || /^https:\/\/[^\s]+$/.test(value),
      `${label} harus diawali https://.`,
    )
    .transform((value) => value || null);

export const uuidSchema = z.uuid("ID tidak valid.");

const projectFieldsSchema = z.object({
  id: uuidSchema,
  slug: z
    .string()
    .trim()
    .min(1, "Slug wajib diisi.")
    .max(80, "Slug maksimal 80 karakter.")
    .regex(
      /^[a-z0-9]+(-[a-z0-9]+)*$/,
      "Slug hanya huruf kecil, angka, dan tanda hubung (contoh: borrowit-app).",
    ),
  title: text("Judul", 120),
  category: z.enum(PROJECT_CATEGORIES, "Pilih kategori."),
  color: z
    .string()
    .regex(
      /^#[0-9A-Fa-f]{6}$/,
      "Warna harus berbentuk heksadesimal, misalnya #8B5CF6.",
    ),
  thumbnail: z.string().trim().min(1, "Gambar sampul wajib ada."),
  label_id: text("Label (ID)", 60),
  label_en: text("Label (EN)", 60),
  tagline_id: text("Tagline (ID)", 200),
  tagline_en: text("Tagline (EN)", 200),
  description_id: text("Deskripsi (ID)", 4000),
  description_en: text("Deskripsi (EN)", 4000),
  features_id: z.string().transform(lines),
  features_en: z.string().transform(lines),
  technologies: z
    .string()
    .transform((value) => [
      ...new Set(
        value
          .split(/[,\n]/)
          .map((item) => item.trim())
          .filter(Boolean),
      ),
    ])
    .pipe(
      z
        .array(z.string().max(40, "Nama teknologi maksimal 40 karakter."))
        .max(20, "Maksimal 20 teknologi."),
    ),
  demo_url: optionalHttps("URL demo"),
  repo_url: optionalHttps("URL repositori"),
  is_published: z.boolean(),
});

export const projectFormSchema = projectFieldsSchema
  .refine((value) => isAllowedProjectImage(value.thumbnail, value.id), {
    path: ["thumbnail"],
    message:
      "Gambar sampul harus diunggah lewat form ini atau berupa path /images/.",
  })
  .refine((value) => value.features_id.length === value.features_en.length, {
    path: ["features_en"],
    message: "Jumlah baris fitur ID dan EN harus sama.",
  })
  .transform((value) => ({
    id: value.id,
    slug: value.slug,
    title: value.title,
    category: value.category,
    color: value.color.toUpperCase(),
    thumbnail: value.thumbnail,
    label: { id: value.label_id, en: value.label_en },
    tagline: { id: value.tagline_id, en: value.tagline_en },
    description: { id: value.description_id, en: value.description_en },
    features: { id: value.features_id, en: value.features_en },
    technologies: value.technologies,
    demo_url: value.demo_url,
    repo_url: value.repo_url,
    is_published: value.is_published,
  }));
export type ProjectInput = z.output<typeof projectFormSchema>;

const PROJECT_FIELDS = Object.keys(projectFieldsSchema.shape) as Array<
  keyof typeof projectFieldsSchema.shape
>;

/** Membaca FormData form proyek menjadi objek mentah untuk projectFormSchema. */
export const projectFormValues = (formData: FormData) =>
  Object.fromEntries(
    PROJECT_FIELDS.map((field) =>
      field === "is_published"
        ? [field, formData.get(field) === "on"]
        : [field, String(formData.get(field) ?? "")],
    ),
  );

export const imageFormSchema = z.object({
  alt_id: text("Teks alternatif (ID)", 200),
  alt_en: text("Teks alternatif (EN)", 200),
});

export const stepFormSchema = z.object({
  title_id: text("Judul langkah (ID)", 120),
  title_en: text("Judul langkah (EN)", 120),
  description_id: text("Penjelasan (ID)", 1000),
  description_en: text("Penjelasan (EN)", 1000),
});

/** Galat per kolom dari ZodError (pesan pertama tiap kolom). */
export const fieldErrorsOf = (error: z.ZodError) => {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
};
