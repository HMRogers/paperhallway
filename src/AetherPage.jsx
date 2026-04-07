// ─────────────────────────────────────────────────────────────────────────────
// Paper Hallway — /office/aether
// Aether product landing page with:
//   • Hero section with high-fidelity logo render
//   • "Get Aether" download button (.msi from GitHub Releases)
//   • Feature highlights
//   • Lemon Squeezy purchase flow + success page with license key
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
// Hero image is in /public — served as a static asset at /aether-hero.png
const aetherHero = "/aether-hero.png";

// ── Constants ─────────────────────────────────────────────────────────────────

const MSI_URL =
  "https://github.com/HMRogers/aether-alpha/releases/latest/download/Aether_Setup.msi";

// Replace with your real Lemon Squeezy checkout URL once the product is created
const LEMON_CHECKOUT_URL =
  "https://paperhallway.lemonsqueezy.com/checkout/buy/aether-license";

// ── Helpers ───────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── Sub-components ────────────────────────────────────────────────────────────

/* — Breadcrumb nav — */
function AetherNav({ scrolled }) {
  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 transition-all duration-700"
      style={{
        backdropFilter: scrolled ? "blur(20px)" : "none",
        background: scrolled ? "rgba(5,13,26,0.92)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(0,212,255,0.08)" : "1px solid transparent",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-10 flex items-center justify-between h-16 sm:h-20">
        {/* Back to Paper Hallway */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          style={{ textDecoration: "none" }}
        >
          <svg viewBox="0 0 28 36" className="w-4 h-6" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1">
            <rect x="1" y="1" width="26" height="34" rx="1.5" />
            <line x1="7" y1="8" x2="21" y2="8" strokeWidth="0.5" />
            <line x1="7" y1="12" x2="21" y2="12" strokeWidth="0.5" />
            <line x1="7" y1="16" x2="17" y2="16" strokeWidth="0.5" />
          </svg>
          <span style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.4)", fontSize: "11px", letterSpacing: "0.2em" }}>
            PAPER HALLWAY
          </span>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>/</span>
          <span style={{ fontFamily: "var(--font-body)", color: "rgba(0,212,255,0.7)", fontSize: "11px", letterSpacing: "0.2em" }}>
            OFFICE
          </span>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "11px" }}>/</span>
          <span style={{ fontFamily: "var(--font-body)", color: "rgba(255,255,255,0.7)", fontSize: "11px", letterSpacing: "0.2em" }}>
            AETHER
          </span>
        </Link>
        {/* CTA in nav */}
        <a
          href={MSI_URL}
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "11px",
            letterSpacing: "0.15em",
            color: "#00D4FF",
            border: "1px solid rgba(0,212,255,0.3)",
            padding: "6px 16px",
            borderRadius: "4px",
            textDecoration: "none",
            transition: "all 200ms ease",
          }}
          onMouseEnter={(e) => { e.target.style.background = "rgba(0,212,255,0.1)"; }}
          onMouseLeave={(e) => { e.target.style.background = "transparent"; }}
        >
          DOWNLOAD
        </a>
      </div>
    </nav>
  );
}

/* — Feature card — */
function FeatureCard({ icon, title, body, delay }) {
  const [ref, visible] = useInView(0.1);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(0,212,255,0.1)",
        borderRadius: "12px",
        padding: "28px 24px",
      }}
    >
      <div style={{ fontSize: "28px", marginBottom: "14px" }}>{icon}</div>
      <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "20px", color: "#E8F4FF", marginBottom: "8px", fontWeight: 400 }}>
        {title}
      </h3>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: "1.7" }}>
        {body}
      </p>
    </div>
  );
}

