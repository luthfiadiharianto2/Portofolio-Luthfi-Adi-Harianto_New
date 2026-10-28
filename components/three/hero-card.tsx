"use client";

import dynamic from "next/dynamic";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDeviceTier } from "@/hooks/use-device-tier";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import type { CardBaseContent } from "./card-textures";
import { progressStore } from "./progress-store";

// Potongan 3D dimuat malas dan hanya di browser.
const IdCardCanvas = dynamic(() => import("./id-card-canvas"), { ssr: false });

type HeroCardProps = {
  /** Kartu statis: tampil sampai 3D siap, dan menjadi cadangan tanpa WebGL. */
  children: ReactNode;
  content: CardBaseContent;
  label: string;
};

export const HeroCard = ({ children, content, label }: HeroCardProps) => {
  const container = useRef<HTMLDivElement>(null);
  const quality = useDeviceTier();
  const inView = useInView(container);
  const [ready, setReady] = useState(false);
  const use3d = quality !== null && quality.tier !== "none";

  useEffect(() => {
    if (quality && !use3d) progressStore.finish();
  }, [quality, use3d]);

  const onReady = useCallback(() => setReady(true), []);

  return (
    <div
      ref={container}
      role="img"
      aria-label={label}
      className="relative flex h-[30rem] w-full justify-center sm:h-[36rem] lg:h-[40rem]"
    >
      <div
        aria-hidden="true"
        className={cn(
          "flex w-full justify-center transition-opacity duration-500 ease-(--ease-standard)",
          use3d && ready && "opacity-0",
        )}
      >
        {children}
      </div>
      {use3d ? (
        <div className="absolute inset-0" data-testid="id-card-3d">
          <IdCardCanvas
            quality={quality}
            active={inView}
            content={content}
            onReady={onReady}
          />
        </div>
      ) : null}
    </div>
  );
};
