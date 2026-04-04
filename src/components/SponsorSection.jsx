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

        <div className="space-y-8">
          {/* Platinum Sponsors - Full Width */}
          {tiers.filter(t => t.name.includes("Platinum")).map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <SurfaceCard className="p-8 transition-all duration-300 hover:border-brand/30">
                <h3 className="mb-8 text-center text-lg font-bold text-brand">{tier.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center">
                  {tier.sponsors.map((sponsor) => {
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
                        className="flex flex-col items-center text-center transition-all duration-200 group hover:opacity-80"
                        href={sponsor.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {logoFile && (
                          <img
                            src={`/assets/sponsors/${logoFile}`}
                            alt={`${sponsor.name} logo`}
                            className="h-24 w-auto object-contain mb-3 opacity-75 group-hover:opacity-100 transition-opacity duration-200"
                          />
                        )}
                        <span className="block font-semibold text-txt text-sm mb-1 group-hover:text-brand transition-colors duration-200">
                          {sponsor.name}
                        </span>
                        <span className="text-xs leading-snug text-txt-muted group-hover:text-txt">
                          {sponsor.copy}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </SurfaceCard>
            </motion.div>
          ))}

          {/* Diamond and Gold Sponsors - Side by Side */}
          <div className={`grid gap-8 ${tiers.filter(t => !t.name.includes("Platinum")).some(t => t.name.includes("Featured")) ? "max-w-2xl mx-auto w-full" : "grid-cols-2"} ${tiers.filter(t => !t.name.includes("Platinum")).length > 1 && !tiers.filter(t => !t.name.includes("Platinum"))[0]?.name.includes("Featured") ? "md:grid-cols-2" : ""}`}>
            {tiers.filter(t => !t.name.includes("Platinum")).map((tier, i) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i + 1) * 0.1 }}
              >
                <SurfaceCard className="p-8 transition-all duration-300 hover:border-brand/30 h-full flex flex-col">
                  {!tier.name.includes("Featured") && (
                    <h3 className="mb-6 text-center text-lg font-bold text-brand">{tier.name}</h3>
                  )}
                  <div className={`grid gap-6 flex-1 ${tier.sponsors.length === 1 ? "grid-cols-1 place-items-center" : "grid-cols-2 place-items-center"}  mx-auto`}>
                    {tier.sponsors.map((sponsor) => {
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
                          className="flex flex-col items-center text-center transition-all duration-200 group hover:opacity-80"
                          href={sponsor.href}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {logoFile && (
                            <img
                              src={`/assets/sponsors/${logoFile}`}
                              alt={`${sponsor.name} logo`}
                              className="h-16 w-auto object-contain mb-3 opacity-75 group-hover:opacity-100 transition-opacity duration-200"
                            />
                          )}
                          <span className="block font-semibold text-txt text-sm mb-1 group-hover:text-brand transition-colors duration-200">
                            {sponsor.name}
                          </span>
                          <span className="text-xs leading-snug text-txt-muted group-hover:text-txt">
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
      </div>
    </section>
  );
}
