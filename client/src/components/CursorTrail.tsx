import { useEffect, useRef } from "react";

export default function CursorTrail() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);
  const posRef = useRef({ x: 0, y: 0 });
  const trailPositions = useRef<{ x: number; y: number }[]>(
    Array.from({ length: 8 }, () => ({ x: 0, y: 0 }))
  );

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX - 10}px, ${e.clientY - 10}px)`;
      }
      const target = e.target as HTMLElement;
      const isClickable = target.closest("a, button, input, textarea, select, [role='button']");
      if (cursorRef.current) {
        cursorRef.current.classList.toggle("hovering", !!isClickable);
      }
    }

    function animateTrails() {
      const lead = trailPositions.current;
      for (let i = lead.length - 1; i > 0; i--) {
        lead[i] = { ...lead[i - 1] };
      }
      lead[0] = { ...posRef.current };

      for (let i = 0; i < trailsRef.current.length; i++) {
        const el = trailsRef.current[i];
        if (el) {
          el.style.transform = `translate(${lead[i].x - 3}px, ${lead[i].y - 3}px)`;
          el.style.opacity = String(0.4 - i * 0.045);
        }
      }
      requestAnimationFrame(animateTrails);
    }

    document.addEventListener("mousemove", handleMove);
    const raf = requestAnimationFrame(animateTrails);

    return () => {
      document.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="gold-cursor" />
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailsRef.current[i] = el; }}
          className="gold-cursor-trail"
          style={{ transitionDelay: `${i * 30}ms` }}
        />
      ))}
    </>
  );
}
