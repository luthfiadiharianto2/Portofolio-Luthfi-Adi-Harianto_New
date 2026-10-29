"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { type AdminSession, requireAdminAction } from "@/lib/admin/auth";
import {
  type AdminFormState,
  type Direction,
  reorderedRows,
} from "@/lib/admin/form-state";
import {
  isAllowedProjectImage,
  PROJECT_MEDIA_BUCKET,
  projectMediaFolder,
  projectMediaPath,
} from "@/lib/admin/media";
import { CACHE_TAGS } from "@/lib/data/content";
import {
  fieldErrorsOf,
  imageFormSchema,
  projectFormSchema,
  projectFormValues,
  stepFormSchema,
  uuidSchema,
} from "@/lib/validators/project";

// Semua aksi memeriksa admin lebih dulu (requireAdminAction), lalu memperbarui cache
// halaman publik lewat updateTag agar perubahan langsung terlihat.

const UNIQUE_VIOLATION = "23505";

const fail = (message: string, fieldErrors?: Record<string, string>) =>
  ({ status: "error", message, fieldErrors }) as const;

const idOf = (formData: FormData, field = "id") =>
  uuidSchema.parse(formData.get(field));

const directionOf = (formData: FormData): Direction =>
  formData.get("direction") === "up" ? "up" : "down";

const check = (result: { error: { message: string } | null }) => {
  if (result.error) throw new Error(`Gagal menyimpan: ${result.error.message}`);
};

// Halaman publik dibaca ulang dari database, halaman admin yang terbuka ikut diperbarui.
const publishProjects = () => {
  updateTag(CACHE_TAGS.projects);
  refresh();
};

/** Menghapus file project-media bila URL-nya memang file bucket itu. */
const removeMedia = async ({ supabase }: AdminSession, urls: string[]) => {
  const paths = urls
    .map(projectMediaPath)
    .filter((path): path is string => path !== null);
  if (paths.length > 0)
    check(await supabase.storage.from(PROJECT_MEDIA_BUCKET).remove(paths));
};

const nextSortOrder = async (
  query: PromiseLike<{ data: { sort_order: number }[] | null }>,
) => {
  const { data } = await query;
  return (data?.[0]?.sort_order ?? -1) + 1;
};

// ───────────────────────── Proyek ─────────────────────────

const parseProject = (formData: FormData) => {
  const parsed = projectFormSchema.safeParse(projectFormValues(formData));
  if (parsed.success) return { ok: true as const, data: parsed.data };
  return {
    ok: false as const,
    state: fail(
      "Periksa kembali isian yang ditandai.",
      fieldErrorsOf(parsed.error),
    ),
  };
};

export const createProject = async (
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> => {
  const session = await requireAdminAction();
  const parsed = parseProject(formData);
  if (!parsed.ok) return parsed.state;

  const sortOrder = await nextSortOrder(
    session.supabase
      .from("projects")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1),
  );
  const { error } = await session.supabase
    .from("projects")
    .insert({ ...parsed.data, sort_order: sortOrder });
  if (error?.code === UNIQUE_VIOLATION)
    return fail("Slug sudah dipakai proyek lain.", {
      slug: "Slug sudah dipakai.",
    });
  if (error) return fail(`Gagal menyimpan: ${error.message}`);

  publishProjects();
  redirect(`/admin/projects/${parsed.data.id}?status=dibuat`);
};

