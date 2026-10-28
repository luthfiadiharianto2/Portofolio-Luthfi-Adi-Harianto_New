import { z } from "zod";
import type { Locale } from "next-intl";

export const localizedSchema = z.object({ id: z.string(), en: z.string() });
export const localizedListSchema = z.object({
  id: z.array(z.string()),
  en: z.array(z.string()),
});

export type Localized = z.infer<typeof localizedSchema>;
export type LocalizedList = z.infer<typeof localizedListSchema>;

export const pick = <T>(value: { id: T; en: T }, locale: Locale): T =>
  value[locale];
