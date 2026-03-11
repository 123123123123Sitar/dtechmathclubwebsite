import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function EventCard({ title, date, location, accent, imageLabel, to }) {
  const gradients = {
    "accent-dtmt": "from-[#2d79b7] to-[#90c2e7]",
    "accent-dpotd": "from-[#f08f34] to-[#f4ca6d]",
    "accent-puzzle": "from-[#f05a28] to-[#ff996f]",
  };

  return (
    <motion.article
      className="group rounded-3xl overflow-hidden bg-surface-card border border-border-subtle backdrop-blur-sm hover:border-brand/40 transition-all duration-300"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4 }}
    >
      <div
        className={`relative min-h-[200px] bg-linear-to-br ${gradients[accent] || "from-brand to-brand-light"}`}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        <span className="absolute bottom-4 left-5 right-5 text-white text-sm font-medium z-10">
          {imageLabel}
        </span>
      </div>
      <div className="p-5">
        <p className="text-xs font-extrabold tracking-[0.15em] uppercase text-brand mb-2">
          {date}
        </p>
        <h3 className="text-lg font-bold text-txt mb-1">{title}</h3>
        <p className="text-sm text-txt-muted mb-4">{location}</p>
        <div className="flex items-center justify-between gap-4">
          <Link
            to={to}
            className="text-brand font-bold text-sm hover:text-brand-light transition-colors"
          >
            More info →
          </Link>
        </div>
      </div>
    </motion.article>
  );
}
