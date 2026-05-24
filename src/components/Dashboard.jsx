import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Dashboard({ userEmail, onLogout }) {
  const [dragging, setDragging] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.02 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`v${i}`}
              className="absolute top-0 bottom-0"
              style={{
                left: `${(i + 1) * (100 / 7)}%`,
                width: "1px",
                background: "var(--ink)",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-2xl">
          {/* Header */}
          <div className="text-center mb-16">
            <svg viewBox="0 0 64 64" className="w-12 h-12 mx-auto mb-6" fill="none" stroke="var(--ink)" strokeWidth="0.6">
              <rect x="6" y="10" width="52" height="36" rx="2" />
              <line x1="6" y1="20" x2="58" y2="20" />
              <line x1="20" y1="10" x2="20" y2="46" />
              <line x1="26" y1="28" x2="50" y2="28" />
              <line x1="26" y1="34" x2="44" y2="34" />
              <line x1="26" y1="40" x2="38" y2="40" />
              <path d="M32 50 L32 56 M22 56 L42 56" />
            </svg>

            <h1
              className="text-4xl sm:text-5xl mb-3"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--ink)",
                fontWeight: 400,
                fontStyle: "italic",
              }}
            >
              Welcome to Synthese
            </h1>

            <div
              className="mx-auto mt-6 mb-4"
              style={{ width: "80px", height: "1px", background: "var(--ink)", opacity: 0.15 }}
            />

            <p
              className="text-sm"
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}
            >
              Signed in as{" "}
              <span style={{ color: "var(--ink)" }}>{userEmail}</span>
            </p>
          </div>

          {/* File Upload Drop Zone */}
          <div className="mb-12">
            <p
              className="text-xs uppercase tracking-widest mb-4"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--ink-faint)",
                letterSpacing: "0.25em",
                fontSize: "10px",
              }}
            >
              Upload
            </p>

            <div
              className="relative transition-all duration-300"
              style={{
                border: dragging
                  ? "2px dashed var(--ink)"
                  : "1px dashed var(--border)",
                background: dragging ? "var(--paper-warm)" : "transparent",
                padding: "3rem 2rem",
                textAlign: "center",
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                // Placeholder — file handling will be implemented
              }}
            >
              <svg
                viewBox="0 0 48 48"
                className="w-10 h-10 mx-auto mb-4"
                fill="none"
                stroke="var(--ink-faint)"
                strokeWidth="0.8"
              >
                <path d="M24 32 L24 16 M18 22 L24 16 L30 22" />
                <path d="M8 32 L8 40 L40 40 L40 32" />
              </svg>

              <p
                className="text-sm mb-2"
                style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}
              >
                Drag and drop your video file here
              </p>
              <p
                className="text-xs"
                style={{ fontFamily: "var(--font-body)", color: "var(--ink-faint)" }}
              >
                or click to browse &middot; MP4, MOV, WEBM
              </p>
            </div>
          </div>

          {/* Logout */}
          <div className="text-center">
            <div
              className="mx-auto mb-6"
              style={{ width: "60px", height: "1px", background: "var(--ink)", opacity: 0.1 }}
            />
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest transition-all duration-300"
              style={{
                fontFamily: "var(--font-body)",
                letterSpacing: "0.2em",
                background: "transparent",
                color: "var(--ink-light)",
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--ink)";
                e.currentTarget.style.color = "var(--ink)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(60, 55, 48, 0.1)";
                e.currentTarget.style.color = "var(--ink-light)";
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 1 L11 6 L8 11 M4 6 L11 6" stroke="currentColor" strokeWidth="0.8" />
                <path d="M1 1 L1 11" stroke="currentColor" strokeWidth="0.8" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
