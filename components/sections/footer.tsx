import { cacheLife } from "next/cache";
import { getTranslations } from "next-intl/server";
import { SocialIconLinks } from "@/components/ui/social-links";

// Tahun dihitung di dalam cache agar halaman tetap bisa dirender statis.
const getCurrentYear = async () => {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
};

export const Footer = async () => {
  const [t, common, year] = await Promise.all([
    getTranslations("Footer"),
    getTranslations("Common"),
    getCurrentYear(),
  ]);

  return (
    <footer className="border-t border-glass-border px-gutter py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="text-center text-sm text-muted sm:text-left">
          &copy; {year} Luthfi Adi Harianto. {t("text")}
        </p>
        <SocialIconLinks
          label={t("social")}
          newTabLabel={common("openInNewTab")}
          withEmail
        />
      </div>
    </footer>
  );
};
