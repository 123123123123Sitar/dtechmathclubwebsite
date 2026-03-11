import { useEffect, useMemo, useRef, useState } from "react";

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

function rangeProgress(progress, start, end) {
  return clamp((progress - start) / (end - start), 0, 1);
}

const desktopLayout = {
  cards: {
    Platinum: { x: 50, y: 30 },
    Diamond: { x: 22, y: 74 },
    Gold: { x: 78, y: 74 },
  },
  logos: {
    AoPS: { startX: 10, startY: 14, endX: 50, endY: 33, tier: "Platinum", slot: 0 },
    "Random Math": {
      startX: 88,
      startY: 20,
      endX: 50,
      endY: 40,
      tier: "Platinum",
      slot: 1,
    },
    "Texas Instruments": {
      startX: 12,
      startY: 52,
      endX: 22,
      endY: 78,
      tier: "Diamond",
      slot: 0,
    },
    "Math Kangaroo": {
      startX: 14,
      startY: 86,
      endX: 78,
      endY: 78,
      tier: "Gold",
      slot: 0,
    },
    "Atomic Grader": {
      startX: 92,
      startY: 82,
      endX: 78,
      endY: 85,
      tier: "Gold",
      slot: 1,
    },
  },
};

const mobileLayout = {
  cards: {
    Platinum: { x: 50, y: 20 },
    Diamond: { x: 50, y: 50 },
    Gold: { x: 50, y: 82 },
  },
  logos: {
    AoPS: { startX: 12, startY: 10, endX: 50, endY: 23, tier: "Platinum", slot: 0 },
    "Random Math": {
      startX: 84,
      startY: 14,
      endX: 50,
      endY: 31,
      tier: "Platinum",
      slot: 1,
    },
    "Texas Instruments": {
      startX: 10,
      startY: 52,
      endX: 50,
      endY: 53,
      tier: "Diamond",
      slot: 0,
    },
    "Math Kangaroo": {
      startX: 86,
      startY: 82,
      endX: 50,
      endY: 85,
      tier: "Gold",
      slot: 0,
    },
    "Atomic Grader": {
      startX: 16,
      startY: 90,
      endX: 50,
      endY: 93,
      tier: "Gold",
      slot: 1,
    },
  },
};

export default function OrbitSponsorSection({ title, description, tiers }) {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 900);
    }

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    let ticking = false;

    function updateProgress() {
      const rect = node.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const total = Math.max(rect.height - viewportHeight, 1);
      const raw = (-rect.top + viewportHeight * 0.15) / total;
      setProgress(clamp(raw, 0, 1));
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

  useEffect(() => {
    let frame = 0;
    let raf = 0;

    function tick() {
      frame += 1;
      setTime(frame / 60);
      raf = window.requestAnimationFrame(tick);
    }

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, []);

  const layout = isMobile ? mobileLayout : desktopLayout;

  const orderedTiers = useMemo(() => {
    const order = ["Platinum Sponsors", "Diamond Sponsors", "Gold Sponsors"];
    return [...tiers].sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
  }, [tiers]);

  return (
    <section className="section orbit-sponsor-section" ref={ref}>
      <div className="container">
        <div className="section-heading section-heading-center">
          <p className="eyebrow">Partners</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
      </div>

      <div className="orbit-scroll-area">
        <div className="orbit-stage">
          <div className="orbit-stage-inner">
          {orderedTiers.map((tier) => {
            const key = tier.name.replace(" Sponsors", "");
            const position = layout.cards[key];
            const tierProgress =
              key === "Diamond"
                ? easeOutCubic(rangeProgress(progress, 0.58, 0.96))
                : easeOutCubic(rangeProgress(progress, 0.34, 0.84));

            return (
              <article
                  key={tier.name}
                  className={`orbit-tier orbit-tier-${key.toLowerCase()}`}
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    opacity: tierProgress,
                    transform: `translate(-50%, -50%) scale(${
                      key === "Diamond" ? 0.92 + tierProgress * 0.08 : 0.96 + tierProgress * 0.04
                    })`,
                  }}
                >
                <h3>{tier.name}</h3>
                <div className="orbit-tier-list">
                  {tier.sponsors.map((sponsor) => (
                    <a
                      key={sponsor.name}
                      className="orbit-tier-item"
                      href={sponsor.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="orbit-tier-item-name">{sponsor.name}</span>
                      <span className="orbit-tier-item-copy">{sponsor.copy}</span>
                    </a>
                  ))}
                </div>
              </article>
            );
          })}

          {orderedTiers.flatMap((tier) =>
            tier.sponsors.map((sponsor) => {
              const config = layout.logos[sponsor.name];
              const perLogoProgress =
                config.tier === "Diamond"
                  ? easeOutCubic(rangeProgress(progress, 0.54, 0.96))
                  : easeOutCubic(rangeProgress(progress, 0.2, 0.82));

              const curve = Math.sin(perLogoProgress * Math.PI) * (config.tier === "Diamond" ? 8 : 6);
              const driftX = Math.sin(time * 0.85 + config.startX) * 1.3 * (1 - perLogoProgress);
              const driftY = Math.cos(time * 0.7 + config.startY) * 1.1 * (1 - perLogoProgress);
              const x =
                config.startX + (config.endX - config.startX) * perLogoProgress + driftX;
              const y =
                config.startY +
                (config.endY - config.startY) * perLogoProgress +
                (config.tier === "Platinum" ? -curve : config.tier === "Gold" ? curve : -curve * 0.75) +
                driftY;

              return (
                <a
                  key={sponsor.name}
                  href={sponsor.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`orbit-logo orbit-logo-${config.tier.toLowerCase()}`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: `translate(-50%, -50%) scale(${0.76 + perLogoProgress * 0.24})`,
                    opacity: 0.9 - perLogoProgress * 0.95,
                  }}
                >
                  {sponsor.name}
                </a>
              );
            }),
          )}
          </div>
        </div>
      </div>
    </section>
  );
}
