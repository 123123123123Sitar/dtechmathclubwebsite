import { useEffect, useMemo, useState } from "react";
import DtmtCoachRosterPanel from "./DtmtCoachRosterPanel";
import SectionHeader from "./SectionHeader";
import SurfaceCard from "./SurfaceCard";
import { useDpotdAuth } from "../context/DpotdAuthContext";
import {
  DTMT_PAYMENT_METHOD_OPTIONS,
  DTMT_PAYMENT_RESPONSIBILITY,
  formatDtmtPaymentSummary,
  getDtmtPaymentResponsibilityLabel,
  isCoachManagedDtmtPayment,
  normalizeDtmtPaymentResponsibility,
} from "../lib/dtmtPayment";

const studentRoundOptions = [
  "Algebra",
  "Geometry",
  "Discrete Mathematics",
  "6th Grade Division",
];

const lunchOptions = [
  "Standard lunch",
  "Vegetarian lunch",
  "Vegan lunch",
  "Gluten-free lunch",
  "I will bring my own lunch",
];

const coachPaymentOptions = [
  [
    DTMT_PAYMENT_RESPONSIBILITY.COACH,
    "Coach handles payments",
    "As a coach, you will handle all student payments and reimbursements. Students will not be asked to pay for themselves.",
  ],
  [
    DTMT_PAYMENT_RESPONSIBILITY.STUDENT,
    "Students pay for themselves",
    "Students will pay their required amount. No work is needed on your part.",
  ],
];

const initialCoachForm = {
  coachAttending: "yes",
  coachEventNotes: "",
  coachName: "",
  paymentResponsibility: DTMT_PAYMENT_RESPONSIBILITY.STUDENT,
  schoolName: "",
  title: "",
};

const initialStudentForm = {
  dietaryNotes: "",
  grade: "",
  lunchPreference: "",
  name: "",
  paymentAcknowledged: false,
  registrationMode: "school",
  schoolId: "",
  schoolName: "",
  subjectRounds: [],
  waiverAccepted: false,
  waiverSignerName: "",
};

