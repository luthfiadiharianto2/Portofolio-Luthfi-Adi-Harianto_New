// Warna dan font untuk kanvas/WebGL dibaca dari token CSS, bukan ditulis ulang di sini.

export type DesignTokens = {
  bg: string;
  surface: string;
  fg: string;
  muted: string;
  accent: string;
  accent2: string;
  accent3: string;
  accentDeep: string;
  accent2Deep: string;
  accent3Deep: string;
  headingFont: string;
  bodyFont: string;
};

export const readTokens = (): DesignTokens => {
  const style = getComputedStyle(document.documentElement);
  const value = (name: string) => style.getPropertyValue(name).trim();
  return {
    bg: value("--color-bg"),
    surface: value("--color-surface"),
    fg: value("--color-fg"),
    muted: value("--color-muted"),
    accent: value("--color-accent"),
    accent2: value("--color-accent-2"),
    accent3: value("--color-accent-3"),
    accentDeep: value("--color-accent-deep"),
    accent2Deep: value("--color-accent-2-deep"),
    accent3Deep: value("--color-accent-3-deep"),
    headingFont: value("--font-space-grotesk") || "sans-serif",
    bodyFont: value("--font-inter") || "sans-serif",
  };
};
