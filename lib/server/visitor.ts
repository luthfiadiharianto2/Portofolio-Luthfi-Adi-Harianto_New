import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";

// Hash IP pengunjung dengan garam rahasia. IP mentah tidak pernah disimpan.
export const getVisitorHash = async () => {
  const salt = process.env.IP_HASH_SALT;
  if (!salt) throw new Error("IP_HASH_SALT belum diatur");

  const requestHeaders = await headers();
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown";
  return {
    ipHash: createHash("sha256").update(`${salt}:${ip}`).digest("hex"),
    ip,
  };
};

// Cloudflare Turnstile hanya diperiksa bila kunci rahasianya diatur.
export const verifyTurnstile = async (
  token: FormDataEntryValue | null,
  ip: string,
) => {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || token.length === 0) return false;

  const body = new URLSearchParams({ secret, response: token, remoteip: ip });
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body,
    },
  );
  const result = (await response.json()) as { success?: boolean };
  return result.success === true;
};
