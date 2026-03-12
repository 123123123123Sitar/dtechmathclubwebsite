import { motion } from "framer-motion";

export default function FlowSection({
  as: Tag = "section",
  className = "",
  glow = "brand",
  children,
}) {
  const glowClasses =
    glow === "muted"
      ? "before:from-surface before:via-surface-2/70 before:to-transparent after:from-transparent after:via-surface-2/60 after:to-surface"
      : "before:from-transparent before:via-brand/8 before:to-transparent after:from-transparent after:via-brand/6 after:to-transparent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={`relative overflow-hidden before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-24 before:bg-linear-to-b before:blur-3xl after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-24 after:bg-linear-to-t after:blur-3xl ${glowClasses} ${className}`}
    >
      <Tag className="relative z-10">{children}</Tag>
    </motion.div>
  );
}
