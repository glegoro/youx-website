"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useCallback } from "react";

const LINE1 = ["We", "build"];
const LINE2 = ["products"];          // gradient word
const LINE3 = ["people", "love", "to", "use"];

export default function Hero() {
  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.4);
  const springX = useSpring(rawX, { damping: 28, stiffness: 90 });
  const springY = useSpring(rawY, { damping: 28, stiffness: 90 });
  const spotLeft = useTransform(springX, v => `${v * 100}%`);
  const spotTop  = useTransform(springY, v => `${v * 100}%`);

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width);
    rawY.set((e.clientY - r.top)  / r.height);
  }, [rawX, rawY]);

  return (
    <section
      id="hero"
      onMouseMove={onMouseMove}
      style={{
        minHeight: "100vh",
        background: "var(--d900)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Dot grid */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.09) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(ellipse 75% 75% at 50% 40%, black 10%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 75% 75% at 50% 40%, black 10%, transparent 100%)",
      }} />

      {/* Orb purple */}
      <div aria-hidden style={{
        position: "absolute", top: "8%", right: "8%",
        width: 640, height: 640, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,111,255,0.28) 0%, rgba(124,111,255,0.06) 45%, transparent 70%)",
        filter: "blur(48px)",
        animation: "orb1 14s ease-in-out infinite",
      }} />

      {/* Orb cyan */}
      <div aria-hidden style={{
        position: "absolute", bottom: "10%", left: "2%",
        width: 480, height: 480, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,229,184,0.2) 0%, rgba(0,229,184,0.04) 45%, transparent 70%)",
        filter: "blur(56px)",
        animation: "orb2 18s ease-in-out infinite",
      }} />

      {/* Orb faint middle */}
      <div aria-hidden style={{
        position: "absolute", top: "55%", left: "45%",
        width: 360, height: 360, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(124,111,255,0.1) 0%, transparent 70%)",
        filter: "blur(60px)",
        animation: "orb3 22s ease-in-out infinite",
      }} />

      {/* Mouse follow spotlight — spring-driven, no re-renders */}
      <motion.div aria-hidden style={{
        position: "absolute",
        left: spotLeft,
        top: spotTop,
        width: 600, height: 600,
        translateX: "-50%",
        translateY: "-50%",
        background: "radial-gradient(circle, rgba(124,111,255,0.07) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      {/* Wave layers */}
      {[
        { h: 200, speed: 14, rev: false, color: "124,111,255", op: 0.09, cy: 100 },
        { h: 160, speed: 23, rev: true,  color: "0,229,184",   op: 0.06, cy: 80  },
        { h: 120, speed: 18, rev: false, color: "124,111,255", op: 0.05, cy: 60  },
      ].map((w, i) => {
        const d = `M0,${w.cy} C360,${w.cy - 40} 720,${w.cy + 40} 1080,${w.cy} C1260,${w.cy - 20} 1380,${w.cy + 20} 1440,${w.cy} L1440,${w.h} L0,${w.h} Z`;
        return (
          <div key={i} aria-hidden style={{
            position: "absolute", bottom: 0, left: 0,
            width: "200%", height: w.h,
            animation: `wave-flow ${w.speed}s linear infinite${w.rev ? " reverse" : ""}`,
            pointerEvents: "none",
          }}>
            {[0, 1].map(j => (
              <svg key={j} viewBox={`0 0 1440 ${w.h}`} preserveAspectRatio="none"
                style={{ width: "50%", height: "100%", display: "inline-block" }}>
                <path d={d} fill={`rgba(${w.color},${w.op})`} />
              </svg>
            ))}
          </div>
        );
      })}

      {/* Content */}
      <div className="container" style={{ position: "relative", zIndex: 1, padding: "140px var(--container-px) 110px" }}>

        {/* Headline — line 1 */}
        <h1 style={{
          fontSize: "clamp(52px, 8.5vw, 100px)",
          fontWeight: 800, letterSpacing: "-0.045em",
          lineHeight: 0.97, color: "var(--dt)",
          marginBottom: 28,
        }}>
          {/* "We build" */}
          <div style={{ overflow: "hidden", display: "block", marginBottom: "0.06em" }}>
            {LINE1.map((w, i) => (
              <motion.span key={w}
                initial={{ y: "115%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: "inline-block", marginRight: "0.28em" }}
              >{w}</motion.span>
            ))}
          </div>

          {/* "products" — animated gradient */}
          <div style={{ overflow: "hidden", display: "block", marginBottom: "0.06em" }}>
            <motion.span
              initial={{ y: "115%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, var(--purple-light) 0%, var(--cyan) 60%, var(--purple-light) 120%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "gradient-pan 5s ease infinite",
              }}
            >
              {LINE2[0]}
            </motion.span>
          </div>

          {/* "people love to use" */}
          <div style={{ overflow: "hidden", display: "block" }}>
            {LINE3.map((w, i) => (
              <motion.span key={w}
                initial={{ y: "115%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, delay: 0.5 + i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: "inline-block", marginRight: "0.28em" }}
              >{w}</motion.span>
            ))}
          </div>
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontSize: "clamp(16px, 2vw, 19px)",
            color: "var(--dt2)", lineHeight: 1.72,
            maxWidth: 510, marginBottom: 52,
          }}
        >
          YouX is a Dubai-based IT company. We ship our own SaaS products
          and partner with ambitious teams to build exceptional digital experiences.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.15, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
        >
          {/* Primary */}
          <a href="#products" className="btn-primary">
            <span className="shimmer-layer" />
            Explore our products
            <ArrowRight size={16} />
          </a>

          {/* Ghost */}
          <a href="#services" className="btn-ghost">
            Work with us
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.9, duration: 0.7 }}
        style={{
          position: "absolute", bottom: 32, left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          cursor: "default",
        }}
      >
        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.18em",
          textTransform: "uppercase", color: "var(--dt3)",
        }}>scroll</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}>
          <ChevronDown size={15} color="rgba(238,238,252,0.25)" />
        </motion.div>
      </motion.div>

      <style>{`
        .btn-primary {
          position: relative; overflow: hidden;
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: 100px;
          font-size: 15px; font-weight: 600; color: #fff;
          background: linear-gradient(135deg, var(--purple) 0%, var(--purple-dim) 100%);
          transition: box-shadow 0.25s ease, transform 0.25s ease;
          text-decoration: none;
        }
        .btn-primary:hover {
          box-shadow: 0 8px 32px var(--glow-purple);
          transform: translateY(-2px);
        }
        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 28px; border-radius: 100px;
          font-size: 15px; font-weight: 600;
          color: var(--dt);
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.11);
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
          text-decoration: none;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.2);
          transform: translateY(-2px);
        }
        .shimmer-layer {
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: shimmer 3.8s ease infinite;
        }
      `}</style>
    </section>
  );
}
