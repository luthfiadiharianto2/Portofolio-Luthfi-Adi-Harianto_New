import { describe, expect, it } from "vitest";
import { createRope, createSpring } from "@/lib/three/rope";

const length = (rope: ReturnType<typeof createRope>) =>
  rope.nodes.slice(1).reduce((total, node, index) => {
    const previous = rope.nodes[index]!;
    return total + Math.hypot(node.x - previous.x, node.y - previous.y);
  }, 0);

const simulate = (rope: ReturnType<typeof createRope>, seconds: number) => {
  for (let t = 0; t < seconds; t += 1 / 60) rope.step(1 / 60);
};

describe("tali Verlet", () => {
  it("menggantung lurus ke bawah dari jangkar dalam keadaan diam", () => {
    const rope = createRope({
      anchor: { x: 0, y: 4 },
      segments: 4,
      segmentLength: 0.5,
    });
    simulate(rope, 2);
    const tip = rope.tip();
    expect(tip.x).toBeCloseTo(0, 3);
    expect(tip.y).toBeCloseTo(2, 2);
  });

  it("tidak pernah lebih panjang dari panjang talinya", () => {
    const rope = createRope({
      anchor: { x: 0, y: 4 },
      segments: 4,
      segmentLength: 0.5,
    });
    rope.grab({ x: 1.5, y: 1 });
    simulate(rope, 0.5);
    rope.release();
    for (let i = 0; i < 120; i += 1) {
      rope.step(1 / 60);
      expect(length(rope)).toBeLessThanOrEqual(2 + 0.02);
    }
  });

  it("jangkar tidak bergerak", () => {
    const rope = createRope({
      anchor: { x: 0, y: 4 },
      segments: 3,
      segmentLength: 0.5,
    });
    rope.grab({ x: 3, y: 0 });
    simulate(rope, 1);
    expect(rope.nodes[0]).toMatchObject({ x: 0, y: 4 });
  });

  it("berayun lalu kembali tenang setelah dilepas", () => {
    const rope = createRope({
      anchor: { x: 0, y: 4 },
      segments: 4,
      segmentLength: 0.5,
    });
    rope.grab({ x: 1.4, y: 2.6 });
    simulate(rope, 0.3);
    rope.release();
    simulate(rope, 0.3);
    expect(Math.abs(rope.tip().x)).toBeGreaterThan(0.05);
    simulate(rope, 12);
    expect(rope.tip().x).toBeCloseTo(0, 1);
    expect(Math.abs(rope.tipVelocity(1 / 60).x)).toBeLessThan(0.05);
  });

  it("tetap stabil walau langkah waktunya besar (tab kembali aktif)", () => {
    const rope = createRope({
      anchor: { x: 0, y: 4 },
      segments: 4,
      segmentLength: 0.5,
    });
    rope.step(5);
    expect(Number.isFinite(rope.tip().y)).toBe(true);
    expect(rope.tip().y).toBeGreaterThan(1.9);
  });
});

describe("pegas putaran kartu", () => {
  it("kembali ke posisi awal setelah didorong", () => {
    const spring = createSpring();
    spring.impulse(8);
    for (let i = 0; i < 30; i += 1) spring.step(1 / 60);
    expect(Math.abs(spring.value)).toBeGreaterThan(0.1);
    for (let i = 0; i < 600; i += 1) spring.step(1 / 60);
    expect(spring.value).toBeCloseTo(0, 2);
  });
});
