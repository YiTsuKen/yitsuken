import { useEffect, useRef, useState } from "react";

export default function CaptchaWin95({ onComplete }) {
  const [pos, setPos] = useState({ x: 40, y: 40 });
  const [start, setStart] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [movedEnough, setMovedEnough] = useState(false);
  const winRef = useRef(null);

  // helpers
  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
  const distanceFromStart = (x, y) =>
    Math.hypot(x - start?.x || 0, y - start?.y || 0);

  // mouse handlers
  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY, at: { ...pos } });
  };
  const onMouseMove = (e) => {
    if (!dragging || !start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;

    // keep inside viewport
    const el = winRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = el?.offsetWidth || 320;
    const h = el?.offsetHeight || 160;

    const nx = clamp(start.at.x + dx, 8, vw - w - 8);
    const ny = clamp(start.at.y + dy, 8, vh - h - 8);
    setPos({ x: nx, y: ny });

    if (!movedEnough && distanceFromStart(e.clientX, e.clientY) > 30) {
      setMovedEnough(true);
    }
  };
  const onMouseUp = () => setDragging(false);

  // touch handlers
  const onTouchStart = (e) => {
    const t = e.touches[0];
    setDragging(true);
    setStart({ x: t.clientX, y: t.clientY, at: { ...pos } });
  };
  const onTouchMove = (e) => {
    if (!dragging || !start) return;
    const t = e.touches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;

    const el = winRef.current;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = el?.offsetWidth || 320;
    const h = el?.offsetHeight || 160;

    const nx = clamp(start.at.x + dx, 8, vw - w - 8);
    const ny = clamp(start.at.y + dy, 8, vh - h - 8);
    setPos({ x: nx, y: ny });

    if (!movedEnough && distanceFromStart(t.clientX, t.clientY) > 30) {
      setMovedEnough(true);
    }
  };
  const onTouchEnd = () => setDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragging, start, movedEnough]);

  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center bg-[#008080] p-6">
      {/* Win95 window */}
      <div
        ref={winRef}
        style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
        className="fixed select-none win95-window"
      >
        {/* Outer bevel */}
        <div className="border-t-[2px] border-l-[2px] border-[#ffffff] border-b-[2px] border-r-[2px] border-b-[#808080] border-r-[#808080] bg-[#c0c0c0]">
          {/* Inner bevel */}
          <div className="border-t-[2px] border-l-[2px] border-[#dfdfdf] border-b-[2px] border-r-[2px] border-b-[#404040] border-r-[#404040]">
            {/* Title bar */}
            <div
              className="flex items-center justify-between h-7 px-2 text-white bg-[#000080] titlebar"
              onMouseDown={onMouseDown}
              onTouchStart={onTouchStart}
            >
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#00ffff] inline-block" />
                <span className="font-win95 text-[13px] tracking-tight">
                  Hooman Verification
                </span>
              </div>
              <div className="flex gap-1">
                <Win95Button small>_</Win95Button>
                <Win95Button small>□</Win95Button>
                <Win95Button small>X</Win95Button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 font-win95 text-[13px] text-black">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-[#000080] text-white flex items-center justify-center">
                  !
                </div>
                <div>
                  <p className="mb-3">
                    To continue, <b>drag this window</b> by the blue title bar.
                  </p>
                  <p className="mb-3">
                    Progress:{" "}
                    <span className={movedEnough ? "text-green-700" : ""}>
                      {movedEnough ? "✔ Moved enough" : "… Not yet"}
                    </span>
                  </p>
                  <div className="flex gap-2">
                    <Win95Button
                      disabled={!movedEnough}
                      onClick={() => onComplete?.()}
                      autoFocus={movedEnough}
                    >
                      OK
                    </Win95Button>
                    <Win95Button onClick={() => alert("Canceled.")}>
                      Cancel
                    </Win95Button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Hint card */}
      <div className="hidden md:block absolute bottom-4 text-white/90 font-win95 text-sm">
        Tip: click and drag the blue bar.
      </div>
    </div>
  );
}

function Win95Button({ children, small = false, disabled, ...props }) {
  const size = small ? "px-2 py-[1px] text-[12px]" : "px-3 py-[2px] text-[13px]";

  return (
    <button
      {...props}
      disabled={disabled}
      className={[
        "font-win95",
        // "bg-[#c0c0c0] text-black",   // Win95 background + text color
        "border border-[#808080]",   // outer border
        "shadow-[inset_-1px_-1px_0_#fff,inset_1px_1px_0_#404040]", // 3D effect
        "active:shadow-[inset_-1px_-1px_0_#404040,inset_1px_1px_0_#fff]", // pressed look
        "disabled:text-[#808080] disabled:shadow-none disabled:border-[#a0a0a0]",
        "cursor-pointer",
        "rounded-none",
        size,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

