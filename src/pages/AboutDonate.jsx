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

    </>
  );
}
