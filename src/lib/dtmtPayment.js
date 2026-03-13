export const DTMT_PAYMENT_RESPONSIBILITY = {
  COACH: "coach-pays-all",
  STUDENT: "students-pay-themselves",
};

export const DTMT_PAYMENT_METHOD_OPTIONS = [
  ["card-confirmation", "Card payment confirmation"],
  ["invoice", "Invoice or coach-collected payment"],
  ["cash", "Cash at check-in"],
  ["other", "Other recorded method"],
];

const paymentMethodLabels = {
  "card-confirmation": "Card payment confirmation",
  invoice: "Invoice or coach-collected payment",
  cash: "Cash at check-in",
  other: "Other recorded method",
  "coach-covered": "Coach or school payment",
};

function toSentenceCase(value) {
  const normalized = String(value || "").trim().replace(/[-_]+/g, " ");
  if (!normalized) return "";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

export function normalizeDtmtPaymentResponsibility(value) {
  return value === DTMT_PAYMENT_RESPONSIBILITY.COACH
    ? DTMT_PAYMENT_RESPONSIBILITY.COACH
    : DTMT_PAYMENT_RESPONSIBILITY.STUDENT;
}

export function isCoachManagedDtmtPayment(value) {
  return normalizeDtmtPaymentResponsibility(value) === DTMT_PAYMENT_RESPONSIBILITY.COACH;
}

export function getDtmtPaymentResponsibilityLabel(value) {
  return isCoachManagedDtmtPayment(value)
    ? "Coach will pay for all students"
    : "Students will pay for themselves";
}

export function getDtmtPaymentMethodLabel(value) {
  const normalized = String(value || "").trim();
  return paymentMethodLabels[normalized] || toSentenceCase(normalized);
}

export function formatDtmtPaymentSummary({ paymentMethod, paymentResponsibility, paymentStatus }) {
  if (isCoachManagedDtmtPayment(paymentResponsibility)) {
    return "Coach or school payment covers this registration.";
  }

  if (!paymentStatus) {
    return "Not submitted yet";
  }

  const statusLabel = toSentenceCase(paymentStatus);
  const methodLabel = getDtmtPaymentMethodLabel(paymentMethod);
  return methodLabel ? `${statusLabel} via ${methodLabel}` : statusLabel;
}
