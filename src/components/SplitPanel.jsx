import SurfaceCard from "./SurfaceCard";

export default function SplitPanel({
  className = "",
  left,
  right,
}) {
  return (
    <SurfaceCard className={`mx-auto w-[min(calc(100%-2rem),1180px)] p-8 md:p-10 ${className}`}>
      <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
        <div>{left}</div>
        <div className="border-t border-border-subtle pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
          {right}
        </div>
      </div>
    </SurfaceCard>
  );
}
