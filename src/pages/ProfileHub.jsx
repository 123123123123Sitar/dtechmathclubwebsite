import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DtmtDashboardPanel from "../components/DtmtDashboardPanel";
import DpotdRegistrationPanel from "../components/DpotdRegistrationPanel";
import FlowSection from "../components/FlowSection";
import HeroMediaPanel from "../components/HeroMediaPanel";
import PageHero from "../components/PageHero";
import ProfileAuthPanel from "../components/ProfileAuthPanel";
import PuzzleNightDashboardPanel from "../components/PuzzleNightDashboardPanel";
import SectionHeader from "../components/SectionHeader";
import SplitPanel from "../components/SplitPanel";
import SurfaceCard from "../components/SurfaceCard";
import { useDpotdAuth } from "../context/DpotdAuthContext";
import { normalizeNextPath } from "../lib/siteAccountRouting";

const STUDENT_TABS = [
  { id: "profile", label: "Profile" },
  { id: "puzzle-night", label: "Puzzle Night" },
  { id: "dpotd", label: "D.PotD" },
  { id: "dtmt", label: "DTMT" },
];

const COACH_TABS = [
  { id: "profile", label: "Profile" },
  { id: "dtmt", label: "DTMT" },
];

function buildProfileViewHref(view = "profile") {
  return view === "profile" ? "/profile" : `/profile?view=${view}`;
}

function normalizeProfileView(rawView, isCoachAccount) {
  const allowedTabs = isCoachAccount ? COACH_TABS : STUDENT_TABS;
  const nextView = String(rawView || "").trim().toLowerCase();
  return allowedTabs.some((item) => item.id === nextView) ? nextView : "profile";
}

