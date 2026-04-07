import { useState, useEffect, useRef } from "react";

/*
  PAPER HALLWAY — "The Digital Corridor"
  
  Aesthetic: Ink on Paper. Pencil-thin borders. Tactile serif typography.
  The entire experience feels like walking through a beautifully 
  illustrated architectural space rendered in fine pen on cream stock.
*/

const DOORS = [
  {
    id: "arcade",
    title: "The Arcade",
    subtitle: "Games",
    number: "01",
    description: "Indie games crafted with care. Worlds to explore, puzzles to solve, stories to live.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-12 h-12">
        <rect x="8" y="14" width="32" height="22" rx="3" />
        <circle cx="18" cy="25" r="4" />
        <line x1="18" y1="21" x2="18" y2="29" />
        <line x1="14" y1="25" x2="22" y2="25" />
        <circle cx="32" cy="23" r="1.5" />
        <circle cx="36" cy="27" r="1.5" />
        <circle cx="28" cy="27" r="1.5" />
      </svg>
    ),
    products: [
      { id: "dothunter", name: "Dot Hunter", tagline: "Reflex Arcade Game" },
    ],
  },
  {
    id: "study",
    title: "The Study",
    subtitle: "Learning",
    number: "02",
    description: "Tools for the curious mind. Learn at your own pace, in your own way.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-12 h-12">
        <path d="M12 8 L24 4 L36 8 L36 36 L24 32 L12 36 Z" />
        <line x1="24" y1="4" x2="24" y2="32" />
        <line x1="16" y1="14" x2="21" y2="12.5" />
        <line x1="16" y1="18" x2="21" y2="16.5" />
        <line x1="16" y1="22" x2="21" y2="20.5" />
        <line x1="27" y1="12.5" x2="32" y2="14" />
        <line x1="27" y1="16.5" x2="32" y2="18" />
      </svg>
    ),
  },
  {
    id: "office",
    title: "The Office",
    subtitle: "Organization",
    number: "03",
    description: "Elegant apps to bring order to creative chaos. Plan, track, and ship.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-12 h-12">
        <rect x="10" y="6" width="28" height="36" rx="1" />
        <line x1="16" y1="14" x2="32" y2="14" />
        <line x1="16" y1="20" x2="32" y2="20" />
        <line x1="16" y1="26" x2="28" y2="26" />
        <rect x="16" y="31" width="5" height="5" rx="0.5" />
        <path d="M17.5 33.5 L19 35 L22 32" strokeWidth="0.6" />
      </svg>
    ),
    products: [
      { id: "aether", name: "Aether", tagline: "AI File Intelligence" },
    ],
  },
];

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
            ["Arcade", "Study", "Office"].map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                className="relative text-xs uppercase tracking-widest transition-colors duration-300 group"
                style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}
              >
                {l}
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
            ))
          ) : (
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onNavigate("hallway"); }}
              className="relative text-xs uppercase tracking-widest transition-colors duration-300"
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}
            >
              ← Back to Hallway
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
              transition: "transform 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0.65s",
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
          Indie games, learning tools, and organization apps — all under one roof.
        </p>

        {/* Request Access CTA */}
        <div
          className="mt-10"
          style={{
            opacity: loaded ? 1 : 0,
            transform: loaded ? "translateY(0)" : "translateY(20px)",
            transition: "all 1s ease 1.4s",
          }}
        >
          <button
            onClick={() => document.getElementById("request-access").scrollIntoView({ behavior: "smooth" })}
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
            Request Early Access
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

