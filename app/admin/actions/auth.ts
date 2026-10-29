"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createSessionClient } from "@/lib/supabase/server";

export type LoginState =
  | { status: "idle" }
  | { status: "sent"; email: string }
  | { status: "error"; message: string };

const emailSchema = z.email("Masukkan alamat email yang valid.").max(254);

// Mengirim magic link. shouldCreateUser: false: hanya akun yang sudah ada di Supabase
// Auth yang menerima email, jadi form ini tidak bisa dipakai untuk mendaftar. Jawaban
// selalu sama untuk email apa pun, agar tidak bisa dipakai menebak email admin.
export const requestMagicLink = async (
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> => {
  const parsed = emailSchema.safeParse(
    String(formData.get("email") ?? "")
      .trim()
      .toLowerCase(),
  );
  if (!parsed.success)
    return { status: "error", message: parsed.error.issues[0]!.message };

  // Origin dari permintaan (sudah dicocokkan Next.js dengan Host untuk Server Action),
  // sehingga tautan juga benar di deployment pratinjau. Supabase tetap hanya menerima
  // alamat yang terdaftar di daftar Redirect URLs proyek.
  const origin = (await headers()).get("origin");
  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: origin ? `${origin}/admin/auth/callback` : undefined,
    },
  });
  if (error?.status === 429)
    return {
      status: "error",
      message: "Terlalu banyak permintaan. Coba lagi beberapa menit lagi.",
    };
  return { status: "sent", email: parsed.data };
};

export const signOut = async () => {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
};
