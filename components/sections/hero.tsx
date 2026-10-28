import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import { TypingRoles } from "@/components/motion/typing-roles";
import { getTranslations } from "next-intl/server";
import { buttonStyles } from "@/components/ui/button-styles";
import { SocialIconLinks } from "@/components/ui/social-links";
import { HeroCard } from "@/components/three/hero-card";
import { Preloader } from "@/components/three/preloader";
import { PROFILE_IMAGE } from "@/lib/site";
import { IdCardStatic } from "./id-card-static";

export const Hero = async () => {
  const [t, common, card] = await Promise.all([
    getTranslations("Hero"),
    getTranslations("Common"),
    getTranslations("IdCard"),
  ]);
  const roles = t("roles").split("|");

  return (
    <>
      <Preloader />
      <section
        id="home"
        aria-labelledby="hero-title"
        className="mx-auto grid min-h-dvh max-w-6xl items-center gap-12 px-gutter pt-28 pb-16 lg:grid-cols-[1.15fr_1fr] lg:gap-8 lg:pt-24"
      >
        <div className="text-center lg:text-left">
          <p className="hero-rise text-lead text-muted">{t("greeting")}</p>
          <h1
            id="hero-title"
            className="hero-rise mt-2 text-display font-bold tracking-tight"
            style={{ "--rise-index": 1 } as CSSProperties}
          >
            <span className="text-gradient-primary">{t("name")}</span>
          </h1>

          <div
            className="hero-rise"
            style={{ "--rise-index": 2 } as CSSProperties}
          >
            <TypingRoles roles={roles} label={t("rolesLabel")} />
          </div>

          <p
            className="hero-rise mx-auto mt-6 max-w-xl text-lead text-muted lg:mx-0"
            style={{ "--rise-index": 3 } as CSSProperties}
          >
            {t("description")}
          </p>

          <div
            className="hero-rise mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
            style={{ "--rise-index": 4 } as CSSProperties}
          >
            <a href="#portfolio" data-magnetic className={buttonStyles.primary}>
              {t("ctaProjects")}
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
            <a href="#contact" data-magnetic className={buttonStyles.secondary}>
              {t("ctaContact")}
            </a>
          </div>

          <div
            className="hero-rise mt-10 flex flex-col items-center gap-3 lg:flex-row lg:items-center lg:gap-4"
            style={{ "--rise-index": 5 } as CSSProperties}
          >
            <p className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">
              {t("findMe")}
            </p>
            <SocialIconLinks
              label={t("findMe")}
              newTabLabel={common("openInNewTab")}
            />
          </div>
        </div>

        <HeroCard
          label={t("cardAlt")}
          content={{
            name: t("name"),
            role: card("role"),
            university: card("university"),
            photoUrl: PROFILE_IMAGE,
            issued: "ID · 2023",
          }}
        >
          <IdCardStatic />
        </HeroCard>
      </section>
    </>
  );
};
