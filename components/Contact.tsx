"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Send, CheckCircle2, Calendar, MessageCircle, Mail } from "lucide-react";

const CALENDLY  = "https://calendly.com/negorgleb/30min";
const WHATSAPP  = "https://wa.me/971585126604";

const OPTIONS = [
  {
    icon: Calendar,
    title: "Book a discovery call",
    desc: "30-min video call — tell us about your project and we'll figure out how to help.",
    cta: "Book now →",
    href: CALENDLY,
    accent: "var(--purple)",
    glow: "rgba(124,111,255,0.18)",
    bg: "rgba(124,111,255,0.06)",
    border: "rgba(124,111,255,0.2)",
    borderHover: "rgba(124,111,255,0.5)",
  },
  {
    icon: Mail,
    title: "Send a message",
    desc: "Fill in the form below — we read every message and reply within 24 hours.",
    cta: "See form ↓",
    href: "#contact-form",
    accent: "#0EA5E9",
    glow: "rgba(14,165,233,0.18)",
    bg: "rgba(14,165,233,0.06)",
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
    glow: "rgba(34,197,94,0.18)",
    bg: "rgba(34,197,94,0.06)",
    border: "rgba(34,197,94,0.18)",
    borderHover: "rgba(34,197,94,0.45)",
  },
];

type State = "idle" | "sending" | "sent";

const inputBase: React.CSSProperties = {
  width: "100%", padding: "12px 16px",
  borderRadius: "var(--r-sm)",
  border: "1px solid var(--l-border)",
  background: "var(--l900)",
  color: "var(--lt)",
  fontSize: 14, fontFamily: "var(--font-sans)",
  outline: "none",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
};

