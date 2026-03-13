import { motion } from "framer-motion";
import { useMemo } from "react";
import SurfaceCard from "./SurfaceCard";

export default function OrbitSponsorSection({ title, description, tiers }) {
  const allSponsors = useMemo(
    () => tiers.flatMap((t) => t.sponsors.map((s) => ({ ...s, tier: t.name }))),
    [tiers],
  );

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background glow */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand/8 rounded-full blur-[120px] pointer-events-none"
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      />

      <div className="w-[min(calc(100%-2rem),1180px)] mx-auto relative z-10">
        <motion.div
          className="max-w-3xl mx-auto text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
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
              initial={{ opacity: 0, y: 30, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, y: 0, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <SurfaceCard className="p-6 transition-all duration-300 hover:border-brand/30">
                <h3 className="mb-5 text-center text-lg font-bold text-brand">
                  {tier.name}
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(240px,1fr))]">
                  {tier.sponsors.map((sponsor, j) => (
                    <motion.a
                      key={sponsor.name}
                      href={sponsor.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group block rounded-2xl border border-[rgba(234,109,74,0.12)] bg-[#fffaf6] p-5 text-center transition-all duration-200 hover:bg-brand hover:border-brand"
                      initial={{ opacity: 0, scale: 0.85, rotateY: -15 }}
                      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.5, delay: i * 0.1 + j * 0.08 }}
                      whileHover={{ y: -4, scale: 1.05 }}
                    >
                      <span className="mb-1 block font-extrabold text-brand group-hover:text-white">
                        {sponsor.name}
                      </span>
                      <span className="text-sm leading-snug text-txt-muted group-hover:text-white/80">
                        {sponsor.copy}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </SurfaceCard>
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
              className="inline-flex items-center rounded-full border border-[rgba(234,109,74,0.14)] bg-white/78 px-5 py-2.5 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white hover:border-brand"
              initial={{ opacity: 0, y: 20, rotateZ: -5 }}
              whileInView={{ opacity: 1, y: 0, rotateZ: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.06 }}
              whileHover={{ scale: 1.08, y: -2 }}
            >
              {s.name}
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
