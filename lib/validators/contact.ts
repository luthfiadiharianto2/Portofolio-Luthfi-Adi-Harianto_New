import * as z from "zod/mini";

// Memakai zod/mini (sekitar 5 kB gzip, versi biasa sekitar 22 kB) karena skema ini ikut
// terbundel ke browser untuk validasi form.
// Pesan galat berupa kunci terjemahan (namespace "Validation"), bukan teks jadi,
// supaya skema yang sama dipakai di client dan server tanpa tergantung bahasa.
const text = (min: number, max: number, minKey: string, maxKey: string) =>
  z
    .string()
    .check(z.trim(), z.minLength(min, minKey), z.maxLength(max, maxKey));

export const contactSchema = z.object({
  name: text(2, 60, "nameMin", "nameMax"),
  email: z
    .string()
    .check(z.trim(), z.maxLength(254, "emailInvalid"), z.email("emailInvalid")),
  message: text(5, 1000, "messageMin", "messageMax"),
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
  name: text(2, 60, "nameMin", "nameMax"),
  message: text(5, 1000, "messageMin", "messageMax"),
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
