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

/** Membaca informasi perangkat di browser. */
export const readDeviceInfo = (reducedMotion: boolean): DeviceInfo => {
  let webgl = false;
  let renderer = "";
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (gl) {
      webgl = true;
      const debug = gl.getExtension("WEBGL_debug_renderer_info");
      renderer = String(
        gl.getParameter(debug ? debug.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ??
          "",
      );
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    }
  } catch {
    webgl = false;
  }
  const nav = navigator as Navigator & { deviceMemory?: number };
  return {
    width: window.innerWidth,
    webgl,
    renderer,
    cores: nav.hardwareConcurrency || undefined,
    memoryGb: nav.deviceMemory,
    reducedMotion,
  };
};
