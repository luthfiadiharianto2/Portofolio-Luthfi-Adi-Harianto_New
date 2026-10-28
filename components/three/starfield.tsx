"use client";

import dynamic from "next/dynamic";
import { useDeviceTier } from "@/hooks/use-device-tier";
import { useReducedMotion } from "@/hooks/use-media-query";

const StarfieldCanvas = dynamic(() => import("./starfield-canvas"), {
  ssr: false,
});

// Latar bintang. Tanpa WebGL, dengan gerak dikurangi, atau di perangkat lemah,
// yang tampil adalah bintang statis dari CSS (kelas "starfield-static").
export const Starfield = () => {
  const quality = useDeviceTier();
  const reducedMotion = useReducedMotion();
  const use3d = quality !== null && quality.tier !== "none";

  return (
    <div
      aria-hidden="true"
      className="starfield-static pointer-events-none fixed inset-0 -z-10"
    >
      {use3d ? (
        <StarfieldCanvas quality={quality} interactive={!reducedMotion} />
      ) : null}
    </div>
  );
};
