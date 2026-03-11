import { motion } from "framer-motion";
import { useRef } from "react";

export default function ScrollReveal({ children, direction = "left", className = "" }) {
  const ref = useRef(null);
  const xStart = direction === "left" ? -60 : 60;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: xStart, scale: 0.96 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
