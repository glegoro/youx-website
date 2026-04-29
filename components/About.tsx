"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";

/* ── Icosahedron geometry ────────────────────────────────────── */
const φ = (1 + Math.sqrt(5)) / 2;
const MAG = Math.sqrt(1 + φ * φ);

const VERTS: [number, number, number][] = [
  [0, 1, φ], [0, -1, φ], [0, 1, -φ], [0, -1, -φ],
  [1, φ, 0], [-1, φ, 0], [1, -φ, 0], [-1, -φ, 0],
  [φ, 0, 1], [-φ, 0, 1], [φ, 0, -1], [-φ, 0, -1],
].map(([x, y, z]) => [x / MAG, y / MAG, z / MAG]) as [number, number, number][];

const EDGES: [number, number][] = [
  [0,1],[0,4],[0,5],[0,8],[0,9],
  [1,6],[1,7],[1,8],[1,9],
  [2,3],[2,4],[2,5],[2,10],[2,11],
  [3,6],[3,7],[3,10],[3,11],
  [4,5],[4,8],[4,10],
  [5,9],[5,11],
  [6,7],[6,8],[6,10],
  [7,9],[7,11],
  [8,10],[9,11],
];

// All 20 triangular faces of the icosahedron
const FACES: [number, number, number][] = [
  [0,1,8],[0,1,9],[0,4,5],[0,4,8],[0,5,9],
  [1,6,7],[1,6,8],[1,7,9],
  [2,3,10],[2,3,11],[2,4,5],[2,4,10],[2,5,11],
  [3,6,7],[3,6,10],[3,7,11],
  [4,8,10],[5,9,11],[6,8,10],[7,9,11],
];

const LETTERS = ["Y", "O", "U", "X"];

// Orbital params for each letter: phase, elevation angle, orbit radius
const LETTER_ORBITS = [
  { phase: 0,               elev: Math.PI * 0.33, r: 1.52 },
  { phase: Math.PI / 2,     elev: Math.PI * 0.67, r: 1.52 },
  { phase: Math.PI,         elev: Math.PI * 0.33, r: 1.52 },
  { phase: Math.PI * 1.5,   elev: Math.PI * 0.67, r: 1.52 },
];

