import type { Metadata } from "next";
import { Suspense } from "react";
import { fontVariables } from "../fonts";
import "../globals.css";

// Area admin: tidak dilokalkan, tidak diindeks, dan selalu dirender per permintaan
// (membaca cookie sesi). Suspense di sini membungkus semua halaman admin, sehingga
// halaman boleh membaca sesi langsung.
export const metadata: Metadata = {
  title: { template: "%s · Admin", default: "Admin" },
  robots: { index: false, follow: false },
};

export const instant = false;

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="id" className={fontVariables}>
      <body className="min-h-dvh">
        <Suspense
          fallback={
            <p role="status" className="p-8 text-muted">
              Memuat…
            </p>
          }
        >
          {children}
        </Suspense>
      </body>
    </html>
  );
}
