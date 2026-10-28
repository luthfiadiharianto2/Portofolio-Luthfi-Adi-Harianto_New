"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { progressStore } from "./progress-store";

const MAX_WAIT_MS = 4000;
const FADE_MS = 500;

// Layar pemuatan dengan persen dari progres aset 3D yang sungguhan (useProgress drei).
// Paling lama 4 detik; setelah itu halaman dibuka dan 3D menyusul.
// Bila JavaScript gagal, animasi CSS "preloader-out" tetap menyembunyikannya.
export const Preloader = () => {
  const t = useTranslations("Preloader");
  const { progress, done } = useSyncExternalStore(
    progressStore.subscribe,
    progressStore.get,
    progressStore.get,
  );
  const [timedOut, setTimedOut] = useState(false);
  const [removed, setRemoved] = useState(false);
  const hidden = done || timedOut;

  useEffect(() => {
    // Dihitung sejak navigasi dimulai, bukan sejak komponen ini dimuat.
    const remaining = Math.max(0, MAX_WAIT_MS - performance.now());
    const timer = window.setTimeout(() => setTimedOut(true), remaining);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hidden) return;
    const timer = window.setTimeout(() => setRemoved(true), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [hidden]);

  if (removed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={!hidden}
      className={cn(
        "fixed inset-0 z-50 flex h-dvh animate-[preloader-out_0.5s_3s_forwards] flex-col items-center justify-center gap-4 bg-bg transition-opacity duration-500 ease-(--ease-standard)",
        hidden && "pointer-events-none opacity-0",
      )}
    >
      <p className="text-gradient-primary font-heading text-[clamp(4rem,3rem+8vw,8rem)] leading-none font-bold tabular-nums">
        {progress}
        <span className="text-[0.4em]">%</span>
      </p>
      <p className="text-sm tracking-[0.2em] text-muted uppercase">
        {t("loading")}
      </p>
      <div
        aria-hidden="true"
        className="h-0.5 w-40 overflow-hidden rounded-full bg-glass-border"
      >
        <div
          className="h-full origin-left bg-gradient-primary transition-transform duration-300 ease-(--ease-standard)"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>
    </div>
  );
};
