export default function HeroMediaPanel({
  alt,
  badge,
  caption,
  className = "",
  imageClassName = "object-contain p-8 md:p-10",
  src,
}) {
  return (
    <div
      className={`relative min-h-[300px] overflow-hidden rounded-[30px] bg-[linear-gradient(145deg,rgba(255,249,244,0.95),rgba(249,233,220,0.88))] ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,109,74,0.22),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(45,121,183,0.14),transparent_28%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-white/70" />
      <div className="absolute inset-y-0 left-0 w-px bg-white/55" />
      {src ? (
        <img
          alt={alt}
          className={`absolute inset-0 h-full w-full ${imageClassName}`}
          src={src}
        />
      ) : null}
      <div className="absolute inset-0 bg-linear-to-t from-[#23150f]/72 via-[#23150f]/18 to-transparent" />
      {badge ? (
        <span className="absolute left-5 top-5 z-10 inline-flex rounded-full bg-white/16 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
          {badge}
        </span>
      ) : null}
      {caption ? (
        <p className="absolute bottom-5 left-5 right-5 z-10 text-sm font-semibold leading-relaxed text-white">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
