"use client";

import { type ComponentProps, lazy, Suspense } from "react";
import { onFirstInteraction } from "@/lib/first-interaction";
import type { ContactForm as ContactFormComponent } from "./contact-form";
import type { Guestbook as GuestbookComponent } from "./guestbook";

// Form kontak dan buku tamu (react-hook-form, zod, Turnstile) ada di bagian paling bawah.
// Kodenya baru diunduh pada interaksi pertama atau saat section kontak mendekati layar,
// mana yang lebih dulu. Di server import langsung
// selesai sehingga HTML form tetap dirender lengkap; di browser React membiarkan HTML
// itu apa adanya dan baru menghidrasinya setelah kodenya tiba.
const NEAR_MARGIN = "600px";

// Dimuat juga pada interaksi pertama: navigasi (misalnya ke #contact) memperbarui pulau
// ini, dan React menahan navigasi itu sampai pulau terhidrasi. Menunggu section terlihat
// saja akan membuat navigasi ke #contact menunggu dirinya sendiri.
let near: Promise<void> | undefined;
const whenContactNear = () => {
  near ??= new Promise<void>((resolve) => {
    const section = document.getElementById("contact");
    if (!section) {
      resolve();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) done();
      },
      { rootMargin: `${NEAR_MARGIN} 0px` },
    );
    const stopInteraction = onFirstInteraction(() => done());
    function done() {
      observer.disconnect();
      stopInteraction();
      resolve();
    }
    observer.observe(section);
  });
  return near;
};

const afterNear = async <T,>(load: () => Promise<T>) => {
  if (typeof window !== "undefined") await whenContactNear();
  return load();
};

const ContactFormLazy = lazy(() =>
  afterNear(() =>
    import("./contact-form").then(({ ContactForm }) => ({
      default: ContactForm,
    })),
  ),
);
const GuestbookLazy = lazy(() =>
  afterNear(() =>
    import("./guestbook").then(({ Guestbook }) => ({ default: Guestbook })),
  ),
);

export const LazyContactForm = (
  props: ComponentProps<typeof ContactFormComponent>,
) => (
  <Suspense>
    <ContactFormLazy {...props} />
  </Suspense>
);

export const LazyGuestbook = (
  props: ComponentProps<typeof GuestbookComponent>,
) => (
  <Suspense>
    <GuestbookLazy {...props} />
  </Suspense>
);
