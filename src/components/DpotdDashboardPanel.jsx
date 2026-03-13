import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import SectionHeader from "./SectionHeader";
import SurfaceCard from "./SurfaceCard";
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

  const durationMinutes =
    settingsResult.status === "fulfilled" ? settingsResult.value.data()?.testDuration || 60 : 60;

  const scheduleDocs =
    scheduleResult.status === "fulfilled"
      ? scheduleResult.value.docs.map((item) => ({ id: item.id, ...item.data() }))
      : [];

  const adminEmails = new Set();
  if (adminResult.status === "fulfilled") {
    adminResult.value.forEach((item) => {
      const nextEmail = toLower(item.data()?.email);
      if (nextEmail) adminEmails.add(nextEmail);
    });
  }

  const allSubmissions =
    submissionsResult.status === "fulfilled"
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

export default function DpotdDashboardPanel() {
  const { authReady, hasDpotdAccess, profile, user } = useDpotdAuth();
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");

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
            "Unable to load the D.PotD dashboard right now. If this continues, contact dtechmathclub@gmail.com.",
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

  if (!authReady) {
    return (
      <SurfaceCard className="p-8 text-center">
        <p className="text-lg font-semibold text-txt-muted">Checking your D.PotD access...</p>
      </SurfaceCard>
    );
  }

  if (!user) {
    return (
      <SurfaceCard className="p-8">
        <SectionHeader
          title="Sign Into Your Website Account First"
          description="D.PotD uses the same Design Tech Math Club account as the rest of the site. Sign in above, then this dashboard will load here inside your profile."
        />
      </SurfaceCard>
    );
  }

  if (!hasDpotdAccess) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <SurfaceCard className="p-8">
          <SectionHeader
            title="Complete D.PotD Registration First"
            description="This account is active, but D.PotD portal access only appears after the D.PotD registration form is submitted from this same signed-in account."
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light"
              to="/dpotd/register"
            >
              Register for D.PotD
            </Link>
            <Link
              className="inline-flex rounded-full border border-brand px-6 py-3 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
              to="/dpotd/about"
            >
              Review Challenge Details
            </Link>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-8">
          <SectionHeader
            title="What Gets Connected"
            description="Submitting the form provisions D.PotD access for this account and keeps the testing portal tied to the same profile."
          />
          <div className="mt-4 grid gap-4">
            {[
              "Leaderboard history stays attached to this website account.",
              "Submission records stay attached to this website account.",
              "Tab switches, fullscreen exits, and attempted closes may be recorded during active tests.",
              "If the AI helper or scores look wrong, contact dtechmathclub@gmail.com.",
            ].map((item) => (
              <div key={item} className="border-t border-border-subtle pt-4 text-sm leading-relaxed text-txt-muted">
                {item}
              </div>
            ))}
          </div>
        </SurfaceCard>
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Overall Score" value={String(dashboard.totalScore)} />
        <StatCard label="Tests Completed" value={String(dashboard.testsCompleted)} />
        <StatCard label="Best Score" value={`${dashboard.bestScore}/20`} />
        <StatCard label="Overall Rank" value={dashboard.rank ? `#${dashboard.rank}` : "Unranked"} />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.14fr_0.86fr]">
        <div className="grid gap-8">
          <SurfaceCard className="p-8">
            <SectionHeader
              title="Challenge Status"
              description="This dashboard is attached to your website profile. During an active test, integrity signals such as tab switches, visibility changes, fullscreen exits, and attempted closes may be recorded for review."
            />
            {dashboardLoading ? (
              <p className="text-sm font-semibold text-txt-muted">Loading live D.PotD data...</p>
            ) : dashboardError ? (
              <p className="text-sm font-semibold text-red-500">{dashboardError}</p>
            ) : (
              <div className="grid gap-4">
                <StatusRow label="Current Day">
                  {dashboard.currentDay ? `Day ${dashboard.currentDay}` : "No active scheduled day"}
                </StatusRow>
                <StatusRow label="Time Limit">{dashboard.durationMinutes} minutes</StatusRow>
                <StatusRow label="Today's Submission">
                  {dashboard.submittedToday
                    ? "Already submitted"
                    : dashboard.activeTest
                      ? `Resume available with ${formatTimeRemaining(dashboard.activeTest)} remaining`
                      : dashboard.currentDay
                        ? "Available in the testing portal"
                        : "No live test right now"}
                </StatusRow>
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
              title="Top 5 Standings"
              description="Leaderboard scores are typically updated before the end of the next day after grading is processed."
            />
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-border-subtle text-left text-brand">
                    <th className="px-1 py-3 font-extrabold">Rank</th>
                    <th className="px-1 py-3 font-extrabold">Name</th>
                    <th className="px-1 py-3 font-extrabold">Score</th>
                    <th className="px-1 py-3 font-extrabold">Tests</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.leaderboard.length ? (
                    dashboard.leaderboard.map((entry, index) => (
                      <tr key={`${entry.email}-${index}`} className="border-b border-border-subtle/70 last:border-b-0">
                        <td className="px-1 py-3 font-bold text-txt">#{index + 1}</td>
                        <td className="px-1 py-3 text-txt">{entry.name}</td>
                        <td className="px-1 py-3 text-txt-muted">{entry.totalScore}</td>
                        <td className="px-1 py-3 text-txt-muted">{entry.completedDays}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-1 py-4 text-txt-muted" colSpan="4">
                        No submissions yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-txt-muted">
              If you do not see your score after the next-day update window, contact
              {" "}
              dtechmathclub@gmail.com.
            </p>
          </SurfaceCard>

          <SurfaceCard className="p-8">
            <SectionHeader
              title="Your Score History"
              description="Proof scores and AI-related results may take time to settle. Check back before the end of the next day, then contact dtechmathclub@gmail.com if something still looks wrong."
            />
            <div className="mt-4 grid gap-4">
              {dashboard.history.length ? (
                dashboard.history.slice(0, 5).map((submission) => {
                  const totalScore =
                    (submission.q1Correct ? 4 : 0) +
                    (submission.q2Correct ? 6 : 0) +
                    Number(submission.q3Score || 0);

                  return (
                    <div key={submission.id} className="border-t border-border-subtle pt-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-lg font-black text-txt">Day {submission.day}</p>
                          <p className="text-sm text-txt-muted">{formatDateTime(submission.timestamp)}</p>
                        </div>
                        <span className="rounded-full bg-brand px-4 py-2 text-sm font-black text-white">
                          {totalScore}/20
                        </span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-3 text-sm text-txt-muted">
                        <span>Q1: {submission.q1Correct ? "Correct" : "Incorrect"}</span>
                        <span>Q2: {submission.q2Correct ? "Correct" : "Incorrect"}</span>
                        <span>Q3: {submission.q3Score ?? "Pending"}</span>
                        <span>Time: {formatMinutes(submission.totalTime)}</span>
                      </div>
                    </div>
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
              title="Terms and Support"
              description="These reminders stay visible in the profile dashboard so students do not need to hunt through separate portal pages."
            />
            <div className="mt-4 grid gap-4">
              <StatusRow label="Integrity Review">
                Tab switches, leaving the page, fullscreen exits, and attempted closes may be recorded during an active test.
              </StatusRow>
              <StatusRow label="Leaderboard Updates">
                Leaderboards are generally updated before the end of the next day after grading is processed.
              </StatusRow>
              <StatusRow label="Need Help?">
                If the AI helper does not work, your score is missing, or anything seems incorrect, contact dtechmathclub@gmail.com.
              </StatusRow>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-8">
            <SectionHeader
              title="Account Link"
              description="Your D.PotD status is attached to the same website profile you use everywhere else."
            />
            <div className="mt-4 grid gap-4">
              <StatusRow label="Signed-In Account">{profile?.email || user.email}</StatusRow>
              <StatusRow label="Portal Access">Active</StatusRow>
              <StatusRow label="Profile Link">
                Submissions, leaderboard history, and testing access all follow this account.
              </StatusRow>
            </div>
          </SurfaceCard>
        </div>
      </div>
    </div>
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

function StatusRow({ label, children }) {
  return (
    <div className="border-t border-border-subtle pt-4">
      <p className="text-sm font-bold text-txt">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-txt-muted">{children}</p>
    </div>
  );
}
