"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useAfterLoad } from "@/hooks/use-after-load";
import { useDeviceTier } from "@/hooks/use-device-tier";
import { useReducedMotion } from "@/hooks/use-media-query";

const StarfieldCanvas = dynamic(() => import("./starfield-canvas"), {
  ssr: false,
});
const Starfield2D = dynamic(() => import("./starfield-2d"), { ssr: false });

// Latar bintang, dimuat setelah halaman selesai dimuat:
// - desktop dan tablet: Points three.js dengan parallax mouse dan PerformanceMonitor;
// - HP: Canvas 2D ringan (tanpa three.js) dengan parallax scroll;
// - tanpa WebGL, gerak dikurangi, atau perangkat lemah: bintang statis CSS.
export const Starfield = () => {
  const quality = useDeviceTier();
  const reducedMotion = useReducedMotion();
  const afterLoad = useAfterLoad();
  const [unsupported, setUnsupported] = useState(false);
  const active =
    quality !== null && quality.tier !== "none" && afterLoad && !unsupported;

  return (
    <div
      aria-hidden="true"
      className="starfield-static pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {active && quality.breakpoint === "phone" ? (
        <Starfield2D count={quality.stars} interactive={!reducedMotion} />
      ) : null}
      {active && quality.breakpoint !== "phone" ? (
        <StarfieldCanvas
          quality={quality}
          interactive={!reducedMotion}
          onUnsupported={() => setUnsupported(true)}
        />
      ) : null}
    </div>
  );
};
