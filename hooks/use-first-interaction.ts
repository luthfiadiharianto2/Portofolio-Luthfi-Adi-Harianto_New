"use client";

import { useEffect, useState } from "react";
import { onFirstInteraction } from "@/lib/first-interaction";

// Menjadi true setelah interaksi pertama pengguna (scroll, sentuhan, klik, atau tombol).
export const useFirstInteraction = (enabled = true) => {
  const [interacted, setInteracted] = useState(false);

  useEffect(() => {
    if (!enabled || interacted) return;
    return onFirstInteraction(() => setInteracted(true));
  }, [enabled, interacted]);

  return interacted;
};
