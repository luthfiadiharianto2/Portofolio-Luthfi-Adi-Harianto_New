import type { ProjectFormDefaults } from "@/components/admin/project-form";
import { localizedListSchema, localizedSchema } from "@/lib/localized";
import type { EditableProject } from "./data";

const EMPTY = { id: "", en: "" };

/** Teks dwibahasa dari kolom jsonb (kosong bila bentuknya tidak sesuai). */
export const localizedOf = (value: unknown) =>
  localizedSchema.safeParse(value).data ?? EMPTY;

/** Isian awal form proyek baru. ID dibuat di server agar unggahan langsung punya folder. */
export const newProjectDefaults = (): ProjectFormDefaults => ({
  id: crypto.randomUUID(),
  slug: "",
  title: "",
  category: "uiux",
  color: "#8B5CF6",
  thumbnail: "",
  label: EMPTY,
  tagline: EMPTY,
  description: EMPTY,
  features: { id: [], en: [] },
  technologies: [],
  demo_url: "",
  repo_url: "",
  is_published: false,
});

export const projectDefaults = (
  project: EditableProject,
): ProjectFormDefaults => ({
  id: project.id,
  slug: project.slug,
  title: project.title,
  category: project.category,
  color: project.color,
  thumbnail: project.thumbnail,
  label: localizedOf(project.label),
  tagline: localizedOf(project.tagline),
  description: localizedOf(project.description),
  features: localizedListSchema.safeParse(project.features).data ?? {
    id: [],
    en: [],
  },
  technologies: project.technologies,
  demo_url: project.demo_url ?? "",
  repo_url: project.repo_url ?? "",
  is_published: project.is_published,
});
