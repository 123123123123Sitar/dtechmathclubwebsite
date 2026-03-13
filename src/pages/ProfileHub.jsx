import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHero from "../components/PageHero";
import ProfileAuthPanel from "../components/ProfileAuthPanel";
import SectionHeader from "../components/SectionHeader";
import SurfaceCard from "../components/SurfaceCard";
import FlowSection from "../components/FlowSection";
import { useDpotdAuth } from "../context/DpotdAuthContext";

export default function ProfileHub() {
  const { authReady, profile, signOutPortalAccount, updatePortalProfile, user } = useDpotdAuth();
  const [form, setForm] = useState({
    grade: "",
    name: "",
    school: "",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      grade: profile?.grade || "",
      name: profile?.name || user?.email || "",
      school: profile?.school || "",
    });
  }, [profile, user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    const result = await updatePortalProfile(form);
    setSaving(false);
    setMessage(result.ok ? "Profile saved." : result.error);
  }

  async function handleSignOut() {
    await signOutPortalAccount();
    setMessage("");
  }

  return (
    <>
      <PageHero
        actions={
          authReady && user
            ? [
                { label: "Open D.PotD Portal", to: "/dpotd/portal" },
                { label: "D.PotD Overview", to: "/dpotd/about", variant: "ghost" },
              ]
            : [
                { label: "Create Site Profile", to: "/dpotd/register" },
                { label: "D.PotD Overview", to: "/dpotd/about", variant: "ghost" },
              ]
        }
        aside={
          <ProfileAuthPanel
            defaultMode="signin"
            redirectTo="/profile"
            signedInCopy="This Design Tech Math Club account is already active on this browser."
          />
        }
        description="This account hub is the shared profile space for the website. Students can use it for D.PotD access now, while keeping one reusable account for other account-based features added later."
        eyebrow="Site Profile"
        highlights={[
          "Shared Sign In",
          "Reusable Student Account",
          "D.PotD Access",
        ]}
        title={authReady && user ? `Welcome back, ${profile?.name || "Student"}` : "One Profile Across the Website"}
      />

      {authReady && user ? (
        <>
          <FlowSection>
            <section className="py-18">
              <div className="mx-auto grid w-[min(calc(100%-2rem),1180px)] gap-8 lg:grid-cols-[0.96fr_1.04fr]">
                <SurfaceCard className="p-8">
                  <SectionHeader
                    eyebrow="Account"
                    title="Profile Details"
                    description="Update the shared account information that the current D.PotD system reads now and future registration flows can reuse later."
                  />
                  <form className="grid gap-4" onSubmit={handleSubmit} noValidate>
                    <Field
                      label="Full Name"
                      name="name"
                      onChange={handleChange}
                      value={form.name}
                    />
                    <Field
                      label="School"
                      name="school"
                      onChange={handleChange}
                      value={form.school}
                    />
                    <Field
                      label="Grade"
                      name="grade"
                      onChange={handleChange}
                      value={form.grade}
                    />
                    <div className="flex flex-wrap gap-3">
                      <button
                        className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={saving}
                        type="submit"
                      >
                        {saving ? "Saving..." : "Save Profile"}
                      </button>
                      <button
                        className="inline-flex rounded-full border border-brand px-6 py-3 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
                        onClick={handleSignOut}
                        type="button"
                      >
                        Sign Out
                      </button>
                    </div>
                    {message ? (
                      <p className={`text-sm font-semibold ${message === "Profile saved." ? "text-emerald-500" : "text-red-500"}`}>
                        {message}
                      </p>
                    ) : null}
                  </form>
                </SurfaceCard>

                <div className="grid gap-5">
                  <ModuleCard
                    actionLabel="Open D.PotD Portal"
                    actionTo="/dpotd/portal"
                    eyebrow="Current Access"
                    title="D.PotD"
                  >
                    Use this account to enter the D.PotD dashboard, open the testing portal, and
                    keep your student information current.
                  </ModuleCard>
                  <ModuleCard
                    actionLabel="DTMT Page"
                    actionTo="/dtmt"
                    eyebrow="Future Use"
                    title="Event Confirmations"
                  >
                    This account structure can later support registration confirmations,
                    participant-facing notices, and event-specific updates without forcing a
                    separate sign-in for each page.
                  </ModuleCard>
                  <ModuleCard
                    actionLabel="Our Team"
                    actionTo="/about/our-team"
                    eyebrow="Profile Center"
                    title="Keep Details Ready"
                  >
                    Name, school, and grade can stay in one place so account-connected features
                    across the site reuse the same student details.
                  </ModuleCard>
                </div>
              </div>
            </section>
          </FlowSection>
        </>
      ) : (
        <FlowSection glow="muted">
          <section className="py-18">
            <div className="mx-auto w-[min(calc(100%-2rem),1080px)]">
              <SectionHeader
                align="center"
                description="This page is the main account entry point for the website. It is designed so one student account can support D.PotD now and other event features later."
                eyebrow="Roadmap"
                title="What This Profile Is For"
              />
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                <ModuleCard actionLabel="D.PotD" actionTo="/dpotd/about" eyebrow="Now" title="Competition Access">
                  Sign in once, open the D.PotD portal, and keep the account reusable for future
                  competition flows.
                </ModuleCard>
                <ModuleCard actionLabel="DTMT" actionTo="/dtmt" eyebrow="Later" title="Event Confirmations">
                  Registration confirmations, roster details, and participant-specific notices can
                  plug into this same account when you are ready to add them.
                </ModuleCard>
                <ModuleCard actionLabel="Profile" actionTo="/profile" eyebrow="Always" title="Student Details">
                  Keep student information in one place so any account-enabled page can reuse it
                  without asking students to start over.
                </ModuleCard>
              </div>
            </div>
          </section>
        </FlowSection>
      )}
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

function ModuleCard({ actionLabel, actionTo, eyebrow, title, children }) {
  return (
    <SurfaceCard className="p-7">
      <h3 className="text-2xl font-black text-txt">{title}</h3>
      <p className="mt-4 leading-relaxed text-txt-muted">{children}</p>
      <Link
        className="mt-6 inline-flex rounded-full border border-brand px-5 py-3 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
        to={actionTo}
      >
        {actionLabel}
      </Link>
    </SurfaceCard>
  );
}
