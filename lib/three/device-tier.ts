// Penentuan kualitas 3D per perangkat. Murni, agar bisa diuji tanpa browser.

export type Breakpoint = "phone" | "tablet" | "desktop";
export type Tier = "none" | "low" | "mid" | "high";

export type DeviceInfo = {
  width: number;
  webgl: boolean;
  renderer: string;
  cores?: number;
  memoryGb?: number;
  reducedMotion: boolean;
};

export type QualityProfile = {
  breakpoint: Breakpoint;
  tier: Tier;
  stars: number;
  dpr: [number, number];
  bloom: boolean;
};

export const breakpointOf = (width: number): Breakpoint =>
  width < 640 ? "phone" : width < 1024 ? "tablet" : "desktop";

// Renderer perangkat lunak (tanpa GPU) atau GPU lawas: lebih baik tampilan statis.
const SOFTWARE_RENDERER =
  /swiftshader|llvmpipe|software|softpipe|microsoft basic render/i;
const WEAK_GPU =
  /mali-(4|t6)|adreno \(tm\) [2-4]\d\d|powervr sgx|intel\(r\) hd graphics( [2-4]\d{3})?$/i;

export const tierOf = ({
  webgl,
  renderer,
  cores,
  memoryGb,
  reducedMotion,
}: DeviceInfo): Tier => {
  if (!webgl || reducedMotion || SOFTWARE_RENDERER.test(renderer))
    return "none";
  const lowHardware =
    (cores !== undefined && cores <= 2) ||
    (memoryGb !== undefined && memoryGb <= 2);
  if (lowHardware) return "none";
  if (
    WEAK_GPU.test(renderer) ||
    (cores !== undefined && cores <= 4) ||
    (memoryGb !== undefined && memoryGb <= 4)
  ) {
    return "low";
  }
  return cores !== undefined && cores >= 8 ? "high" : "mid";
};

// Jumlah bintang dan dpr mengikuti spesifikasi: HP ~600, tablet ~1.200, desktop ~2.000.
const BASE: Record<Breakpoint, Omit<QualityProfile, "breakpoint" | "tier">> = {
  phone: { stars: 600, dpr: [1, 1.5], bloom: false },
  tablet: { stars: 1200, dpr: [1, 2], bloom: false },
  desktop: { stars: 2000, dpr: [1, 2], bloom: true },
};

export const qualityOf = (info: DeviceInfo): QualityProfile => {
  const breakpoint = breakpointOf(info.width);
  const tier = tierOf(info);
  const base = BASE[breakpoint];
  if (tier === "low") {
    return {
      breakpoint,
      tier,
      stars: Math.round(base.stars / 2),
      dpr: [1, 1.25],
      bloom: false,
    };
  }
  return { breakpoint, tier, ...base, bloom: base.bloom && tier === "high" };
};

/** Benar bila renderer WebGL berjalan di CPU (tanpa GPU), mis. SwiftShader atau llvmpipe. */
export const isSoftwareRenderer = (renderer: string) =>
  SOFTWARE_RENDERER.test(renderer);

/** Membaca nama renderer dari konteks WebGL yang sudah ada (mis. milik three.js). */
export const rendererOf = (
  gl: WebGLRenderingContext | WebGL2RenderingContext,
) => {
  const debug = gl.getExtension("WEBGL_debug_renderer_info");
  return String(
    gl.getParameter(debug ? debug.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "",
  );
};

/**
 * Membaca informasi perangkat di browser. Sengaja tidak membuat konteks WebGL: pada
 * GPU sungguhan, konteks pertama menyalakan proses GPU secara sinkron (bisa >1 detik di
 * HP). Nama renderer diperiksa belakangan oleh kanvas 3D lewat konteksnya sendiri.
 */
export const readDeviceInfo = (reducedMotion: boolean): DeviceInfo => {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return {
    width: window.innerWidth,
    webgl:
      typeof window.WebGL2RenderingContext !== "undefined" ||
      typeof window.WebGLRenderingContext !== "undefined",
    renderer: "",
    cores: nav.hardwareConcurrency || undefined,
    memoryGb: nav.deviceMemory,
    reducedMotion,
  };
};

/** ?3d=force melewati pemeriksaan renderer dan perangkat keras (untuk pengujian). */
export const isForced3d = () =>
  new URLSearchParams(window.location.search).get("3d") === "force";
