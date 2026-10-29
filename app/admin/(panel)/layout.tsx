import { LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/app/admin/actions/auth";
import { NavLinks } from "@/components/admin/nav-links";
import { buttonStyles } from "@/components/ui/button-styles";
import { requireAdminPage } from "@/lib/admin/auth";

// Kerangka halaman admin. Setiap halaman dan Server Action tetap memeriksa admin sendiri;
// pemeriksaan di sini hanya agar kerangka tidak tampil untuk pengunjung.
export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  const { email } = await requireAdminPage();

  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col gap-8 px-gutter py-6">
      <a
        href="#isi-admin"
        className="fixed top-3 left-3 z-50 -translate-y-24 rounded-control bg-surface px-4 py-3 text-fg transition-transform duration-200 focus-visible:translate-y-0"
      >
        Lewati ke isi
      </a>
      <header className="flex flex-col gap-4 rounded-card glass p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/admin" className="font-heading text-lg font-bold">
            LAH<span className="text-accent-3">.</span> Admin
          </Link>
          <Link href="/id" className="text-sm text-muted hover:text-fg">
            Lihat situs
          </Link>
        </div>
        <nav aria-label="Menu admin">
          <NavLinks />
        </nav>
        <form action={signOut} className="flex items-center gap-3">
          <span className="truncate text-xs text-muted">{email}</span>
          <button type="submit" className={buttonStyles.ghost}>
            <LogOut aria-hidden="true" className="size-4" />
            Keluar
          </button>
        </form>
      </header>
      <main id="isi-admin" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
    </div>
  );
}
