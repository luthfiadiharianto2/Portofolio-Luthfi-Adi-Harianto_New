"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  type Group,
  Line,
  LineBasicMaterial,
  Points,
  PointsMaterial,
} from "three";
import type { QualityProfile } from "@/lib/three/device-tier";
import { type DesignTokens, readTokens } from "@/lib/three/tokens";

const SHOOTING_STARS = 2;

type ShootingStar = {
  line: Line;
  material: LineBasicMaterial;
  life: number;
  duration: number;
  vx: number;
  vy: number;
};

// Objek three.js untuk bintang dan bintang jatuh, dibuat dan diubah di luar render React.
const createStarSystem = (
  group: Group,
  count: number,
  tokens: DesignTokens,
) => {
  const palette = [tokens.fg, tokens.accent2, tokens.accent3].map(
    (value) => new Color(value),
  );
  const positions: number[] = [];
  const colors: number[] = [];
  for (let index = 0; index < count; index += 1) {
    // Titik acak di kulit bola agar bintang mengelilingi kamera.
    const radius = 18 + Math.random() * 40;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions.push(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
    );
    const color = palette[
      Math.random() < 0.82 ? 0 : 1 + Math.floor(Math.random() * 2)
    ] as Color;
    const brightness = 0.45 + Math.random() * 0.55;
    colors.push(
      color.r * brightness,
      color.g * brightness,
      color.b * brightness,
    );
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));
  const material = new PointsMaterial({
    size: 0.09,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    depthWrite: false,
  });
  const points = new Points(geometry, material);
  group.add(points);

  const shooting: ShootingStar[] = Array.from(
    { length: SHOOTING_STARS },
    () => {
      const lineGeometry = new BufferGeometry();
      lineGeometry.setAttribute(
        "position",
        new Float32BufferAttribute([0, 0, 0, 0, 0, 0], 3),
      );
      const lineMaterial = new LineBasicMaterial({
        color: tokens.fg,
        transparent: true,
        opacity: 0,
        blending: AdditiveBlending,
        depthWrite: false,
      });
      const line = new Line(lineGeometry, lineMaterial);
      group.add(line);
      return {
        line,
        material: lineMaterial,
        life: 0,
        duration: 0,
        vx: 0,
        vy: 0,
      };
    },
  );

  let nextShot = 2 + Math.random() * 4;
  const target = { x: 0, y: 0 };

  return {
    setTarget: (x: number, y: number) => {
      target.x = x;
      target.y = y;
    },
    update: (delta: number) => {
      const dt = Math.min(delta, 1 / 20);
      group.rotation.x += (target.x - group.rotation.x) * dt * 2;
      group.rotation.y += (target.y - group.rotation.y) * dt * 2 + dt * 0.004;

      nextShot -= dt;
      for (const star of shooting) {
        if (star.life <= 0 && nextShot <= 0) {
          // Bintang jatuh baru dari sisi kanan atas, melintas miring.
          star.duration = 0.9 + Math.random() * 0.6;
          star.life = star.duration;
          star.vx = -(10 + Math.random() * 8);
          star.vy = -(4 + Math.random() * 4);
          star.line.position.set(
            6 + Math.random() * 10,
            4 + Math.random() * 5,
            -20,
          );
          nextShot = 4 + Math.random() * 6;
        }
        if (star.life > 0) {
          star.life -= dt;
          const progress = 1 - star.life / star.duration;
          star.line.position.x += star.vx * dt;
          star.line.position.y += star.vy * dt;
          const tail = star.line.geometry.getAttribute("position");
          tail.setXYZ(1, -star.vx * 0.12, -star.vy * 0.12, 0);
          tail.needsUpdate = true;
          star.material.opacity = Math.sin(progress * Math.PI) * 0.9;
        } else {
          star.material.opacity = 0;
        }
      }
    },
    dispose: () => {
      group.remove(points, ...shooting.map((star) => star.line));
      geometry.dispose();
      material.dispose();
      shooting.forEach((star) => {
        star.line.geometry.dispose();
        star.material.dispose();
      });
    },
  };
};

type StarSystem = ReturnType<typeof createStarSystem>;

const Stars = ({
  count,
  interactive,
}: {
  count: number;
  interactive: boolean;
}) => {
  const group = useRef<Group>(null);
  const system = useRef<StarSystem | null>(null);

  useEffect(() => {
    if (!group.current) return;
    const created = createStarSystem(group.current, count, readTokens());
    system.current = created;
    return () => {
      created.dispose();
      system.current = null;
    };
  }, [count]);

  useEffect(() => {
    if (!interactive) return;
    // Mouse di desktop, posisi scroll di layar sentuh.
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onMove = (event: PointerEvent) =>
      system.current?.setTarget(
        (event.clientY / window.innerHeight - 0.5) * 0.12,
        (event.clientX / window.innerWidth - 0.5) * 0.18,
      );
    const onScroll = () =>
      system.current?.setTarget(
        window.scrollY * 0.00012,
        window.scrollY * 0.00006,
      );
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
    else window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [interactive]);

  useFrame((_, delta) => {
    if (interactive) system.current?.update(delta);
  });

  return <group ref={group} />;
};

// Latar luar angkasa di belakang seluruh halaman. Kualitas turun otomatis bila fps < 45.
export default function StarfieldCanvas({
  quality,
  interactive,
}: {
  quality: QualityProfile;
  interactive: boolean;
}) {
  const [factor, setFactor] = useState(1);
  const [minDpr, maxDpr] = quality.dpr;
  const dpr = minDpr + (maxDpr - minDpr) * factor;
  const count = Math.round(quality.stars * (0.5 + factor * 0.5));

  return (
    <Canvas
      aria-hidden="true"
      dpr={dpr}
      frameloop={interactive ? "always" : "demand"}
      camera={{ position: [0, 0, 1], fov: 70, near: 0.1, far: 100 }}
      gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
      style={{ position: "fixed", inset: 0, pointerEvents: "none" }}
    >
      <PerformanceMonitor
        bounds={() => [45, 58]}
        onDecline={() => setFactor((value) => Math.max(0, value - 0.5))}
        onIncline={() => setFactor((value) => Math.min(1, value + 0.25))}
      >
        <Stars count={count} interactive={interactive} />
      </PerformanceMonitor>
    </Canvas>
  );
}
