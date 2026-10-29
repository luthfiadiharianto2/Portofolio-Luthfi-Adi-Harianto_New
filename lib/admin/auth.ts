import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createSessionClient } from "@/lib/supabase/server";

export type AdminSession = {
  email: string;
  supabase: Awaited<ReturnType<typeof createSessionClient>>;
};

type SessionState =
  | { kind: "guest" }
  | { kind: "forbidden"; email: string }
  | ({ kind: "admin" } & AdminSession);

// Satu sumber kebenaran untuk akses admin (Data Access Layer). getClaims() memverifikasi
// token sesi; status admin ditanyakan ke database (tabel admins lewat public.is_admin()),
// jadi aplikasi dan RLS memakai aturan yang sama. Di-dedupe per permintaan.
export const getSessionState = cache(async (): Promise<SessionState> => {
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getClaims();
  const email = data?.claims.email;
  if (typeof email !== "string" || email.length === 0) return { kind: "guest" };

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || isAdmin !== true) return { kind: "forbidden", email };
  return { kind: "admin", email, supabase };
});

/** Untuk halaman admin: mengalihkan ke /admin/login bila bukan admin. */
export const requireAdminPage = async (): Promise<AdminSession> => {
  const state = await getSessionState();
  if (state.kind === "guest") redirect("/admin/login");
  if (state.kind === "forbidden") redirect("/admin/login?galat=bukan-admin");
  return state;
};

export class AdminAccessError extends Error {
  constructor() {
    super("Akses admin diperlukan.");
    this.name = "AdminAccessError";
  }
}

/**
 * Untuk Server Action admin. Server Action adalah endpoint publik, jadi setiap aksi
 * memeriksa ulang di sini; RLS tetap menjadi lapisan terakhir.
 */
export const requireAdminAction = async (): Promise<AdminSession> => {
  const state = await getSessionState();
  if (state.kind !== "admin") throw new AdminAccessError();
  return state;
};
