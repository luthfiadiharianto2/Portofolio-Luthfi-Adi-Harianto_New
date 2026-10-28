import { getTranslations } from "next-intl/server";

export default async function HomePage() {
  const t = await getTranslations("Hero");

  return (
    <main
      id="konten"
      className="flex min-h-dvh flex-col items-center justify-center gap-8 px-gutter text-center"
    >
      <h1 className="text-display font-bold tracking-tight">
        <span className="text-gradient-primary">{t("name")}</span>
      </h1>
      <div className="flex flex-wrap justify-center gap-4">
        <a
          href="#portfolio"
          className="inline-flex min-h-(--spacing-touch) items-center rounded-control bg-gradient-primary px-6 font-medium text-fg glow"
        >
          {t("ctaProjects")}
        </a>
        <a
          href="#contact"
          className="inline-flex min-h-(--spacing-touch) items-center rounded-control glass px-6 font-medium text-fg"
        >
          {t("ctaContact")}
        </a>
      </div>
    </main>
  );
}
