"use client";

import { useEffect, useState } from "react";
import {
  type QualityProfile,
  qualityOf,
  readDeviceInfo,
} from "@/lib/three/device-tier";
import { useReducedMotion } from "./use-media-query";

// null selama belum diketahui (render server dan sebelum efek berjalan).
export const useDeviceTier = (): QualityProfile | null => {
  const reducedMotion = useReducedMotion();
  const [quality, setQuality] = useState<QualityProfile | null>(null);

  useEffect(() => {
    const update = () => {
      const info = readDeviceInfo(reducedMotion);
      // ?3d=force melewati pemeriksaan renderer dan perangkat keras (untuk pengujian
      // di browser tanpa GPU). WebGL dan preferensi gerak dikurangi tetap dihormati.
      if (new URLSearchParams(window.location.search).get("3d") === "force") {
        Object.assign(info, {
          renderer: "",
          cores: undefined,
          memoryGb: undefined,
        });
      }
      setQuality(qualityOf(info));
    };
    update();
    const resize = () => window.requestAnimationFrame(update);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [reducedMotion]);

  return quality;
};
