import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import FlowSection from "../components/FlowSection";
import PageHero from "../components/PageHero";
import SectionHeader from "../components/SectionHeader";
import SurfaceCard from "../components/SurfaceCard";
import { useDpotdAuth } from "../context/DpotdAuthContext";
import { db } from "../lib/dpotdFirebase";

const initialDashboard = {
  activeTest: null,
  bestScore: 0,
  currentDay: null,
  durationMinutes: 60,
  history: [],
  leaderboard: [],
  rank: null,
  submittedToday: false,
  testsCompleted: 0,
  totalScore: 0,
};

function readDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  const next = new Date(value);
  return Number.isNaN(next.getTime()) ? null : next;
}

function toLower(value) {
  return String(value || "").trim().toLowerCase();
}

function formatMinutes(seconds) {
  const safe = Number(seconds || 0);
  return `${(safe / 60).toFixed(2)} min`;
}

function formatDateTime(value) {
  const date = readDate(value);
  if (!date) return "Pending";
  return date.toLocaleString();
}

function formatTimeRemaining(activeTest) {
  const endDate = readDate(activeTest?.endTime);
  if (!endDate) return "Resume available";
  const diff = Math.max(0, endDate.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m ${String(seconds).padStart(2, "0")}s`;
  }
  return `${minutes}m ${String(seconds).padStart(2, "0")}s`;
}

function buildLeaderboard(submissions) {
  const map = {};

  submissions.forEach((submission) => {
    const email = toLower(submission.studentEmail);
    if (!email) return;

    const q1 = submission.q1Correct ? 4 : 0;
    const q2 = submission.q2Correct ? 6 : 0;
    const q3 = Number(submission.q3Score || 0);

    if (!map[email]) {
      map[email] = {
        completedDays: 0,
        email,
        name: submission.studentName || submission.studentEmail || "Student",
        totalScore: 0,
        totalTime: 0,
      };
    }

    map[email].completedDays += 1;
    map[email].totalScore += q1 + q2 + q3;
    map[email].totalTime += Number(submission.totalTime || 0);
  });

  return Object.values(map).sort((left, right) => {
    if (right.totalScore !== left.totalScore) {
      return right.totalScore - left.totalScore;
    }
    return left.totalTime - right.totalTime;
  });
}

async function loadPortalDashboard(user, email) {
  const [settingsResult, scheduleResult, submissionsResult, adminResult] = await Promise.allSettled([
    getDoc(doc(db, "settings", "appSettings")),
    getDocs(collection(db, "schedule")),
    getDocs(collection(db, "submissions")),
    getDocs(query(collection(db, "users"), where("isAdmin", "==", true))),
  ]);

  const durationMinutes = settingsResult.status === "fulfilled"
    ? settingsResult.value.data()?.testDuration || 60
    : 60;

  const scheduleDocs = scheduleResult.status === "fulfilled"
    ? scheduleResult.value.docs.map((item) => ({ id: item.id, ...item.data() }))
    : [];

  const adminEmails = new Set();
  if (adminResult.status === "fulfilled") {
    adminResult.value.forEach((item) => {
      const nextEmail = toLower(item.data()?.email);
      if (nextEmail) adminEmails.add(nextEmail);
    });
  }

  const allSubmissions = submissionsResult.status === "fulfilled"
    ? submissionsResult.value.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .filter((submission) => !adminEmails.has(toLower(submission.studentEmail)))
    : [];

  const leaderboard = buildLeaderboard(allSubmissions);
  const history = allSubmissions
    .filter((submission) => toLower(submission.studentEmail) === email)
    .sort((left, right) => {
      const leftTime = readDate(left.timestamp)?.getTime() || 0;
      const rightTime = readDate(right.timestamp)?.getTime() || 0;
      return rightTime - leftTime;
    });

  const currentDay = scheduleDocs.reduce((latest, item) => {
    const openTime = readDate(item.openTime);
    if (!openTime || openTime > new Date()) return latest;
    if (latest === null || Number(item.day) > latest) return Number(item.day);
    return latest;
  }, null);

  const activeResult = currentDay
    ? await getDoc(doc(db, "activeTests", `${user.uid}_day${currentDay}`)).catch(() => null)
    : null;

  const activeTest = activeResult?.exists() ? activeResult.data() : null;
  const submittedToday = currentDay
    ? history.some((submission) => Number(submission.day) === Number(currentDay))
    : false;

  const userEntry = leaderboard.find((entry) => entry.email === email) || null;
  const rank = userEntry ? leaderboard.findIndex((entry) => entry.email === email) + 1 : null;
  const bestScore = history.reduce((best, submission) => {
    const score =
      (submission.q1Correct ? 4 : 0) +
      (submission.q2Correct ? 6 : 0) +
      Number(submission.q3Score || 0);
    return Math.max(best, score);
  }, 0);

  return {
    activeTest,
    bestScore,
    currentDay,
    durationMinutes,
    history,
    leaderboard: leaderboard.slice(0, 5),
    rank,
    submittedToday,
    testsCompleted: history.length,
    totalScore: userEntry?.totalScore || 0,
  };
}

export default function DPotDPortal() {
  const {
    authReady,
    hasDpotdAccess,
    portalProfile,
    profile,
    signOutAccount,
    updateSiteProfile,
    user,
  } = useDpotdAuth();
  const [profileForm, setProfileForm] = useState({
    grade: "",
    name: "",
    school: "",
  });
  const [profileMessage, setProfileMessage] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");

  useEffect(() => {
    setProfileForm({
      grade: profile?.grade || "",
      name: profile?.name || user?.email || "",
      school: profile?.school || "",
    });
  }, [profile, user]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!authReady || !user || !hasDpotdAccess) {
        setDashboard(initialDashboard);
        setDashboardLoading(false);
        setDashboardError("");
        return;
      }

      setDashboardLoading(true);
      setDashboardError("");

      try {
        const nextDashboard = await loadPortalDashboard(user, toLower(profile?.email || user.email));
        if (!cancelled) {
          setDashboard(nextDashboard);
        }
      } catch (_) {
        if (!cancelled) {
          setDashboardError(
            "Unable to load the portal dashboard right now. If this continues, contact dtechmathclub@gmail.com.",
          );
        }
      } finally {
        if (!cancelled) {
          setDashboardLoading(false);
        }
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [authReady, hasDpotdAccess, profile?.email, user]);

  function handleProfileChange(event) {
    const { name, value } = event.target;
    setProfileForm((current) => ({ ...current, [name]: value }));
    setProfileMessage("");
  }

  async function handleProfileSave(event) {
    event.preventDefault();
    setSavingProfile(true);

    const result = await updateSiteProfile(profileForm);

    setSavingProfile(false);
    setProfileMessage(result.ok ? "Profile saved." : result.error);
  }

  async function handleSignOut() {
    await signOutAccount();
    setProfileMessage("");
  }

  const roleLabel = portalProfile?.isAdmin ? "Admin" : portalProfile?.isGrader ? "Grader" : "Student";

  return (
    <>
      <PageHero
        actions={
          authReady && user && hasDpotdAccess
            ? [
                { label: "Enter Testing Portal", href: "/dpotd-portal/student.html" },
                { label: "Open Profile Hub", to: "/profile", variant: "ghost" },
              ]
            : authReady && user
              ? [
                  { label: "Complete D.PotD Registration", to: "/dpotd/register" },
                  { label: "Open Profile Hub", to: "/profile", variant: "ghost" },
                ]
            : [
                { label: "Sign In Through Profile", to: "/profile" },
                { label: "Open Registration", to: "/dpotd/register", variant: "ghost" },
              ]
        }
        aside={<PortalRulesPanel />}
        description="Review your D.PotD status, leaderboard standing, and score history here. Portal access is only activated after the signed-in account has completed the D.PotD registration form."
        eyebrow="D.PotD Portal"
        highlights={[
          "Tab switches may be recorded",
          "Leaderboard updates by end of next day",
          "Support: dtechmathclub@gmail.com",
        ]}
        title="Problem of the Day Dashboard"
      />

      {!authReady ? (
        <FlowSection>
          <section className="py-16">
            <div className="mx-auto w-[min(calc(100%-2rem),780px)]">
              <SurfaceCard className="p-8 text-center">
                <p className="text-lg font-semibold text-txt-muted">Checking your D.PotD session...</p>
              </SurfaceCard>
            </div>
          </section>
        </FlowSection>
      ) : null}

      {authReady && !user ? (
        <FlowSection>
          <section className="py-16">
            <div className="mx-auto grid w-[min(calc(100%-2rem),1180px)] gap-6 lg:grid-cols-[0.98fr_1.02fr]">
              <SurfaceCard className="p-8">
                <SectionHeader
                  eyebrow="Access"
                  title="Use Your Site Profile to Enter D.PotD"
                  description="Sign-in is handled through the shared profile page. Once signed in, you can return here to see your dashboard and open the testing workspace."
                />
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light"
                    to="/profile"
                  >
                    Open Profile Hub
                  </Link>
                  <Link
                    className="inline-flex rounded-full border border-brand px-6 py-3 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
                    to="/dpotd/register"
                  >
                    Create Account
                  </Link>
                </div>
              </SurfaceCard>

              <SurfaceCard className="p-8">
                <SectionHeader
                  eyebrow="Support"
                  title="Scoring, AI, and Leaderboard Notes"
                  description="If the AI helper is unavailable, your leaderboard score does not appear, or something looks wrong in the portal, contact dtechmathclub@gmail.com."
                />
                <div className="grid gap-4">
                  <NoticeCard title="Leaderboard Timing">
                    Leaderboards are generally updated before the end of the next day after grading
                    is processed.
                  </NoticeCard>
                  <NoticeCard title="Missing Scores">
                    If you do not see your leaderboard score after that window, email
                    dtechmathclub@gmail.com.
                  </NoticeCard>
                  <NoticeCard title="AI Issues">
                    If the AI helper or automated proof support does not work as expected, contact
                    dtechmathclub@gmail.com and continue without relying on it.
                  </NoticeCard>
                </div>
              </SurfaceCard>
            </div>
          </section>
        </FlowSection>
      ) : null}

      {authReady && user && !hasDpotdAccess ? (
        <FlowSection>
          <section className="py-16">
            <div className="mx-auto grid w-[min(calc(100%-2rem),1180px)] gap-6 lg:grid-cols-[1fr_1fr]">
              <SurfaceCard className="p-8">
                <SectionHeader
                  title="Complete D.PotD Registration First"
                  description="You are already signed into your Design Tech Math Club account, but this account does not have D.PotD portal access yet. Submit the D.PotD registration form first, and the portal profile will be created automatically for this same account."
                />
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light"
                    to="/dpotd/register"
                  >
                    Finish D.PotD Registration
                  </Link>
                  <Link
                    className="inline-flex rounded-full border border-brand px-6 py-3 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
                    to="/profile"
                  >
                    Open Profile Hub
                  </Link>
                </div>
              </SurfaceCard>

              <SurfaceCard className="p-8">
                <SectionHeader
                  title="What Gets Linked"
                  description="Once the D.PotD form is submitted from this signed-in account, the system connects the portal profile, testing access, leaderboard history, and submissions to that same account."
                />
                <div className="mt-6 grid gap-4">
                  {[
                    "Portal access is provisioned only after the D.PotD form is submitted.",
                    "The same signed-in account is then used for submissions and leaderboard data.",
                    "If the AI helper is unavailable or scores are missing after the next-day update window, contact dtechmathclub@gmail.com.",
                  ].map((item) => (
                    <div key={item} className="border-t border-border-subtle pt-4 text-sm leading-relaxed text-txt-muted">
                      {item}
                    </div>
                  ))}
                </div>
              </SurfaceCard>
            </div>
          </section>
        </FlowSection>
      ) : null}

      {authReady && user && hasDpotdAccess ? (
        <>
          <FlowSection glow="muted">
            <section className="py-16">
              <div className="mx-auto grid w-[min(calc(100%-2rem),1180px)] gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Overall Score" value={String(dashboard.totalScore)} />
                <StatCard label="Tests Completed" value={String(dashboard.testsCompleted)} />
                <StatCard label="Best Score" value={`${dashboard.bestScore}/20`} />
                <StatCard label="Overall Rank" value={dashboard.rank ? `#${dashboard.rank}` : "Unranked"} />
              </div>
            </section>
          </FlowSection>

          <FlowSection>
            <section className="py-18">
              <div className="mx-auto grid w-[min(calc(100%-2rem),1180px)] gap-8 lg:grid-cols-[1.14fr_0.86fr]">
                <div className="grid gap-8">
                  <SurfaceCard className="p-8">
                    <SectionHeader
                      eyebrow="Today"
                      title="Challenge Status"
                      description="During active tests, integrity signals such as tab switches, leaving the page, fullscreen exits, and attempted closes may be recorded for review."
                    />
                    {dashboardLoading ? (
                      <p className="text-sm font-semibold text-txt-muted">Loading live portal data...</p>
                    ) : dashboardError ? (
                      <p className="text-sm font-semibold text-red-500">{dashboardError}</p>
                    ) : (
                      <div className="grid gap-4">
                        <StatusCard label="Current Day">
                          {dashboard.currentDay ? `Day ${dashboard.currentDay}` : "No active scheduled day"}
                        </StatusCard>
                        <StatusCard label="Time Limit">
                          {dashboard.durationMinutes} minutes
                        </StatusCard>
                        <StatusCard label="Today's Submission">
                          {dashboard.submittedToday
                            ? "Already submitted"
                            : dashboard.activeTest
                              ? `Resume available with ${formatTimeRemaining(dashboard.activeTest)} remaining`
                              : dashboard.currentDay
                                ? "Available in the testing portal"
                                : "No live test right now"}
                        </StatusCard>
                        <div className="flex flex-wrap gap-3 pt-2">
                          <a
                            className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light"
                            href="/dpotd-portal/student.html"
                          >
                            {dashboard.activeTest ? "Resume Test" : "Open Testing Portal"}
                          </a>
                          <Link
                            className="inline-flex rounded-full border border-brand px-6 py-3 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
                            to="/dpotd/about"
                          >
                            Review D.PotD Details
                          </Link>
                        </div>
                      </div>
                    )}
                  </SurfaceCard>

                  <SurfaceCard className="p-8">
                    <SectionHeader
                      eyebrow="Leaderboard"
                      title="Top 5 Standings"
                      description="Leaderboard scores are typically updated before the end of the next day after grading is processed."
                    />
                    <div className="overflow-hidden rounded-[24px] border border-[rgba(234,109,74,0.12)]">
                      <table className="min-w-full border-collapse bg-white/80 text-sm">
                        <thead>
                          <tr className="bg-brand/10 text-left text-brand">
                            <th className="px-4 py-3 font-extrabold">Rank</th>
                            <th className="px-4 py-3 font-extrabold">Name</th>
                            <th className="px-4 py-3 font-extrabold">Score</th>
                            <th className="px-4 py-3 font-extrabold">Tests</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dashboard.leaderboard.length ? (
                            dashboard.leaderboard.map((entry, index) => (
                              <tr key={`${entry.email}-${index}`} className="border-t border-[rgba(234,109,74,0.10)]">
                                <td className="px-4 py-3 font-bold text-txt">#{index + 1}</td>
                                <td className="px-4 py-3 text-txt">{entry.name}</td>
                                <td className="px-4 py-3 text-txt-muted">{entry.totalScore}</td>
                                <td className="px-4 py-3 text-txt-muted">{entry.completedDays}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td className="px-4 py-4 text-txt-muted" colSpan="4">
                                No submissions yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-txt-muted">
                      If you do not see your score after the next-day update window, contact
                      dtechmathclub@gmail.com.
                    </p>
                  </SurfaceCard>

                  <SurfaceCard className="p-8">
                    <SectionHeader
                      eyebrow="History"
                      title="Your Score History"
                      description="If a proof score or AI-related result looks delayed, continue checking back until the next-day update window and contact dtechmathclub@gmail.com if needed."
                    />
                    <div className="grid gap-4">
                      {dashboard.history.length ? (
                        dashboard.history.slice(0, 5).map((submission) => {
                          const totalScore =
                            (submission.q1Correct ? 4 : 0) +
                            (submission.q2Correct ? 6 : 0) +
                            Number(submission.q3Score || 0);

                          return (
                            <article
                              key={submission.id}
                              className="rounded-[24px] border border-[rgba(234,109,74,0.12)] bg-[#fffaf6] p-5"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                  <p className="text-lg font-black text-txt">Day {submission.day}</p>
                                  <p className="text-sm text-txt-muted">
                                    {formatDateTime(submission.timestamp)}
                                  </p>
                                </div>
                                <span className="rounded-full bg-brand px-4 py-2 text-sm font-black text-white">
                                  {totalScore}/20
                                </span>
                              </div>
                              <div className="mt-4 flex flex-wrap gap-3 text-sm text-txt-muted">
                                <span>Q1: {submission.q1Correct ? "Correct" : "Incorrect"}</span>
                                <span>Q2: {submission.q2Correct ? "Correct" : "Incorrect"}</span>
                                <span>Q3: {submission.q3Score ?? "Pending"}</span>
                                <span>Time: {formatMinutes(submission.totalTime)}</span>
                              </div>
                            </article>
                          );
                        })
                      ) : (
                        <p className="text-sm font-semibold text-txt-muted">
                          No submissions recorded for this account yet.
                        </p>
                      )}
                    </div>
                  </SurfaceCard>
                </div>

                <div className="grid gap-8">
                  <SurfaceCard className="p-8">
                    <SectionHeader
                      eyebrow="Profile"
                      title="Account Details"
                      description="Keep your student details current here so your account information stays accurate across D.PotD and other account-based pages."
                    />
                    <div className="border-t border-border-subtle pt-5">
                      <h3 className="text-2xl font-black text-txt">{profile?.name || user.email}</h3>
                      <p className="mt-2 text-sm text-txt-muted">{profile?.email || user.email}</p>
                      <div className="mt-4 inline-flex rounded-full bg-brand/10 px-4 py-2 text-sm font-bold text-brand">
                        {roleLabel}
                      </div>
                    </div>
                    <form className="mt-6 grid gap-4" onSubmit={handleProfileSave} noValidate>
                      <Field
                        label="Full Name"
                        name="name"
                        onChange={handleProfileChange}
                        value={profileForm.name}
                      />
                      <Field
                        label="School"
                        name="school"
                        onChange={handleProfileChange}
                        value={profileForm.school}
                      />
                      <Field
                        label="Grade"
                        name="grade"
                        onChange={handleProfileChange}
                        value={profileForm.grade}
                      />
                      {profileMessage ? (
                        <p className={`text-sm font-semibold ${profileMessage === "Profile saved." ? "text-emerald-500" : "text-red-500"}`}>
                          {profileMessage}
                        </p>
                      ) : null}
                      <div className="flex flex-wrap gap-3">
                        <button
                          className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={savingProfile}
                          type="submit"
                        >
                          {savingProfile ? "Saving..." : "Save Profile"}
                        </button>
                        <Link
                          className="inline-flex rounded-full border border-brand px-6 py-3 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
                          to="/profile"
                        >
                          Open Profile Hub
                        </Link>
                        <button
                          className="inline-flex rounded-full border border-brand px-6 py-3 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
                          onClick={handleSignOut}
                          type="button"
                        >
                          Sign Out
                        </button>
                      </div>
                    </form>
                  </SurfaceCard>

                  <SurfaceCard className="p-8">
                    <SectionHeader
                      eyebrow="Terms"
                      title="Portal Terms and Conditions"
                      description="These notices are intended to be visible and participant-facing inside the portal area."
                    />
                    <div className="grid gap-4">
                      <StatusCard label="Integrity Review">
                        Tab switches, leaving the page, fullscreen exits, and attempted closes may
                        be recorded during an active test.
                      </StatusCard>
                      <StatusCard label="Leaderboard Updates">
                        Leaderboards are generally updated before the end of the next day after
                        grading is processed.
                      </StatusCard>
                      <StatusCard label="Support">
                        If the AI helper does not work, your score is missing, or anything seems
                        incorrect, contact dtechmathclub@gmail.com.
                      </StatusCard>
                    </div>
                  </SurfaceCard>
                </div>
              </div>
            </section>
          </FlowSection>
        </>
      ) : null}
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

function NoticeCard({ title, children }) {
  return (
    <div className="border-t border-border-subtle pt-4">
      <p className="text-sm font-bold text-txt">{title}</p>
      <p className="mt-2 text-sm leading-relaxed text-txt-muted">{children}</p>
    </div>
  );
}

function PortalRulesPanel() {
  return (
    <SurfaceCard className="p-8">
      <h2 className="text-3xl font-black text-txt">Portal Rules and Support</h2>
      <div className="mt-6 grid gap-4">
        <NoticeCard title="Integrity Signals">
          During an active test, tab switches, visibility changes, fullscreen exits, and attempted
          closes may be recorded.
        </NoticeCard>
        <NoticeCard title="Leaderboard Timing">
          Leaderboard standings are generally updated before the end of the next day.
        </NoticeCard>
        <NoticeCard title="Need Help?">
          If the AI helper is unavailable or you do not see your score after the update window,
          contact dtechmathclub@gmail.com.
        </NoticeCard>
      </div>
    </SurfaceCard>
  );
}

function StatCard({ label, value }) {
  return (
    <SurfaceCard className="px-6 py-7">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand">{label}</p>
      <p className="mt-3 text-3xl font-black text-txt">{value}</p>
    </SurfaceCard>
  );
}

function StatusCard({ label, children }) {
  return (
    <div className="border-t border-border-subtle pt-4">
      <p className="text-sm font-bold text-txt">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-txt-muted">{children}</p>
    </div>
  );
}
