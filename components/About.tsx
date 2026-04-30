"use client";

import { motion } from "motion/react";

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
        maskImage: "radial-gradient(ellipse 60% 70% at 50% 50%, black, transparent)",
        WebkitMaskImage: "radial-gradient(ellipse 60% 70% at 50% 50%, black, transparent)",
        pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: 640 }}
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
      </div>
    </section>
  );
}
