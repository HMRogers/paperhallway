import { useState, useEffect, useRef } from "react";

/*
  PAPER HALLWAY — "The Digital Storefront"
  
  Aesthetic: Ink on Paper. Pencil-thin borders. Tactile serif typography.
  The entire experience feels like walking through a beautifully 
  illustrated architectural space rendered in fine pen on cream stock.

  Live storefront — no waitlist, no early access. Products are available now.
*/

/* ---------- tiny helpers ---------- */
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

/* ====================================================================
   COMPONENTS
   ==================================================================== */

/* — Nav — */
function Nav({ onNavigate, currentView }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 w-full z-50 transition-all duration-700"
      style={{
        backdropFilter: scrolled ? "blur(16px)" : "none",
        background: scrolled ? "rgba(252,250,245,0.88)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(60,55,48,0.08)" : "1px solid transparent",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 flex items-center justify-between h-16 sm:h-20">
        {/* Logo mark */}
        <a
          href="#"
          className="flex items-center gap-3 group"
          onClick={(e) => { e.preventDefault(); onNavigate("hallway"); }}
        >
          <svg viewBox="0 0 28 36" className="w-5 h-7" fill="none" stroke="var(--ink)" strokeWidth="1">
            <rect x="1" y="1" width="26" height="34" rx="1.5" />
            <line x1="7" y1="8" x2="21" y2="8" strokeWidth="0.5" />
            <line x1="7" y1="12" x2="21" y2="12" strokeWidth="0.5" />
            <line x1="7" y1="16" x2="17" y2="16" strokeWidth="0.5" />
          </svg>
          <span
            className="tracking-widest text-xs uppercase"
            style={{ fontFamily: "var(--font-body)", color: "var(--ink)", letterSpacing: "0.25em" }}
          >
            Paper Hallway
          </span>
        </a>

        {/* Links */}
        <div className="hidden sm:flex items-center gap-10">
          {currentView === "hallway" ? (
            <>
              <a
                href="#office"
                className="relative text-xs uppercase tracking-widest transition-colors duration-300 group"
                style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("office")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Office
                <span
                  className="absolute -bottom-1 left-0 h-px bg-current transition-all duration-500 origin-left"
                  style={{ width: 0 }}
                  ref={(el) => {
                    if (!el) return;
                    el.parentElement.onmouseenter = () => (el.style.width = "100%");
                    el.parentElement.onmouseleave = () => (el.style.width = "0");
                  }}
                />
              </a>
              <a
                href="#arcade"
                className="relative text-xs uppercase tracking-widest transition-colors duration-300 group"
                style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("arcade")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Arcade
                <span
                  className="absolute -bottom-1 left-0 h-px bg-current transition-all duration-500 origin-left"
                  style={{ width: 0 }}
                  ref={(el) => {
                    if (!el) return;
                    el.parentElement.onmouseenter = () => (el.style.width = "100%");
                    el.parentElement.onmouseleave = () => (el.style.width = "0");
                  }}
                />
              </a>
            </>
          ) : (
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onNavigate("hallway"); }}
              className="relative text-xs uppercase tracking-widest transition-colors duration-300"
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}
            >
              &larr; Back to Hallway
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}

/* — Hero — */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 100); return () => clearTimeout(t); }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
      {/* Grid overlay — faint architectural lines */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.025 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={`v${i}`}
            className="absolute top-0 bottom-0"
            style={{
              left: `${(i + 1) * (100 / 13)}%`,
              width: "1px",
              background: "var(--ink)",
            }}
          />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={`h${i}`}
            className="absolute left-0 right-0"
            style={{
              top: `${(i + 1) * (100 / 9)}%`,
              height: "1px",
              background: "var(--ink)",
            }}
          />
        ))}
      </div>

      {/* Perspective corridor lines */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ opacity: loaded ? 0.06 : 0, transition: "opacity 2s ease 0.5s" }}
      >
        <line x1="0" y1="0" x2="600" y2="400" stroke="var(--ink)" strokeWidth="0.5" />
        <line x1="1200" y1="0" x2="600" y2="400" stroke="var(--ink)" strokeWidth="0.5" />
        <line x1="0" y1="800" x2="600" y2="400" stroke="var(--ink)" strokeWidth="0.5" />
        <line x1="1200" y1="800" x2="600" y2="400" stroke="var(--ink)" strokeWidth="0.5" />
        {[0.3, 0.5, 0.65, 0.78, 0.88].map((t, i) => {
          const cx = 600, cy = 400;
          const x1 = cx - (cx) * (1 - t), y1 = cy - (cy) * (1 - t);
          const x2 = cx + (600) * (1 - t), y2 = y1;
          const x3 = x1, y3 = cy + (400) * (1 - t);
          const x4 = x2, y4 = y3;
          return (
            <g key={i}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink)" strokeWidth="0.4" />
              <line x1={x3} y1={y3} x2={x4} y2={y4} stroke="var(--ink)" strokeWidth="0.4" />
              <line x1={x1} y1={y1} x2={x3} y2={y3} stroke="var(--ink)" strokeWidth="0.4" />
              <line x1={x2} y1={y2} x2={x4} y2={y4} stroke="var(--ink)" strokeWidth="0.4" />
            </g>
          );
        })}
      </svg>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-3xl">
        <div
          className="overflow-hidden mb-6"
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 1s ease 0.3s" }}
        >
          <p
            className="text-xs uppercase tracking-widest"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--ink-light)",
              letterSpacing: "0.35em",
              transform: loaded ? "translateY(0)" : "translateY(100%)",
              transition: "transform 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.4s",
            }}
          >
            A creative ecosystem
          </p>
        </div>

        <div className="overflow-hidden">
          <h1
            className="text-5xl sm:text-7xl md:text-8xl leading-none"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--ink)",
              fontWeight: 400,
              transform: loaded ? "translateY(0)" : "translateY(110%)",
              transition: "transform 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.5s",
            }}
          >
            Welcome to
          </h1>
        </div>
        <div className="overflow-hidden">
          <h1
            className="text-5xl sm:text-7xl md:text-8xl leading-none"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--ink)",
              fontWeight: 400,
              fontStyle: "italic",
              transform: loaded ? "translateY(0)" : "translateY(110%)",
              transition: "transform 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.6s",
            }}
          >
            the Hallway.
          </h1>
        </div>

        {/* Thin decorative line */}
        <div
          className="mx-auto mt-10 mb-8"
          style={{
            width: loaded ? "120px" : "0px",
            height: "1px",
            background: "var(--ink)",
            opacity: 0.2,
            transition: "width 1.4s cubic-bezier(0.22, 1, 0.36, 1) 1s",
          }}
        />

        <p
          className="text-base sm:text-lg max-w-md mx-auto leading-relaxed"
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--ink-light)",
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 1s ease 1.2s",
          }}
        >
          A boutique AI studio building privacy-first tools and autonomous services.
        </p>

        {/* Explore the Collection CTA */}
        <div
          className="mt-10"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 1s ease 1.4s",
          }}
        >
          <button
            onClick={() => document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" })}
            className="group inline-flex items-center gap-4 px-8 py-4 transition-all duration-500"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "11px",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              background: "var(--ink)",
              color: "var(--paper)",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            Explore the Collection
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1 L6 10 M3 7 L6 10 L9 7" stroke="var(--paper)" strokeWidth="0.9" fill="none" />
            </svg>
          </button>
        </div>

        {/* Scroll indicator */}
        <div
          className="mt-16"
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 1s ease 1.8s",
          }}
        >
          <div className="flex flex-col items-center gap-2">
            <span
              className="text-xs uppercase tracking-widest"
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.3em", fontSize: "10px" }}
            >
              Explore
            </span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="animate-gentle-bounce">
              <rect x="5.5" y="0.5" width="5" height="10" rx="2.5" stroke="var(--ink-faint)" strokeWidth="0.8" />
              <line x1="8" y1="3" x2="8" y2="5" stroke="var(--ink-faint)" strokeWidth="0.8" strokeLinecap="round" />
              <path d="M3 16 L8 21 L13 16" stroke="var(--ink-faint)" strokeWidth="0.8" fill="none" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

