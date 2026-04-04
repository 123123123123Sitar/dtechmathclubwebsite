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
        <div className="space-y-8">
          {/* Platinum Sponsors - Full Width */}
          {tiers.filter(t => t.name.includes("Platinum")).map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
            >
              <SurfaceCard className="p-8 transition-all duration-300 hover:border-brand/30">
                {!tier.name.includes("Featured") && (
                  <h3 className="mb-8 text-center text-lg font-bold text-brand">
                    {tier.name}
                  </h3>
                )}
                <div className={`grid gap-8 justify-center ${tier.sponsors.length === 1 ? "grid-cols-1 place-items-center" : "grid-cols-1 sm:grid-cols-2"}`}>
                  {tier.sponsors.map((sponsor, j) => {
                    const logoMap = {
                      "AoPS": "aops.avif",
                      "Random Math": "randommath.avif",
                      "Texas Instruments": "texas-instruments.avif",
                      "Math Kangaroo": "math-kangaroo.avif",
                      "Atomic Grader": "ag.avif",
                    };
                    const logoFile = logoMap[sponsor.name];
                    return (
                      <motion.a
                        key={sponsor.name}
                        href={sponsor.href}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex flex-col items-center text-center transition-all duration-200 hover:opacity-80"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.5, delay: i * 0.1 + j * 0.05 }}
                      >
                        {logoFile && (
                          <img
                            src={`/assets/sponsors/${logoFile}`}
                            alt={`${sponsor.name} logo`}
                            className="h-24 w-auto object-contain mb-2 opacity-75 group-hover:opacity-100 transition-opacity duration-200"
                          />
                        )}
                        <span className="block font-semibold text-txt text-sm group-hover:text-brand transition-colors duration-200">
                          {sponsor.name}
                        </span>
                      </motion.a>
                    );
                  })}
                </div>
              </SurfaceCard>
            </motion.div>
          ))}

          {/* Diamond and Gold Sponsors - Side by Side */}
          <div className="grid md:grid-cols-2 gap-8">
            {tiers.filter(t => !t.name.includes("Platinum")).map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: (i + 1) * 0.15 }}
              >
                <SurfaceCard className="p-8 transition-all duration-300 hover:border-brand/30 h-full flex flex-col">
                  {!tier.name.includes("Featured") && (
                    <h3 className="mb-6 text-center text-lg font-bold text-brand">
                      {tier.name}
                    </h3>
                  )}
                  <div className={`grid gap-6 flex-1 ${tier.sponsors.length === 1 ? "grid-cols-1 place-items-center" : "grid-cols-2 place-items-center"} mx-auto`}>
                    {tier.sponsors.map((sponsor, j) => {
                      const logoMap = {
                        "AoPS": "aops.avif",
                        "Random Math": "randommath.avif",
                        "Texas Instruments": "texas-instruments.avif",
                        "Math Kangaroo": "math-kangaroo.avif",
                        "Atomic Grader": "ag.avif",
                      };
                      const logoFile = logoMap[sponsor.name];
                      return (
                        <motion.a
                          key={sponsor.name}
                          href={sponsor.href}
                          target="_blank"
                          rel="noreferrer"
                          className="group flex flex-col items-center text-center transition-all duration-200 hover:opacity-80"
                          initial={{ opacity: 0, scale: 0.9 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{ duration: 0.5, delay: i * 0.1 + j * 0.05 }}
                        >
                          {logoFile && (
                            <img
                              src={`/assets/sponsors/${logoFile}`}
                              alt={`${sponsor.name} logo`}
                              className="h-16 w-auto object-contain mb-2 opacity-75 group-hover:opacity-100 transition-opacity duration-200"
                            />
                          )}
                          <span className="block font-semibold text-txt text-sm group-hover:text-brand transition-colors duration-200">
                            {sponsor.name}
                          </span>
                        </motion.a>
                      );
                    })}
                  </div>
                </SurfaceCard>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating sponsor pills removed as requested */}
      </div>
    </section>
  );
}
