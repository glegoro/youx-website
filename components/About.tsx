"use client";

import { motion } from "motion/react";

const ROW1 = [
  "Product Strategy", "UX Design", "Web Apps", "Brand Identity",
  "User Research", "Motion Design", "Conversion", "Design Systems",
  "Data Viz", "Landing Pages", "Growth", "Prototyping",
];

const ROW2 = [
  "App Architecture", "Visual Design", "Dashboards", "Accessibility",
  "Performance", "A/B Testing", "Mobile", "Automation",
  "Analytics", "Onboarding Flows", "SaaS Products", "UI Engineering",
];

function MarqueeRow({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  // Duplicate for seamless loop
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: "hidden", maskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)", WebkitMaskImage: "linear-gradient(90deg, transparent, black 12%, black 88%, transparent)" }}>
      <div
        className={reverse ? "marquee-reverse" : "marquee"}
        style={{ display: "flex", gap: 10, width: "max-content" }}
      >
        {doubled.map((item, i) => (
          <span key={i} style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "7px 14px",
            borderRadius: 100,
            border: "1px solid rgba(168,154,255,0.14)",
            background: "rgba(124,111,255,0.055)",
            fontSize: 12, fontWeight: 500,
            color: "var(--dt2)",
            whiteSpace: "nowrap",
            transition: "border-color 0.2s, color 0.2s",
          }}>
            <span style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "rgba(168,154,255,0.45)",
              flexShrink: 0,
            }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" style={{
      padding: "var(--section-py) 0",
      background: "var(--d900)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Dot grid */}
      <div aria-hidden style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(ellipse 70% 80% at 50% 50%, black, transparent)",
        WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 50% 50%, black, transparent)",
        pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 1, padding: "0 var(--container-px)" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ maxWidth: 640, marginBottom: 64, marginLeft: "auto", marginRight: "auto", textAlign: "center" }}
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

      {/* Marquee — full bleed, outside container */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{ display: "flex", flexDirection: "column", gap: 10, position: "relative", zIndex: 1 }}
      >
        <MarqueeRow items={ROW1} />
        <MarqueeRow items={ROW2} reverse />
      </motion.div>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes marquee-rev {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        .marquee         { animation: marquee     38s linear infinite; }
        .marquee-reverse { animation: marquee-rev 42s linear infinite; }
      `}</style>
    </section>
  );
}
