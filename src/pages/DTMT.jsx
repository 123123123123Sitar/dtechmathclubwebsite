import { motion } from "framer-motion";
import FlowSection from "../components/FlowSection";
import SectionHeader from "../components/SectionHeader";
import SponsorSection from "../components/SponsorSection";
import StatBadge from "../components/StatBadge";
import { sponsorTiers } from "../data";

const schedule = [
  ["8:00 AM", "Check-in, breakfast, and campus arrival"],
  ["8:30 AM", "Opening remarks and rules briefing"],
  ["9:00 AM", "Subject rounds begin"],
  ["10:45 AM", "Team round"],
  ["11:30 AM", "Lunch and speaker session"],
  ["12:15 PM", "Sequence round, relay activities, and math jeopardy"],
  ["1:15 PM", "Countdown tiebreakers if needed"],
  ["1:30 PM", "Awards ceremony and closing"],
];

const archives2026 = ["Algebra", "Geometry", "Discrete", "6th Grade Test", "Team", "Sequence"];
const archives2025 = ["Individual Round", "Team Round"];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

export default function DTMT() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#0d1a2d] via-surface to-[#1a1008]" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="relative z-10 w-[min(calc(100%-2rem),1180px)] mx-auto text-center">
          <SectionHeader
            eyebrow="Signature Competition"
            title="Design Tech Math Tournament"
            description="The Design Tech Math Club is hosting our biggest competition of the year, the Design Tech Math Tournament (DTMT), on March 8th. This is a competitive yet welcoming event for middle school students in the Bay Area."
            align="center"
            titleClassName="whitespace-nowrap text-[clamp(1.9rem,3.6vw,3.5rem)]"
          />

          {/* Info bar */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 w-[min(92%,1000px)] mx-auto mt-8 px-6 sm:px-10 py-5 rounded-2xl bg-linear-to-r from-brand to-brand-dark border border-white/10 shadow-2xl shadow-brand-glow/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {["Sunday, March 8", "8:00 AM to 2:00 PM", "Design Tech High School"].map(
              (text) => (
                <span
                  key={text}
                  className="flex-1 text-center text-white font-extrabold text-sm sm:text-base"
                >
                  {text}
                </span>
              ),
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────── */}
      <FlowSection>
        <section className="py-20">
        <div className="w-[min(calc(100%-2rem),1180px)] mx-auto">
          <div className="grid grid-cols-3 gap-4 justify-items-center max-w-[600px] mx-auto">
            <StatBadge value="4" label="Rounds" />
            <StatBadge value="2" label="Speaker Session" />
            <StatBadge value="$3k" label="In Prizes" />
          </div>
          <motion.div
            className="flex flex-wrap justify-center gap-4 mt-10"
            {...fadeUp}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a
              className="inline-flex items-center px-6 py-3 rounded-full border border-brand text-brand font-bold hover:bg-brand hover:text-white transition-all duration-200"
              href="https://drive.google.com"
              target="_blank"
              rel="noreferrer"
            >
              Competition Handbook
            </a>
            <a
              className="inline-flex items-center px-6 py-3 rounded-full border border-brand text-brand font-bold hover:bg-brand hover:text-white transition-all duration-200"
              href="https://forms.gle"
              target="_blank"
              rel="noreferrer"
            >
              Register Now!
            </a>
          </motion.div>
        </div>
        </section>
      </FlowSection>

      {/* ── Details ───────────────────────────────────────── */}
      <FlowSection>
        <section className="py-20">
        <motion.div
          className="w-[min(calc(100%-2rem),1180px)] mx-auto rounded-3xl border border-border-subtle bg-surface-card backdrop-blur-sm p-8 grid md:grid-cols-2 gap-8 items-center"
          {...fadeUp}
          transition={{ duration: 0.5 }}
        >
          <div>
            <SectionHeader
              eyebrow="Format"
              title="Tournament Details"
              description="Students compete in subject rounds covering Algebra, Geometry, Discrete, and a 6th Grade Test, followed by a Team Round and Sequence Round. The activities session includes Professor Ciprian Manolescu's presentation on Knot Theory, random math problem sets, math jeopardy, and a relay round. Tiebreakers use a Mathcounts-style Countdown round."
            />
          </div>
          <div className="rounded-2xl border border-border-accent bg-surface-3 p-6">
            <p className="text-xs font-extrabold tracking-[0.2em] uppercase text-brand mb-2">
              Registration
            </p>
            <h3 className="text-2xl font-extrabold text-txt mb-3">Closed</h3>
            <p className="text-txt-muted text-sm">Deadline: March 3rd</p>
            <p className="text-txt-muted text-sm">Fee: $10</p>
          </div>
        </motion.div>
        </section>
      </FlowSection>

      {/* ── Schedule ──────────────────────────────────────── */}
      <FlowSection glow="muted">
        <section className="py-20 relative">
        <div className="absolute inset-0 bg-surface-2/50" />
        <div className="relative z-10 w-[min(calc(100%-2rem),1180px)] mx-auto">
          <SectionHeader eyebrow="Day Of" title="Schedule" />
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
      </FlowSection>

      {/* ── Archives ──────────────────────────────────────── */}
      <FlowSection>
        <section className="py-20">
        <div className="w-[min(calc(100%-2rem),1180px)] mx-auto">
          <SectionHeader eyebrow="Archive" title="Problems and Solutions" />
          <div className="grid md:grid-cols-2 gap-5">
            <ArchiveCard title="DTMT 2026 Problems and Solutions" entries={archives2026} />
            <ArchiveCard title="DTMT 2025 Problems and Solutions" entries={archives2025} />
          </div>
        </div>
        </section>
      </FlowSection>

      {/* ── Sponsors ──────────────────────────────────────── */}
      <SponsorSection
        title="Our Sponsors"
        description="The Design Tech Math Tournament is sponsored by the following companies. We are grateful for their support, helping to fund this competition and our club activities."
        tiers={sponsorTiers}
        centered
      />
    </>
  );
}

function ArchiveCard({ title, entries }) {
  return (
    <motion.div
      className="rounded-3xl border border-border-subtle bg-surface-card backdrop-blur-sm p-6"
      {...{
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 },
      }}
    >
      <h3 className="text-lg font-bold text-txt mb-4">{title}</h3>
      {entries.map((entry) => (
        <div
          key={entry}
          className="flex items-center justify-between gap-4 py-3 border-t border-border-subtle first:border-0 hover:text-brand transition-colors"
        >
          <span className="text-txt-muted">{entry}</span>
          <div className="flex gap-4">
            <a
              href="https://drive.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-brand font-bold text-sm hover:text-brand-light transition-colors"
            >
              Problems
            </a>
            <a
              href="https://drive.google.com"
              target="_blank"
              rel="noreferrer"
              className="text-brand font-bold text-sm hover:text-brand-light transition-colors"
            >
              Solutions
            </a>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
