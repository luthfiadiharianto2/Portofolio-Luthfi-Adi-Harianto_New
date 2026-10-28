"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { readTokens } from "@/lib/three/tokens";
import { cn } from "@/lib/utils";
import { progressStore } from "./progress-store";

const MAX_WAIT_MS = 4000;

// Angka persen digambar di <canvas>: kanvas bukan kandidat LCP, sehingga LCP halaman
// tetap judul hero di belakang preloader, bukan angka yang terus berubah.
const PercentCanvas = ({ progress }: { progress: number }) => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const tokens = readTokens();
    const ratio = window.devicePixelRatio || 1;
    const { width, height } = element.getBoundingClientRect();
    element.width = Math.round(width * ratio);
    element.height = Math.round(height * ratio);
    context.scale(ratio, ratio);
    context.clearRect(0, 0, width, height);
    const fill = context.createLinearGradient(0, 0, width, height);
    fill.addColorStop(0, tokens.accent);
    fill.addColorStop(0.5, tokens.accent2);
    fill.addColorStop(1, tokens.accent3);
    context.fillStyle = fill;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `700 ${Math.round(height * 0.92)}px ${tokens.headingFont}`;
    context.fillText(`${progress}%`, width / 2, height / 2);
  }, [progress]);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="h-[clamp(4rem,3rem+8vw,8rem)] w-[min(90vw,28rem)]"
    />
  );
};
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
      <PercentCanvas progress={progress} />
      <span className="sr-only">{progress}%</span>
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
