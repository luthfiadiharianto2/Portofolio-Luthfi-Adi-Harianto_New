"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// false di server dan selama hidrasi, true setelah komponen terhidrasi. Dipakai untuk
// menonaktifkan tombol kirim sampai handler form siap, agar form yang dikirim terlalu
// cepat tidak jatuh ke pengiriman bawaan browser.
export const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
