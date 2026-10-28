"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheck, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { sendMessage } from "@/app/actions/visitor";
import { useHydrated } from "@/hooks/use-hydrated";
import { buttonStyles } from "@/components/ui/button-styles";
import {
  describedBy,
  FormField,
  HoneypotField,
  inputStyles,
} from "@/components/ui/form-field";
import { Turnstile } from "@/components/ui/turnstile";
import {
  type ContactInput,
  contactSchema,
  type FormStatus,
} from "@/lib/validators/contact";
import { useValidationMessage } from "./use-validation-message";

const INITIAL: FormStatus = { status: "idle" };

export const SuccessNotice = ({
  title,
  text,
  action,
  onAction,
}: {
  title: string;
  text: string;
  action: string;
  onAction: () => void;
}) => (
  <div
    role="status"
    className="animate-[rise_0.5s_var(--ease-standard)_both] py-6 text-center"
  >
    <CircleCheck aria-hidden="true" className="mx-auto size-14 text-accent-3" />
    <p className="mt-4 font-heading text-xl font-semibold">{title}</p>
    <p className="mt-2 text-muted">{text}</p>
    <button
      type="button"
      onClick={onAction}
      className={`${buttonStyles.secondary} mt-6`}
    >
      {action}
    </button>
  </div>
);

const MessageForm = ({
  turnstileSiteKey,
  onSent,
}: {
  turnstileSiteKey?: string;
  onSent: () => void;
}) => {
  const t = useTranslations("Contact");
  const message = useValidationMessage();
  const [isTransitioning, startTransition] = useTransition();
  const [state, formAction, isPending] = useActionState(
    async (previous: FormStatus, data: FormData) => {
      const result = await sendMessage(previous, data);
      if (result.status === "success") onSent();
      return result;
    },
    INITIAL,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const submit = handleSubmit((_values, event) => {
    const form = event?.target;
    if (!(form instanceof HTMLFormElement)) return;
    const data = new FormData(form);
    startTransition(() => formAction(data));
  });

  const serverErrors = state.status === "error" ? state.fieldErrors : undefined;
  const fieldError = (name: keyof ContactInput) =>
    message.field(errors[name]?.message ?? serverErrors?.[name]);
  const busy = isPending || isTransitioning;
  const hydrated = useHydrated();

  const fields = {
    name: { id: "contact-name", error: fieldError("name") },
    email: { id: "contact-email", error: fieldError("email") },
    message: { id: "contact-message", error: fieldError("message") },
  };

  return (
    // method="post": bila dikirim sebelum terhidrasi, isi form tidak masuk ke URL.
    <form
      method="post"
      onSubmit={submit}
      noValidate
      className="relative flex flex-col gap-5"
    >
      <HoneypotField label={t("honeypot")} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
          id={fields.email.id}
          label={t("email")}
          error={fields.email.error}
        >
          <input
            id={fields.email.id}
            type="email"
            autoComplete="email"
            inputMode="email"
            aria-invalid={Boolean(fields.email.error)}
            aria-describedby={describedBy(fields.email.id, fields.email)}
            className={inputStyles}
            {...register("email")}
          />
        </FormField>
      </div>
      <FormField
        id={fields.message.id}
        label={t("message")}
        error={fields.message.error}
      >
        <textarea
          id={fields.message.id}
          rows={5}
          aria-invalid={Boolean(fields.message.error)}
          aria-describedby={describedBy(fields.message.id, fields.message)}
          className={`${inputStyles} resize-y`}
          {...register("message")}
        />
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

export const ContactForm = ({
  turnstileSiteKey,
}: {
  turnstileSiteKey?: string;
}) => {
  const t = useTranslations("Contact");
  const [sent, setSent] = useState(false);
  const [formKey, setFormKey] = useState(0);

  if (sent) {
    return (
      <SuccessNotice
        title={t("successTitle")}
        text={t("successText")}
        action={t("sendAnother")}
        onAction={() => {
          setSent(false);
          setFormKey((key) => key + 1);
        }}
      />
    );
  }
  return (
    <MessageForm
      key={formKey}
      turnstileSiteKey={turnstileSiteKey}
      onSent={() => setSent(true)}
    />
  );
};
