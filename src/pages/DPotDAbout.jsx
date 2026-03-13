import FlowSection from "../components/FlowSection";
import HeroMediaPanel from "../components/HeroMediaPanel";
import PageHero from "../components/PageHero";
import SectionHeader from "../components/SectionHeader";
import SplitPanel from "../components/SplitPanel";
import { useDpotdAuth } from "../context/DpotdAuthContext";
import { buildProfileNextHref } from "../lib/siteAccountRouting";
import {
  dpotdArchive,
  dpotdFeatureCards,
  dpotdHighlights,
  dpotdWinners,
} from "../content/dpotd";

export default function DPotDAbout() {
  const { authReady, user } = useDpotdAuth();
  const hasSignedInAccount = authReady && Boolean(user);
  const registrationPath = hasSignedInAccount
    ? "/profile?view=dpotd"
    : buildProfileNextHref("/profile?view=dpotd");

  return (
    <>
      <PageHero
        actions={[
          {
            label: hasSignedInAccount ? "Open D.PotD Dashboard" : "Sign In for D.PotD",
            to: registrationPath,
          },
          {
            label: hasSignedInAccount ? "Open D.PotD Dashboard" : "Open Profile",
            to: hasSignedInAccount ? "/profile?view=dpotd" : "/profile",
            variant: "ghost",
          },
        ]}
        aside={
          <HeroMediaPanel
            alt="D.PotD logo"
            badge="D.PotD 2026"
            caption="Five days of timed daily sets, including proof writing, as the lead-up to DTMT."
            imageClassName="object-contain p-8 md:p-10"
            src="/dpotd-portal/dpotd-logo.png"
          />
        }
        description="The Design Tech Problems of the Day Challenge is an online math competition for middle school students leading into DTMT. Over five days, students receive three problems each day, including one proof-based question, and have one hour to solve them."
        title="Design Tech Problem of the Day Challenge"
      />

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
                <p className="text-sm leading-relaxed text-txt-muted mb-5">
                  This year's prizes are supported by Art of Problem Solving. Their sponsorship helps recognize student achievement and sustain the club's math programs.
                </p>
                <a
                  className="inline-flex rounded-full border border-brand px-5 py-2 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
                  href="https://artofproblemsolving.com"
                  rel="noreferrer"
                  target="_blank"
                >
                  Visit AoPS
                </a>
              </div>
            </article>

            <article className="rounded-[34px] border border-border-subtle bg-surface-card p-8 flex flex-col items-center justify-center text-center">
              <h3 className="text-lg font-black text-txt mb-3">Past Problems</h3>
              <p className="mb-6 flex-1 text-sm leading-relaxed text-txt-muted">Download all D.PotD problems for all days as a single PDF.</p>
              <a
                className="inline-block rounded-full bg-brand px-5 py-2 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light"
                href="/dpotd-archive/problems-all-days.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download PDF
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
