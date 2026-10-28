import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputStyles =
  "rounded-control bg-surface border-glass-border text-fg placeholder:text-muted w-full border px-4 py-3 transition-colors duration-200 focus-visible:border-accent-3 aria-invalid:border-accent-2";

type FormFieldProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

// Label, pesan bantuan, dan pesan galat yang terhubung ke kontrolnya lewat id.
export const FormField = ({
  id,
  label,
  error,
  hint,
  children,
  className,
}: FormFieldProps) => (
  <div className={cn("flex flex-col gap-2", className)}>
    <label htmlFor={id} className="text-sm font-medium">
      {label}
    </label>
    {children}
    {hint && !error ? (
      <p id={`${id}-hint`} className="text-xs text-muted">
        {hint}
      </p>
    ) : null}
    {error ? (
      <p id={`${id}-error`} role="alert" className="text-sm text-accent-2">
        {error}
      </p>
    ) : null}
  </div>
);

export const describedBy = (
  id: string,
  { error, hint }: { error?: string; hint?: string },
) => (error ? `${id}-error` : hint ? `${id}-hint` : undefined);

// Kolom jebakan bot: tersembunyi dari mata dan pembaca layar, tidak bisa difokus.
export const HoneypotField = ({ label }: { label: string }) => (
  <div
    aria-hidden="true"
    className="absolute -left-[9999px] size-px overflow-hidden"
  >
    <label>
      {label}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </label>
  </div>
);
