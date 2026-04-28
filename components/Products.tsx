"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Users, Zap } from "lucide-react";
import { useRef, useState } from "react";

const PRODUCTS = [
  {
    name: "University Engage",
    tagline: "Campus engagement, reimagined",
    description:
      "A white-label SaaS platform that powers student life. Students earn Engage Points for attending events, redeem rewards, and collect verified achievement badges — all in one platform.",
    status: "Live",
    statusColor: "#00E5B8",
    href: "https://engage.youx.info",
    icon: Users,
    highlights: [
      "Engage Points & rewards system",
      "Verified achievement badges",
      "White-label for universities",
      "Event management & check-ins",
    ],
    accent: "var(--purple)",
    glow: "rgba(124,111,255,0.15)",
  },
  {
    name: "Reach by YouX",
    tagline: "Coming soon",
    description:
      "Our second product is in active development. Reach will be available at reach.youx.info once it launches — stay tuned.",
    status: "In development",
    statusColor: "#F59E0B",
    href: "https://reach.youx.info",
    icon: Zap,
    highlights: [],
    accent: "#F59E0B",
    glow: "rgba(245,158,11,0.12)",
  },
];

/* 3-D tilt wrapper */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    setTilt({ x: y * -6, y: x * 6 });
  };

  return (
    <div ref={ref} className={className}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
        transition: hovered ? "transform 0.08s ease" : "transform 0.5s ease",
        transformStyle: "preserve-3d",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
}

/* Gradient-border card */
function ProductCard({ product, index }: { product: typeof PRODUCTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = product.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.85, delay: index * 0.18, ease: [0.16, 1, 0.3, 1] }}
      style={{ height: "100%" }}
    >
      <TiltCard>
        {/* Gradient border shell */}
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            height: "100%",
            position: "relative",
            borderRadius: "var(--r-lg)",
            padding: "1px",
            background: hovered
              ? `linear-gradient(135deg, ${product.accent}90, var(--cyan)60)`
              : "linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))",
            transition: "background 0.5s ease",
          }}
        >
          {/* Glow bloom behind card */}
          {hovered && (
            <div style={{
              position: "absolute", inset: -24,
              borderRadius: "inherit",
              background: product.glow,
              filter: "blur(28px)",
              zIndex: -1,
              pointerEvents: "none",
            }} />
          )}

          {/* Inner card */}
          <div style={{
            height: "100%",
            borderRadius: "calc(var(--r-lg) - 1px)",
            background: hovered ? "var(--d700)" : "var(--d800)",
            padding: "36px",
            display: "flex", flexDirection: "column", gap: 22,
            transition: "background 0.3s ease",
            position: "relative", overflow: "hidden",
          }}>
            {/* Subtle inner glow top-right */}
            <div style={{
              position: "absolute", top: -60, right: -60,
              width: 200, height: 200, borderRadius: "50%",
              background: `radial-gradient(circle, ${product.glow} 0%, transparent 70%)`,
              pointerEvents: "none",
              opacity: hovered ? 1 : 0.4,
              transition: "opacity 0.4s ease",
            }} />

            {/* Header row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: "var(--r-md)",
                background: `${product.accent}1A`,
                border: `1px solid ${product.accent}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon size={22} color={product.accent} />
              </div>

              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "4px 12px", borderRadius: 100,
                fontSize: 11, fontWeight: 700,
                letterSpacing: "0.05em",
                color: product.statusColor,
                background: `${product.statusColor}18`,
                border: `1px solid ${product.statusColor}30`,
                flexShrink: 0,
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: "50%",
                  background: product.statusColor,
                  animation: product.status === "Live" ? "dot-ping 2s ease infinite" : "none",
                }} />
                {product.status}
              </span>
            </div>

            {/* Text */}
            <div>
              <h3 style={{
                fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em",
                color: "var(--dt)", marginBottom: 6,
              }}>{product.name}</h3>
              <p style={{
                fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.07em", color: product.accent, marginBottom: 14,
              }}>{product.tagline}</p>
              <p style={{ fontSize: 14, color: "var(--dt2)", lineHeight: 1.7 }}>
                {product.description}
              </p>
            </div>

            {/* Highlights */}
            {product.highlights.length > 0 && (
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                {product.highlights.map(h => (
                  <li key={h} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "var(--dt2)" }}>
                    <span style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: product.accent, flexShrink: 0,
                    }} />
                    {h}
                  </li>
                ))}
              </ul>
            )}

            {/* CTA */}
            <div style={{ marginTop: "auto", paddingTop: 8 }}>
              <a href={product.href} target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 13, fontWeight: 700,
                  color: product.accent,
                  letterSpacing: "0.01em",
                  transition: "gap 0.2s ease",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.gap = "10px"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.gap = "6px"}
              >
                Visit {product.name} <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
}

export default function Products() {
  return (
    <section id="products" style={{
      padding: "var(--section-py) var(--container-px)",
      background: "var(--d800)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Gradient fade → Services (light) */}
      <div aria-hidden style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 100,
        background: "linear-gradient(to bottom, transparent, #F6F6FC)",
        pointerEvents: "none", zIndex: 2,
      }} />

      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: 56 }}
        >
          <p style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.14em", color: "var(--purple-light)", marginBottom: 14,
          }}>Our Products</p>
          <h2 style={{
            fontSize: "clamp(32px, 5vw, 54px)",
            fontWeight: 800, letterSpacing: "-0.035em",
            color: "var(--dt)", lineHeight: 1.08, maxWidth: 480,
          }}>
            Software we own<br/>and operate
          </h2>
        </motion.div>

        {/* Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 24,
          alignItems: "stretch",
        }}>
          {PRODUCTS.map((p, i) => <ProductCard key={p.name} product={p} index={i} />)}
        </div>
      </div>
    </section>
  );
}
