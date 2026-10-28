import { z } from "zod";

// Pesan galat berupa kunci terjemahan (namespace "Validation"), bukan teks jadi,
// supaya skema yang sama dipakai di client dan server tanpa tergantung bahasa.
export const contactSchema = z.object({
  name: z.string().trim().min(2, "nameMin").max(60, "nameMax"),
  email: z
    .string()
    .trim()
    .max(254, "emailInvalid")
    .pipe(z.email("emailInvalid")),
  message: z.string().trim().min(5, "messageMin").max(1000, "messageMax"),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const GUESTBOOK_AVATAR_MAX_BYTES = 1024 * 1024;
export const GUESTBOOK_AVATAR_TYPES = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
} as const;

export const isAllowedAvatarType = (
  type: string,
): type is keyof typeof GUESTBOOK_AVATAR_TYPES =>
  type in GUESTBOOK_AVATAR_TYPES;

export const guestbookSchema = z.object({
  name: z.string().trim().min(2, "nameMin").max(60, "nameMax"),
  message: z.string().trim().min(5, "messageMin").max(1000, "messageMax"),
});
export type GuestbookInput = z.infer<typeof guestbookSchema>;

export type FormStatus =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      code: "invalid" | "rate_limited" | "captcha" | "avatar" | "server";
      fieldErrors?: Partial<Record<string, string>>;
    };
