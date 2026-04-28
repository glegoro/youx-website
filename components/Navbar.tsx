"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Products", href: "#products" },
  { label: "Services", href: "#services" },
  { label: "About",    href: "#about" },
  { label: "Contact",  href: "#contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {/* static gradient top line */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 1, zIndex: 200,
        background: "linear-gradient(90deg, var(--purple), var(--cyan), var(--purple))",
      }} />

      <header style={{
        position: "fixed", top: 1, left: 0, right: 0, zIndex: 100,
        height: 64,
        display: "flex", alignItems: "center",
        padding: "0 var(--container-px)",
        background: scrolled ? "rgba(3,3,10,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid var(--d-border)" : "1px solid transparent",
        transition: "background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease",
      }}>
        <nav style={{
          width: "100%", maxWidth: "var(--container-max)", margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>

          {/* Logo */}
          <Link href="/" style={{
            fontSize: 22, fontWeight: 800, letterSpacing: "-0.04em",
            background: "linear-gradient(135deg, #fff 40%, var(--purple-light) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            YouX
          </Link>

          {/* Desktop links */}
          <ul className="nav-desktop" style={{ display: "flex", gap: 4, listStyle: "none", alignItems: "center" }}>
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <a href={link.href} style={{
                  padding: "6px 14px", borderRadius: "var(--r-sm)",
                  fontSize: 14, fontWeight: 500,
                  color: "var(--dt2)",
                  transition: "color 0.15s ease, background 0.15s ease",
                  display: "block",
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = "var(--dt)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = "var(--dt2)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" style={{
                position: "relative", overflow: "hidden",
                padding: "8px 20px", borderRadius: 100,
                fontSize: 14, fontWeight: 600,
                color: "#fff",
                background: "linear-gradient(135deg, var(--purple), var(--purple-dim))",
                display: "inline-block",
                transition: "box-shadow 0.2s ease, transform 0.2s ease",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 24px var(--glow-purple)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <span className="shimmer-layer" />
                Get in touch
              </a>
            </li>
          </ul>

          {/* Burger */}
          <button onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu"
            className="nav-burger"
            style={{ display: "none", flexDirection: "column", gap: 5, padding: 6 }}
          >
            {[0,1,2].map(i => (
              <span key={i} style={{
                display: "block", width: 22, height: 2,
                background: "var(--dt)", borderRadius: 2,
                transition: "transform 0.2s ease, opacity 0.2s ease",
                transform: menuOpen && i===0 ? "rotate(45deg) translate(5px,5px)"
                          : menuOpen && i===2 ? "rotate(-45deg) translate(5px,-5px)" : "none",
                opacity: menuOpen && i===1 ? 0 : 1,
              }} />
            ))}
          </button>
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{
            position: "absolute", top: 64, left: 0, right: 0,
            background: "rgba(7,7,15,0.97)", backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--d-border)",
            padding: "16px 24px 28px",
            display: "flex", flexDirection: "column", gap: 4,
          }}>
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{
                padding: "12px 0", fontSize: 16, fontWeight: 500,
                color: "var(--dt2)", borderBottom: "1px solid var(--d-border)",
              }}>
                {link.label}
              </a>
            ))}
            <a href="#contact" onClick={() => setMenuOpen(false)} style={{
              marginTop: 14, padding: "13px 0", textAlign: "center",
              borderRadius: 100, fontSize: 15, fontWeight: 600, color: "#fff",
              background: "linear-gradient(135deg, var(--purple), var(--purple-dim))",
            }}>
              Get in touch
            </a>
          </div>
        )}
      </header>

      <style>{`
        .shimmer-layer {
          position:absolute; inset:0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: shimmer 3.5s ease infinite;
        }
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-burger  { display: flex !important; }
        }
        a[href="#contact"] { border-radius: 100px !important; }
      `}</style>
    </>
  );
}
