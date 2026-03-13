import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FlowSection from "../components/FlowSection";
import PageHero from "../components/PageHero";
import ProfileAuthPanel from "../components/ProfileAuthPanel";
import SectionHeader from "../components/SectionHeader";
import SurfaceCard from "../components/SurfaceCard";
import { useDpotdAuth } from "../context/DpotdAuthContext";

const initialForm = {
  email: "",
  grade: "",
  name: "",
  notes: "",
  parentEmail: "",
  parentName: "",
  school: "",
};

export default function PuzzleNightRegister() {
  const { authReady, profile, puzzleNightRegistration, registerPuzzleNight, user } = useDpotdAuth();
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) {
      setForm((current) => ({
        ...current,
        email: current.email || "",
        grade: current.grade || "",
        name: current.name || "",
        school: current.school || "",
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      email: profile?.email || user.email || "",
      grade: puzzleNightRegistration?.grade || profile?.grade || "",
      name: puzzleNightRegistration?.name || profile?.name || user.email || "",
      notes: puzzleNightRegistration?.notes || "",
      parentEmail: puzzleNightRegistration?.parentEmail || "",
      parentName: puzzleNightRegistration?.parentName || "",
      school: puzzleNightRegistration?.school || profile?.school || "",
    }));
  }, [profile, puzzleNightRegistration, user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setMessage("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setBusy(true);
    const result = await registerPuzzleNight(form);
    setBusy(false);
    setMessage(
      result.ok
        ? user
          ? "Puzzle Night registration saved and linked to this account."
          : "Puzzle Night registration submitted."
        : result.error,
    );
  }

  return (
    <>
      <PageHero
        actions={
          user
            ? [
                { label: "Open Profile", to: "/profile?view=overview" },
                { label: "Puzzle Night Page", to: "/puzzle-night", variant: "ghost" },
              ]
            : [
                { label: "Create Account", to: "/profile" },
                { label: "Puzzle Night Page", to: "/puzzle-night", variant: "ghost" },
              ]
        }
        aside={
          authReady && user ? (
            <RegistrationStatusCard
              email={profile?.email || user.email || ""}
              hasAccountLink={Boolean(puzzleNightRegistration)}
              name={profile?.name || user.email || "Participant"}
            />
          ) : (
            <ProfileAuthPanel
              defaultMode="signin"
              redirectTo="/puzzle-night/register"
              signedInCopy="Puzzle Night does not require an account, but signing in lets the registration appear inside your website profile."
            />
          )
        }
        description="Puzzle Night is the simplest workflow on the site. Submit the registration form, and you are done. If you are signed in, the same registration can also be linked back to your account dashboard."
        highlights={["Simple Form Flow", "Account Optional", "Profile Link If Signed In"]}
        title="Puzzle Night Registration"
      />

      <FlowSection glow="muted">
        <section className="py-16">
          <div className="mx-auto grid w-[min(calc(100%-2rem),1120px)] gap-8 lg:grid-cols-[1.06fr_0.94fr]">
            <SurfaceCard className="p-8">
              <SectionHeader
                title="Register for Puzzle Night"
                description="This event does not require teams, portals, or role permissions. Fill out the form and submit it."
              />
              <form className="mt-8 grid gap-4" onSubmit={handleSubmit} noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Participant Name" name="name" onChange={handleChange} value={form.name} />
                  <Field label="Participant Email" name="email" onChange={handleChange} type="email" value={form.email} />
                  <Field label="School" name="school" onChange={handleChange} value={form.school} />
                  <Field label="Grade" name="grade" onChange={handleChange} value={form.grade} />
                  <Field label="Parent or Guardian Name" name="parentName" onChange={handleChange} value={form.parentName} />
                  <Field label="Parent or Guardian Email" name="parentEmail" onChange={handleChange} type="email" value={form.parentEmail} />
                </div>
                <label className="grid gap-2">
                  <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">Notes</span>
                  <textarea
                    className="min-h-[140px] w-full rounded-2xl border border-[rgba(234,109,74,0.14)] bg-[#fffaf6] px-4 py-3 text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
                    name="notes"
                    onChange={handleChange}
                    placeholder="Accessibility notes, dietary information, or anything else helpful."
                    value={form.notes}
                  />
                </label>
                {message ? (
                  <p className={`text-sm font-semibold ${message.includes("submitted") || message.includes("saved") ? "text-emerald-600" : "text-red-500"}`}>
                    {message}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-3">
                  <button
                    className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={busy}
                    type="submit"
                  >
                    {busy ? "Submitting..." : puzzleNightRegistration ? "Update Registration" : "Submit Registration"}
                  </button>
                  <Link
                    className="inline-flex rounded-full border border-brand px-6 py-3 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
                    to="/puzzle-night"
                  >
                    Back to Puzzle Night
                  </Link>
                </div>
              </form>
            </SurfaceCard>

            <SurfaceCard className="p-8">
              <SectionHeader
                title="What Happens After Submission"
                description="There is no extra portal for Puzzle Night. Registration is complete as soon as the form is submitted."
              />
              <div className="mt-4 grid gap-4">
                {[
                  "No team assignment workflow is required.",
                  "No additional permissions are required.",
                  user
                    ? "Because you are signed in, this registration can also appear inside your profile dashboard."
                    : "If you create an account later, account-based features for other events can still use the same site profile.",
                  "If anything looks wrong with your registration, contact dtechmathclub@gmail.com.",
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
    </>
  );
}

function RegistrationStatusCard({ email, hasAccountLink, name }) {
  return (
    <SurfaceCard className="p-8">
      <h2 className="text-3xl font-black text-txt">{name}</h2>
      <p className="mt-2 text-sm text-txt-muted">{email}</p>
      <div className="mt-5 border-t border-border-subtle pt-4 text-sm leading-relaxed text-txt-muted">
        Puzzle Night account link: {hasAccountLink ? "saved to this profile" : "not linked yet"}
      </div>
    </SurfaceCard>
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
