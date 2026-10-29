"use client";

import Link from "next/link";
import { buttonStyles } from "@/components/ui/button-styles";

// Galat dari Server Action atau pembacaan data admin. Di produksi pesan galat server
// disamarkan, jadi tampilkan petunjuk umum.
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-start gap-4 rounded-card glass p-6"
    >
      <h1 className="font-heading text-xl font-semibold">Terjadi galat</h1>
      <p className="text-muted">
        Perubahan tidak bisa diproses. Coba lagi. Bila sesi sudah berakhir,
        masuk lagi; bila terus terjadi, periksa koneksi ke Supabase.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className={buttonStyles.secondary}
        >
          Coba lagi
        </button>
        <Link href="/admin/login" className={buttonStyles.ghost}>
          Masuk lagi
        </Link>
      </div>
    </div>
  );
}
