import { describe, expect, it } from "vitest";
import { breakpointOf, qualityOf, tierOf } from "@/lib/three/device-tier";

const device = {
  width: 1440,
  webgl: true,
  renderer: "ANGLE (NVIDIA GeForce RTX 3060)",
  cores: 12,
  memoryGb: 8,
  reducedMotion: false,
};

describe("tingkat perangkat", () => {
  it("memakai batas lebar HP, tablet, dan desktop dari spesifikasi", () => {
    expect([360, 639, 640, 1023, 1024].map(breakpointOf)).toEqual([
      "phone",
      "phone",
      "tablet",
      "tablet",
      "desktop",
    ]);
  });

  it("memakai tampilan statis tanpa WebGL, dengan gerak dikurangi, atau renderer perangkat lunak", () => {
    expect(tierOf({ ...device, webgl: false })).toBe("none");
    expect(tierOf({ ...device, reducedMotion: true })).toBe("none");
    expect(tierOf({ ...device, renderer: "Google SwiftShader" })).toBe("none");
    expect(tierOf({ ...device, cores: 2 })).toBe("none");
  });

  it("menurunkan kualitas untuk perangkat kelas bawah", () => {
    expect(tierOf({ ...device, cores: 4, memoryGb: 4 })).toBe("low");
    expect(tierOf({ ...device, renderer: "Mali-T628" })).toBe("low");
  });
});

describe("profil kualitas", () => {
  it("jumlah bintang dan dpr sesuai kelompok layar", () => {
    expect(qualityOf({ ...device, width: 390 })).toMatchObject({
      stars: 600,
      dpr: [1, 1.5],
      bloom: false,
    });
    expect(qualityOf({ ...device, width: 820 })).toMatchObject({
      stars: 1200,
      dpr: [1, 2],
      bloom: false,
    });
    expect(qualityOf(device)).toMatchObject({
      stars: 2000,
      dpr: [1, 2],
      bloom: true,
    });
  });

  it("bloom hanya di desktop berkinerja tinggi", () => {
    expect(qualityOf({ ...device, cores: 6 }).bloom).toBe(false);
    expect(qualityOf({ ...device, width: 820 }).bloom).toBe(false);
  });

  it("perangkat kelas bawah mendapat separuh bintang", () => {
    expect(
      qualityOf({ ...device, width: 390, cores: 4, memoryGb: 3 }).stars,
    ).toBe(300);
  });
});
