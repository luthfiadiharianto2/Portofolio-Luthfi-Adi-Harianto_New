import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <main
      id="konten"
      className="flex min-h-dvh flex-col items-center justify-center gap-6 px-gutter text-center"
    >
      <h1 className="text-title font-bold">{t("title")}</h1>
      <Link
        href="/"
        className="inline-flex min-h-(--spacing-touch) items-center rounded-control glass px-6"
      >
        {t("back")}
      </Link>
    </main>
  );
}
