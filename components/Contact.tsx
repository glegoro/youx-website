"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

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
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [state, setState] = useState<State>("idle");

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
    el.style.boxShadow = "0 0 0 3px rgba(124,111,255,0.14)";
  };
  const blurStyle = (el: HTMLElement) => {
    el.style.borderColor = "var(--l-border)";
    el.style.boxShadow = "none";
  };

  return (
    <section id="contact" style={{
      padding: "var(--section-py) var(--container-px)",
      background: "var(--l900)",
    }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          style={{ maxWidth: 600, margin: "0 auto" }}
        >
          <p style={{
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.14em", color: "var(--purple)", marginBottom: 14,
            textAlign: "center",
          }}>Contact</p>
          <h2 style={{
            fontSize: "clamp(30px, 4.5vw, 50px)",
            fontWeight: 800, letterSpacing: "-0.035em",
            color: "var(--lt)", lineHeight: 1.08, marginBottom: 14,
            textAlign: "center",
          }}>
            Let&apos;s build something together
          </h2>
          <p style={{
            fontSize: 15, color: "var(--lt2)", lineHeight: 1.7,
            marginBottom: 40, textAlign: "center",
          }}>
            Drop us a message and we&apos;ll get back to you shortly.
          </p>

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
                background: "var(--l800)",
                textAlign: "center",
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
    </section>
  );
}
