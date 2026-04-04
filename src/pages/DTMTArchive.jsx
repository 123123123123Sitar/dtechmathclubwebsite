import FlowSection from "../components/FlowSection";
import SectionHeader from "../components/SectionHeader";
import { motion } from "framer-motion";

const archives2026 = ["Algebra", "Geometry", "Discrete", "6th Grade Test", "Team", "Sequence"];
const archives2025 = ["Individual Round", "Team Round"];

export default function DTMTArchive() {
  return (
    <>
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
