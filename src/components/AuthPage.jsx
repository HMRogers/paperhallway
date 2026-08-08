import { useState } from "react";
import { supabase } from "../lib/supabase";
import BrandLogo from "./BrandLogo";

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    try {
      if (mode === "login") {
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (authError) throw authError;

        // Check subscription status
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_subscribed")
          .eq("email", email)
          .single();

        if (profile?.is_subscribed) {
          onAuthSuccess("dashboard");
        } else {
          onAuthSuccess("synthese");
        }
      } else {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (authError) throw authError;
        setSuccessMsg("Check your email for a confirmation link.");
      }
    } catch (err) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.02 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`v${i}`}
              className="absolute top-0 bottom-0"
              style={{
                left: `${(i + 1) * (100 / 9)}%`,
                width: "1px",
                background: "var(--ink)",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-sm">
          {/* Logo / brand mark */}
          <div className="text-center mb-12">
            <BrandLogo variant="auth" className="mb-4" />
            <h1
              className="text-3xl sm:text-4xl"
              style={{
                fontFamily: "var(--font-heading)",
                color: "var(--ink)",
                fontWeight: 400,
                fontStyle: "italic",
              }}
            >
              {mode === "login" ? "Welcome Back" : "Join the Hallway"}
            </h1>
            <p
              className="text-sm mt-3"
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}
            >
              {mode === "login"
                ? "Sign in to access your dashboard."
                : "Create an account to get started."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                className="block text-xs uppercase tracking-widest mb-2"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-light)",
                  letterSpacing: "0.2em",
                  fontSize: "10px",
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full text-sm py-3 px-4 outline-none transition-all duration-300"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--ink)",
                  background: "var(--paper)",
                  border: "1px solid var(--border)",
                  borderRadius: "0",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--ink)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(60, 55, 48, 0.1)")}
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                className="block text-xs uppercase tracking-widest mb-2"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--ink-light)",
                  letterSpacing: "0.2em",
                  fontSize: "10px",
                }}
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full text-sm py-3 px-4 outline-none transition-all duration-300"
                style={{
                  fontFamily: "var(--font-body)",
                  color: "var(--ink)",
                  background: "var(--paper)",
                  border: "1px solid var(--border)",
                  borderRadius: "0",
                }}
                onFocus={(e) => (e.target.style.borderColor = "var(--ink)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(60, 55, 48, 0.1)")}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p
                className="text-xs"
                style={{ fontFamily: "var(--font-body)", color: "#a04040" }}
              >
                {error}
              </p>
            )}

            {successMsg && (
              <p
                className="text-xs"
                style={{ fontFamily: "var(--font-body)", color: "var(--ink)" }}
              >
                {successMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-3 px-8 py-3.5 transition-all duration-500 mt-2"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                background: "var(--ink)",
                color: "var(--paper)",
                border: "none",
                cursor: loading ? "wait" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.opacity = "0.88";
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.opacity = "1";
              }}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          {/* Toggle mode */}
          <div className="text-center mt-8">
            <div
              className="mx-auto mb-6"
              style={{ width: "60px", height: "1px", background: "var(--ink)", opacity: 0.1 }}
            />
            <p
              className="text-sm"
              style={{ fontFamily: "var(--font-body)", color: "var(--ink-light)" }}
            >
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={() => {
                setMode(mode === "login" ? "signup" : "login");
                setError("");
                setSuccessMsg("");
              }}
              className="mt-2 text-xs uppercase tracking-widest transition-colors duration-300"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--ink-light)",
                letterSpacing: "0.2em",
                background: "none",
                border: "none",
                cursor: "pointer",
                borderBottom: "1px solid var(--border)",
                paddingBottom: "2px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--ink)";
                e.currentTarget.style.borderColor = "var(--ink)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--ink-light)";
                e.currentTarget.style.borderColor = "var(--border)";
              }}
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </div>

          {/* Back to hallway */}
          <div className="text-center mt-10">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, "", "/");
                window.dispatchEvent(new PopStateEvent("popstate"));
              }}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest transition-colors duration-300"
              style={{
                fontFamily: "var(--font-body)",
                color: "var(--ink-faint)",
                letterSpacing: "0.2em",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--ink)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--ink-faint)")}
            >
              &larr; Back to Hallway
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
