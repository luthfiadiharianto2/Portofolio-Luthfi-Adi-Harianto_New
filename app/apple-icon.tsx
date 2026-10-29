import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Ikon layar utama iOS, bentuknya sama dengan app/icon.svg (huruf L dan titik cyan).
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#0a0a0f",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 48,
          top: 37,
          width: 25,
          height: 104,
          backgroundImage: "linear-gradient(180deg, #6c5ce7, #a855f7)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 48,
          top: 116,
          width: 76,
          height: 25,
          backgroundImage: "linear-gradient(90deg, #a855f7, #06b6d4)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 131,
          top: 115,
          width: 26,
          height: 26,
          borderRadius: 13,
          backgroundColor: "#06b6d4",
        }}
      />
    </div>,
    size,
  );
}
