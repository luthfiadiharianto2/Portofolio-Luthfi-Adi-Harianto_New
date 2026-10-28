// "Muncul saat scroll" tanpa pustaka: satu IntersectionObserver dan transisi CSS
// (fade + geser naik 24 px, 0,6 detik, jeda 0,08 detik antar elemen). Jauh lebih ringan
// daripada satu ScrollTrigger per elemen. Hanya opacity/transform yang berubah, jadi
// konten tetap bisa difokus dan dibaca pembaca layar sebelum muncul.

const STAGGER_MS = 80;

// Elemen di dalam section yang belum dirender (content-visibility: auto) diukur lewat
// section-nya dulu: mengukur elemen di dalamnya memaksa browser me-layout seluruh section.
export const belowFold = (element: Element) => {
  const section = element.closest("[data-defer-render]");
  if (section && section.getBoundingClientRect().top > window.innerHeight)
    return true;
  return element.getBoundingClientRect().top > window.innerHeight;
};

export const startReveal = () => {
  const groups = Array.from(
    document.querySelectorAll<HTMLElement>("[data-reveal]"),
  );
  // Baca semua posisi dulu, baru tulis atribut, agar tidak memicu layout berulang.
  const plan = groups
    .map((group) => {
      const items =
        group.children.length > 0 ? Array.from(group.children) : [group];
      return { group, items: items.filter(belowFold) as HTMLElement[] };
    })
    .filter(({ items }) => items.length > 0);

  for (const { items } of plan) {
    items.forEach((item, index) => {
      item.style.setProperty("--reveal-delay", `${index * STAGGER_MS}ms`);
      item.dataset.revealState = "pending";
    });
  }

  const itemsByGroup = new Map(plan.map(({ group, items }) => [group, items]));
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        itemsByGroup.get(entry.target as HTMLElement)?.forEach((item) => {
          item.dataset.revealState = "shown";
        });
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -15% 0px" },
  );
  plan.forEach(({ group }) => observer.observe(group));

  return () => {
    observer.disconnect();
    for (const { items } of plan) {
      items.forEach((item) => {
        delete item.dataset.revealState;
        item.style.removeProperty("--reveal-delay");
      });
    }
  };
};
