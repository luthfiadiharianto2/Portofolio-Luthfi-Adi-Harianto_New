"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/use-media-query";

const TYPE_MS = 70;
const DELETE_MS = 35;
const HOLD_MS = 1600;

// Teks yang mengetik bergantian antar peran, dengan kursor berkedip.
// Pembaca layar mendapat daftar lengkap; mode gerak dikurangi menampilkan teks statis.
export const TypingRoles = ({
  roles,
  label,
}: {
  roles: string[];
  label: string;
}) => {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(roles[0]?.length ?? 0);
  const [deleting, setDeleting] = useState(false);
  const current = roles[index] ?? "";

  useEffect(() => {
    if (reducedMotion || roles.length < 2) return;
    const done = !deleting && length === current.length;
    const empty = deleting && length === 0;
    const delay = done ? HOLD_MS : deleting ? DELETE_MS : TYPE_MS;
    const timer = window.setTimeout(() => {
      if (done) setDeleting(true);
      else if (empty) {
        setDeleting(false);
        setIndex((value) => (value + 1) % roles.length);
      } else setLength((value) => value + (deleting ? -1 : 1));
    }, delay);
    return () => window.clearTimeout(timer);
  }, [reducedMotion, roles.length, current.length, length, deleting]);

  return (
    <p className="mt-5 min-h-[1.6em] font-heading text-xl font-semibold text-fg sm:text-2xl">
      <span className="sr-only">
        {label}: {roles.join(", ")}
      </span>
      {reducedMotion ? (
        <span aria-hidden="true">{roles.join(" · ")}</span>
      ) : (
        <span aria-hidden="true">
          <span className="text-gradient-primary">
            {current.slice(0, length)}
          </span>
          <span className="ml-0.5 inline-block w-[2px] animate-[caret_1s_steps(1)_infinite] bg-accent-3 align-[-0.15em] text-transparent">
            |
          </span>
        </span>
      )}
    </p>
  );
};
