import { motion } from "framer-motion";
import FlowSection from "../components/FlowSection";
import PageHero from "../components/PageHero";
import SectionHeader from "../components/SectionHeader";
import SponsorSection from "../components/SponsorSection";
import SurfaceCard from "../components/SurfaceCard";

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
      <PageHero
        align="center"
        aside={
          <SurfaceCard className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="grid min-h-[96px] min-w-[96px] place-items-center rounded-2xl bg-linear-to-br from-[#ffcb57] to-brand text-sm font-extrabold text-white">
                Puzzle Night
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-txt">Interactive stations and prizes</h3>
                <p className="mt-1 text-sm text-txt-muted">
                  Exploration, raffle energy, and a sponsor-supported math night atmosphere.
                </p>
              </div>
            </div>
          </SurfaceCard>
        }
        description="The Design Tech Math Club hosts an exploration-focused Puzzle Night for middle school students in the Bay Area. The event features interactive puzzle stations that show the fun side of mathematics."
        eyebrow="Community Event"
        highlights={["Logic and modeling", "Interactive stations", "Raffle and prizes"]}
        title="Design Tech Puzzle Night"
      />

      {/* ── Message ───────────────────────────────────────── */}
      <FlowSection>
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
      </FlowSection>

      {/* ── Activities ────────────────────────────────────── */}
      <FlowSection>
        <section className="py-20">
        <div className="w-[min(calc(100%-2rem),1180px)] mx-auto grid md:grid-cols-2 gap-10">
          <div>
            <SectionHeader
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
      </FlowSection>

      {/* ── Schedule ──────────────────────────────────────── */}
      <FlowSection glow="muted">
        <section className="py-20 relative">
        <div className="absolute inset-0 bg-surface-2/50" />
        <div className="relative z-10 w-[min(calc(100%-2rem),1180px)] mx-auto">
          <SectionHeader title="Schedule" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
      </FlowSection>

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
