import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";
import { createSessionClient } from "@/lib/supabase/server";

const OTP_TYPES = new Set<EmailOtpType>(["magiclink", "email", "invite"]);

// Tujuan tautan magic link. Mendukung dua bentuk:
// - ?code=… (alur PKCE bawaan @supabase/ssr dengan template email standar)
// - ?token_hash=…&type=… (template email yang memakai {{ .TokenHash }})
// Sesudah berhasil, token tidak ikut di URL tujuan.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const supabase = await createSessionClient();
  let ok = false;
  if (code) {
    ok = !(await supabase.auth.exchangeCodeForSession(code)).error;
  } else if (tokenHash && type && OTP_TYPES.has(type)) {
    ok = !(await supabase.auth.verifyOtp({ type, token_hash: tokenHash }))
      .error;
  }

  const target = new URL(
    ok ? "/admin" : "/admin/login?galat=tautan",
    request.nextUrl.origin,
  );
  const response = NextResponse.redirect(target);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
