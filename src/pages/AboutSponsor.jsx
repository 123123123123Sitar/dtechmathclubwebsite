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
        title="Partner with the Design Tech Math Club"
        actions={[{ label: "Inquire Now", to: "#sponsor-form", variant: "primary" }]}
      />


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
          <div className="mx-auto w-[min(calc(100%-2rem),1180px)] rounded-[34px] border border-border-subtle bg-surface-card p-8 md:p-10">
            <h2 className="text-3xl font-black text-txt mb-4">Sponsorship Levels</h2>
            <p className="mb-6 text-txt-muted">We offer the following three sponsorship tiers. Subject to change as the partnership details are finalized.</p>
            <div className="overflow-x-auto mb-8 rounded-[20px] border border-border-subtle">
              <table className="min-w-full text-txt text-sm">
                <thead>
                  <tr className="bg-brand/8 border-b border-border-subtle">
                    <th className="px-6 py-4 text-lg font-extrabold text-center text-brand" colSpan="3">Sponsorship Tiers</th>
                  </tr>
                  <tr className="bg-brand/5 border-b border-border-subtle">
                    <th className="px-6 py-4 font-bold text-brand text-center">
                      Gold
                      <div className="text-sm font-semibold text-txt-muted">$100+</div>
                    </th>
                    <th className="px-6 py-4 font-bold text-brand text-center border-l border-r border-border-subtle">
                      Diamond
                      <div className="text-sm font-semibold text-txt-muted">$300+</div>
                    </th>
                    <th className="px-6 py-4 font-bold text-brand text-center">
                      Platinum
                      <div className="text-sm font-semibold text-txt-muted">$500+</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border-subtle hover:bg-white/30 transition-colors">
                    <td className="px-6 py-4 text-center text-txt-muted">—</td>
                    <td className="px-6 py-4 text-center border-l border-r border-border-subtle">Everything in Gold</td>
                    <td className="px-6 py-4 text-center">Everything in Diamond</td>
                  </tr>
                  <tr className="border-b border-border-subtle hover:bg-white/30 transition-colors">
                    <td className="px-6 py-4 text-center leading-relaxed">
                      <span className="font-semibold">Small Logo</span>
                      <div className="text-txt-muted text-xs">on website and merchandise</div>
                    </td>
                    <td className="px-6 py-4 text-center leading-relaxed border-l border-r border-border-subtle">
                      <span className="font-semibold">Medium Logo</span>
                      <div className="text-txt-muted text-xs">on website and merchandise</div>
                    </td>
                    <td className="px-6 py-4 text-center leading-relaxed">
                      <span className="font-semibold">Large Logo</span>
                      <div className="text-txt-muted text-xs">on website and merchandise</div>
                    </td>
                  </tr>
                  <tr className="border-b border-border-subtle hover:bg-white/30 transition-colors">
                    <td className="px-6 py-4 text-center leading-relaxed">
                      <span className="font-semibold">Verbal Recognition</span>
                      <div className="text-txt-muted text-xs">at events</div>
                    </td>
                    <td className="px-6 py-4 text-center leading-relaxed border-l border-r border-border-subtle">
                      <span className="font-semibold">Verbal Recognition</span>
                      <div className="text-txt-muted text-xs">at announcements</div>
                    </td>
                    <td className="px-6 py-4 text-center leading-relaxed">
                      <span className="font-semibold">Advertisements</span>
                      <div className="text-txt-muted text-xs">at announcements</div>
                    </td>
                  </tr>
                  <tr className="border-b border-border-subtle hover:bg-white/30 transition-colors">
                    <td className="px-6 py-4 text-center leading-relaxed">
                      <span className="font-semibold">Event Slides</span>
                    </td>
                    <td className="px-6 py-4 text-center leading-relaxed border-l border-r border-border-subtle">
                      <span className="font-semibold">Event Materials</span>
                    </td>
                    <td className="px-6 py-4 text-center leading-relaxed">
                      <span className="font-semibold">Event Title</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-white/30 transition-colors">
                    <td className="px-6 py-4 text-center text-txt-muted">—</td>
                    <td className="px-6 py-4 text-center border-l border-r border-border-subtle">
                      <span className="font-semibold">Display Banner</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-semibold">Product Demo</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-3xl font-black text-txt mb-4">Additional Ways to Support</h2>
            <p className="mb-6 text-txt-muted">If you would like to speak as a guest speaker at the Design Tech Math Tournament, please contact us. We appreciate insights from the math community and would love to hear from you.</p>
          </div>
        </section>
      </FlowSection>


      <FlowSection>
        <section className="py-8" id="sponsor-form">
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
              </>
            }
          />
        </section>
      </FlowSection>

      <FlowSection>
        <section className="py-18">
          <div className="mx-auto w-[min(calc(100%-2rem),1180px)] rounded-[34px] border border-border-subtle bg-surface-card p-8 md:p-10">
            <SectionHeader
              title="Corporate Sponsorship Inquiry"
              description="Interested in sponsoring the Design Tech Math Club? Contact us through this form."
              align="center"
              titleClassName="text-3xl md:text-3xl whitespace-nowrap"
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
