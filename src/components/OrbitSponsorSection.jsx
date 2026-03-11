import { motion } from "framer-motion";
import { useMemo } from "react";

export default function OrbitSponsorSection({ title, description, tiers }) {
  const allSponsors = useMemo(
    () => tiers.flatMap((t) => t.sponsors.map((s) => ({ ...s, tier: t.name }))),
    [tiers],
  );

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-[min(calc(100%-2rem),1180px)] mx-auto relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-xs font-extrabold tracking-[0.2em] uppercase text-brand">
            Partners
          </p>
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-tight text-txt">
            {title}
          </h2>
          <p className="mt-4 text-txt-muted leading-relaxed">{description}</p>
        </motion.div>

        {/* Tier cards */}
        <div className="grid gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              className="rounded-3xl border border-border-subtle bg-surface-card backdrop-blur-sm p-6 hover:border-brand/30 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <h3 className="text-center text-lg font-bold text-brand mb-5">
                {tier.name}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
                {tier.sponsors.map((sponsor, j) => (
                  <motion.a
                    key={sponsor.name}
                    href={sponsor.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group block text-center p-5 rounded-2xl border border-border-accent bg-surface-3 hover:bg-brand hover:border-brand transition-all duration-200"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 + j * 0.08 }}
                    whileHover={{ y: -2 }}
                  >
                    <span className="block font-extrabold text-brand group-hover:text-white mb-1">
                      {sponsor.name}
                    </span>
                    <span className="text-sm text-txt-muted group-hover:text-white/80 leading-snug">
                      {sponsor.copy}
                    </span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating sponsor pills */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          {allSponsors.map((s, i) => (
            <motion.a
              key={s.name}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-5 py-2.5 rounded-full border border-border-accent bg-surface-3 text-brand font-bold text-sm hover:bg-brand hover:text-white hover:border-brand transition-all duration-200"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
              whileHover={{ scale: 1.05 }}
            >
              {s.name}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