export default function DtmtDashboardPanel() {
  const {
    assignDtmtTeam,
    dtmtCoachProfile,
    dtmtSchool,
    dtmtStudentRegistration,
    listDtmtSchools,
    loadDtmtRoster,
    profile,
    saveDtmtCoachRegistration,
    saveDtmtTeamLabels,
    submitDtmtStudentRegistration,
    user,
  } = useDpotdAuth();
  const [coachForm, setCoachForm] = useState(initialCoachForm);
  const [studentForm, setStudentForm] = useState(initialStudentForm);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [coachRoster, setCoachRoster] = useState([]);
  const [coachRosterLoading, setCoachRosterLoading] = useState(false);
  const [coachMessage, setCoachMessage] = useState("");
  const [studentMessage, setStudentMessage] = useState("");
  const [rosterMessage, setRosterMessage] = useState("");
  const [teamCreateMessage, setTeamCreateMessage] = useState("");
  const [coachBusy, setCoachBusy] = useState(false);
  const [studentBusy, setStudentBusy] = useState(false);
  const [teamCreateBusy, setTeamCreateBusy] = useState(false);
  const [teamSavingId, setTeamSavingId] = useState("");
  const isCoachAccount = profile?.accountType === "coach";

  useEffect(() => {
    setCoachForm({
      coachAttending:
        dtmtCoachProfile?.coachAttending === false ||
        dtmtSchool?.coachAttending === false
          ? "no"
          : "yes",
      coachEventNotes:
        dtmtCoachProfile?.coachEventNotes || dtmtSchool?.coachEventNotes || "",
      coachName: dtmtCoachProfile?.coachName || profile?.name || "",
      paymentResponsibility: normalizeDtmtPaymentResponsibility(
        dtmtSchool?.paymentResponsibility,
      ),
      schoolName:
        dtmtSchool?.schoolName ||
        dtmtCoachProfile?.schoolAffiliation ||
        profile?.school ||
        "",
      title: dtmtCoachProfile?.title || "",
    });
  }, [dtmtCoachProfile, dtmtSchool, profile]);

  useEffect(() => {
    const mode =
      dtmtStudentRegistration?.registrationMode === "individual" ||
      dtmtStudentRegistration?.schoolId === "independent"
        ? "individual"
        : "school";

    setStudentForm({
      dietaryNotes: dtmtStudentRegistration?.dietaryNotes || "",
      grade: dtmtStudentRegistration?.grade || profile?.grade || "",
      lunchPreference: dtmtStudentRegistration?.lunchPreference || "",
      name: dtmtStudentRegistration?.name || profile?.name || "",
      paymentAcknowledged: Boolean(dtmtStudentRegistration?.paymentStatus),
      registrationMode: mode,
      schoolId:
        mode === "school" ? dtmtStudentRegistration?.schoolId || "" : "",
      schoolName:
        mode === "school" ? dtmtStudentRegistration?.schoolName || "" : "",
      subjectRounds: dtmtStudentRegistration?.subjectRounds || [],
      waiverAccepted: Boolean(dtmtStudentRegistration?.waiverAccepted),
      waiverSignerName: dtmtStudentRegistration?.waiverSignerName || "",
    });
  }, [dtmtStudentRegistration, profile]);

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
  }, [listDtmtSchools, dtmtSchool, dtmtStudentRegistration]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!isCoachAccount || !dtmtSchool?.id) {
        setCoachRoster([]);
        setCoachRosterLoading(false);
        return;
      }

      setCoachRosterLoading(true);
      const nextRoster = await loadDtmtRoster(dtmtSchool.id);
      if (!cancelled) {
        setCoachRoster(nextRoster);
        setCoachRosterLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [dtmtSchool, isCoachAccount, loadDtmtRoster]);

  const selectedSchoolLabel = useMemo(() => {
    if (!studentForm.schoolId) return "";
    return (
      schoolOptions.find((option) => option.id === studentForm.schoolId)
        ?.schoolName || ""
    );
  }, [schoolOptions, studentForm.schoolId]);

  const selectedSchool = useMemo(
    () =>
      schoolOptions.find((option) => option.id === studentForm.schoolId) ||
      null,
    [schoolOptions, studentForm.schoolId],
  );

  const selectedPaymentResponsibility = useMemo(() => {
    if (studentForm.registrationMode !== "school") {
      return DTMT_PAYMENT_RESPONSIBILITY.STUDENT;
    }

    if (selectedSchool) {
      return normalizeDtmtPaymentResponsibility(
        selectedSchool.paymentResponsibility,
      );
    }

    if (dtmtStudentRegistration?.schoolId === studentForm.schoolId) {
      return normalizeDtmtPaymentResponsibility(
        dtmtStudentRegistration?.paymentResponsibility,
      );
    }

    return DTMT_PAYMENT_RESPONSIBILITY.STUDENT;
  }, [
    dtmtStudentRegistration?.paymentResponsibility,
    dtmtStudentRegistration?.schoolId,
    selectedSchool,
    studentForm.registrationMode,
    studentForm.schoolId,
  ]);

  const requiresStudentPayment =
    studentForm.registrationMode === "individual" ||
    (studentForm.registrationMode === "school" &&
      Boolean(studentForm.schoolId) &&
      !isCoachManagedDtmtPayment(selectedPaymentResponsibility));

  function handleCoachChange(event) {
    const { name, value } = event.target;
    setCoachForm((current) => ({ ...current, [name]: value }));
    setCoachMessage("");
  }

  function handleStudentChange(event) {
    const { checked, name, type, value } = event.target;
    setStudentForm((current) => {
      if (name === "schoolId") {
        const schoolRecord =
          schoolOptions.find((option) => option.id === value) || null;
        const schoolName = schoolRecord?.schoolName || "";
        const coachManagedPayment =
          Boolean(value) &&
          isCoachManagedDtmtPayment(schoolRecord?.paymentResponsibility);

        return {
          ...current,
          schoolId: value,
          schoolName,
          paymentAcknowledged: coachManagedPayment
            ? true
            : current.paymentAcknowledged,
        };
      }

      return { ...current, [name]: type === "checkbox" ? checked : value };
    });
    setStudentMessage("");
  }

  function setRegistrationMode(mode) {
    setStudentForm((current) => ({
      ...current,
      registrationMode: mode,
      schoolId: mode === "school" ? current.schoolId : "",
      schoolName: mode === "school" ? current.schoolName : "",
      paymentAcknowledged:
        mode === "individual" && false
          ? false
          : current.paymentAcknowledged,
    }));
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
    const result = await saveDtmtCoachRegistration(coachForm);
    setCoachBusy(false);
    setCoachMessage(
      result.ok ? "DTMT coach registration saved." : result.error,
    );
  }

  async function handleStudentSubmit(event) {
    event.preventDefault();
    setStudentBusy(true);
    const result = await submitDtmtStudentRegistration({
      ...studentForm,
      schoolName:
        studentForm.registrationMode === "school"
          ? studentForm.schoolName || selectedSchoolLabel
          : "",
    });
    setStudentBusy(false);
    setStudentMessage(result.ok ? "DTMT registration saved." : result.error);
  }

  async function handleCreateTeam(teamName) {
    setTeamCreateBusy(true);
    setTeamCreateMessage("");

    const nextTeamLabels = Array.from(
      new Set(
        [
          ...(dtmtSchool?.teamLabels || []),
          String(teamName || "").trim(),
        ].filter(Boolean),
      ),
    );
    const result = await saveDtmtTeamLabels(nextTeamLabels);

    setTeamCreateBusy(false);
    setTeamCreateMessage(result.ok ? "DTMT team list saved." : result.error);
    return result;
  }

  async function handleTeamSave(studentUid, schoolId, teamLabel) {
    setTeamSavingId(studentUid);
    setRosterMessage("");

    const result = await assignDtmtTeam({
      schoolId,
      studentUid,
      teamLabel,
    });

    setTeamSavingId("");

    if (!result.ok) {
      setRosterMessage(result.error);
      return result;
    }

    const nextRoster = await loadDtmtRoster(dtmtSchool.id);
    setCoachRoster(nextRoster);
    setRosterMessage("DTMT team assignment saved.");
    return result;
  }

  return isCoachAccount ? (
    <div className="grid gap-8">
      <div className="grid gap-8">
        {!dtmtSchool ? (
          <SurfaceCard className="p-8">
            <SectionHeader
              title="DTMT Coach Registration"
              description="Step 1: Complete the form below to register your school. This will allow your students to register under your school."
            />
            <form
              className="mt-8 grid gap-5"
              onSubmit={handleCoachSubmit}
              noValidate
            >
              <ReadonlyField
                label="Email"
                value={profile?.email || user?.email || ""}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Coach Name"
                  name="coachName"
                  onChange={handleCoachChange}
                  required
                  value={coachForm.coachName}
                />
                <Field
                  label="Title"
                  name="title"
                  onChange={handleCoachChange}
                  value={coachForm.title}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="School Name"
                  name="schoolName"
                  onChange={handleCoachChange}
                  required
                  value={coachForm.schoolName}
                />
                <label className="grid gap-2">
                  <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
                    Coach RSVP
                  </span>
                  <select
                    className="w-full rounded-2xl border border-[rgba(234,109,74,0.14)] bg-[#fffaf6] px-4 py-3 text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
                    name="coachAttending"
                    onChange={handleCoachChange}
                    value={coachForm.coachAttending}
                  >
                    <option value="yes">Yes, I am attending</option>
                    <option value="no">No, I am not attending</option>
                  </select>
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2"></div>
              <div className="grid gap-3 border-t border-border-subtle pt-4">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
                  Payment Option
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {coachPaymentOptions.map(([value, label, description]) => (
                    <button
                      key={value}
                      className={`rounded-[24px] border px-5 py-4 text-left transition-all duration-200 ${
                        coachForm.paymentResponsibility === value
                          ? "border-brand bg-brand text-white shadow-md shadow-brand-glow"
                          : "border-border-subtle bg-white/70 text-txt hover:border-brand/40"
                      }`}
                      onClick={() =>
                        setCoachForm((current) => ({
                          ...current,
                          paymentResponsibility: value,
                        }))
                      }
                      type="button"
                    >
                      <p className="text-sm font-black uppercase tracking-[0.14em]">
                        {label}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed opacity-90">
                        {description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
              <label className="grid gap-2">
                <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
                  Coach Notes
                </span>
                <textarea
                  className="min-h-35 rounded-2xl border border-[rgba(234,109,74,0.14)] bg-surface-3 px-4 py-3 text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
                  name="coachEventNotes"
                  onChange={handleCoachChange}
                  placeholder="Share coach attendance notes, supervision details, or team-planning context."
                  value={coachForm.coachEventNotes}
                />
              </label>
              <MessageCopy
                message={coachMessage}
                successCopy="DTMT coach registration saved."
              />
              <button
                className="inline-flex w-fit rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
                disabled={coachBusy}
                type="submit"
              >
                {coachBusy ? "Submitting..." : "Submit Coach Registration"}
              </button>
            </form>
          </SurfaceCard>
        ) : null}

        {dtmtSchool ? (
          <SurfaceCard className="p-8">
            <SectionHeader
              title={
                <span className="flex items-center gap-2">
                  <span>Registration Complete!</span>
                  <span className="inline-block text-emerald-600">
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="12" fill="#34D399" />
                      <path
                        d="M7 13l3 3 7-7"
                        stroke="#fff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </span>
              }
              description="Your DTMT coach registration is complete. View your submitted details below."
            />
            <details className="mt-6 rounded-xl border border-brand/20 bg-white/80 p-4">
              <summary className="cursor-pointer text-lg font-bold text-brand">
                View Submission Details
              </summary>
              <div className="mt-4 grid gap-4">
                <StatusLine label="School">
                  {dtmtSchool?.schoolName || "Not registered yet"}
                </StatusLine>
                <StatusLine label="Coach RSVP">
                  {dtmtCoachProfile?.coachAttending === false
                    ? "Not attending"
                    : "Attending"}
                </StatusLine>
                <StatusLine label="Registered Students">
                  {coachRoster.length
                    ? `${coachRoster.length} student${coachRoster.length === 1 ? "" : "s"}`
                    : "No student registrations yet"}
                </StatusLine>
                <StatusLine label="Payment Option">
                  {dtmtSchool
                    ? getDtmtPaymentResponsibilityLabel(
                        dtmtSchool.paymentResponsibility,
                      )
                    : "Not configured yet"}
                </StatusLine>
                <StatusLine label="Teams">
                  {Array.isArray(dtmtSchool?.teamLabels) &&
                  dtmtSchool.teamLabels.length
                    ? dtmtSchool.teamLabels.join(", ")
                    : "No team names created yet"}
                </StatusLine>
              </div>
            </details>
          </SurfaceCard>
        ) : null}
      </div>

      <DtmtCoachRosterPanel
        description="Create named teams, then drag students into those team columns. The board updates the saved team assignment immediately."
        dtmtSchool={dtmtSchool}
        onCreateTeam={handleCreateTeam}
        onTeamSave={handleTeamSave}
        roster={coachRoster}
        rosterLoading={coachRosterLoading}
        rosterMessage={rosterMessage}
        teamCreateBusy={teamCreateBusy}
        teamCreateMessage={teamCreateMessage}
        teamSavingId={teamSavingId}
        title="DTMT Team Builder"
      />
    </div>
  ) : (
    <div className="grid gap-8">
      {!dtmtStudentRegistration ? (
        <SurfaceCard className="p-8">
          <SectionHeader
            title="DTMT Student Form"
            description="Student accounts register here after signing in. Choose a coach-registered school from the dropdown or continue as an individual and receive a random independent team."
          />
          <form
            className="mt-8 grid gap-5"
            onSubmit={handleStudentSubmit}
            noValidate
          >
            <ReadonlyField
              label="Email"
              value={profile?.email || user?.email || ""}
            />
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

            <div className="grid gap-3">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
                Registration Type
              </p>
              <div className="flex flex-wrap gap-3">
                {[
                  ["school", "Join a registered school"],
                  ["individual", "Register as an individual"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    className={`inline-flex rounded-full px-5 py-3 text-sm font-bold transition-all duration-200 ${
                      studentForm.registrationMode === value
                        ? "bg-brand text-white shadow-md shadow-brand-glow"
                        : "border border-brand bg-white/70 text-brand hover:bg-brand hover:text-white"
                    }`}
                    onClick={() => setRegistrationMode(value)}
                    type="button"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {studentForm.registrationMode === "school" ? (
              <label className="grid gap-2">
                <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
                  School
                </span>
                <select
                  className="w-full rounded-2xl border border-[rgba(234,109,74,0.14)] bg-[#fffaf6] px-4 py-3 text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
                  name="schoolId"
                  onChange={handleStudentChange}
                  required
                  value={studentForm.schoolId}
                >
                  <option value="">Select a coach-registered school</option>
                  {schoolOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.schoolName}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <div className="rounded-[22px] border border-border-subtle bg-white/70 px-5 py-4 text-sm leading-relaxed text-txt-muted">
                You can still compete even if your school is not listed.
                Individual entries are placed into an independent team
                automatically after submission.
              </div>
            )}

            <label className="grid gap-2">
              <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
                Lunch Preference
              </span>
              <select
                className="w-full rounded-2xl border border-[rgba(234,109,74,0.14)] bg-[#fffaf6] px-4 py-3 text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
                name="lunchPreference"
                onChange={handleStudentChange}
                required
                value={studentForm.lunchPreference}
              >
                <option value="">Select a lunch preference</option>
                {lunchOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
                Dietary Notes
              </span>
              <textarea
                className="min-h-30 rounded-2xl border border-[rgba(234,109,74,0.14)] bg-surface-3 px-4 py-3 text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
                name="dietaryNotes"
                onChange={handleStudentChange}
                placeholder="Allergy details or lunch notes."
                value={studentForm.dietaryNotes}
              />
            </label>

            <div className="grid gap-3">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
                Subject Rounds
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {studentRoundOptions.map((round) => (
                  <label
                    key={round}
                    className="flex items-start gap-3 rounded-[20px] border border-border-subtle bg-white/70 px-4 py-4 text-sm leading-relaxed text-txt-muted"
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

            <div className="grid gap-4 border-t border-border-subtle pt-4">
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
                  I confirm that the DTMT waiver has been reviewed and accepted.
                </span>
              </label>
            </div>

            <div className="grid gap-4 border-t border-border-subtle pt-4">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
                Payment
              </p>
              <div className="rounded-[22px] border border-border-subtle bg-white/70 px-5 py-4 text-sm leading-relaxed text-txt-muted">
                {studentForm.registrationMode === "individual"
                  ? "Independent entries handle their own DTMT payment during registration."
                  : !studentForm.schoolId
                    ? "Choose a registered school above to load that coach's DTMT payment option."
                    : isCoachManagedDtmtPayment(selectedPaymentResponsibility)
                      ? `${selectedSchoolLabel || studentForm.schoolName} is marked as coach-paid. You do not need to enter a separate student payment method.`
                      : `${selectedSchoolLabel || studentForm.schoolName} requires each student to record their own payment below.`}
              </div>
            </div>

            <MessageCopy
              message={studentMessage}
              successCopy="DTMT registration saved."
            />
            <button
              className="inline-flex w-fit rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
              disabled={studentBusy}
              type="submit"
            >
              {studentBusy ? "Submitting..." : "Submit Student Registration"}
            </button>
          </form>
        </SurfaceCard>
      ) : null}

      {!dtmtStudentRegistration ? null : (
        <SurfaceCard className="p-8">
          <SectionHeader
            title={
              <span className="flex items-center gap-2">
                <span>Registration Complete!</span>
                <span className="inline-block text-emerald-600">
                  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="12" fill="#34D399" />
                    <path
                      d="M7 13l3 3 7-7"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>
            }
            description="Your DTMT registration is complete. View your submitted details below."
          />
          <div className="mt-6 grid gap-4">
            <StatusLine label="Team Assignment">
              {dtmtStudentRegistration?.teamLabel || "Pending"}
            </StatusLine>
            <StatusLine label="Subject Rounds">
              {dtmtStudentRegistration?.subjectRounds?.length
                ? dtmtStudentRegistration.subjectRounds.join(", ")
                : "Not submitted yet"}
            </StatusLine>
          </div>
          <details className="mt-6 rounded-xl border border-brand/20 bg-white/80 p-4">
            <summary className="cursor-pointer text-lg font-bold text-brand">
              View Registration Details
            </summary>
            <div className="mt-4 grid gap-4">
              <StatusLine label="Registration">
                {dtmtStudentRegistration ? "Submitted" : "Not submitted yet"}
              </StatusLine>
              <StatusLine label="School">
                {dtmtStudentRegistration?.registrationMode === "individual"
                  ? "Independent entry"
                  : dtmtStudentRegistration?.schoolName ||
                    selectedSchoolLabel ||
                    "Not selected yet"}
              </StatusLine>
              <StatusLine label="Payment Option">
                {dtmtStudentRegistration
                  ? getDtmtPaymentResponsibilityLabel(
                      dtmtStudentRegistration.paymentResponsibility,
                    )
                  : studentForm.registrationMode === "school" &&
                      studentForm.schoolId
                    ? getDtmtPaymentResponsibilityLabel(
                        selectedPaymentResponsibility,
                      )
                    : "Not submitted yet"}
              </StatusLine>
              <StatusLine label="Lunch Preference">
                {dtmtStudentRegistration?.lunchPreference ||
                  "Not submitted yet"}
              </StatusLine>
              <StatusLine label="Payment">
                {dtmtStudentRegistration
                  ? formatDtmtPaymentSummary(dtmtStudentRegistration)
                  : "Not submitted yet"}
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

function ReadonlyField({ label, value }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
        {label}
      </span>
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
    <p
      className={`text-sm font-semibold ${message === successCopy ? "text-emerald-600" : "text-red-500"}`}
    >
      {message}
    </p>
  );
}
