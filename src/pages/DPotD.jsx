import { motion } from "framer-motion";
import FlowSection from "../components/FlowSection";
import SectionHeader from "../components/SectionHeader";
import {
  dpotdHighlights,
} from "../content/dpotd";

export default function DPotD() {
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
              <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-txt">Design Tech Problem of the Day Challenge</h1>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start">
              <motion.p
                className="text-txt-muted text-base md:text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                The Design Tech Problems of the Day Challenge is an online math competition for middle school students leading into DTMT. Over five days, students receive three problems each day, including one proof-based question, and have one hour to solve them. Students register individually through their own accounts.
              </motion.p>
              <motion.div
                className="flex justify-center md:justify-end flex-shrink-0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <img
                  src="/assets/dpotd/logo.png"
                  alt="D.PotD logo"
                  style={{ maxWidth: 350, height: "auto", display: "block", borderRadius: 16 }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <FlowSection glow="muted">
        <section className="py-16">
          <div className="mx-auto grid w-[min(calc(100%-2rem),1180px)] gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {dpotdHighlights.map((item) => (
              <article
                key={item.label}
                className="rounded-[28px] border border-border-subtle bg-surface-card px-6 py-7 text-center"
              >
                <p className="text-3xl font-black text-brand">{item.value}</p>
                <p className="mt-2 text-sm font-semibold text-txt-muted">{item.label}</p>
              </article>
            ))}
          </div>
        </section>
      </FlowSection>

      <FlowSection>
        <section className="py-18">
          <div className="mx-auto w-[min(calc(100%-2rem),1180px)]">
            <SectionHeader
              title="Challenge Structure"
              description="The D.PotD portal is designed to give students a short, focused daily contest experience with both numerical and proof-based work."
              align="center"
            />
          </div>
          <div className="mx-auto w-[min(calc(100%-2rem),1180px)] rounded-[34px] border border-border-subtle bg-surface-card p-8">
            <h2 className="text-3xl font-black text-txt mb-2">Problems and Scoring</h2>
            <p className="mb-6 leading-relaxed text-txt-muted">
              Problem 1 is worth 4 points, Problem 2 is worth 6 points, and Problem 3 is worth 10 points. Full proof credit is based on both the mathematical result and clear justification.
            </p>
            <h2 className="text-3xl font-black text-txt mb-2">Writing Proofs</h2>
            <p className="mb-6 leading-relaxed text-txt-muted">
              Earlier problems are meant to guide students toward the proof. The portal includes a LaTeX editor, a LaTeX quick reference, and a helper focused only on LaTeX syntax.
            </p>
            <ul className="list-disc pl-6 text-txt-muted">
              <li>Knowing LaTeX is not required for participation.</li>
              <li>Proofs compile inside the testing page, but formatting does not affect the score.</li>
              <li>A short proof-writing guide and a short LaTeX guide can be linked into this page later.</li>
            </ul>
          </div>
        </section>
      </FlowSection>

      <FlowSection>
        <section className="py-18">
          <div className="mx-auto flex flex-col w-[min(calc(100%-2rem),1100px)] gap-10">
            <article className="rounded-[34px] border border-border-subtle bg-surface-card p-8">
              <h3 className="text-2xl font-black text-txt mb-4">Awards and Sponsors</h3>
              <p className="mb-6 text-sm leading-relaxed text-txt-muted">
                The top three performing students receive AoPS gift cards, and top performers who also participate in DTMT receive additional prizes.
              </p>
              <div className="border-t border-border-subtle pt-6">
                
                <h4 className="text-lg font-black text-txt mb-2">Art of Problem Solving</h4>
                <div className="flex items-center gap-6">
                  <div className="shrink-0">
                    <a
                      href="https://artofproblemsolving.com"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src="/assets/sponsors/aops.avif"
                        alt="Art of Problem Solving logo"
                        className="h-20 w-auto object-contain opacity-75 hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                      />
                    </a>
                  </div>

                  <div>
                    <p className="text-sm leading-relaxed text-txt-muted">
                      This year's prizes are supported by Art of Problem Solving. Their sponsorship helps recognize student achievement and sustain the club's math programs.
                    </p>
                  </div>
                </div>
                
              </div>
            </article>

            <article className="rounded-[34px] border border-border-subtle bg-surface-card p-8 flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-black text-txt mb-3">Past Problems</h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-txt-muted">Download all D.PotD problems for all days as a single PDF.</p>
              <a
                className="inline-block rounded-full bg-brand px-5 py-2 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light"
                href="/assets/dpotd/problems/2026-problems-and-solutions.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                View PDF
              </a>
            </article>
          </div>
        </section>
      </FlowSection>

    </>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border-subtle pb-4 last:border-b-0 last:pb-0">
      <span className="text-sm font-extrabold uppercase tracking-[0.16em] text-brand">
        {label}
      </span>
      <span className="max-w-[17rem] text-right text-sm font-medium leading-relaxed text-txt-muted">
        {value}
      </span>
    </div>
  );
}

function ScoreCard({ points, title, children }) {
  return (
    <div className="border-t border-border-subtle pt-5 first:border-t-0 first:pt-0">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-black text-txt">{title}</p>
          <p className="text-sm text-txt-muted">{children}</p>
        </div>
        <span className="rounded-full bg-brand px-4 py-2 text-sm font-black text-white">{points}</span>
      </div>
    </div>
  );
}

function BulletCard({ children }) {
  return (
    <div className="border-t border-border-subtle pt-5 text-sm leading-relaxed text-txt-muted first:border-t-0 first:pt-0">
      {children}
    </div>
  );
}
