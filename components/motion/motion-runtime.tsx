"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/use-media-query";
import { usePathname } from "@/i18n/navigation";

const whenIdle = (callback: () => void) => {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout: 2000 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 300);
  return () => window.clearTimeout(id);
};

// Memuat modul adegan (GSAP, ScrollTrigger, Lenis) setelah halaman idle, dan memasang
// ulang adegan setiap pindah halaman. Tidak memuat apa pun bila gerak dikurangi.
export const MotionRuntime = () => {
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reducedMotion) return;
    let stop: (() => void) | undefined;
    let cancelled = false;
    const cancelIdle = whenIdle(() => {
      void import("./scroll-scenes").then(({ startScenes }) => {
        if (!cancelled) stop = startScenes();
      });
    });
    return () => {
      cancelled = true;
      cancelIdle();
      stop?.();
    };
  }, [reducedMotion, pathname]);

  return null;
};
