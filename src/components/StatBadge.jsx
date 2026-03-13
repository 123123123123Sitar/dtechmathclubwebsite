export default function StatBadge({ value, label }) {
  return (
    <div className="aspect-square max-w-[180px] w-full rounded-[36px] grid place-items-center text-center p-4 bg-linear-to-br from-brand-light via-brand to-brand-dark text-white shadow-[0_26px_60px_-34px_rgba(234,109,74,0.5)] border border-white/20">
      <div>
        <span className="block text-[clamp(2rem,3vw,2.8rem)] font-extrabold leading-none">
          {value}
        </span>
        <span className="block max-w-[11ch] mt-1 text-[clamp(0.82rem,1.1vw,0.95rem)] leading-tight font-bold text-white/90">
          {label}
        </span>
      </div>
    </div>
  );
}
