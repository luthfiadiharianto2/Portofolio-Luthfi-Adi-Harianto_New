"use client";

import { useTranslations } from "next-intl";
import type { FormStatus } from "@/lib/validators/contact";

const VALIDATION_KEYS = [
  "nameMin",
  "nameMax",
  "emailInvalid",
  "messageMin",
  "messageMax",
  "avatarInvalid",
  "rateLimited",
  "captcha",
  "server",
  "invalid",
] as const;
type ValidationKey = (typeof VALIDATION_KEYS)[number];

const isValidationKey = (value: string): value is ValidationKey =>
  (VALIDATION_KEYS as readonly string[]).includes(value);

const STATUS_KEYS: Record<
  Extract<FormStatus, { status: "error" }>["code"],
  ValidationKey
> = {
  invalid: "invalid",
  rate_limited: "rateLimited",
  captcha: "captcha",
  avatar: "avatarInvalid",
  server: "server",
};

// Menerjemahkan kunci galat dari skema Zod dan Server Action.
export const useValidationMessage = () => {
  const t = useTranslations("Validation");
  return {
    field: (key?: string) =>
      key ? t(isValidationKey(key) ? key : "invalid") : undefined,
    status: (status: FormStatus) =>
      status.status === "error" ? t(STATUS_KEYS[status.code]) : undefined,
  };
};
