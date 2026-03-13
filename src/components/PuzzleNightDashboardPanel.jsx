import { useEffect, useMemo, useState } from "react";
import SectionHeader from "./SectionHeader";
import SurfaceCard from "./SurfaceCard";
import { useDpotdAuth } from "../context/DpotdAuthContext";

const initialCoachForm = {
  coachAttending: "yes",
  name: "",
  notes: "",
  schoolId: "",
  schoolName: "",
};

const initialStudentForm = {
  grade: "",
  name: "",
  notes: "",
  parentEmail: "",
  parentName: "",
  schoolId: "",
  schoolName: "",
};

export default function PuzzleNightDashboardPanel() {
  const {
    listPuzzleNightSchools,
    loadPuzzleNightRoster,
    profile,
    puzzleNightRegistration,
    registerPuzzleNight,
    user,
  } = useDpotdAuth();
  const [coachForm, setCoachForm] = useState(initialCoachForm);
  const [studentForm, setStudentForm] = useState(initialStudentForm);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [roster, setRoster] = useState([]);
  const [rosterLoading, setRosterLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const isCoachAccount = profile?.accountType === "coach";

  useEffect(() => {
    setCoachForm({
      coachAttending:
        puzzleNightRegistration?.registrationType === "coach" && puzzleNightRegistration?.coachAttending === false
          ? "no"
          : "yes",
      name: puzzleNightRegistration?.name || profile?.name || "",
      notes: puzzleNightRegistration?.notes || "",
      schoolId: user?.uid || "",
      schoolName:
        puzzleNightRegistration?.schoolName || puzzleNightRegistration?.school || profile?.school || "",
    });
  }, [profile, puzzleNightRegistration, user]);

  useEffect(() => {
    setStudentForm({
      grade: puzzleNightRegistration?.grade || profile?.grade || "",
      name: puzzleNightRegistration?.name || profile?.name || "",
      notes: puzzleNightRegistration?.notes || "",
      parentEmail: puzzleNightRegistration?.parentEmail || "",
      parentName: puzzleNightRegistration?.parentName || "",
      schoolId:
        puzzleNightRegistration?.registrationType === "student"
          ? puzzleNightRegistration?.schoolId || ""
          : "",
      schoolName:
        puzzleNightRegistration?.registrationType === "student"
          ? puzzleNightRegistration?.schoolName || puzzleNightRegistration?.school || ""
          : "",
    });
  }, [profile, puzzleNightRegistration]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const schools = await listPuzzleNightSchools();
      if (!cancelled) {
        setSchoolOptions(schools);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [listPuzzleNightSchools, puzzleNightRegistration]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!isCoachAccount) {
        setRoster([]);
        setRosterLoading(false);
        return;
      }

      setRosterLoading(true);
      const nextRoster = await loadPuzzleNightRoster(user?.uid);
      if (!cancelled) {
        setRoster(nextRoster);
        setRosterLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [isCoachAccount, loadPuzzleNightRoster, puzzleNightRegistration, user]);

  const selectedSchoolLabel = useMemo(() => {
    if (!studentForm.schoolId) return "";
    return schoolOptions.find((option) => option.id === studentForm.schoolId)?.schoolName || "";
  }, [schoolOptions, studentForm.schoolId]);

  function handleCoachChange(event) {
    const { name, value } = event.target;
    setCoachForm((current) => ({ ...current, [name]: value }));
    setMessage("");
  }

  function handleStudentChange(event) {
    const { name, value } = event.target;
    setStudentForm((current) => {
      if (name === "schoolId") {
        const schoolName = schoolOptions.find((item) => item.id === value)?.schoolName || "";
        return { ...current, schoolId: value, schoolName };
      }

      return { ...current, [name]: value };
    });
    setMessage("");
  }

  async function handleCoachSubmit(event) {
    event.preventDefault();
    setBusy(true);
    const result = await registerPuzzleNight({
      ...coachForm,
      registrationType: "coach",
    });
    setBusy(false);
    setMessage(result.ok ? "Puzzle Night coach RSVP saved." : result.error);
  }

  async function handleStudentSubmit(event) {
    event.preventDefault();
    setBusy(true);
    const result = await registerPuzzleNight({
      ...studentForm,
      registrationType: "student",
      schoolName: studentForm.schoolName || selectedSchoolLabel,
    });
    setBusy(false);
    setMessage(result.ok ? "Puzzle Night registration saved." : result.error);
  }

  return isCoachAccount ? (
    <div className="grid gap-8 lg:grid-cols-[0.98fr_1.02fr]">
      <SurfaceCard className="p-8">
        <SectionHeader
          title="Coach Puzzle Night RSVP"
          description="Coach accounts only see the coach RSVP form here. Register your school, say whether you are attending, and students who choose your school will appear in the roster."
        />
        <form className="mt-8 grid gap-5" onSubmit={handleCoachSubmit} noValidate>
          <ReadonlyField label="Signed-In Email" value={profile?.email || user?.email || ""} />
          <Field label="Coach Name" name="name" onChange={handleCoachChange} required value={coachForm.name} />
          <Field
            label="School"
            name="schoolName"
            onChange={handleCoachChange}
            required
            value={coachForm.schoolName}
          />
          <label className="grid gap-2">
            <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
              Are you attending?
            </span>
            <select
              className="w-full rounded-2xl border border-[rgba(234,109,74,0.14)] bg-[#fffaf6] px-4 py-3 text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
              name="coachAttending"
              onChange={handleCoachChange}
              value={coachForm.coachAttending}
            >
              <option value="yes">Yes, I am coming</option>
              <option value="no">No, I am not coming</option>
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">Notes</span>
            <textarea
              className="min-h-[140px] rounded-2xl border border-[rgba(234,109,74,0.14)] bg-[#fffaf6] px-4 py-3 text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
              name="notes"
              onChange={handleCoachChange}
              placeholder="Share anything helpful about your school group or coach attendance."
              value={coachForm.notes}
            />
          </label>
          <MessageCopy message={message} successCopy="Puzzle Night coach RSVP saved." />
          <button
            className="inline-flex w-fit rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
            disabled={busy}
            type="submit"
          >
            {busy ? "Saving..." : puzzleNightRegistration ? "Update Coach RSVP" : "Save Coach RSVP"}
          </button>
        </form>
      </SurfaceCard>

      <SurfaceCard className="p-8">
        <SectionHeader
          title="Student Roster"
          description="Students who selected your school on the Puzzle Night student form appear here so you can track who is attending."
        />
        {rosterLoading ? (
          <p className="mt-6 text-sm leading-relaxed text-txt-muted">Loading student registrations...</p>
        ) : !roster.length ? (
          <p className="mt-6 text-sm leading-relaxed text-txt-muted">
            No students from your school have submitted Puzzle Night registrations yet.
          </p>
        ) : (
          <div className="mt-6 grid gap-4">
            {roster.map((student) => (
              <div key={student.id} className="rounded-[24px] border border-border-subtle bg-white/70 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-lg font-black text-txt">{student.name}</p>
                    <p className="text-sm text-txt-muted">Grade {student.grade}</p>
                  </div>
                  <div className="text-sm text-txt-muted">
                    <p>{student.parentName}</p>
                    <p>{student.parentEmail}</p>
                  </div>
                </div>
                {student.notes ? (
                  <p className="mt-3 text-sm leading-relaxed text-txt-muted">{student.notes}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </SurfaceCard>
    </div>
  ) : (
    <div className="grid gap-8 lg:grid-cols-[1fr_0.92fr]">
      <SurfaceCard className="p-8">
        <SectionHeader
          title="Puzzle Night Student Form"
          description="Student accounts can sign up here after signing in. Picking your school is optional, but doing so lets your coach see that you are attending."
        />
        <form className="mt-8 grid gap-5" onSubmit={handleStudentSubmit} noValidate>
          <ReadonlyField label="Signed-In Email" value={profile?.email || user?.email || ""} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Student Name" name="name" onChange={handleStudentChange} required value={studentForm.name} />
            <Field label="Grade" name="grade" onChange={handleStudentChange} required value={studentForm.grade} />
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
          <label className="grid gap-2">
            <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
              School
            </span>
            <select
              className="w-full rounded-2xl border border-[rgba(234,109,74,0.14)] bg-[#fffaf6] px-4 py-3 text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
              name="schoolId"
              onChange={handleStudentChange}
              value={studentForm.schoolId}
            >
              <option value="">No school selected</option>
              {schoolOptions.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.schoolName}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">Notes</span>
            <textarea
              className="min-h-[140px] rounded-2xl border border-[rgba(234,109,74,0.14)] bg-[#fffaf6] px-4 py-3 text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
              name="notes"
              onChange={handleStudentChange}
              placeholder="Accessibility notes, dietary concerns, or anything helpful for the event."
              value={studentForm.notes}
            />
          </label>
          <MessageCopy message={message} successCopy="Puzzle Night registration saved." />
          <button
            className="inline-flex w-fit rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
            disabled={busy}
            type="submit"
          >
            {busy ? "Saving..." : puzzleNightRegistration ? "Update Puzzle Night Signup" : "Save Puzzle Night Signup"}
          </button>
        </form>
      </SurfaceCard>

      <SurfaceCard className="p-8">
        <SectionHeader
          title="Your Status"
          description="This account holds your Puzzle Night signup. If you choose a school, the matching coach can see that you are attending."
        />
        <div className="mt-4 grid gap-4">
          <StatusLine label="Registration">
            {puzzleNightRegistration ? "Submitted" : "Not submitted yet"}
          </StatusLine>
          <StatusLine label="Selected School">
            {puzzleNightRegistration?.schoolName || selectedSchoolLabel || "No school selected"}
          </StatusLine>
          <StatusLine label="Parent Contact">
            {puzzleNightRegistration?.parentEmail || "Not submitted yet"}
          </StatusLine>
          <StatusLine label="Notes">
            {puzzleNightRegistration?.notes || "No notes added"}
          </StatusLine>
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

function ReadonlyField({ label, value }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">{label}</span>
      <div className="rounded-2xl border border-border-subtle bg-white/70 px-4 py-3 text-sm text-txt-muted">
        {value || "Not available"}
      </div>
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
    <p className={`text-sm font-semibold ${message === successCopy ? "text-emerald-600" : "text-red-500"}`}>
      {message}
    </p>
  );
}
