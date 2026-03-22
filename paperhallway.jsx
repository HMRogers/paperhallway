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
function Nav() {
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
        <a href="#" className="flex items-center gap-3 group">
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
          {["Arcade", "Study", "Office"].map((l) => (
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
          ))}
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
        {/* Converging corridor lines toward center vanishing point */}
        <line x1="0" y1="0" x2="600" y2="400" stroke="var(--ink)" strokeWidth="0.5" />
        <line x1="1200" y1="0" x2="600" y2="400" stroke="var(--ink)" strokeWidth="0.5" />
        <line x1="0" y1="800" x2="600" y2="400" stroke="var(--ink)" strokeWidth="0.5" />
        <line x1="1200" y1="800" x2="600" y2="400" stroke="var(--ink)" strokeWidth="0.5" />
        {/* Horizontal depth lines */}
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
function DoorCard({ door, index }) {
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

          {/* Enter link */}
          <div className="flex items-center gap-3">
            <span
              className="text-xs uppercase tracking-widest"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--ink)",
                letterSpacing: "0.2em",
                fontSize: "11px",
              }}
            >
              Enter
            </span>
            <div
              className="transition-all duration-500"
              style={{
                width: hovered ? "40px" : "24px",
                height: "1px",
                background: "var(--ink)",
              }}
            />
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="transition-transform duration-500"
              style={{ transform: hovered ? "translateX(4px)" : "translateX(0)" }}
            >
              <path d="M1 6 L10 6 M7 3 L10 6 L7 9" stroke="var(--ink)" strokeWidth="0.8" />
            </svg>
          </div>
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
function DoorsSection() {
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
            <DoorCard key={door.id} door={door} index={i} />
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      // In production: POST to API or mailto
      window.location.href = `mailto:hello@paperhallway.com?subject=Early Access Request&body=Please add ${email} to the early access list.`;
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
              className="px-8 py-3.5 text-xs uppercase tracking-widest transition-all duration-500 hover:shadow-lg"
              style={{
                fontFamily: "var(--font-body)",
                background: "var(--ink)",
                color: "var(--paper)",
                border: "none",
                letterSpacing: "0.2em",
                cursor: "pointer",
                fontSize: "11px",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.target.style.opacity = "1")}
            >
              Request Access
            </button>
          </form>
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
   MAIN APP
   ==================================================================== */
export default function PaperHallway() {
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
        <Nav />
        <Hero />
        <Divider />
        <DoorsSection />
        <Divider />
        <Footer />
      </div>
    </>
  );
}
