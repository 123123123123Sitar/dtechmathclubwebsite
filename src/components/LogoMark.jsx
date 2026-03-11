export default function LogoMark({ compact = false }) {
  return (
    <div className={`logo-mark ${compact ? "logo-mark-compact" : ""}`}>
      <span className="logo-mark-dt">DT</span>
      <span className="logo-mark-pi">pi</span>
    </div>
  );
}
