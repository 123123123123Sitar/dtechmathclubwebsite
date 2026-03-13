import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function DPotD() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center py-20">
      <motion.div
        className="w-[min(calc(100%-2rem),620px)] text-center rounded-3xl border border-border-subtle bg-surface-card backdrop-blur-sm p-10 md:p-14"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Animated icon */}
        <motion.div
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-linear-to-br from-brand/20 to-brand/5 border border-brand/20 grid place-items-center"
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <span className="text-3xl">🔧</span>
        </motion.div>

        <h1 className="text-[clamp(2rem,4vw,3rem)] font-extrabold text-txt mb-4">
          Page Under Construction
        </h1>
        <p className="text-txt-muted leading-relaxed mb-8">
          The d.PotD portal is being rebuilt with a fresh new experience. Check
          back soon for daily math challenges, leaderboards, and more.
        </p>
        <Link
          className="inline-flex items-center px-7 py-3 rounded-full bg-brand text-white font-bold hover:bg-brand-light hover:shadow-lg hover:shadow-brand-glow transition-all duration-200"
          to="/"
        >
          ← Back to Home
        </Link>
      </motion.div>
    </section>
  );
}
