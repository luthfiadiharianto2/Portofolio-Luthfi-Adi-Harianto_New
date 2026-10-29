import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { moveProject, setProjectPublished } from "@/app/admin/actions/projects";
import { iconButtonStyles, buttonStyles } from "@/components/ui/button-styles";
import { listProjects } from "@/lib/admin/data";
import { CATEGORY_LABELS } from "@/lib/validators/project";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Proyek" };

const NOTICES: Record<string, string> = {
  dihapus: "Proyek beserta gambarnya sudah dihapus.",
};

export default async function ProjectsPage({
  searchParams,
}: PageProps<"/admin/projects">) {
  const [projects, { status }] = await Promise.all([
    listProjects(),
    searchParams,
  ]);
  const notice = typeof status === "string" ? NOTICES[status] : undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold">Proyek</h1>
          <p className="text-sm text-muted">
            Urutan di sini sama dengan urutan di halaman publik.
          </p>
        </div>
        <Link href="/admin/projects/new" className={buttonStyles.primary}>
          <Plus aria-hidden="true" className="size-4" />
          Proyek baru
        </Link>
      </div>
      {notice ? (
        <p
          role="status"
          className="rounded-control bg-accent-3/10 px-4 py-3 text-sm text-accent-3"
        >
          {notice}
        </p>
      ) : null}

      {projects.length === 0 ? (
        <p className="rounded-card glass p-6 text-muted">Belum ada proyek.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {projects.map((project, index) => (
            <li
              key={project.id}
              className="flex flex-col gap-4 rounded-card glass p-4 sm:flex-row sm:items-center"
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <span className="w-6 shrink-0 text-center text-sm text-muted">
                  {index + 1}
                </span>
                <Image
                  src={project.thumbnail}
                  alt=""
                  width={96}
                  height={64}
                  className="h-16 w-24 shrink-0 rounded-control object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate font-medium">{project.title}</p>
                  <p className="flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span>{CATEGORY_LABELS[project.category]}</span>
                    <span aria-hidden="true">·</span>
                    <span>/{project.slug}</span>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5",
                        project.is_published
                          ? "bg-accent-3/10 text-accent-3"
                          : "bg-glass-border",
                      )}
                    >
                      {project.is_published ? "Terbit" : "Draf"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-1">
                <form action={moveProject}>
                  <input type="hidden" name="id" value={project.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button
                    type="submit"
                    disabled={index === 0}
                    aria-label={`Naikkan ${project.title}`}
                    className={cn(iconButtonStyles, "disabled:opacity-30")}
                  >
                    <ArrowUp aria-hidden="true" className="size-4" />
                  </button>
                </form>
                <form action={moveProject}>
                  <input type="hidden" name="id" value={project.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button
                    type="submit"
                    disabled={index === projects.length - 1}
                    aria-label={`Turunkan ${project.title}`}
                    className={cn(iconButtonStyles, "disabled:opacity-30")}
                  >
                    <ArrowDown aria-hidden="true" className="size-4" />
                  </button>
                </form>
                <form action={setProjectPublished}>
                  <input type="hidden" name="id" value={project.id} />
                  <input
                    type="hidden"
                    name="published"
                    value={String(!project.is_published)}
                  />
                  <button type="submit" className={buttonStyles.ghost}>
                    {project.is_published ? (
                      <EyeOff aria-hidden="true" className="size-4" />
                    ) : (
                      <Eye aria-hidden="true" className="size-4" />
                    )}
                    {project.is_published ? "Jadikan draf" : "Terbitkan"}
                    <span className="sr-only"> {project.title}</span>
                  </button>
                </form>
                <Link
                  href={`/admin/projects/${project.id}`}
                  className={buttonStyles.secondary}
                >
                  <Pencil aria-hidden="true" className="size-4" />
                  Ubah<span className="sr-only"> {project.title}</span>
                </Link>
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
