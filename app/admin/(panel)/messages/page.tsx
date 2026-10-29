import { Mail, MailOpen, Reply, Trash2 } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { deleteMessage, setMessageRead } from "@/app/admin/actions/moderation";
import { ConfirmSubmit } from "@/components/admin/buttons";
import { buttonStyles } from "@/components/ui/button-styles";
import { listMessages, MESSAGES_PER_PAGE } from "@/lib/admin/data";
import { formatDateTime } from "@/lib/admin/format";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Pesan" };

export default async function MessagesPage({
  searchParams,
}: PageProps<"/admin/messages">) {
  const { halaman } = await searchParams;
  const page = Math.max(1, Number.parseInt(String(halaman ?? "1"), 10) || 1);
  const { messages, total } = await listMessages(page);
  const pages = Math.max(1, Math.ceil(total / MESSAGES_PER_PAGE));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-bold">Pesan masuk</h1>
        <p className="text-sm text-muted">{total} pesan dari form kontak.</p>
      </div>

      {messages.length === 0 ? (
        <p className="rounded-card glass p-6 text-muted">Belum ada pesan.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {messages.map((message) => (
            <li
              key={message.id}
              className={cn(
                "flex flex-col gap-3 rounded-card glass p-4",
                !message.is_read && "border-l-4 border-l-accent-3",
              )}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium">
                  {message.name}
                  {message.is_read ? null : (
                    <span className="ml-2 rounded-full bg-accent-3/10 px-2 py-0.5 text-xs text-accent-3">
                      Baru
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted">
                  <time dateTime={message.created_at}>
                    {formatDateTime(message.created_at)}
                  </time>
                </p>
              </div>
              <p className="text-sm break-all text-muted">{message.email}</p>
              <p className="break-words whitespace-pre-line">{message.body}</p>
              <div className="flex flex-wrap gap-1">
                <a
                  href={`mailto:${message.email}?subject=${encodeURIComponent("Re: pesan dari portofolio")}`}
                  className={buttonStyles.secondary}
                >
                  <Reply aria-hidden="true" className="size-4" />
                  Balas<span className="sr-only"> {message.name}</span>
                </a>
                <form action={setMessageRead}>
                  <input type="hidden" name="id" value={message.id} />
                  <input
                    type="hidden"
                    name="read"
                    value={String(!message.is_read)}
                  />
                  <button type="submit" className={buttonStyles.ghost}>
                    {message.is_read ? (
                      <Mail aria-hidden="true" className="size-4" />
                    ) : (
                      <MailOpen aria-hidden="true" className="size-4" />
                    )}
                    {message.is_read
                      ? "Tandai belum dibaca"
                      : "Tandai sudah dibaca"}
                    <span className="sr-only"> pesan {message.name}</span>
                  </button>
                </form>
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={message.id} />
                  <ConfirmSubmit>
                    <Trash2 aria-hidden="true" className="size-4" />
                    Hapus<span className="sr-only"> pesan {message.name}</span>
                  </ConfirmSubmit>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      {pages > 1 ? (
        <nav
          aria-label="Halaman pesan"
          className="flex items-center justify-between gap-4"
        >
          {page > 1 ? (
            <Link
              href={`/admin/messages?halaman=${page - 1}`}
              className={buttonStyles.secondary}
            >
              ← Lebih baru
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm text-muted">
            Halaman {page} dari {pages}
          </span>
          {page < pages ? (
            <Link
              href={`/admin/messages?halaman=${page + 1}`}
              className={buttonStyles.secondary}
            >
              Lebih lama →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </div>
  );
}
