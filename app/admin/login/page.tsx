import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { signOut } from "@/app/admin/actions/auth";
import { LoginForm } from "@/components/admin/login-form";
import { buttonStyles } from "@/components/ui/button-styles";
import { getSessionState } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Masuk" };

const ERRORS: Record<string, string> = {
  tautan: "Tautan masuk tidak valid atau sudah kedaluwarsa. Minta tautan baru.",
};

export default async function LoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const state = await getSessionState();
  if (state.kind === "admin") redirect("/admin");
  const { galat } = await searchParams;
  const error = typeof galat === "string" ? ERRORS[galat] : undefined;

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-gutter py-12">
      <div>
        <p className="text-sm tracking-[0.2em] text-muted uppercase">Admin</p>
        <h1 className="mt-1 font-heading text-3xl font-bold">Masuk</h1>
        <p className="mt-2 text-muted">
          Masukkan email admin. Tautan masuk akan dikirim ke email itu, tanpa
          kata sandi.
        </p>
      </div>

      {state.kind === "forbidden" ? (
        <div
          role="alert"
          className="flex flex-col gap-4 rounded-card glass p-6"
        >
          <p>
            Akun <strong>{state.email}</strong> tidak terdaftar sebagai admin.
          </p>
          <form action={signOut}>
            <button type="submit" className={buttonStyles.secondary}>
              Keluar dan ganti akun
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-4 rounded-card glass p-6">
          {error ? (
            <p role="alert" className="text-sm text-accent-2">
              {error}
            </p>
          ) : null}
          <LoginForm />
        </div>
      )}
    </main>
  );
}
