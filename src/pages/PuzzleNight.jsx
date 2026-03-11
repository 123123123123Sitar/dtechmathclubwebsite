import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import SponsorSection from "../components/SponsorSection";

const puzzleSponsors = [
  {
    name: "Featured Sponsors",
    sponsors: [
      {
        name: "AoPS",
        href: "https://artofproblemsolving.com",
        copy: "Textbooks, online courses, and a math community for curious students.",
      },
      {
        name: "Math Kangaroo",
        href: "https://mathkangaroo.org",
        copy: "Contest experiences that make mathematical thinking more approachable.",
      },
    ],
  },
];

const schedule = [
  ["4:15 PM - 4:30 PM", "Arrive and Check In"],
  ["4:30 PM - 4:45 PM", "Welcome and Introduction"],
  ["4:45 PM - 6:30 PM", "Exploration activities"],
  ["5:00 PM - 5:30 PM", "Estimation round"],
  ["5:45 PM - 6:15 PM", "Countdown round"],
  ["5:45 PM", "Snacks"],
  ["6:30 PM - 7:00 PM", "Raffle and Closing"],
];

const stations = [
  "Pattern and Sequences",
  "Word Problems",
  "Logic Puzzles",
  "Grid Puzzles",
  "Math Modeling",
  "Geometry",
  "Math Kangaroo Problems",
  "AMC Style Problems",
  "Countdown",
  "Estimation",
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

export default function PuzzleNight() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#1a0f0a] via-surface to-[#0d1a2d]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[400px] bg-brand/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 w-[min(calc(100%-2rem),1180px)] mx-auto text-center">
          <SectionHeader
            eyebrow="Community Event"
            title="Design Tech Puzzle Night"
            description="The Design Math Club hosts an exploration-focused Puzzle Night for Middle Schoolers in the Bay Area during late November. The Puzzle Night features a variety of interactive puzzle stations, each offering a different way to explore the fun side of mathematics."
            align="center"
          />

          {/* Banner */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-5 mt-8 rounded-3xl border border-border-subtle bg-surface-card backdrop-blur-sm p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="min-w-[100px] min-h-[100px] rounded-2xl bg-linear-to-br from-[#ffcb57] to-brand grid place-items-center text-white font-extrabold text-sm">
              Puzzle Night
            </div>
            <div className="text-left">
              <h3 className="text-lg font-bold text-txt">
                Interactive stations, prizes, and AoPS support
              </h3>
              <p className="text-sm text-txt-muted mt-1">
                Promotional banner recreation with sponsor callout and event branding.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Message ───────────────────────────────────────── */}
      <section className="py-12">
        <motion.div
          className="w-[min(calc(100%-2rem),1180px)] mx-auto text-center"
          {...fadeUp}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-brand text-[clamp(1.3rem,2.3vw,2rem)] font-extrabold">
            We hope you had a good time at Puzzle Night!
          </h2>
        </motion.div>
      </section>

      {/* ── Activities ────────────────────────────────────── */}
      <section className="py-20">
        <div className="w-[min(calc(100%-2rem),1180px)] mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <SectionHeader
              eyebrow="Activities"
              title="Activities and Stations"
              description="We are offering the following activities and stations."
            />
            <div className="grid grid-cols-2 gap-3">
              {stations.map((station, i) => (
                <motion.span
                  key={station}
                  className="px-4 py-3 rounded-xl border border-border-accent bg-surface-3 text-sm font-semibold text-txt hover:bg-brand hover:text-white hover:border-brand transition-all duration-200 cursor-default"
                  {...fadeUp}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  {station}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <motion.div
              className="relative min-h-[200px] rounded-3xl overflow-hidden bg-linear-to-br from-[#2f9cdc]/30 to-[#78d0ef]/20 border border-white/5"
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              <span className="absolute bottom-4 left-5 right-5 text-white text-sm font-medium z-10">
                Students rotating through logic and modeling stations
              </span>
            </motion.div>
            <motion.div
              className="relative min-h-[200px] rounded-3xl overflow-hidden bg-linear-to-br from-[#ffb84d]/30 to-[#ff784f]/20 border border-white/5"
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              <span className="absolute bottom-4 left-5 right-5 text-white text-sm font-medium z-10">
                Raffle tickets, puzzles, and collaborative problem solving
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Schedule ──────────────────────────────────────── */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-surface-2/50" />
        <div className="relative z-10 w-[min(calc(100%-2rem),1180px)] mx-auto">
          <SectionHeader eyebrow="Timeline" title="Schedule" />
          <div className="grid gap-3">
            {schedule.map(([time, detail], i) => (
              <motion.div
                key={`${time}-${detail}`}
                className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-3 p-4 rounded-2xl border border-border-subtle bg-surface-card backdrop-blur-sm hover:border-brand/30 hover:bg-brand/5 transition-all duration-200"
                {...fadeUp}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <div className="font-extrabold text-brand">{time}</div>
                <div className="text-txt-muted">{detail}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sponsors ──────────────────────────────────────── */}
      <SponsorSection
        title="Sponsors"
        description="The Design Tech Math Club and Design Tech Puzzle Night last year were sponsored by the Art of Problem Solving (AoPS) and Math Kangaroo."
        tiers={puzzleSponsors}
        centered
      />
    </>
  );
}
