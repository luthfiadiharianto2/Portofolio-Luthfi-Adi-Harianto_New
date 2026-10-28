"use client";

import dynamic from "next/dynamic";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAfterLoad } from "@/hooks/use-after-load";
import { useDeviceTier } from "@/hooks/use-device-tier";
import { useFirstInteraction } from "@/hooks/use-first-interaction";
import { useInView } from "@/hooks/use-in-view";
import { useSeenOnce } from "@/hooks/use-seen-once";
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
  const seen = useSeenOnce(container, "0px");
  const phone = quality?.breakpoint === "phone";
  const interacted = useFirstInteraction(phone);
  const [ready, setReady] = useState(false);
  const afterLoad = useAfterLoad();
  const [unsupported, setUnsupported] = useState(false);
  const use3d = quality !== null && quality.tier !== "none" && !unsupported;

  // Preloader hanya menunggu kanvas yang dipasang saat halaman dimuat. Di HP kartu 3D
  // menunggu interaksi pertama, jadi preloader langsung selesai.
  useEffect(() => {
    if (quality && (!use3d || phone)) progressStore.finish();
  }, [quality, use3d, phone]);

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
      {/* Di HP kartu ada di bawah teks hero: 3D baru dimuat setelah interaksi pertama dan
          saat kartu terlihat, agar tidak membebani pemuatan awal di perangkat lemah. */}
      {use3d && afterLoad && (!phone || (seen && interacted)) ? (
        <div className="absolute inset-0" data-testid="id-card-3d">
          <IdCardCanvas
            quality={quality}
            active={inView}
            content={content}
            onReady={onReady}
            onUnsupported={() => setUnsupported(true)}
          />
        </div>
      ) : null}
    </div>
  );
};
