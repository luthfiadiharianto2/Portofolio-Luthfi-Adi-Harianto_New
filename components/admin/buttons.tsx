"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { buttonStyles } from "@/components/ui/button-styles";
import { cn } from "@/lib/utils";

type Variant = keyof typeof buttonStyles;

/**
 * Tombol kirim yang nonaktif dan berganti label selama form diproses. Status diambil dari
 * form induk (useFormStatus), atau dari prop pending untuk form yang dikirim lewat onSubmit.
 */
export const SubmitButton = ({
  children,
  pendingLabel = "Menyimpan…",
  variant = "primary",
  className,
  pending: pendingProp,
}: {
  children: ReactNode;
  pendingLabel?: string;
  variant?: Variant;
  className?: string;
  pending?: boolean;
}) => {
  const status = useFormStatus();
  const pending = pendingProp ?? status.pending;
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={cn(buttonStyles[variant], className)}
    >
      {pending ? pendingLabel : children}
    </button>
  );
};

/**
 * Tombol hapus dua langkah: klik pertama meminta konfirmasi, klik kedua mengirim form.
 * Konfirmasi batal sendiri setelah 4 detik atau saat fokus pindah.
 */
export const ConfirmSubmit = ({
  children,
  confirmLabel = "Yakin hapus?",
  className,
}: {
  children: ReactNode;
  confirmLabel?: string;
  className?: string;
}) => {
  const [armed, setArmed] = useState(false);
  const { pending } = useFormStatus();
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <button
      type={armed ? "submit" : "button"}
      disabled={pending}
      onClick={() => {
        if (armed) return;
        setArmed(true);
        timer.current = window.setTimeout(() => setArmed(false), 4000);
      }}
      onBlur={() => setArmed(false)}
      className={cn(
        buttonStyles.ghost,
        armed ? "text-accent-2 hover:text-accent-2" : "",
        className,
      )}
    >
      {pending ? "Menghapus…" : armed ? confirmLabel : children}
    </button>
  );
};
