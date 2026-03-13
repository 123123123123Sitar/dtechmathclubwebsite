import FlowSection from "../components/FlowSection";
import PageHero from "../components/PageHero";
import SectionHeader from "../components/SectionHeader";
import {
  dpotdArchive,
  dpotdFeatureCards,
  dpotdHighlights,
  dpotdWinners,
} from "../content/dpotd";

export default function DPotDAbout() {
  return (
    <>
      <PageHero
        actions={[
          { label: "Register for D.PotD", to: "/dpotd/register" },
          { label: "Open D.PotD Dashboard", to: "/profile?view=dpotd", variant: "ghost" },
        ]}
        aside={<AboutSummaryCard />}
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
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {dpotdFeatureCards.map((card) => (
                <article
                  key={card.title}
                  className="rounded-[30px] border border-border-subtle bg-surface-card p-7"
                >
                  <h3 className="text-xl font-black text-txt">{card.title}</h3>
                  <p className="mt-4 leading-relaxed text-txt-muted">{card.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </FlowSection>

      <FlowSection glow="muted">
        <section className="py-18">
          <div className="mx-auto grid w-[min(calc(100%-2rem),1180px)] gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-[34px] border border-border-subtle bg-surface-card p-8">
              <SectionHeader
                title="Problems and Scoring"
                description="Problem 1 is worth 4 points, Problem 2 is worth 6 points, and Problem 3 is worth 10 points. Full proof credit is based on both the mathematical result and clear justification."
              />
              <div className="grid gap-4">
                <ScoreCard points="4 pts" title="Problem 1">
                  Numerical answer
                </ScoreCard>
                <ScoreCard points="6 pts" title="Problem 2">
                  Numerical answer
                </ScoreCard>
                <ScoreCard points="10 pts" title="Problem 3">
                  Proof with rubric-based evaluation
                </ScoreCard>
              </div>
            </article>

            <article className="rounded-[34px] border border-border-subtle bg-surface-card p-8">
              <SectionHeader
                title="Writing Proofs"
                description="Earlier problems are meant to guide students toward the proof. The portal includes a LaTeX editor, a LaTeX quick reference, and a helper focused only on LaTeX syntax."
              />
              <div className="grid gap-4">
                <BulletCard>
                  Knowing LaTeX is not required for participation.
                </BulletCard>
                <BulletCard>
                  Proofs compile inside the testing page, but formatting does not affect the score.
                </BulletCard>
                <BulletCard>
                  A short proof-writing guide and a short LaTeX guide can be linked into this page later.
                </BulletCard>
              </div>
            </article>
          </div>
        </section>
      </FlowSection>

      <FlowSection>
        <section className="py-18">
          <div className="mx-auto grid w-[min(calc(100%-2rem),1180px)] gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="rounded-[34px] border border-border-subtle bg-surface-card p-8">
              <SectionHeader
                title="Awards and Sponsors"
                description="The top three performing students receive AoPS gift cards, and top performers who also participate in DTMT receive additional prizes. Awards are sent one to two weeks after the challenge concludes."
              />
              <div className="border-t border-border-subtle pt-5">
                <h3 className="text-2xl font-black text-txt">Art of Problem Solving</h3>
                <p className="mt-3 leading-relaxed text-txt-muted">
                  This year's prizes are supported by Art of Problem Solving. Their sponsorship
                  helps recognize student achievement and sustain the club's math programs.
                </p>
                <a
                  className="mt-5 inline-flex rounded-full border border-brand px-5 py-2 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
                  href="https://artofproblemsolving.com"
                  rel="noreferrer"
                  target="_blank"
                >
                  Visit AoPS
                </a>
              </div>
            </article>

            <article className="rounded-[34px] border border-border-subtle bg-surface-card p-8">
              <SectionHeader
                title="This Year's Challenge"
                description="The 2026 Problems of the Day Challenge ran from February 23 through February 27 and featured three questions each day, including one proof-based question."
              />
              <div className="grid gap-3">
                {dpotdWinners.map((winner, index) => (
                  <div
                    key={winner}
                    className="flex items-center justify-between border-t border-border-subtle py-4 first:border-t-0 first:pt-0"
                  >
                    <span className="font-bold text-txt">{winner}</span>
                    <span className="text-sm font-semibold text-brand">Top {index + 1}</span>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-sm leading-relaxed text-txt-muted">
                Congratulations to our top three winners, each receiving a $25 AoPS gift card.
              </p>
            </article>
          </div>
        </section>
      </FlowSection>

      <FlowSection glow="muted">
        <section className="py-18">
          <div className="mx-auto w-[min(calc(100%-2rem),1180px)]">
            <SectionHeader
              title="Past Problems"
              description="The archive layout is now in place for the 2026 D.PotD problems. You can attach PDFs, portal deep-links, or solution files to these cards later."
              align="center"
            />
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {dpotdArchive.map((entry) => (
                <article
                  key={entry.day}
                  className="rounded-[28px] border border-border-subtle bg-surface-card p-6"
                >
                  <h3 className="text-2xl font-black text-txt">{entry.day}</h3>
                  <p className="mt-2 text-sm font-semibold text-brand">{entry.topic}</p>
                  <p className="mt-3 text-sm leading-relaxed text-txt-muted">
                    Solutions will be released soon.
                  </p>
                  <div className="mt-5 rounded-full bg-brand/10 px-4 py-2 text-sm font-semibold text-brand">
                    {entry.status}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </FlowSection>
    </>
  );
}

function AboutSummaryCard() {
  return (
    <div className="p-1 text-left">
      <div className="flex items-center gap-4">
        <img
          alt="D.PotD logo"
          className="h-16 w-16 rounded-2xl border border-brand/20 bg-white object-cover p-2"
          src="/dpotd-portal/dpotd-logo.png"
        />
        <div>
          <h2 className="text-2xl font-black text-txt">D.PotD Challenge</h2>
          <span className="mt-2 inline-flex rounded-full bg-brand/10 px-3 py-1 text-sm font-semibold text-brand">
            Registration Closed
          </span>
        </div>
      </div>
      <div className="mt-6 grid gap-4 border-t border-border-subtle pt-5">
        <InfoRow label="Date" value="Mon, Feb 23" />
        <InfoRow label="Location" value="Online in our website's D.PotD portal" />
        <InfoRow label="Status" value="Closed for the 2026 challenge cycle" />
        <InfoRow label="Eligibility" value="Open to middle school students across the United States" />
      </div>
      <p className="mt-5 text-sm leading-relaxed text-txt-muted">
        Winners receive online recognition, and top students who also participate in DTMT receive
        additional prizes.
      </p>
    </div>
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