/* — Success page (shown after Lemon Squeezy redirects back with ?order_id=...) — */
function SuccessPage({ orderId, licenseKey }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(licenseKey).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--aether-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Glow orb */}
        <div style={{
          width: "80px", height: "80px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,212,255,0.4) 0%, rgba(0,122,255,0.1) 60%, transparent 100%)",
          margin: "0 auto 32px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "32px",
          boxShadow: "0 0 40px rgba(0,212,255,0.2)",
        }}>
          ✓
        </div>

        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 40px)", color: "#E8F4FF", fontWeight: 300, marginBottom: "12px" }}>
          Welcome to Aether.
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "14px", color: "rgba(255,255,255,0.45)", marginBottom: "40px", lineHeight: "1.7" }}>
          Your license is active. Order <span style={{ color: "rgba(0,212,255,0.7)" }}>#{orderId}</span> confirmed.
          Keep your key safe — you'll need it to activate Aether on your machine.
        </p>

        {/* License key box */}
        <div style={{
          background: "rgba(0,212,255,0.04)",
          border: "1px solid rgba(0,212,255,0.2)",
          borderRadius: "10px",
          padding: "20px 24px",
          marginBottom: "16px",
        }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.2em", color: "rgba(0,212,255,0.6)", marginBottom: "10px" }}>
            YOUR LICENSE KEY
          </div>
          <div style={{
            fontFamily: "monospace",
            fontSize: "15px",
            color: "#E8F4FF",
            letterSpacing: "0.08em",
            wordBreak: "break-all",
            lineHeight: "1.6",
          }}>
            {licenseKey}
          </div>
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "8px",
            border: "none",
            background: copied ? "rgba(52,211,153,0.85)" : "rgba(0,122,255,0.85)",
            color: "#fff",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            letterSpacing: "0.1em",
            cursor: "pointer",
            transition: "background 300ms ease",
            marginBottom: "24px",
          }}
        >
          {copied ? "✓ Copied to Clipboard" : "Copy License Key"}
        </button>

        {/* Download CTA */}
        <a
          href={MSI_URL}
          style={{
            display: "block",
            padding: "14px",
            borderRadius: "8px",
            border: "1px solid rgba(0,212,255,0.25)",
            background: "transparent",
            color: "#00D4FF",
            fontFamily: "var(--font-body)",
            fontSize: "13px",
            letterSpacing: "0.1em",
            textDecoration: "none",
            transition: "background 200ms ease",
          }}
          onMouseEnter={(e) => { e.target.style.background = "rgba(0,212,255,0.06)"; }}
          onMouseLeave={(e) => { e.target.style.background = "transparent"; }}
        >
          ↓ Download Aether for Windows
        </a>

        <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "32px" }}>
          A copy of your key has been sent to your email. Questions?{" "}
          <a href="mailto:hello@paperhallway.com" style={{ color: "rgba(0,212,255,0.5)", textDecoration: "none" }}>
            hello@paperhallway.com
          </a>
        </p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AetherPage() {
  const [searchParams] = useSearchParams();
  const [scrolled, setScrolled] = useState(false);
  const [heroRef, heroVisible] = useInView(0.05);

  // Lemon Squeezy redirects back with ?order_id=xxx&license_key=xxx on success
  const orderId    = searchParams.get("order_id");
  const licenseKey = searchParams.get("license_key");

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  // ── Success state ──────────────────────────────────────────────────────────
  if (orderId && licenseKey) {
    return (
      <>
        <AetherStyles />
        <SuccessPage orderId={orderId} licenseKey={licenseKey} />
      </>
    );
  }

  // ── Main landing page ──────────────────────────────────────────────────────
  return (
    <>
      <AetherStyles />
      <div style={{ background: "var(--aether-bg)", minHeight: "100vh", color: "#E8F4FF" }}>
        <AetherNav scrolled={scrolled} />

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section
          ref={heroRef}
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "120px 24px 80px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Background hero image */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${aetherHero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.35,
            zIndex: 0,
          }} />
          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(5,13,26,0.3) 0%, rgba(5,13,26,0.0) 40%, rgba(5,13,26,0.8) 85%, var(--aether-bg) 100%)",
            zIndex: 1,
          }} />

          {/* Content */}
          <div style={{ position: "relative", zIndex: 2, textAlign: "center", maxWidth: "700px" }}>
            {/* Logo */}
            <div
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "scale(1)" : "scale(0.92)",
                transition: "opacity 0.9s ease, transform 0.9s ease",
                marginBottom: "40px",
              }}
            >
              <img
                src="/aether-hero.png"
                alt="Aether"
                style={{
                  width: "clamp(200px, 40vw, 320px)",
                  height: "auto",
                  filter: "drop-shadow(0 0 60px rgba(0,212,255,0.3))",
                }}
              />
            </div>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(36px, 6vw, 64px)",
                fontWeight: 300,
                lineHeight: 1.15,
                color: "#E8F4FF",
                marginBottom: "20px",
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.9s ease 0.15s, transform 0.9s ease 0.15s",
              }}
            >
              Order from Chaos.
            </h1>
            <p
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "clamp(18px, 3vw, 26px)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "rgba(0,212,255,0.8)",
                marginBottom: "48px",
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.9s ease 0.25s, transform 0.9s ease 0.25s",
              }}
            >
              Local AI for the Modern Professional.
            </p>

            {/* CTA buttons */}
            <div
              style={{
                display: "flex",
                gap: "14px",
                justifyContent: "center",
                flexWrap: "wrap",
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 0.9s ease 0.35s, transform 0.9s ease 0.35s",
              }}
            >
              {/* Primary: Download */}
              <a
                href={MSI_URL}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "16px 36px",
                  borderRadius: "6px",
                  background: "linear-gradient(135deg, #007AFF 0%, #00D4FF 100%)",
                  color: "#fff",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  letterSpacing: "0.15em",
                  textDecoration: "none",
                  fontWeight: 500,
                  boxShadow: "0 0 40px rgba(0,122,255,0.35)",
                  transition: "box-shadow 300ms ease, transform 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 60px rgba(0,122,255,0.55)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 40px rgba(0,122,255,0.35)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1v8M3.5 6l3.5 3.5L10.5 6M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                GET AETHER — FREE
              </a>

              {/* Secondary: Buy license */}
              <a
                href={LEMON_CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "16px 36px",
                  borderRadius: "6px",
                  border: "1px solid rgba(0,212,255,0.3)",
                  background: "transparent",
                  color: "#00D4FF",
                  fontFamily: "var(--font-body)",
                  fontSize: "13px",
                  letterSpacing: "0.15em",
                  textDecoration: "none",
                  transition: "background 200ms ease, border-color 200ms ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(0,212,255,0.06)";
                  e.currentTarget.style.borderColor = "rgba(0,212,255,0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)";
                }}
              >
                ACTIVATE — $49
              </a>
            </div>

            {/* Sub-copy */}
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                color: "rgba(255,255,255,0.25)",
                marginTop: "20px",
                letterSpacing: "0.05em",
                opacity: heroVisible ? 1 : 0,
                transition: "opacity 0.9s ease 0.5s",
              }}
            >
              Windows 10/11 · Runs 100% locally · No cloud, no subscription · Requires Ollama
            </p>
          </div>

          {/* Scroll indicator */}
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2,
              opacity: 0.3,
              animation: "gentle-bounce 2.5s ease-in-out infinite",
            }}
          >
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
              <rect x="1" y="1" width="14" height="22" rx="7" stroke="currentColor" strokeWidth="1"/>
              <circle cx="8" cy="7" r="2" fill="currentColor"/>
            </svg>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────────────────────── */}
        <section style={{ padding: "80px 24px", maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.3em", color: "rgba(0,212,255,0.6)", marginBottom: "12px" }}>
              WHAT AETHER DOES
            </p>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300, color: "#E8F4FF" }}>
              Your files. Your AI. Your machine.
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            <FeatureCard
              icon="🗂"
              title="Intelligent File Sorting"
              body="Aether watches your folders and automatically renames, categorises, and organises files using local AI — no cloud required."
              delay={0}
            />
            <FeatureCard
              icon="🧠"
              title="RAG-Powered Summaries"
              body="The Architect Core indexes your project files into a local vector database and generates professional PDF overviews using Ollama."
              delay={100}
            />
            <FeatureCard
              icon="🔒"
              title="Fully Local & Private"
              body="Every inference runs on your machine via Ollama. Your documents never leave your device. No API keys, no subscriptions."
              delay={200}
            />
            <FeatureCard
              icon="⚡"
              title="Auto-Pilot & Co-Pilot"
              body="Let Aether rename files automatically, or review every suggestion yourself. You choose how much control to hand over."
              delay={300}
            />
            <FeatureCard
              icon="📄"
              title="PDF Generation"
              body="Convert documents, export data, and generate project summaries as polished PDFs — all from within the Architect menu."
              delay={400}
            />
            <FeatureCard
              icon="🛠"
              title="Built with Tauri + Rust"
              body="A native Windows desktop app with a sub-10MB footprint. Fast, secure, and built to last — not another Electron app."
              delay={500}
            />
          </div>
        </section>

        {/* ── Pricing ───────────────────────────────────────────────────────── */}
        <PricingSection />

        {/* ── Footer ────────────────────────────────────────────────────────── */}
        <footer style={{
          borderTop: "1px solid rgba(0,212,255,0.08)",
          padding: "40px 24px",
          textAlign: "center",
        }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "11px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>
            © {new Date().getFullYear()} Paper Hallway ·{" "}
            <a href="mailto:hello@paperhallway.com" style={{ color: "rgba(0,212,255,0.4)", textDecoration: "none" }}>
              hello@paperhallway.com
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}