/* — Divider — */
function Divider() {
  const [ref, visible] = useInView();
  return (
    <div ref={ref} className="flex items-center justify-center py-8">
      <div
        className="transition-all duration-1000"
        style={{
          width: visible ? "200px" : "0px",
          height: "1px",
          background: "var(--ink)",
          opacity: 0.08,
        }}
      />
      <div
        className="mx-4 w-1 h-1 rounded-full transition-opacity duration-1000"
        style={{ background: "var(--ink)", opacity: visible ? 0.15 : 0 }}
      />
      <div
        className="transition-all duration-1000"
        style={{
          width: visible ? "200px" : "0px",
          height: "1px",
          background: "var(--ink)",
          opacity: 0.08,
        }}
      />
    </div>
  );
}

/* ====================================================================
   FEATURED APP SHOWCASE CARDS
   ==================================================================== */

function AetherShowcase({ onNavigate }) {
  const [ref, visible] = useInView(0.15);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      id="office"
      className="relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(60px)",
        transition: "all 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      <div
        className="relative overflow-hidden transition-all duration-600"
        style={{
          border: "1px solid var(--border)",
          background: "var(--paper)",
          boxShadow: hovered
            ? "0 20px 60px rgba(60,55,48,0.08), 0 1px 3px rgba(60,55,48,0.04)"
            : "0 1px 3px rgba(60,55,48,0.02)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Top strip */}
        <div
          className="px-6 sm:px-10 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span
            className="text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.3em", fontSize: "10px" }}
          >
            The Office
          </span>
          <span
            className="text-xs"
            style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.15em", fontSize: "10px", textTransform: "uppercase" }}
          >
            Windows
          </span>
        </div>

        {/* Main content */}
        <div className="px-6 sm:px-10 py-12 sm:py-16 flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          {/* Left: icon + text */}
          <div className="flex-1">
            {/* Icon */}
            <div className="mb-6" style={{ color: "var(--ink-light)" }}>
              <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="0.6">
                <polygon points="32,4 58,18 58,46 32,60 6,46 6,18" />
                <polygon points="32,14 48,22 48,38 32,46 16,38 16,22" />
                <circle cx="32" cy="32" r="4" />
              </svg>
            </div>

            <h2
              className="text-4xl sm:text-5xl mb-3"
              style={{ fontFamily: "var(--font-heading)", color: "var(--ink)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.1 }}
            >
              Aether
            </h2>

            <p
              className="text-sm sm:text-base mb-2 leading-relaxed"
              style={{ fontFamily: "var(--font-heading)", color: "var(--ink)", fontStyle: "italic" }}
            >
              Order from Chaos.
            </p>

            <p
              className="text-sm leading-relaxed mb-8"
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)", maxWidth: "420px" }}
            >
              Local AI for the Modern Professional. Aether reads, classifies, and organises your files &mdash; entirely on your machine. No cloud. No compromise. Privacy-first file intelligence powered by a local LLM.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <a
                href="https://buy.stripe.com/00w3coals7ns3i50cB8Vi00"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-3.5 transition-all duration-500 hover:shadow-lg"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  background: "var(--ink)",
                  color: "var(--paper)",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--paper)" strokeWidth="1.5">
                  <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                </svg>
                Buy Aether Pro
              </a>

              <a
                href="/download/Aether_0.1.0_x64-setup.exe"
                className="inline-flex items-center gap-3 px-8 py-3.5 transition-all duration-500"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  background: "transparent",
                  color: "var(--ink)",
                  border: "1px solid var(--border)",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--ink)"; e.currentTarget.style.background = "var(--paper-warm)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(60, 55, 48, 0.1)"; e.currentTarget.style.background = "transparent"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--ink)">
                  <path d="M0 3.5L10.1 4.9V14.7H0V3.5ZM11.1 4.7L24 2.9V14.7H11.1V4.7ZM0 15.8H10.1V25.6L0 24.2V15.8ZM11.1 15.8H24V26.8L11.1 25.3V15.8Z" />
                </svg>
                Download Free
              </a>
            </div>

            <p
              className="text-xs mt-4"
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.05em" }}
            >
              Free tier included &middot; Pro unlocks advanced features
            </p>
          </div>

          {/* Right: feature highlights */}
          <div className="flex-shrink-0 w-full lg:w-72">
            <p
              className="text-xs uppercase tracking-widest mb-6"
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.25em", fontSize: "10px" }}
            >
              Highlights
            </p>
            {[
              { label: "Local AI Engine", desc: "All processing on your machine via Ollama" },
              { label: "Smart File Sorting", desc: "Drop a folder, Aether organises everything" },
              { label: "Vector Memory", desc: "Search by meaning, not just keywords" },
              { label: "Privacy First", desc: "No cloud. No telemetry. No accounts" },
            ].map((item, i) => (
              <div key={i} className="mb-5 pb-5" style={{ borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
                <p
                  className="text-sm mb-1"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--ink)", fontWeight: 400, fontStyle: "italic" }}
                >
                  {item.label}
                </p>
                <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Learn more link */}
        <div
          className="px-6 sm:px-10 py-5 flex items-center justify-between"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <button
            onClick={() => onNavigate("aether")}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest transition-colors duration-300"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--ink-light)",
              letterSpacing: "0.2em",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "11px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-light)")}
          >
            Learn more about Aether
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 5 L8 5 M5.5 2.5 L8 5 L5.5 7.5" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function SwissFlowShowcase() {
  const [ref, visible] = useInView(0.15);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      id="arcade"
      className="relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(60px)",
        transition: "all 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s",
      }}
    >
      <div
        className="relative overflow-hidden transition-all duration-600"
        style={{
          border: "1px solid var(--border)",
          background: "var(--paper)",
          boxShadow: hovered
            ? "0 20px 60px rgba(60,55,48,0.08), 0 1px 3px rgba(60,55,48,0.04)"
            : "0 1px 3px rgba(60,55,48,0.02)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Top strip */}
        <div
          className="px-6 sm:px-10 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span
            className="text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.3em", fontSize: "10px" }}
          >
            Content Engine
          </span>
          <span
            className="text-xs"
            style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.15em", fontSize: "10px", textTransform: "uppercase" }}
          >
            AI Service
          </span>
        </div>

        {/* Main content */}
        <div className="px-6 sm:px-10 py-12 sm:py-16 flex flex-col lg:flex-row items-start gap-10 lg:gap-16">
          {/* Left: icon + text */}
          <div className="flex-1">
            {/* Icon */}
            <div className="mb-6" style={{ color: "var(--ink-light)" }}>
              <svg viewBox="0 0 64 64" className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth="0.6">
                <rect x="6" y="10" width="52" height="36" rx="2" />
                <line x1="6" y1="20" x2="58" y2="20" />
                <line x1="20" y1="10" x2="20" y2="46" />
                <line x1="26" y1="28" x2="50" y2="28" />
                <line x1="26" y1="34" x2="44" y2="34" />
                <line x1="26" y1="40" x2="38" y2="40" />
                <path d="M32 50 L32 56 M22 56 L42 56" />
              </svg>
            </div>

            <h2
              className="text-4xl sm:text-5xl mb-3"
              style={{ fontFamily: "var(--font-heading)", color: "var(--ink)", fontWeight: 400, fontStyle: "italic", lineHeight: 1.1 }}
            >
              SwissFlow
            </h2>

            <p
              className="text-sm sm:text-base mb-2 leading-relaxed"
              style={{ fontFamily: "var(--font-heading)", color: "var(--ink)", fontStyle: "italic" }}
            >
              The Executive Content Engine.
            </p>

            <p
              className="text-sm leading-relaxed mb-8"
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)", maxWidth: "420px" }}
            >
              Turn one raw video into a month of premium text assets.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <a
                href="/portal"
                className="inline-flex items-center gap-3 px-8 py-3.5 transition-all duration-500 hover:shadow-lg"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  background: "var(--ink)",
                  color: "var(--paper)",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1 L11 6 L6 11 M1 6 L11 6" stroke="var(--paper)" strokeWidth="0.9" fill="none" />
                </svg>
                Enter Portal
              </a>
            </div>
          </div>

          {/* Right: feature highlights */}
          <div className="flex-shrink-0 w-full lg:w-72">
            <p
              className="text-xs uppercase tracking-widest mb-6"
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.25em", fontSize: "10px" }}
            >
              Highlights
            </p>
            {[
              { label: "One Video, Thirty Days", desc: "A single raw recording becomes a full month of content" },
              { label: "Premium Text Assets", desc: "Articles, threads, newsletters, and scripts — all on-brand" },
              { label: "Executive-Grade Output", desc: "Polished, authoritative copy ready to publish" },
              { label: "Autonomous Pipeline", desc: "AI-driven workflow with minimal manual input required" },
            ].map((item, i) => (
              <div key={i} className="mb-5 pb-5" style={{ borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
                <p
                  className="text-sm mb-1"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--ink)", fontWeight: 400, fontStyle: "italic" }}
                >
                  {item.label}
                </p>
                <p className="text-xs leading-relaxed" style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="px-6 sm:px-10 py-5"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <span
            className="text-xs"
            style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.1em" }}
          >
            Autonomous &middot; Privacy-first &middot; Built for executives
          </span>
        </div>
      </div>
    </div>
  );
}

/* — Collection Section — */
function CollectionSection({ onNavigate }) {
  const [ref, visible] = useInView(0.1);

  return (
    <section id="collection" ref={ref} className="relative px-6 sm:px-10 py-24 sm:py-36">
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <div
          className="flex items-center gap-6 mb-16 sm:mb-24"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s ease",
          }}
        >
          <div style={{ width: "40px", height: "1px", background: "var(--ink)", opacity: 0.2 }} />
          <span
            className="text-xs uppercase tracking-widest"
            style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.3em", fontSize: "10px" }}
          >
            The Collection
          </span>
        </div>

        {/* App showcase cards */}
        <div className="flex flex-col gap-10 sm:gap-14">
          <AetherShowcase onNavigate={onNavigate} />
          <SwissFlowShowcase />
        </div>
      </div>
    </section>
  );
}

