import type { Metadata } from "next";
import Link from "next/link";
import { ProjectForm } from "@/components/admin/project-form";
import { requireAdminPage } from "@/lib/admin/auth";
import { newProjectDefaults } from "@/lib/admin/project-defaults";

export const metadata: Metadata = { title: "Proyek baru" };

export default async function NewProjectPage() {
  await requireAdminPage();
  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/projects"
          className="text-sm text-muted hover:text-fg"
        >
          ← Semua proyek
        </Link>
        <h1 className="mt-1 font-heading text-2xl font-bold">Proyek baru</h1>
        <p className="text-sm text-muted">
          Galeri dan langkah pengerjaan bisa ditambahkan setelah proyek dibuat.
        </p>
      </div>
      <ProjectForm mode="create" defaults={newProjectDefaults()} />
    </div>
  );
}
