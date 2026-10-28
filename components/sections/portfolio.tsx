import { Award, ExternalLink } from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { categoryIcons, TechIcon } from "@/components/icons/tech-icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tabs } from "@/components/ui/tabs";
import {
  getBackground,
  getCertificates,
  getProjects,
} from "@/lib/data/content";
import { pick } from "@/lib/localized";
import { ProjectCard } from "./project-card";
import { ProjectsPanel } from "./projects-panel";

export const Portfolio = async () => {
  const [t, common, locale, projects, certificates, background] =
    await Promise.all([
      getTranslations("Portfolio"),
      getTranslations("Common"),
      getLocale(),
      getProjects(),
      getCertificates(),
      getBackground(),
    ]);

  const projectsPanel = (
    <ProjectsPanel
      cards={projects.map((project) => ({
        slug: project.slug,
        category: project.category,
        card: (
          <ProjectCard
            slug={project.slug}
            title={project.title}
            label={pick(project.label, locale)}
            tagline={pick(project.tagline, locale)}
            thumbnail={project.thumbnail}
            thumbnailAlt={t("thumbnailAlt", { title: project.title })}
            technologies={project.technologies}
            detailsLabel={t("details")}
          />
        ),
      }))}
      labels={{
        filter: t("filterLabel"),
        empty: t("emptyFilter"),
        categories: [
          { value: "all", label: t("filterAll") },
          { value: "uiux", label: t("filterUiux") },
          { value: "web", label: t("filterWeb") },
          { value: "data", label: t("filterData") },
          { value: "qa", label: t("filterQa") },
        ],
      }}
    />
  );

  const certificatesPanel =
    certificates.length === 0 ? (
      <div className="mx-auto max-w-md rounded-card glass p-10 text-center">
        <Award aria-hidden="true" className="mx-auto size-10 text-accent-2" />
        <p className="mt-4 font-heading text-xl font-semibold">
          {t("certificatesEmptyTitle")}
        </p>
        <p className="mt-2 text-muted">{t("certificatesEmptyText")}</p>
      </div>
    ) : (
      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certificates.map((certificate) => (
          <li
            key={`${pick(certificate.title, "en")}-${certificate.year}`}
            className="overflow-hidden rounded-card glass"
          >
            {certificate.image_path ? (
              <div className="relative aspect-[4/3]">
                <Image
                  src={certificate.image_path}
                  alt={pick(certificate.title, locale)}
                  fill
                  sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 92vw"
                  className="object-cover"
                />
              </div>
            ) : null}
            <div className="p-5">
              <p className="font-heading text-lg font-semibold">
                {pick(certificate.title, locale)}
              </p>
              <p className="mt-1 text-sm text-muted">
                {t("certificateIssued", {
                  issuer: certificate.issuer,
                  year: certificate.year,
                })}
              </p>
              {certificate.credential_url ? (
                <a
                  href={certificate.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex min-h-(--spacing-touch) items-center gap-1.5 text-sm font-medium text-accent-3"
                >
                  {t("viewCredential")}
                  <ExternalLink aria-hidden="true" className="size-4" />
                  <span className="sr-only">{common("openInNewTab")}</span>
                </a>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    );

  const achievementsPanel = (
    <ul
      data-reveal
      className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2"
    >
      {background.achievements.map((achievement, index) => (
        <li
          key={index}
          className="flex items-start gap-4 rounded-card glass p-5"
        >
          <span
            aria-hidden="true"
            className="flex size-12 shrink-0 items-center justify-center rounded-full bg-glass-border text-2xl"
          >
            {achievement.icon}
          </span>
          <div>
            <p className="font-semibold">{pick(achievement.title, locale)}</p>
            <p className="mt-1 text-sm text-muted">
              {pick(achievement.detail, locale)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );

  // Semua item keahlian tanpa duplikat, untuk marquee dekoratif di atas grid.
  const allTech = [
    ...new Set(background.skills.flatMap((skill) => skill.items)),
  ];
  const marqueeRow = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-8 pr-8"
    >
      {allTech.map((item) => (
        <li
          key={item}
          className="flex items-center gap-2 text-sm whitespace-nowrap text-muted"
        >
          <TechIcon name={item} className="size-5" />
          {item}
        </li>
      ))}
    </ul>
  );

  const techStackPanel = (
    <div className="flex flex-col gap-10">
      <div
        aria-hidden="true"
        className="marquee overflow-hidden rounded-card glass py-4"
      >
        <div className="marquee-track">
          {marqueeRow(false)}
          {marqueeRow(true)}
        </div>
      </div>
      {background.skills.map((skill) => {
        const CategoryIcon = categoryIcons[skill.icon] ?? Award;
        return (
          <div key={pick(skill.category, "en")}>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <CategoryIcon
                aria-hidden="true"
                className="size-5 text-accent-2"
              />
              {pick(skill.category, locale)}
            </h3>
            <ul data-reveal className="grid grid-cols-4 gap-3 lg:grid-cols-6">
              {skill.items.map((item) => (
                <li
                  key={item}
                  className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-card glass p-3 text-center transition-transform duration-200 ease-(--ease-standard) hover:-translate-y-1"
                >
                  <TechIcon name={item} className="size-6" />
                  <span className="text-[0.7rem] leading-tight text-muted sm:text-xs">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );

  return (
    <section
      id="portfolio"
      aria-labelledby="portfolio-title"
      className="mx-auto max-w-6xl px-gutter py-section"
    >
      <SectionHeading
        id="portfolio-title"
        label={t("label")}
        title={t("title")}
        subtitle={t("subtitle")}
      />
      <Tabs
        label={t("tabsLabel")}
        tabs={[
          { id: "projects", label: t("tabProjects"), panel: projectsPanel },
          {
            id: "certificates",
            label: t("tabCertificates"),
            panel: certificatesPanel,
          },
          {
            id: "achievements",
            label: t("tabAchievements"),
            panel: achievementsPanel,
          },
          { id: "tech-stack", label: t("tabTechStack"), panel: techStackPanel },
        ]}
      />
    </section>
  );
};