/* — Footer — */
function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      setErrorMsg("Please enter a valid email.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  return (
    <footer className="relative px-6 sm:px-10 py-16 sm:py-24">
      <div className="max-w-5xl mx-auto">
        {/* Decorative element */}
        <div className="text-center mb-12">
          <svg viewBox="0 0 80 80" className="w-10 h-10 mx-auto mb-6" fill="none" stroke="var(--ink)" style={{ opacity: 0.15 }}>
            <rect x="15" y="5" width="50" height="70" rx="2" strokeWidth="0.8" />
            <rect x="25" y="25" width="12" height="20" rx="1" strokeWidth="0.6" />
            <rect x="43" y="25" width="12" height="20" rx="1" strokeWidth="0.6" />
            <circle cx="40" cy="60" r="2" strokeWidth="0.6" />
          </svg>
          <p
            className="text-sm leading-relaxed"
            style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)", maxWidth: "400px", margin: "0 auto" }}
          >
            Questions, feedback, or just want to say hello? We&rsquo;d love to hear from you.
          </p>
          <a
            href="mailto:hello@paperhallway.com"
            className="inline-block mt-4 text-xs uppercase tracking-widest transition-colors duration-300"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--ink-light)",
              letterSpacing: "0.2em",
              textDecoration: "none",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "2px",
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = "var(--ink)"; e.target.style.color = "var(--ink)"; }}
            onMouseLeave={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.color = "var(--ink-light)"; }}
          >
            hello@paperhallway.com
          </a>
        </div>

        {/* ── Join the Hallway — Email Capture ── */}
        <div
          className="text-center py-12 my-8"
          style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
        >
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.3em", fontSize: "10px" }}
          >
            Stay in the loop
          </p>
          <h3
            className="text-2xl sm:text-3xl mb-3"
            style={{ fontFamily: "var(--font-heading)", color: "var(--ink)", fontWeight: 400, fontStyle: "italic" }}
          >
            Join the Hallway
          </h3>
          <p
            className="text-sm mb-8 leading-relaxed"
            style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)", maxWidth: "380px", margin: "0 auto 2rem" }}
          >
            New releases, updates, and the occasional letter &mdash; delivered with care.
          </p>

          {status === "success" ? (
            <div
              className="inline-flex items-center gap-2"
              style={{ opacity: 1, transition: "opacity 0.5s ease" }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="var(--ink)" strokeWidth="0.8" />
                <path d="M5 8 L7 10 L11 6" stroke="var(--ink)" strokeWidth="0.8" fill="none" />
              </svg>
              <span
                className="text-sm"
                style={{ fontFamily: "var(--font-heading)", color: "var(--ink)", fontStyle: "italic" }}
              >
                Welcome to the hallway.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <div className="relative flex-1 w-full">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (status === "error") setStatus("idle"); }}
                  placeholder="your@email.com"
                  className="w-full text-sm py-3 px-4 outline-none transition-all duration-300"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--ink)",
                    background: "transparent",
                    border: "1px solid var(--border)",
                    borderRadius: "0",
                    letterSpacing: "0.03em",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--ink-light)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
                  disabled={status === "loading"}
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="text-xs uppercase tracking-widest py-3 px-6 transition-all duration-300"
                style={{
                  fontFamily: "var(--font-body)",
                  color: status === "loading" ? "var(--ink-faint)" : "var(--paper)",
                  background: status === "loading" ? "var(--border)" : "var(--ink)",
                  border: "1px solid var(--ink)",
                  letterSpacing: "0.2em",
                  cursor: status === "loading" ? "wait" : "pointer",
                  borderRadius: "0",
                  whiteSpace: "nowrap",
                  fontSize: "11px",
                }}
                onMouseEnter={(e) => { if (status !== "loading") { e.target.style.background = "transparent"; e.target.style.color = "var(--ink)"; } }}
                onMouseLeave={(e) => { if (status !== "loading") { e.target.style.background = "var(--ink)"; e.target.style.color = "var(--paper)"; } }}
              >
                {status === "loading" ? "Sending..." : "Subscribe"}
              </button>
            </form>
          )}

          {status === "error" && (
            <p
              className="text-xs mt-3"
              style={{ fontFamily: "var(--font-body)", color: "#C4736E" }}
            >
              {errorMsg}
            </p>
          )}
        </div>

        {/* Privacy link */}
        <div className="text-center mt-8 mb-6">
          <a
            href="/privacy"
            className="text-xs uppercase tracking-widest transition-colors duration-300"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--ink-faint)",
              letterSpacing: "0.15em",
              textDecoration: "none",
              borderBottom: "1px solid transparent",
              paddingBottom: "1px",
            }}
            onMouseEnter={(e) => { e.target.style.borderColor = "var(--ink-faint)"; e.target.style.color = "var(--ink-light)"; }}
            onMouseLeave={(e) => { e.target.style.borderColor = "transparent"; e.target.style.color = "var(--ink-faint)"; }}
          >
            Privacy Policy
          </a>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <span className="text-xs" style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.1em" }}>
            &copy; {new Date().getFullYear()} Paper Hallway
          </span>
          <span className="text-xs" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-faint)", fontStyle: "italic" }}>
            paperhallway.com
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ====================================================================
   AETHER PRODUCT PAGE
   ==================================================================== */

