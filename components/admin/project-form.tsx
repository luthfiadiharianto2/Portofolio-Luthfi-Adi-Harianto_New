"use client";

import { createProject, updateProject } from "@/app/admin/actions/projects";
import {
  describedBy,
  FormField,
  inputStyles,
} from "@/components/ui/form-field";
import { CATEGORY_LABELS, PROJECT_CATEGORIES } from "@/lib/validators/project";
import { cn } from "@/lib/utils";
import { SubmitButton } from "./buttons";
import { Bilingual, type Errors, Section, Text } from "./fields";
import { FormStatus } from "./form-status";
import { ImageUpload } from "./image-upload";
import { useAdminForm } from "./use-admin-form";

export type ProjectFormDefaults = {
  id: string;
  slug: string;
  title: string;
  category: (typeof PROJECT_CATEGORIES)[number];
  color: string;
  thumbnail: string;
  label: { id: string; en: string };
  tagline: { id: string; en: string };
  description: { id: string; en: string };
  features: { id: string[]; en: string[] };
  technologies: string[];
  demo_url: string;
  repo_url: string;
  is_published: boolean;
};

export const ProjectForm = ({
  mode,
  defaults,
}: {
  mode: "create" | "edit";
  defaults: ProjectFormDefaults;
}) => {
  const { state, onSubmit, pending } = useAdminForm(
    mode === "create" ? createProject : updateProject,
  );
  const errors: Errors =
    state.status === "error" ? (state.fieldErrors ?? {}) : {};

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <input type="hidden" name="id" value={defaults.id} />

      <Section title="Identitas">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Text
            name="title"
            label="Judul"
            defaultValue={defaults.title}
            errors={errors}
            maxLength={120}
            required
          />
          <Text
            name="slug"
            label="Slug (alamat halaman)"
            defaultValue={defaults.slug}
            errors={errors}
            hint="Huruf kecil, angka, dan tanda hubung. Contoh: borrowit-app."
            maxLength={80}
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            required
          />
          <FormField id="category" label="Kategori" error={errors.category}>
            <select
              id="category"
              name="category"
              defaultValue={defaults.category}
              aria-invalid={errors.category ? true : undefined}
              aria-describedby={describedBy("category", {
                error: errors.category,
              })}
              className={inputStyles}
            >
              {PROJECT_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {CATEGORY_LABELS[category]}
                </option>
              ))}
            </select>
          </FormField>
          <FormField
            id="color"
            label="Warna aksen"
            error={errors.color}
            hint="Dipakai untuk aksen kartu proyek."
          >
            <input
              id="color"
              name="color"
              type="color"
              defaultValue={defaults.color.toLowerCase()}
              aria-describedby={describedBy("color", {
                error: errors.color,
                hint: "Dipakai untuk aksen kartu proyek.",
              })}
              className={cn(inputStyles, "h-12 p-1")}
            />
          </FormField>
        </div>
        <label className="flex min-h-(--spacing-touch) items-center gap-3">
          <input
            type="checkbox"
            name="is_published"
            defaultChecked={defaults.is_published}
            className="size-5 accent-(--color-accent-3)"
          />
          Terbitkan di situs
        </label>
      </Section>

      <Section title="Gambar sampul">
        <ImageUpload
          projectId={defaults.id}
          name="thumbnail"
          label="Sampul kartu proyek"
          defaultValue={defaults.thumbnail}
          error={errors.thumbnail}
        />
      </Section>

      <Section title="Teks dwibahasa">
        <Bilingual
          name="label"
          label="Label kartu"
          value={defaults.label}
          errors={errors}
          maxLength={60}
        />
        <Bilingual
          name="tagline"
          label="Tagline"
          value={defaults.tagline}
          errors={errors}
          maxLength={200}
        />
        <Bilingual
          name="description"
          label="Deskripsi"
          value={defaults.description}
          errors={errors}
          multiline
          rows={6}
          maxLength={4000}
        />
        <Bilingual
          name="features"
          label="Fitur"
          value={{
            id: defaults.features.id.join("\n"),
            en: defaults.features.en.join("\n"),
          }}
          errors={errors}
          multiline
          rows={5}
          maxLength={4000}
          hint="Satu fitur per baris. Jumlah baris ID dan EN harus sama."
        />
      </Section>

      <Section title="Teknologi dan tautan">
        <Text
          name="technologies"
          label="Teknologi"
          defaultValue={defaults.technologies.join(", ")}
          errors={errors}
          hint="Pisahkan dengan koma. Nama yang dikenali (misalnya Figma, Laravel) tampil dengan logonya."
          maxLength={1000}
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Text
            name="demo_url"
            label="URL demo (opsional)"
            type="url"
            defaultValue={defaults.demo_url}
            errors={errors}
            placeholder="https://"
            maxLength={500}
          />
          <Text
            name="repo_url"
            label="URL repositori (opsional)"
            type="url"
            defaultValue={defaults.repo_url}
            errors={errors}
            placeholder="https://"
            maxLength={500}
          />
        </div>
      </Section>

      <div className="sticky bottom-4 flex flex-wrap items-center gap-4 rounded-card glass-strong p-4">
        <SubmitButton pending={pending}>
          {mode === "create" ? "Buat proyek" : "Simpan perubahan"}
        </SubmitButton>
        <FormStatus state={state} className="flex-1" />
      </div>
    </form>
  );
};
