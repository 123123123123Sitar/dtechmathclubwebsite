import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import FlowSection from "../components/FlowSection";
import HeroMediaPanel from "../components/HeroMediaPanel";
import PageHero from "../components/PageHero";
import SectionHeader from "../components/SectionHeader";
import SurfaceCard from "../components/SurfaceCard";
import { useDpotdAuth } from "../context/DpotdAuthContext";
import { db } from "../lib/dpotdFirebase";

const initialDashboard = {
  coachAccounts: [],
  contactSubmissions: [],
  dpotdRegistrations: [],
  dtmtRegistrations: [],
  puzzleNightRegistrations: [],
  sponsorInquiries: [],
};

function readDate(value) {
  if (!value) return null;
  if (typeof value.toDate === "function") return value.toDate();
  const next = new Date(value);
  return Number.isNaN(next.getTime()) ? null : next;
}

function formatDateTime(value) {
  const next = readDate(value);
  return next ? next.toLocaleString() : "Not recorded";
}

function compareByLatest(left, right) {
  const leftTime =
    readDate(left.updatedAt)?.getTime() ||
    readDate(left.submittedAt)?.getTime() ||
    readDate(left.createdAt)?.getTime() ||
    0;
  const rightTime =
    readDate(right.updatedAt)?.getTime() ||
    readDate(right.submittedAt)?.getTime() ||
    readDate(right.createdAt)?.getTime() ||
    0;

  return rightTime - leftTime;
}

async function loadAdminDashboard() {
  const [
    coachAccountsSnapshot,
    puzzleNightSnapshot,
    dtmtSnapshot,
    dpotdSnapshot,
    contactSnapshot,
    sponsorSnapshot,
  ] = await Promise.all([
    getDocs(collection(db, "coachAccounts")),
    getDocs(collection(db, "puzzleNightRegistrations")),
    getDocs(collection(db, "dtmtStudentRegistrations")),
    getDocs(collection(db, "dpotdRegistrations")),
    getDocs(collection(db, "contactSubmissions")),
    getDocs(collection(db, "sponsorshipInquiries")),
  ]);

  return {
    coachAccounts: coachAccountsSnapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .sort(compareByLatest),
    contactSubmissions: contactSnapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .sort(compareByLatest),
    dpotdRegistrations: dpotdSnapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .sort(compareByLatest),
    dtmtRegistrations: dtmtSnapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .sort(compareByLatest),
    puzzleNightRegistrations: puzzleNightSnapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .sort(compareByLatest),
    sponsorInquiries: sponsorSnapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .sort(compareByLatest),
  };
}

