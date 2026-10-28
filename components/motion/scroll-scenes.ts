// Adegan scroll dan efek pointer. Dimuat malas setelah halaman idle, dan tidak dimuat
// sama sekali bila pengguna memilih gerak dikurangi. Semua adegan dibungkus
// gsap.context dan dibersihkan lewat fungsi yang dikembalikan.

import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, CustomEase);
// Easing standar situs: cubic-bezier(0.4, 0, 0.2, 1).
CustomEase.create("standard", "0.4,0,0.2,1");

const START = "top 85%";

// Elemen yang sudah terlihat saat modul dimuat tidak disembunyikan ulang,
// agar tidak ada konten yang berkedip.
const belowFold = (element: Element) =>
  element.getBoundingClientRect().top > window.innerHeight;

const finePointer = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;
const desktop = () => window.matchMedia("(min-width: 1024px)").matches;

const revealScenes = () => {
  // Fade dan geser naik 24 px, 0,6 detik, jeda antar elemen 0,08 detik.
  // Hanya opacity (bukan visibility) agar konten tetap bisa difokus dan dibaca pembaca layar.
  gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((group) => {
    const items =
      group.children.length > 0 ? Array.from(group.children) : [group];
    const pending = items.filter(belowFold);
    if (pending.length === 0) return;
    gsap.from(pending, {
      y: 24,
      opacity: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: "standard",
      scrollTrigger: { trigger: group, start: START, once: true },
    });
  });

  // Judul section muncul per kata dari balik topeng.
  gsap.utils.toArray<HTMLElement>("[data-split]").forEach((title) => {
    if (!belowFold(title)) return;
    gsap.from(title.querySelectorAll(".split-word"), {
      yPercent: 110,
      duration: 0.7,
      stagger: 0.06,
      ease: "standard",
      scrollTrigger: { trigger: title, start: START, once: true },
    });
  });

  // Glitch sekali saat masuk layar (0,6 detik), lalu diam.
  gsap.utils.toArray<HTMLElement>("[data-glitch]").forEach((heading) => {
    ScrollTrigger.create({
      trigger: heading,
      start: START,
      once: true,
      onEnter: () => {
        heading.classList.add("is-glitching");
        gsap.delayedCall(0.6, () => heading.classList.remove("is-glitching"));
      },
    });
  });

  // Hitung naik dari 0 ke nilai akhir (nilai akhir sudah ada di HTML).
  gsap.utils.toArray<HTMLElement>("[data-count]").forEach((element) => {
    const target = Number(element.dataset.count);
    if (!Number.isFinite(target) || !belowFold(element)) return;
    const counter = { value: 0 };
    element.textContent = "0";
    gsap.to(counter, {
      value: target,
      duration: 0.8,
      ease: "standard",
      scrollTrigger: { trigger: element, start: START, once: true },
      onUpdate: () => {
        element.textContent = String(Math.round(counter.value));
      },
    });
  });
};

const pointerEffects = () => {
  if (!finePointer()) return () => {};

  // Kartu proyek miring 3D mengikuti pointer.
  const onTiltMove = (event: PointerEvent) => {
    const card = (event.target as Element | null)?.closest<HTMLElement>(
      "[data-tilt]",
    );
    document
      .querySelectorAll<HTMLElement>("[data-tilt][data-tilting]")
      .forEach((other) => {
        if (other === card) return;
        other.removeAttribute("data-tilting");
        other.style.setProperty("--tilt-x", "0deg");
        other.style.setProperty("--tilt-y", "0deg");
      });
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.setAttribute("data-tilting", "");
    card.style.setProperty("--tilt-x", `${(-y * 8).toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${(x * 10).toFixed(2)}deg`);
  };

  // Tombol magnetik (desktop): ditarik pointer maksimal 8 px.
  const magnets = desktop()
    ? gsap.utils.toArray<HTMLElement>("[data-magnetic]")
    : [];
  const magnetCleanups = magnets.map((button) => {
    const toX = gsap.quickTo(button, "x", { duration: 0.3, ease: "standard" });
    const toY = gsap.quickTo(button, "y", { duration: 0.3, ease: "standard" });
    const move = (event: PointerEvent) => {
      const rect = button.getBoundingClientRect();
      const dx =
        (event.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const dy =
        (event.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      toX(gsap.utils.clamp(-8, 8, dx * 8));
      toY(gsap.utils.clamp(-8, 8, dy * 8));
    };
    const leave = () => {
      toX(0);
      toY(0);
    };
    button.addEventListener("pointermove", move);
    button.addEventListener("pointerleave", leave);
    return () => {
      button.removeEventListener("pointermove", move);
      button.removeEventListener("pointerleave", leave);
    };
  });

  // Kursor pengikut (desktop, pointer halus).
  const follower = desktop() ? document.createElement("div") : null;
  let followX: ((value: number) => void) | undefined;
  let followY: ((value: number) => void) | undefined;
  if (follower) {
    follower.className = "cursor-follower";
    follower.setAttribute("aria-hidden", "true");
    document.body.append(follower);
    followX = gsap.quickTo(follower, "x", { duration: 0.35, ease: "standard" });
    followY = gsap.quickTo(follower, "y", { duration: 0.35, ease: "standard" });
  }
  const onFollow = (event: PointerEvent) => {
    if (!follower || event.pointerType !== "mouse") return;
    follower.classList.add("is-visible");
    followX?.(event.clientX);
    followY?.(event.clientY);
  };
  const hideFollower = () => follower?.classList.remove("is-visible");

  window.addEventListener("pointermove", onTiltMove, { passive: true });
  window.addEventListener("pointermove", onFollow, { passive: true });
  document.documentElement.addEventListener("pointerleave", hideFollower);

  return () => {
    window.removeEventListener("pointermove", onTiltMove);
    window.removeEventListener("pointermove", onFollow);
    document.documentElement.removeEventListener("pointerleave", hideFollower);
    magnetCleanups.forEach((cleanup) => cleanup());
    follower?.remove();
  };
};

let lenis: Lenis | null = null;

// Smooth scroll Lenis, disinkronkan dengan ScrollTrigger. Hanya dibuat sekali.
const ensureLenis = () => {
  if (lenis) return;
  lenis = new Lenis({ anchors: { offset: -96 }, allowNestedScroll: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
};

/** Memasang adegan untuk halaman saat ini; mengembalikan fungsi pembersih. */
export const startScenes = () => {
  ensureLenis();
  let cleanupPointer = () => {};
  const context = gsap.context(() => {
    revealScenes();
    cleanupPointer = pointerEffects();
  });
  ScrollTrigger.refresh();
  return () => {
    cleanupPointer();
    context.revert();
  };
};
