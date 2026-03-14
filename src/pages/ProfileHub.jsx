import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import FlowSection from "../components/FlowSection";
import HeroMediaPanel from "../components/HeroMediaPanel";
import PageHero from "../components/PageHero";
import ProfileAuthPanel from "../components/ProfileAuthPanel";
import SectionHeader from "../components/SectionHeader";
import SplitPanel from "../components/SplitPanel";
import SurfaceCard from "../components/SurfaceCard";
import { useDpotdAuth } from "../context/DpotdAuthContext";
import { buildProfileNextHref, normalizeNextPath } from "../lib/siteAccountRouting";

const legacyViewRoutes = {
  dtmt: "/dtmt/register",
  "puzzle-night": "/puzzle-night/register",
  dpotd: "/dpotd/register",
  overview: "/profile",
};

export default function ProfileHub() {
  const [searchParams] = useSearchParams();
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
  const postAuthDestination = normalizeNextPath(nextParam, "/profile");

  useEffect(() => {
    setForm({
      grade: profile?.grade || "",
      name: profile?.name || "",
      school: profile?.school || "",
    });
  }, [profile, user]);

  const heroActions = useMemo(() => {
    if (!authReady || !user) {
      return [];
    }

    return isCoachAccount
      ? []
      : [
          { label: "Puzzle Night", to: "/puzzle-night/register" },
          { label: "DTMT", to: "/dtmt/register", variant: "ghost" },
          { label: "D.PotD", to: "/dpotd/register", variant: "ghost" },
        ];
  }, [authReady, isCoachAccount, user]);

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

  if (rawView && legacyViewRoutes[rawView]) {
    return <Navigate replace to={legacyViewRoutes[rawView]} />;
  }

  return (
    <>
      <PageHero
        actions={heroActions}
        aside={
          <HeroMediaPanel
            alt="Design Tech Math Club banner"
            badge={authReady && user ? "Account Profile" : "Shared Account"}
            caption={
              authReady && user
                ? "Use this page for your account details, then open the separate event registration pages from here."
                : "Create one account first, then open the separate DTMT, Puzzle Night, and D.PotD registration pages after sign-in."
            }
            imageClassName="object-contain p-8 md:p-10"
            src="/dtechmathclublogolarger.jpg"
          />
        }
        description="This page is only for the shared account profile. Event registration forms live on their own DTMT, Puzzle Night, and D.PotD pages."
        highlights={["One Shared Sign-In", "Separate Registration Pages", "Coach and Student Accounts"]}
        title={authReady && user ? `Welcome back, ${profile?.name || "Member"}` : "Account Profile"}
      />

      {authReady && user ? (
        <FlowSection glow="muted">
          <section className="py-10">
            <div className="mx-auto w-[min(calc(100%-2rem),1180px)]">
              <ProfilePanel
                dtmtCoachProfile={dtmtCoachProfile}
                dtmtSchool={dtmtSchool}
                dtmtStudentRegistration={dtmtStudentRegistration}
                form={form}
                handleChange={handleChange}
                handleSignOut={handleSignOut}
                handleSubmit={handleSubmit}
                hasDpotdAccess={hasDpotdAccess}
                isCoachAccount={isCoachAccount}
                message={message}
                puzzleNightRegistration={puzzleNightRegistration}
                saving={saving}
              />
            </div>
          </section>
        </FlowSection>
      ) : (
        <>
          <FlowSection>
            <section className="py-8">
              <SplitPanel
                left={
                  <>
                    <h2 className="text-3xl font-black text-txt">Create your shared account</h2>
                    <p className="mt-4 leading-relaxed text-txt-muted">
                      Choose coach or student when you create the account. The profile page stays
                      separate from the event registration pages.
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
                  description="Create your account here first, then open the separate event registration pages."
                  title="After Sign-In"
                />
                <div className="mt-8 grid gap-5 md:grid-cols-3">
                  <ModuleCard
                    actionLabel="Sign In for Puzzle Night"
                    actionTo={buildProfileNextHref("/puzzle-night/register")}
                    title="Puzzle Night"
                  >
                    Puzzle Night registration happens on its own page after sign-in.
                  </ModuleCard>
                  <ModuleCard
                    actionLabel="Sign In for DTMT"
                    actionTo={buildProfileNextHref("/dtmt/register")}
                    title="DTMT"
                  >
                    DTMT registration, school management, and team building happen on the DTMT
                    registration page.
                  </ModuleCard>
                  <ModuleCard
                    actionLabel="Sign In for D.PotD"
                    actionTo={buildProfileNextHref("/dpotd/register")}
                    title="D.PotD"
                  >
                    D.PotD registration and portal status live on the D.PotD page, not here.
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
            description="Keep the account name, school, and grade current here. The separate event pages reuse this information."
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
              <p className={`text-sm font-semibold ${message === "Profile saved." ? "text-emerald-500" : "text-red-500"}`}>
                {message}
              </p>
            ) : null}
          </form>
        </SurfaceCard>

        <SurfaceCard className="p-8">
          <SectionHeader
            title="Current Access"
            description="This account type controls which separate registration pages and forms are available."
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
      <div className={`grid gap-5 ${isCoachAccount ? "md:grid-cols-1" : "md:grid-cols-3"}`}>
        {!isCoachAccount ? (
          <ModuleCard
            actionLabel="Register Here"
            actionTo="/puzzle-night/register"
            title="Puzzle Night"
          >
            {puzzleNightRegistration?.registrationType === "student"
              ? "Open the separate Puzzle Night registration page to review or edit your saved student form."
              : "Open the separate Puzzle Night registration page to submit the student form."}
          </ModuleCard>
        ) : null}
        {!isCoachAccount ? (
          <ModuleCard actionLabel="Register Here" actionTo="/dpotd/register" title="D.PotD">
            Open the separate D.PotD page to register and manage portal access.
          </ModuleCard>
        ) : null}
        <ModuleCard actionLabel="Register Here" actionTo="/dtmt/register" title="DTMT">
          {isCoachAccount
            ? "Open the separate DTMT registration page to register your school and manage teams."
            : "Open the separate DTMT registration page to submit the student competition form."}
        </ModuleCard>
      </div>

      {!isCoachAccount && puzzleNightRegistration?.registrationType === "student" ? (
        <PuzzleNightSubmissionCard registration={puzzleNightRegistration} />
      ) : null}
    </div>
  );
}

function PuzzleNightSubmissionCard({ registration }) {
  return (
    <SurfaceCard className="p-8">
      <SectionHeader
        title="Puzzle Night Submission"
        description="This is the Puzzle Night registration currently saved for your student account. Use the event page if you need to edit it."
      />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <StatusLine label="Student Name">
          {registration.name || "Not submitted yet"}
        </StatusLine>
        <StatusLine label="Grade">
          {registration.grade || "Not submitted yet"}
        </StatusLine>
        <StatusLine label="School">
          {registration.schoolName || "Left blank"}
        </StatusLine>
        <StatusLine label="Parent Contact">
          {registration.parentEmail || "Not submitted yet"}
        </StatusLine>
        <StatusLine label="Math Teacher Email">
          {registration.teacherEmail || "Left blank"}
        </StatusLine>
        <StatusLine label="Notes">
          {registration.notes || "No notes added"}
        </StatusLine>
      </div>
      <Link
        className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light"
        to="/puzzle-night/register"
      >
        Edit Puzzle Night Submission
      </Link>
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
        className="w-full rounded-2xl border border-[rgba(234,109,74,0.14)] bg-[#fffaf6] px-4 py-3 text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
        {...props}
      />
    </label>
  );
}
