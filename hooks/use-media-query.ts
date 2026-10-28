"use client";

import { useSyncExternalStore } from "react";

// Nilai media query yang ikut berubah saat kondisi berubah. Di server selalu false.
export const useMediaQuery = (query: string) =>
  useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );

export const useReducedMotion = () =>
  useMediaQuery("(prefers-reduced-motion: reduce)");
