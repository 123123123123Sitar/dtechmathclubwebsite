import { motion } from "framer-motion";
import FlowSection from "../components/FlowSection";
import HeroMediaPanel from "../components/HeroMediaPanel";
import PageHero from "../components/PageHero";
import SectionHeader from "../components/SectionHeader";
import SplitPanel from "../components/SplitPanel";
import SponsorSection from "../components/SponsorSection";
import { useDpotdAuth } from "../context/DpotdAuthContext";

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
      <section className="relative overflow-hidden pt-28 pb-18">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,109,74,0.22),transparent_28%),radial-gradient(circle_at_top_left,rgba(45,121,183,0.12),transparent_24%),linear-gradient(145deg,#f7f0e8_0%,#f3ece6_42%,#faf6f2_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.22)_0%,transparent_32%,rgba(255,255,255,0.18)_52%,transparent_72%)] opacity-60" />
        <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-white/55 blur-[120px]" />

        <div className="relative z-10 mx-auto w-[min(calc(100%-2rem),1180px)]">
          <div className="relative overflow-hidden rounded-[38px] border border-[rgba(234,109,74,0.16)] bg-[linear-gradient(155deg,rgba(255,255,255,0.86),rgba(255,248,242,0.72))] p-7 shadow-[0_34px_90px_-48px_rgba(49,30,17,0.42)] ring-1 ring-white/40 backdrop-blur-xl before:pointer-events-none before:absolute before:-right-14 before:top-[-72px] before:h-56 before:w-56 before:rounded-full before:bg-brand/12 before:blur-3xl after:pointer-events-none after:absolute after:-left-10 after:bottom-[-88px] after:h-48 after:w-48 after:rounded-full after:bg-[#2d79b7]/10 after:blur-3xl md:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-brand/70 to-transparent" />
            <motion.div
              className="w-full text-center mb-8"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-txt">Design Tech Puzzle Night</h1>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start">
              <motion.p
                className="text-txt-muted text-base md:text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                The Design Tech Math Club hosts an exploration-focused Puzzle Night for middle school students in the Bay Area, featuring interactive puzzle stations that show the fun side of mathematics. This page will be updated with the 2026 Puzzle Night event details closer to the event date.
              </motion.p>
              <motion.div
                className="flex justify-center md:justify-end flex-shrink-0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <img
                  src="/assets/puzzle-night/logo.png"
                  alt="Design Tech Puzzle Night logo"
                  style={{ maxWidth: 400, height: "auto", display: "block", borderRadius: 16 }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <FlowSection>
        <section className="py-8">
          <div className="mx-auto w-[min(calc(100%-2rem),1260px)] rounded-[34px] border border-border-subtle bg-white/90 p-10 shadow-lg">
            <h2 className="text-3xl font-black text-txt mb-6">Interactive stations and prizes</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <img src="/assets/puzzle-night/station1.jpg" alt="Puzzle Night station 1" className="w-full h-[200px] object-cover rounded-2xl border border-white/40 shadow-md" />
              <img src="/assets/puzzle-night/station2.jpg" alt="Puzzle Night station 2" className="w-full h-[200px] object-cover rounded-2xl border border-white/40 shadow-md" />
              <img src="/assets/puzzle-night/station3.jpg" alt="Puzzle Night station 3" className="w-full h-[200px] object-cover rounded-2xl border border-white/40 shadow-md" />
            </div>
            <p className="mb-8 leading-relaxed text-txt-muted">
              Puzzle Night is built as an exploration-focused event where students rotate through engaging mathematical challenges, try unfamiliar ideas, and collaborate in a lower-pressure setting than a formal contest.
            </p>
            <p className="mb-6 leading-relaxed text-txt-muted">
              Exploration activities, estimation, countdown, and raffle energy all live in the same event instead of being broken into separate callouts. Expect logic, modeling, geometry, and collaborative problem solving throughout the evening.
            </p>
          </div>
        </section>
      </FlowSection>

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
              <img
                src="/assets/puzzle-night/countdown_event.jpg"
                alt="Students rotating through logic and modeling stations"
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              <span className="absolute bottom-4 left-5 right-5 text-white text-sm font-medium z-10">
                Countdown event
              </span>
            </motion.div>
            <motion.div
              className="relative min-h-[200px] rounded-3xl overflow-hidden bg-linear-to-br from-[#ffb84d]/30 to-[#ff784f]/20 border border-white/5"
              {...fadeUp}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img
                src="/assets/puzzle-night/raffle.jpg"
                alt="Raffle tickets, puzzles, and collaborative problem solving"
                className="absolute inset-0 w-full h-full object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
              <span className="absolute bottom-4 left-5 right-5 text-white text-sm font-medium z-10">
                Raffle winners
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
        description="The Design Tech Puzzle Night is sponsored by the Art of Problem Solving (AoPS) and Math Kangaroo."
        tiers={puzzleSponsors}
        centered
      />
    </>
  );
}
