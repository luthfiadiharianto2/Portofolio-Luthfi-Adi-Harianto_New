import { Music2 } from "lucide-react";
import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getBackground,
  getCertificates,
  getProjects,
} from "@/lib/data/content";
import { publicEnv } from "@/lib/env";
import { pick } from "@/lib/localized";
import { PROFILE_IMAGE } from "@/lib/site";

const MusicCard = async ({ playlistId }: { playlistId: string }) => {
  const t = await getTranslations("About");
  return (
    <div className="rounded-card glass p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-full bg-gradient-button text-fg">
          <Music2 aria-hidden="true" className="size-5" />
        </span>
        <div>
          <p className="font-heading font-semibold">{t("musicTitle")}</p>
          <p className="text-sm text-muted">{t("musicSubtitle")}</p>
        </div>
      </div>
      <iframe
        title={t("musicFrameTitle")}
        src={`https://open.spotify.com/embed/playlist/${encodeURIComponent(playlistId)}?theme=0`}
        loading="lazy"
        allow="encrypted-media"
        className="mt-4 h-38 w-full rounded-control border-0"
      />
    </div>
  );
};

export const About = async () => {
  const [t, locale, background, projects, certificates] = await Promise.all([
    getTranslations("About"),
    getLocale(),
    getBackground(),
    getProjects(),
    getCertificates(),
  ]);

  const info = [
    { label: t("infoName"), value: "Luthfi Adi Harianto" },
    { label: t("infoUniversity"), value: "Telkom University Purwokerto" },
    { label: t("infoLocation"), value: t("location") },
    { label: t("infoFocus"), value: t("focus") },
  ];

  // Angka selalu dihitung dari isi database.
  const stats = [
    { label: t("statProjects"), value: projects.length },
    { label: t("statCertificates"), value: certificates.length },
    { label: t("statAchievements"), value: background.achievements.length },
  ];

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      data-defer-render
      className="mx-auto max-w-6xl px-gutter py-section"
    >
      <SectionHeading
        id="about-title"
        label={t("label")}
        title={t("title")}
        glitch
      />

      <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-14">
        <div
          data-reveal
          className="mx-auto w-full max-w-sm lg:sticky lg:top-28"
        >
          <div className="relative rounded-card glass p-3 glow">
            <div
              aria-hidden="true"
              className="absolute -inset-px -z-10 rounded-card bg-gradient-primary opacity-40 blur-xl"
            />
            <div className="relative aspect-[4/5] overflow-hidden rounded-control">
              <Image
                src={PROFILE_IMAGE}
                alt={t("photoAlt")}
                fill
                sizes="(min-width: 1024px) 24rem, (min-width: 640px) 24rem, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-10">
          <div data-reveal className="flex flex-col gap-4 text-lead text-muted">
            <p>
              {t.rich("p1", {
                strong: (chunks) => (
                  <strong className="text-fg">{chunks}</strong>
                ),
              })}
            </p>
            <p>{t("p2")}</p>
          </div>

          <dl data-reveal className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {info.map(({ label, value }) => (
              <div key={label} className="rounded-card glass p-4">
                <dt className="text-xs font-semibold tracking-wider text-muted uppercase">
                  {label}
                </dt>
                <dd className="mt-1 font-medium">{value}</dd>
              </div>
            ))}
          </dl>

          <ul data-reveal className="grid grid-cols-3 gap-3">
            {stats.map(({ label, value }) => (
              <li
                key={label}
                className="min-w-0 rounded-card glass px-2 py-4 text-center sm:p-4"
              >
                <p
                  data-count={value}
                  className="text-gradient-primary font-heading text-3xl font-bold tabular-nums sm:text-4xl"
                >
                  {value}
                </p>
                <p className="mt-1 text-[0.625rem] [overflow-wrap:anywhere] text-muted min-[360px]:text-xs sm:text-sm">
                  {label}
                </p>
              </li>
            ))}
          </ul>

          <div>
            <h3 className="mb-5 text-xl font-semibold">
              {t("experienceTitle")}
            </h3>
            <ol
              data-reveal
              className="relative ml-2 flex flex-col gap-6 border-l border-glass-border pl-6"
            >
              {background.experiences.map((experience) => (
                <li key={pick(experience.title, "en")} className="relative">
                  <span
                    aria-hidden="true"
                    className="absolute top-1.5 -left-[1.95rem] size-3 rounded-full bg-gradient-primary ring-4 ring-bg"
                  />
                  <p className="text-sm font-medium text-accent-3">
                    {pick(experience.period, locale)}
                  </p>
                  <p className="mt-1 font-semibold">
                    {pick(experience.title, locale)}
                  </p>
                  <p className="text-sm text-muted">
                    {pick(experience.place, locale)}
                  </p>
                  <p className="mt-2 text-muted">
                    {pick(experience.description, locale)}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-xl font-semibold">
                {t("educationTitle")}
              </h3>
              <ul data-reveal className="flex flex-col gap-3">
                {background.education.map((item) => (
                  <li key={item.institution} className="rounded-card glass p-4">
                    <p className="text-sm font-medium text-accent-3">
                      {pick(item.period, locale)}
                    </p>
                    <p className="mt-1 font-semibold">{item.institution}</p>
                    <p className="text-sm text-muted">
                      {pick(item.degree, locale)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-xl font-semibold">
                {t("organizationsTitle")}
              </h3>
              <ul data-reveal className="flex flex-col gap-3">
                {background.organizations.map((item) => (
                  <li
                    key={item.organization}
                    className="rounded-card glass p-4"
                  >
                    <p className="text-sm font-medium text-accent-3">
                      {pick(item.period, locale)}
                    </p>
                    <p className="mt-1 font-semibold">
                      {pick(item.role, locale)} · {item.organization}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {pick(item.description, locale)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {publicEnv.spotifyPlaylistId ? (
            <MusicCard playlistId={publicEnv.spotifyPlaylistId} />
          ) : null}
        </div>
      </div>
    </section>
  );
};
