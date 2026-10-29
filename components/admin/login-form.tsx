"use client";

import { MailCheck } from "lucide-react";
import { startTransition, useActionState } from "react";
import { type LoginState, requestMagicLink } from "@/app/admin/actions/auth";
import {
  describedBy,
  FormField,
  inputStyles,
} from "@/components/ui/form-field";
import { SubmitButton } from "./buttons";

const INITIAL: LoginState = { status: "idle" };

export const LoginForm = () => {
  const [state, dispatch, pending] = useActionState(requestMagicLink, INITIAL);

  if (state.status === "sent")
    return (
      <div
        role="status"
        className="flex flex-col items-center gap-3 text-center"
      >
        <MailCheck aria-hidden="true" className="size-10 text-accent-3" />
        <p className="font-medium">Periksa kotak masuk {state.email}.</p>
        <p className="text-sm text-muted">
          Bila email itu terdaftar sebagai admin, tautan masuk sudah dikirim.
          Tautan hanya berlaku sekali dan untuk waktu singkat.
        </p>
      </div>
    );

  const error = state.status === "error" ? state.message : undefined;
  return (
    // onSubmit (bukan prop action) agar email yang salah ketik tidak ikut terhapus.
    <form
      noValidate
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => dispatch(formData));
      }}
    >
      <FormField id="email" label="Email admin" error={error}>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy("email", { error })}
          className={inputStyles}
        />
      </FormField>
      <SubmitButton pending={pending} pendingLabel="Mengirim…">
        Kirim tautan masuk
      </SubmitButton>
    </form>
  );
};
