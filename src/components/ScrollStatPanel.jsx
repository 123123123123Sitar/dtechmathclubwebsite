import ScrollReveal from "./ScrollReveal";

export default function ScrollStatPanel({ value, label, direction = "left" }) {
  return (
    <ScrollReveal
      className={`scroll-stat-panel scroll-stat-${direction}`}
      direction={direction}
    >
      <div className="scroll-stat-inner">
        <span className="scroll-stat-value">{value}</span>
        <span className="scroll-stat-label">{label}</span>
      </div>
    </ScrollReveal>
  );
}
