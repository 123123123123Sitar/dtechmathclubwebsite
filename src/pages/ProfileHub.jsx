import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DpotdDashboardPanel from "../components/DpotdDashboardPanel";
import DtmtDashboardPanel from "../components/DtmtDashboardPanel";
import FlowSection from "../components/FlowSection";
import HeroMediaPanel from "../components/HeroMediaPanel";
import PageHero from "../components/PageHero";
import ProfileAuthPanel from "../components/ProfileAuthPanel";
import PuzzleNightDashboardPanel from "../components/PuzzleNightDashboardPanel";
import SectionHeader from "../components/SectionHeader";
import SplitPanel from "../components/SplitPanel";
import SurfaceCard from "../components/SurfaceCard";
import { useDpotdAuth } from "../context/DpotdAuthContext";
import { buildProfileNextHref, normalizeNextPath } from "../lib/siteAccountRouting";

const dashboardViews = new Set(["profile", "overview", "puzzle-night", "dpotd", "dtmt"]);

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
  const isCoachAccount = profile?.accountType === "coach";
  const nextParam = searchParams.get("next");
  const rawView = searchParams.get("view");
  const activeView = normalizeDashboardView(rawView, isCoachAccount, hasDpotdAccess);
  const postAuthDestination = normalizeNextPath(nextParam, `/profile?view=${activeView}`);

  useEffect(() => {
    const desiredView = activeView;
    if (rawView !== desiredView) {
      const nextSearchParams = new URLSearchParams(searchParams);
      nextSearchParams.set("view", desiredView);
      setSearchParams(nextSearchParams, { replace: true });
    }
  }, [activeView, rawView, searchParams, setSearchParams]);

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

    if (activeView === "puzzle-night") {
      return [
        { label: "Profile", to: "/profile?view=profile" },
        { label: "DTMT", to: "/profile?view=dtmt", variant: "ghost" },
      ];
    }

    if (activeView === "dtmt") {
      return [
        { label: "Profile", to: "/profile?view=profile" },
        {
          label: isCoachAccount ? "Puzzle Night" : hasDpotdAccess ? "D.PotD" : "Puzzle Night",
          to: isCoachAccount ? "/profile?view=puzzle-night" : hasDpotdAccess ? "/profile?view=dpotd" : "/profile?view=puzzle-night",
          variant: "ghost",
        },
      ];
    }

    if (activeView === "dpotd") {
      return [
        { label: "Open Testing Portal", href: "/dpotd-portal/student.html" },
        { label: "Profile", to: "/profile?view=profile", variant: "ghost" },
      ];
    }

    return isCoachAccount
      ? [
          { label: "Puzzle Night", to: "/profile?view=puzzle-night" },
          { label: "DTMT", to: "/profile?view=dtmt", variant: "ghost" },
        ]
      : [
          { label: "Puzzle Night", to: "/profile?view=puzzle-night" },
          { label: "DTMT", to: "/profile?view=dtmt", variant: "ghost" },
          ...(hasDpotdAccess ? [{ label: "D.PotD", to: "/profile?view=dpotd", variant: "ghost" }] : []),
        ];
  }, [activeView, authReady, hasDpotdAccess, isCoachAccount, user]);

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

  return (
    <>
      <PageHero
        actions={heroActions}
        aside={
          <HeroMediaPanel
            alt="Design Tech Math Club banner"
            badge={authReady && user ? "Account Dashboard" : "Shared Account"}
            caption={
              authReady && user
                ? "This one account changes what you can do based on whether it is a coach or student account."
                : "Create one account first, then use the matching coach or student dashboard for Puzzle Night, DTMT, and D.PotD."
            }
            imageClassName="object-contain p-8 md:p-10"
            src="/dtechmathclublogolarger.jpg"
          />
        }
        description="The account dashboard is role-based. Coaches manage school registrations and rosters. Students submit event forms and track their own status from the same signed-in account."
        highlights={["Coach and Student Accounts", "Role-Based Event Pages", "One Shared Sign-In"]}
        title={authReady && user ? `Welcome back, ${profile?.name || "Member"}` : "Account Dashboard"}
      />

      {authReady && user ? (
        <FlowSection>
          <section className="py-8">
            <div className="mx-auto w-[min(calc(100%-2rem),1180px)]">
              <DashboardNav
                activeView={activeView}
                hasDpotdAccess={hasDpotdAccess}
                isCoachAccount={isCoachAccount}
              />
            </div>
          </section>
        </FlowSection>
      ) : null}

      {authReady && user ? (
        <FlowSection glow={activeView === "profile" ? "muted" : undefined}>
          <section className="py-10">
            <div className="mx-auto w-[min(calc(100%-2rem),1180px)]">
              {activeView === "profile" ? (
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
                  profile={profile}
                  puzzleNightRegistration={puzzleNightRegistration}
                  saving={saving}
                />
              ) : null}

              {activeView === "puzzle-night" ? <PuzzleNightDashboardPanel /> : null}
              {activeView === "dtmt" ? <DtmtDashboardPanel /> : null}
              {activeView === "dpotd" ? <DpotdDashboardPanel /> : null}
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
                      Choose coach or student when you create the account. The dashboard changes
                      based on that role after sign-in.
                    </p>
                  </>
                }
                right={
                  <ProfileAuthPanel
                    coachRedirectTo={nextParam ? null : "/profile?view=dtmt"}
                    defaultMode={nextParam ? "signin" : "register"}
                    embedded
                    hideWhenSignedIn
                    redirectTo={postAuthDestination}
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
                  description="Coach accounts get coach forms and school rosters. Student accounts get student registration forms and D.PotD access."
                  title="Account Types"
                />
                <div className="mt-8 grid gap-5 md:grid-cols-2">
                  <ModuleCard
                    actionLabel="Create Coach Account"
                    actionTo={buildProfileNextHref("/profile?view=dtmt")}
                    title="Coach Dashboard"
                  >
                    Coach accounts unlock DTMT and Puzzle Night dashboard pages after sign-in,
                    including school registration, coach RSVP forms, and student roster visibility.
                  </ModuleCard>
                  <ModuleCard
                    actionLabel="Create Student Account"
                    actionTo={buildProfileNextHref("/profile?view=puzzle-night")}
                    title="Student Dashboard"
                  >
                    Student accounts unlock DTMT, Puzzle Night, D.PotD, and profile pages after
                    sign-in, with forms attached directly to that student account.
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

function normalizeDashboardView(view, isCoachAccount, hasDpotdAccess) {
  if (!dashboardViews.has(view)) {
    return "profile";
  }

  if (view === "overview") {
    return "profile";
  }

  if (view === "dpotd" && (isCoachAccount || !hasDpotdAccess)) {
    return isCoachAccount ? "profile" : "dpotd";
  }

  return view;
}

function DashboardNav({ activeView, hasDpotdAccess, isCoachAccount }) {
  const items = [
    ["profile", "Profile"],
    ["puzzle-night", "Puzzle Night"],
    ["dtmt", "DTMT"],
  ];

  if (!isCoachAccount) {
    items.splice(2, 0, ["dpotd", "D.PotD"]);
  }

  return (
    <div className="flex flex-wrap gap-3">
      {items
        .filter(([value]) => value !== "dpotd" || hasDpotdAccess || !isCoachAccount)
        .map(([value, label]) => (
          <Link
            key={value}
            className={`inline-flex rounded-full px-5 py-3 text-sm font-bold transition-all duration-200 ${
              activeView === value
                ? "bg-brand text-white shadow-md shadow-brand-glow"
                : "border border-brand bg-white/70 text-brand hover:bg-brand hover:text-white"
            }`}
            to={`/profile?view=${value}`}
          >
            {label}
          </Link>
        ))}
    </div>
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
  profile,
  puzzleNightRegistration,
  saving,
}) {
  return (
    <div className="grid gap-8">
      <div className="grid gap-8 lg:grid-cols-[0.98fr_1.02fr]">
        <SurfaceCard className="p-8">
          <SectionHeader
            title="Profile Details"
            description="Keep the account name, school, and grade current here. The event pages reuse this information instead of making you type it again."
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
            description="The dashboard pages below are determined by this account type and the event forms already attached to this account."
          />
          <div className="mt-4 grid gap-4">
            <StatusLine label="Account Type">
              {isCoachAccount ? "Coach account" : "Student account"}
            </StatusLine>
            <StatusLine label="Puzzle Night">
              {puzzleNightRegistration
                ? `${puzzleNightRegistration.registrationType === "coach" ? "Coach" : "Student"} registration saved`
                : "No Puzzle Night registration yet"}
            </StatusLine>
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
                {hasDpotdAccess ? "Registered and dashboard-ready" : "Not registered yet"}
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

      <div className={`grid gap-5 ${isCoachAccount ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        <ModuleCard
          actionLabel="Open Puzzle Night"
          actionTo="/profile?view=puzzle-night"
          title="Puzzle Night"
        >
          {isCoachAccount
            ? "Submit the coach RSVP and track students from your school who sign up."
            : "Submit the student Puzzle Night form. School selection is optional but helps your coach track attendance."}
        </ModuleCard>
        {!isCoachAccount ? (
          <ModuleCard
            actionLabel="Open D.PotD"
            actionTo="/profile?view=dpotd"
            title="D.PotD"
          >
            Submit the student D.PotD registration, then use the portal and dashboard from this
            same account.
          </ModuleCard>
        ) : null}
        <ModuleCard actionLabel="Open DTMT" actionTo="/profile?view=dtmt" title="DTMT">
          {isCoachAccount
            ? "Register your school, RSVP for coach attendance, review student submissions, and build teams."
            : "Choose a coach-registered school or sign up as an individual, then submit lunch, waiver, payment, and round preferences."}
        </ModuleCard>
      </div>
    </div>
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
