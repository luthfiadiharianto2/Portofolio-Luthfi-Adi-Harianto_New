import QRCode from "qrcode";
import { CanvasTexture, ImageLoader, SRGBColorSpace } from "three";
import type { DesignTokens } from "@/lib/three/tokens";

// Tekstur kartu ID dibuat dengan Canvas 2D. Sisi panjang 1024 px (batas tekstur),
// rasio mengikuti badan kartu 1,6 × 2,25.
export const TEXTURE_WIDTH = 728;
export const TEXTURE_HEIGHT = 1024;

export type CardBaseContent = Omit<CardContent, "siteUrl" | "siteLabel">;

export type CardContent = {
  name: string;
  role: string;
  university: string;
  photoUrl: string;
  siteUrl: string;
  siteLabel: string;
  issued: string;
};

const roundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
};

const gradient = (
  ctx: CanvasRenderingContext2D,
  tokens: DesignTokens,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
) => {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  g.addColorStop(0, tokens.accent);
  g.addColorStop(0.5, tokens.accent2);
  g.addColorStop(1, tokens.accent3);
  return g;
};

const spacedText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
) => {
  ctx.letterSpacing = `${spacing}px`;
  ctx.fillText(text, x, y);
  ctx.letterSpacing = "0px";
};

// Foto dimuat lewat loader three.js agar ikut tercatat di useProgress (preloader).
const loadImage = (url: string) =>
  new Promise<HTMLImageElement>((resolve, reject) =>
    new ImageLoader().load(url, resolve, undefined, reject),
  );

const drawFront = async (tokens: DesignTokens, content: CardContent) => {
  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_WIDTH;
  canvas.height = TEXTURE_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D tidak tersedia");
  const W = TEXTURE_WIDTH;

  const background = ctx.createLinearGradient(0, 0, 0, TEXTURE_HEIGHT);
  background.addColorStop(0, tokens.surface);
  background.addColorStop(1, tokens.bg);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, W, TEXTURE_HEIGHT);

  // Pita gradien atas dan lubang tali.
  ctx.fillStyle = gradient(ctx, tokens, 0, 0, W, 0);
  ctx.fillRect(0, 0, W, 16);
  ctx.fillStyle = tokens.bg;
  roundedRect(ctx, W / 2 - 60, 44, 120, 22, 11);
  ctx.fill();

  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = tokens.fg;
  ctx.font = `700 40px ${tokens.headingFont}`;
  ctx.textAlign = "left";
  ctx.fillText("LAH", 52, 128);
  const mark = ctx.measureText("LAH").width;
  ctx.fillStyle = tokens.accent3;
  ctx.fillText(".", 52 + mark, 128);
  ctx.fillStyle = tokens.muted;
  ctx.font = `500 20px ${tokens.bodyFont}`;
  ctx.textAlign = "right";
  spacedText(ctx, content.issued, W - 52, 124, 4);

  // Foto dengan bingkai gradien.
  const photo = await loadImage(content.photoUrl);
  const size = 380;
  const px = (W - size) / 2;
  const py = 178;
  ctx.fillStyle = gradient(ctx, tokens, px, py, px + size, py + size);
  roundedRect(ctx, px - 8, py - 8, size + 16, size + 16, 34);
  ctx.fill();
  ctx.save();
  roundedRect(ctx, px, py, size, size, 28);
  ctx.clip();
  const scale = Math.max(size / photo.width, size / photo.height);
  const dw = photo.width * scale;
  const dh = photo.height * scale;
  ctx.drawImage(photo, px + (size - dw) / 2, py + (size - dh) / 2, dw, dh);
  ctx.restore();

  ctx.textAlign = "center";
  ctx.fillStyle = tokens.fg;
  ctx.font = `700 50px ${tokens.headingFont}`;
  ctx.fillText(content.name, W / 2, 648);
  ctx.fillStyle = tokens.accent3;
  ctx.font = `600 24px ${tokens.bodyFont}`;
  spacedText(ctx, content.role, W / 2, 696, 5);
  ctx.fillStyle = tokens.muted;
  ctx.font = `400 24px ${tokens.bodyFont}`;
  ctx.fillText(content.university, W / 2, 740);

  // Garis pemisah dan kode QR ke URL situs.
  ctx.fillStyle = gradient(ctx, tokens, 52, 0, W - 52, 0);
  ctx.globalAlpha = 0.5;
  ctx.fillRect(52, 790, W - 104, 2);
  ctx.globalAlpha = 1;

  const qr = document.createElement("canvas");
  await QRCode.toCanvas(qr, content.siteUrl, {
    width: 152,
    margin: 1,
    errorCorrectionLevel: "M",
    color: { dark: tokens.bg, light: tokens.fg },
  });
  ctx.fillStyle = tokens.fg;
  roundedRect(ctx, W - 52 - 168, 820, 168, 168, 18);
  ctx.fill();
  ctx.drawImage(qr, W - 52 - 160, 828, 152, 152);

  ctx.textAlign = "left";
  ctx.fillStyle = tokens.muted;
  ctx.font = `500 20px ${tokens.bodyFont}`;
  spacedText(ctx, "PORTFOLIO", 52, 880, 4);
  ctx.fillStyle = tokens.fg;
  ctx.font = `600 26px ${tokens.bodyFont}`;
  ctx.fillText(content.siteLabel, 52, 918);

  return canvas;
};

const drawBack = (tokens: DesignTokens, content: CardContent) => {
  const canvas = document.createElement("canvas");
  canvas.width = TEXTURE_WIDTH;
  canvas.height = TEXTURE_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D tidak tersedia");
  const W = TEXTURE_WIDTH;
  const H = TEXTURE_HEIGHT;

  const background = ctx.createLinearGradient(0, 0, W, H);
  background.addColorStop(0, tokens.accentDeep);
  background.addColorStop(0.55, tokens.accent2Deep);
  background.addColorStop(1, tokens.accent3Deep);
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, W, H);

  // Lingkaran tipis sebagai ornamen orbit.
  ctx.strokeStyle = tokens.fg;
  ctx.globalAlpha = 0.12;
  ctx.lineWidth = 2;
  for (const radius of [180, 260, 340]) {
    ctx.beginPath();
    ctx.arc(W / 2, H / 2 - 40, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = tokens.bg;
  roundedRect(ctx, W / 2 - 60, 44, 120, 22, 11);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = tokens.fg;
  ctx.font = `700 190px ${tokens.headingFont}`;
  const width = ctx.measureText("LAH.").width;
  ctx.textAlign = "left";
  ctx.fillText("LAH", W / 2 - width / 2, H / 2 - 40);
  ctx.fillStyle = tokens.accent3;
  ctx.fillText(
    ".",
    W / 2 - width / 2 + ctx.measureText("LAH").width,
    H / 2 - 40,
  );

  ctx.textAlign = "center";
  ctx.fillStyle = tokens.fg;
  ctx.font = `600 28px ${tokens.bodyFont}`;
  spacedText(ctx, content.name.toUpperCase(), W / 2, H - 150, 6);
  ctx.globalAlpha = 0.8;
  ctx.font = `400 22px ${tokens.bodyFont}`;
  ctx.fillText(content.siteLabel, W / 2, H - 108);
  ctx.globalAlpha = 1;
  return canvas;
};

const toTexture = (canvas: HTMLCanvasElement) => {
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
};

export const createCardTextures = async (
  tokens: DesignTokens,
  content: CardContent,
) => {
  await document.fonts.ready;
  const [front, back] = await Promise.all([
    drawFront(tokens, content),
    drawBack(tokens, content),
  ]);
  return { front: toTexture(front), back: toTexture(back) };
};
