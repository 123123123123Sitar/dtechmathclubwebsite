import { useEffect, useState } from "react";
import SectionHeader from "./SectionHeader";
import SurfaceCard from "./SurfaceCard";
import { useDpotdAuth } from "../context/DpotdAuthContext";

const initialStudentForm = {
  grade: "",
  teacherEmail: "",
  name: "",
  notes: "",
  parentEmail: "",
  parentName: "",
  schoolName: "",
};

export default function PuzzleNightDashboardPanel() {
  const { profile, puzzleNightRegistration, registerPuzzleNight } =
    useDpotdAuth();
  const [studentForm, setStudentForm] = useState(initialStudentForm);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const isCoachAccount = profile?.accountType === "coach";
  const hasSubmittedRegistration =
    puzzleNightRegistration?.registrationType === "student";

  useEffect(() => {
    setStudentForm({
      grade: puzzleNightRegistration?.grade || profile?.grade || "",
      teacherEmail: puzzleNightRegistration?.teacherEmail || "",
      name: puzzleNightRegistration?.name || profile?.name || "",
      notes: puzzleNightRegistration?.notes || "",
      parentEmail: puzzleNightRegistration?.parentEmail || "",
      parentName: puzzleNightRegistration?.parentName || "",
      schoolName:
        puzzleNightRegistration?.registrationType === "student"
          ? puzzleNightRegistration?.schoolName ||
            puzzleNightRegistration?.school ||
            ""
          : "",
    });
  }, [profile, puzzleNightRegistration]);

  function handleStudentChange(event) {
    const { name, value } = event.target;
    setStudentForm((current) => ({ ...current, [name]: value }));
    setMessage("");
  }

  async function handleStudentSubmit(event) {
    event.preventDefault();
    setBusy(true);
    const result = await registerPuzzleNight({
      ...studentForm,
      registrationType: "student",
    });
    setBusy(false);
    setMessage(result.ok ? "Puzzle Night registration saved." : result.error);
  }

  if (isCoachAccount) {
    return null;
  }

  return (
    <div className="grid gap-8">
      {!hasSubmittedRegistration ? (
        <SurfaceCard className="p-8">
          <SectionHeader
            title="Puzzle Night Registration Form"
            description="Puzzle Night uses one saved submission per student account. School is optional. After submitting, you cannot edit your registration."
          />
          <form
            className="mt-8 grid gap-5"
            onSubmit={handleStudentSubmit}
            noValidate
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Student Name"
                name="name"
                onChange={handleStudentChange}
                required
                value={studentForm.name}
              />
              <Field
                label="Grade"
                name="grade"
                onChange={handleStudentChange}
                required
                value={studentForm.grade}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Parent or Guardian Name"
                name="parentName"
                onChange={handleStudentChange}
                required
                value={studentForm.parentName}
              />
              <Field
                label="Parent or Guardian Email"
                name="parentEmail"
                onChange={handleStudentChange}
                required
                type="email"
                value={studentForm.parentEmail}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="School "
                name="schoolName"
                required
                onChange={handleStudentChange}
                placeholder="School name"
                value={studentForm.schoolName}
              />
              <Field
                label="Math Teacher/Coach Email"
                name="teacherEmail"
                onChange={handleStudentChange}
                placeholder="Optional"
                type="email"
                value={studentForm.teacherEmail}
              />
            </div>
            <label className="grid gap-2">
              <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
                Notes
              </span>
              <textarea
                className="min-h-[140px] rounded-2xl border border-[rgba(234,109,74,0.14)] bg-[#fffaf6] px-4 py-3 text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
                name="notes"
                onChange={handleStudentChange}
                placeholder="Accessibility notes, dietary concerns, or anything helpful for the event."
                value={studentForm.notes}
              />
            </label>
            <MessageCopy
              message={message}
              successCopy="Puzzle Night registration saved."
            />
            <button
              className="inline-flex w-fit rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busy}
              type="submit"
            >
              {busy ? "Saving..." : "Submit Registration"}
            </button>
          </form>
        </SurfaceCard>
      ) : (
        <SurfaceCard className="p-8">
          <SectionHeader
            title={
              <span className="flex items-center gap-2">
                <span>Registration Completed</span>
                <span className="inline-block text-emerald-600">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="12" fill="#34D399" />
                    <path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </span>
            }
            description="Your Puzzle Night registration is complete! Feel free to contact us if you have any questions or concerns."
          />
          <details className="mt-6 rounded-xl border border-brand/20 bg-white/80 p-4">
            <summary className="cursor-pointer text-lg font-bold text-brand">View Registration Details</summary>
            <div className="mt-4 grid gap-4">
              <StatusLine label="Student Name">
                {puzzleNightRegistration?.name || "Not submitted yet"}
              </StatusLine>
              <StatusLine label="Grade">
                {puzzleNightRegistration?.grade || "Not submitted yet"}
              </StatusLine>
              <StatusLine label="School">
                {puzzleNightRegistration?.schoolName || "Left blank"}
              </StatusLine>
              <StatusLine label="Parent Contact">
                {puzzleNightRegistration?.parentEmail || "Not submitted yet"}
              </StatusLine>
              <StatusLine label="Math Teacher Email">
                {puzzleNightRegistration?.teacherEmail || "Left blank"}
              </StatusLine>
              <StatusLine label="Notes">
                {puzzleNightRegistration?.notes || "No notes added"}
              </StatusLine>
            </div>
          </details>
        </SurfaceCard>
      )}
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
        {label}
      </span>
      <input
        className="w-full rounded-2xl border border-[rgba(234,109,74,0.14)] bg-[#fffaf6] px-4 py-3 text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
        {...props}
      />
    </label>
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

function MessageCopy({ message, successCopy }) {
  if (!message) return null;

  return (
    <p
      className={`text-sm font-semibold ${message === successCopy ? "text-emerald-600" : "text-red-500"}`}
    >
      {message}
    </p>
  );
}
