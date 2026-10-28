"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/use-media-query";
import { usePathname } from "@/i18n/navigation";
import { onFirstInteraction } from "@/lib/first-interaction";
import { startReveal } from "./reveal";

const whenIdle = (callback: () => void) => {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 300);
  return () => window.clearTimeout(id);
};

// "Muncul saat scroll" dipasang saat halaman idle. Modul adegan (GSAP, ScrollTrigger,
// Lenis) baru dimuat saat interaksi pertama: adegannya hanya menyentuh elemen di bawah
// layar, jadi tidak ada yang berubah sebelum pengguna mulai scroll atau menggerakkan
// pointer. Dipasang ulang setiap pindah halaman; tidak dimuat bila gerak dikurangi.
export const MotionRuntime = () => {
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reducedMotion) return;
    let stop: (() => void) | undefined;
    let cancelled = false;
    let stopReveal: (() => void) | undefined;
    let cancelInteraction = () => {};
    const cancelIdle = whenIdle(() => {
      stopReveal = startReveal();
      cancelInteraction = onFirstInteraction(() => {
        void import("./scroll-scenes").then(({ startScenes }) => {
          if (!cancelled) stop = startScenes();
        });
      });
    });
    return () => {
      cancelled = true;
      cancelIdle();
      cancelInteraction();
      stopReveal?.();
      stop?.();
    };
  }, [reducedMotion, pathname]);

  return null;
};
