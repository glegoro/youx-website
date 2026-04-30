"use client";

import { motion } from "motion/react";
import { useEffect, useRef } from "react";

/* ── Globe (sphere wireframe) ────────────────────────────────── */
const LATS    = [-62, -36, 0, 36, 62].map(d => d * Math.PI / 180);
const LON_N   = 12;
const ARC_N   = 64;

const N_LABELS  = 4;
const ORBIT_R   = 1.58;
const ORBIT_SPD = 0.19;   // labels orbit speed; sign = opposite to sphere

function Globe({ size = 720 }: { size?: number }) {
  const ref      = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({ t: 0, speed: 0.008 });
  const onClick  = () => { stateRef.current.speed = 0.16; };

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

    /* ── only Y-axis rotation (spinning-top style) ── */
    const rotY = ([x, y, z]: [number, number, number], t: number): [number, number, number] => {
      const c = Math.cos(t), s = Math.sin(t);
      return [x * c - z * s, y, x * s + z * c];
    };

    const proj = ([x, y, z]: [number, number, number]): [number, number, number] => {
      const fov = 3.2, sc = size * 0.42;
      return [(x / (z + fov)) * sc + size / 2, (y / (z + fov)) * sc + size / 2, z];
    };

    const draw = () => {
      if (st.speed > 0.008) st.speed = Math.max(0.008, st.speed * 0.97);
      st.t += st.speed;
      ctx.clearRect(0, 0, size, size);
      ctx.shadowBlur = 0;

      /* ── 1. Sphere wireframe ── */
      ctx.lineWidth = 0.85;

      // Latitude rings
      for (const phi of LATS) {
        const r  = Math.cos(phi);
        const yc = Math.sin(phi);
        const eq = phi === 0;

        for (let s = 0; s < ARC_N; s++) {
          const a1 = (s / ARC_N) * 2 * Math.PI;
          const a2 = ((s + 1) / ARC_N) * 2 * Math.PI;
          const v1 = rotY([r * Math.cos(a1), yc, r * Math.sin(a1)], st.t);
          const v2 = rotY([r * Math.cos(a2), yc, r * Math.sin(a2)], st.t);
          const [x1, y1] = proj(v1);
          const [x2, y2] = proj(v2);
          const depth = Math.max(0, Math.min(1, ((v1[2] + v2[2]) / 2 + 1) / 2));
          const alpha = (eq ? 0.10 : 0.035) + depth * (eq ? 0.34 : 0.22);
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
          ctx.strokeStyle = `rgba(168,154,255,${alpha})`;
          ctx.stroke();
        }
      }

      // Longitude meridians
      for (let li = 0; li < LON_N; li++) {
        const lon = (li / LON_N) * 2 * Math.PI;

        for (let s = 0; s < ARC_N; s++) {
          const p1 = (s / ARC_N) * Math.PI - Math.PI / 2;
          const p2 = ((s + 1) / ARC_N) * Math.PI - Math.PI / 2;
          const v1 = rotY([Math.cos(p1) * Math.cos(lon), Math.sin(p1), Math.cos(p1) * Math.sin(lon)], st.t);
          const v2 = rotY([Math.cos(p2) * Math.cos(lon), Math.sin(p2), Math.cos(p2) * Math.sin(lon)], st.t);
          const [x1, y1] = proj(v1);
          const [x2, y2] = proj(v2);
          const depth = Math.max(0, Math.min(1, ((v1[2] + v2[2]) / 2 + 1) / 2));
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2);
          ctx.strokeStyle = `rgba(168,154,255,${0.03 + depth * 0.20})`;
          ctx.stroke();
        }
      }

      /* ── 2. YOUX orbit (opposite direction) ── */
      const fontSize = Math.round(size * 0.037);

      type Label = { px: number; py: number; alpha: number; angle: number };

      const labels: Label[] = Array.from({ length: N_LABELS }, (_, i) => {
        const θ   = -st.t * ORBIT_SPD + (i / N_LABELS) * 2 * Math.PI;
        const x3  = ORBIT_R * Math.cos(θ);
        const z3  = ORBIT_R * Math.sin(θ);

        const [px,  py ] = proj([x3, 0, z3]);
        const [px2, py2] = proj([ORBIT_R * Math.cos(θ + 0.01), 0, ORBIT_R * Math.sin(θ + 0.01)]);

        const depth = Math.max(0, Math.min(1, (z3 + ORBIT_R) / (2 * ORBIT_R)));
        const alpha = Math.max(0, depth - 0.04) * 0.92;

        // Tangent angle — flip if it would make text upside-down
        let angle = Math.atan2(py2 - py, px2 - px);
        if (angle > Math.PI / 2 || angle < -Math.PI / 2) angle += Math.PI;

        return { px, py, alpha, angle };
      });

      // Straight chord lines between consecutive labels (with text clearance gap)
      const GAP = fontSize * 2.6;
      ctx.lineWidth = 0.85;
      for (let i = 0; i < N_LABELS; i++) {
        const a = labels[i];
        const b = labels[(i + 1) % N_LABELS];
        const dx = b.px - a.px, dy = b.py - a.py;
        const dist = Math.hypot(dx, dy);
        if (dist < 4) continue;
        const ux = dx / dist, uy = dy / dist;
        const gap = Math.min(GAP, dist * 0.38);
        ctx.beginPath();
        ctx.moveTo(a.px + ux * gap, a.py + uy * gap);
        ctx.lineTo(b.px - ux * gap, b.py - uy * gap);
        ctx.strokeStyle = `rgba(168,154,255,${Math.max(0.06, (a.alpha + b.alpha) / 2 * 0.42)})`;
        ctx.stroke();
      }

      // Draw labels
      for (const { px, py, alpha, angle } of labels) {
        if (alpha < 0.02) continue;
        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle);
        ctx.scale(1.48, 1);               // horizontal stretch to match logo feel
        ctx.textAlign    = "center";
        ctx.textBaseline = "middle";
        ctx.font         = `800 ${fontSize}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.letterSpacing = `${fontSize * 0.22}px`;
        ctx.shadowBlur   = 14;
        ctx.shadowColor  = `rgba(168,154,255,${alpha * 0.55})`;
        ctx.fillStyle    = `rgba(210,204,255,${alpha})`;
        ctx.fillText("YouX", 0, 0);
        ctx.restore();
      }

      frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, [size]);

  return (
    <canvas
      ref={ref}
      onClick={onClick}
      title="Click to spin"
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

          {/* Right — globe */}
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
            <Globe size={720} />
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
