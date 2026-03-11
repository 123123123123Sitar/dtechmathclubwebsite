export default function StatBadge({ value, label }) {
  return (
    <div className="aspect-square max-w-[180px] w-full rounded-full grid place-items-center text-center p-4 bg-linear-to-br from-brand-light to-brand text-white shadow-lg shadow-brand-glow border border-white/10">
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