function Icosahedron({ size = 720 }: { size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ t: 0, speed: 0.003 });

  const handleClick = () => { stateRef.current.speed = 0.12; };

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let frame: number;
    const st = stateRef.current;

    /* ── rotation + projection helpers ── */
    const getMatrices = (t: number) => {
      const ry = t, rx = t * 0.38;
      return {
        cosY: Math.cos(ry), sinY: Math.sin(ry),
        cosX: Math.cos(rx), sinX: Math.sin(rx),
      };
    };

    const rotate = (
      [x, y, z]: [number, number, number],
      { cosY, sinY, cosX, sinX }: ReturnType<typeof getMatrices>
    ): [number, number, number] => {
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      return [x1, y2, z2];
    };

    const project = ([x, y, z]: [number, number, number]): [number, number, number] => {
      const fov = 3.2, s = size * 0.44;
      return [(x / (z + fov)) * s + size / 2, (y / (z + fov)) * s + size / 2, z];
    };

    const draw = () => {
      if (st.speed > 0.003) st.speed = Math.max(0.003, st.speed * 0.965);
      st.t += st.speed;

      ctx.clearRect(0, 0, size, size);

      const mat = getMatrices(st.t);
      const rotated3D = VERTS.map(v => rotate(v, mat));
      const pts = rotated3D.map(project);

      /* ── face normal helper ── */
      const faceNormalZ = (a: number, b: number, c: number) => {
        const [ax, ay, az] = rotated3D[a];
        const [bx, by, bz] = rotated3D[b];
        const [cx, cy, cz] = rotated3D[c];
        const ux = bx-ax, uy = by-ay, uz = bz-az;
        const vx = cx-ax, vy = cy-ay, vz = cz-az;
        // z component of cross product + magnitude
        const nz = ux*vy - uy*vx;
        const mag = Math.sqrt((uy*uz-uz*vy)**2 + (uz*vx-ux*vz)**2 + nz**2) || 1;
        return nz / mag;
      };

      /* ── 1. faces (painter's algo, back → front) ── */
      const facesDepth = FACES.map(([a, b, c]) => ({
        abc: [a, b, c] as [number, number, number],
        z: (rotated3D[a][2] + rotated3D[b][2] + rotated3D[c][2]) / 3,
      })).sort((a, b) => a.z - b.z);

      facesDepth.forEach(({ abc: [a, b, c] }) => {
        const nz = faceNormalZ(a, b, c);
        if (nz <= 0) return; // back-face culled
        const [ax, ay] = pts[a], [bx, by] = pts[b], [cx, cy] = pts[c];
        ctx.beginPath();
        ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.lineTo(cx, cy);
        ctx.closePath();
        // Front faces: soft purple fill scaled by light angle
        ctx.fillStyle = `rgba(124,111,255,${nz * 0.055})`;
        ctx.fill();
      });

      /* ── 2. edges ── */
      EDGES.forEach(([a, b]) => {
        const [ax, ay, az] = pts[a], [bx, by, bz] = pts[b];
        const depth = Math.max(0, Math.min(1, ((az + bz) / 2 + 1) / 2));
        const alpha = 0.06 + depth * 0.58;
        const grad = ctx.createLinearGradient(ax, ay, bx, by);
        grad.addColorStop(0, `rgba(168,154,255,${alpha})`);
        grad.addColorStop(1, `rgba(0,229,184,${alpha * 0.45})`);
        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.shadowColor = `rgba(124,111,255,${alpha * 0.3})`;
        ctx.shadowBlur = 2;
        ctx.stroke();
      });

      /* ── 3. vertices ── */
      ctx.shadowBlur = 6;
      pts.forEach(([px, py, pz]) => {
        const depth = Math.max(0, Math.min(1, (pz + 1) / 2));
        const alpha = 0.12 + depth * 0.78;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,154,255,${alpha})`;
        ctx.shadowColor = `rgba(168,154,255,${alpha * 0.7})`;
        ctx.fill();
      });

      /* ── 4. orbital letters ── */
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      LETTER_ORBITS.forEach((orb, i) => {
        const θ = orb.phase + st.t * 0.38; // orbit at same rate as X-rotation
        const pos: [number, number, number] = [
          orb.r * Math.sin(orb.elev) * Math.cos(θ),
          orb.r * Math.cos(orb.elev),
          orb.r * Math.sin(orb.elev) * Math.sin(θ),
        ];
        const [rx, ry, rz] = rotate(pos, mat);
        const [px, py] = project([rx, ry, rz]);

        // Depth: rz ranges roughly -1.5 to +1.5 at this radius
        const depth = Math.max(0, Math.min(1, (rz + 1.6) / 3.2));
        const alpha = Math.max(0, (depth - 0.15) / 0.85) * 0.6;
        if (alpha < 0.02) return;

        const fontSize = Math.round(size * 0.025 + depth * size * 0.018);
        ctx.font = `700 ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(168,154,255,${alpha * 0.65})`;
        ctx.fillStyle = `rgba(215,208,255,${alpha})`;
        ctx.fillText(LETTERS[i], px, py);
      });

      ctx.shadowBlur = 0;
      frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, [size]);

  return (
    <canvas
      ref={ref}
      onClick={handleClick}
      title="Click to roll"
      style={{ width: size, height: size, maxWidth: "100%", cursor: "pointer" }}
    />
  );
}

/* ── Section ─────────────────────────────────────────────────── */
export default function About() {
  return (
    <section id="about" style={{
      padding: "var(--section-py) var(--container-px)",
      background: "var(--d900)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Dot grid */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(ellipse 60% 70% at 80% 50%, black, transparent)",
        WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 80% 50%, black, transparent)",
        pointerEvents: "none",
      }} />

      {/* Gradient fade → Contact */}
      <div aria-hidden style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 120,
        background: "linear-gradient(to bottom, transparent, var(--d900))",
        pointerEvents: "none", zIndex: 2,
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <div className="about-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.3fr",
          gap: "48px 40px",
          alignItems: "center",
        }}>
          {/* Left — text */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <p style={{
              fontSize: 11, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.14em", color: "var(--purple-light)", marginBottom: 14,
            }}>About YouX</p>
            <h2 style={{
              fontSize: "clamp(32px, 5vw, 56px)",
              fontWeight: 800, letterSpacing: "-0.035em",
              color: "var(--dt)", lineHeight: 1.08, marginBottom: 28,
            }}>
              A studio that<br/>ships real products
            </h2>
            <p style={{ fontSize: 16, color: "var(--dt2)", lineHeight: 1.78, marginBottom: 20 }}>
              YouX is a studio run by builders. We believe the best agencies are
              built by people who also create their own products — because that&apos;s the
              only way to truly understand what it takes to ship software people depend on.
            </p>
            <p style={{ fontSize: 16, color: "var(--dt2)", lineHeight: 1.78 }}>
              We run University Engage in production, are growing Reach as our second
              platform, and take on a select number of client projects where we can
              genuinely add value.
            </p>
          </motion.div>

          {/* Right — icosahedron */}
          <motion.div
            className="about-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}
          >
            <div aria-hidden style={{
              position: "absolute",
              width: 300, height: 300, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(124,111,255,0.1) 0%, transparent 70%)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }} />
            <Icosahedron size={720} />
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
          .about-visual { display: none; }
        }
      `}</style>
    </section>
  );
}
