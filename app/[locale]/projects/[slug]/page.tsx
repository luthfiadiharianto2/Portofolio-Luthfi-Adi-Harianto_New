import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { siGithub } from "simple-icons";
import { BrandIcon } from "@/components/icons/brand";
import { TechIcon } from "@/components/icons/tech-icon";
import { ProjectGallery } from "@/components/sections/project-gallery";
import { buttonStyles } from "@/components/ui/button-styles";
import { Link } from "@/i18n/navigation";
import { getProject, getProjects } from "@/lib/data/content";
import { pick } from "@/lib/localized";
import { localeAlternates, openGraphFor, SITE_NAME } from "@/lib/seo";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [project, locale] = await Promise.all([getProject(slug), getLocale()]);
  if (!project) return {};
  const description = pick(project.tagline, locale);
  const path = `/projects/${project.slug}`;
  return {
    title: project.title,
    description,
    alternates: localeAlternates(locale, path),
    openGraph: openGraphFor(locale, {
      title: `${project.title} | ${SITE_NAME}`,
      description,
      path,
      type: "article",
    }),
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { slug } = await params;
  const [project, projects, locale, t, common, nav] = await Promise.all([
    getProject(slug),
    getProjects(),
    getLocale(),
    getTranslations("Project"),
    getTranslations("Common"),
    getTranslations("Nav"),
  ]);
  if (!project) notFound();

  const index = projects.findIndex((item) => item.slug === project.slug);
  const previous = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const images = project.project_images.map((image) => ({
    path: image.path,
    alt: pick(image.alt, locale),
  }));
  const total = images.length;

  return (
    <article className="mx-auto max-w-5xl px-gutter pt-28 pb-20">
      <nav aria-label={t("breadcrumb")} className="mb-6 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-1">
          <li>
            <Link
              href="/"
              className="inline-flex min-h-(--spacing-touch) items-center hover:text-fg"
            >
              {common("home")}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-4" />
          </li>
          <li>
            <Link
              href={{ pathname: "/", hash: "portfolio" }}
              className="inline-flex min-h-(--spacing-touch) items-center hover:text-fg"
            >
              {nav("portfolio")}
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-4" />
          </li>
          <li aria-current="page" className="text-fg">
            {project.title}
          </li>
        </ol>
      </nav>

      <Link
        href={{ pathname: "/", hash: "portfolio" }}
        className={`${buttonStyles.secondary} mb-8`}
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        {common("back")}
      </Link>

      <header>
        <p className="text-sm font-semibold tracking-wider text-accent-3 uppercase">
          {pick(project.label, locale)}
        </p>
        <h1 className="mt-2 text-title font-bold tracking-tight">
          <span className="text-gradient-primary">{project.title}</span>
        </h1>
        <p className="mt-3 text-lead text-muted">
          {pick(project.tagline, locale)}
        </p>
        {project.demo_url || project.repo_url ? (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.demo_url ? (
              <a
                href={project.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles.primary}
              >
                {t("demo")}
                <ExternalLink aria-hidden="true" className="size-4" />
                <span className="sr-only">{common("openInNewTab")}</span>
              </a>
            ) : null}
            {project.repo_url ? (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonStyles.secondary}
              >
                <BrandIcon icon={siGithub} className="size-4" />
                {t("repo")}
                <span className="sr-only">{common("openInNewTab")}</span>
              </a>
            ) : null}
          </div>
        ) : null}
      </header>

      {total > 0 ? (
        <section aria-labelledby="gallery-title" className="mt-12">
          <h2 id="gallery-title" className="mb-4 text-xl font-semibold">
            {t("gallery")}
          </h2>
          <ProjectGallery
            images={images}
            labels={{
              hint: t("galleryHint"),
              open: images.map((_, i) =>
                t("openImage", { index: i + 1, total }),
              ),
              counter: images.map((_, i) =>
                t("imageCounter", { index: i + 1, total }),
              ),
              dialog: t("lightboxLabel"),
              close: common("close"),
              previous: common("previous"),
              next: common("next"),
            }}
          />
        </section>
      ) : null}

      <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="flex flex-col gap-10">
          <section aria-labelledby="description-title">
            <h2 id="description-title" className="mb-3 text-xl font-semibold">
              {t("description")}
            </h2>
            <p className="text-lead text-muted">
              {pick(project.description, locale)}
            </p>
          </section>

          <section aria-labelledby="steps-title">
            <h2 id="steps-title" className="mb-5 text-xl font-semibold">
              {t("steps")}
            </h2>
            <ol className="relative ml-4 flex flex-col gap-6 border-l border-glass-border pl-8">
              {project.project_steps.map((step, stepIndex) => (
                <li key={stepIndex} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute top-0 -left-[3.05rem] flex size-9 items-center justify-center rounded-full bg-gradient-button text-sm font-semibold text-fg ring-4 ring-bg"
                  >
                    {stepIndex + 1}
                  </span>
                  <h3 className="font-semibold">{pick(step.title, locale)}</h3>
                  <p className="mt-1 text-muted">
                    {pick(step.description, locale)}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="flex flex-col gap-8">
          <section
            aria-labelledby="features-title"
            className="rounded-card glass p-6"
          >
            <h2 id="features-title" className="mb-4 text-lg font-semibold">
              {t("features")}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {pick(project.features, locale).map((feature) => (
                <li
                  key={feature}
                  className="rounded-full bg-glass-border px-3 py-1.5 text-sm"
                >
                  {feature}
                </li>
              ))}
            </ul>
          </section>
          <section
            aria-labelledby="tech-title"
            className="rounded-card glass p-6"
          >
            <h2 id="tech-title" className="mb-4 text-lg font-semibold">
              {t("technologies")}
            </h2>
            <ul className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li
                  key={tech}
                  className="inline-flex items-center gap-2 rounded-full border border-glass-border px-3 py-1.5 text-sm"
                >
                  <TechIcon name={tech} className="size-4" />
                  {tech}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      {previous && next && projects.length > 1 ? (
        <nav
          aria-label={t("pagination")}
          className="mt-16 grid grid-cols-1 gap-4 border-t border-glass-border pt-8 sm:grid-cols-2"
        >
          <Link
            href={`/projects/${previous.slug}`}
            className="flex min-h-20 items-center gap-3 rounded-card glass p-5 transition-colors hover:bg-glass-border"
          >
            <ArrowLeft aria-hidden="true" className="size-5 shrink-0" />
            <span>
              <span className="block text-xs text-muted">
                {t("previousProject")}
              </span>
              <span className="font-semibold">{previous.title}</span>
            </span>
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            className="flex min-h-20 items-center justify-end gap-3 rounded-card glass p-5 text-right transition-colors hover:bg-glass-border"
          >
            <span>
              <span className="block text-xs text-muted">
                {t("nextProject")}
              </span>
              <span className="font-semibold">{next.title}</span>
            </span>
            <ArrowRight aria-hidden="true" className="size-5 shrink-0" />
          </Link>
        </nav>
      ) : null}
    </article>
  );
}
