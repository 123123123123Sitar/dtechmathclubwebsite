import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import FlowSection from "../components/FlowSection";
import HeroMediaPanel from "../components/HeroMediaPanel";
import PageHero from "../components/PageHero";
import SectionHeader from "../components/SectionHeader";
import SplitPanel from "../components/SplitPanel";
import SponsorSection from "../components/SponsorSection";
import StatBadge from "../components/StatBadge";
import { useDpotdAuth } from "../context/DpotdAuthContext";
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
  const { authReady, profile, user } = useDpotdAuth();
  const hasSignedInAccount = authReady && Boolean(user);
  const isCoachAccount = profile?.accountType === "coach";
  const profilePath = "/profile?view=dtmt";

  return (
    <>
      <PageHero
        actions={[
          {
            label: hasSignedInAccount
              ? isCoachAccount
                ? "Open Profile for DTMT"
                : "Open Profile to Sign Up"
              : "Sign In to Register",
            to: profilePath,
          },
          { label: "Open Profile", to: "/profile", variant: "ghost" },
        ]}
        align="center"
        aside={
          <HeroMediaPanel
            alt="Design Tech Math Club banner"
            badge="DTMT"
            caption="A full competition day with subject rounds, team events, speakers, and awards at Design Tech High School."
            imageClassName="object-contain p-8 md:p-10"
            src="/dtechmathclublogolarger.jpg"
          />
        }
        description="The Design Tech Math Club hosts the Design Tech Math Tournament each March as our flagship middle school competition. It is competitive, welcoming, and designed to reward strong mathematical thinking."
        highlights={["Sunday, March 8", "8:00 AM to 2:00 PM", "Design Tech High School"]}
        title="Design Tech Math Tournament"
        titleClassName="whitespace-nowrap text-[clamp(1.9rem,3.6vw,3.5rem)]"
      />

      <FlowSection>
        <section className="py-8">
          <SplitPanel
            left={
              <>
                <h2 className="text-3xl font-black text-txt">Tournament overview</h2>
                <p className="mt-4 leading-relaxed text-txt-muted">
                  DTMT is the club&apos;s flagship middle school event, combining strong subject
                  rounds with team-based collaboration, community-building, and recognition for
                  outstanding mathematical performance.
                </p>
              </>
            }
            right={
              <>
                <h2 className="text-3xl font-black text-txt">Registration details</h2>
                <p className="mt-4 leading-relaxed text-txt-muted">Registration status: Closed</p>
                <div className="mt-5 border-t border-border-subtle pt-4 leading-relaxed text-txt-muted">
                  Deadline: March 3. Entry fee: $10.
                </div>
              </>
            }
          />
        </section>
      </FlowSection>

      {/* ── Stats ─────────────────────────────────────────── */}
      <FlowSection>
        <section className="py-20">
        <div className="w-[min(calc(100%-2rem),1180px)] mx-auto">
          <div className="grid grid-cols-3 gap-4 justify-items-center max-w-[600px] mx-auto">
            <StatBadge value="4" label="Rounds" />
            <StatBadge value="2" label="Speaker Session" />
            <StatBadge value="$3k" label="In Prizes" />
          </div>
          <motion.div className="flex flex-wrap justify-center gap-4 mt-10" {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }}>
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
              title="Tournament Details"
              description="Students compete in subject rounds covering Algebra, Geometry, Discrete, and a 6th Grade Test, followed by a Team Round and Sequence Round. The activities session includes Professor Ciprian Manolescu's presentation on Knot Theory, random math problem sets, math jeopardy, and a relay round. Tiebreakers use a Mathcounts-style Countdown round."
            />
          </div>
          <div className="border-t border-border-subtle pt-5 md:border-t-0 md:border-l md:pl-8">
            <h3 className="text-2xl font-extrabold text-txt">Competition Day</h3>
            <p className="text-txt-muted text-sm">Subject rounds, team rounds, speaker session, and awards</p>
          </div>
        </motion.div>
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

      {/* ── Archives ──────────────────────────────────────── */}
      <FlowSection>
        <section className="py-20">
        <div className="w-[min(calc(100%-2rem),1180px)] mx-auto">
          <SectionHeader title="Problems and Solutions" />
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
