"use client";

import { type RefObject, useEffect, useState } from "react";

// Benar selama elemen terlihat di layar dan tab sedang aktif.
export const useInView = (
  ref: RefObject<Element | null>,
  rootMargin = "100px",
) => {
  const [intersecting, setIntersecting] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(Boolean(entry?.isIntersecting)),
      {
        rootMargin,
      },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return intersecting && pageVisible;
};
