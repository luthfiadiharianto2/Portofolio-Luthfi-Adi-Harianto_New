// Interaksi pertama pengguna (scroll, roda, pointer, sentuhan, atau tombol). Dipakai untuk
// menunda pekerjaan yang hanya berguna setelah pengguna mulai berinteraksi, sehingga
// pemuatan awal tidak ikut menanggungnya. Setelah terjadi sekali, callback berikutnya
// langsung dijalankan.

const EVENTS = [
  "scroll",
  "wheel",
  "pointermove",
  "pointerdown",
  "touchstart",
  "keydown",
] as const;

let interacted = false;

export const onFirstInteraction = (callback: () => void) => {
  if (interacted) {
    callback();
    return () => {};
  }
  const done = () => {
    interacted = true;
    stop();
    callback();
  };
  const stop = () =>
    EVENTS.forEach((event) => window.removeEventListener(event, done));
  EVENTS.forEach((event) =>
    window.addEventListener(event, done, { once: true, passive: true }),
  );
  return stop;
};