/* — Pricing section — */
function PricingSection() {
  const [ref, visible] = useInView(0.1);
  return (
    <section
      ref={ref}
      style={{
        padding: "80px 24px",
        maxWidth: "800px",
        margin: "0 auto",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.3em", color: "rgba(0,212,255,0.6)", marginBottom: "12px" }}>
          PRICING
        </p>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 300, color: "#E8F4FF" }}>
          Simple. Honest. Permanent.
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        {/* Free tier */}
        <div style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "14px",
          padding: "32px 28px",
        }}>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.25em", color: "rgba(255,255,255,0.35)", marginBottom: "16px" }}>
            FREE
          </div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: "42px", color: "#E8F4FF", fontWeight: 300, marginBottom: "4px" }}>
            $0
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "28px" }}>
            forever
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
            {["File sorting & renaming", "Architect Menu (Summarize, Convert, Export)", "Smart Rename (Co-Pilot & Auto-Pilot)", "5 PDF Summary generations"].map(f => (
              <li key={f} style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(255,255,255,0.45)", padding: "6px 0", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", gap: "10px" }}>
                <span style={{ color: "rgba(0,212,255,0.5)" }}>✓</span> {f}
              </li>
            ))}
          </ul>
          <a
            href={MSI_URL}
            style={{
              display: "block",
              textAlign: "center",
              padding: "12px",
              borderRadius: "6px",
              border: "1px solid rgba(255,255,255,0.1)",
              background: "transparent",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textDecoration: "none",
              transition: "background 200ms ease",
            }}
            onMouseEnter={(e) => { e.target.style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={(e) => { e.target.style.background = "transparent"; }}
          >
            DOWNLOAD FREE
          </a>
        </div>

        {/* Activated tier */}
        <div style={{
          background: "rgba(0,122,255,0.06)",
          border: "1px solid rgba(0,212,255,0.25)",
          borderRadius: "14px",
          padding: "32px 28px",
          position: "relative",
          boxShadow: "0 0 60px rgba(0,122,255,0.1)",
        }}>
          <div style={{
            position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #007AFF, #00D4FF)",
            borderRadius: "20px",
            padding: "4px 14px",
            fontFamily: "var(--font-body)",
            fontSize: "9px",
            letterSpacing: "0.2em",
            color: "#fff",
          }}>
            RECOMMENDED
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "10px", letterSpacing: "0.25em", color: "rgba(0,212,255,0.6)", marginBottom: "16px" }}>
            ACTIVATED
          </div>
          <div style={{ fontFamily: "var(--font-heading)", fontSize: "42px", color: "#E8F4FF", fontWeight: 300, marginBottom: "4px" }}>
            $49
          </div>
          <div style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "28px" }}>
            one-time · lifetime license
          </div>
          <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px" }}>
            {["Everything in Free", "Unlimited PDF Summary generations", "Priority feature updates", "Direct support via email", "Lifetime license key"].map(f => (
              <li key={f} style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "rgba(255,255,255,0.6)", padding: "6px 0", borderBottom: "1px solid rgba(0,212,255,0.06)", display: "flex", gap: "10px" }}>
                <span style={{ color: "#00D4FF" }}>✓</span> {f}
              </li>
            ))}
          </ul>
          <a
            href={LEMON_CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "block",
              textAlign: "center",
              padding: "14px",
              borderRadius: "6px",
              border: "none",
              background: "linear-gradient(135deg, #007AFF 0%, #00D4FF 100%)",
              color: "#fff",
              fontFamily: "var(--font-body)",
              fontSize: "12px",
              letterSpacing: "0.1em",
              textDecoration: "none",
              fontWeight: 500,
              boxShadow: "0 0 30px rgba(0,122,255,0.3)",
              transition: "box-shadow 200ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 50px rgba(0,122,255,0.5)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 30px rgba(0,122,255,0.3)"; }}
          >
            ACTIVATE AETHER — $49
          </a>
        </div>
      </div>
    </section>
  );
}

/* — Aether-specific CSS variables injected into the page — */
function AetherStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Hanken+Grotesk:wght@300;400;500&display=swap');
      :root {
        --font-heading: 'Cormorant Garamond', 'Georgia', serif;
        --font-body: 'Hanken Grotesk', 'Helvetica Neue', sans-serif;
        --aether-bg: #050D1A;
      }
      *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
      html { scroll-behavior: smooth; -webkit-font-smoothing: antialiased; }
      body { background: #050D1A; overflow-x: hidden; }
      @keyframes gentle-bounce {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        50% { transform: translateX(-50%) translateY(6px); }
      }
      [id] { scroll-margin-top: 100px; }
    `}</style>
  );
}
