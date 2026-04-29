"use client";

import { ArrowUpRight } from "lucide-react";

const LINKS = {
  Products: [
    { label: "University Engage", href: "https://engage.youx.info", ext: true },
    { label: "Reach by YouX",     href: "https://reach.youx.info",  ext: true },
  ],
  Company: [
    { label: "About",    href: "#about",    ext: false },
    { label: "Services", href: "#services", ext: false },
    { label: "Contact",  href: "#contact",  ext: false },
  ],
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{
      background: "var(--d900)",
      borderTop: "1px solid var(--d-border)",
      padding: "64px var(--container-px) 36px",
    }}>
      {/* Thin gradient line at top */}
      <div style={{
        height: 1, marginBottom: 64,
        background: "linear-gradient(90deg, transparent, var(--d-border), transparent)",
        display: "none",
      }} />

      <div className="container">
        <div className="footer-grid" style={{
          display: "grid",
          gridTemplateColumns: "1.4fr auto auto",
          gap: "48px 100px",
          marginBottom: 56,
        }}>

          {/* Brand */}
          <div>
            <div style={{
              fontSize: 22, fontWeight: 800, letterSpacing: "-0.04em",
              background: "linear-gradient(135deg, #fff 40%, var(--purple-light) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text", marginBottom: 12,
            }}>YouX</div>
            <p style={{ fontSize: 13, color: "var(--dt3)", lineHeight: 1.65, maxWidth: 260 }}>
              Product studio & digital agency. We build software that matters.
            </p>
          </div>

          {Object.entries(LINKS).map(([group, items]) => (
            <div key={group}>
              <p style={{
                fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.12em", color: "var(--dt3)", marginBottom: 16,
              }}>{group}</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
                {items.map(item => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.ext ? "_blank" : undefined}
                      rel={item.ext ? "noopener noreferrer" : undefined}
                      style={{
                        fontSize: 13, color: "var(--dt2)",
                        display: "inline-flex", alignItems: "center", gap: 4,
                        transition: "color 0.15s ease",
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--dt)"}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--dt2)"}
                    >
                      {item.label}
                      {item.ext && <ArrowUpRight size={11} />}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: 24,
          borderTop: "1px solid var(--d-border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: 12,
        }}>
          <p style={{ fontSize: 12, color: "var(--dt3)" }}>
            © {year} YouX. All rights reserved.
          </p>
          <p style={{ fontSize: 12, color: "var(--dt3)" }}>
            United Arab Emirates
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 40px 32px !important;
          }
          .footer-grid > :first-child { grid-column: 1 / -1; }
        }
      `}</style>
    </footer>
  );
}
