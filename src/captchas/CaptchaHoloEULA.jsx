import { useEffect, useRef, useState } from "react";

/** Neon-styled button (self-contained, no global CSS) */
function NeonButton({ children, className = "", ...props }) {
  return (
    <button
      {...props}
      className={[
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium",
        "transition-[transform,box-shadow,border-color] duration-150",
        // colors from local CSS vars
        "text-[var(--text)] border",
        "bg-[color:rgba(255,255,255,0.06)]",
        "border-[color:color-mix(in_oklab,var(--accent),white_85%)]",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_0_16px_rgba(0,245,255,0.35)]",
        "hover:-translate-y-[1px] hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12),0_0_22px_rgba(0,245,255,0.6)]",
        "active:translate-y-0 active:shadow-[inset_0_0_0_2px_rgba(255,255,255,0.18)]",
        "disabled:opacity-60 disabled:saturate-50 disabled:shadow-none disabled:cursor-not-allowed",
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function CaptchaHoloEULA({ onComplete }) {
  const [scrolledBottom, setScrolledBottom] = useState(false);
  const [honest, setHonest] = useState(false);
  const [fakeTried, setFakeTried] = useState(false);
  const scrollRef = useRef(null);

  // track scroll position to toggle the fake "agree" option
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 4;
      setScrolledBottom(nearBottom);
    };
    el.addEventListener("scroll", onScroll);
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  // local theme tokens (scoped to this component only)
  const themeVars = {
    "--bg": "#0a0f1e",
    "--panel": "rgba(255,255,255,.06)",
    "--panelBorder": "rgba(255,255,255,.12)",
    "--text": "#d7e3ff",
    "--muted": "#8aa0c7",
    "--accent": "#00f5ff",
    "--accent2": "#b96bff",
  };

  return (
    <div
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      style={themeVars}
    >
      {/* Neon gradient background */}
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
      {/* Grid overlay */}
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
        className="relative w-[560px] max-w-[95vw] rounded-xl border p-6"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.03))",
          borderColor: "var(--panelBorder)",
          color: "var(--text)",
          boxShadow:
            "0 8px 30px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.06)",
        }}
      >
        {/* Title */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="uppercase tracking-widest font-semibold text-[15px] drop-shadow-[0_0_8px_rgba(0,245,255,.25)]">
            Human Verification — Holo-EULA
          </h2>
          <span
            className="px-2 py-1 rounded-full text-xs"
            style={{
              background: "rgba(255,255,255,.08)",
              border: "1px solid var(--panelBorder)",
              color: "var(--muted)",
            }}
          >
            v1.0
          </span>
        </div>

        <p className="text-sm mb-3 text-[color:var(--muted)]">
          Review the agreement below. When you’re ready, select the option that best describes your reading experience.
        </p>

        {/* Scrollbox */}
        <div
          ref={scrollRef}
          className="h-56 overflow-y-auto rounded-md p-4 mb-3 text-sm leading-relaxed"
          style={{
            background: "rgba(0,0,0,.35)",
            border: "1px solid var(--panelBorder)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,.06), inset 0 -1px 0 rgba(0,0,0,.35)",
          }}
        >
          {PARAS.map((t, i) => (
            <p key={i} className="mb-2">
              {t}
            </p>
          ))}
          <p className="mt-3 italic opacity-80">[End of document]</p>
        </div>

        {/* Options */}
        <fieldset className="space-y-3 mb-4">
          {/* Fake “I agree” — only clickable after scroll; scolds user */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              disabled={!scrolledBottom || honest}
              onChange={() => setFakeTried(true)}
              className={[
                "appearance-none h-4 w-4 rounded-[3px] border",
                "bg-[#0b1224]",
                "border-[color:var(--panelBorder)]",
                "checked:bg-[var(--accent)] checked:border-[var(--accent)]",
                "transition-colors",
                (!scrolledBottom || honest) ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
              ].join(" ")}
            />
            <span className={scrolledBottom ? "" : "opacity-70"}>
              I have read and agree to all terms.
            </span>
            {!scrolledBottom && (
              <span className="text-xs text-[color:var(--muted)]">(scroll to the end to enable)</span>
            )}
          </label>

          {fakeTried && (
            <div
              className="text-xs px-3 py-2 rounded-md"
              style={{
                background: "rgba(255,255,255,.08)",
                border: "1px solid var(--panelBorder)",
                color: "var(--muted)",
              }}
            >
              Nice try. We reward honesty here. Please choose the accurate option below.
            </div>
          )}

          {/* Honest option — enables Confirm */}
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={honest}
              onChange={(e) => {
                setHonest(e.target.checked);
                if (e.target.checked) setFakeTried(false);
              }}
              className={[
                "appearance-none h-4 w-4 rounded-[3px] border",
                "bg-[#0b1224]",
                "border-[color:var(--panelBorder)]",
                "checked:bg-[var(--accent)] checked:border-[var(--accent)]",
                "cursor-pointer transition-colors",
              ].join(" ")}
            />
            <span>I did not read this.</span>
          </label>
        </fieldset>

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <NeonButton
            onClick={() => honest && onComplete?.()}
            disabled={!honest}
          >
            Confirm
          </NeonButton>
          <NeonButton
            className="border-dashed"
            onClick={() => {
              setHonest(false);
              setFakeTried(false);
              scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            Reset
          </NeonButton>
        </div>
      </div>
    </div>
  );
}

const PARAS = [
  "1. DEFINITIONS. 'Software' refers to whatever this panel is about. 'You' refers to a human with at least one eyebrow.",
  "2. LICENSE GRANT. We grant you a non-exclusive, non-transferable license to click things until satisfied.",
  "3. ACCEPTABLE USE. You agree not to reverse engineer, side-eye, or harshly judge the glow effects.",
  "4. DATA. Telemetry may include clicks, sighs, and time spent hovering dramatic buttons.",
  "5. WARRANTY. None. Provided as-is, as-was, and as-it-will-be after snacks.",
  "6. LIABILITY. If giggles or groans occur, consider them features.",
  "7. EXPORT. Do not export this panel to Mars without Martian consent.",
  "8. GOVERNING LAW. Settled exclusively by rock–paper–scissors, best of three.",
  "9. TERMINATION. This agreement ends when you forget about it, which should be any minute now.",
  "10. MISC. Any clause that sounds important is purely coincidental.",
  "11. ADDENDUM. Scrolling to the end proves nothing, but we’re proud of you.",
  "12. BONUS. If you are still reading, you are officially overqualified for captchas.",
];
