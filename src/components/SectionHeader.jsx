import { motion } from "framer-motion";

export default function SectionHeader({
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
      <h2
        className={`m-0 text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-[0.98] tracking-[-0.045em] ${
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
