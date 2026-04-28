"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Calendar, MessageCircle, Mail } from "lucide-react";

const CALENDLY = "https://calendly.com/negorgleb/30min";
const WHATSAPP = "https://wa.me/971585126604";

const OPTIONS = [
  {
    icon: Calendar,
    title: "Book a discovery call",
    desc: "30-min video call — tell us about your project and we'll figure out how to help.",
    cta: "Book now →",
    href: CALENDLY,
    accent: "var(--purple)",
    glow: "rgba(124,111,255,0.2)",
    bg: "rgba(124,111,255,0.08)",
    border: "rgba(124,111,255,0.18)",
    borderHover: "rgba(124,111,255,0.5)",
  },
  {
    icon: Mail,
    title: "Send a message",
    desc: "We read every email and reply within 24 hours — drop us a line directly.",
    cta: "Email us →",
    href: "mailto:hello@youx.info",
    accent: "#0EA5E9",
    glow: "rgba(14,165,233,0.2)",
    bg: "rgba(14,165,233,0.08)",
    border: "rgba(14,165,233,0.18)",
    borderHover: "rgba(14,165,233,0.45)",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    desc: "Fast answers, quick decisions. Message us directly for an instant reply.",
    cta: "Message us →",
    href: WHATSAPP,
    accent: "#22C55E",
    glow: "rgba(34,197,94,0.2)",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.18)",
    borderHover: "rgba(34,197,94,0.45)",
  },
];

export default function Contact() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section id="contact" style={{
      padding: "var(--section-py) var(--container-px)",
      background: "var(--d900)",
    }}>
      <div className="container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <p style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.14em", color: "var(--purple)", marginBottom: 14,
          }}>Contact</p>
          <h2 style={{
            fontSize: "clamp(30px, 4.5vw, 50px)",
            fontWeight: 800, letterSpacing: "-0.035em",
            color: "var(--dt)", lineHeight: 1.08, marginBottom: 16,
          }}>
            Let&apos;s build something together
          </h2>
          <p style={{ fontSize: 15, color: "var(--dt2)", lineHeight: 1.7, maxWidth: 440, margin: "0 auto" }}>
            Choose how you&apos;d like to connect — we&apos;re flexible.
          </p>
        </motion.div>

        {/* Option cards */}
        <div className="contact-options" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}>
          {OPTIONS.map((opt, i) => {
            const Icon = opt.icon;
            const isHov = hovered === i;
            const isExternal = !opt.href.startsWith("#") && !opt.href.startsWith("mailto:");

            return (
              <motion.a
                key={opt.title}
                href={opt.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex", flexDirection: "column", gap: 16,
                  padding: "28px 24px",
                  borderRadius: "var(--r-lg)",
                  border: `1px solid ${isHov ? opt.borderHover : opt.border}`,
                  background: isHov ? opt.bg : "rgba(255,255,255,0.03)",
                  boxShadow: isHov ? `0 8px 40px ${opt.glow}` : "none",
                  transition: "border-color 0.25s ease, background 0.25s ease, box-shadow 0.3s ease, transform 0.25s ease",
                  transform: isHov ? "translateY(-3px)" : "translateY(0)",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: "var(--r-sm)",
                  background: isHov ? `${opt.accent}22` : "var(--d700)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.25s ease",
                  flexShrink: 0,
                }}>
                  <Icon size={20} color={isHov ? opt.accent : "var(--dt2)"} style={{ transition: "color 0.25s ease" }} />
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: 16, fontWeight: 700, color: "var(--dt)",
                    letterSpacing: "-0.01em", marginBottom: 8,
                  }}>{opt.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--dt2)", lineHeight: 1.6 }}>
                    {opt.desc}
                  </p>
                </div>

                <span style={{
                  fontSize: 13, fontWeight: 700,
                  color: isHov ? opt.accent : "var(--dt3)",
                  transition: "color 0.25s ease",
                }}>
                  {opt.cta}
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-options { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
