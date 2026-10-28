import { describe, expect, it } from "vitest";
import { routing } from "@/i18n/routing";
import en from "@/messages/en.json";
import id from "@/messages/id.json";

type Messages = { [key: string]: string | Messages };

const flattenKeys = (messages: Messages, prefix = ""): string[] =>
  Object.entries(messages).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string" ? [path] : flattenKeys(value, path);
  });

const flattenValues = (messages: Messages): string[] =>
  Object.values(messages).flatMap((value) =>
    typeof value === "string" ? [value] : flattenValues(value),
  );

describe("routing", () => {
  it("mendukung id dan en dengan default id", () => {
    expect(routing.locales).toEqual(["id", "en"]);
    expect(routing.defaultLocale).toBe("id");
  });
});

describe("kamus terjemahan", () => {
  it("id dan en memiliki kunci yang sama", () => {
    expect(flattenKeys(en).sort()).toEqual(flattenKeys(id).sort());
  });

  it("tidak ada teks kosong", () => {
    for (const value of [...flattenValues(id), ...flattenValues(en)]) {
      expect(value.trim()).not.toBe("");
    }
  });
});
