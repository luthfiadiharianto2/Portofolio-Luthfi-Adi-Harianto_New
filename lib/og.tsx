import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Gambar Open Graph (1200×630) yang dibuat saat build/revalidasi. Warna mengikuti token
// di globals.css; latar bintang digambar dengan titik-titik tetap (tanpa acak, agar hasil
// build stabil).

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const COLORS = {
  bg: "#0a0a0f",
  surface: "#12121a",
  fg: "#f0f0f5",
  muted: "#8888a0",
  accent: "#6c5ce7",
  accent2: "#a855f7",
  accent3: "#06b6d4",
};

const STARS = [
  [6, 12, 3],
  [14, 70, 2],
  [23, 34, 2],
  [31, 88, 3],
  [44, 8, 2],
  [52, 62, 2],
  [61, 22, 3],
  [72, 82, 2],
  [79, 40, 2],
  [88, 14, 3],
  [93, 66, 2],
  [97, 92, 2],
] as const;

/**
 * Gambar lokal dari public/ (atau URL https) sebagai data URI PNG/JPEG. Format lain
 * (WebP, AVIF) tidak didukung pembuat gambar OG, jadi dilewati.
 */
export const imageDataUri = async (src: string) => {
  const type = /\.png$/i.test(src)
    ? "image/png"
    : /\.jpe?g$/i.test(src)
      ? "image/jpeg"
      : null;
  if (!type) return null;
  try {
    const bytes = src.startsWith("/")
      ? await readFile(join(process.cwd(), "public", src))
      : Buffer.from(await (await fetch(src)).arrayBuffer());
    return `data:${type};base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
};

type OgCardProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  footer: string;
  image?: string | null;
};

export const ogImage = ({
  eyebrow,
  title,
  subtitle,
  footer,
  image,
}: OgCardProps) =>
  new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: COLORS.bg,
        backgroundImage: `radial-gradient(ellipse at 80% 0%, rgba(108,92,231,0.45), transparent 60%), radial-gradient(ellipse at 0% 100%, rgba(6,182,212,0.18), transparent 55%)`,
        color: COLORS.fg,
        fontFamily: "sans-serif",
      }}
    >
      {STARS.map(([x, y, size]) => (
        <div
          key={`${x}-${y}`}
          style={{
            position: "absolute",
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size,
            borderRadius: size,
            backgroundColor: COLORS.fg,
            opacity: 0.7,
          }}
        />
      ))}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          width: image ? 700 : "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: COLORS.accent3,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: title.length > 24 ? 64 : 80,
              fontWeight: 700,
              lineHeight: 1.05,
              backgroundImage: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accent2}, ${COLORS.accent3})`,
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 32,
              lineHeight: 1.35,
              color: COLORS.muted,
            }}
          >
            {subtitle}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>
            LAH<span style={{ color: COLORS.accent3 }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 24, color: COLORS.muted }}>
            {footer}
          </div>
        </div>
      </div>
      {image ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 500,
            padding: "60px 60px 60px 0",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse butuh <img> biasa */}
          <img
            src={image}
            alt=""
            width={440}
            height={510}
            style={{
              width: 440,
              height: 510,
              objectFit: "cover",
              borderRadius: 24,
              border: `2px solid rgba(255,255,255,0.12)`,
            }}
          />
        </div>
      ) : null}
    </div>,
    OG_SIZE,
  );
