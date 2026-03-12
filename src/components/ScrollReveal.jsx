import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({ children, direction = "left", className = "" }) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    let ticking = false;

    function updateProgress() {
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight * 0.92;
      const end = viewportHeight * 0.22;
      const raw = (start - rect.top) / (start - end);
      const next = Math.max(0, Math.min(1, raw));
      setProgress(next);
      ticking = false;
    }

    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const offset = (1 - progress) * 100;
  const translateX = direction === "left" ? -offset : offset;
  const scale = 0.94 + progress * 0.06;
  const opacity = 0.18 + progress * 0.82;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateX(${translateX}%) scale(${scale})`,
        opacity,
        transition: "transform 120ms linear, opacity 120ms linear",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </div>
  );
}
