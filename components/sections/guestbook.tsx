"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Send } from "lucide-react";
import Image from "next/image";
import { useFormatter, useTranslations } from "next-intl";
import {
  type RefObject,
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useForm } from "react-hook-form";
import { signGuestbook } from "@/app/actions/visitor";
import { useHydrated } from "@/hooks/use-hydrated";
import { buttonStyles } from "@/components/ui/button-styles";
import {
  describedBy,
  FormField,
  HoneypotField,
  inputStyles,
} from "@/components/ui/form-field";
import { Turnstile } from "@/components/ui/turnstile";
import type { GuestbookEntry } from "@/lib/data/content";
import {
  type FormStatus,
  GUESTBOOK_AVATAR_MAX_BYTES,
  type GuestbookInput,
  guestbookSchema,
  isAllowedAvatarType,
} from "@/lib/validators/contact";
import { SuccessNotice } from "./contact-form";
import { useValidationMessage } from "./use-validation-message";

type RealtimeConfig = {
  url: string;
  publishableKey: string;
  avatarBaseUrl: string;
};

const INITIAL: FormStatus = { status: "idle" };

// Komentar yang disetujui diperbarui langsung lewat Supabase Realtime.
// supabase-js (~60 kB gzip) baru diunduh saat buku tamu mendekati layar.
const useLiveEntries = (
  initial: GuestbookEntry[],
  realtime: RealtimeConfig,
  container: RefObject<HTMLElement | null>,
) => {
  const [entries, setEntries] = useState(initial);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: "600px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [container]);

  useEffect(() => {
    if (!near) return;
    let cleanup: (() => void) | undefined;
    let cancelled = false;

    void import("@supabase/supabase-js").then(({ createClient }) => {
      if (cancelled) return;
      const client = createClient(realtime.url, realtime.publishableKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const channel = client
        .channel("guestbook-approved")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "guestbook" },
          (payload) => {
            const row = payload.new as Partial<
              GuestbookEntry & { is_approved: boolean }
            >;
            const id = row.id ?? (payload.old as { id?: string }).id;
            if (!id) return;
            setEntries((current) => {
              const without = current.filter((entry) => entry.id !== id);
              if (
                payload.eventType === "DELETE" ||
                !row.is_approved ||
                !row.name ||
                !row.message ||
                !row.created_at
              ) {
                return without;
              }
              const entry: GuestbookEntry = {
                id,
                name: row.name,
                message: row.message,
                avatar_path: row.avatar_path ?? null,
                created_at: row.created_at,
              };
              return [entry, ...without].sort((a, b) =>
                b.created_at.localeCompare(a.created_at),
              );
            });
          },
        )
        .subscribe();
      cleanup = () => void client.removeChannel(channel);
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [near, realtime.url, realtime.publishableKey]);

  return entries;
};

const GuestbookForm = ({
  turnstileSiteKey,
  onSent,
}: {
  turnstileSiteKey?: string;
  onSent: () => void;
}) => {
  const t = useTranslations("Guestbook");
  const contact = useTranslations("Contact");
  const message = useValidationMessage();
  const [avatarError, setAvatarError] = useState<string>();
  const [isTransitioning, startTransition] = useTransition();
  const [state, formAction, isPending] = useActionState(
    async (previous: FormStatus, data: FormData) => {
      const result = await signGuestbook(previous, data);
      if (result.status === "success") onSent();
      return result;
    },
    INITIAL,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestbookInput>({
    resolver: zodResolver(guestbookSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const checkAvatar = (file?: File) => {
    const invalid =
      file &&
      (file.size > GUESTBOOK_AVATAR_MAX_BYTES ||
        !isAllowedAvatarType(file.type));
    setAvatarError(invalid ? message.field("avatarInvalid") : undefined);
    return !invalid;
  };

  const submit = handleSubmit((_values, event) => {
    const form = event?.target;
    if (!(form instanceof HTMLFormElement)) return;
    const data = new FormData(form);
    const avatar = data.get("avatar");
    if (
      !checkAvatar(
        avatar instanceof File && avatar.size > 0 ? avatar : undefined,
      )
    )
      return;
    startTransition(() => formAction(data));
  });

  const serverErrors = state.status === "error" ? state.fieldErrors : undefined;
  const fieldError = (name: keyof GuestbookInput) =>
    message.field(errors[name]?.message ?? serverErrors?.[name]);
  const busy = isPending || isTransitioning;
  const hydrated = useHydrated();
  const fields = {
    name: { id: "guestbook-name", error: fieldError("name") },
    message: { id: "guestbook-message", error: fieldError("message") },
    avatar: {
      id: "guestbook-avatar",
      error: avatarError,
      hint: t("moderationNote"),
    },
  };

  return (
    // method="post": bila dikirim sebelum terhidrasi, isi form tidak masuk ke URL.
    <form
      method="post"
      onSubmit={submit}
      noValidate
      className="relative flex flex-col gap-5"
    >
      <HoneypotField label={contact("honeypot")} />
      <FormField
        id={fields.name.id}
        label={t("name")}
        error={fields.name.error}
      >
        <input
          id={fields.name.id}
          autoComplete="name"
          aria-invalid={Boolean(fields.name.error)}
          aria-describedby={describedBy(fields.name.id, fields.name)}
          className={inputStyles}
          {...register("name")}
        />
      </FormField>
      <FormField
        id={fields.message.id}
        label={t("message")}
        error={fields.message.error}
      >
        <textarea
          id={fields.message.id}
          rows={3}
          aria-invalid={Boolean(fields.message.error)}
          aria-describedby={describedBy(fields.message.id, fields.message)}
          className={`${inputStyles} resize-y`}
          {...register("message")}
        />
      </FormField>
      <FormField
        id={fields.avatar.id}
        label={t("avatar")}
        error={fields.avatar.error}
        hint={fields.avatar.hint}
      >
        <div className="relative">
          <ImagePlus
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted"
          />
          <input
            id={fields.avatar.id}
            name="avatar"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            aria-invalid={Boolean(fields.avatar.error)}
            aria-describedby={describedBy(fields.avatar.id, fields.avatar)}
            onChange={(event) => checkAvatar(event.target.files?.[0])}
            className={`${inputStyles} min-h-(--spacing-touch) pl-12 file:mr-3 file:rounded-control file:border-0 file:bg-glass-border file:px-3 file:py-1 file:text-fg`}
          />
        </div>
      </FormField>
      <Turnstile siteKey={turnstileSiteKey} />
      {state.status === "error" && state.code !== "invalid" ? (
        <p role="alert" className="text-sm text-accent-2">
          {message.status(state)}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={busy || !hydrated}
        className={`${buttonStyles.primary} self-start`}
      >
        <Send aria-hidden="true" className="size-4" />
        {busy ? t("sending") : t("submit")}
      </button>
    </form>
  );
};

type GuestbookProps = {
  initialEntries: GuestbookEntry[];
  realtime: RealtimeConfig;
  turnstileSiteKey?: string;
};

export const Guestbook = ({
  initialEntries,
  realtime,
  turnstileSiteKey,
}: GuestbookProps) => {
  const t = useTranslations("Guestbook");
  const format = useFormatter();
  const container = useRef<HTMLDivElement>(null);
  const entries = useLiveEntries(initialEntries, realtime, container);
  const [sent, setSent] = useState(false);
  const [formKey, setFormKey] = useState(0);

  return (
    <div ref={container} className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      <div className="rounded-card glass p-6 sm:p-8">
        <h3 className="font-heading text-xl font-semibold">{t("title")}</h3>
        <p className="mt-1 mb-6 text-sm text-muted">{t("subtitle")}</p>
        {sent ? (
          <SuccessNotice
            title={t("successTitle")}
            text={t("successText")}
            action={t("writeAnother")}
            onAction={() => {
              setSent(false);
              setFormKey((key) => key + 1);
            }}
          />
        ) : (
          <GuestbookForm
            key={formKey}
            turnstileSiteKey={turnstileSiteKey}
            onSent={() => setSent(true)}
          />
        )}
      </div>

      <div>
        {entries.length === 0 ? (
          <p className="rounded-card glass p-6 text-center text-muted">
            {t("empty")}
          </p>
        ) : (
          <ul
            aria-label={t("listLabel")}
            aria-live="polite"
            className="flex max-h-[36rem] flex-col gap-3 overflow-y-auto pr-1"
          >
            {entries.map((entry) => (
              <li key={entry.id} className="flex gap-4 rounded-card glass p-4">
                {entry.avatar_path ? (
                  <Image
                    src={`${realtime.avatarBaseUrl}/${entry.avatar_path}`}
                    alt={t("avatarAlt", { name: entry.name })}
                    width={48}
                    height={48}
                    className="size-12 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-button font-semibold text-fg uppercase"
                  >
                    {entry.name.charAt(0)}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="font-semibold break-words">{entry.name}</p>
                  <time
                    dateTime={entry.created_at}
                    className="text-xs text-muted"
                  >
                    {format.dateTime(new Date(entry.created_at), {
                      dateStyle: "medium",
                    })}
                  </time>
                  <p className="mt-2 break-words whitespace-pre-line text-muted">
                    {entry.message}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
