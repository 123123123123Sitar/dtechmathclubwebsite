import { motion } from "framer-motion";

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  titleClassName = "",
  light = false,
}) {
  const centered = align === "center";

  return (
    <motion.div
      className={`max-w-3xl mb-8 ${centered ? "mx-auto text-center" : ""}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {eyebrow && (
        <p className="mb-3 text-xs font-extrabold tracking-[0.2em] uppercase text-brand">
          {eyebrow}
        </p>
      )}
      <h2
        className={`m-0 text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[0.98] ${
          light ? "text-white" : "text-txt"
        } ${titleClassName}`}
      >
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base leading-relaxed ${light ? "text-white/70" : "text-txt-muted"}`}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
