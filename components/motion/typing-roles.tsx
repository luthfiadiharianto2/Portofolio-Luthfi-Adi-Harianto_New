"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-media-query";

const TYPE_MS = 70;
const DELETE_MS = 35;
const HOLD_MS = 1600;

// Teks yang mengetik bergantian antar peran, dengan kursor berkedip.
// Pembaca layar mendapat daftar lengkap; mode gerak dikurangi menampilkan teks statis.
// Huruf ditulis langsung ke DOM (tanpa state React per huruf), dan barisnya diberi
// contain: strict dengan tinggi tetap, sehingga setiap huruf hanya me-layout baris ini.
export const TypingRoles = ({
  roles,
  label,
}: {
  roles: string[];
  label: string;
}) => {
  const reducedMotion = useReducedMotion();
  const text = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = text.current;
    if (!element || reducedMotion || roles.length < 2) return;
    let index = 0;
    let length = roles[0]?.length ?? 0;
    let deleting = false;
    let timer = 0;

    const step = () => {
      const current = roles[index] ?? "";
      const done = !deleting && length === current.length;
      const empty = deleting && length === 0;
      if (done) deleting = true;
      else if (empty) {
        deleting = false;
        index = (index + 1) % roles.length;
      } else length += deleting ? -1 : 1;
      element.textContent = (roles[index] ?? "").slice(0, length);
      const next = !deleting && length === (roles[index] ?? "").length;
      timer = window.setTimeout(
        step,
        next ? HOLD_MS : deleting ? DELETE_MS : TYPE_MS,
      );
    };

    timer = window.setTimeout(step, HOLD_MS);
    return () => {
      window.clearTimeout(timer);
      element.textContent = roles[0] ?? "";
    };
  }, [reducedMotion, roles]);

  return (
    <p className="mt-5 h-[1.6em] font-heading text-xl font-semibold text-fg [contain:strict] sm:text-2xl">
      <span className="sr-only">
        {label}: {roles.join(", ")}
      </span>
      {reducedMotion ? (
        <span aria-hidden="true">{roles.join(" · ")}</span>
      ) : (
        <span aria-hidden="true">
          <span ref={text} className="text-gradient-primary">
            {roles[0]}
          </span>
          <span className="ml-0.5 inline-block w-[2px] animate-[caret_1s_steps(1)_infinite] bg-accent-3 align-[-0.15em] text-transparent">
            |
          </span>
        </span>
      )}
    </p>
  );
};