const AETHER_FEATURES = [
  {
    title: "Local AI Engine",
    description: "All processing happens on your machine via Ollama. Your files never leave your device.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-10 h-10">
        <circle cx="24" cy="24" r="16" />
        <circle cx="24" cy="24" r="6" />
        <line x1="24" y1="8" x2="24" y2="12" />
        <line x1="24" y1="36" x2="24" y2="40" />
        <line x1="8" y1="24" x2="12" y2="24" />
        <line x1="36" y1="24" x2="40" y2="24" />
      </svg>
    ),
  },
  {
    title: "Smart File Sorting",
    description: "Drop a folder and Aether reads, classifies, and organises every file automatically.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-10 h-10">
        <rect x="6" y="8" width="14" height="14" rx="1" />
        <rect x="28" y="8" width="14" height="14" rx="1" />
        <rect x="6" y="28" width="14" height="14" rx="1" />
        <rect x="28" y="28" width="14" height="14" rx="1" />
        <path d="M20 15 L28 15" strokeDasharray="2 2" />
        <path d="M13 22 L13 28" strokeDasharray="2 2" />
      </svg>
    ),
  },
  {
    title: "Project Summaries",
    description: "Generate professional PDF summaries of any project folder with one click.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-10 h-10">
        <path d="M12 6 L30 6 L36 12 L36 42 L12 42 Z" />
        <path d="M30 6 L30 12 L36 12" />
        <line x1="18" y1="20" x2="30" y2="20" />
        <line x1="18" y1="26" x2="30" y2="26" />
        <line x1="18" y1="32" x2="26" y2="32" />
      </svg>
    ),
  },
  {
    title: "Vector Memory",
    description: "Every file is embedded and indexed. Search by meaning, not just keywords.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-10 h-10">
        <circle cx="16" cy="16" r="6" />
        <circle cx="32" cy="16" r="6" />
        <circle cx="24" cy="34" r="6" />
        <line x1="20" y1="20" x2="22" y2="30" />
        <line x1="28" y1="20" x2="26" y2="30" />
        <line x1="22" y1="16" x2="26" y2="16" />
      </svg>
    ),
  },
  {
    title: "Architect Workspace",
    description: "A full project workspace with tabs for files, metadata, and AI-powered actions.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-10 h-10">
        <rect x="6" y="10" width="36" height="28" rx="2" />
        <line x1="6" y1="18" x2="42" y2="18" />
        <line x1="18" y1="18" x2="18" y2="38" />
        <circle cx="12" cy="14" r="1.5" />
        <circle cx="17" cy="14" r="1.5" />
        <circle cx="22" cy="14" r="1.5" />
      </svg>
    ),
  },
  {
    title: "Privacy First",
    description: "No cloud. No telemetry. No accounts. Your data stays yours, always.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-10 h-10">
        <path d="M24 6 L38 14 L38 28 C38 36 30 42 24 44 C18 42 10 36 10 28 L10 14 Z" />
        <path d="M18 24 L22 28 L30 20" strokeWidth="1.2" />
      </svg>
    ),
  },
];