export default function Contact() {
  const [form, setForm]   = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState<State>("idle");
  const [hovered, setHovered] = useState<number | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setState(res.ok ? "sent" : "idle");
    } catch {
      setState("idle");
    }
  };

  const focusStyle = (el: HTMLElement) => {
    el.style.borderColor = "var(--purple)";
    el.style.boxShadow   = "0 0 0 3px rgba(124,111,255,0.14)";
  };
  const blurStyle = (el: HTMLElement) => {
    el.style.borderColor = "var(--l-border)";
    el.style.boxShadow   = "none";
  };

  return (
    <section id="contact" style={{
      padding: "var(--section-py) var(--container-px)",
      background: "var(--l900)",
    }}>
      <div className="container">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <p style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.14em", color: "var(--purple)", marginBottom: 14,
          }}>Contact</p>
          <h2 style={{
            fontSize: "clamp(30px, 4.5vw, 50px)",
            fontWeight: 800, letterSpacing: "-0.035em",
            color: "var(--lt)", lineHeight: 1.08, marginBottom: 16,
          }}>
            Let&apos;s build something together
          </h2>
          <p style={{ fontSize: 15, color: "var(--lt2)", lineHeight: 1.7, maxWidth: 440, margin: "0 auto" }}>
            Choose how you&apos;d like to connect — we&apos;re flexible.
          </p>
        </motion.div>

        {/* 3 option cards */}
        <div className="contact-options" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 64,
        }}>
          {OPTIONS.map((opt, i) => {
            const Icon = opt.icon;
            const isHov = hovered === i;
            const isScrollLink = opt.href.startsWith("#");

            return (
              <motion.a
                key={opt.title}
                href={opt.href}
                target={isScrollLink ? undefined : "_blank"}
                rel={isScrollLink ? undefined : "noopener noreferrer"}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex", flexDirection: "column", gap: 16,
                  padding: "28px 24px",
                  borderRadius: "var(--r-lg)",
                  border: `1px solid ${isHov ? opt.borderHover : opt.border}`,
                  background: isHov ? opt.bg : "var(--l900)",
                  boxShadow: isHov ? `0 8px 32px ${opt.glow}` : "0 1px 4px rgba(0,0,0,0.04)",
                  transition: "border-color 0.25s ease, background 0.25s ease, box-shadow 0.3s ease, transform 0.25s ease",
                  transform: isHov ? "translateY(-3px)" : "translateY(0)",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: "var(--r-sm)",
                  background: isHov ? `${opt.accent}22` : "var(--l700)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "background 0.25s ease",
                  flexShrink: 0,
                }}>
                  <Icon size={20} color={isHov ? opt.accent : "var(--lt2)"} style={{ transition: "color 0.25s ease" }} />
                </div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: 16, fontWeight: 700, color: "var(--lt)",
                    letterSpacing: "-0.01em", marginBottom: 8,
                  }}>{opt.title}</h3>
                  <p style={{ fontSize: 13, color: "var(--lt2)", lineHeight: 1.6 }}>
                    {opt.desc}
                  </p>
                </div>

                {/* CTA */}
                <span style={{
                  fontSize: 13, fontWeight: 700,
                  color: isHov ? opt.accent : "var(--lt3)",
                  transition: "color 0.25s ease",
                }}>
                  {opt.cta}
                </span>
              </motion.a>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          marginBottom: 48,
        }}>
          <div style={{ flex: 1, height: 1, background: "var(--l-border)" }} />
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase", color: "var(--lt3)",
          }}>or send a message</span>
          <div style={{ flex: 1, height: 1, background: "var(--l-border)" }} />
        </div>

        {/* Form */}
        <motion.div
          id="contact-form"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{ maxWidth: 600, margin: "0 auto" }}
        >
          {state === "sent" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                gap: 16, padding: "60px 32px",
                borderRadius: "var(--r-lg)",
                border: "1px solid var(--l-border)",
                background: "var(--l800)", textAlign: "center",
              }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.1 }}
              >
                <CheckCircle2 size={48} color="var(--cyan)" />
              </motion.div>
              <h3 style={{ fontSize: 20, fontWeight: 700, color: "var(--lt)" }}>Message sent!</h3>
              <p style={{ fontSize: 14, color: "var(--lt2)" }}>We&apos;ll be in touch soon.</p>
            </motion.div>
          ) : (
            <form onSubmit={onSubmit} style={{
              display: "flex", flexDirection: "column", gap: 16,
              padding: "36px",
              borderRadius: "var(--r-lg)",
              border: "1px solid var(--l-border)",
              background: "var(--l800)",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {(["name", "email"] as const).map(field => (
                  <div key={field}>
                    <label htmlFor={field} style={{
                      display: "block", fontSize: 12, fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.06em",
                      color: "var(--lt3)", marginBottom: 6,
                    }}>
                      {field === "name" ? "Name" : "Email"}
                    </label>
                    <input
                      id={field} name={field}
                      type={field === "email" ? "email" : "text"}
                      required
                      placeholder={field === "name" ? "Your name" : "you@company.com"}
                      value={form[field]} onChange={onChange}
                      style={inputBase}
                      onFocus={e => focusStyle(e.target)}
                      onBlur={e => blurStyle(e.target)}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label htmlFor="message" style={{
                  display: "block", fontSize: 12, fontWeight: 700,
                  textTransform: "uppercase", letterSpacing: "0.06em",
                  color: "var(--lt3)", marginBottom: 6,
                }}>Message</label>
                <textarea
                  id="message" name="message" required rows={5}
                  placeholder="Tell us about your project or question..."
                  value={form.message} onChange={onChange}
                  style={{ ...inputBase, resize: "vertical", minHeight: 130 }}
                  onFocus={e => focusStyle(e.target as HTMLElement)}
                  onBlur={e => blurStyle(e.target as HTMLElement)}
                />
              </div>

              <button
                type="submit"
                disabled={state === "sending"}
                style={{
                  position: "relative", overflow: "hidden",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  padding: "13px 24px", borderRadius: 100,
                  fontSize: 14, fontWeight: 600, color: "#fff",
                  background: state === "sending"
                    ? "rgba(124,111,255,0.5)"
                    : "linear-gradient(135deg, var(--purple), var(--purple-dim))",
                  cursor: state === "sending" ? "not-allowed" : "pointer",
                  transition: "box-shadow 0.2s ease, transform 0.2s ease",
                }}
                onMouseEnter={e => {
                  if (state !== "sending") {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px var(--glow-purple)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {state !== "sending" && (
                  <span style={{
                    position: "absolute", inset: 0,
                    background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)",
                    animation: "shimmer 3.8s ease infinite",
                  }} />
                )}
                {state === "sending" ? "Sending…" : "Send message"}
                {state !== "sending" && <Send size={14} />}
              </button>
            </form>
          )}
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-options { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
