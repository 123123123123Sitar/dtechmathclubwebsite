import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import FlowSection from "../components/FlowSection";

import SectionHeader from "../components/SectionHeader";
import SplitPanel from "../components/SplitPanel";
import { useDpotdAuth } from "../context/DpotdAuthContext";
import { sponsorPrograms, sponsorTierTemplate } from "../content/sponsorship";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  message: "",
};

export default function AboutSponsor() {
  const { submitSponsorInquiry } = useDpotdAuth();
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setSubmitted(false);
    setSubmitError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    const result = await submitSponsorInquiry(form);
    setSubmitting(false);

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }

    setForm(initialForm);
    setSubmitted(true);
    setSubmitError("");
  }

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
              <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-txt">Partner with the Design Tech Math Club</h1>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start">
              <motion.div
                className="text-txt-muted text-base md:text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <p className="mb-6">The Design Tech High School Math Club is a student-run Mu Alpha Theta chapter on the Oracle campus in Redwood City, California. We organize math programs for middle school students in the Bay Area and beyond, with a focus on reasoning, problem solving, and analytical thinking.</p>
                <Link
                  to="#sponsor-form"
                  className="inline-flex items-center px-7 py-3 rounded-full bg-brand text-white font-bold hover:bg-brand-light hover:shadow-lg hover:shadow-brand-glow transition-all duration-200"
                >
                  Inquire Now →
                </Link>
              </motion.div>
              <motion.div
                className="flex justify-center md:justify-end flex-shrink-0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <img
                  src="/assets/dtechmathclublogo.jpg"
                  alt="Design Tech Math Club banner"
                  style={{ maxWidth: 300, height: "auto", display: "block", borderRadius: 16 }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>


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
                  disabled={submitting}
                  type="submit"
                >
                  {submitting ? "Sending..." : "Send"}
                </button>
                {submitted ? (
                  <p className="text-sm font-semibold text-emerald-500">
                    Thanks. Your sponsorship inquiry has been recorded on the site.
                  </p>
                ) : null}
              </div>
              {submitError ? <p className="text-sm font-semibold text-red-500">{submitError}</p> : null}
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