function AetherPage({ onBack }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const DOWNLOAD_URL = "/download/Aether_0.1.0_x64-setup.exe";

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        {/* Subtle radial grid */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.03 }}>
          <svg className="w-full h-full" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
            <circle cx="400" cy="400" r="100" fill="none" stroke="var(--ink)" strokeWidth="0.3" />
            <circle cx="400" cy="400" r="200" fill="none" stroke="var(--ink)" strokeWidth="0.3" />
            <circle cx="400" cy="400" r="300" fill="none" stroke="var(--ink)" strokeWidth="0.3" />
            <circle cx="400" cy="400" r="400" fill="none" stroke="var(--ink)" strokeWidth="0.3" />
            <line x1="400" y1="0" x2="400" y2="800" stroke="var(--ink)" strokeWidth="0.3" />
            <line x1="0" y1="400" x2="800" y2="400" stroke="var(--ink)" strokeWidth="0.3" />
          </svg>
        </div>

        <div className="relative z-10 text-center max-w-3xl">
          {/* Aether icon */}
          <div
            className="mx-auto mb-8"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s ease 0.2s",
            }}
          >
            <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto" fill="none" stroke="var(--ink)" strokeWidth="0.6">
              <polygon points="32,4 58,18 58,46 32,60 6,46 6,18" />
              <polygon points="32,14 48,22 48,38 32,46 16,38 16,22" />
              <circle cx="32" cy="32" r="4" />
            </svg>
          </div>

          {/* Breadcrumb */}
          <div
            className="overflow-hidden mb-6"
            style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.8s ease 0.3s" }}
          >
            <p
              className="text-xs uppercase tracking-widest"
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.3em" }}
            >
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); onBack(); }}
                className="transition-colors duration-300"
                style={{ color: "var(--ink-faint)", textDecoration: "none" }}
                onMouseEnter={(e) => (e.target.style.color = "var(--ink)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--ink-faint)")}
              >
                The Office
              </a>
              {" "}/ Aether
            </p>
          </div>

          {/* Title */}
          <div className="overflow-hidden">
            <h1
              className="text-6xl sm:text-8xl md:text-9xl leading-none"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--ink)",
                fontWeight: 400,
                fontStyle: "italic",
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(40px)",
                transition: "all 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.4s",
              }}
            >
              Aether
            </h1>
          </div>

          {/* Tagline */}
          <div
            className="mx-auto mt-8 mb-6"
            style={{
              width: loaded ? "80px" : "0px",
              height: "1px",
              background: "var(--ink)",
              opacity: 0.2,
              transition: "width 1.2s cubic-bezier(0.22, 1, 0.36, 1) 0.8s",
            }}
          />

          <p
            className="text-lg sm:text-xl leading-relaxed"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--ink)",
              fontWeight: 400,
              fontStyle: "italic",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s ease 0.9s",
            }}
          >
            Order from Chaos.
          </p>

          <p
            className="text-sm sm:text-base mt-3 leading-relaxed max-w-md mx-auto"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--ink-light)",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s ease 1.1s",
            }}
          >
            Local AI for the Modern Professional. Aether reads, classifies, and organises your files &mdash; entirely on your machine. No cloud. No compromise.
          </p>

          {/* CTA */}
          <div
            className="mt-12 flex flex-col items-center gap-6"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s ease 1.3s",
            }}
          >
            <a
              href="https://buy.stripe.com/00w3coals7ns3i50cB8Vi00"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 transition-all duration-500 hover:shadow-lg"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                background: "var(--ink)",
                color: "var(--paper)",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--paper)" strokeWidth="1.5">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
              Buy Aether Pro
            </a>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href={DOWNLOAD_URL}
                className="inline-flex items-center gap-3 px-8 py-3.5 transition-all duration-500"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  background: "transparent",
                  color: "var(--ink)",
                  border: "1px solid var(--border)",
                  textDecoration: "none",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--ink)"; e.currentTarget.style.background = "var(--paper-warm)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(60, 55, 48, 0.1)"; e.currentTarget.style.background = "transparent"; }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--ink)">
                  <path d="M0 3.5L10.1 4.9V14.7H0V3.5ZM11.1 4.7L24 2.9V14.7H11.1V4.7ZM0 15.8H10.1V25.6L0 24.2V15.8ZM11.1 15.8H24V26.8L11.1 25.3V15.8Z" />
                </svg>
                Download Free &mdash; Windows
              </a>
            </div>

            <p
              className="text-xs mt-1"
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.05em" }}
            >
              Free tier included &middot; Pro unlocks advanced features
            </p>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-12"
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 1s ease 1.8s" }}
        >
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="animate-gentle-bounce">
            <rect x="5.5" y="0.5" width="5" height="10" rx="2.5" stroke="var(--ink-faint)" strokeWidth="0.8" />
            <line x1="8" y1="3" x2="8" y2="5" stroke="var(--ink-faint)" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M3 16 L8 21 L13 16" stroke="var(--ink-faint)" strokeWidth="0.8" fill="none" />
          </svg>
        </div>
      </section>

      {/* What Aether Does */}
      <section className="px-6 sm:px-10 py-24 sm:py-36">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-6 mb-16">
            <div style={{ width: "40px", height: "1px", background: "var(--ink)", opacity: 0.2 }} />
            <span
              className="text-xs uppercase tracking-widest"
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.3em", fontSize: "10px" }}
            >
              What it does
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {AETHER_FEATURES.map((feature, i) => (
              <AetherFeatureCard key={i} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 sm:px-10 py-24 sm:py-36" style={{ background: "var(--paper-warm)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-6 mb-16">
            <div style={{ width: "40px", height: "1px", background: "var(--ink)", opacity: 0.2 }} />
            <span
              className="text-xs uppercase tracking-widest"
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.3em", fontSize: "10px" }}
            >
              How it works
            </span>
            <div style={{ width: "40px", height: "1px", background: "var(--ink)", opacity: 0.2 }} />
          </div>

          <div className="flex flex-col gap-16">
            {[
              { step: "01", title: "Drop a folder", desc: "Select any folder on your machine. Aether scans every file inside." },
              { step: "02", title: "AI reads & classifies", desc: "Using a local LLM, Aether extracts text, identifies file types, and builds a semantic index." },
              { step: "03", title: "Organise & summarise", desc: "Files are sorted, tagged, and ready. Generate a professional PDF summary with one click." },
            ].map((item) => (
              <div key={item.step}>
                <span
                  className="text-xs tracking-widest"
                  style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.3em", fontSize: "10px" }}
                >
                  Step {item.step}
                </span>
                <h3
                  className="text-2xl sm:text-3xl mt-3 mb-3"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--ink)", fontWeight: 400, fontStyle: "italic" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed max-w-md mx-auto"
                  style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 sm:px-10 py-24 sm:py-36">
        <div className="max-w-2xl mx-auto text-center">
          <svg viewBox="0 0 64 64" className="w-12 h-12 mx-auto mb-8" fill="none" stroke="var(--ink)" strokeWidth="0.6" style={{ opacity: 0.2 }}>
            <polygon points="32,4 58,18 58,46 32,60 6,46 6,18" />
            <polygon points="32,14 48,22 48,38 32,46 16,38 16,22" />
            <circle cx="32" cy="32" r="4" />
          </svg>

          <h2
            className="text-3xl sm:text-5xl mb-4"
            style={{ fontFamily: "var(--font-heading)", color: "var(--ink)", fontWeight: 400, lineHeight: 1.15 }}
          >
            Ready to bring order?
          </h2>

          <p
            className="text-sm sm:text-base mb-10 leading-relaxed"
            style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)", maxWidth: "400px", margin: "0 auto" }}
          >
            Unlock the full power of local AI file intelligence. Pro features include advanced sorting, batch processing, and priority support.
          </p>

          <div className="flex flex-col items-center gap-5">
            <a
              href="https://buy.stripe.com/00w3coals7ns3i50cB8Vi00"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-4 transition-all duration-500 hover:shadow-lg"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "12px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                background: "var(--ink)",
                color: "var(--paper)",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = "translateY(0)"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--paper)" strokeWidth="1.5">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
              Buy Aether Pro
            </a>

            <a
              href={DOWNLOAD_URL}
              className="inline-flex items-center gap-3 px-8 py-3.5 transition-all duration-500"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                background: "transparent",
                color: "var(--ink)",
                border: "1px solid var(--border)",
                textDecoration: "none",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--ink)"; e.currentTarget.style.background = "var(--paper-warm)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(60, 55, 48, 0.1)"; e.currentTarget.style.background = "transparent"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="1.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Free &mdash; Windows
            </a>

            <p
              className="text-xs"
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.05em" }}
            >
              Free tier included &middot; Pro unlocks advanced features
            </p>
          </div>

          {/* Back to hallway */}
          <div className="mt-16 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onBack(); }}
              className="inline-flex items-center gap-3 text-xs uppercase tracking-widest transition-colors duration-300"
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)", textDecoration: "none", letterSpacing: "0.2em" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-light)")}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M10 6 L2 6 M5 3 L2 6 L5 9" stroke="currentColor" strokeWidth="0.8" />
              </svg>
              Back to the Hallway
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div
        className="px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <span className="text-xs" style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.1em" }}>
          &copy; {new Date().getFullYear()} Paper Hallway
        </span>
        <span className="text-xs" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-faint)", fontStyle: "italic" }}>
          paperhallway.com
        </span>
      </div>
    </div>
  );
}

