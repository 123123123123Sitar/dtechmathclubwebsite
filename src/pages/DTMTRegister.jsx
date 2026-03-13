import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FlowSection from "../components/FlowSection";
import HeroMediaPanel from "../components/HeroMediaPanel";
import PageHero from "../components/PageHero";
import ProfileAuthPanel from "../components/ProfileAuthPanel";
import SectionHeader from "../components/SectionHeader";
import SplitPanel from "../components/SplitPanel";
import SurfaceCard from "../components/SurfaceCard";
import { useDpotdAuth } from "../context/DpotdAuthContext";

const studentRoundOptions = [
  "Algebra",
  "Geometry",
  "Discrete Mathematics",
  "6th Grade Division",
];

const initialCoachForm = {
  coachName: "",
  phone: "",
  schoolAffiliation: "",
  title: "",
};

const initialSchoolForm = {
  city: "",
  maxStudents: "",
  schoolName: "",
  shortName: "",
  state: "",
};

const initialStudentForm = {
  grade: "",
  name: "",
  paymentAcknowledged: false,
  paymentMethod: "",
  schoolId: "",
  schoolName: "",
  subjectRounds: [],
  waiverAccepted: false,
  waiverSignerName: "",
};

export default function DTMTRegister() {
  const {
    assignDtmtTeam,
    authReady,
    createDtmtCoachProfile,
    dtmtCoachProfile,
    dtmtSchool,
    dtmtStudentRegistration,
    listDtmtSchools,
    loadDtmtRoster,
    profile,
    registerDtmtSchool,
    submitDtmtStudentRegistration,
    user,
  } = useDpotdAuth();
  const [coachForm, setCoachForm] = useState(initialCoachForm);
  const [schoolForm, setSchoolForm] = useState(initialSchoolForm);
  const [studentForm, setStudentForm] = useState(initialStudentForm);
  const [coachMessage, setCoachMessage] = useState("");
  const [schoolMessage, setSchoolMessage] = useState("");
  const [studentMessage, setStudentMessage] = useState("");
  const [rosterMessage, setRosterMessage] = useState("");
  const [coachBusy, setCoachBusy] = useState(false);
  const [schoolBusy, setSchoolBusy] = useState(false);
  const [studentBusy, setStudentBusy] = useState(false);
  const [teamSavingId, setTeamSavingId] = useState("");
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [roster, setRoster] = useState([]);
  const [teamEdits, setTeamEdits] = useState({});
  const isCoachAccount = profile?.accountType === "coach";

  useEffect(() => {
    setCoachForm({
      coachName: dtmtCoachProfile?.coachName || profile?.name || "",
      phone: dtmtCoachProfile?.phone || "",
      schoolAffiliation: dtmtCoachProfile?.schoolAffiliation || profile?.school || "",
      title: dtmtCoachProfile?.title || "",
    });
  }, [dtmtCoachProfile, profile, user]);

  useEffect(() => {
    setSchoolForm({
      city: dtmtSchool?.city || "",
      maxStudents: dtmtSchool?.maxStudents || "",
      schoolName: dtmtSchool?.schoolName || dtmtCoachProfile?.schoolAffiliation || profile?.school || "",
      shortName: dtmtSchool?.shortName || "",
      state: dtmtSchool?.state || "",
    });
  }, [dtmtCoachProfile, dtmtSchool, profile]);

  useEffect(() => {
    setStudentForm({
      grade: dtmtStudentRegistration?.grade || profile?.grade || "",
      name: dtmtStudentRegistration?.name || profile?.name || "",
      paymentAcknowledged: Boolean(dtmtStudentRegistration?.paymentStatus),
      paymentMethod: dtmtStudentRegistration?.paymentMethod || "",
      schoolId: dtmtStudentRegistration?.schoolId || "",
      schoolName: dtmtStudentRegistration?.schoolName || "",
      subjectRounds: dtmtStudentRegistration?.subjectRounds || [],
      waiverAccepted: Boolean(dtmtStudentRegistration?.waiverAccepted),
      waiverSignerName: dtmtStudentRegistration?.waiverSignerName || "",
    });
  }, [dtmtStudentRegistration, profile, user]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const schools = await listDtmtSchools();
      if (!cancelled) {
        setSchoolOptions(schools);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [dtmtSchool, dtmtStudentRegistration, listDtmtSchools]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!dtmtSchool?.id) {
        setRoster([]);
        setTeamEdits({});
        return;
      }

      const nextRoster = await loadDtmtRoster(dtmtSchool.id);
      if (!cancelled) {
        setRoster(nextRoster);
        setTeamEdits(
          Object.fromEntries(nextRoster.map((item) => [item.id, item.teamLabel || ""])),
        );
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [dtmtSchool, loadDtmtRoster]);

  const selectedSchoolLabel = useMemo(() => {
    if (!studentForm.schoolId) return "";
    return schoolOptions.find((option) => option.id === studentForm.schoolId)?.schoolName || "";
  }, [schoolOptions, studentForm.schoolId]);

  function handleCoachChange(event) {
    const { name, value } = event.target;
    setCoachForm((current) => ({ ...current, [name]: value }));
    setCoachMessage("");
  }

  function handleSchoolChange(event) {
    const { name, value } = event.target;
    setSchoolForm((current) => ({ ...current, [name]: value }));
    setSchoolMessage("");
  }

  function handleStudentChange(event) {
    const { checked, name, type, value } = event.target;
    setStudentForm((current) => {
      if (name === "schoolId") {
        const schoolName = schoolOptions.find((option) => option.id === value)?.schoolName || "";
        return { ...current, schoolId: value, schoolName };
      }

      return { ...current, [name]: type === "checkbox" ? checked : value };
    });
    setStudentMessage("");
  }

  function toggleSubjectRound(round) {
    setStudentForm((current) => ({
      ...current,
      subjectRounds: current.subjectRounds.includes(round)
        ? current.subjectRounds.filter((item) => item !== round)
        : [...current.subjectRounds, round],
    }));
    setStudentMessage("");
  }

  async function handleCoachSubmit(event) {
    event.preventDefault();
    setCoachBusy(true);
    const result = await createDtmtCoachProfile(coachForm);
    setCoachBusy(false);
    setCoachMessage(result.ok ? "Coach profile saved." : result.error);
  }

  async function handleSchoolSubmit(event) {
    event.preventDefault();
    setSchoolBusy(true);
    const result = await registerDtmtSchool(schoolForm);
    setSchoolBusy(false);
    setSchoolMessage(result.ok ? "DTMT school registration saved." : result.error);
  }

  async function handleStudentSubmit(event) {
    event.preventDefault();
    setStudentBusy(true);
    const result = await submitDtmtStudentRegistration({
      ...studentForm,
      schoolName: studentForm.schoolName || selectedSchoolLabel,
    });
    setStudentBusy(false);
    setStudentMessage(result.ok ? "DTMT registration saved." : result.error);
  }

  async function handleTeamSave(studentUid, schoolId) {
    setTeamSavingId(studentUid);
    setRosterMessage("");
    const result = await assignDtmtTeam({
      schoolId,
      studentUid,
      teamLabel: teamEdits[studentUid] || "",
    });
    setTeamSavingId("");

    if (!result.ok) {
      setRosterMessage(result.error);
      return;
    }

    const nextRoster = await loadDtmtRoster(dtmtSchool.id);
    setRoster(nextRoster);
    setTeamEdits(Object.fromEntries(nextRoster.map((item) => [item.id, item.teamLabel || ""])));
    setRosterMessage("Team assignment saved.");
  }

  return (
    <>
      <PageHero
        actions={
          user
            ? [
                { label: "Open Profile", to: "/profile?view=dtmt" },
                { label: "DTMT Page", to: "/dtmt", variant: "ghost" },
              ]
            : [
                { label: "Sign In", to: "/profile" },
                { label: "DTMT Page", to: "/dtmt", variant: "ghost" },
              ]
        }
        aside={
          <HeroMediaPanel
            alt="Design Tech Math Club banner"
            badge="DTMT"
            caption="Coaches and students both use the same Design Tech Math Club account system for DTMT registration and status."
            imageClassName="object-contain p-8 md:p-10"
            src="/dtechmathclublogolarger.jpg"
          />
        }
        description="DTMT is the most detailed registration on the site. Coaches create coach profiles and school entries, while students register under a school, choose rounds, complete the waiver, record payment, and later receive team assignments."
        highlights={["Coach and Student Roles", "School Roster Management", "Waiver and Payment Tracking"]}
        title="DTMT Registration"
      />

      <FlowSection>
        <section className="py-8">
          {!authReady ? (
            <SplitPanel
              left={
                <>
                  <h2 className="text-3xl font-black text-txt">Checking your account</h2>
                  <p className="mt-4 leading-relaxed text-txt-muted">
                    We are confirming whether this browser already has a signed-in account for
                    DTMT registration.
                  </p>
                </>
              }
              right={
                <p className="text-sm leading-relaxed text-txt-muted">
                  Once your account is confirmed, this page will show either sign-in options or
                  the DTMT forms for that account.
                </p>
              }
            />
          ) : !user ? (
            <SplitPanel
              left={
                <>
                  <h2 className="text-3xl font-black text-txt">Sign into your account</h2>
                  <p className="mt-4 leading-relaxed text-txt-muted">
                    DTMT uses the shared website account. Coaches can set up schools and rosters,
                    while students can register for rounds, finish the waiver, and record payment.
                    If you do not have an account yet, create one from the profile page.
                  </p>
                </>
              }
              right={
                <ProfileAuthPanel
                  accountCreationLinkText="Need a Design Tech Math Club account?"
                  allowRegister={false}
                  coachRedirectTo="/dtmt/register"
                  defaultMode="signin"
                  embedded
                  hideWhenSignedIn
                  redirectTo="/dtmt/register"
                />
              }
            />
          ) : (
            <SplitPanel
              left={
                <>
                  <h2 className="text-3xl font-black text-txt">DTMT account status</h2>
                  <p className="mt-4 leading-relaxed text-txt-muted">
                    This account can hold both coach and student DTMT information, depending on
                    which registration steps you complete.
                  </p>
                </>
              }
              right={
                <>
                  <h2 className="text-3xl font-black text-txt">{profile?.name || "Member"}</h2>
                  <div className="mt-5 grid gap-4">
                    <StatusRow label="Coach Profile">
                      {dtmtCoachProfile ? "Active" : "Not created yet"}
                    </StatusRow>
                    <StatusRow label="School">
                      {dtmtSchool?.schoolName || "No school registered yet"}
                    </StatusRow>
                    <StatusRow label="Student Registration">
                      {dtmtStudentRegistration
                        ? dtmtStudentRegistration.schoolName
                        : "No student registration yet"}
                    </StatusRow>
                  </div>
                </>
              }
            />
          )}
        </section>
      </FlowSection>

      <FlowSection glow="muted">
        <section className="py-16">
          <div className="mx-auto w-[min(calc(100%-2rem),1180px)]">
            {!authReady ? (
              <SurfaceCard className="p-8 text-center">
                <p className="text-sm font-semibold text-txt-muted">Checking your account session...</p>
              </SurfaceCard>
            ) : !user ? null : (
              <div className="grid gap-8">
                {!isCoachAccount ? (
                  <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr]">
                    <SurfaceCard className="p-8">
                      <SectionHeader
                        title="Student DTMT Registration"
                        description="Students use the shared account, then register under a school, choose subject rounds, complete the waiver, and record the payment step."
                      />
                      {!schoolOptions.length ? (
                        <p className="mt-6 text-sm leading-relaxed text-txt-muted">
                          No schools are listed yet. A coach needs to create a coach profile and
                          register a school before student registration can be completed.
                        </p>
                      ) : (
                        <form className="mt-8 grid gap-5" onSubmit={handleStudentSubmit} noValidate>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <Field label="Student Name" name="name" onChange={handleStudentChange} required value={studentForm.name} />
                            <Field label="Grade" name="grade" onChange={handleStudentChange} required value={studentForm.grade} />
                          </div>

                          <label className="grid gap-2">
                            <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">School</span>
                            <select
                              className="w-full rounded-2xl border border-[rgba(234,109,74,0.14)] bg-[#fffaf6] px-4 py-3 text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
                              name="schoolId"
                              onChange={handleStudentChange}
                              required
                              value={studentForm.schoolId}
                            >
                              <option value="">Select a registered school</option>
                              {schoolOptions.map((option) => (
                                <option key={option.id} value={option.id}>
                                  {option.schoolName}
                                </option>
                              ))}
                            </select>
                          </label>

                          <div className="grid gap-3">
                            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand">Subject Rounds</p>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {studentRoundOptions.map((round) => (
                                <label
                                  key={round}
                                  className="flex items-start gap-3 border-t border-border-subtle pt-4 text-sm leading-relaxed text-txt-muted first:border-t-0 first:pt-0"
                                >
                                  <input
                                    checked={studentForm.subjectRounds.includes(round)}
                                    className="mt-1 h-4 w-4 rounded border-border-accent accent-brand"
                                    onChange={() => toggleSubjectRound(round)}
                                    type="checkbox"
                                  />
                                  <span>{round}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-border-subtle pt-4">
                            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand">Waiver</p>
                            <div className="mt-4 grid gap-4">
                              <Field
                                label="Waiver Signer Name"
                                name="waiverSignerName"
                                onChange={handleStudentChange}
                                required
                                value={studentForm.waiverSignerName}
                              />
                              <label className="flex items-start gap-3 text-sm leading-relaxed text-txt-muted">
                                <input
                                  checked={studentForm.waiverAccepted}
                                  className="mt-1 h-4 w-4 rounded border-border-accent accent-brand"
                                  name="waiverAccepted"
                                  onChange={handleStudentChange}
                                  required
                                  type="checkbox"
                                />
                                <span>
                                  I confirm that the waiver has been reviewed and accepted for this student.
                                </span>
                              </label>
                            </div>
                          </div>

                          <div className="border-t border-border-subtle pt-4">
                            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand">Payment</p>
                            <div className="mt-4 grid gap-4">
                              <label className="grid gap-2">
                                <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">Payment Method</span>
                                <select
                                  className="w-full rounded-2xl border border-[rgba(234,109,74,0.14)] bg-[#fffaf6] px-4 py-3 text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
                                  name="paymentMethod"
                                  onChange={handleStudentChange}
                                  required
                                  value={studentForm.paymentMethod}
                                >
                                  <option value="">Select a payment method</option>
                                  <option value="card-confirmation">Card payment confirmation</option>
                                  <option value="invoice">Invoice or coach-collected payment</option>
                                  <option value="other">Other recorded method</option>
                                </select>
                              </label>
                              <label className="flex items-start gap-3 text-sm leading-relaxed text-txt-muted">
                                <input
                                  checked={studentForm.paymentAcknowledged}
                                  className="mt-1 h-4 w-4 rounded border-border-accent accent-brand"
                                  name="paymentAcknowledged"
                                  onChange={handleStudentChange}
                                  required
                                  type="checkbox"
                                />
                                <span>
                                  I understand that payment status is being recorded here as part of registration.
                                </span>
                              </label>
                            </div>
                          </div>

                          {studentMessage ? (
                            <p className={`text-sm font-semibold ${studentMessage === "DTMT registration saved." ? "text-emerald-600" : "text-red-500"}`}>
                              {studentMessage}
                            </p>
                          ) : null}

                          <div className="flex flex-wrap gap-3">
                            <button
                              className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
                              disabled={studentBusy || !schoolOptions.length}
                              type="submit"
                            >
                              {studentBusy
                                ? "Saving..."
                                : dtmtStudentRegistration
                                  ? "Update DTMT Registration"
                                  : "Submit DTMT Registration"}
                            </button>
                            <Link
                              className="inline-flex rounded-full border border-brand px-6 py-3 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white"
                              to="/profile?view=dtmt"
                            >
                              Open DTMT Status
                            </Link>
                          </div>
                        </form>
                      )}
                    </SurfaceCard>

                    <SurfaceCard className="p-8">
                      <SectionHeader
                        title="Student Status"
                        description="After registration, the selected coach can see this student in the school roster and later assign a team."
                      />
                      <div className="mt-4 grid gap-4">
                        <StatusRow label="Selected School">
                          {dtmtStudentRegistration?.schoolName || selectedSchoolLabel || "Not selected yet"}
                        </StatusRow>
                        <StatusRow label="Subject Rounds">
                          {dtmtStudentRegistration?.subjectRounds?.length
                            ? dtmtStudentRegistration.subjectRounds.join(", ")
                            : "Not submitted yet"}
                        </StatusRow>
                        <StatusRow label="Waiver">
                          {dtmtStudentRegistration?.waiverAccepted
                            ? `Accepted by ${dtmtStudentRegistration.waiverSignerName}`
                            : "Not completed yet"}
                        </StatusRow>
                        <StatusRow label="Payment">
                          {dtmtStudentRegistration?.paymentStatus
                            ? `${dtmtStudentRegistration.paymentStatus} via ${dtmtStudentRegistration.paymentMethod}`
                            : "Not completed yet"}
                        </StatusRow>
                        <StatusRow label="Team Assignment">
                          {dtmtStudentRegistration?.teamLabel || "Pending coach assignment"}
                        </StatusRow>
                      </div>
                    </SurfaceCard>
                  </div>
                ) : null}

                {isCoachAccount ? (
                  <div className="grid gap-8 lg:grid-cols-[0.94fr_1.06fr]">
                    <div className="grid gap-8">
                      <SurfaceCard className="p-8">
                        <SectionHeader
                          title="Coach Details"
                          description="Your coach account already has DTMT access. Add or update your coach details here."
                        />
                        <form className="mt-8 grid gap-4" onSubmit={handleCoachSubmit} noValidate>
                          <Field label="Coach Name" name="coachName" onChange={handleCoachChange} required value={coachForm.coachName} />
                          <Field label="Title" name="title" onChange={handleCoachChange} value={coachForm.title} />
                          <Field label="School Affiliation" name="schoolAffiliation" onChange={handleCoachChange} required value={coachForm.schoolAffiliation} />
                          <Field label="Phone" name="phone" onChange={handleCoachChange} required value={coachForm.phone} />
                          {coachMessage ? (
                            <p className={`text-sm font-semibold ${coachMessage === "Coach profile saved." ? "text-emerald-600" : "text-red-500"}`}>
                              {coachMessage}
                            </p>
                          ) : null}
                          <button
                            className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={coachBusy}
                            type="submit"
                          >
                            {coachBusy ? "Saving..." : dtmtCoachProfile ? "Update Coach Profile" : "Create Coach Profile"}
                          </button>
                        </form>
                      </SurfaceCard>

                      <SurfaceCard className="p-8">
                        <SectionHeader
                          title="School Registration"
                          description="Coach accounts can register a school right away, then use the roster table and team assignment interface."
                        />
                        <form className="mt-8 grid gap-4" onSubmit={handleSchoolSubmit} noValidate>
                          <Field label="School Name" name="schoolName" onChange={handleSchoolChange} required value={schoolForm.schoolName} />
                          <Field label="Short Name" name="shortName" onChange={handleSchoolChange} required value={schoolForm.shortName} />
                          <div className="grid gap-4 sm:grid-cols-3">
                            <Field label="City" name="city" onChange={handleSchoolChange} required value={schoolForm.city} />
                            <Field label="State" name="state" onChange={handleSchoolChange} required value={schoolForm.state} />
                            <Field label="Max Students" name="maxStudents" onChange={handleSchoolChange} required value={schoolForm.maxStudents} />
                          </div>
                          {schoolMessage ? (
                            <p className={`text-sm font-semibold ${schoolMessage === "DTMT school registration saved." ? "text-emerald-600" : "text-red-500"}`}>
                              {schoolMessage}
                            </p>
                          ) : null}
                          <button
                            className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={schoolBusy}
                            type="submit"
                          >
                            {schoolBusy
                              ? "Saving..."
                              : dtmtSchool
                                ? "Update School Registration"
                                : "Register School"}
                          </button>
                        </form>
                      </SurfaceCard>
                    </div>

                    <SurfaceCard className="p-8">
                      <SectionHeader
                        title="School Roster and Team Assignment"
                        description="Students who register under this school appear here. Coaches can then assign each student to a team from the roster table."
                      />
                      {!dtmtSchool ? (
                        <p className="mt-6 text-sm leading-relaxed text-txt-muted">
                          Register the school first to unlock the roster table.
                        </p>
                      ) : !roster.length ? (
                        <p className="mt-6 text-sm leading-relaxed text-txt-muted">
                          No student registrations have been submitted under this school yet.
                        </p>
                      ) : (
                        <div className="mt-6 grid gap-4">
                          {roster.map((student) => (
                            <div key={student.id} className="border-t border-border-subtle pt-4">
                              <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                  <p className="text-lg font-black text-txt">{student.name}</p>
                                  <p className="text-sm text-txt-muted">{student.email}</p>
                                </div>
                                <div className="text-right text-sm text-txt-muted">
                                  <p>Grade {student.grade}</p>
                                  <p>{student.paymentStatus || "payment pending"}</p>
                                </div>
                              </div>
                              <div className="mt-3 flex flex-wrap gap-3 text-sm text-txt-muted">
                                <span>Rounds: {student.subjectRounds?.join(", ") || "None selected"}</span>
                                <span>Waiver: {student.waiverAccepted ? "Complete" : "Pending"}</span>
                              </div>
                              <div className="mt-4 flex flex-wrap items-center gap-3">
                                <input
                                  className="min-w-[220px] rounded-2xl border border-[rgba(234,109,74,0.14)] bg-[#fffaf6] px-4 py-3 text-sm text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
                                  onChange={(event) =>
                                    setTeamEdits((current) => ({
                                      ...current,
                                      [student.id]: event.target.value,
                                    }))
                                  }
                                  placeholder="Assign team label"
                                  value={teamEdits[student.id] ?? ""}
                                />
                                <button
                                  className="inline-flex rounded-full border border-brand px-5 py-3 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                  disabled={teamSavingId === student.id}
                                  onClick={() => handleTeamSave(student.id, student.schoolId)}
                                  type="button"
                                >
                                  {teamSavingId === student.id ? "Saving..." : "Save Team"}
                                </button>
                              </div>
                            </div>
                          ))}
                          {rosterMessage ? (
                            <p className={`text-sm font-semibold ${rosterMessage === "Team assignment saved." ? "text-emerald-600" : "text-red-500"}`}>
                              {rosterMessage}
                            </p>
                          ) : null}
                        </div>
                      )}
                    </SurfaceCard>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </section>
      </FlowSection>
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

function StatusRow({ label, children }) {
  return (
    <div className="border-t border-border-subtle pt-4">
      <p className="text-sm font-bold text-txt">{label}</p>
      <p className="mt-2 text-sm leading-relaxed text-txt-muted">{children}</p>
    </div>
  );
}
