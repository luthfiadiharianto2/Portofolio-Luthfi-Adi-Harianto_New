import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { localizedListSchema, localizedSchema } from "@/lib/localized";
import { createPublicClient } from "@/lib/supabase/public";

// Semua konten publik dibaca dari Supabase lewat fungsi ber-cache ini.
// Revalidasi per jam, ditambah on-demand lewat tag saat admin menyimpan (Tahap 7).
export const CACHE_TAGS = {
  projects: "projects",
  background: "background",
  certificates: "certificates",
  guestbook: "guestbook",
} as const;

const projectCategorySchema = z.enum(["uiux", "web", "data", "qa"]);
export type ProjectCategory = z.infer<typeof projectCategorySchema>;

const projectSummarySchema = z.object({
  slug: z.string(),
  title: z.string(),
  category: projectCategorySchema,
  label: localizedSchema,
  color: z.string(),
  thumbnail: z.string(),
  tagline: localizedSchema,
  technologies: z.array(z.string()),
});
export type ProjectSummary = z.infer<typeof projectSummarySchema>;

const projectDetailSchema = projectSummarySchema.extend({
  description: localizedSchema,
  features: localizedListSchema,
  demo_url: z.string().nullable(),
  repo_url: z.string().nullable(),
  project_images: z.array(
    z.object({
      path: z.string(),
      alt: localizedSchema,
      sort_order: z.number(),
    }),
  ),
  project_steps: z.array(
    z.object({
      title: localizedSchema,
      description: localizedSchema,
      sort_order: z.number(),
    }),
  ),
});
export type ProjectDetail = z.infer<typeof projectDetailSchema>;

const SUMMARY_COLUMNS =
  "slug, title, category, label, color, thumbnail, tagline, technologies";

const unwrap = <T>({
  data,
  error,
}: {
  data: T | null;
  error: { message: string } | null;
}) => {
  if (error) throw new Error(`Gagal membaca Supabase: ${error.message}`);
  return data;
};

export const getProjects = async (): Promise<ProjectSummary[]> => {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.projects);

  const rows = unwrap(
    await createPublicClient()
      .from("projects")
      .select(SUMMARY_COLUMNS)
      .eq("is_published", true)
      .order("sort_order"),
  );
  return z.array(projectSummarySchema).parse(rows ?? []);
};

/** Slug dan waktu ubah proyek terbit, untuk sitemap.xml. */
export const getProjectSitemapEntries = async () => {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.projects);

  const rows = unwrap(
    await createPublicClient()
      .from("projects")
      .select("slug, updated_at")
      .eq("is_published", true)
      .order("sort_order"),
  );
  return z
    .array(z.object({ slug: z.string(), updated_at: z.string() }))
    .parse(rows ?? []);
};

export const getProject = async (
  slug: string,
): Promise<ProjectDetail | null> => {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.projects);

  const row = unwrap(
    await createPublicClient()
      .from("projects")
      .select(
        `${SUMMARY_COLUMNS}, description, features, demo_url, repo_url,
         project_images (path, alt, sort_order),
         project_steps (title, description, sort_order)`,
      )
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle(),
  );
  if (!row) return null;

  const project = projectDetailSchema.parse(row);
  project.project_images.sort((a, b) => a.sort_order - b.sort_order);
  project.project_steps.sort((a, b) => a.sort_order - b.sort_order);
  return project;
};

const skillSchema = z.object({
  category: localizedSchema,
  icon: z.string(),
  items: z.array(z.string()),
});
const experienceSchema = z.object({
  title: localizedSchema,
  place: localizedSchema,
  period: localizedSchema,
  description: localizedSchema,
});
const educationSchema = z.object({
  institution: z.string(),
  degree: localizedSchema,
  period: localizedSchema,
  icon: z.string(),
});
const achievementSchema = z.object({
  title: localizedSchema,
  detail: localizedSchema,
  icon: z.string(),
});
const organizationSchema = z.object({
  role: localizedSchema,
  organization: z.string(),
  period: localizedSchema,
  description: localizedSchema,
});

export type Skill = z.infer<typeof skillSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Achievement = z.infer<typeof achievementSchema>;
export type Organization = z.infer<typeof organizationSchema>;

export const getBackground = async () => {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.background);

  const db = createPublicClient();
  const [skills, experiences, education, achievements, organizations] =
    await Promise.all([
      db.from("skills").select("category, icon, items").order("sort_order"),
      db
        .from("experiences")
        .select("title, place, period, description")
        .order("sort_order"),
      db
        .from("education")
        .select("institution, degree, period, icon")
        .order("sort_order"),
      db.from("achievements").select("title, detail, icon").order("sort_order"),
      db
        .from("organizations")
        .select("role, organization, period, description")
        .order("sort_order"),
    ]);

  return {
    skills: z.array(skillSchema).parse(unwrap(skills) ?? []),
    experiences: z.array(experienceSchema).parse(unwrap(experiences) ?? []),
    education: z.array(educationSchema).parse(unwrap(education) ?? []),
    achievements: z.array(achievementSchema).parse(unwrap(achievements) ?? []),
    organizations: z
      .array(organizationSchema)
      .parse(unwrap(organizations) ?? []),
  };
};

const certificateSchema = z.object({
  title: localizedSchema,
  issuer: z.string(),
  year: z.number(),
  image_path: z.string().nullable(),
  credential_url: z.string().nullable(),
});
export type Certificate = z.infer<typeof certificateSchema>;

export const getCertificates = async (): Promise<Certificate[]> => {
  "use cache";
  cacheLife("hours");
  cacheTag(CACHE_TAGS.certificates);

  const rows = unwrap(
    await createPublicClient()
      .from("certificates")
      .select("title, issuer, year, image_path, credential_url")
      .eq("is_published", true)
      .order("sort_order"),
  );
  return z.array(certificateSchema).parse(rows ?? []);
};

const guestbookEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  message: z.string(),
  avatar_path: z.string().nullable(),
  created_at: z.string(),
});
export type GuestbookEntry = z.infer<typeof guestbookEntrySchema>;
export { guestbookEntrySchema };

export const getApprovedGuestbook = async (): Promise<GuestbookEntry[]> => {
  "use cache";
  cacheLife("minutes");
  cacheTag(CACHE_TAGS.guestbook);

  const rows = unwrap(
    await createPublicClient()
      .from("guestbook")
      .select("id, name, message, avatar_path, created_at")
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(50),
  );
  return z.array(guestbookEntrySchema).parse(rows ?? []);
};
