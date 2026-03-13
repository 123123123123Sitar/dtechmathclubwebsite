import PageHero from "../components/PageHero";
import FlowSection from "../components/FlowSection";
import SectionHeader from "../components/SectionHeader";
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
          <div className="text-left">
            <h2 className="text-3xl font-black text-txt">Payment Integration Ready</h2>
            <p className="mt-4 leading-relaxed text-txt-muted">
              Wire future donation buttons to Stripe Checkout or Payment Links here. The page
              layout, messaging, and impact sections are already in place.
            </p>
            <div className="mt-6 border-t border-dashed border-brand/40 pt-4 text-sm leading-relaxed text-txt-muted">
              Suggested future hook: one-time gifts, recurring support, sponsor acknowledgement,
              and post-payment thank-you messaging.
            </div>
          </div>
        }
        description="This page is the donation template in the site's orange visual system. Stripe can be connected here later without redesigning the structure."
        eyebrow="Donate"
        title="Support the Design Tech Math Club"
      />

      <FlowSection>
        <section className="py-18">
          <div className="mx-auto w-[min(calc(100%-2rem),1120px)]">
            <SectionHeader
              eyebrow="Impact"
              title="What Donations Help Fund"
              description="A clean donation page needs a clear impact story. These cards give you ready-to-keep messaging when Stripe is added."
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
              eyebrow="Template Tiers"
              title="Suggested Giving Cards"
              description="These are frontend placeholders only. Update amounts, copy, and Stripe links later."
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
                    Stripe Button Later
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
