import { useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import FlowSection from "../components/FlowSection";
import HeroMediaPanel from "../components/HeroMediaPanel";
import SectionHeader from "../components/SectionHeader";
import SplitPanel from "../components/SplitPanel";
import { sponsorPrograms, sponsorTierTemplate } from "../content/sponsorship";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  message: "",
};

export default function AboutSponsor() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSubmitted(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log("Sponsor inquiry submitted", form);
    setForm(initialForm);
    setSubmitted(true);
  }

  return (
    <>
      <PageHero
        aside={
          <HeroMediaPanel
            alt="Design Tech Math Club banner"
            badge="Sponsor Us"
            caption="Partner with a student-run math club that builds thoughtful, well-run programs for middle school students."
            imageClassName="object-contain p-8 md:p-10"
            src="/dtechmathclublogolarger.jpg"
          />
        }
        description="The Design Tech High School Math Club is a student-run Mu Alpha Theta chapter on the Oracle campus in Redwood City, California. We organize math programs for middle school students in the Bay Area and beyond, with a focus on reasoning, problem solving, and analytical thinking."
        highlights={["Puzzle Night", "D.PotD", "DTMT"]}
        title="Partner with the Design Tech Math Club"
      />

      <FlowSection>
        <section className="py-8">
          <SplitPanel
            left={
              <>
                <h2 className="text-3xl font-black text-txt">Let&apos;s partner</h2>
                <p className="mt-4 leading-relaxed text-txt-muted">
                  Sponsor support helps us provide prizes, run events at scale, and keep
                  participation widely accessible for young mathematicians.
                </p>
              </>
            }
            right={
              <>
                <h2 className="text-3xl font-black text-txt">Contact details</h2>
                <div className="mt-4 grid gap-3 leading-relaxed text-txt-muted">
                  <p>275 Oracle Parkway</p>
                  <p>Redwood City, CA 94065</p>
                  <p>Email: dtechmathclub@gmail.com</p>
                </div>
                <div className="mt-5 border-t border-border-subtle pt-4 leading-relaxed text-txt-muted">
                  Interested in sponsoring the Design Tech Math Club? Contact us through the form
                  below or by email.
                </div>
              </>
            }
          />
        </section>
      </FlowSection>

      <FlowSection>
        <section className="py-18">
          <div className="mx-auto w-[min(calc(100%-2rem),1180px)]">
            <SectionHeader
              title="What Your Support Makes Possible"
              description="Across our programs, we aim to help students improve their math skills, approach problems systematically, and gain experience with competition-style mathematics."
              align="center"
            />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {sponsorPrograms.map((program) => (
                <article
                  key={program.title}
                  className="rounded-[30px] border border-border-subtle bg-surface-card p-7"
                >
                  <h3 className="text-xl font-black text-txt">{program.title}</h3>
                  <p className="mt-4 leading-relaxed text-txt-muted">{program.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </FlowSection>

      <FlowSection glow="muted">
        <section className="py-18">
          <div className="mx-auto grid w-[min(calc(100%-2rem),1180px)] gap-10 lg:grid-cols-[1fr_1fr]">
            <div className="rounded-[34px] border border-border-subtle bg-surface-card p-8">
              <SectionHeader
                title="Sponsorship Levels"
                description="We offer three sponsorship tiers. Final amounts and printed materials can be added here as the partnership details are finalized."
              />
              <div className="grid gap-4">
                {sponsorTierTemplate.map((tier) => (
                  <article key={tier.name} className="border-t border-border-subtle pt-5">
                    <div className="flex items-center gap-4">
                      <div className={`h-12 w-12 rounded-2xl bg-linear-to-br ${tier.accent}`} />
                      <div>
                        <h3 className="text-2xl font-black text-txt">{tier.name}</h3>
                        <p className="text-sm text-txt-muted">Sponsorship tier</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tier.perks.map((perk) => (
                        <span
                          key={perk}
                          className="rounded-full bg-brand/10 px-3 py-1.5 text-xs font-bold text-brand"
                        >
                          {perk}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] border border-border-subtle bg-surface-card p-8">
              <SectionHeader
                title="Additional Ways to Support"
                description="If you would like to speak as a guest speaker at the Design Tech Math Tournament, please contact us. We appreciate insights from the math community and would love to hear from you."
              />
              <div className="border-t border-border-subtle pt-5">
                <p className="leading-relaxed text-txt-muted">
                  Please note that this form is intended for corporate sponsorships. For
                  individual donations, please use the donations page.
                </p>
                <Link
                  className="mt-5 inline-flex rounded-full border border-brand px-5 py-3 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
                  to="/about/donate"
                >
                  Go to Donations
                </Link>
              </div>
            </div>
          </div>
        </section>
      </FlowSection>

      <FlowSection>
        <section className="py-18">
          <div className="mx-auto w-[min(calc(100%-2rem),980px)] rounded-[34px] border border-border-subtle bg-surface-card p-8 md:p-10">
            <SectionHeader
              title="Corporate Sponsorship Inquiry"
              description="Interested in sponsoring the Design Tech Math Club? Contact us through this form."
              align="center"
            />
            <form className="mt-8 grid gap-4" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="First Name"
                  name="firstName"
                  onChange={handleChange}
                  value={form.firstName}
                />
                <Field
                  label="Last Name"
                  name="lastName"
                  onChange={handleChange}
                  value={form.lastName}
                />
                <Field
                  label="Email"
                  name="email"
                  onChange={handleChange}
                  type="email"
                  value={form.email}
                />
                <Field
                  label="Company or Organization"
                  name="company"
                  onChange={handleChange}
                  value={form.company}
                />
              </div>
              <label className="grid gap-2">
                <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
                  Message
                </span>
                <textarea
                  className="min-h-[180px] w-full rounded-2xl border border-border-accent bg-white px-4 py-3 text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
                  name="message"
                  onChange={handleChange}
                  value={form.message}
                />
              </label>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  className="inline-flex rounded-full bg-brand px-7 py-3 font-bold text-white transition-all duration-200 hover:bg-brand-light"
                  type="submit"
                >
                  Send
                </button>
                {submitted ? (
                  <p className="text-sm font-semibold text-emerald-500">
                    Thanks. Your sponsorship inquiry has been recorded on the site.
                  </p>
                ) : null}
              </div>
              <p className="text-sm leading-relaxed text-txt-muted">
                Please note that this form is only for corporate sponsorships. For individual
                donations, please use the donations page.
              </p>
            </form>
          </div>
        </section>
      </FlowSection>
    </>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">{label}</span>
      <input
        className="w-full rounded-2xl border border-border-accent bg-white px-4 py-3 text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
        {...props}
      />
    </label>
  );
}
