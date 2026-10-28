"use client";

import {
  Environment,
  Lightformer,
  Line,
  PerformanceMonitor,
  RoundedBox,
  useProgress,
} from "@react-three/drei";
import {
  Canvas,
  type ThreeEvent,
  useFrame,
  useThree,
} from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { type ComponentRef, useEffect, useMemo, useRef, useState } from "react";
import {
  CatmullRomCurve3,
  DoubleSide,
  type Group,
  type Texture,
  Vector3,
} from "three";
import type { QualityProfile } from "@/lib/three/device-tier";
import { createRope, createSpring } from "@/lib/three/rope";
import { readTokens } from "@/lib/three/tokens";
import {
  type CardBaseContent,
  type CardContent,
  createCardTextures,
} from "./card-textures";
import { progressStore } from "./progress-store";

const CARD_WIDTH = 1.6;
const CARD_HEIGHT = 2.25;
const ANCHOR = { x: 0, y: 2.0 };
const SEGMENTS = 4;
const SEGMENT_LENGTH = 0.42;
const ROPE_SAMPLES = 24;
// Warna dasar netral agar tekstur tampil apa adanya (pengali material).
const TEXTURE_TINT = "#ffffff";

// Meneruskan progres pemuatan aset (useProgress) ke preloader di bundel awal.
const ProgressBridge = ({ ready }: { ready: boolean }) => {
  const { progress } = useProgress();
  useEffect(() => progressStore.report(progress), [progress]);
  useEffect(() => {
    if (ready) progressStore.finish();
  }, [ready]);
  return null;
};

type LanyardProps = {
  content: CardContent;
  onReady: () => void;
  onDragChange: (dragging: boolean) => void;
};

const Lanyard = ({ content, onReady, onDragChange }: LanyardProps) => {
  const card = useRef<Group>(null);
  const line = useRef<ComponentRef<typeof Line>>(null);
  const tokens = useMemo(() => readTokens(), []);
  const { viewport, size } = useThree();
  const [textures, setTextures] = useState<{
    front: Texture;
    back: Texture;
  } | null>(null);
  const rope = useMemo(
    () =>
      createRope({
        anchor: ANCHOR,
        segments: SEGMENTS,
        segmentLength: SEGMENT_LENGTH,
      }),
    [],
  );
  const spin = useMemo(() => createSpring(), []);
  const drag = useRef<{ offset: { x: number; y: number } } | null>(null);
  const [hovered, setHovered] = useState(false);
  const curve = useMemo(
    () =>
      new CatmullRomCurve3(
        Array.from({ length: SEGMENTS + 1 }, () => new Vector3()),
      ),
    [],
  );
  const initialPoints = useMemo(
    () => Array.from({ length: ROPE_SAMPLES }, () => new Vector3()),
    [],
  );

  // Kartu sedikit lebih kecil di layar sempit.
  const scale = size.width < 360 ? 0.9 : 1;

  useEffect(() => {
    let cancelled = false;
    let created: { front: Texture; back: Texture } | null = null;
    createCardTextures(tokens, content)
      .then((result) => {
        created = result;
        if (cancelled) return;
        setTextures(result);
        onReady();
      })
      .catch(() => onReady());
    return () => {
      cancelled = true;
      created?.front.dispose();
      created?.back.dispose();
    };
  }, [tokens, content, onReady]);

  useEffect(() => {
    document.body.style.cursor = drag.current
      ? "grabbing"
      : hovered
        ? "grab"
        : "";
    return () => {
      document.body.style.cursor = "";
    };
  }, [hovered]);

  // Titik pointer di bidang kartu, dibatasi agar kartu tidak terseret keluar kanvas.
  const pointerWorld = (pointer: { x: number; y: number }) => {
    const limitX = Math.max(0, viewport.width / 2 / scale - CARD_WIDTH * 0.6);
    const x = (pointer.x * viewport.width) / 2 / scale;
    return {
      x: Math.min(limitX, Math.max(-limitX, x)),
      y: (pointer.y * viewport.height) / 2 / scale,
    };
  };

  const onPointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    (event.target as Element).setPointerCapture(event.pointerId);
    const tip = rope.tip();
    const point = { x: event.point.x / scale, y: event.point.y / scale };
    drag.current = { offset: { x: tip.x - point.x, y: tip.y - point.y } };
    document.body.style.cursor = "grabbing";
    onDragChange(true);
  };

  const onPointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (!drag.current) return;
    (event.target as Element).releasePointerCapture(event.pointerId);
    drag.current = null;
    rope.release();
    // Lemparan menyamping membuat kartu berputar lalu kembali menghadap depan.
    spin.impulse(rope.tipVelocity(1 / 60).x * 0.9);
    document.body.style.cursor = hovered ? "grab" : "";
    onDragChange(false);
  };

  useFrame((state, delta) => {
    if (drag.current) {
      const world = pointerWorld(state.pointer);
      rope.grab({
        x: world.x + drag.current.offset.x,
        y: world.y + drag.current.offset.y,
      });
    }
    rope.step(delta);
    spin.step(delta);

    const nodes = rope.nodes;
    const tip = nodes[SEGMENTS]!;
    const before = nodes[SEGMENTS - 1]!;
    const dx = tip.x - before.x;
    const dy = tip.y - before.y;
    const length = Math.hypot(dx, dy) || 1;
    const angle = Math.atan2(dx / length, -dy / length);

    const node = card.current;
    if (node) {
      const half = CARD_HEIGHT / 2 + 0.12;
      node.position.set(
        tip.x + Math.sin(angle) * half,
        tip.y - Math.cos(angle) * half,
        0,
      );
      node.rotation.set(
        0,
        spin.value + rope.tipVelocity(1 / 60).x * 0.05,
        angle,
      );
    }

    nodes.forEach((point, index) =>
      curve.points[index]?.set(point.x, point.y, 0),
    );
    const sampled = curve
      .getPoints(ROPE_SAMPLES - 1)
      .flatMap((point) => [point.x, point.y, point.z]);
    line.current?.geometry.setPositions(sampled);
  });

  return (
    <group scale={scale}>
      <Line
        ref={line}
        points={initialPoints}
        color={tokens.accent2}
        lineWidth={3.5}
      />
      <mesh position={[ANCHOR.x, ANCHOR.y + 0.05, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.1, 24]} />
        <meshStandardMaterial
          color={tokens.muted}
          metalness={1}
          roughness={0.3}
        />
      </mesh>
      <group
        ref={card}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {/* Klip logam. */}
        <RoundedBox
          args={[0.34, 0.16, 0.07]}
          radius={0.03}
          position={[0, CARD_HEIGHT / 2 + 0.06, 0]}
        >
          <meshStandardMaterial
            color={tokens.fg}
            metalness={1}
            roughness={0.22}
          />
        </RoundedBox>
        <RoundedBox
          args={[CARD_WIDTH, CARD_HEIGHT, 0.04]}
          radius={0.07}
          smoothness={4}
        >
          <meshPhysicalMaterial
            color={tokens.surface}
            roughness={0.6}
            clearcoat={0.35}
            clearcoatRoughness={0.4}
            envMapIntensity={0.6}
          />
        </RoundedBox>
        <mesh position={[0, 0, 0.0215]}>
          <planeGeometry args={[CARD_WIDTH - 0.06, CARD_HEIGHT - 0.06]} />
          <meshPhysicalMaterial
            // Material dibuat ulang saat tekstur siap: shader perlu dikompilasi dengan map.
            key={textures ? "front-textured" : "front-plain"}
            map={textures?.front ?? null}
            color={textures ? TEXTURE_TINT : tokens.surface}
            roughness={0.6}
            clearcoat={0.35}
            clearcoatRoughness={0.35}
            envMapIntensity={0.6}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0, -0.0215]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[CARD_WIDTH - 0.06, CARD_HEIGHT - 0.06]} />
          <meshPhysicalMaterial
            // Material dibuat ulang saat tekstur siap: shader perlu dikompilasi dengan map.
            key={textures ? "back-textured" : "back-plain"}
            map={textures?.back ?? null}
            color={textures ? TEXTURE_TINT : tokens.accentDeep}
            roughness={0.6}
            clearcoat={0.35}
            clearcoatRoughness={0.35}
            envMapIntensity={0.6}
            toneMapped={false}
            side={DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
};

