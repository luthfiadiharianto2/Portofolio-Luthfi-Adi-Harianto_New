import { describe, expect, it } from "vitest";
import {
  contactSchema,
  GUESTBOOK_AVATAR_TYPES,
  guestbookSchema,
  isAllowedAvatarType,
} from "@/lib/validators/contact";
import en from "@/messages/en.json";
import id from "@/messages/id.json";

const messageOf = (result: {
  success: boolean;
  error?: { issues: { message: string }[] };
}) => result.error?.issues.map((issue) => issue.message);

describe("skema form kontak", () => {
  it("menerima isian yang valid dan merapikan spasi", () => {
    const result = contactSchema.parse({
      name: "  Ani  ",
      email: "ani@contoh.com",
      message: "Halo, salam kenal",
    });
    expect(result.name).toBe("Ani");
  });

  it("memakai batas yang sama dengan database", () => {
    expect(
      messageOf(
        contactSchema.safeParse({
          name: "A",
          email: "a@b.co",
          message: "Halo semua",
        }),
      ),
    ).toEqual(["nameMin"]);
    expect(
      messageOf(
        contactSchema.safeParse({
          name: "x".repeat(61),
          email: "a@b.co",
          message: "Halo semua",
        }),
      ),
    ).toEqual(["nameMax"]);
    expect(
      messageOf(
        contactSchema.safeParse({
          name: "Ani",
          email: "bukan-email",
          message: "Halo semua",
        }),
      ),
    ).toEqual(["emailInvalid"]);
    expect(
      messageOf(
        contactSchema.safeParse({
          name: "Ani",
          email: "a@b.co",
          message: "hai",
        }),
      ),
    ).toEqual(["messageMin"]);
    expect(
      messageOf(
        contactSchema.safeParse({
          name: "Ani",
          email: "a@b.co",
          message: "x".repeat(1001),
        }),
      ),
    ).toEqual(["messageMax"]);
  });

  it("menolak buku tamu dengan komentar kosong", () => {
    expect(
      guestbookSchema.safeParse({ name: "Budi", message: "     " }).success,
    ).toBe(false);
  });

  it("setiap kunci galat punya terjemahan di kedua bahasa", () => {
    for (const key of [
      "nameMin",
      "nameMax",
      "emailInvalid",
      "messageMin",
      "messageMax",
    ]) {
      expect(id.Validation).toHaveProperty(key);
      expect(en.Validation).toHaveProperty(key);
    }
  });
});

describe("foto buku tamu", () => {
  it("hanya menerima tipe gambar yang juga diizinkan bucket", () => {
    expect(Object.keys(GUESTBOOK_AVATAR_TYPES).every(isAllowedAvatarType)).toBe(
      true,
    );
    expect(isAllowedAvatarType("image/svg+xml")).toBe(false);
    expect(isAllowedAvatarType("application/pdf")).toBe(false);
  });
});
