import { motion } from "framer-motion";
import SurfaceCard from "./SurfaceCard";

export default function SponsorSection({ title, description, tiers, centered = false }) {
  return (
    <section className="py-20">
      <div className="w-[min(calc(100%-2rem),1180px)] mx-auto">
        <motion.div
          className={`max-w-3xl mb-8 ${centered ? "mx-auto text-center" : ""}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold leading-tight text-txt">
            {title}
          </h2>
          <p className="mt-4 text-txt-muted leading-relaxed">{description}</p>
        </motion.div>

        <div className="grid gap-4">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <SurfaceCard className="p-6 transition-all duration-300 hover:border-brand/30">
                <h3 className="mb-4 text-lg font-bold text-brand">{tier.name}</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
                  {tier.sponsors.map((sponsor) => (
                    <a
                      key={sponsor.name}
                      className="block rounded-2xl border border-[rgba(234,109,74,0.12)] bg-[#fffaf6] p-4 transition-all duration-200 hover:bg-brand hover:border-brand group"
                      href={sponsor.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <span className="mb-1 block font-extrabold text-brand group-hover:text-white">
                        {sponsor.name}
                      </span>
                      <span className="text-sm leading-snug text-txt-muted group-hover:text-white/80">
                        {sponsor.copy}
                      </span>
                    </a>
                  ))}
                </div>
              </SurfaceCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
