import FlowSection from "../components/FlowSection";
import SectionHeader from "../components/SectionHeader";
import { motion } from "framer-motion";

const drive = (id) => `https://drive.google.com/file/d/${id}/view`;

const archives2026 = [
  {
    name: "Algebra",
    problems: drive("15wH6ORK2S4kaFEfjWxSUlejc5lc-6f5G"),
    solutions: "/assets/dtmt/archive/2026-algebra-solutions.pdf",
  },
  {
    name: "Geometry",
    problems: drive("1v5RDvRHFllWVv3o9slsrz0gRfLOPcwl-"),
    solutions: drive("1NZd41N8rMMFS61wi0aTaWa44og8aO10R"),
  },
  {
    name: "Discrete",
    problems: drive("1ij97Sc4_XIK2iC45UwFeiHWy1tOdiyX2"),
    solutions: drive("1uIrLh-cv9IIgez3UxH4ZAY0JrN32RQBr"),
  },
  {
    name: "6th Grade Test",
    problems: drive("1UrJd2jjgvpxh7vsrZKlfV9vVgym702jQ"),
    solutions: drive("1JBNHJNn1YOBQtWjmSVSp_BsOLveFS9Mr"),
  },
  {
    name: "Team",
    problems: drive("1wclzTDfHe2ZSEueRSvtsEi-Z_Rq1oNI8"),
    solutions: drive("1hzU3QNywxLZlB0hegZ30djgTzkhTx9fJ"),
  },
  {
    name: "Sequence",
    problems: drive("1U7tR2O4TYNpoCxh892AtXZLW6FDePiaQ"),
    solutions: drive("1ruSR5DgngzviJhcwlDxwgO3AnvEnccTW"),
  },
];

const archives2025 = [
  {
    name: "Individual Round",
    problems: drive("14H6hm1u4a7zi7L0bWsRPRKBOPUL8YE2p"),
    solutions: drive("1HM19lRtbK7obhUKhPKf5HuHEoT82Kb23"),
  },
  {
    name: "Team Round",
    problems: drive("14QNT5_sCKuxSLrM8dIrT3r8nBmIj9Xjq"),
    solutions: drive("1rcgybCHjNbA5x1ElU-TXEplPc73u48LF"),
  },
];

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
          key={entry.name}
          className="flex items-center justify-between gap-4 py-3 border-t border-border-subtle first:border-0 hover:text-brand transition-colors"
        >
          <span className="text-txt-muted">{entry.name}</span>
          <div className="flex gap-4">
            <a
              href={entry.problems}
              target="_blank"
              rel="noreferrer"
              className="text-brand font-bold text-sm hover:text-brand-light transition-colors"
            >
              Problems
            </a>
            <a
              href={entry.solutions}
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