export default function ProfileHub() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    authReady,
    dtmtCoachProfile,
    dtmtSchool,
    dtmtStudentRegistration,
    hasDpotdAccess,
    profile,
    puzzleNightRegistration,
    signOutAccount,
    updateSiteProfile,
    user,
  } = useDpotdAuth();
  const [form, setForm] = useState({
    grade: "",
    name: "",
    school: "",
    email: user?.email || "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [preferredSignupType, setPreferredSignupType] = useState("student");
  const [signupIntentVersion, setSignupIntentVersion] = useState(0);
  const isCoachAccount = profile?.accountType === "coach";
  const nextParam = searchParams.get("next");
  const rawView = searchParams.get("view");
  const activeView = normalizeProfileView(rawView, isCoachAccount);
  const postAuthDestination = nextParam
    ? normalizeNextPath(nextParam, buildProfileViewHref(activeView))
    : buildProfileViewHref(activeView);

  useEffect(() => {
    setForm({
      grade: profile?.grade || "",
      name: profile?.name || "",
      school: profile?.school || "",
      email: user?.email || "",
      password: "",
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
    let result = { ok: true };
    if (form.email !== user?.email) {
      // Email update logic (Firebase requires re-authentication for email change, so here we just show a message)
      setMessage("Email change requires re-authentication. Please sign out and sign in with your new email.");
      setSaving(false);
      return;
    }
    result = await updateSiteProfile(form);
    setSaving(false);
    setMessage(result.ok ? "Profile saved." : result.error);
  }

  async function handleSignOut() {
    await signOutAccount();
    setMessage("");
  }

  function openSignup(accountType) {
    setPreferredSignupType(accountType === "coach" ? "coach" : "student");
    setSignupIntentVersion((current) => current + 1);
  }

  function handleTabSelect(view) {
    const nextParams = new URLSearchParams(searchParams);

    if (view === "profile") {
      nextParams.delete("view");
    } else {
      nextParams.set("view", view);
    }

    setSearchParams(nextParams);
  }

  return (
    <>
      <PageHero
        actions={[]}
        aside={
          <HeroMediaPanel
            alt="Design Tech Math Club banner"
            imageClassName="object-contain p-8 md:p-10"
            src="/assets/logos/dtechmathclublogolarger.jpg"
          />
        }
        description="Registration for all Design Tech Math Club events are handled through this portal. Select a tab below to view details."
        title={authReady && user ? `Welcome back, ${profile?.name || "Member"}` : "Account Profile"}
      />

      {authReady && user ? (
        <div className="px-40">
          <div className="mt-6 mb-10 flex flex-wrap gap-3">
            {(isCoachAccount ? COACH_TABS : STUDENT_TABS).map((tab) => (
              <button
                key={tab.id}
                className={`inline-flex rounded-full px-5 py-3 text-sm font-bold transition-all duration-200 ${
                  activeView === tab.id
                    ? "bg-brand text-white shadow-md shadow-brand-glow"
                    : "border border-brand bg-white/70 text-brand hover:bg-brand hover:text-white"
                }`}
                onClick={() => handleTabSelect(tab.id)}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </div>
          {activeView === "profile" ? (
            <ProfilePanel
              dtmtCoachProfile={dtmtCoachProfile}
              dtmtSchool={dtmtSchool}
              dtmtStudentRegistration={dtmtStudentRegistration}
              form={form}
              handleChange={handleChange}
              handleSignOut={handleSignOut}
              handleSubmit={handleSubmit}
              handleTabSelect={handleTabSelect}
              hasDpotdAccess={hasDpotdAccess}
              isCoachAccount={isCoachAccount}
              message={message}
              puzzleNightRegistration={puzzleNightRegistration}
              saving={saving}
            />
          ) : activeView === "puzzle-night" ? (
            <PuzzleNightDashboardPanel />
          ) : activeView === "dpotd" ? (
            <DpotdRegistrationPanel />
          ) : (
            <DtmtDashboardPanel />
          )}
        </div>
      ) : (
        <>
          <FlowSection>
            <section className="py-8">
              <SplitPanel
                left={
                  <>
                    <h2 className="text-3xl font-black text-txt">Create your account</h2>
                    <p className="mt-4 leading-relaxed text-txt-muted">
                      Choose coach or student when you create the account. After sign-in, this same
                      page opens the registration tabs for the events.
                    </p>
                  </>
                }
                right={
                  <ProfileAuthPanel
                    defaultMode={nextParam ? "signin" : "register"}
                    embedded
                    hideWhenSignedIn
                    preferredSignupType={preferredSignupType}
                    redirectTo={postAuthDestination}
                    signupIntentVersion={signupIntentVersion}
                  />
                }
              />
            </section>
          </FlowSection>
        </>
      )}
    </>
  );
}

function ProfilePanel({
  dtmtCoachProfile,
  dtmtSchool,
  dtmtStudentRegistration,
  form,
  handleChange,
  handleSignOut,
  handleSubmit,
  handleTabSelect,
  hasDpotdAccess,
  isCoachAccount,
  message,
  puzzleNightRegistration,
  saving,
}) {
  return (
    <div className="grid gap-8">
      <div className="grid gap-8">
        <SurfaceCard className="p-8 w-full">
          <SectionHeader
            title="Profile Details"
            description="Edit account details here:"
          />
          <form className="mt-8 grid gap-4" onSubmit={handleSubmit} noValidate>
            <Field label="Full Name" name="name" onChange={handleChange} value={form.name} />
            <Field
              label={isCoachAccount ? "School Affiliation" : "School"}
              name="school"
              onChange={handleChange}
              value={form.school}
            />
            {!isCoachAccount ? (
              <Field label="Grade" name="grade" onChange={handleChange} value={form.grade} />
            ) : null}
            <Field label="Email" name="email" onChange={handleChange} value={form.email} type="email" />
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
            <div className="flex flex-wrap gap-3">
              <button
                className="inline-flex rounded-full border border-brand px-6 py-3 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
                type="button"
                onClick={async () => {
                  if (!form.email) {
                    setMessage("Enter your email to reset password.");
                    return;
                  }
                  setSaving(true);
                  const result = await requestAccountPasswordReset(form.email);
                  setSaving(false);
                  setMessage(result.ok ? "Password reset email sent. Check your inbox." : result.error);
                }}
              >
                Change Password (Send Reset Email)
              </button>
            </div>
            {message ? (
              <p
                className={`text-sm font-semibold ${
                  message === "Profile saved." || message === "Password reset email sent. Check your inbox." ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {message}
              </p>
            ) : null}
          </form>
        </SurfaceCard>
      </div>

    </div>
  );
}

function ShortcutCard({ copy, label, onClick, title }) {
  return (
    <SurfaceCard className="p-8">
      <SectionHeader description={copy} title={title} />
      <button
        className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light"
        onClick={onClick}
        type="button"
      >
        {label}
      </button>
    </SurfaceCard>
  );
}

function ModuleCard({ actionLabel, actionTo, children, title }) {
  return (
    <SurfaceCard className="p-8">
      <SectionHeader title={title} description={children} />
      <Link
        className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light"
        to={actionTo}
      >
        {actionLabel}
      </Link>
    </SurfaceCard>
  );
}

function StatusLine({ label, children }) {
  return (
    <div className="border-t border-border-subtle pt-4">
      <p className="text-sm font-bold text-txt">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-txt-muted">{children}</p>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">{label}</span>
      <input
        className="w-full rounded-2xl border border-[rgba(234,109,74,0.14)] bg-surface-3 px-4 py-3 text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
        {...props}
      />
    </label>
  );
}
