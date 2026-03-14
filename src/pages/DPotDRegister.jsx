import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import DpotdDashboardPanel from "../components/DpotdDashboardPanel";
import FlowSection from "../components/FlowSection";
import HeroMediaPanel from "../components/HeroMediaPanel";
import PageHero from "../components/PageHero";
import SectionHeader from "../components/SectionHeader";
import SplitPanel from "../components/SplitPanel";
import SurfaceCard from "../components/SurfaceCard";
import { useDpotdAuth } from "../context/DpotdAuthContext";

const initialForm = {
  grade: "",
  integrityAccepted: false,
  name: "",
  school: "",
  termsAccepted: false,
};

export default function DPotDRegister() {
  const { hasDpotdAccess, profile, submitDpotdRegistration, user } = useDpotdAuth();
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const isCoachAccount = profile?.accountType === "coach";

  if (isCoachAccount) {
    return <Navigate replace to="/dpotd/about" />;
  }

  useEffect(() => {
    if (!user) {
      setForm(initialForm);
      return;
    }

    setForm((current) => ({
      ...current,
      grade: profile?.grade || "",
      name: profile?.name || "",
      school: profile?.school || "",
    }));
  }, [profile, user]);

  function handleChange(event) {
    const { checked, name, type, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);

    const result = await submitDpotdRegistration(form);

    setBusy(false);
    setMessage(result.ok ? "D.PotD registration saved." : result.error);
  }

  return (
    <>
      <PageHero
        actions={[
          { label: "D.PotD Overview", to: "/dpotd/about" },
          { label: "Profile", to: "/profile", variant: "ghost" },
        ]}
        aside={
          <HeroMediaPanel
            alt="D.PotD logo"
            badge="D.PotD"
            caption="This is the separate D.PotD registration page for student accounts."
            imageClassName="object-contain p-8 md:p-10"
            src="/dpotd-portal/dpotd-logo.png"
          />
        }
        description="Register for D.PotD here. The registration form and portal status stay on this page instead of inside the profile page."
        highlights={["Separate Registration Page", "Student Accounts Only", "Register Here"]}
        title="D.PotD Registration"
      />

      <FlowSection>
        <section className="py-8">
          <SplitPanel
            left={
              <>
                <h2 className="text-3xl font-black text-txt">Register Here</h2>
                <p className="mt-4 leading-relaxed text-txt-muted">
                  This page holds the D.PotD registration flow and, once activated, your D.PotD
                  status for this account.
                </p>
              </>
            }
            right={
              <>
                <h2 className="text-3xl font-black text-txt">{profile?.name || "Student"}</h2>
                <p className="mt-3 text-sm leading-relaxed text-txt-muted">
                  {profile?.email || user?.email || ""}
                </p>
                <div className="mt-5 border-t border-border-subtle pt-4 leading-relaxed text-txt-muted">
                  {hasDpotdAccess
                    ? "This account already has D.PotD access."
                    : "Submit the student D.PotD form here to activate portal access."}
                </div>
              </>
            }
          />
        </section>
      </FlowSection>

      <FlowSection glow="muted">
        <section className="py-16">
          <div className="mx-auto w-[min(calc(100%-2rem),1180px)]">
            {hasDpotdAccess ? (
              <DpotdDashboardPanel />
            ) : (
              <div className="grid gap-8 lg:grid-cols-[1.06fr_0.94fr]">
                <SurfaceCard className="p-8">
                  <SectionHeader
                    title="Student D.PotD Form"
                    description="Submitting this form attaches D.PotD registration to the signed-in account and turns on portal access for the same account."
                  />
                  <form className="mt-8 grid gap-5" onSubmit={handleSubmit} noValidate>
                    <ReadonlyField label="Signed-In Email" value={profile?.email || user?.email || ""} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Full Name" name="name" onChange={handleChange} required value={form.name} />
                      <Field label="School" name="school" onChange={handleChange} required value={form.school} />
                    </div>
                    <Field label="Grade" name="grade" onChange={handleChange} required value={form.grade} />

                    <label className="flex items-start gap-3 border-t border-border-subtle pt-4 text-sm leading-relaxed text-txt-muted">
                      <input
                        checked={form.termsAccepted}
                        className="mt-1 h-4 w-4 rounded border-border-accent accent-brand"
                        name="termsAccepted"
                        onChange={handleChange}
                        required
                        type="checkbox"
                      />
                      <span>
                        I understand that this D.PotD registration is attached to my signed-in
                        Design Tech Math Club account.
                      </span>
                    </label>

                    <label className="flex items-start gap-3 border-t border-border-subtle pt-4 text-sm leading-relaxed text-txt-muted">
                      <input
                        checked={form.integrityAccepted}
                        className="mt-1 h-4 w-4 rounded border-border-accent accent-brand"
                        name="integrityAccepted"
                        onChange={handleChange}
                        required
                        type="checkbox"
                      />
                      <span>
                        I understand that integrity signals such as tab switches, visibility
                        changes, fullscreen exits, and attempted closes may be recorded during an
                        active test.
                      </span>
                    </label>

                    {message ? (
                      <p className={`text-sm font-semibold ${message === "D.PotD registration saved." ? "text-emerald-600" : "text-red-500"}`}>
                        {message}
                      </p>
                    ) : null}

                    <button
                      className="inline-flex w-fit rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={busy}
                      type="submit"
                    >
                      {busy ? "Saving..." : "Save D.PotD Registration"}
                    </button>
                  </form>
                </SurfaceCard>

                <SurfaceCard className="p-8">
                  <SectionHeader
                    title="What This Unlocks"
                    description="Once you register here, this same account can open the D.PotD testing portal and track your results."
                  />
                  <div className="mt-4 grid gap-4">
                    {[
                      "Testing access stays attached to this account.",
                      "Submission records stay attached to this account.",
                      "Leaderboard history stays attached to this account.",
                      "If something looks wrong, contact dtechmathclub@gmail.com.",
                    ].map((item) => (
                      <div key={item} className="border-t border-border-subtle pt-4 text-sm leading-relaxed text-txt-muted">
                        {item}
                      </div>
                    ))}
                  </div>
                </SurfaceCard>
              </div>
            )}
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
        className="w-full rounded-2xl border border-[rgba(234,109,74,0.14)] bg-[#fffaf6] px-4 py-3 text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
        {...props}
      />
    </label>
  );
}

function ReadonlyField({ label, value }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">{label}</span>
      <div className="rounded-2xl border border-border-subtle bg-white/70 px-4 py-3 text-sm text-txt-muted">
        {value || "Not available"}
      </div>
    </label>
  );
}
