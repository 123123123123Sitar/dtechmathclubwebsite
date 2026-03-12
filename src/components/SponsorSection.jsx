import { motion } from "framer-motion";

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
              className="rounded-3xl border border-border-subtle bg-surface-card backdrop-blur-sm p-6 hover:border-brand/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <h3 className="text-lg font-bold text-brand mb-4">{tier.name}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3">
                {tier.sponsors.map((sponsor) => (
                  <a
                    key={sponsor.name}
                    className="block p-4 rounded-2xl border border-border-accent bg-surface-3 hover:bg-brand hover:border-brand group transition-all duration-200"
                    href={sponsor.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="block font-extrabold text-brand group-hover:text-white mb-1">
                      {sponsor.name}
                    </span>
                    <span className="text-sm text-txt-muted group-hover:text-white/80 leading-snug">
                      {sponsor.copy}
                    </span>
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
