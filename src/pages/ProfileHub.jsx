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
    const result = await updateSiteProfile(form);
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
            src="/dtechmathclublogolarger.jpg"
          />
        }
        description="This page handles your shared account profile plus the registration tabs for Puzzle Night, D.PotD, and DTMT."
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
                    <h2 className="text-3xl font-black text-txt">Create your shared account</h2>
                    <p className="mt-4 leading-relaxed text-txt-muted">
                      Choose coach or student when you create the account. After sign-in, this same
                      page opens the registration tabs for the events.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light"
                        onClick={() => openSignup("coach")}
                        type="button"
                      >
                        Create Coach Account
                      </button>
                      <button
                        className="inline-flex rounded-full border border-brand px-6 py-3 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
                        onClick={() => openSignup("student")}
                        type="button"
                      >
                        Create Student Account
                      </button>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-txt-muted">
                      These buttons jump directly into the matching signup form on the right.
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
          <FlowSection glow="muted">
            <section className="py-18">
              <div className="mx-auto w-[min(calc(100%-2rem),1080px)]">
                <SectionHeader
                  align="center"
                  description="Create your account here first, then use the registration tabs on this same page."
                  title="After Sign-In"
                />
                <div className="mt-8 grid gap-5 md:grid-cols-3">
                  <ModuleCard
                    actionLabel="Open Puzzle Night Tab"
                    actionTo={buildProfileViewHref("puzzle-night")}
                    title="Puzzle Night"
                  >
                    Puzzle Night registration appears inside the profile tabs after sign-in.
                  </ModuleCard>
                  <ModuleCard
                    actionLabel="Open DTMT Tab"
                    actionTo={buildProfileViewHref("dtmt")}
                    title="DTMT"
                  >
                    DTMT registration, school management, and team building all appear inside the
                    DTMT tab here.
                  </ModuleCard>
                  <ModuleCard
                    actionLabel="Open D.PotD Tab"
                    actionTo={buildProfileViewHref("dpotd")}
                    title="D.PotD"
                  >
                    D.PotD registration and status both stay inside the D.PotD tab on this page.
                  </ModuleCard>
                </div>
              </div>
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
      <div className="grid gap-8 lg:grid-cols-[0.98fr_1.02fr]">
        <SurfaceCard className="p-8">
          <SectionHeader
            title="Profile Details"
            description="Keep the account name, school, and grade current here. The event registration tabs reuse this information."
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
              <p
                className={`text-sm font-semibold ${
                  message === "Profile saved." ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {message}
              </p>
            ) : null}
          </form>
        </SurfaceCard>

        <SurfaceCard className="p-8">
          <SectionHeader
            title="Current Access"
            description="These statuses are attached to this one account and determine which profile tabs become available."
          />
          <div className="mt-4 grid gap-4">
            <StatusLine label="Account Type">
              {isCoachAccount ? "Coach account" : "Student account"}
            </StatusLine>
            {!isCoachAccount ? (
              <StatusLine label="Puzzle Night">
                {puzzleNightRegistration?.registrationType === "student"
                  ? "Student registration saved"
                  : "No Puzzle Night registration yet"}
              </StatusLine>
            ) : null}
            <StatusLine label="DTMT">
              {isCoachAccount
                ? dtmtSchool
                  ? `${dtmtSchool.schoolName} registered`
                  : "Coach registration not submitted yet"
                : dtmtStudentRegistration
                  ? `${dtmtStudentRegistration.registrationMode === "individual" ? "Independent entry" : dtmtStudentRegistration.schoolName}${dtmtStudentRegistration.teamLabel ? `, ${dtmtStudentRegistration.teamLabel}` : ""}`
                  : "No DTMT registration yet"}
            </StatusLine>
            {!isCoachAccount ? (
              <StatusLine label="D.PotD">
                {hasDpotdAccess ? "Registered and ready" : "Not registered yet"}
              </StatusLine>
            ) : null}
            <StatusLine label="Coach Details">
              {dtmtCoachProfile
                ? `${dtmtCoachProfile.coachName}${dtmtCoachProfile.title ? `, ${dtmtCoachProfile.title}` : ""}`
                : isCoachAccount
                  ? "Not submitted yet"
                  : "Not applicable to student accounts"}
            </StatusLine>
          </div>
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
