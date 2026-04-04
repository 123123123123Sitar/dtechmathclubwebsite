import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import FlowSection from "../components/FlowSection";
import SectionHeader from "../components/SectionHeader";
import SplitPanel from "../components/SplitPanel";
import SponsorSection from "../components/SponsorSection";
import StatBadge from "../components/StatBadge";
import { useDpotdAuth } from "../context/DpotdAuthContext";
import { sponsorTiers } from "../data";

const schedule = [
    ["8:00 AM", "Check In"],
    ["8:30 AM", "Introduction"],
    ["8:45 AM", "Subject Round 1"],
    ["9:45 AM", "Subject Round 2"],
    ["10:30 AM", "Break"],
    ["10:45 AM", "Team Round"],
    ["11:15 AM", "Sequence Round"],
    ["12:15 PM", "Lunch Break"],
    ["12:45 PM", "Activities/Tiebreaks"],
    ["1:25 PM", "Awards & Closing"],
];

const archives2026 = ["Algebra", "Geometry", "Discrete", "6th Grade Test", "Team", "Sequence"];
const archives2025 = ["Individual Round", "Team Round"];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
};

export default function DTMT() {
  const { authReady, profile, user } = useDpotdAuth();
  const hasSignedInAccount = authReady && Boolean(user);
  const isCoachAccount = profile?.accountType === "coach";
  const profilePath = "/profile?view=dtmt";

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
              <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-txt">Design Tech Math Tournament</h1>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start">
              <motion.div
                className="text-txt-muted text-base md:text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <p className="mb-4">The Design Tech Math Club hosts the Design Tech Math Tournament each March as our flagship middle school competition. It is competitive, welcoming, and designed to reward strong mathematical thinking.</p>
                {/* <div className="flex flex-wrap gap-3 text-sm font-semibold text-brand">
                  {["Sunday, March 8", "8:00 AM to 2:00 PM", "Design Tech High School"].map((item, i) => (
                    <span key={i} className="px-4 py-2 rounded-full bg-brand/10 border border-brand/30">{item}</span>
                  ))}
                </div> */}
              </motion.div>
              <motion.div
                className="flex justify-center md:justify-end flex-shrink-0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <img
                  src="/assets/dtmt/logo.png"
                  alt="Design Tech Math Club banner"
                  style={{ maxWidth: 350, height: "auto", display: "block", borderRadius: 16 }}
                />
              </motion.div>
            </div>
          </div>
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
          {/* Temproray disable: Registration has not opened and information have not been finalized */}
          {/* <motion.div className="flex flex-wrap justify-center gap-4 mt-10" {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }}>
            <a
              className="inline-flex items-center px-6 py-3 rounded-full border border-brand text-brand font-bold hover:bg-brand hover:text-white transition-all duration-200"
              href="https://drive.google.com"
              target="_blank"
              rel="noreferrer"
            >
              Competition Handbook
            </a>
            <Link
              className="inline-flex items-center px-6 py-3 rounded-full border border-brand text-brand font-bold hover:bg-brand hover:text-white transition-all duration-200"
              to={profilePath}
            >
              {hasSignedInAccount
                ? isCoachAccount
                  ? "Open DTMT in Profile"
                  : "Open Profile to Sign Up"
                : "Sign In to Register"}
            </Link>
          </motion.div> */}
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
              title="Tournament Details"
              description="Students compete in subject rounds covering Algebra, Geometry, Discrete, and a 6th Grade Test, followed by a Team Round and Sequence Round. The activities session includes Professor Ciprian Manolescu's presentation on Knot Theory, random math problem sets, math jeopardy, and a relay round. Tiebreakers use a Mathcounts-style Countdown round."
            />
          </div>
          <motion.img
            src="/assets/dtmt/opening.jpg"
            alt="DTMT Opening"
            className="rounded-2xl border border-border-subtle shadow-lg w-full h-80 object-cover"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          />
          
        </motion.div>
        </section>
      </FlowSection>

      {/* ── Rounds Overview ───────────────────────────────── */}
      <FlowSection>
        <section className="py-20">
        <div className="w-[min(calc(100%-2rem),1180px)] mx-auto">
          <SectionHeader title="Rounds Overview" />
          <div className="overflow-x-auto">
            <table className="min-w-full border border-border-subtle rounded-2xl bg-white/95 text-left shadow-lg">
              <thead className="bg-brand/10">
                <tr>
                  <th className="px-6 py-4 font-bold text-txt text-lg">Round</th>
                  <th className="px-6 py-4 font-bold text-txt text-lg">Time</th>
                  <th className="px-6 py-4 font-bold text-txt text-lg">Questions</th>
                  <th className="px-6 py-4 font-bold text-txt text-lg">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-border-subtle even:bg-brand/5 hover:bg-brand/10 transition-colors">
                  <td className="px-6 py-4 font-semibold text-txt text-base">Subject Rounds 1 & 2</td>
                  <td className="px-6 py-4 text-txt-muted text-base">45 min each</td>
                  <td className="px-6 py-4 text-txt-muted text-base">10 each</td>
                  <td className="px-6 py-4 text-txt-muted text-base">Students select 2 tests from Algebra, Geometry, Discrete, or the specially designed6th Grade Test.</td>
                </tr>
                <tr className="border-t border-border-subtle even:bg-brand/5 hover:bg-brand/10 transition-colors">
                  <td className="px-6 py-4 font-semibold text-txt text-base">Team Round</td>
                  <td className="px-6 py-4 text-txt-muted text-base">20 min</td>
                  <td className="px-6 py-4 text-txt-muted text-base">10 problems</td>
                  <td className="px-6 py-4 text-txt-muted text-base">Students work in teams to solve collaborative problems.</td>
                </tr>
                <tr className="border-t border-border-subtle even:bg-brand/5 hover:bg-brand/10 transition-colors">
                  <td className="px-6 py-4 font-semibold text-txt text-base">Sequence Round</td>
                  <td className="px-6 py-4 text-txt-muted text-base">45 min</td>
                  <td className="px-6 py-4 text-txt-muted text-base">7 sets of three problems</td>
                  <td className="px-6 py-4 text-txt-muted text-base">In a fast-paced format, students recieve sets after submitting the previous one, featuring a live leaderboard.</td>
                </tr>
                <tr className="border-t border-border-subtle even:bg-brand/5 hover:bg-brand/10 transition-colors">
                  <td className="px-6 py-4 font-semibold text-txt text-base">Tiebreakers</td>
                  <td className="px-6 py-4 text-txt-muted text-base">Varies</td>
                  <td className="px-6 py-4 text-txt-muted text-base">5 problems</td>
                  <td className="px-6 py-4 text-txt-muted text-base">Top competitiors tied will compete in a Mathcounts Countdown-style round to rank participants.</td>
                </tr>
              </tbody>
            </table>
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

      {/* ── Event Gallery ─────────────────────────────────── */}
      <FlowSection>
        <section className="py-20">
        <div className="w-[min(calc(100%-2rem),1180px)] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.img
              src="/assets/dtmt/subject_round.jpg"
              alt="DTMT Subject Round"
              className="rounded-2xl border border-border-subtle shadow-lg w-full h-64 object-cover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
            />
            <motion.img
              src="/assets/dtmt/closing.jpg"
              alt="DTMT Closing"
              className="rounded-2xl border border-border-subtle shadow-lg w-full h-64 object-cover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
            <motion.img
              src="/assets/dtmt/awards.jpg"
              alt="DTMT Awards"
              className="rounded-2xl border border-border-subtle shadow-lg w-full h-64 object-cover"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
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
