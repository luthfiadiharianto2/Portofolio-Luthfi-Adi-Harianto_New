"use client";

import { animate } from "motion/mini";
import { type ReactNode, useEffect, useRef } from "react";

// Transisi antar rute: fade dan geser pendek 0,35 detik (motion). Halaman pertama
// tidak dianimasikan agar LCP tidak tertunda; gerak dikurangi juga dilewati.
let hasNavigated = false;

export default function Template({ children }: { children: ReactNode }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = container.current;
    const shouldAnimate = hasNavigated;
    hasNavigated = true;
    if (!element || !shouldAnimate) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    animate(
      element,
      { opacity: [0, 1], transform: ["translateY(12px)", "translateY(0)"] },
      { duration: 0.35, ease: [0.4, 0, 0.2, 1] },
    );
  }, []);

  return <div ref={container}>{children}</div>;
}