/* — Door Card — */
function DoorCard({ door, index, onProductClick }) {
  const [ref, visible] = useInView(0.2);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      id={door.id}
      className="group relative"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(60px)",
        transition: `all 0.9s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.15}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* The "door" */}
      <div
        className="relative cursor-pointer overflow-hidden"
        style={{
          border: "1px solid var(--border)",
          background: "var(--paper)",
          transition: "all 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
          boxShadow: hovered
            ? "0 20px 60px rgba(60,55,48,0.08), 0 1px 3px rgba(60,55,48,0.04)"
            : "0 1px 3px rgba(60,55,48,0.02)",
          transform: hovered ? "translateY(-8px)" : "translateY(0)",
        }}
      >
        {/* Top strip — room number */}
        <div
          className="px-6 sm:px-8 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <span
            className="text-xs tracking-widest uppercase"
            style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.3em", fontSize: "10px" }}
          >
            Room
          </span>
          <span
            className="text-xs"
            style={{ fontFamily: "var(--font-heading)", color: "var(--ink-light)", fontStyle: "italic" }}
          >
            {door.number}
          </span>
        </div>

        {/* Main content area */}
        <div className="px-6 sm:px-8 pt-10 pb-8 sm:pt-14 sm:pb-12">
          {/* Icon */}
          <div
            className="mb-8 transition-transform duration-700"
            style={{
              color: "var(--ink-light)",
              transform: hovered ? "translateY(-4px)" : "translateY(0)",
            }}
          >
            {door.icon}
          </div>

          {/* Category label */}
          <p
            className="text-xs uppercase tracking-widest mb-3"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--ink-faint)",
              letterSpacing: "0.25em",
              fontSize: "10px",
            }}
          >
            {door.subtitle}
          </p>

          {/* Title */}
          <h2
            className="text-3xl sm:text-4xl mb-5"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--ink)",
              fontWeight: 400,
              lineHeight: 1.1,
            }}
          >
            {door.title}
          </h2>

          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-8"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--ink-light)",
              maxWidth: "280px",
            }}
          >
            {door.description}
          </p>

          {/* Product buttons (for Office) */}
          {door.products && door.products.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-6">
              {door.products.map((product) => (
                <button
                  key={product.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onProductClick(product.id);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 transition-all duration-400"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "11px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    background: "var(--ink)",
                    color: "var(--paper)",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  {product.name}
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1 5 L8 5 M5.5 2.5 L8 5 L5.5 7.5" stroke="var(--paper)" strokeWidth="0.8" />
                  </svg>
                </button>
              ))}
            </div>
          )}

          {/* Enter link — only show for Study as "Coming Soon" */}
          {door.id === "study" && (
            <div className="flex items-center gap-3">
              <span
                className="text-xs uppercase tracking-widest"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-faint)",
                  letterSpacing: "0.2em",
                  fontSize: "11px",
                }}
              >
                Coming Soon
              </span>
            </div>
          )}
        </div>

        {/* Door "handle" accent */}
        <div
          className="absolute right-6 sm:right-8 top-1/2 -translate-y-1/2 transition-opacity duration-500"
          style={{ opacity: hovered ? 1 : 0.15 }}
        >
          <div
            style={{
              width: "3px",
              height: "32px",
              borderRadius: "2px",
              background: "var(--ink)",
              opacity: 0.3,
            }}
          />
        </div>

        {/* Bottom thin accent line that extends on hover */}
        <div
          className="absolute bottom-0 left-0 h-px transition-all duration-700"
          style={{
            width: hovered ? "100%" : "0%",
            background: "var(--ink)",
            opacity: 0.15,
          }}
        />
      </div>
    </div>
  );
}

/* — Doors Section — */
function DoorsSection({ onProductClick }) {
  const [ref, visible] = useInView(0.1);

  return (
    <section ref={ref} className="relative px-6 sm:px-10 py-24 sm:py-36">
      <div className="max-w-7xl mx-auto">
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
            Choose a door
          </span>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {DOORS.map((door, i) => (
            <DoorCard key={door.id} door={door} index={i} onProductClick={onProductClick} />
          ))}
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

/* — Footer / Email Signup — */
function Footer() {
  const [ref, visible] = useInView(0.2);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);

  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <footer className="relative px-6 sm:px-10 py-24 sm:py-36">
      <div
        ref={ref}
        className="max-w-2xl mx-auto text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(40px)",
          transition: "all 1s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Decorative element */}
        <svg viewBox="0 0 80 80" className="w-12 h-12 mx-auto mb-8" fill="none" stroke="var(--ink)" style={{ opacity: 0.15 }}>
          <rect x="15" y="5" width="50" height="70" rx="2" strokeWidth="0.8" />
          <rect x="25" y="25" width="12" height="20" rx="1" strokeWidth="0.6" />
          <rect x="43" y="25" width="12" height="20" rx="1" strokeWidth="0.6" />
          <circle cx="40" cy="60" r="2" strokeWidth="0.6" />
        </svg>

        <p
          id="request-access"
          className="text-xs uppercase tracking-widest mb-4"
          style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.3em", fontSize: "10px" }}
        >
          Get early access
        </p>

        <h2
          className="text-3xl sm:text-5xl mb-4"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--ink)",
            fontWeight: 400,
            lineHeight: 1.15,
          }}
        >
          Step inside.
        </h2>

        <p
          className="text-sm sm:text-base mb-12 leading-relaxed"
          style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)", maxWidth: "400px", margin: "0 auto" }}
        >
          Be the first to explore when the doors open. Join the early access list.
        </p>

        {!submitted ? (
          <>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-5 py-3.5 text-sm outline-none transition-all duration-500"
                  style={{
                    fontFamily: "var(--font-body)",
                    color: "var(--ink)",
                    background: "transparent",
                    border: `1px solid ${focused ? "var(--ink)" : "var(--border)"}`,
                    letterSpacing: "0.02em",
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="px-8 py-3.5 text-xs uppercase tracking-widest transition-all duration-500 hover:shadow-lg"
                style={{
                  fontFamily: "var(--font-body)",
                  background: "var(--ink)",
                  color: "var(--paper)",
                  border: "none",
                  letterSpacing: "0.2em",
                  cursor: sending ? "wait" : "pointer",
                  fontSize: "11px",
                  opacity: sending ? 0.6 : 1,
                }}
                onMouseEnter={(e) => { if (!sending) e.target.style.opacity = "0.85"; }}
                onMouseLeave={(e) => { if (!sending) e.target.style.opacity = "1"; }}
              >
                {sending ? "Sending..." : "Request Access"}
              </button>
            </form>
            {error && (
              <p className="mt-3 text-xs" style={{ fontFamily: "var(--font-body)", color: "#c0392b" }}>
                {error}
              </p>
            )}
          </>
        ) : (
          <div
            className="py-4"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--ink-light)",
              fontSize: "14px",
            }}
          >
            <p style={{ fontFamily: "var(--font-heading)", fontStyle: "italic", fontSize: "18px", color: "var(--ink)" }}>
              Thank you.
            </p>
            <p className="mt-2" style={{ fontSize: "13px" }}>We'll be in touch at {email}</p>
          </div>
        )}

        {/* Contact */}
        <p className="mt-8 text-xs" style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)" }}>
          Or write to us at{" "}
          <a
            href="mailto:hello@paperhallway.com"
            className="transition-colors duration-300"
            style={{ color: "var(--ink-light)", borderBottom: "1px solid var(--border)" }}
            onMouseEnter={(e) => (e.target.style.borderColor = "var(--ink)")}
            onMouseLeave={(e) => (e.target.style.borderColor = "var(--border)")}
          >
            hello@paperhallway.com
          </a>
        </p>
      </div>

      {/* Bottom bar */}
      <div
        className="max-w-7xl mx-auto mt-24 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        <span className="text-xs" style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.1em" }}>
          &copy; {new Date().getFullYear()} Paper Hallway
        </span>
        <span className="text-xs" style={{ fontFamily: "var(--font-heading)", color: "var(--ink-faint)", fontStyle: "italic" }}>
          paperhallway.com
        </span>
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

  const DOWNLOAD_URL = "https://github.com/HMRogers/aether-alpha/releases/latest/download/Aether_Setup.msi";

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
            style={{
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.8s ease 0.3s",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--ink-faint)",
                letterSpacing: "0.3em",
              }}
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
            Local AI for the Modern Professional. Aether reads, classifies, and organises your files — entirely on your machine. No cloud. No compromise.
          </p>

          {/* CTA */}
          <div
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s ease 1.3s",
            }}
          >
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div
                className="inline-flex items-center gap-3 px-8 py-3.5"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  background: "var(--ink)",
                  color: "var(--paper)",
                  opacity: 0.5,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--paper)">
                  <path d="M0 3.5L10.1 4.9V14.7H0V3.5ZM11.1 4.7L24 2.9V14.7H11.1V4.7ZM0 15.8H10.1V25.6L0 24.2V15.8ZM11.1 15.8H24V26.8L11.1 25.3V15.8Z" />
                </svg>
                Windows — Coming Soon
              </div>
              <div
                className="inline-flex items-center gap-3 px-8 py-3.5"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  background: "var(--ink)",
                  color: "var(--paper)",
                  opacity: 0.5,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--paper)">
                  <path d="M18.7 19.4C17.9 20.4 17 21.5 15.8 21.5C14.6 21.5 14.2 20.8 12.8 20.8C11.4 20.8 10.9 21.5 9.8 21.6C8.6 21.6 7.7 20.4 6.8 19.4C5 17.2 3.6 13.2 5.5 10.5C6.4 9.1 7.9 8.3 9.5 8.2C10.6 8.2 11.7 9 12.4 9C13.1 9 14.5 8.1 15.8 8.2C16.4 8.2 18.1 8.4 19.2 10C19.1 10.1 16.8 11.4 16.8 14.2C16.8 17.4 19.7 18.5 19.7 18.5L18.7 19.4ZM15.1 6.5C15.8 5.6 16.3 4.4 16.1 3.2C15.1 3.3 13.9 3.9 13.1 4.8C12.4 5.6 11.8 6.8 12 7.9C13.1 8 14.3 7.4 15.1 6.5Z" />
                </svg>
                macOS — Coming Soon
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-12"
          style={{
            opacity: loaded ? 1 : 0,
            transition: "opacity 1s ease 1.8s",
          }}
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
            Aether is coming soon for Windows and macOS. Stay tuned.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div
              className="inline-flex items-center gap-3 px-8 py-3.5"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                background: "var(--ink)",
                color: "var(--paper)",
                opacity: 0.5,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--paper)">
                <path d="M0 3.5L10.1 4.9V14.7H0V3.5ZM11.1 4.7L24 2.9V14.7H11.1V4.7ZM0 15.8H10.1V25.6L0 24.2V15.8ZM11.1 15.8H24V26.8L11.1 25.3V15.8Z" />
              </svg>
              Windows — Coming Soon
            </div>
            <div
              className="inline-flex items-center gap-3 px-8 py-3.5"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                background: "var(--ink)",
                color: "var(--paper)",
                opacity: 0.5,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--paper)">
                <path d="M18.7 19.4C17.9 20.4 17 21.5 15.8 21.5C14.6 21.5 14.2 20.8 12.8 20.8C11.4 20.8 10.9 21.5 9.8 21.6C8.6 21.6 7.7 20.4 6.8 19.4C5 17.2 3.6 13.2 5.5 10.5C6.4 9.1 7.9 8.3 9.5 8.2C10.6 8.2 11.7 9 12.4 9C13.1 9 14.5 8.1 15.8 8.2C16.4 8.2 18.1 8.4 19.2 10C19.1 10.1 16.8 11.4 16.8 14.2C16.8 17.4 19.7 18.5 19.7 18.5L18.7 19.4ZM15.1 6.5C15.8 5.6 16.3 4.4 16.1 3.2C15.1 3.3 13.9 3.9 13.1 4.8C12.4 5.6 11.8 6.8 12 7.9C13.1 8 14.3 7.4 15.1 6.5Z" />
              </svg>
              macOS — Coming Soon
            </div>
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

/* ====================================================================
   DOT HUNTER PRODUCT PAGE
   ==================================================================== */

const DOTHUNTER_FEATURES = [
  {
    title: "Lightning Reflexes",
    description: "Tap glowing dots before they vanish. Every millisecond counts in the hunt for a perfect score.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-10 h-10">
        <circle cx="24" cy="24" r="16" />
        <circle cx="24" cy="24" r="4" fill="currentColor" />
        <line x1="24" y1="4" x2="24" y2="10" />
        <line x1="24" y1="38" x2="24" y2="44" />
        <line x1="4" y1="24" x2="10" y2="24" />
        <line x1="38" y1="24" x2="44" y2="24" />
      </svg>
    ),
  },
  {
    title: "Progressive Difficulty",
    description: "Dots spawn faster, shrink smaller, and move unpredictably as you climb through the levels.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-10 h-10">
        <path d="M8 40 L16 28 L24 32 L32 16 L40 8" />
        <circle cx="16" cy="28" r="2" />
        <circle cx="24" cy="32" r="2" />
        <circle cx="32" cy="16" r="2" />
        <circle cx="40" cy="8" r="2" />
      </svg>
    ),
  },
  {
    title: "Achievements & Streaks",
    description: "Unlock badges, maintain hit streaks, and track your personal bests across sessions.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-10 h-10">
        <path d="M24 4 L28 16 L40 16 L30 24 L34 36 L24 28 L14 36 L18 24 L8 16 L20 16 Z" />
      </svg>
    ),
  },
  {
    title: "Multiple Game Modes",
    description: "Classic, Timed, Zen, and Hardcore modes — each with its own rules and leaderboard.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-10 h-10">
        <rect x="6" y="6" width="16" height="16" rx="2" />
        <rect x="26" y="6" width="16" height="16" rx="2" />
        <rect x="6" y="26" width="16" height="16" rx="2" />
        <rect x="26" y="26" width="16" height="16" rx="2" />
      </svg>
    ),
  },
  {
    title: "Minimalist Design",
    description: "Clean visuals, smooth animations, and zero clutter. Just you and the dots.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-10 h-10">
        <circle cx="24" cy="24" r="20" />
        <circle cx="24" cy="24" r="2" />
      </svg>
    ),
  },
  {
    title: "Play Anywhere",
    description: "Available on Android via Google Play. Quick sessions that fit into any moment of your day.",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-10 h-10">
        <rect x="14" y="4" width="20" height="40" rx="3" />
        <line x1="14" y1="10" x2="34" y2="10" />
        <line x1="14" y1="36" x2="34" y2="36" />
        <circle cx="24" cy="40" r="1.5" />
      </svg>
    ),
  },
];

function DotHunterPage({ onBack }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.paperhallway.dothunter&hl=en";
  const SITE_URL = "https://dothuntergame.app/";

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        {/* Dot pattern background */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.04 }}>
          <svg className="w-full h-full" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid slice">
            {[120, 200, 340, 450, 560, 680].map((x, i) =>
              [100, 220, 380, 500, 650, 750].map((y, j) => (
                <circle key={`${i}-${j}`} cx={x} cy={y} r={((i + j) % 3) + 2} fill="var(--ink)" />
              ))
            )}
          </svg>
        </div>

        <div className="relative z-10 text-center max-w-3xl">
          {/* Dot Hunter icon */}
          <div
            className="mx-auto mb-8"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s ease 0.2s",
            }}
          >
            <svg viewBox="0 0 64 64" className="w-16 h-16 mx-auto" fill="none" stroke="var(--ink)" strokeWidth="0.6">
              <circle cx="32" cy="32" r="28" />
              <circle cx="32" cy="32" r="18" />
              <circle cx="32" cy="32" r="8" />
              <circle cx="32" cy="32" r="3" fill="var(--ink)" />
            </svg>
          </div>

          {/* Breadcrumb */}
          <div
            className="overflow-hidden mb-6"
            style={{
              opacity: loaded ? 1 : 0,
              transition: "opacity 0.8s ease 0.3s",
            }}
          >
            <p
              className="text-xs uppercase tracking-widest"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--ink-faint)",
                letterSpacing: "0.3em",
              }}
            >
              <a
                href="#"
                onClick={(e) => { e.preventDefault(); onBack(); }}
                className="transition-colors duration-300"
                style={{ color: "var(--ink-faint)", textDecoration: "none" }}
                onMouseEnter={(e) => (e.target.style.color = "var(--ink)")}
                onMouseLeave={(e) => (e.target.style.color = "var(--ink-faint)")}
              >
                The Arcade
              </a>
              {" "}/ Dot Hunter
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
              Dot Hunter
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
            Hunt the dot. Beat the clock.
          </p>

          <p
            className="text-sm sm:text-base leading-relaxed mt-4 max-w-lg mx-auto"
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--ink-light)",
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s ease 1s",
            }}
          >
            A minimalist reflex game where precision meets speed. Tap glowing dots before they disappear, climb the ranks, and prove your reflexes.
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
            style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(20px)",
              transition: "all 1s ease 1.1s",
            }}
          >
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 transition-all duration-500"
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
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--paper)">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
              </svg>
              Test Now
            </a>

            <a
              href={SITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 transition-all duration-500"
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
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--ink)";
                e.currentTarget.style.background = "var(--paper-warm)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(60, 55, 48, 0.1)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Visit Site
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1 9 L9 1 M4 1 L9 1 L9 6" stroke="var(--ink)" strokeWidth="0.8" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 sm:px-10 py-24 sm:py-36">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 sm:mb-24">
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.3em", fontSize: "10px" }}
            >
              Features
            </p>
            <h2
              className="text-3xl sm:text-5xl"
              style={{ fontFamily: "var(--font-heading)", color: "var(--ink)", fontWeight: 400, fontStyle: "italic" }}
            >
              Simple. Addictive. Precise.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {DOTHUNTER_FEATURES.map((feature, i) => (
              <AetherFeatureCard key={i} feature={feature} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 sm:px-10 py-24 sm:py-36" style={{ background: "var(--paper-warm)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 sm:mb-24">
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)", letterSpacing: "0.3em", fontSize: "10px" }}
            >
              How it works
            </p>
            <h2
              className="text-3xl sm:text-5xl"
              style={{ fontFamily: "var(--font-heading)", color: "var(--ink)", fontWeight: 400, fontStyle: "italic" }}
            >
              Three steps to the hunt.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 sm:gap-16">
            {[
              { step: "01", title: "Download", desc: "Get Dot Hunter free from Google Play. Install in seconds." },
              { step: "02", title: "Choose Your Mode", desc: "Classic, Timed, Zen, or Hardcore. Pick your challenge." },
              { step: "03", title: "Hunt", desc: "Tap dots, build streaks, unlock achievements, climb the ranks." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <span
                  className="text-6xl sm:text-7xl block mb-4"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--ink)", fontWeight: 300, opacity: 0.1 }}
                >
                  {item.step}
                </span>
                <h3
                  className="text-xl mb-3"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--ink)", fontWeight: 400, fontStyle: "italic" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)", maxWidth: "260px", margin: "0 auto" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 sm:px-10 py-24 sm:py-36">
        <div className="max-w-2xl mx-auto text-center">
          <h2
            className="text-4xl sm:text-6xl mb-6"
            style={{ fontFamily: "var(--font-heading)", color: "var(--ink)", fontWeight: 400, fontStyle: "italic" }}
          >
            Ready to hunt?
          </h2>
          <p
            className="text-sm sm:text-base leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)", maxWidth: "400px", margin: "0 auto 40px" }}
          >
            Free on Google Play. No ads. No tracking. Just pure reflex gaming.
          </p>
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-10 py-5 transition-all duration-500"
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
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--paper)">
              <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z" />
            </svg>
            Test Now on Google Play
          </a>

          {/* Back to hallway */}
          <div className="mt-16">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onBack(); }}
              className="text-xs uppercase tracking-widest transition-colors duration-300"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--ink-faint)",
                letterSpacing: "0.2em",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.target.style.color = "var(--ink)")}
              onMouseLeave={(e) => (e.target.style.color = "var(--ink-faint)")}
            >
              \u2190 Back to the Hallway
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div
        className="px-6 sm:px-10 py-8 flex flex-col sm:flex-row items-center justify-between gap-4"
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

/* ====================================================================
   MAIN APP
   ==================================================================== */
export default function PaperHallway() {
  const [currentView, setCurrentView] = useState("hallway");

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleProductClick = (productId) => {
    if (productId === "aether") {
      setCurrentView("aether");
      window.scrollTo(0, 0);
    } else if (productId === "dothunter") {
      setCurrentView("dothunter");
      window.scrollTo(0, 0);
    }
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
            <DoorsSection onProductClick={handleProductClick} />
            <Divider />
            <Footer />
          </>
        )}

        {currentView === "aether" && (
          <AetherPage onBack={() => handleNavigate("hallway")} />
        )}

        {currentView === "dothunter" && (
          <DotHunterPage onBack={() => handleNavigate("hallway")} />
        )}
      </div>
    </>
  );
}
