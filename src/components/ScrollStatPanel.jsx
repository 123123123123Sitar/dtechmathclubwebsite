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
      className="relative ml-[calc(50%-50vw)] flex min-h-[120px] w-screen items-center justify-center overflow-hidden bg-linear-to-r from-brand-dark via-brand to-brand-light text-white sm:min-h-[100px] lg:min-h-[120px]"
      style={{
        transform: `translateX(${translateX}%) scale(${scale})`,
        opacity,
        transition: "transform 120ms linear, opacity 120ms linear",
        willChange: "transform, opacity",
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.1),transparent_28%,rgba(255,255,255,0.14)_52%,transparent_74%)]" />
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="relative grid gap-1 px-3 py-6 text-center sm:gap-1 sm:px-6 md:px-8">
        <span className="text-[clamp(2rem,8vw,5rem)] font-extrabold leading-[0.9]">
          {value}
        </span>
        <span className="max-w-[16ch] mx-auto text-[clamp(0.8rem,2.5vw,1.3rem)] font-bold tracking-[0.14em] sm:tracking-wider uppercase leading-tight text-balance">
          {label}
        </span>
      </div>
    </div>
  );
}
