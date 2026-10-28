"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { type KeyboardEvent, useRef, useState } from "react";
import { iconButtonStyles } from "@/components/ui/button-styles";
import { cn } from "@/lib/utils";

type GalleryImage = { path: string; alt: string };

type GalleryLabels = {
  hint: string;
  open: string[];
  counter: string[];
  dialog: string;
  close: string;
  previous: string;
  next: string;
};

// Galeri: geser dengan jari (scroll-snap) di HP, lightbox layar penuh dengan <dialog>
// (fokus terkunci di dalamnya, Esc menutup) dan navigasi panah keyboard.
export const ProjectGallery = ({
  images,
  labels,
}: {
  images: GalleryImage[];
  labels: GalleryLabels;
}) => {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const [current, setCurrent] = useState(0);
  const image = images[current];

  const open = (index: number, button: HTMLButtonElement) => {
    opener.current = button;
    setCurrent(index);
    dialog.current?.showModal();
  };

  const go = (step: number) =>
    setCurrent((index) => (index + step + images.length) % images.length);

  const onKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  };

  return (
    <>
      <p className="mb-3 text-sm text-muted sm:hidden">{labels.hint}</p>
      <ul className="-mx-gutter flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-3">
        {images.map((item, index) => (
          <li
            key={item.path}
            className="w-[85%] shrink-0 snap-center sm:w-auto"
          >
            <button
              type="button"
              onClick={(event) => open(index, event.currentTarget)}
              aria-label={labels.open[index]}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-card glass"
            >
              <Image
                src={item.path}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 22rem, (min-width: 640px) 45vw, 85vw"
                className="object-cover transition-transform duration-500 ease-(--ease-standard) group-hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={labels.dialog}
        onKeyDown={onKeyDown}
        onClose={() => opener.current?.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-bg/95 p-0 text-fg backdrop:bg-overlay"
      >
        {image ? (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 pt-[max(1rem,env(safe-area-inset-top))]">
              <p aria-live="polite" className="text-sm text-muted">
                {labels.counter[current]}
              </p>
              <button
                type="button"
                onClick={() => dialog.current?.close()}
                aria-label={labels.close}
                className={cn(iconButtonStyles, "glass")}
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <div className="relative min-h-0 flex-1">
              <Image
                key={image.path}
                src={image.path}
                alt={image.alt}
                fill
                sizes="100vw"
                className="object-contain p-4"
              />
            </div>
            <div className="flex items-center justify-center gap-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={labels.previous}
                className={cn(iconButtonStyles, "glass")}
              >
                <ChevronLeft aria-hidden="true" className="size-6" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={labels.next}
                className={cn(iconButtonStyles, "glass")}
              >
                <ChevronRight aria-hidden="true" className="size-6" />
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
};
