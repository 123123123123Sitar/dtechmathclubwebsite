import { useMemo, useState } from "react";
import SectionHeader from "./SectionHeader";
import SurfaceCard from "./SurfaceCard";
import {
  formatDtmtPaymentSummary,
  getDtmtPaymentResponsibilityLabel,
} from "../lib/dtmtPayment";

export default function DtmtCoachRosterPanel({
  dtmtSchool,
  onCreateTeam,
  onTeamSave,
  roster,
  rosterLoading = false,
  rosterMessage = "",
  teamCreateBusy = false,
  teamCreateMessage = "",
  teamSavingId = "",
  title = "School Roster and Team Assignment",
  description = "Students who register under this school appear here. Drag students into named teams and keep the roster organized from this page.",
}) {
  const [draftTeamName, setDraftTeamName] = useState("");
  const [draggedStudentId, setDraggedStudentId] = useState("");

  const teamSummary = useMemo(() => {
    if (!roster.length) return [];

    const groups = roster.reduce((accumulator, student) => {
      const label = (student.teamLabel || "").trim() || "Unassigned";
      const current = accumulator.get(label) || [];
      current.push(student);
      accumulator.set(label, current);
      return accumulator;
    }, new Map());

    return Array.from(groups.entries())
      .map(([label, students]) => ({ label, students }))
      .sort((left, right) => {
        if (left.label === "Unassigned") return -1;
        if (right.label === "Unassigned") return 1;
        return left.label.localeCompare(right.label);
      });
  }, [roster]);

  const teamColumns = useMemo(() => {
    const savedLabels = Array.isArray(dtmtSchool?.teamLabels)
      ? dtmtSchool.teamLabels.map((item) => String(item || "").trim()).filter(Boolean)
      : [];
    const assignedLabels = roster
      .map((student) => String(student.teamLabel || "").trim())
      .filter(Boolean);
    const labels = Array.from(new Set([...savedLabels, ...assignedLabels])).sort((left, right) =>
      left.localeCompare(right),
    );

    return [
      {
        key: "__unassigned__",
        label: "Unassigned",
        value: "",
        students: roster.filter((student) => !String(student.teamLabel || "").trim()),
      },
      ...labels.map((label) => ({
        key: label,
        label,
        value: label,
        students: roster.filter((student) => String(student.teamLabel || "").trim() === label),
      })),
    ];
  }, [dtmtSchool?.teamLabels, roster]);

  async function handleCreateTeam(event) {
    event.preventDefault();
    if (!draftTeamName.trim()) return;

    const result = await onCreateTeam(draftTeamName);
    if (result?.ok) {
      setDraftTeamName("");
    }
  }

  async function handleDrop(event, teamLabel) {
    event.preventDefault();
    const studentId = event.dataTransfer.getData("text/plain") || draggedStudentId;
    if (!studentId) return;

    const student = roster.find((item) => item.id === studentId);
    if (!student) return;

    setDraggedStudentId("");
    await onTeamSave(student.id, student.schoolId, teamLabel);
  }

  return (
    <SurfaceCard className="p-8">
      <SectionHeader title={title} description={description} />
      {!dtmtSchool ? (
        <p className="mt-6 text-sm leading-relaxed text-txt-muted">
          Register the school first to unlock coach team management.
        </p>
      ) : rosterLoading ? (
        <p className="mt-6 text-sm leading-relaxed text-txt-muted">
          Loading student submissions for {dtmtSchool.schoolName}...
        </p>
      ) : (
        <div className="mt-6 grid gap-6">
          <form className="grid gap-3 rounded-[24px] border border-border-subtle bg-white/65 p-5 md:grid-cols-[1fr_auto]" onSubmit={handleCreateTeam}>
            <label className="grid gap-2">
              <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
                Create DTMT Team
              </span>
              <input
                className="rounded-2xl border border-[rgba(234,109,74,0.14)] bg-[#fffaf6] px-4 py-3 text-sm text-txt outline-none transition-all duration-200 focus:border-brand focus:ring-2 focus:ring-brand/25"
                onChange={(event) => setDraftTeamName(event.target.value)}
                placeholder="Enter a team name"
                value={draftTeamName}
              />
            </label>
            <button
              className="inline-flex self-end rounded-full bg-brand px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
              disabled={teamCreateBusy}
              type="submit"
            >
              {teamCreateBusy ? "Saving..." : "Add Team"}
            </button>
          </form>

          {teamCreateMessage ? (
            <p
              className={`text-sm font-semibold ${
                teamCreateMessage.includes("saved") ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {teamCreateMessage}
            </p>
          ) : null}

          {teamSummary.length ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {teamSummary.map((team) => (
                <div
                  key={team.label}
                  className="rounded-[24px] border border-border-subtle bg-white/65 px-5 py-4"
                >
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
                    {team.label}
                  </p>
                  <p className="mt-2 text-lg font-black text-txt">
                    {team.students.length} student{team.students.length === 1 ? "" : "s"}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-txt-muted">
                    {team.students.map((student) => student.name).join(", ")}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {!roster.length ? (
            <p className="text-sm leading-relaxed text-txt-muted">
              No student registrations have been submitted under this school yet.
            </p>
          ) : (
            <div className="grid gap-4 xl:grid-cols-3">
              {teamColumns.map((column) => (
                <div
                  key={column.key}
                  className="rounded-[28px] border border-border-subtle bg-white/75 p-5"
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleDrop(event, column.value)}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
                        {column.label}
                      </p>
                      <p className="mt-1 text-sm text-txt-muted">
                        {column.students.length} student
                        {column.students.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3">
                    {column.students.length ? (
                      column.students.map((student) => (
                        <button
                          key={student.id}
                          className={`w-full rounded-[22px] border border-border-subtle bg-[#fffaf6] p-4 text-left transition-all duration-200 ${
                            draggedStudentId === student.id ? "opacity-60" : "hover:border-brand/40"
                          }`}
                          draggable
                          onDragEnd={() => setDraggedStudentId("")}
                          onDragStart={(event) => {
                            event.dataTransfer.setData("text/plain", student.id);
                            setDraggedStudentId(student.id);
                          }}
                          type="button"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-base font-black text-txt">{student.name}</p>
                              <p className="text-sm text-txt-muted">Grade {student.grade}</p>
                            </div>
                            {teamSavingId === student.id ? (
                              <span className="text-xs font-bold uppercase tracking-[0.14em] text-brand">
                                Saving
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-3 grid gap-1 text-sm leading-relaxed text-txt-muted">
                            <p>Lunch: {student.lunchPreference || "Not listed"}</p>
                            <p>Rounds: {student.subjectRounds?.join(", ") || "None selected"}</p>
                            <p>Waiver: {student.waiverAccepted ? "Complete" : "Pending"}</p>
                            <p>
                              Payment Option:{" "}
                              {getDtmtPaymentResponsibilityLabel(student.paymentResponsibility)}
                            </p>
                            <p>Payment: {formatDtmtPaymentSummary(student)}</p>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="rounded-[20px] border border-dashed border-border-subtle px-4 py-6 text-center text-sm text-txt-muted">
                        Drop a student here.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {rosterMessage ? (
            <p
              className={`text-sm font-semibold ${
                rosterMessage.includes("saved") ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {rosterMessage}
            </p>
          ) : null}
        </div>
      )}
    </SurfaceCard>
  );
}
