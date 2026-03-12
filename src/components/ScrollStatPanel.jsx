import { useEffect, useRef, useState } from "react";

export default function ScrollStatPanel({ value, label, direction = "left" }) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    let ticking = false;

    function updateProgress() {
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const start = viewportHeight * 0.88;
      const end = viewportHeight * 0.4;
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
  const scale = 0.96 + progress * 0.04;
  const opacity = 0.2 + progress * 0.8;

  return (
    <div
      ref={ref}
      className="w-screen ml-[calc(50%-50vw)] min-h-[42vh] sm:min-h-[40vh] lg:min-h-[44vh] flex items-center justify-center overflow-hidden bg-linear-to-r from-brand-dark via-brand to-brand-light text-white"
      style={{
        transform: `translateX(${translateX}%) scale(${scale})`,
        opacity,
        transition: "transform 120ms linear, opacity 120ms linear",
        willChange: "transform, opacity",
      }}
    >
      <div className="grid gap-1.5 sm:gap-2 text-center px-5 py-10 sm:px-8 md:px-10">
        <span className="text-[clamp(3rem,14vw,8rem)] font-extrabold leading-[0.9]">
          {value}
        </span>
        <span className="max-w-[16ch] mx-auto text-[clamp(1rem,4vw,2rem)] font-bold tracking-[0.14em] sm:tracking-wider uppercase leading-tight text-balance">
          {label}
        </span>
      </div>
    </div>
  );
}
