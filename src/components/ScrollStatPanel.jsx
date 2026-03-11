import { motion } from "framer-motion";

export default function ScrollStatPanel({ value, label, direction = "left" }) {
  return (
    <motion.div
      className="w-screen ml-[calc(50%-50vw)] min-h-[44vh] flex items-center justify-center overflow-hidden bg-linear-to-r from-brand-dark via-brand to-brand-light text-white"
      initial={{ opacity: 0, x: direction === "left" ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="grid gap-2 text-center p-8">
        <span className="text-[clamp(4rem,12vw,8rem)] font-extrabold leading-none">
          {value}
        </span>
        <span className="text-[clamp(1.2rem,2.5vw,2rem)] font-bold tracking-wider uppercase">
          {label}
        </span>
      </div>
    </motion.div>
  );
}
