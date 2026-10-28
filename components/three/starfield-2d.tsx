"use client";

import { useEffect, useRef } from "react";
import { readTokens } from "@/lib/three/tokens";

// Latar bintang ringan untuk HP: digambar SEKALI di Canvas 2D (tanpa three.js), lalu
// parallax scroll dikerjakan compositor lewat transform CSS. Tidak ada loop per frame,
// sehingga thread utama tetap bebas. Bintang jatuh memakai animasi CSS murni.
export default function Starfield2D({
  count,
  interactive,
}: {
  count: number;
  interactive: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const tokens = readTokens();
    const palette = [
      tokens.fg,
      tokens.fg,
      tokens.fg,
      tokens.accent2,
      tokens.accent3,
    ];
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    let height = 0;
    let renderedWidth = 0;
    let frame = 0;

    // Kanvas setinggi dua layar dengan pola bintang yang berulang, agar geseran
    // parallax bisa berputar tanpa celah.
    const render = () => {
      const width = window.innerWidth;
      // Bilah URL HP memicu resize saat scroll: gambar ulang hanya bila lebar berubah.
      if (width === renderedWidth) return;
      renderedWidth = width;
      height = window.innerHeight;
      element.style.height = `${height * 2}px`;
      element.width = Math.round(width * ratio);
      element.height = Math.round(height * 2 * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      for (let index = 0; index < count; index += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const depth = 0.3 + Math.random() * 0.7;
        const size = 0.5 + Math.random() * 1.1;
        context.globalAlpha = 0.35 + depth * 0.6;
        context.fillStyle = palette[
          Math.floor(Math.random() * palette.length)
        ] as string;
        context.fillRect(x, y, size, size);
        context.fillRect(x, y + height, size, size);
      }
      context.globalAlpha = 1;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        element.style.transform = `translate3d(0, ${-((window.scrollY * 0.08) % height)}px, 0)`;
      });
    };

    render();
    window.addEventListener("resize", render);
    if (interactive)
      window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", render);
      window.removeEventListener("scroll", onScroll);
    };
  }, [count, interactive]);

  return (
    <>
      <canvas
        ref={canvas}
        aria-hidden="true"
        className="absolute inset-x-0 top-0 w-full will-change-transform"
      />
      {interactive ? (
        <span aria-hidden="true" className="shooting-star" />
      ) : null}
    </>
  );
}
