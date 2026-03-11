export default function BrandWordmark({ className = "", centered = false, invert = false }) {
  const classes = [
    "brand-wordmark",
    centered ? "brand-wordmark-centered" : "",
    invert ? "brand-wordmark-invert" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <img src="/dtechmathclublogolarger.avif" alt="Design Tech Math Club logo" />
    </div>
  );
}
