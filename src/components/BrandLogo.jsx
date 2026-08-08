const LOGO_VARIANTS = {
  nav: {
    iconWidth: 32,
    wordmarkSize: "12px",
    gap: "9px",
    tracking: "0.115em",
  },
  hero: {
    iconWidth: 68,
    wordmarkSize: "27px",
    gap: "18px",
    tracking: "0.12em",
  },
  auth: {
    iconWidth: 42,
    wordmarkSize: "16px",
    gap: "12px",
    tracking: "0.12em",
  },
};

export default function BrandLogo({ variant = "nav", className = "" }) {
  const { iconWidth, wordmarkSize, gap, tracking } = LOGO_VARIANTS[variant] || LOGO_VARIANTS.nav;

  return (
    <div
      className={`inline-flex items-center ${className}`}
      aria-label="Paper Hallway"
      style={{ gap, lineHeight: 1, whiteSpace: "nowrap" }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 42 32"
        fill="none"
        width={iconWidth}
        height={Math.round(iconWidth * (32 / 42))}
        style={{ display: "block", flexShrink: 0 }}
      >
        <path
          d="M38 27.5 4 4.5l14.2 16.8 5.7 6.2 3.5-11.1L38 27.5Z"
          stroke="var(--ink-faint)"
          strokeWidth="1.35"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="m4 4.5 23.4 11.9M18.2 21.3l9.2-4.9"
          stroke="var(--ink-faint)"
          strokeWidth="1.15"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--ink)",
          fontSize: wordmarkSize,
          fontWeight: 500,
          letterSpacing: tracking,
          lineHeight: 1,
        }}
      >
        PAPER<span style={{ color: "#A09A92" }}>HALLWAY</span>
      </span>
    </div>
  );
}
