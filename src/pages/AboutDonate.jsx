import PageHero from "../components/PageHero";
import FlowSection from "../components/FlowSection";
import HeroMediaPanel from "../components/HeroMediaPanel";
import SectionHeader from "../components/SectionHeader";
import SplitPanel from "../components/SplitPanel";
import { donationImpact } from "../content/sponsorship";

const givingTemplate = [
  { label: "Friend of the Club", amount: "$25", copy: "Template tier for small individual support." },
  { label: "Program Supporter", amount: "$100", copy: "Template tier for helping fund prizes and materials." },
  { label: "Event Champion", amount: "$250", copy: "Template tier for families or alumni supporting growth." },
];

export default function AboutDonate() {
  return (
    <>
      <PageHero
        aside={
          <HeroMediaPanel
            alt="Design Tech Math Club banner"
            badge="Support"
            caption="Support for prizes, materials, and student access helps the club keep events welcoming and ambitious."
            imageClassName="object-contain p-8 md:p-10"
            src="/dtechmathclublogolarger.jpg"
          />
        }
        description="Support from families, alumni, and community members helps the Design Tech Math Club fund prizes, materials, and accessible math programming."
        title="Support the Design Tech Math Club"
      />

      <FlowSection>
        <section className="py-8">
          <SplitPanel
            left={
              <>
                <h2 className="text-3xl font-black text-txt">How donations help</h2>
                <p className="mt-4 leading-relaxed text-txt-muted">
                  Individual giving helps the club run events well, recognize student achievement,
                  and keep participation accessible across our programs.
                </p>
              </>
            }
            right={
              <>
                <h2 className="text-3xl font-black text-txt">Donation page details</h2>
                <p className="mt-4 leading-relaxed text-txt-muted">
                  This page is set up for future giving support, with space for one-time gifts,
                  recurring support, and donor acknowledgement.
                </p>
                <div className="mt-5 border-t border-border-subtle pt-4 leading-relaxed text-txt-muted">
                  When online giving is added, this page can also include follow-up messaging and
                  a thank-you note for supporters.
                </div>
              </>
            }
          />
        </section>
      </FlowSection>

      <FlowSection>
        <section className="py-18">
          <div className="mx-auto w-[min(calc(100%-2rem),1120px)]">
            <SectionHeader
              title="What Donations Help Fund"
              description="These focus areas show how support can help student programs, event quality, and broader access."
              align="center"
            />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {donationImpact.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[30px] border border-border-subtle bg-surface-card p-7"
                >
                  <h3 className="text-xl font-black text-txt">{item.title}</h3>
                  <p className="mt-4 leading-relaxed text-txt-muted">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </FlowSection>

      <FlowSection glow="muted">
        <section className="py-18">
          <div className="mx-auto w-[min(calc(100%-2rem),1120px)]">
            <SectionHeader
              title="Suggested Giving Cards"
              description="These sample giving levels can be refined with final amounts and donation links later."
              align="center"
            />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {givingTemplate.map((tier) => (
                <article
                  key={tier.label}
                  className="rounded-[30px] border border-border-subtle bg-surface-card p-7"
                >
                  <h3 className="text-2xl font-black text-txt">{tier.label}</h3>
                  <p className="mt-3 text-4xl font-black text-brand">{tier.amount}</p>
                  <p className="mt-4 min-h-[72px] text-sm leading-relaxed text-txt-muted">
                    {tier.copy}
                  </p>
                  <button
                    className="mt-6 inline-flex rounded-full border border-brand px-5 py-3 text-sm font-bold text-brand"
                    type="button"
                  >
                    Donation Link Coming Soon
                  </button>
                </article>
              ))}
            </div>
          </div>
        </section>
      </FlowSection>
    </>
  );
}
