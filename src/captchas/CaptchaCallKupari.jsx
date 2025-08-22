import kupariUrl from "../assets/kupari.jpg";
import { useEffect } from "react";

/** Reusable neon button with variants (no global CSS) */
function NeonButton({ children, variant = "neutral", className = "", ...props }) {
  const variants = {
    accept: {
      bg: "linear-gradient(180deg, rgba(0,255,170,.18), rgba(0,255,170,.08))",
      border: "rgba(0,255,170,.7)",
      glow: "0 0 14px rgba(0,255,170,.6)",
      text: "#d7ffef",
    },
    decline: {
      bg: "linear-gradient(180deg, rgba(255,59,110,.20), rgba(255,59,110,.08))",
      border: "rgba(255,59,110,.75)",
      glow: "0 0 14px rgba(255,59,110,.5)",
      text: "#ffd9e3",
    },
    neutral: {
      bg: "linear-gradient(180deg, rgba(255,255,255,.10), rgba(255,255,255,.04))",
      border: "rgba(255,255,255,.35)",
      glow: "0 0 14px rgba(255,255,255,.25)",
      text: "#d7e3ff",
    },
  }[variant];

  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-medium",
        "transition-[transform,box-shadow,border-color] duration-150",
        "disabled:opacity-60 disabled:cursor-not-allowed",
        "hover:-translate-y-[1px] active:translate-y-0",
        className,
      ].join(" ")}
      style={{
        color: variants.text,
        background: variants.bg,
        border: `1px solid ${variants.border}`,
        boxShadow: `inset 0 0 0 1px rgba(255,255,255,.08), ${variants.glow}`,
      }}
    >
      {children}
    </button>
  );
}

/** Phone icon (inline SVG so no deps) */
function PhoneIcon({ flip = false }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      style={{ transform: flip ? "rotate(135deg)" : "none" }}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.11.37 2.31.57 3.58.57a1 1 0 011 1V21a1 1 0 01-1 1C10.85 22 2 13.15 2 2a1 1 0 011-1h3.49a1 1 0 011 1c0 1.27.2 2.47.57 3.58a1 1 0 01-.24 1.01l-2.2 2.2z" />
    </svg>
  );
}

/** The captcha component */
export default function CaptchaCallKupari({
  onComplete,
  imageSrc = kupariUrl,                  // pass your Kupari image URL here
  callerName = "Kupari",
  subtitle = "Drinking invitation",
}) {
  // local theme tokens (scoped to this component)
  const theme = {
    "--bg": "#0a0f1e",
    "--accent": "#00f5ff",
    "--accent2": "#b96bff",
    "--text": "#d7e3ff",
    "--muted": "#8aa0c7",
  };

  // keyboard affordances: Enter = answer, Esc = decline
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") onComplete?.();
      if (e.key === "Escape") onComplete?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onComplete]);

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden" style={theme}>
      {/* Neon background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(1200px 600px at 80% -20%, color-mix(in oklab, var(--accent), transparent 75%), transparent),
            radial-gradient(800px 400px at -10% 110%, color-mix(in oklab, var(--accent2), transparent 75%), transparent),
            var(--bg)
          `,
        }}
      />
      {/* Subtle grid */}
      <div
        aria-hidden
        className="absolute inset-0 mix-blend-soft-light opacity-40"
        style={{
          background: `
            linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px) 0 0/36px 36px,
            linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px) 0 0/36px 36px
          `,
        }}
      />

      {/* Panel */}
      <div
        className="relative w-[520px] max-w-[92vw] rounded-xl border p-6"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.03))",
          borderColor: "rgba(255,255,255,.12)",
          color: "var(--text)",
          boxShadow: "0 8px 30px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06)",
        }}
      >
        {/* Title row */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="uppercase tracking-widest font-semibold text-[15px] drop-shadow-[0_0_8px_rgba(0,245,255,.25)]">
            Incoming Call
          </h2>
          <span
            className="px-2 py-1 rounded-full text-xs"
            style={{
              background: "rgba(255,255,255,.08)",
              border: "1px solid rgba(255,255,255,.12)",
              color: "var(--muted)",
            }}
          >
            Secure Line
          </span>
        </div>

        {/* Caller block */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-24 h-24">
            {/* Expanding rings */}
            <span
              className="absolute inset-0 rounded-full ringPulse"
              style={{
                border: "2px solid rgba(0,245,255,.35)",
              }}
            />
            <span
              className="absolute inset-0 rounded-full ringPulse delay-500"
              style={{
                border: "2px solid rgba(185,107,255,.25)",
              }}
            />
            {/* Avatar */}
            <img
              src={imageSrc}
              alt={`${callerName}`}
              className="w-full h-full rounded-full object-cover border"
              style={{ borderColor: "rgba(255,255,255,.18)" }}
              onError={(e) => (e.currentTarget.style.opacity = 0.3)}
            />
          </div>

          <div className="flex-1">
            <div className="text-xl font-semibold">{callerName}</div>
            <div className="text-sm opacity-80">{subtitle}</div>
            <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
              +358 • encrypted
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-2 flex items-center justify-center gap-4">
          <NeonButton variant="decline" onClick={() => onComplete?.()} className="w-36">
            <PhoneIcon flip />
            Decline
          </NeonButton>

          <NeonButton
            variant="accept"
            onClick={() => onComplete?.()}
            className="w-36 kupari-pulse"
            aria-label="Answer call"
          >
            <PhoneIcon />
            Answer
          </NeonButton>
        </div>

        {/* Hint */}
        <div className="text-center text-xs mt-4" style={{ color: "var(--muted)" }}>
          Press <kbd className="px-1 py-0.5 rounded border border-white/20">Enter</kbd> to answer,
          <span className="mx-1">or</span>
          <kbd className="px-1 py-0.5 rounded border border-white/20">Esc</kbd> to decline.
        </div>

        {/* Local animations (scoped by unique class names) */}
        <style>{`
          @keyframes kupariPulse {
            0% { transform: scale(1); box-shadow: inset 0 0 0 1px rgba(255,255,255,.08), 0 0 14px rgba(0,255,170,.6); }
            50% { transform: scale(1.04); box-shadow: inset 0 0 0 1px rgba(255,255,255,.12), 0 0 22px rgba(0,255,170,.8); }
            100% { transform: scale(1); box-shadow: inset 0 0 0 1px rgba(255,255,255,.08), 0 0 14px rgba(0,255,170,.6); }
          }
          .kupari-pulse { animation: kupariPulse 1.15s ease-in-out infinite; }

          @keyframes ringPulse {
            0%   { transform: scale(.9); opacity: .8; }
            70%  { transform: scale(1.25); opacity: 0; }
            100% { transform: scale(1.25); opacity: 0; }
          }
          .ringPulse { animation: ringPulse 1.6s ease-out infinite; }
          .delay-500 { animation-delay: .5s; }
        `}</style>
      </div>
    </div>
  );
}