export const updateProject = async (
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> => {
  const session = await requireAdminAction();
  const parsed = parseProject(formData);
  if (!parsed.ok) return parsed.state;
  const { id, ...fields } = parsed.data;

  const { data: before } = await session.supabase
    .from("projects")
    .select("thumbnail")
    .eq("id", id)
    .maybeSingle();
  if (!before) return fail("Proyek tidak ditemukan.");

  const { error } = await session.supabase
    .from("projects")
    .update(fields)
    .eq("id", id);
  if (error?.code === UNIQUE_VIOLATION)
    return fail("Slug sudah dipakai proyek lain.", {
      slug: "Slug sudah dipakai.",
    });
  if (error) return fail(`Gagal menyimpan: ${error.message}`);

  // Sampul lama yang diganti tidak dipakai lagi.
  if (before.thumbnail !== fields.thumbnail)
    await removeMedia(session, [before.thumbnail]);

  publishProjects();
  return { status: "success", message: "Perubahan tersimpan." };
};

export const deleteProject = async (formData: FormData) => {
  const session = await requireAdminAction();
  const id = idOf(formData);

  // Hapus semua file di folder proyek, lalu barisnya (gambar dan langkah ikut terhapus).
  const bucket = session.supabase.storage.from(PROJECT_MEDIA_BUCKET);
  const folder = projectMediaFolder(id);
  const { data: files } = await bucket.list(folder, { limit: 1000 });
  if (files && files.length > 0)
    check(await bucket.remove(files.map((file) => `${folder}/${file.name}`)));
  check(await session.supabase.from("projects").delete().eq("id", id));

  publishProjects();
  redirect("/admin/projects?status=dihapus");
};

export const setProjectPublished = async (formData: FormData) => {
  const session = await requireAdminAction();
  check(
    await session.supabase
      .from("projects")
      .update({ is_published: formData.get("published") === "true" })
      .eq("id", idOf(formData)),
  );
  publishProjects();
};

export const moveProject = async (formData: FormData) => {
  const session = await requireAdminAction();
  const { data } = await session.supabase
    .from("projects")
    .select("id, sort_order")
    .order("sort_order")
    .order("created_at");
  const changes = reorderedRows(
    data ?? [],
    idOf(formData),
    directionOf(formData),
  );
  await Promise.all(
    changes.map(async ({ id, sort_order }) =>
      check(
        await session.supabase
          .from("projects")
          .update({ sort_order })
          .eq("id", id),
      ),
    ),
  );
  publishProjects();
};

// ───────────────────────── Galeri ─────────────────────────

export const addProjectImage = async (
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> => {
  const session = await requireAdminAction();
  const projectId = idOf(formData, "project_id");
  const path = String(formData.get("path") ?? "");
  if (!projectMediaPath(path) || !isAllowedProjectImage(path, projectId))
    return fail("Unggah gambar terlebih dahulu.", {
      path: "Unggah gambar terlebih dahulu.",
    });
  const alt = imageFormSchema.safeParse({
    alt_id: formData.get("alt_id"),
    alt_en: formData.get("alt_en"),
  });
  if (!alt.success)
    return fail(
      "Periksa kembali isian yang ditandai.",
      fieldErrorsOf(alt.error),
    );

  const sortOrder = await nextSortOrder(
    session.supabase
      .from("project_images")
      .select("sort_order")
      .eq("project_id", projectId)
      .order("sort_order", { ascending: false })
      .limit(1),
  );
  const { error } = await session.supabase.from("project_images").insert({
    project_id: projectId,
    path,
    alt: { id: alt.data.alt_id, en: alt.data.alt_en },
    sort_order: sortOrder,
  });
  if (error) return fail(`Gagal menyimpan: ${error.message}`);

  publishProjects();
  return {
    status: "success",
    message: "Gambar ditambahkan ke galeri.",
    nonce: crypto.randomUUID(),
  };
};

export const updateProjectImage = async (
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> => {
  const session = await requireAdminAction();
  const alt = imageFormSchema.safeParse({
    alt_id: formData.get("alt_id"),
    alt_en: formData.get("alt_en"),
  });
  if (!alt.success)
    return fail(
      "Periksa kembali isian yang ditandai.",
      fieldErrorsOf(alt.error),
    );
  const { error } = await session.supabase
    .from("project_images")
    .update({ alt: { id: alt.data.alt_id, en: alt.data.alt_en } })
    .eq("id", idOf(formData));
  if (error) return fail(`Gagal menyimpan: ${error.message}`);

  publishProjects();
  return { status: "success", message: "Teks alternatif tersimpan." };
};

export const deleteProjectImage = async (formData: FormData) => {
  const session = await requireAdminAction();
  const id = idOf(formData);
  const { data } = await session.supabase
    .from("project_images")
    .select("path")
    .eq("id", id)
    .maybeSingle();
  check(await session.supabase.from("project_images").delete().eq("id", id));
  if (data) await removeMedia(session, [data.path]);
  publishProjects();
};

export const moveProjectImage = async (formData: FormData) => {
  const session = await requireAdminAction();
  const { data } = await session.supabase
    .from("project_images")
    .select("id, sort_order")
    .eq("project_id", idOf(formData, "project_id"))
    .order("sort_order");
  const changes = reorderedRows(
    data ?? [],
    idOf(formData),
    directionOf(formData),
  );
  await Promise.all(
    changes.map(async ({ id, sort_order }) =>
      check(
        await session.supabase
          .from("project_images")
          .update({ sort_order })
          .eq("id", id),
      ),
    ),
  );
  publishProjects();
};

// ───────────────────────── Langkah pengerjaan ─────────────────────────

const parseStep = (formData: FormData) =>
  stepFormSchema.safeParse({
    title_id: formData.get("title_id"),
    title_en: formData.get("title_en"),
    description_id: formData.get("description_id"),
    description_en: formData.get("description_en"),
  });

export const saveProjectStep = async (
  _previous: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> => {
  const session = await requireAdminAction();
  const parsed = parseStep(formData);
  if (!parsed.success)
    return fail(
      "Periksa kembali isian yang ditandai.",
      fieldErrorsOf(parsed.error),
    );
  const fields = {
    title: { id: parsed.data.title_id, en: parsed.data.title_en },
    description: {
      id: parsed.data.description_id,
      en: parsed.data.description_en,
    },
  };

  const stepId = formData.get("id");
  if (stepId) {
    const { error } = await session.supabase
      .from("project_steps")
      .update(fields)
      .eq("id", uuidSchema.parse(stepId));
    if (error) return fail(`Gagal menyimpan: ${error.message}`);
  } else {
    const projectId = idOf(formData, "project_id");
    const sortOrder = await nextSortOrder(
      session.supabase
        .from("project_steps")
        .select("sort_order")
        .eq("project_id", projectId)
        .order("sort_order", { ascending: false })
        .limit(1),
    );
    const { error } = await session.supabase
      .from("project_steps")
      .insert({ ...fields, project_id: projectId, sort_order: sortOrder });
    if (error) return fail(`Gagal menyimpan: ${error.message}`);
  }

  publishProjects();
  return {
    status: "success",
    message: stepId ? "Langkah tersimpan." : "Langkah ditambahkan.",
    nonce: crypto.randomUUID(),
  };
};

export const deleteProjectStep = async (formData: FormData) => {
  const session = await requireAdminAction();
  check(
    await session.supabase
      .from("project_steps")
      .delete()
      .eq("id", idOf(formData)),
  );
  publishProjects();
};

export const moveProjectStep = async (formData: FormData) => {
  const session = await requireAdminAction();
  const { data } = await session.supabase
    .from("project_steps")
    .select("id, sort_order")
    .eq("project_id", idOf(formData, "project_id"))
    .order("sort_order");
  const changes = reorderedRows(
    data ?? [],
    idOf(formData),
    directionOf(formData),
  );
  await Promise.all(
    changes.map(async ({ id, sort_order }) =>
      check(
        await session.supabase
          .from("project_steps")
          .update({ sort_order })
          .eq("id", id),
      ),
    ),
  );
  publishProjects();
};
