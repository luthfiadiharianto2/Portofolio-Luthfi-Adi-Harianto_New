"use client";

import { useEffect, useState } from "react";

// Benar setelah event load dan browser idle. Dipakai untuk menunda pekerjaan berat
// (three.js) agar tidak bersaing dengan render awal dan interaksi pertama.
export const useAfterLoad = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelIdle = () => {};
    const schedule = () => {
      if (typeof window.requestIdleCallback === "function") {
        const id = window.requestIdleCallback(() => setReady(true), {
          timeout: 1500,
        });
        cancelIdle = () => window.cancelIdleCallback(id);
      } else {
        const id = window.setTimeout(() => setReady(true), 200);
        cancelIdle = () => window.clearTimeout(id);
      }
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      cancelIdle();
    };
  }, []);

  return ready;
};
