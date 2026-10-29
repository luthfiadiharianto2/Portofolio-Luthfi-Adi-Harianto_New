import "server-only";
import { requireAdminPage } from "./auth";

// Data halaman admin. Dibaca dengan sesi admin (RLS mengizinkan semua baris, termasuk
// yang belum terbit) dan tidak di-cache: admin selalu melihat isi database terbaru.

const unwrap = <T>({
  data,
  error,
}: {
  data: T | null;
  error: { message: string } | null;
}): T => {
  if (error) throw new Error(`Gagal membaca Supabase: ${error.message}`);
  return data as T;
};

export const MESSAGES_PER_PAGE = 20;

export const getDashboardCounts = async () => {
  const { supabase } = await requireAdminPage();
  const count = async (
    query: PromiseLike<{
      count: number | null;
      error: { message: string } | null;
    }>,
  ) => {
    const { count: value, error } = await query;
    if (error) throw new Error(`Gagal membaca Supabase: ${error.message}`);
    return value ?? 0;
  };
  const head = { count: "exact", head: true } as const;
  const [projects, drafts, unread, pending] = await Promise.all([
    count(supabase.from("projects").select("id", head)),
    count(
      supabase.from("projects").select("id", head).eq("is_published", false),
    ),
    count(supabase.from("messages").select("id", head).eq("is_read", false)),
    count(
      supabase.from("guestbook").select("id", head).eq("is_approved", false),
    ),
  ]);
  return { projects, drafts, unread, pending };
};

export const listProjects = async () => {
  const { supabase } = await requireAdminPage();
  return unwrap(
    await supabase
      .from("projects")
      .select("id, slug, title, category, thumbnail, is_published, sort_order")
      .order("sort_order")
      .order("created_at"),
  );
};

export const getProjectForEdit = async (id: string) => {
  const { supabase } = await requireAdminPage();
  const { data: project, error } = await supabase
    .from("projects")
    .select(
      "id, slug, title, category, color, thumbnail, label, tagline, description, features, technologies, demo_url, repo_url, is_published, project_images (id, path, alt, sort_order), project_steps (id, title, description, sort_order)",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Gagal membaca Supabase: ${error.message}`);
  if (!project) return null;
  project.project_images.sort((a, b) => a.sort_order - b.sort_order);
  project.project_steps.sort((a, b) => a.sort_order - b.sort_order);
  return project;
};
export type EditableProject = NonNullable<
  Awaited<ReturnType<typeof getProjectForEdit>>
>;

export const listGuestbook = async (approved: boolean) => {
  const { supabase } = await requireAdminPage();
  return unwrap(
    await supabase
      .from("guestbook")
      .select("id, name, message, avatar_path, is_approved, created_at")
      .eq("is_approved", approved)
      .order("created_at", { ascending: false })
      .limit(100),
  );
};

export const listMessages = async (page: number) => {
  const { supabase } = await requireAdminPage();
  const from = (page - 1) * MESSAGES_PER_PAGE;
  const { data, error, count } = await supabase
    .from("messages")
    .select("id, name, email, body, is_read, created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + MESSAGES_PER_PAGE - 1);
  if (error) throw new Error(`Gagal membaca Supabase: ${error.message}`);
  return { messages: data, total: count ?? 0 };
};
