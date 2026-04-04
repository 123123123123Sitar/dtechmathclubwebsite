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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[repeat(auto-fit,minmax(220px,1fr))]">
                  {tier.sponsors.map((sponsor) => {
                    // Map sponsor names to logo filenames
                    const logoMap = {
                      "AoPS": "aops.avif",
                      "Random Math": "randommath.avif",
                      "Texas Instruments": "texas-instruments.avif",
                      "Math Kangaroo": "math-kangaroo.avif",
                      "Atomic Grader": "ag.avif",
                    };
                    const logoFile = logoMap[sponsor.name];
                    return (
                      <a
                        key={sponsor.name}
                        className="block border-t border-border-subtle pt-4 transition-all duration-200 group first:border-t-0 first:pt-0 hover:text-brand flex flex-col items-center text-center"
                        href={sponsor.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {logoFile && (
                          <img
                            src={`/assets/sponsors/${logoFile}`}
                            alt={`${sponsor.name} logo`}
                            className="w-50 h-20 object-contain rounded-xl bg-white border border-border-subtle shadow-sm mb-3 px-6"
                          />
                        )}
                        <span className="mb-1 block font-extrabold text-brand group-hover:text-brand-light text-lg">
                          {sponsor.name}
                        </span>
                        <span className="text-sm leading-snug text-txt-muted group-hover:text-txt">
                          {sponsor.copy}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </SurfaceCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