function AetherFeatureCard({ feature, index }) {
  const [ref, visible] = useInView(0.2);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className="relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.1}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="p-6 sm:p-8 transition-all duration-500"
        style={{
          border: "1px solid var(--border)",
          background: hovered ? "var(--paper-warm)" : "var(--paper)",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hovered ? "0 12px 40px rgba(60,55,48,0.06)" : "none",
        }}
      >
        <div className="mb-6" style={{ color: "var(--ink-light)" }}>
          {feature.icon}
        </div>
        <h3
          className="text-lg mb-3"
          style={{ fontFamily: "var(--font-heading)", color: "var(--ink)", fontWeight: 400 }}
        >
          {feature.title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}
        >
          {feature.description}
        </p>
      </div>
    </div>
  );
}

   MAIN APP
   ==================================================================== */
export default function PaperHallway() {
  const [currentView, setCurrentView] = useState("hallway");

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Hanken+Grotesk:wght@300;400;500&display=swap');

        :root {
          --font-heading: 'Cormorant Garamond', 'Georgia', serif;
          --font-body: 'Hanken Grotesk', 'Helvetica Neue', sans-serif;
          --paper: #FCFAF5;
          --paper-warm: #F8F5ED;
          --ink: #3C3730;
          --ink-light: #8A8279;
          --ink-faint: #B8B0A6;
          --border: rgba(60, 55, 48, 0.1);
        }

        *, *::before, *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          -webkit-font-smoothing: antialiased;
        }

        body {
          background: var(--paper);
          overflow-x: hidden;
        }

        ::selection {
          background: rgba(60, 55, 48, 0.12);
        }

        input::placeholder {
          color: var(--ink-faint);
          font-family: var(--font-body);
        }

        /* Subtle paper texture overlay */
        .paper-texture::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          opacity: 0.015;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          z-index: 9999;
        }

        @keyframes gentle-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
        .animate-gentle-bounce {
          animation: gentle-bounce 2.5s ease-in-out infinite;
        }

        /* Smooth scroll anchoring offset for fixed nav */
        [id] {
          scroll-margin-top: 100px;
        }
      `}</style>

      <div className="paper-texture" style={{ background: "var(--paper)", minHeight: "100vh" }}>
        <Nav onNavigate={handleNavigate} currentView={currentView} />

        {currentView === "hallway" && (
          <>
            <Hero />
            <Divider />
            <CollectionSection onNavigate={handleNavigate} />
            <Divider />
            <Footer />
          </>
        )}

        {currentView === "aether" && (
          <AetherPage onBack={() => handleNavigate("hallway")} />
        )}

      </div>
    </>
  );
}
