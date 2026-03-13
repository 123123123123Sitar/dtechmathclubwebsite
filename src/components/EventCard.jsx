import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SurfaceCard from "./SurfaceCard";

export default function EventCard({ title, date, location, accent, imageLabel, to }) {
  const gradients = {
    "accent-dtmt": "from-[#2d79b7] via-[#6aaae4] to-[#d8e8f6]",
    "accent-dpotd": "from-[#f08f34] via-[#f0b24d] to-[#fff0c4]",
    "accent-puzzle": "from-[#f05a28] via-[#ff8c62] to-[#ffd5be]",
  };

  return (
    <motion.article
      className="group"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      whileHover={{ y: -4 }}
    >
      <SurfaceCard className="overflow-hidden transition-all duration-300 group-hover:border-brand/35">
        <div
          className={`relative min-h-[220px] bg-linear-to-br ${gradients[accent] || "from-brand to-brand-light"}`}
        >
          <div className="absolute inset-0 bg-linear-to-t from-[#23140d]/65 via-[#23140d]/15 to-transparent" />
          <div className="absolute left-5 top-5 rounded-full border border-white/35 bg-white/18 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-white backdrop-blur-md">
            {date}
          </div>
          <span className="absolute bottom-4 left-5 right-5 text-sm font-medium text-white z-10">
            {imageLabel}
          </span>
        </div>
        <div className="p-6">
          <h3 className="mb-2 text-xl font-black text-txt">{title}</h3>
          <p className="mb-5 text-sm leading-relaxed text-txt-muted">{location}</p>
          <Link
            className="inline-flex items-center rounded-full border border-brand px-4 py-2 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
            to={to}
          >
            More info
          </Link>
        </div>
      </SurfaceCard>
    </motion.article>
  );
}
