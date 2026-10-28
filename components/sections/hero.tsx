import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { buttonStyles } from "@/components/ui/button-styles";
import { SocialIconLinks } from "@/components/ui/social-links";
import { IdCardStatic } from "./id-card-static";

export const Hero = async () => {
  const [t, common] = await Promise.all([
    getTranslations("Hero"),
    getTranslations("Common"),
  ]);
  const roles = t("roles").split("|");

  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="mx-auto grid min-h-dvh max-w-6xl items-center gap-12 px-gutter pt-28 pb-16 lg:grid-cols-[1.15fr_1fr] lg:gap-8 lg:pt-24"
    >
      <div className="text-center lg:text-left">
        <p className="text-lead text-muted">{t("greeting")}</p>
        <h1
          id="hero-title"
          className="mt-2 text-display font-bold tracking-tight"
        >
          <span className="text-gradient-primary">{t("name")}</span>
        </h1>

        <ul
          aria-label={t("rolesLabel")}
          className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start"
        >
          {roles.map((role) => (
            <li
              key={role}
              className="rounded-full glass px-3 py-1.5 text-sm font-medium text-fg"
            >
              {role}
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-6 max-w-xl text-lead text-muted lg:mx-0">
          {t("description")}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
          <a href="#portfolio" className={buttonStyles.primary}>
            {t("ctaProjects")}
            <ArrowRight aria-hidden="true" className="size-4" />
          </a>
          <a href="#contact" className={buttonStyles.secondary}>
            {t("ctaContact")}
          </a>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 lg:flex-row lg:items-center lg:gap-4">
          <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">
            {t("findMe")}
          </p>
          <SocialIconLinks
            label={t("findMe")}
            newTabLabel={common("openInNewTab")}
          />
        </div>
      </div>

      <div className="flex justify-center" aria-label={t("cardAlt")} role="img">
        <IdCardStatic />
      </div>
    </section>
  );
};
