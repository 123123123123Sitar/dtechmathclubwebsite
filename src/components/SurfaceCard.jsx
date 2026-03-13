export default function SurfaceCard({ as: Tag = "div", className = "", children }) {
  return (
    <Tag
      className={`relative overflow-hidden rounded-[30px] border border-[rgba(234,109,74,0.13)] bg-[linear-gradient(160deg,rgba(255,255,255,0.88),rgba(255,249,244,0.74))] shadow-[0_28px_70px_-42px_rgba(49,30,17,0.38)] ring-1 ring-white/45 backdrop-blur-xl ${className}`}
    >
      {children}
    </Tag>
  );
}
