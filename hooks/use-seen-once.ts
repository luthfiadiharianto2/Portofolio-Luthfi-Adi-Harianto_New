"use client";

import { type RefObject, useEffect, useState } from "react";

// Menjadi true sekali saat elemen pertama kali mendekati layar, lalu tetap true.
export const useSeenOnce = (
  ref: RefObject<Element | null>,
  rootMargin = "200px",
) => {
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element || seen) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setSeen(true);
        observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin, seen]);

  return seen;
};
