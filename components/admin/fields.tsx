"use client";

import type { ReactNode } from "react";
import {
  describedBy,
  FormField,
  inputStyles,
} from "@/components/ui/form-field";

// Kolom form admin yang dipakai bersama (proyek, galeri, langkah).

export type Errors = Record<string, string | undefined>;

export const Text = ({
  name,
  idPrefix = "",
  label,
  defaultValue,
  errors,
  hint,
  multiline = false,
  rows = 4,
  ...input
}: {
  name: string;
  /** Awalan id bila form yang sama muncul lebih dari sekali di satu halaman. */
  idPrefix?: string;
  label: string;
  defaultValue: string;
  errors: Errors;
  hint?: string;
  multiline?: boolean;
  rows?: number;
  required?: boolean;
  maxLength?: number;
  pattern?: string;
  type?: string;
  placeholder?: string;
}) => {
  const error = errors[name];
  const id = idPrefix + name;
  const shared = {
    id,
    name,
    defaultValue,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy(id, { error, hint }),
    className: inputStyles,
  };
  return (
    <FormField id={id} label={label} error={error} hint={hint}>
      {multiline ? (
        <textarea
          {...shared}
          rows={rows}
          maxLength={input.maxLength}
          required={input.required}
        />
      ) : (
        <input {...shared} {...input} type={input.type ?? "text"} />
      )}
    </FormField>
  );
};

/** Pasangan kolom ID dan EN berdampingan (bertumpuk di layar sempit). */
export const Bilingual = ({
  name,
  idPrefix,
  label,
  value,
  errors,
  multiline,
  rows,
  maxLength,
  hint,
}: {
  name: string;
  idPrefix?: string;
  label: string;
  value: { id: string; en: string };
  errors: Errors;
  multiline?: boolean;
  rows?: number;
  maxLength: number;
  hint?: string;
}) => (
  <fieldset className="grid grid-cols-1 gap-4 md:grid-cols-2">
    <legend className="sr-only">{label}</legend>
    {(["id", "en"] as const).map((locale) => (
      <Text
        key={locale}
        name={`${name}_${locale}`}
        idPrefix={idPrefix}
        label={`${label} (${locale.toUpperCase()})`}
        defaultValue={value[locale]}
        errors={errors}
        multiline={multiline}
        rows={rows}
        maxLength={maxLength}
        hint={hint}
        required
      />
    ))}
  </fieldset>
);

export const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <section className="flex flex-col gap-4 rounded-card glass p-5 sm:p-6">
    <h2 className="font-heading text-lg font-semibold">{title}</h2>
    {children}
  </section>
);
