export default function BrandWordmark({ className = "", centered = false }) {
  return (
    <div className={`flex w-full ${centered ? "justify-center" : ""} ${className}`}>
      <img
        src="/assets/logos/dtechmathclublogolarger.jpg"
        alt="Design Tech Math Club logo"
        className="w-full max-w-[640px] h-auto block"
      />
    </div>
  );
}
