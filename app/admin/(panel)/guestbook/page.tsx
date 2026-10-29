import { Check, Trash2, Undo2, UserRound } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  deleteGuestbookEntry,
  setGuestbookApproved,
} from "@/app/admin/actions/moderation";
import { ConfirmSubmit } from "@/components/admin/buttons";
import { buttonStyles } from "@/components/ui/button-styles";
import { listGuestbook } from "@/lib/admin/data";
import { formatDateTime } from "@/lib/admin/format";
import { storagePublicUrl } from "@/lib/env";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Buku tamu" };

const TABS = [
  { key: "menunggu", label: "Menunggu", approved: false },
  { key: "disetujui", label: "Disetujui", approved: true },
] as const;

export default async function GuestbookPage({
  searchParams,
}: PageProps<"/admin/guestbook">) {
  const { tampil } = await searchParams;
  const tab = TABS.find((item) => item.key === tampil) ?? TABS[0];
  const entries = await listGuestbook(tab.approved);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Buku tamu</h1>
        <p className="text-sm text-muted">
          Komentar baru baru tampil di situs setelah disetujui. Menghapus
          komentar juga menghapus fotonya dari Storage.
        </p>
      </div>

      <nav aria-label="Saring buku tamu" className="flex gap-1">
        {TABS.map((item) => (
          <Link
            key={item.key}
            href={`/admin/guestbook?tampil=${item.key}`}
            aria-current={item.key === tab.key ? "page" : undefined}
            className={cn(
              "inline-flex min-h-(--spacing-touch) items-center rounded-control px-4 text-sm font-medium",
              item.key === tab.key
                ? "bg-glass-border text-fg"
                : "text-muted hover:text-fg",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {entries.length === 0 ? (
        <p className="rounded-card glass p-6 text-muted">
          {tab.approved
            ? "Belum ada komentar yang disetujui."
            : "Tidak ada komentar yang menunggu moderasi."}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {entries.map((entry) => (
            <li
              key={entry.id}
              className="flex flex-col gap-4 rounded-card glass p-4 sm:flex-row"
            >
              <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-glass-border">
                {entry.avatar_path ? (
                  <Image
                    src={storagePublicUrl(
                      "guestbook-avatars",
                      entry.avatar_path,
                    )}
                    alt={`Foto ${entry.name}`}
                    width={48}
                    height={48}
                    className="size-full object-cover"
                  />
                ) : (
                  <UserRound aria-hidden="true" className="size-5 text-muted" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{entry.name}</p>
                <p className="text-xs text-muted">
                  <time dateTime={entry.created_at}>
                    {formatDateTime(entry.created_at)}
                  </time>
                </p>
                <p className="mt-2 break-words whitespace-pre-line">
                  {entry.message}
                </p>
              </div>
              <div className="flex flex-wrap items-start gap-1">
                <form action={setGuestbookApproved}>
                  <input type="hidden" name="id" value={entry.id} />
                  <input
                    type="hidden"
                    name="approved"
                    value={String(!entry.is_approved)}
                  />
                  <button
                    type="submit"
                    className={
                      entry.is_approved
                        ? buttonStyles.ghost
                        : buttonStyles.secondary
                    }
                  >
                    {entry.is_approved ? (
                      <Undo2 aria-hidden="true" className="size-4" />
                    ) : (
                      <Check aria-hidden="true" className="size-4" />
                    )}
                    {entry.is_approved ? "Batalkan persetujuan" : "Setujui"}
                    <span className="sr-only"> komentar {entry.name}</span>
                  </button>
                </form>
                <form action={deleteGuestbookEntry}>
                  <input type="hidden" name="id" value={entry.id} />
                  <ConfirmSubmit>
                    <Trash2 aria-hidden="true" className="size-4" />
                    Hapus<span className="sr-only"> komentar {entry.name}</span>
                  </ConfirmSubmit>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
