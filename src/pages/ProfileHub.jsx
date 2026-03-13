import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DpotdDashboardPanel from "../components/DpotdDashboardPanel";
import FlowSection from "../components/FlowSection";
import HeroMediaPanel from "../components/HeroMediaPanel";
import PageHero from "../components/PageHero";
import ProfileAuthPanel from "../components/ProfileAuthPanel";
import SectionHeader from "../components/SectionHeader";
import SplitPanel from "../components/SplitPanel";
import SurfaceCard from "../components/SurfaceCard";
import { useDpotdAuth } from "../context/DpotdAuthContext";

const dashboardViews = new Set(["overview", "dpotd", "dtmt"]);

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

  const activeView = dashboardViews.has(searchParams.get("view"))
    ? searchParams.get("view")
    : "overview";

  useEffect(() => {
    if (!dashboardViews.has(searchParams.get("view")) && searchParams.get("view") !== null) {
      setSearchParams({ view: "overview" }, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    if (isCoachAccount && !hasDpotdAccess && activeView === "dpotd") {
      setSearchParams({ view: "overview" }, { replace: true });
    }
  }, [activeView, hasDpotdAccess, isCoachAccount, setSearchParams]);

  useEffect(() => {
    setForm({
      grade: profile?.grade || "",
      name: profile?.name || "",
      school: profile?.school || "",
    });
  }, [profile, user]);

  const heroActions = useMemo(() => {
    if (authReady && user && isCoachAccount && activeView === "dtmt") {
      return [
        { label: "Open DTMT Registration", to: "/dtmt/register" },
        { label: "Profile Overview", to: "/profile?view=overview", variant: "ghost" },
      ];
    }

    if (authReady && user && activeView === "dpotd" && hasDpotdAccess) {
      return [
        { label: "Open Testing Portal", href: "/dpotd-portal/student.html" },
        { label: "DTMT Status", to: "/profile?view=dtmt", variant: "ghost" },
      ];
    }

    if (authReady && user && activeView === "dtmt") {
      return [
        { label: "Open DTMT Registration", to: "/dtmt/register" },
        { label: "Profile Overview", to: "/profile?view=overview", variant: "ghost" },
      ];
    }

    if (authReady && user && hasDpotdAccess) {
      return [
        { label: "Open D.PotD Dashboard", to: "/profile?view=dpotd" },
        { label: "Open DTMT Status", to: "/profile?view=dtmt", variant: "ghost" },
      ];
    }

    if (authReady && user && isCoachAccount) {
      return [
        { label: "Open DTMT Registration", to: "/dtmt/register" },
        { label: "Puzzle Night Registration", to: "/puzzle-night/register", variant: "ghost" },
      ];
    }

    if (authReady && user) {
      return [
        { label: "Register for D.PotD", to: "/dpotd/register" },
        { label: "Open DTMT Registration", to: "/dtmt/register", variant: "ghost" },
      ];
    }

    return [];
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
                ? "This single account holds your event registrations, D.PotD access, and DTMT role information."
                : "Create one Design Tech Math Club account first, then use it across Puzzle Night, D.PotD, and DTMT."
            }
            imageClassName="object-contain p-8 md:p-10"
            src="/dtechmathclublogolarger.jpg"
          />
        }
        description="This is the shared website account for the Design Tech Math Club. Puzzle Night, D.PotD, and DTMT registration details all attach to this same account."
        highlights={["One Account", "Event Access by Registration", "No Separate D.PotD Login"]}
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
        <FlowSection glow={activeView === "overview" ? "muted" : undefined}>
          <section className="py-10">
            <div className="mx-auto w-[min(calc(100%-2rem),1180px)]">
              {activeView === "overview" ? (
                <OverviewPanel
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

              {activeView === "dpotd" ? <DpotdDashboardPanel /> : null}

              {activeView === "dtmt" ? (
                <DtmtStatusPanel
                  dtmtCoachProfile={dtmtCoachProfile}
                  dtmtSchool={dtmtSchool}
                  dtmtStudentRegistration={dtmtStudentRegistration}
                />
              ) : null}
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
                      Start here when you want access to account-based features. Puzzle Night,
                      D.PotD, and DTMT all build on this same profile.
                    </p>
                  </>
                }
                right={
                  <ProfileAuthPanel
                    defaultMode="register"
                    embedded
                    hideWhenSignedIn
                    redirectTo={`/profile?view=${activeView}`}
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
                  description="Each event uses the same account, but access opens only after the matching registration is completed."
                  title="What This Account Unlocks"
                />
                <div className="mt-8 grid gap-5 md:grid-cols-3">
                  <ModuleCard actionLabel="Puzzle Night" actionTo="/puzzle-night/register" title="Puzzle Night">
                    Sign in, submit the form, and the registration is saved directly to this
                    profile.
                  </ModuleCard>
                  <ModuleCard actionLabel="D.PotD Registration" actionTo="/dpotd/register" title="D.PotD">
                    Submit the D.PotD form from this account to activate the dashboard and testing
                    access.
                  </ModuleCard>
                  <ModuleCard actionLabel="DTMT Registration" actionTo="/dtmt/register" title="DTMT">
                    Coaches manage schools and rosters here, while students register for rounds,
                    complete waivers, and record payment.
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

function DashboardNav({ activeView, hasDpotdAccess, isCoachAccount }) {
  const items = [["overview", "Overview"]];

  if (!isCoachAccount || hasDpotdAccess) {
    items.push(["dpotd", "D.PotD"]);
  }

  items.push(["dtmt", "DTMT"]);

  return (
    <div className="flex flex-wrap gap-3">
      {items.map(([value, label]) => (
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

function OverviewPanel({
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
            description="Keep the shared account details current here. Event registrations reuse this information instead of making students and coaches start over each time."
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
            description="These statuses are attached to this one account and determine which account-based features become available."
          />
          <div className="mt-4 grid gap-4">
            <StatusLine label="Account Type">
              {profile?.accountType === "coach" ? "Coach account" : "Student account"}
            </StatusLine>
            <StatusLine label="D.PotD">
              {isCoachAccount
                ? "Student access not enabled for this coach account"
                : hasDpotdAccess
                  ? "Registered and dashboard-ready"
                  : "Account active, registration not submitted yet"}
            </StatusLine>
            <StatusLine label="Puzzle Night">
              {puzzleNightRegistration ? "Puzzle Night registration saved" : "No account-linked Puzzle Night registration yet"}
            </StatusLine>
            <StatusLine label="DTMT Coach">
              {dtmtCoachProfile ? "Coach profile active" : "Coach permissions not created yet"}
            </StatusLine>
            <StatusLine label="DTMT Student">
              {dtmtStudentRegistration
                ? `Registered${dtmtStudentRegistration.teamLabel ? `, ${dtmtStudentRegistration.teamLabel}` : ", team pending"}`
                : "No DTMT student registration yet"}
            </StatusLine>
            <StatusLine label="DTMT School">
              {dtmtSchool ? dtmtSchool.schoolName : "No school registered by this account"}
            </StatusLine>
          </div>
        </SurfaceCard>
      </div>

      <div className={`grid gap-5 ${isCoachAccount ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
        <ModuleCard
          actionLabel={puzzleNightRegistration ? "Update Puzzle Night" : "Register for Puzzle Night"}
          actionTo="/puzzle-night/register"
          title="Puzzle Night"
        >
          {puzzleNightRegistration
            ? `This account already has a Puzzle Night registration saved${profile?.email ? ` under ${profile.email}` : ""}.`
            : "Puzzle Night stays a simple form-based registration, but it is saved directly to this account."}
        </ModuleCard>
        {!isCoachAccount ? (
          <ModuleCard
            actionLabel={hasDpotdAccess ? "Open D.PotD Dashboard" : "Register for D.PotD"}
            actionTo={hasDpotdAccess ? "/profile?view=dpotd" : "/dpotd/register"}
            title="D.PotD"
          >
            {hasDpotdAccess
              ? "Your D.PotD portal is no longer a separate sign-in flow. The dashboard now lives inside this profile and the testing portal follows the same session."
              : "D.PotD requires this shared account first. Once the form is submitted, D.PotD access turns on for this same account."}
          </ModuleCard>
        ) : null}
        <ModuleCard
          actionLabel="Open DTMT Registration"
          actionTo="/dtmt/register"
          title="DTMT"
        >
          Coaches create coach profiles and school entries here. Students register under a school, choose rounds, complete waiver and payment steps, then later see team assignments.
        </ModuleCard>
      </div>
    </div>
  );
}

function DtmtStatusPanel({ dtmtCoachProfile, dtmtSchool, dtmtStudentRegistration }) {
  return (
    <div className="grid gap-8 lg:grid-cols-[0.96fr_1.04fr]">
      <SurfaceCard className="p-8">
        <SectionHeader
          title="DTMT Role Status"
          description="DTMT uses the same shared account, but permissions change based on whether the account has coach data, student registration data, or both."
        />
        <div className="mt-4 grid gap-4">
          <StatusLine label="Coach Profile">
            {dtmtCoachProfile
              ? `${dtmtCoachProfile.coachName}${dtmtCoachProfile.title ? `, ${dtmtCoachProfile.title}` : ""}`
              : "Not created yet"}
          </StatusLine>
          <StatusLine label="School Registration">
            {dtmtSchool
              ? `${dtmtSchool.schoolName}, ${dtmtSchool.city}, ${dtmtSchool.state}`
              : "No DTMT school registered yet"}
          </StatusLine>
          <StatusLine label="Student Registration">
            {dtmtStudentRegistration
              ? `${dtmtStudentRegistration.schoolName} | ${dtmtStudentRegistration.subjectRounds.join(", ")}`
              : "No DTMT student registration yet"}
          </StatusLine>
          <StatusLine label="Team Assignment">
            {dtmtStudentRegistration?.teamLabel || "Pending coach assignment"}
          </StatusLine>
          <StatusLine label="Payment">
            {dtmtStudentRegistration?.paymentStatus
              ? `${dtmtStudentRegistration.paymentStatus} via ${dtmtStudentRegistration.paymentMethod}`
              : "Not submitted"}
          </StatusLine>
        </div>
      </SurfaceCard>

      <SurfaceCard className="p-8">
        <SectionHeader
          title="Next Step"
          description="The detailed DTMT registration page is where coach setup, school registration, student registration, waiver capture, payment status, roster visibility, and team assignment are handled. This profile tab is the summary view."
        />
        <div className="mt-4 grid gap-4">
          {[
            dtmtCoachProfile
              ? "Coach permissions are already attached to this account."
              : "Create a coach profile first if this account needs school management permissions.",
            dtmtSchool
              ? "Your school registration is active and the roster table is available from the DTMT registration page."
              : "Once a coach profile exists, the next step is registering the school.",
            dtmtStudentRegistration
              ? "Your student registration is saved and visible to the selected school coach."
              : "Students can register once they pick a school, choose subject rounds, finish the waiver, and complete the payment step.",
          ].map((item) => (
            <div key={item} className="border-t border-border-subtle pt-4 text-sm leading-relaxed text-txt-muted">
              {item}
            </div>
          ))}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light"
              to="/dtmt/register"
            >
              Open DTMT Registration
            </Link>
            <Link
              className="inline-flex rounded-full border border-brand px-6 py-3 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
              to="/dtmt"
            >
              Review DTMT Page
            </Link>
          </div>
        </div>
      </SurfaceCard>
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

function ModuleCard({ actionLabel, actionTo, title, children }) {
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

function StatusLine({ label, children }) {
  return (
    <div className="border-t border-border-subtle pt-4">
      <p className="text-sm font-bold text-txt">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-txt-muted">{children}</p>
    </div>
  );
}
