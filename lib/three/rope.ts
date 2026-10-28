// Simulasi tali kartu ID dengan integrasi Verlet dan batasan jarak.
// Pengganti mesin fisika penuh (rapier, ~835 kB gzip) yang terlalu berat untuk
// anggaran bundel 3D. Murni TypeScript, tanpa three.js, agar mudah diuji.

export type Vec2 = { x: number; y: number };

type Node = { x: number; y: number; px: number; py: number; pinned: boolean };

export type RopeOptions = {
  anchor: Vec2;
  segments: number;
  segmentLength: number;
  gravity?: number;
  damping?: number;
  iterations?: number;
};

export type Rope = {
  nodes: readonly Readonly<Node>[];
  /** Ujung bawah tali (titik klip kartu). */
  tip: () => Vec2;
  /** Kecepatan ujung bawah per detik, dari selisih posisi Verlet. */
  tipVelocity: (dt: number) => Vec2;
  /** Memegang ujung bawah di posisi tertentu (saat kartu diseret). */
  grab: (position: Vec2) => void;
  release: () => void;
  step: (dt: number) => void;
};

export const createRope = ({
  anchor,
  segments,
  segmentLength,
  gravity = -9.8,
  damping = 0.985,
  iterations = 10,
}: RopeOptions): Rope => {
  const nodes: Node[] = Array.from({ length: segments + 1 }, (_, index) => {
    const y = anchor.y - index * segmentLength;
    return { x: anchor.x, y, px: anchor.x, py: y, pinned: index === 0 };
  });
  const tipNode = nodes[segments] as Node;
  let grabbed: Vec2 | null = null;

  const satisfyConstraints = () => {
    for (let pass = 0; pass < iterations; pass += 1) {
      for (let index = 0; index < segments; index += 1) {
        const a = nodes[index] as Node;
        const b = nodes[index + 1] as Node;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const distance = Math.hypot(dx, dy) || 1e-6;
        // Tali tidak bisa memanjang, tapi boleh mengendur.
        if (distance <= segmentLength) continue;
        const correction = (distance - segmentLength) / distance;
        const aMovable = !a.pinned;
        const bMovable = !(b === tipNode && grabbed);
        const share = aMovable && bMovable ? 0.5 : 1;
        if (aMovable) {
          a.x += dx * correction * share;
          a.y += dy * correction * share;
        }
        if (bMovable) {
          b.x -= dx * correction * share;
          b.y -= dy * correction * share;
        }
      }
    }
  };

  return {
    nodes,
    tip: () => ({ x: tipNode.x, y: tipNode.y }),
    tipVelocity: (dt) => ({
      x: (tipNode.x - tipNode.px) / dt,
      y: (tipNode.y - tipNode.py) / dt,
    }),
    grab: (position) => {
      // Pegangan dibatasi pada jangkauan tali dari jangkar.
      const reach = segments * segmentLength;
      const dx = position.x - anchor.x;
      const dy = position.y - anchor.y;
      const distance = Math.hypot(dx, dy);
      grabbed =
        distance > reach
          ? {
              x: anchor.x + (dx / distance) * reach,
              y: anchor.y + (dy / distance) * reach,
            }
          : position;
    },
    release: () => {
      grabbed = null;
    },
    step: (rawDt) => {
      // Batasi langkah agar tidak meledak setelah tab tidak aktif.
      const dt = Math.min(rawDt, 1 / 30);
      for (const node of nodes) {
        if (node.pinned) continue;
        if (node === tipNode && grabbed) {
          node.px = node.x;
          node.py = node.y;
          node.x = grabbed.x;
          node.y = grabbed.y;
          continue;
        }
        const vx = (node.x - node.px) * damping;
        const vy = (node.y - node.py) * damping;
        node.px = node.x;
        node.py = node.y;
        node.x += vx;
        node.y += vy + gravity * dt * dt;
      }
      satisfyConstraints();
    },
  };
};

/**
 * Pegas teredam satu sumbu, untuk putaran kartu (yaw) yang kembali ke depan.
 */
export const createSpring = ({ stiffness = 28, damping = 4.5 } = {}) => {
  let value = 0;
  let velocity = 0;
  return {
    get value() {
      return value;
    },
    get velocity() {
      return velocity;
    },
    impulse: (amount: number) => {
      velocity += amount;
    },
    step: (rawDt: number) => {
      const dt = Math.min(rawDt, 1 / 30);
      const acceleration = -stiffness * value - damping * velocity;
      velocity += acceleration * dt;
      value += velocity * dt;
    },
  };
};
