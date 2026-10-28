"use server";

import { randomUUID } from "node:crypto";
import { getVisitorHash, verifyTurnstile } from "@/lib/server/visitor";
import { createPublicClient } from "@/lib/supabase/public";
import {
  contactSchema,
  type FormStatus,
  GUESTBOOK_AVATAR_MAX_BYTES,
  GUESTBOOK_AVATAR_TYPES,
  guestbookSchema,
  isAllowedAvatarType,
} from "@/lib/validators/contact";

const RATE_LIMITED = "P0001";

const fieldErrorsOf = (issues: { path: PropertyKey[]; message: string }[]) =>
  Object.fromEntries(
    issues.map((issue) => [String(issue.path[0]), issue.message]),
  );

// Kolom "website" disembunyikan dari manusia; bila terisi, kiriman dianggap bot
// dan diabaikan diam-diam dengan respons sukses.
const isBot = (formData: FormData) => {
  const honeypot = formData.get("website");
  return typeof honeypot === "string" && honeypot.length > 0;
};

export const sendMessage = async (
  _previous: FormStatus,
  formData: FormData,
): Promise<FormStatus> => {
  if (isBot(formData)) return { status: "success" };

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      code: "invalid",
      fieldErrors: fieldErrorsOf(parsed.error.issues),
    };
  }

  const { ipHash, ip } = await getVisitorHash();
  if (!(await verifyTurnstile(formData.get("cf-turnstile-response"), ip))) {
    return { status: "error", code: "captcha" };
  }

  const { error } = await createPublicClient().from("messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    body: parsed.data.message,
    ip_hash: ipHash,
  });
  if (error) {
    return {
      status: "error",
      code: error.code === RATE_LIMITED ? "rate_limited" : "server",
    };
  }
  return { status: "success" };
};

export const signGuestbook = async (
  _previous: FormStatus,
  formData: FormData,
): Promise<FormStatus> => {
  if (isBot(formData)) return { status: "success" };

  const parsed = guestbookSchema.safeParse({
    name: formData.get("name"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      code: "invalid",
      fieldErrors: fieldErrorsOf(parsed.error.issues),
    };
  }

  const avatar = formData.get("avatar");
  const hasAvatar = avatar instanceof File && avatar.size > 0;
  if (
    hasAvatar &&
    (avatar.size > GUESTBOOK_AVATAR_MAX_BYTES ||
      !isAllowedAvatarType(avatar.type))
  ) {
    return { status: "error", code: "avatar" };
  }

  const { ipHash, ip } = await getVisitorHash();
  if (!(await verifyTurnstile(formData.get("cf-turnstile-response"), ip))) {
    return { status: "error", code: "captcha" };
  }

  const db = createPublicClient();
  let avatarPath: string | null = null;
  if (hasAvatar && isAllowedAvatarType(avatar.type)) {
    avatarPath = `${randomUUID()}.${GUESTBOOK_AVATAR_TYPES[avatar.type]}`;
    const upload = await db.storage
      .from("guestbook-avatars")
      .upload(avatarPath, avatar, { contentType: avatar.type, upsert: false });
    if (upload.error) return { status: "error", code: "avatar" };
  }

  const { error } = await db.from("guestbook").insert({
    name: parsed.data.name,
    message: parsed.data.message,
    avatar_path: avatarPath,
    ip_hash: ipHash,
  });
  if (error) {
    return {
      status: "error",
      code: error.code === RATE_LIMITED ? "rate_limited" : "server",
    };
  }
  return { status: "success" };
};
