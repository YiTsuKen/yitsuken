import { useEffect, useMemo, useRef, useState, createRef } from "react";

/** ---------- Utils ---------- */
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Approximate default window size to compute spawn positions before mount */
const DEFAULT_W = 320;
const DEFAULT_H = 160;

function randomPos(vw, vh, w = DEFAULT_W, h = DEFAULT_H, margin = 8) {
  return {
    x: randInt(margin, Math.max(margin, vw - w - margin)),
    y: randInt(margin, Math.max(margin, vh - h - margin)),
  };
}

/** ---------- Win95 Button (square, beveled) ---------- */
function Win95Button({ children, small = false, disabled, className = "", ...props }) {
  const size = small ? "px-2 py-[1px] text-[12px]" : "px-3 py-[2px] text-[13px]";
  return (
    <button
      {...props}
      disabled={disabled}
      className={[
        "font-win95 rounded-none",
        "bg-[#c0c0c0] text-black",
        "border border-[#808080]",
        "shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#404040]",
        "active:shadow-[inset_-1px_-1px_0_#404040,inset_1px_1px_0_#ffffff]",
        "disabled:text-[#808080] disabled:opacity-70",
        "hover:brightness-95 focus:outline-dotted focus:outline-1",
        size,
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/** ---------- Win95 Window (draggable) ---------- */
function Win95Window({
  title = "Human Verification",
  children,
  z,
  setZTop,
  pos,
  setPos,
  onClose,
  windowRef,
}) {
  const [drag, setDrag] = useState(null);

  // Drag with mouse
  useEffect(() => {
    const move = (e) => {
      if (!drag) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const el = windowRef?.current;
      const w = el?.offsetWidth || DEFAULT_W;
      const h = el?.offsetHeight || DEFAULT_H;
      const nx = clamp(drag.startAt.x + (e.clientX - drag.start.x), 8, vw - w - 8);
      const ny = clamp(drag.startAt.y + (e.clientY - drag.start.y), 8, vh - h - 8);
      setPos({ x: nx, y: ny });
    };
    const up = () => setDrag(null);

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [drag, setPos, windowRef]);

  // Keep window on-screen on resize
  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const el = windowRef?.current;
      const w = el?.offsetWidth || DEFAULT_W;
      const h = el?.offsetHeight || DEFAULT_H;
      setPos((p) => ({
        x: clamp(p.x, 8, Math.max(8, vw - w - 8)),
        y: clamp(p.y, 8, Math.max(8, vh - h - 8)),
      }));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setPos, windowRef]);

  return (
    <div
      role="dialog"
      aria-modal="false"
      onMouseDown={setZTop}
      ref={windowRef}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, zIndex: z }}
      className="fixed select-none rounded-none"
    >
      {/* Outer + inner bevel */}
      <div className="bg-[#c0c0c0] border border-[#808080] shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#404040]">
        {/* Title bar */}
        <div
          className="flex items-center justify-between h-7 px-2 text-white bg-[#000080] cursor-move"
          onMouseDown={(e) => {
            if (e.button !== 0) return;
            setZTop();
            setDrag({
              start: { x: e.clientX, y: e.clientY },
              startAt: { ...pos },
            });
          }}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-[#00ffff] inline-block" />
            <span className="font-win95 text-[13px] tracking-tight">{title}</span>
          </div>
          <div className="flex gap-1">
            <Win95Button small onClick={onClose}>X</Win95Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 font-win95 text-[13px] text-black">{children}</div>
      </div>
    </div>
  );
}

/** ---------- The Captcha: spawn 3 popups, OK them all ---------- */
export default function CaptchaWin95Popups({ onComplete }) {
  const COUNT = 3;

  // Prepare popups with random initial positions; each has its own ref for sizing
  const initial = useMemo(() => {
    const vw = window.innerWidth || 800;
    const vh = window.innerHeight || 600;
    return Array.from({ length: COUNT }, (_, i) => ({
      id: i + 1,
      title: `System Message #${i + 1}`,
      pos: randomPos(vw, vh),
      dismissed: false,
      z: 10 + i,
    }));
  }, []);

  const [wins, setWins] = useState(initial);
  const topZ = useRef(10 + COUNT);
  const refs = useRef(Object.fromEntries(initial.map((w) => [w.id, createRef()])));

  const setZTop = (id) => () => {
    const next = ++topZ.current;
    setWins((arr) => arr.map((w) => (w.id === id ? { ...w, z: next } : w)));
  };

  const setPos = (id) => (pos) =>
    setWins((arr) => arr.map((w) => (w.id === id ? { ...w, pos } : w)));

  const dismiss = (id) => () =>
    setWins((arr) => arr.map((w) => (w.id === id ? { ...w, dismissed: true } : w)));

  // Complete when all dismissed
  useEffect(() => {
    if (wins.every((w) => w.dismissed)) onComplete?.();
  }, [wins, onComplete]);

  return (
    <div className="min-h-[70vh] w-full bg-[#008080] relative overflow-hidden">
      {/* Instruction bar */}
      <div className="absolute left-1/2 -translate-x-1/2 top-4">
        <div className="font-win95 text-[13px] bg-[#c0c0c0] px-3 py-2 border border-[#808080] shadow-[inset_-1px_-1px_0_#ffffff,inset_1px_1px_0_#404040]">
          Close all popups by pressing <b>OK</b>.
          <span className="ml-3">Remaining: {wins.filter((w) => !w.dismissed).length}</span>
        </div>
      </div>

      {/* Windows */}
      {wins.map((w) =>
        w.dismissed ? null : (
          <Win95Window
            key={w.id}
            title={w.title}
            z={w.z}
            setZTop={setZTop(w.id)}
            pos={w.pos}
            setPos={(p) => setPos(w.id)(typeof p === "function" ? p(w.pos) : p)}
            onClose={dismiss(w.id)}
            windowRef={refs.current[w.id]}
          >
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-[#000080] text-white flex items-center justify-center">!</div>
              <div className="flex-1">
                <p className="mb-3">
                  <b>Security Notice:</b> Unspecified error has occurred.
                </p>
                <p className="mb-3">Press <b>OK</b> to acknowledge.</p>
                <div className="flex gap-2 justify-end">
                  <Win95Button onClick={dismiss(w.id)}>OK</Win95Button>
                  <Win95Button onClick={() => alert("Error 0x0000: Nice try.")}>Cancel</Win95Button>
                </div>
              </div>
            </div>
          </Win95Window>
        )
      )}
    </div>
  );
}

/** ---------- Minimal helpers for the Win95 font ---------- */
/* Add this to your global CSS once if you haven't already:
@font-face {
  font-family: "Win95Fallback";
  src: local("Tahoma"), local("MS Sans Serif"), local("Verdana");
  font-display: swap;
}
.font-win95 { font-family: "Win95Fallback", system-ui, sans-serif; }
*/