type IdCardCanvasProps = {
  quality: QualityProfile;
  active: boolean;
  content: CardBaseContent;
  onReady: () => void;
};

export default function IdCardCanvas({
  quality,
  active,
  content,
  onReady,
}: IdCardCanvasProps) {
  // Kode QR mengarah ke alamat situs yang sedang dibuka (komponen ini hanya di browser).
  const cardContent = useMemo<CardContent>(
    () => ({
      ...content,
      siteUrl: `${window.location.origin}${window.location.pathname}`,
      siteLabel: window.location.host,
    }),
    [content],
  );
  const [ready, setReady] = useState(false);
  const [factor, setFactor] = useState(1);
  const dragging = useRef(false);
  const [minDpr, maxDpr] = quality.dpr;

  const handleReady = useMemo(
    () => () => {
      setReady(true);
      onReady();
    },
    [onReady],
  );

  return (
    <Canvas
      aria-hidden="true"
      dpr={minDpr + (maxDpr - minDpr) * factor}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 10], fov: 25 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
      onCreated={({ gl }) => {
        // Scroll halaman hanya ditahan bila sentuhan dimulai pada kartu.
        const canvas = gl.domElement;
        const stopScroll = (event: TouchEvent) => {
          if (dragging.current) event.preventDefault();
        };
        canvas.addEventListener("touchstart", stopScroll, { passive: false });
        canvas.addEventListener("touchmove", stopScroll, { passive: false });
      }}
    >
      <PerformanceMonitor
        bounds={() => [45, 58]}
        onDecline={() => setFactor((value) => Math.max(0, value - 0.5))}
        onIncline={() => setFactor((value) => Math.min(1, value + 0.25))}
      >
        <ambientLight intensity={1.1} />
        <directionalLight position={[3, 4, 6]} intensity={0.8} />
        {/* Lingkungan cahaya prosedural (tanpa unduhan HDR) untuk pantulan halus. */}
        <Environment resolution={128} frames={1}>
          <Lightformer
            intensity={1}
            position={[0, 5, 3]}
            rotation-x={Math.PI / 3}
            scale={[6, 0.6, 1]}
          />
          <Lightformer
            intensity={0.8}
            position={[-4, 0, 2]}
            rotation-y={Math.PI / 3}
            scale={[4, 6, 1]}
          />
          <Lightformer
            intensity={0.8}
            position={[4, -1, 2]}
            rotation-y={-Math.PI / 3}
            scale={[4, 6, 1]}
          />
        </Environment>
        <Lanyard
          content={cardContent}
          onReady={handleReady}
          onDragChange={(value) => {
            dragging.current = value;
          }}
        />
        {quality.bloom ? (
          <EffectComposer multisampling={0}>
            <Bloom intensity={0.35} luminanceThreshold={0.85} mipmapBlur />
          </EffectComposer>
        ) : null}
      </PerformanceMonitor>
      <ProgressBridge ready={ready} />
    </Canvas>
  );
}
