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

// Letters assigned to 4 spread-out vertices
const LETTERS = ["Y", "o", "u", "X"];
const LETTER_VI = [0, 3, 7, 10];

function Icosahedron({ size = 340 }: { size?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ t: 0, speed: 0.005 });

  const handleClick = () => {
    stateRef.current.speed = 0.14; // D20 roll — fast spin, decays back
  };

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

    const draw = () => {
      // Decelerate toward base speed
      if (st.speed > 0.005) st.speed = Math.max(0.005, st.speed * 0.965);
      st.t += st.speed;
      const t = st.t;

      ctx.clearRect(0, 0, size, size);

      const ry = t;
      const rx = t * 0.38;
      const cy = Math.cos(ry), sy = Math.sin(ry);
      const cx = Math.cos(rx), sx = Math.sin(rx);

      const project = ([x, y, z]: [number, number, number]): [number, number, number] => {
        const x1 = x * cy - z * sy;
        const z1 = x * sy + z * cy;
        const y2 = y * cx - z1 * sx;
        const z2 = y * sx + z1 * cx;
        const fov = 3.2;
        const s = size * 0.38;
        return [(x1 / (z2 + fov)) * s + size / 2, (y2 / (z2 + fov)) * s + size / 2, z2];
      };

      const pts = VERTS.map(project);

      /* ── edges ── */
      EDGES.forEach(([a, b]) => {
        const [ax, ay, az] = pts[a];
        const [bx, by, bz] = pts[b];
        const depth = Math.max(0, Math.min(1, ((az + bz) / 2 + 1) / 2));
        const alpha = 0.08 + depth * 0.72;

        const grad = ctx.createLinearGradient(ax, ay, bx, by);
        grad.addColorStop(0, `rgba(168,154,255,${alpha})`);
        grad.addColorStop(1, `rgba(0,229,184,${alpha * 0.55})`);

        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.shadowColor = `rgba(124,111,255,${alpha * 0.5})`;
        ctx.shadowBlur = 5;
        ctx.stroke();
      });

      /* ── vertices ── */
      ctx.shadowBlur = 10;
      pts.forEach(([px, py, pz]) => {
        const depth = Math.max(0, Math.min(1, (pz + 1) / 2));
        const alpha = 0.15 + depth * 0.85;
        ctx.beginPath();
        ctx.arc(px, py, 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168,154,255,${alpha})`;
        ctx.shadowColor = `rgba(168,154,255,${alpha * 0.8})`;
        ctx.fill();
      });

      /* ── YouX letters at 4 vertices ── */
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      LETTER_VI.forEach((vi, i) => {
        const [px, py, pz] = pts[vi];
        const depth = Math.max(0, Math.min(1, (pz + 1) / 2));
        // Only visible when facing camera (depth > 0.35)
        const alpha = Math.max(0, (depth - 0.35) / 0.65);
        if (alpha <= 0.02) return;

        const fontSize = Math.round(10 + depth * 18);
        ctx.font = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.shadowBlur = 14;
        ctx.shadowColor = `rgba(168,154,255,${alpha * 0.7})`;
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.93})`;
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
      style={{ width: size, height: size, cursor: "pointer" }}
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
          gridTemplateColumns: "1fr 1fr",
          gap: "48px 80px",
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

          {/* Right — icosahedron (D20) */}
          <motion.div
            className="about-visual"
            initial={{ opacity: 0, scale: 0.88 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            style={{ display: "flex", justifyContent: "center", alignItems: "center", position: "relative" }}
          >
            {/* Glow behind */}
            <div aria-hidden style={{
              position: "absolute",
              width: 280, height: 280, borderRadius: "50%",
              background: "radial-gradient(circle, rgba(124,111,255,0.14) 0%, transparent 70%)",
              filter: "blur(48px)",
              pointerEvents: "none",
            }} />
            <Icosahedron size={340} />
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
