import { ArrowDown, ArrowUp, ExternalLink, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  deleteProject,
  deleteProjectImage,
  deleteProjectStep,
  moveProjectImage,
  moveProjectStep,
} from "@/app/admin/actions/projects";
import { ConfirmSubmit } from "@/components/admin/buttons";
import {
  AddImageForm,
  ImageAltForm,
  StepForm,
} from "@/components/admin/project-extras";
import { ProjectForm } from "@/components/admin/project-form";
import { iconButtonStyles } from "@/components/ui/button-styles";
import { getProjectForEdit } from "@/lib/admin/data";
import { localizedOf, projectDefaults } from "@/lib/admin/project-defaults";
import { uuidSchema } from "@/lib/validators/project";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Ubah proyek" };

/** Tombol naik/turun untuk baris galeri atau langkah. */
const MoveButtons = ({
  action,
  id,
  projectId,
  index,
  count,
  label,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  projectId: string;
  index: number;
  count: number;
  label: string;
}) => (
  <div className="flex gap-1">
    {(["up", "down"] as const).map((direction) => (
      <form key={direction} action={action}>
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="project_id" value={projectId} />
        <input type="hidden" name="direction" value={direction} />
        <button
          type="submit"
          disabled={direction === "up" ? index === 0 : index === count - 1}
          aria-label={`${direction === "up" ? "Naikkan" : "Turunkan"} ${label}`}
          className={cn(iconButtonStyles, "disabled:opacity-30")}
        >
          {direction === "up" ? (
            <ArrowUp aria-hidden="true" className="size-4" />
          ) : (
            <ArrowDown aria-hidden="true" className="size-4" />
          )}
        </button>
      </form>
    ))}
  </div>
);

export default async function EditProjectPage({
  params,
  searchParams,
}: PageProps<"/admin/projects/[id]">) {
  const [{ id }, { status }] = await Promise.all([params, searchParams]);
  if (!uuidSchema.safeParse(id).success) notFound();
  const project = await getProjectForEdit(id);
  if (!project) notFound();
  const images = project.project_images;
  const steps = project.project_steps;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link
            href="/admin/projects"
            className="text-sm text-muted hover:text-fg"
          >
            ← Semua proyek
          </Link>
          <h1 className="mt-1 font-heading text-2xl font-bold">
            {project.title}
          </h1>
        </div>
        {project.is_published ? (
          <Link
            href={`/id/projects/${project.slug}`}
            target="_blank"
            className="inline-flex min-h-(--spacing-touch) items-center gap-2 text-sm text-muted hover:text-fg"
          >
            Lihat di situs
            <ExternalLink aria-hidden="true" className="size-4" />
            <span className="sr-only">(tab baru)</span>
          </Link>
        ) : null}
      </div>
      {status === "dibuat" ? (
        <p
          role="status"
          className="rounded-control bg-accent-3/10 px-4 py-3 text-sm text-accent-3"
        >
          Proyek dibuat. Tambahkan galeri dan langkah pengerjaan di bawah.
        </p>
      ) : null}

      <ProjectForm mode="edit" defaults={projectDefaults(project)} />

      <section
        aria-labelledby="galeri"
        className="flex flex-col gap-4 rounded-card glass p-5 sm:p-6"
      >
        <h2 id="galeri" className="font-heading text-lg font-semibold">
          Galeri ({images.length})
        </h2>
        <ol className="flex flex-col gap-4">
          {images.map((image, index) => (
            <li
              key={image.id}
              className="flex flex-col gap-4 rounded-control border border-glass-border p-4 lg:flex-row"
            >
              <Image
                src={image.path}
                alt=""
                width={192}
                height={128}
                className="h-32 w-48 shrink-0 rounded-control object-cover"
              />
              <div className="min-w-0 flex-1">
                <ImageAltForm id={image.id} alt={localizedOf(image.alt)} />
              </div>
              <div className="flex items-start gap-1 lg:flex-col">
                <MoveButtons
                  action={moveProjectImage}
                  id={image.id}
                  projectId={project.id}
                  index={index}
                  count={images.length}
                  label={`gambar ${index + 1}`}
                />
                <form action={deleteProjectImage}>
                  <input type="hidden" name="id" value={image.id} />
                  <ConfirmSubmit>
                    <Trash2 aria-hidden="true" className="size-4" />
                    Hapus<span className="sr-only"> gambar {index + 1}</span>
                  </ConfirmSubmit>
                </form>
              </div>
            </li>
          ))}
        </ol>
        <div className="rounded-control border border-dashed border-glass-border p-4">
          <AddImageForm projectId={project.id} />
        </div>
      </section>

      <section
        aria-labelledby="langkah"
        className="flex flex-col gap-4 rounded-card glass p-5 sm:p-6"
      >
        <h2 id="langkah" className="font-heading text-lg font-semibold">
          Langkah pengerjaan ({steps.length})
        </h2>
        <ol className="flex flex-col gap-4">
          {steps.map((step, index) => (
            <li
              key={step.id}
              className="flex flex-col gap-4 rounded-control border border-glass-border p-4 lg:flex-row"
            >
              <span className="font-heading text-lg font-bold text-accent-3">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <StepForm
                  projectId={project.id}
                  step={{
                    id: step.id,
                    title: localizedOf(step.title),
                    description: localizedOf(step.description),
                  }}
                />
              </div>
              <div className="flex items-start gap-1 lg:flex-col">
                <MoveButtons
                  action={moveProjectStep}
                  id={step.id}
                  projectId={project.id}
                  index={index}
                  count={steps.length}
                  label={`langkah ${index + 1}`}
                />
                <form action={deleteProjectStep}>
                  <input type="hidden" name="id" value={step.id} />
                  <ConfirmSubmit>
                    <Trash2 aria-hidden="true" className="size-4" />
                    Hapus<span className="sr-only"> langkah {index + 1}</span>
                  </ConfirmSubmit>
                </form>
              </div>
            </li>
          ))}
        </ol>
        <div className="rounded-control border border-dashed border-glass-border p-4">
          <h3 className="mb-3 text-sm font-medium">Langkah baru</h3>
          <StepForm projectId={project.id} />
        </div>
      </section>

      <section
        aria-labelledby="zona-bahaya"
        className="flex flex-col items-start gap-3 rounded-card border border-accent-2/40 p-5 sm:p-6"
      >
        <h2 id="zona-bahaya" className="font-heading text-lg font-semibold">
          Hapus proyek
        </h2>
        <p className="text-sm text-muted">
          Proyek, galeri, langkah, dan semua gambar yang diunggah untuknya akan
          dihapus permanen.
        </p>
        <form action={deleteProject}>
          <input type="hidden" name="id" value={project.id} />
          <ConfirmSubmit confirmLabel="Klik lagi untuk menghapus permanen">
            <Trash2 aria-hidden="true" className="size-4" />
            Hapus proyek ini
          </ConfirmSubmit>
        </form>
      </section>
    </div>
  );
}
