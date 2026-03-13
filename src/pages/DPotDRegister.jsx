import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FlowSection from "../components/FlowSection";
import PageHero from "../components/PageHero";
import ProfileAuthPanel from "../components/ProfileAuthPanel";
import SectionHeader from "../components/SectionHeader";
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
  const navigate = useNavigate();
  const { authReady, hasDpotdAccess, profile, submitDpotdRegistration, user } = useDpotdAuth();
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      setForm(initialForm);
      return;
    }

    setForm((current) => ({
      ...current,
      grade: profile?.grade || "",
      name: profile?.name || user.email || "",
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
    if (!result.ok) {
      setMessage(result.error);
      return;
    }

    navigate("/profile?view=dpotd");
  }

  return (
    <>
      <PageHero
        actions={
          authReady && user && hasDpotdAccess
            ? [
                { label: "Open D.PotD Dashboard", to: "/profile?view=dpotd" },
                { label: "Open Profile", to: "/profile", variant: "ghost" },
              ]
            : [
                { label: "Open Profile", to: "/profile" },
                { label: "D.PotD Overview", to: "/dpotd/about", variant: "ghost" },
              ]
        }
        aside={
          !authReady ? (
            <div className="p-8 text-center">
              <p className="text-sm font-semibold text-txt-muted">Checking your account...</p>
            </div>
          ) : user ? (
            <RegistrationStatusCard
              email={profile?.email || user.email || ""}
              hasDpotdAccess={hasDpotdAccess}
              name={profile?.name || user.email || "Student"}
            />
          ) : (
            <ProfileAuthPanel
              defaultMode="register"
              embedded
              redirectTo="/dpotd/register"
              signedInCopy="You are signed in. Complete the D.PotD registration form below to unlock the D.PotD dashboard for this account."
            />
          )
        }
        description="D.PotD registration is attached to the website account that is currently signed in. Submitting the form below provisions D.PotD access for that account, and the dashboard then becomes visible inside the profile page."
        highlights={[
          "One D.Tech Math Club account",
          "D.PotD registration attached to that account",
          "Portal access created after form submission",
        ]}
        title="D.PotD Registration"
      />

      <FlowSection glow="muted">
        <section className="py-16">
          <div className="mx-auto w-[min(calc(100%-2rem),1120px)]">
            {!authReady ? (
              <SurfaceCard className="p-8 text-center">
                <p className="text-sm font-semibold text-txt-muted">Checking registration status...</p>
              </SurfaceCard>
            ) : !user ? (
              <SurfaceCard className="p-8">
                <SectionHeader
                  align="center"
                  title="Create or Sign Into Your Student Account First"
                  description="Use the account panel above first. Once you are signed in, this page will switch to the D.PotD registration form for that same account."
                />
              </SurfaceCard>
            ) : hasDpotdAccess ? (
              <SurfaceCard className="p-8">
                <SectionHeader
                  title="This Account Is Already Registered for D.PotD"
                  description="Your D.PotD portal profile has already been provisioned from this student account. The testing portal, submissions, and leaderboard all continue to use the same signed-in account."
                />
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light"
                    to="/profile?view=dpotd"
                  >
                    Open D.PotD Dashboard
                  </Link>
                  <Link
                    className="inline-flex rounded-full border border-brand px-6 py-3 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
                    to="/profile"
                  >
                    Open Profile
                  </Link>
                </div>
              </SurfaceCard>
            ) : (
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
                <SurfaceCard className="p-8">
                  <SectionHeader
                    title="Complete the D.PotD Form"
                    description="Submitting this form attaches D.PotD registration to your signed-in website account and automatically creates the portal profile used for testing, submissions, leaderboard history, and the D.PotD dashboard inside your profile."
                  />
                  <form className="mt-8 grid gap-5" onSubmit={handleSubmit} noValidate>
                    <ReadonlyField label="Signed-In Email" value={profile?.email || user.email || ""} />
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Full Name" name="name" onChange={handleChange} value={form.name} />
                      <Field label="School" name="school" onChange={handleChange} value={form.school} />
                    </div>
                    <Field label="Grade" name="grade" onChange={handleChange} value={form.grade} />

                    <label className="flex items-start gap-3 border-t border-border-subtle pt-4 text-sm leading-relaxed text-txt-muted">
                      <input
                        checked={form.termsAccepted}
                        className="mt-1 h-4 w-4 rounded border-border-accent accent-brand"
                        name="termsAccepted"
                        onChange={handleChange}
                        type="checkbox"
                      />
                      <span>
                        I understand that this D.PotD registration is being attached to my signed-in
                        Design Tech Math Club account and that the same account will be used for the
                        dashboard, testing access, submissions, and leaderboard records.
                      </span>
                    </label>

                    <label className="flex items-start gap-3 border-t border-border-subtle pt-4 text-sm leading-relaxed text-txt-muted">
                      <input
                        checked={form.integrityAccepted}
                        className="mt-1 h-4 w-4 rounded border-border-accent accent-brand"
                        name="integrityAccepted"
                        onChange={handleChange}
                        type="checkbox"
                      />
                      <span>
                        I understand that during an active D.PotD test, integrity signals such as
                        tab switches, visibility changes, fullscreen exits, and attempted closes may
                        be recorded for review.
                      </span>
                    </label>

                    {message ? (
                      <p className={`text-sm font-semibold ${message.includes("Unable") || message.includes("Fill") || message.includes("Confirm") ? "text-red-500" : "text-emerald-600"}`}>
                        {message}
                      </p>
                    ) : null}

                    <div className="flex flex-wrap gap-3">
                      <button
                        className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={busy}
                        type="submit"
                      >
                        {busy ? "Activating D.PotD Access..." : "Submit D.PotD Registration"}
                      </button>
                      <Link
                        className="inline-flex rounded-full border border-brand px-6 py-3 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
                        to="/profile"
                      >
                        Back to Profile
                      </Link>
                    </div>
                  </form>
                </SurfaceCard>

                <SurfaceCard className="p-8">
                  <SectionHeader
                    title="What Happens After You Submit"
                    description="The system provisions D.PotD access only after this form is submitted from a signed-in account."
                  />
                  <div className="mt-6 grid gap-4">
                    {[
                      "Your signed-in Design Tech Math Club account stays the main identity.",
                      "A D.PotD registration record is attached to that account.",
                      "Your D.PotD portal profile is created automatically after submission.",
                      "Testing access, submissions, and leaderboard tracking stay tied to that same account.",
                      "If registration looks incorrect, contact dtechmathclub@gmail.com.",
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

function RegistrationStatusCard({ email, hasDpotdAccess, name }) {
  return (
    <div className="p-1 text-left">
      <h2 className="text-3xl font-black text-txt">{name}</h2>
      <p className="mt-2 text-sm text-txt-muted">{email}</p>
      <div className="mt-5 border-t border-border-subtle pt-4 text-sm leading-relaxed text-txt-muted">
        D.PotD status: {hasDpotdAccess ? "registered and portal-ready" : "account active, registration not submitted yet"}
      </div>
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

function ReadonlyField({ label, value }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">{label}</span>
      <div className="border-t border-border-subtle pt-3 text-sm text-txt-muted">{value}</div>
    </label>
  );
}