export default function SiteAdminPortal() {
  const { authReady, profile, signInSiteAccount, signOutAccount, user } = useDpotdAuth();
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [dashboardError, setDashboardError] = useState("");
  const [dashboardLoading, setDashboardLoading] = useState(false);

  const isAuthorizedAdmin = Boolean(user) && Boolean(profile?.isAdmin);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!authReady || !isAuthorizedAdmin) {
        setDashboard(initialDashboard);
        setDashboardError("");
        setDashboardLoading(false);
        return;
      }

      setDashboardLoading(true);
      setDashboardError("");

      try {
        const nextDashboard = await loadAdminDashboard();
        if (!cancelled) {
          setDashboard(nextDashboard);
        }
      } catch (_) {
        if (!cancelled) {
          setDashboardError(
            "Unable to load the admin dashboard data right now. Confirm this account has the admin role in Firestore.",
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
  }, [authReady, isAuthorizedAdmin]);

  async function handleAdminLogin(event) {
    event.preventDefault();
    setLoginMessage("");

    if (!loginPassword) {
      setLoginMessage("Enter the admin account password.");
      return;
    }

    const result = await signInSiteAccount(loginEmail.trim(), loginPassword);
    if (!result.ok) {
      setLoginMessage(result.error);
      return;
    }

    setLoginPassword("");
  }

  async function handleSignOut() {
    await signOutAccount();
    setLoginMessage("");
  }

  const statCards = [
    ["Coach Accounts", dashboard.coachAccounts.length],
    ["Puzzle Night", dashboard.puzzleNightRegistrations.length],
    ["DTMT", dashboard.dtmtRegistrations.length],
    ["D.PotD", dashboard.dpotdRegistrations.length],
    ["Contact Us", dashboard.contactSubmissions.length],
    ["Sponsors", dashboard.sponsorInquiries.length],
  ];

  return (
    <>
      <PageHero
        aside={
          <HeroMediaPanel
            alt="Design Tech Math Club banner"
            badge="Site Admin"
            caption="A hidden admin route for reviewing site registrations and incoming messages."
            imageClassName="object-contain p-8 md:p-10"
            src="/assets/logos/dtechmathclublogolarger.jpg"
          />
        }
        description="Sign in with an authorized admin account to review registrations and messages."
        highlights={["Protected Admin Data", "Admin Account Sign-In"]}
        title="Site Admin Portal"
      />

      <FlowSection glow="muted">
        <section className="py-16">
          <div className="mx-auto grid w-[min(calc(100%-2rem),1180px)] gap-8">
            {!authReady ? (
              <SurfaceCard className="p-8">
                <p className="text-sm font-semibold text-txt-muted">Checking the current sign-in state...</p>
              </SurfaceCard>
            ) : !user ? (
              <SurfaceCard className="p-8">
                <SectionHeader
                  title="Admin Login"
                  description="Sign in with an account authorized as an admin in Firestore."
                />
                <form className="mt-6 grid gap-4" onSubmit={handleAdminLogin}>
                  <label className="grid gap-2">
                    <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">Admin Email</span>
                    <input className="rounded-2xl border border-[rgba(234,109,74,0.14)] bg-[#fffaf6] px-4 py-3 text-sm text-txt" type="email" value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} required />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
                      Account Password
                    </span>
                    <input
                      className="rounded-2xl border border-[rgba(234,109,74,0.14)] bg-[#fffaf6] px-4 py-3 text-sm text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
                      onChange={(event) => setLoginPassword(event.target.value)}
                      placeholder="Enter the Firebase account password"
                      type="password"
                      value={loginPassword}
                    />
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <button
                      className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light"
                      type="submit"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
                <InlineMessage message={loginMessage} />
              </SurfaceCard>
            ) : !profile?.isAdmin ? (
              <SurfaceCard className="p-8">
                <SectionHeader title="Admin Access Required" description="This account has not been granted the admin role." />
                <p className="mt-4 text-sm text-txt-muted">Signed in as {user.email || "unknown email"}.</p>
                <button className="mt-6 rounded-full bg-brand px-6 py-3 font-bold text-white" onClick={handleSignOut} type="button">Sign Out</button>
              </SurfaceCard>
            ) : (
              <>
                <SurfaceCard className="p-8">
                  <SectionHeader
                    title="Admin Session"
                    description="This dashboard is unlocked for your admin account."
                  />
                  <div className="mt-6 flex flex-wrap gap-3">
                    <ReadonlyField label="Admin Email" value={user.email || ""} />
                    <button
                      className="inline-flex rounded-full border border-brand px-6 py-3 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
                      onClick={handleSignOut}
                      type="button"
                    >
                      Sign Out
                    </button>
                  </div>
                </SurfaceCard>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {statCards.map(([label, value]) => (
                    <SurfaceCard key={label} className="p-6">
                      <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand">{label}</p>
                      <p className="mt-3 text-3xl font-black text-txt">{value}</p>
                    </SurfaceCard>
                  ))}
                </div>

                {dashboardLoading ? (
                  <SurfaceCard className="p-8">
                    <p className="text-sm font-semibold text-txt-muted">Loading protected admin data...</p>
                  </SurfaceCard>
                ) : dashboardError ? (
                  <SurfaceCard className="p-8">
                    <p className="text-sm font-semibold text-red-500">{dashboardError}</p>
                  </SurfaceCard>
                ) : (
                  <div className="grid gap-8">
                    <DataTableCard
                      columns={["Coach", "Email", "School", "Status", "Updated"]}
                      rows={dashboard.coachAccounts.map((item) => [
                        item.name || "No name",
                        item.email || "No email",
                        item.school || "No school",
                        item.status || "Unknown",
                        formatDateTime(item.updatedAt || item.createdAt),
                      ])}
                      description="Coach account records from Firestore."
                      title="Coach Accounts"
                    />

                    <DataTableCard
                      columns={["Student", "Email", "Grade", "School", "Teacher Email", "Parent Email", "Updated"]}
                      rows={dashboard.puzzleNightRegistrations.map((item) => [
                        item.name || "No name",
                        item.email || "No email",
                        item.grade || "No grade",
                        item.schoolName || "No school",
                        item.teacherEmail || "No teacher email",
                        item.parentEmail || "No parent email",
                        formatDateTime(item.updatedAt || item.submittedAt),
                      ])}
                      description="Student Puzzle Night registrations."
                      title="Puzzle Night Signups"
                    />

                    <DataTableCard
                      columns={["Student", "Email", "School", "Grade", "Lunch", "Payment", "Team", "Updated"]}
                      rows={dashboard.dtmtRegistrations.map((item) => [
                        item.name || "No name",
                        item.email || "No email",
                        item.schoolName || "Independent Entry",
                        item.grade || "No grade",
                        item.lunchPreference || "No lunch choice",
                        item.paymentStatus || "No payment status",
                        item.teamLabel || "Unassigned",
                        formatDateTime(item.updatedAt || item.createdAt),
                      ])}
                      description="DTMT student registration records."
                      title="DTMT Signups"
                    />

                    <DataTableCard
                      columns={["Student", "Email", "School", "Grade", "Status", "Submitted"]}
                      rows={dashboard.dpotdRegistrations.map((item) => [
                        item.name || "No name",
                        item.email || "No email",
                        item.school || "No school",
                        item.grade || "No grade",
                        item.status || "Unknown",
                        formatDateTime(item.submittedAt || item.updatedAt),
                      ])}
                      description="D.PotD registration records."
                      title="D.PotD Signups"
                    />

                    <DataTableCard
                      columns={["Name", "Email", "Organization", "Subject", "Submitted"]}
                      rows={dashboard.contactSubmissions.map((item) => [
                        [item.firstName, item.lastName].filter(Boolean).join(" ") || "No name",
                        item.email || "No email",
                        item.organization || "No organization",
                        item.subject || "No subject",
                        formatDateTime(item.submittedAt),
                      ])}
                      description="Messages from the public contact form."
                      title="Contact Us Emails"
                    />

                    <DataTableCard
                      columns={["Name", "Email", "Company", "Submitted"]}
                      rows={dashboard.sponsorInquiries.map((item) => [
                        [item.firstName, item.lastName].filter(Boolean).join(" ") || "No name",
                        item.email || "No email",
                        item.company || "No company",
                        formatDateTime(item.submittedAt),
                      ])}
                      description="Messages from the sponsorship form."
                      title="Sponsor Inquiries"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </FlowSection>
    </>
  );
}

function ReadonlyField({ label, value }) {
  return (
    <div className="grid gap-2">
      <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">{label}</span>
      <div className="rounded-2xl border border-border-subtle bg-white/70 px-4 py-3 text-sm text-txt-muted">
        {value || "Not available"}
      </div>
    </div>
  );
}

function InlineMessage({ message }) {
  if (!message) return null;

  return <p className="mt-4 text-sm font-semibold text-red-500">{message}</p>;
}

function DataTableCard({ columns, rows, title, description }) {
  return (
    <SurfaceCard className="p-8">
      <SectionHeader title={title} description={description} />
      {!rows.length ? (
        <p className="mt-6 text-sm leading-relaxed text-txt-muted">No records are available yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-[24px] border border-border-subtle bg-white/70">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-[#fff4eb] text-txt">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="px-4 py-3 font-black uppercase tracking-[0.14em] text-brand">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={`${title}-${index}`} className="border-t border-border-subtle align-top">
                  {row.map((value, cellIndex) => (
                    <td key={`${title}-${index}-${cellIndex}`} className="px-4 py-3 text-txt-muted">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SurfaceCard>
  );
}
