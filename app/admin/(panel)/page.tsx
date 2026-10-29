import { FolderKanban, Mail, MessagesSquare, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { buttonStyles } from "@/components/ui/button-styles";
import { getDashboardCounts } from "@/lib/admin/data";

export const metadata: Metadata = { title: "Dasbor" };

export default async function DashboardPage() {
  const counts = await getDashboardCounts();
  const cards = [
    {
      href: "/admin/projects",
      icon: FolderKanban,
      label: "Proyek",
      value: counts.projects,
      note:
        counts.drafts > 0 ? `${counts.drafts} belum terbit` : "Semua terbit",
    },
    {
      href: "/admin/guestbook",
      icon: MessagesSquare,
      label: "Buku tamu menunggu",
      value: counts.pending,
      note: counts.pending > 0 ? "Perlu dimoderasi" : "Tidak ada antrean",
    },
    {
      href: "/admin/messages",
      icon: Mail,
      label: "Pesan belum dibaca",
      value: counts.unread,
      note: counts.unread > 0 ? "Buka kotak pesan" : "Semua sudah dibaca",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-bold">Dasbor</h1>
        <Link href="/admin/projects/new" className={buttonStyles.primary}>
          <Plus aria-hidden="true" className="size-4" />
          Proyek baru
        </Link>
      </div>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map(({ href, icon: Icon, label, value, note }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex h-full flex-col gap-2 rounded-card glass p-5 transition-colors duration-200 hover:bg-glass-border"
            >
              <Icon aria-hidden="true" className="size-5 text-accent-3" />
              <span className="text-sm text-muted">{label}</span>
              <span className="font-heading text-3xl font-bold">{value}</span>
              <span className="text-xs text-muted">{note}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
