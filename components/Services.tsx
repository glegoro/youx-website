"use client";

import { motion } from "motion/react";
import { Code2, Layers, Smartphone, BarChart3, ArrowRight } from "lucide-react";
import { useState } from "react";

const SERVICES = [
  { icon: Code2,       title: "Web Application Development", description: "Full-stack web apps built with modern frameworks — from MVP to production-grade platforms." },
  { icon: Smartphone,  title: "Mobile Development",          description: "Cross-platform applications that feel native on iOS and Android." },
  { icon: Layers,      title: "Product Design & UX",         description: "Research-driven design that makes complex workflows feel effortless." },
  { icon: BarChart3,   title: "SaaS & Platform Engineering", description: "Multi-tenant architecture, billing, auth, and everything that makes a SaaS run reliably." },
];

function ServiceCard({ s, i }: { s: typeof SERVICES[0]; i: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = s.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "28px",
        borderRadius: "var(--r-md)",
        border: `1px solid ${hovered ? "rgba(124,111,255,0.35)" : "var(--l-border)"}`,
        background: hovered ? "#FBFAFF" : "var(--l900)",
        transition: "border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease",
        boxShadow: hovered ? "0 4px 24px rgba(124,111,255,0.08), 0 0 0 1px rgba(124,111,255,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
        cursor: "default",
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: "var(--r-sm)",
        background: hovered ? "rgba(124,111,255,0.12)" : "var(--l700)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 18,
        transition: "background 0.25s ease",
      }}>
        <Icon size={20} color={hovered ? "var(--purple)" : "var(--lt2)"} style={{ transition: "color 0.25s ease" }} />
      </div>
      <h3 style={{
        fontSize: 15, fontWeight: 700, color: "var(--lt)",
        letterSpacing: "-0.01em", marginBottom: 8,
      }}>{s.title}</h3>
      <p style={{ fontSize: 13, color: "var(--lt2)", lineHeight: 1.65 }}>{s.description}</p>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" style={{
      padding: "var(--section-py) var(--container-px)",
      background: "var(--l800)",
    }}>
      <div className="container">
        <div className="services-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "72px 96px",
          alignItems: "start",
        }}>

          {/* Left copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p style={{
              fontSize: 11, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.14em", color: "var(--purple)", marginBottom: 14,
            }}>Agency</p>
            <h2 style={{
              fontSize: "clamp(30px, 4.5vw, 50px)",
              fontWeight: 800, letterSpacing: "-0.035em",
              color: "var(--lt)", lineHeight: 1.08, marginBottom: 20,
            }}>
              Custom software<br/>built for your vision
            </h2>
            <p style={{
              fontSize: 16, color: "var(--lt2)", lineHeight: 1.72, marginBottom: 36,
            }}>
              Beyond our own products, we partner with startups and scale-ups as a
              dedicated development team — bringing product thinking and engineering
              execution together.
            </p>
            <a href="#contact" style={{
              position: "relative", overflow: "hidden",
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "13px 26px", borderRadius: 100,
              fontSize: 14, fontWeight: 600, color: "#fff",
              background: "linear-gradient(135deg, var(--purple), var(--purple-dim))",
              transition: "box-shadow 0.25s ease, transform 0.25s ease",
              textDecoration: "none",
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px var(--glow-purple)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.boxShadow = "none";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <span style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)",
                animation: "shimmer 3.8s ease infinite",
              }} />
              Start a project <ArrowRight size={15} />
            </a>
          </motion.div>

          {/* Right service cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {SERVICES.map((s, i) => <ServiceCard key={s.title} s={s} i={i} />)}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .services-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
      `}</style>
    </section>
  );
}
