import { useEffect, useState } from "react";

/**
 * Minimal “slow ad” progress captcha.
 * - No global CSS, only Tailwind + inline styles.
 * - Decelerating ease (starts fast, crawls near the end).
 * - Auto-calls onComplete() at 100%.
 */
export default function CaptchaMinimalSlow({
  onComplete,
  durationMs = 10_000, // total time to finish
  title = "Checking you're not a stoopid clanker",
}) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const easeOutQuint = (t) => 1 - Math.pow(1 - t, 5); // fast start, slow finish

    let raf = 0;
    const tick = () => {
      const now = performance.now();
      const raw = Math.min(1, (now - start) / durationMs);
      const eased = easeOutQuint(raw);
      const percent = Math.min(100, Math.round(eased * 100));
      setPct(percent);

      if (raw < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        onComplete?.();
      }
    };

    // Drive animation
    raf = requestAnimationFrame(tick);

    // Hard stop at duration in case of background throttling
    const hardStop = setTimeout(() => {
      setPct(100);
      onComplete?.();
      cancelAnimationFrame(raf);
    }, durationMs + 60);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(hardStop);
    };
  }, [durationMs, onComplete]);

  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center px-4">
      <div className="w-[520px] max-w-full">
        {/* Card */}
        <div className="rounded-lg border border-neutral-200/70 bg-white text-neutral-900 shadow-sm">
          <div className="p-5">
            <h2 className="text-[15px] font-medium tracking-tight mb-2">
              {title}
            </h2>

            <div className="mb-3 text-sm text-neutral-500">
              Please wait…
            </div>

            {/* Progress bar */}
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              className="h-2 w-full rounded-full bg-neutral-200 overflow-hidden"
            >
              <div
                className="h-full bg-neutral-900 transition-[width] duration-150 ease-linear"
                style={{ width: `${pct}%` }}
              />
            </div>

            <div className="mt-2 text-right text-xs tabular-nums text-neutral-500">
              {pct}%
            </div>
          </div>
        </div>

        {/* Microcopy footer (optional) */}
        <div className="mt-3 text-center text-[11px] text-neutral-400">
          This definitely isn’t an ad. Promise.
        </div>
      </div>
    </div>
  );
}
