"use client";

import { Menu, Volume2, VolumeX, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { iconButtonStyles } from "@/components/ui/button-styles";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const SECTIONS = ["home", "about", "portfolio", "contact"] as const;
type Section = (typeof SECTIONS)[number];

const LANGUAGE_NAMES = { id: "Indonesia", en: "English" } as const;

// Menandai section yang sedang terlihat di beranda.
const useActiveSection = () => {
  const [active, setActive] = useState<Section>("home");

  useEffect(() => {
    const elements = SECTIONS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id as Section);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5] },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return active;
};

const LanguageSwitcher = () => {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label={t("language")}
      className="flex items-center rounded-full p-0.5"
    >
      {routing.locales.map((option) => (
        <Link
          key={option}
          href={pathname}
          locale={option}
          aria-current={option === locale ? "true" : undefined}
          aria-label={t("switchTo", { language: LANGUAGE_NAMES[option] })}
          className={cn(
            "inline-flex min-h-(--spacing-touch) min-w-11 items-center justify-center rounded-full px-2 text-xs font-semibold uppercase transition-colors duration-200",
            option === locale
              ? "bg-glass-border text-fg"
              : "text-muted hover:text-fg",
          )}
        >
          {option}
        </Link>
      ))}
    </div>
  );
};

// Musik latar mati secara default dan hanya tersedia bila ada file audionya.
const MusicToggle = ({ src }: { src: string }) => {
  const t = useTranslations("Nav");
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = async () => {
    const element = audio.current;
    if (!element) return;
    if (playing) {
      element.pause();
      setPlaying(false);
      return;
    }
    try {
      await element.play();
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audio} src={src} loop preload="none" />
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? t("musicOff") : t("musicOn")}
        className={iconButtonStyles}
      >
        {playing ? (
          <Volume2 aria-hidden="true" className="size-5" />
        ) : (
          <VolumeX aria-hidden="true" className="size-5" />
        )}
      </button>
    </>
  );
};

export const Navbar = ({ musicUrl }: { musicUrl?: string }) => {
  const t = useTranslations("Nav");
  const active = useActiveSection();
  const sheet = useRef<HTMLDialogElement>(null);

  const links = SECTIONS.map((id) => ({ id, label: t(id) }));
  const closeSheet = () => sheet.current?.close();

  return (
    <header className="pointer-events-none fixed inset-x-0 top-[max(0.75rem,env(safe-area-inset-top))] z-40 flex justify-center px-4">
      <nav
        aria-label={t("label")}
        className="pointer-events-auto flex items-center gap-1 rounded-full glass-strong p-1 shadow-lg shadow-shadow"
      >
        <ul className="hidden items-center gap-1 md:flex">
          {links.map(({ id, label }) => (
            <li key={id}>
              <Link
                href={{ pathname: "/", hash: id }}
                aria-current={active === id ? "location" : undefined}
                className={cn(
                  "inline-flex min-h-(--spacing-touch) items-center rounded-full px-4 text-sm font-medium transition-colors duration-200",
                  active === id
                    ? "bg-glass-border text-fg"
                    : "text-muted hover:text-fg",
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={{ pathname: "/", hash: "home" }}
          className="inline-flex min-h-(--spacing-touch) items-center px-3 font-heading text-sm font-bold md:hidden"
        >
          LAH<span className="text-accent-3">.</span>
        </Link>

        <span
          aria-hidden="true"
          className="mx-1 hidden h-6 w-px bg-glass-border md:block"
        />
        <LanguageSwitcher />
        {musicUrl ? <MusicToggle src={musicUrl} /> : null}

        <button
          type="button"
          onClick={() => sheet.current?.showModal()}
          aria-label={t("openMenu")}
          aria-haspopup="dialog"
          className={cn(iconButtonStyles, "md:hidden")}
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>
      </nav>

      <dialog
        ref={sheet}
        aria-label={t("label")}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeSheet();
        }}
        className="pointer-events-auto mx-auto mt-auto mb-0 w-full max-w-none rounded-t-card border-x-0 border-t border-b-0 border-glass-border bg-surface p-0 text-fg backdrop:bg-overlay md:hidden"
      >
        <div className="flex items-center justify-between px-5 pt-4">
          <span className="font-heading text-lg font-bold">
            LAH<span className="text-accent-3">.</span>
          </span>
          <button
            type="button"
            onClick={closeSheet}
            aria-label={t("closeMenu")}
            className={iconButtonStyles}
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>
        <ul className="flex flex-col gap-1 px-3 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          {links.map(({ id, label }) => (
            <li key={id}>
              <Link
                href={{ pathname: "/", hash: id }}
                onClick={closeSheet}
                aria-current={active === id ? "location" : undefined}
                className={cn(
                  "flex min-h-12 items-center rounded-control px-4 text-base font-medium",
                  active === id ? "bg-glass-border text-fg" : "text-muted",
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </dialog>
    </header>
  );
};
