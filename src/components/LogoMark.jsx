export default function LogoMark({ compact = false }) {
  const size = compact ? "w-[58px]" : "w-[92px]";
  const radius = compact ? "rounded-2xl" : "rounded-3xl";
  const textSize = compact ? "text-lg" : "text-3xl";
  const piSize = compact ? "text-[0.65rem]" : "text-sm";

  return (
    <div
      className={`${size} aspect-square ${radius} bg-linear-to-br from-[#ff7446] to-brand relative shadow-lg shadow-brand-glow text-white grid place-items-center`}
    >
      <span className={`${textSize} font-extrabold tracking-tighter`}>DT</span>
      <span
        className={`absolute right-[18%] top-[18%] w-[34%] aspect-square grid place-items-center rounded-full bg-white/95 text-brand ${piSize} font-bold`}
      >
        π
      </span>
    </div>
  );
}
