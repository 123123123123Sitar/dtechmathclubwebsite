import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../lib/dpotdFirebase";
import {
  DTMT_PAYMENT_RESPONSIBILITY,
  isCoachManagedDtmtPayment,
  normalizeDtmtPaymentResponsibility,
} from "../lib/dtmtPayment";

const SITE_PROFILE_COLLECTION = "siteProfiles";
const COACH_ACCOUNT_COLLECTION = "coachAccounts";
const PORTAL_USER_COLLECTION = "users";
const DPOTD_REGISTRATION_COLLECTION = "dpotdRegistrations";
const PUZZLE_NIGHT_COLLECTION = "puzzleNightRegistrations";
const DTMT_COACH_COLLECTION = "dtmtCoachProfiles";
const DTMT_SCHOOL_COLLECTION = "dtmtSchools";
const DTMT_STUDENT_COLLECTION = "dtmtStudentRegistrations";
const CONTACT_SUBMISSION_COLLECTION = "contactSubmissions";
const SPONSOR_INQUIRY_COLLECTION = "sponsorshipInquiries";

const PUZZLE_NIGHT_EVENT_KEY = "puzzle-night-2026";
const DTMT_EVENT_KEY = "dtmt-2026";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DpotdAuthContext = createContext(null);

function formatAuthError(error, fallback) {
  const code = error?.code ?? "";

  if (code.includes("email-already-in-use")) {
    return "That email already has a Design Tech Math Club account.";
  }
  if (code.includes("invalid-email")) {
    return "Enter a valid email address.";
  }
  if (code.includes("weak-password")) {
    return "Use a stronger password with at least 6 characters.";
  }
  if (
    code.includes("user-not-found") ||
    code.includes("wrong-password") ||
    code.includes("invalid-credential")
  ) {
    return "Unable to sign in with that email and password.";
  }
  if (code.includes("too-many-requests")) {
    return "Too many attempts. Wait a moment and try again.";
  }
  if (code.includes("operation-not-allowed")) {
    return "Email and password signup is not enabled in Firebase Authentication for this project.";
  }
  if (code.includes("app-not-authorized") || code.includes("unauthorized-domain")) {
    return "This site domain is not authorized for Firebase Authentication. Add the deployed domain in Firebase Authentication settings.";
  }
  if (code.includes("invalid-api-key")) {
    return "The Firebase Web API key is invalid or blocked for this site.";
  }
  if (
    code.includes("captcha-check-failed") ||
    code.includes("invalid-app-credential") ||
    code.includes("missing-app-credential") ||
    code.includes("missing-client-type") ||
    code.includes("recaptcha")
  ) {
    return "Firebase rejected the signup verification step. Check the deployed domain and Firebase Auth anti-abuse settings.";
  }
  if (code.includes("network-request-failed")) {
    return "The network request to Firebase failed. Check your connection and try again.";
  }

  if (code) {
    return `${fallback} (${code.replace(/^auth\//, "")})`;
  }

  return fallback;
}

function formatFirestoreError(error, fallback) {
  const code = error?.code ?? "";

  if (code.includes("permission-denied")) {
    return "Firestore is blocking this save. Update the Firestore rules for siteProfiles, coachAccounts, dtmtCoachProfiles, dtmtSchools, dtmtStudentRegistrations, puzzleNightRegistrations, dpotdRegistrations, contactSubmissions, and sponsorshipInquiries.";
  }
  if (code.includes("unavailable")) {
    return "Firestore is temporarily unavailable. Try again in a moment.";
  }

  if (code) {
    return `${fallback} (${code.replace(/^firestore\//, "")})`;
  }

  return fallback;
}

function hasLetter(value) {
  return /[A-Za-z]/.test(value);
}

function validateTextField(value, label, { minLength = 2, requireLetter = false } = {}) {
  const trimmed = value.trim();

  if (!trimmed) {
    return `${label} is required.`;
  }

  if (trimmed.length < minLength) {
    return `${label} must be at least ${minLength} characters.`;
  }

  if (requireLetter && !hasLetter(trimmed)) {
    return `${label} must include letters and cannot be only numbers or symbols.`;
  }

  return "";
}

function validateEmailField(value, label = "Email") {
  const trimmed = value.trim().toLowerCase();

  if (!trimmed) {
    return `${label} is required.`;
  }

  if (!EMAIL_PATTERN.test(trimmed)) {
    return `Enter a valid ${label.toLowerCase()}.`;
  }

  return "";
}

function combineNameParts(firstName, lastName) {
  return [firstName?.trim(), lastName?.trim()].filter(Boolean).join(" ").trim();
}

function normalizeSchoolKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function coerceBooleanChoice(value, defaultValue = false) {
  if (typeof value === "boolean") return value;

  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  if (["yes", "true", "attending", "coming", "1"].includes(normalized)) {
    return true;
  }

  if (["no", "false", "not-attending", "not coming", "0"].includes(normalized)) {
    return false;
  }

  return defaultValue;
}

function buildIndependentTeamLabel(userId) {
  const safeId = String(userId || "").trim();
  const buckets = ["Independent Team 1", "Independent Team 2", "Independent Team 3"];

  if (!safeId) {
    return buckets[0];
  }

  const score = safeId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return buckets[score % buckets.length];
}

async function loadDocByUidOrEmail(collectionName, user) {
  if (!user) return null;

  const directDoc = await getDoc(doc(db, collectionName, user.uid));
  if (directDoc.exists()) {
    return { id: directDoc.id, ...directDoc.data() };
  }

  const email = (user.email || "").trim().toLowerCase();
  if (!email) return null;

  const emailMatch = await getDocs(
    query(collection(db, collectionName), where("email", "==", email), limit(1)),
  );

  if (!emailMatch.empty) {
    const item = emailMatch.docs[0];
    return { id: item.id, ...item.data() };
  }

  return null;
}

async function loadPortalProfile(user) {
  return loadDocByUidOrEmail(PORTAL_USER_COLLECTION, user);
}

async function loadSiteProfile(user) {
  return loadDocByUidOrEmail(SITE_PROFILE_COLLECTION, user);
}

async function loadCoachAccount(user) {
  if (!user) return null;

  const directDoc = await getDoc(doc(db, COACH_ACCOUNT_COLLECTION, user.uid));
  if (directDoc.exists()) {
    return { id: directDoc.id, ...directDoc.data() };
  }

  return null;
}

async function loadPuzzleNightRegistration(user) {
  if (!user) return null;

  const directDoc = await getDoc(doc(db, PUZZLE_NIGHT_COLLECTION, user.uid));
  if (directDoc.exists()) {
    return { id: directDoc.id, ...directDoc.data() };
  }

  const fallback = await getDocs(
    query(collection(db, PUZZLE_NIGHT_COLLECTION), where("accountUid", "==", user.uid), limit(1)),
  );

  if (!fallback.empty) {
    const item = fallback.docs[0];
    return { id: item.id, ...item.data() };
  }

  return null;
}

async function loadDtmtCoachProfile(user) {
  if (!user) return null;

  const directDoc = await getDoc(doc(db, DTMT_COACH_COLLECTION, user.uid));
  if (directDoc.exists()) {
    return { id: directDoc.id, ...directDoc.data() };
  }

  return null;
}

async function loadDtmtSchool(user) {
  if (!user) return null;

  const directDoc = await getDoc(doc(db, DTMT_SCHOOL_COLLECTION, user.uid));
  if (directDoc.exists()) {
    return { id: directDoc.id, ...directDoc.data() };
  }

  return null;
}

async function loadDtmtStudentRegistration(user) {
  if (!user) return null;

  const directDoc = await getDoc(doc(db, DTMT_STUDENT_COLLECTION, user.uid));
  if (directDoc.exists()) {
    return { id: directDoc.id, ...directDoc.data() };
  }

  return null;
}

function deriveAccountType(
  siteProfile,
  coachAccountRecord,
  dtmtCoachProfile,
  dtmtSchool,
  dtmtStudentRegistration,
) {
  const hasCoachSignals = Boolean(
    siteProfile?.coachAccount ||
      coachAccountRecord ||
      siteProfile?.dtmtCoachActive ||
      dtmtCoachProfile ||
      dtmtSchool,
  );

  if (hasCoachSignals || siteProfile?.accountType === "coach") {
    return "coach";
  }

  if (
    siteProfile?.accountType === "student" ||
    siteProfile?.studentAccount ||
    dtmtStudentRegistration
  ) {
    return "student";
  }

  return "student";
}

function deriveProfileName(
  user,
  siteProfile,
  portalProfile,
  dtmtCoachProfile,
  dtmtStudentRegistration,
) {
  const directName =
    siteProfile?.name ||
    combineNameParts(siteProfile?.firstName, siteProfile?.lastName) ||
    dtmtStudentRegistration?.name ||
    dtmtCoachProfile?.coachName ||
    portalProfile?.name ||
    user?.displayName ||
    "";

  if (directName.trim()) {
    return directName.trim();
  }

  const emailLocalPart = (siteProfile?.email || portalProfile?.email || user?.email || "")
    .split("@")[0]
    .trim();

  if (emailLocalPart && hasLetter(emailLocalPart)) {
    return emailLocalPart;
  }

  return "Member";
}

function mergeProfiles(
  user,
  siteProfile,
  coachAccountRecord,
  portalProfile,
  puzzleNightRegistration,
  dtmtCoachProfile,
  dtmtSchool,
  dtmtStudentRegistration,
) {
  const accountType = deriveAccountType(
    siteProfile,
    coachAccountRecord,
    dtmtCoachProfile,
    dtmtSchool,
    dtmtStudentRegistration,
  );

  return {
    id: siteProfile?.id || portalProfile?.id || user?.uid || null,
    accountType,
    name: deriveProfileName(
      user,
      siteProfile,
      portalProfile,
      dtmtCoachProfile,
      dtmtStudentRegistration,
    ),
    email: siteProfile?.email || portalProfile?.email || user?.email || "",
    school:
      dtmtStudentRegistration?.schoolName ||
      dtmtSchool?.schoolName ||
      dtmtCoachProfile?.schoolAffiliation ||
      siteProfile?.school ||
      portalProfile?.school ||
      "",
    grade: dtmtStudentRegistration?.grade || siteProfile?.grade || portalProfile?.grade || "",
    coachAccount: accountType === "coach",
    studentAccount: accountType !== "coach",
    dpotdRegistered: Boolean(siteProfile?.dpotdRegistered || portalProfile),
    dpotdRegistrationCompletedAt:
      siteProfile?.dpotdRegistrationCompletedAt || portalProfile?.dpotdRegisteredAt || null,
    puzzleNightRegistered: Boolean(puzzleNightRegistration),
    puzzleNightRegistrationType: puzzleNightRegistration?.registrationType || "student",
    dtmtCoachActive: Boolean(siteProfile?.dtmtCoachActive || dtmtCoachProfile || accountType === "coach"),
    dtmtSchoolRegistered: Boolean(dtmtSchool),
    dtmtStudentRegistered: Boolean(dtmtStudentRegistration),
    dtmtTeamLabel: dtmtStudentRegistration?.teamLabel || "",
    dtmtSchoolName: dtmtStudentRegistration?.schoolName || dtmtSchool?.schoolName || "",
    isAdmin: Boolean(portalProfile?.isAdmin),
    isGrader: Boolean(portalProfile?.isGrader),
  };
}

export function DpotdAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [siteProfile, setSiteProfile] = useState(null);
  const [coachAccountRecord, setCoachAccountRecord] = useState(null);
  const [portalProfile, setPortalProfile] = useState(null);
  const [puzzleNightRegistration, setPuzzleNightRegistration] = useState(null);
  const [dtmtCoachProfile, setDtmtCoachProfile] = useState(null);
  const [dtmtSchool, setDtmtSchool] = useState(null);
  const [dtmtStudentRegistration, setDtmtStudentRegistration] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const refreshRequestRef = useRef(0);

  async function readOptional(loader) {
    try {
      return await loader();
    } catch (_) {
      return null;
    }
  }

  async function refreshProfile(nextUser = auth.currentUser) {
    const requestId = refreshRequestRef.current + 1;
    refreshRequestRef.current = requestId;

    if (!nextUser) {
      if (requestId !== refreshRequestRef.current) {
        return null;
      }

      setUser(null);
      setSiteProfile(null);
      setCoachAccountRecord(null);
      setPortalProfile(null);
      setPuzzleNightRegistration(null);
      setDtmtCoachProfile(null);
      setDtmtSchool(null);
      setDtmtStudentRegistration(null);
      setProfile(null);
      return null;
    }

    const [
      nextSiteProfile,
      nextCoachAccountRecord,
      nextPortalProfile,
      nextPuzzleNightRegistration,
      nextDtmtCoachProfile,
      nextDtmtSchool,
      nextDtmtStudentRegistration,
    ] = await Promise.all([
      readOptional(() => loadSiteProfile(nextUser)),
      readOptional(() => loadCoachAccount(nextUser)),
      readOptional(() => loadPortalProfile(nextUser)),
      readOptional(() => loadPuzzleNightRegistration(nextUser)),
      readOptional(() => loadDtmtCoachProfile(nextUser)),
      readOptional(() => loadDtmtSchool(nextUser)),
      readOptional(() => loadDtmtStudentRegistration(nextUser)),
    ]);

    const mergedProfile = mergeProfiles(
      nextUser,
      nextSiteProfile,
      nextCoachAccountRecord,
      nextPortalProfile,
      nextPuzzleNightRegistration,
      nextDtmtCoachProfile,
      nextDtmtSchool,
      nextDtmtStudentRegistration,
    );

    if (requestId !== refreshRequestRef.current) {
      return {
        siteProfile: nextSiteProfile,
        coachAccountRecord: nextCoachAccountRecord,
        portalProfile: nextPortalProfile,
        puzzleNightRegistration: nextPuzzleNightRegistration,
        dtmtCoachProfile: nextDtmtCoachProfile,
        dtmtSchool: nextDtmtSchool,
        dtmtStudentRegistration: nextDtmtStudentRegistration,
        profile: mergedProfile,
      };
    }

    setUser(nextUser);
    setSiteProfile(nextSiteProfile);
    setCoachAccountRecord(nextCoachAccountRecord);
    setPortalProfile(nextPortalProfile);
    setPuzzleNightRegistration(nextPuzzleNightRegistration);
    setDtmtCoachProfile(nextDtmtCoachProfile);
    setDtmtSchool(nextDtmtSchool);
    setDtmtStudentRegistration(nextDtmtStudentRegistration);
    setProfile(mergedProfile);

    return {
      siteProfile: nextSiteProfile,
      coachAccountRecord: nextCoachAccountRecord,
      portalProfile: nextPortalProfile,
      puzzleNightRegistration: nextPuzzleNightRegistration,
      dtmtCoachProfile: nextDtmtCoachProfile,
      dtmtSchool: nextDtmtSchool,
      dtmtStudentRegistration: nextDtmtStudentRegistration,
      profile: mergedProfile,
    };
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      const authStateRequestId = refreshRequestRef.current + 1;
      refreshRequestRef.current = authStateRequestId;

      if (!nextUser) {
        if (authStateRequestId !== refreshRequestRef.current) {
          return;
        }

        setUser(null);
        setSiteProfile(null);
        setCoachAccountRecord(null);
        setPortalProfile(null);
        setPuzzleNightRegistration(null);
        setDtmtCoachProfile(null);
        setDtmtSchool(null);
        setDtmtStudentRegistration(null);
        setProfile(null);
        setAuthReady(true);
        return;
      }

      try {
        await refreshProfile(nextUser);
      } catch (_) {
        if (authStateRequestId !== refreshRequestRef.current) {
          return;
        }

        const fallbackProfile = mergeProfiles(nextUser, null, null, null, null, null, null, null);
        setUser(nextUser);
        setSiteProfile(null);
        setCoachAccountRecord(null);
        setPortalProfile(null);
        setPuzzleNightRegistration(null);
        setDtmtCoachProfile(null);
        setDtmtSchool(null);
        setDtmtStudentRegistration(null);
        setProfile(fallbackProfile);
      } finally {
        setAuthReady(true);
      }
    });

    return unsubscribe;
  }, []);

  async function signInSiteAccount(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: formatAuthError(error, "Unable to sign in right now."),
      };
    }
  }

  async function registerSiteAccount(values) {
    const accountType = values.accountType === "coach" ? "coach" : "student";
    const firstName = values.firstName.trim();
    const lastName = values.lastName.trim();
    const email = values.email.trim().toLowerCase();
    const school = values.school.trim();
    const grade = accountType === "student" ? values.grade.trim() : "";
    const password = values.password;
    const name = [firstName, lastName].filter(Boolean).join(" ").trim();

    if (!firstName || !lastName || !email || !school || !password) {
      return { ok: false, error: "Fill in every account field before continuing." };
    }

    if (accountType === "student" && !grade) {
      return { ok: false, error: "Enter your grade before continuing." };
    }

    const firstNameError = validateTextField(firstName, "First name", { requireLetter: true });
    if (firstNameError) {
      return { ok: false, error: firstNameError };
    }

    const lastNameError = validateTextField(lastName, "Last name", { requireLetter: true });
    if (lastNameError) {
      return { ok: false, error: lastNameError };
    }

    const emailError = validateEmailField(email, "Email");
    if (emailError) {
      return { ok: false, error: emailError };
    }

    const schoolError = validateTextField(
      school,
      accountType === "coach" ? "School affiliation" : "School",
      { requireLetter: true },
    );
    if (schoolError) {
      return { ok: false, error: schoolError };
    }

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name }).catch(() => null);
      const optimisticCoachAccountRecord =
        accountType === "coach"
          ? {
              id: credential.user.uid,
              accountUid: credential.user.uid,
              accountType: "coach",
              email,
              name,
              school,
              source: "dtechmathclub-site",
              status: "active",
            }
          : null;
      const optimisticSiteProfile = {
        id: credential.user.uid,
        accountType,
        coachAccount: accountType === "coach",
        studentAccount: accountType === "student",
        name,
        firstName,
        lastName,
        email,
        school,
        grade,
        dpotdRegistered: false,
        dtmtCoachActive: false,
        dtmtSchoolRegistered: false,
        dtmtStudentRegistered: false,
        puzzleNightRegistered: false,
        source: "dtechmathclub-site",
      };

      const writes = [
        setDoc(doc(db, SITE_PROFILE_COLLECTION, credential.user.uid), {
          ...optimisticSiteProfile,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }),
      ];

      if (optimisticCoachAccountRecord) {
        writes.push(
          setDoc(doc(db, COACH_ACCOUNT_COLLECTION, credential.user.uid), {
            ...optimisticCoachAccountRecord,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          }),
        );
      }

      await Promise.all(writes);

      setAuthReady(true);
      setUser(credential.user);
      setSiteProfile(optimisticSiteProfile);
      setCoachAccountRecord(optimisticCoachAccountRecord);
      setPortalProfile(null);
      setPuzzleNightRegistration(null);
      setDtmtCoachProfile(null);
      setDtmtSchool(null);
      setDtmtStudentRegistration(null);
      setProfile(
        mergeProfiles(
          credential.user,
          optimisticSiteProfile,
          optimisticCoachAccountRecord,
          null,
          null,
          null,
          null,
          null,
        ),
      );

      try {
        await refreshProfile(credential.user);
      } catch (_) {
        // Keep the optimistic profile if the immediate refetch lags behind account creation.
      }

      return { ok: true };
    } catch (error) {
      if ((error?.code || "").startsWith("auth/")) {
        return {
          ok: false,
          error: formatAuthError(error, "Unable to create your account right now."),
        };
      }

      return {
        ok: false,
        error: formatFirestoreError(
          error,
          "Unable to create your account because the profile record could not be saved.",
        ),
      };
    }
  }

  async function submitDpotdRegistration(values) {
    if (!auth.currentUser) {
      return { ok: false, error: "You need to be signed in before registering for D.PotD." };
    }

    if ((profile?.accountType || siteProfile?.accountType) === "coach") {
      return {
        ok: false,
        error: "Coach accounts cannot register for D.PotD. Use a student account for D.PotD registration.",
      };
    }

    const name = values.name.trim();
    const school = values.school.trim();
    const grade = values.grade.trim();
    const email = (auth.currentUser.email || profile?.email || "").trim().toLowerCase();

    if (!name || !school || !grade) {
      return { ok: false, error: "Fill in your name, school, and grade before continuing." };
    }

    if (!values.termsAccepted || !values.integrityAccepted) {
      return {
        ok: false,
        error: "Confirm the registration and integrity acknowledgements before continuing.",
      };
    }

    try {
      const uid = auth.currentUser.uid;
      const sharedProfile = {
        name,
        email,
        school,
        grade,
        updatedAt: serverTimestamp(),
      };

      await Promise.all([
        setDoc(
          doc(db, SITE_PROFILE_COLLECTION, uid),
          {
            ...sharedProfile,
            dpotdRegistered: true,
            dpotdRegistrationCompletedAt: serverTimestamp(),
            dpotdRegistrationSource: "website-form",
            ...(siteProfile ? {} : { createdAt: serverTimestamp(), source: "dtechmathclub-site" }),
          },
          { merge: true },
        ),
        setDoc(
          doc(db, DPOTD_REGISTRATION_COLLECTION, uid),
          {
            ...sharedProfile,
            accountUid: uid,
            status: "registered",
            termsAccepted: true,
            integritySignalsAcknowledged: true,
            registrationSource: "website-form",
            submittedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        ),
        setDoc(
          doc(db, PORTAL_USER_COLLECTION, uid),
          {
            ...sharedProfile,
            isAdmin: portalProfile?.isAdmin ?? false,
            isGrader: portalProfile?.isGrader ?? false,
            siteAccountUid: uid,
            dpotdRegisteredAt: serverTimestamp(),
            source: "dtechmathclub-site-registration",
            ...(portalProfile ? {} : { createdAt: serverTimestamp() }),
          },
          { merge: true },
        ),
      ]);

      await refreshProfile();
      return { ok: true };
    } catch (_) {
      return {
        ok: false,
        error: "Unable to complete D.PotD registration right now.",
      };
    }
  }

  async function registerPuzzleNight(values) {
    if (!auth.currentUser) {
      return { ok: false, error: "You need to be signed in before registering for Puzzle Night." };
    }

    const accountType = profile?.accountType || siteProfile?.accountType || "student";
    const registrationType = "student";
    const name = String(values.name || "").trim();
    const email = String(auth.currentUser.email || values.email || profile?.email || "").trim().toLowerCase();
    const schoolId = String(values.schoolId || "").trim();
    const schoolName = String(values.schoolName || values.school || "").trim();
    const schoolKey = normalizeSchoolKey(schoolName);
    const grade = String(values.grade || "").trim();
    const teacherEmail = String(values.teacherEmail || "").trim().toLowerCase();
    const parentName = String(values.parentName || "").trim();
    const parentEmail = String(values.parentEmail || "").trim().toLowerCase();
    const notes = String(values.notes || "").trim();
    const accountUid = auth.currentUser.uid;

    if (accountType === "coach" || values.registrationType === "coach") {
      return {
        ok: false,
        error: "Puzzle Night registration is only available for student accounts.",
      };
    }

    if (!name || !email || !grade || !parentName || !parentEmail) {
      return {
        ok: false,
        error: "Fill in every required Puzzle Night detail before continuing.",
      };
    }

    const nameError = validateTextField(name, "Student name", { requireLetter: true });
    if (nameError) {
      return { ok: false, error: nameError };
    }

    const emailError = validateEmailField(email, "Email");
    if (emailError) {
      return { ok: false, error: emailError };
    }

    const gradeError = validateTextField(grade, "Grade", { minLength: 1 });
    if (gradeError) {
      return { ok: false, error: gradeError };
    }

    const parentNameError = validateTextField(parentName, "Parent or guardian name", {
      requireLetter: true,
    });
    if (parentNameError) {
      return { ok: false, error: parentNameError };
    }

    const parentEmailError = validateEmailField(parentEmail, "Parent or guardian email");
    if (parentEmailError) {
      return { ok: false, error: parentEmailError };
    }

    if (teacherEmail) {
      const teacherEmailError = validateEmailField(teacherEmail, "Math teacher email");
      if (teacherEmailError) {
        return { ok: false, error: teacherEmailError };
      }
    }

    if (schoolName) {
      const schoolError = validateTextField(schoolName, "School", { requireLetter: true });
      if (schoolError) {
        return { ok: false, error: schoolError };
      }
    }

    try {
      const payload = {
        accountUid,
        email,
        eventKey: PUZZLE_NIGHT_EVENT_KEY,
        grade,
        name,
        notes,
        coachAttending: null,
        parentEmail,
        parentName,
        registrationType,
        registrationSource: "signed-in-account",
        schoolId,
        schoolKey,
        schoolName,
        status: "registered",
        teacherEmail,
        updatedAt: serverTimestamp(),
        ...(puzzleNightRegistration ? {} : { submittedAt: serverTimestamp() }),
      };

      const writes = [
        setDoc(doc(db, PUZZLE_NIGHT_COLLECTION, accountUid), payload, { merge: true }),
        setDoc(
          doc(db, SITE_PROFILE_COLLECTION, accountUid),
          {
            ...(siteProfile ? {} : { createdAt: serverTimestamp(), source: "dtechmathclub-site" }),
            accountType: "student",
            coachAccount: false,
            studentAccount: true,
            name,
            email: (auth.currentUser.email || email).trim().toLowerCase(),
            school: schoolName || siteProfile?.school || "",
            grade,
            puzzleNightRegistered: true,
            puzzleNightRegisteredAt: serverTimestamp(),
            puzzleNightRegistrationType: registrationType,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        ),
      ];

      await Promise.all(writes);

      await refreshProfile();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: formatFirestoreError(error, "Unable to submit Puzzle Night registration right now."),
      };
    }
  }

  async function submitContactInquiry(values) {
    const firstName = values.firstName.trim();
    const lastName = values.lastName.trim();
    const email = values.email.trim().toLowerCase();
    const organization = values.organization.trim();
    const position = values.position.trim();
    const subject = values.subject.trim();
    const message = values.message.trim();

    const validationErrors = [
      validateTextField(firstName, "First name", { requireLetter: true }),
      validateTextField(lastName, "Last name", { requireLetter: true }),
      validateEmailField(email, "Email"),
      validateTextField(organization, "School or organization", { requireLetter: true }),
      validateTextField(subject, "Subject", { requireLetter: true }),
      validateTextField(message, "Message", { minLength: 10, requireLetter: true }),
    ].filter(Boolean);

    if (validationErrors.length) {
      return { ok: false, error: validationErrors[0] };
    }

    try {
      await setDoc(
        doc(collection(db, CONTACT_SUBMISSION_COLLECTION)),
        {
          email,
          firstName,
          lastName,
          message,
          organization,
          position,
          source: "website-contact-form",
          status: "new",
          subject,
          submittedAt: serverTimestamp(),
        },
      );

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: formatFirestoreError(error, "Unable to submit the contact form right now."),
      };
    }
  }

  async function submitSponsorInquiry(values) {
    const firstName = values.firstName.trim();
    const lastName = values.lastName.trim();
    const email = values.email.trim().toLowerCase();
    const company = values.company.trim();
    const message = values.message.trim();

    const validationErrors = [
      validateTextField(firstName, "First name", { requireLetter: true }),
      validateTextField(lastName, "Last name", { requireLetter: true }),
      validateEmailField(email, "Email"),
      validateTextField(company, "Company or organization", { requireLetter: true }),
      validateTextField(message, "Message", { minLength: 10, requireLetter: true }),
    ].filter(Boolean);

    if (validationErrors.length) {
      return { ok: false, error: validationErrors[0] };
    }

    try {
      await setDoc(
        doc(collection(db, SPONSOR_INQUIRY_COLLECTION)),
        {
          company,
          email,
          firstName,
          lastName,
          message,
          source: "website-sponsorship-form",
          status: "new",
          submittedAt: serverTimestamp(),
        },
      );

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: formatFirestoreError(error, "Unable to submit the sponsorship form right now."),
      };
    }
  }

  async function createDtmtCoachProfile(values) {
    if (!auth.currentUser) {
      return { ok: false, error: "You need to be signed in before creating a coach profile." };
    }

    if ((profile?.accountType || siteProfile?.accountType) !== "coach") {
      return { ok: false, error: "Only coach accounts can create coach details for DTMT." };
    }

    const coachName = values.coachName.trim();
    const title = values.title.trim();
    const schoolAffiliation = values.schoolAffiliation.trim();
    const phone = values.phone.trim();
    const email = (auth.currentUser.email || profile?.email || "").trim().toLowerCase();

    if (!coachName || !schoolAffiliation || !phone) {
      return { ok: false, error: "Fill in the coach name, school affiliation, and phone number." };
    }

    try {
      const uid = auth.currentUser.uid;
      await Promise.all([
        setDoc(
          doc(db, DTMT_COACH_COLLECTION, uid),
          {
            accountUid: uid,
            coachName,
            email,
            eventKey: DTMT_EVENT_KEY,
            phone,
            schoolAffiliation,
            status: "active",
            title,
            updatedAt: serverTimestamp(),
            ...(dtmtCoachProfile ? {} : { createdAt: serverTimestamp() }),
          },
          { merge: true },
        ),
        setDoc(
          doc(db, COACH_ACCOUNT_COLLECTION, uid),
          {
            accountType: "coach",
            accountUid: uid,
            email,
            name: coachName,
            school: schoolAffiliation,
            status: "active",
            updatedAt: serverTimestamp(),
            ...(coachAccountRecord ? {} : { createdAt: serverTimestamp(), source: "dtechmathclub-site" }),
          },
          { merge: true },
        ),
        setDoc(
          doc(db, SITE_PROFILE_COLLECTION, uid),
          {
            accountType: "coach",
            ...(siteProfile ? {} : { createdAt: serverTimestamp(), source: "dtechmathclub-site" }),
            coachAccount: true,
            dtmtCoachActive: true,
            dtmtCoachProfileCompletedAt: serverTimestamp(),
            email,
            name: siteProfile?.name || coachName,
            studentAccount: false,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        ),
      ]);

      await refreshProfile();
      return { ok: true };
    } catch (_) {
      return { ok: false, error: "Unable to create the DTMT coach profile right now." };
    }
  }

  async function registerDtmtSchool(values) {
    if (!auth.currentUser) {
      return { ok: false, error: "You need to be signed in before registering a DTMT school." };
    }

    if ((profile?.accountType || siteProfile?.accountType) !== "coach") {
      return { ok: false, error: "Only coach accounts can register a DTMT school." };
    }

    const schoolName = values.schoolName.trim();
    const city = values.city.trim();
    const paymentResponsibility = normalizeDtmtPaymentResponsibility(
      values.paymentResponsibility || dtmtSchool?.paymentResponsibility,
    );
    const coachName = dtmtCoachProfile?.coachName || profile?.name || siteProfile?.name || "";
    const coachEmail = (dtmtCoachProfile?.email || profile?.email || auth.currentUser.email || "")
      .trim()
      .toLowerCase();
    const coachTitle = dtmtCoachProfile?.title || "";
    const coachPhone = dtmtCoachProfile?.phone || "";
    const schoolAffiliation = dtmtCoachProfile?.schoolAffiliation || profile?.school || schoolName;

    if (!schoolName || !city) {
      return {
        ok: false,
        error: "Fill in every school registration detail before continuing.",
      };
    }

    if (!coachName || !coachEmail) {
      return {
        ok: false,
        error: "Your coach account is missing required contact details. Update your account name and try again.",
      };
    }

    try {
      const uid = auth.currentUser.uid;
      await Promise.all([
        setDoc(
          doc(db, DTMT_COACH_COLLECTION, uid),
          {
            accountUid: uid,
            coachName,
            email: coachEmail,
            eventKey: DTMT_EVENT_KEY,
            phone: coachPhone,
            schoolAffiliation,
            status: "active",
            title: coachTitle,
            updatedAt: serverTimestamp(),
            ...(dtmtCoachProfile ? {} : { createdAt: serverTimestamp() }),
          },
          { merge: true },
        ),
        setDoc(
          doc(db, COACH_ACCOUNT_COLLECTION, uid),
          {
            accountType: "coach",
            accountUid: uid,
            email: coachEmail,
            name: coachName,
            school: schoolName,
            status: "active",
            updatedAt: serverTimestamp(),
            ...(coachAccountRecord ? {} : { createdAt: serverTimestamp(), source: "dtechmathclub-site" }),
          },
          { merge: true },
        ),
        setDoc(
          doc(db, DTMT_SCHOOL_COLLECTION, uid),
          {
            city,
            coachEmail,
            coachName,
            coachUid: uid,
            eventKey: DTMT_EVENT_KEY,
            paymentResponsibility,
            schoolName,
            schoolKey: normalizeSchoolKey(schoolName),
            status: "registered",
            teamLabels: dtmtSchool?.teamLabels || [],
            updatedAt: serverTimestamp(),
            ...(dtmtSchool ? {} : { createdAt: serverTimestamp() }),
          },
          { merge: true },
        ),
        setDoc(
          doc(db, SITE_PROFILE_COLLECTION, uid),
          {
            accountType: "coach",
            ...(siteProfile ? {} : { createdAt: serverTimestamp(), source: "dtechmathclub-site" }),
            coachAccount: true,
            dtmtCoachActive: true,
            dtmtSchoolRegistered: true,
            dtmtSchoolRegisteredAt: serverTimestamp(),
            school: schoolName,
            studentAccount: false,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        ),
      ]);

      await refreshProfile();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: formatFirestoreError(error, "Unable to register the DTMT school right now."),
      };
    }
  }

  async function saveDtmtCoachRegistration(values) {
    if (!auth.currentUser) {
      return { ok: false, error: "You need to be signed in before registering your DTMT coach details." };
    }

    if ((profile?.accountType || siteProfile?.accountType) !== "coach") {
      return { ok: false, error: "Only coach accounts can manage DTMT coach registration." };
    }

    const coachName = values.coachName.trim();
    const title = values.title.trim();
    const schoolName = values.schoolName.trim();
    const paymentResponsibility = normalizeDtmtPaymentResponsibility(
      values.paymentResponsibility || dtmtSchool?.paymentResponsibility,
    );
    const coachAttending = coerceBooleanChoice(
      values.coachAttending,
      dtmtCoachProfile?.coachAttending ?? true,
    );
    const coachEventNotes = values.coachEventNotes.trim();
    const coachEmail = (auth.currentUser.email || profile?.email || "").trim().toLowerCase();
    const existingTeamLabels = Array.isArray(dtmtSchool?.teamLabels)
      ? dtmtSchool.teamLabels
          .map((item) => String(item || "").trim())
          .filter(Boolean)
      : [];

    const requiredChecks = [
      validateTextField(coachName, "Coach name", { requireLetter: true }),
      validateTextField(schoolName, "School name", { requireLetter: true }),
    ].filter(Boolean);

    if (requiredChecks.length) {
      return { ok: false, error: requiredChecks[0] };
    }

    try {
      const uid = auth.currentUser.uid;
      await Promise.all([
        setDoc(
          doc(db, DTMT_COACH_COLLECTION, uid),
          {
            accountUid: uid,
            coachAttending,
            coachEventNotes,
            coachName,
            email: coachEmail,
            eventKey: DTMT_EVENT_KEY,
            schoolAffiliation: schoolName,
            status: "active",
            title,
            updatedAt: serverTimestamp(),
            ...(dtmtCoachProfile ? {} : { createdAt: serverTimestamp() }),
          },
          { merge: true },
        ),
        setDoc(
          doc(db, COACH_ACCOUNT_COLLECTION, uid),
          {
            accountType: "coach",
            accountUid: uid,
            email: coachEmail,
            name: coachName,
            school: schoolName,
            status: "active",
            updatedAt: serverTimestamp(),
            ...(coachAccountRecord ? {} : { createdAt: serverTimestamp(), source: "dtechmathclub-site" }),
          },
          { merge: true },
        ),
        setDoc(
          doc(db, DTMT_SCHOOL_COLLECTION, uid),
          {
            coachAttending,
            coachEmail,
            coachEventNotes,
            coachName,
            coachUid: uid,
            eventKey: DTMT_EVENT_KEY,
            paymentResponsibility,
            schoolKey: normalizeSchoolKey(schoolName),
            schoolName,
            status: "registered",
            teamLabels: existingTeamLabels,
            updatedAt: serverTimestamp(),
            ...(dtmtSchool ? {} : { createdAt: serverTimestamp() }),
          },
          { merge: true },
        ),
        setDoc(
          doc(db, SITE_PROFILE_COLLECTION, uid),
          {
            accountType: "coach",
            ...(siteProfile ? {} : { createdAt: serverTimestamp(), source: "dtechmathclub-site" }),
            coachAccount: true,
            dtmtCoachActive: true,
            dtmtCoachProfileCompletedAt: serverTimestamp(),
            dtmtSchoolRegistered: true,
            dtmtSchoolRegisteredAt: serverTimestamp(),
            email: coachEmail,
            name: coachName,
            school: schoolName,
            studentAccount: false,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        ),
      ]);

      await refreshProfile();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: formatFirestoreError(error, "Unable to save the DTMT coach registration right now."),
      };
    }
  }

  async function saveDtmtTeamLabels(teamLabels) {
    if (!auth.currentUser) {
      return { ok: false, error: "You need to be signed in before managing DTMT teams." };
    }

    if ((profile?.accountType || siteProfile?.accountType) !== "coach") {
      return { ok: false, error: "Only coach accounts can manage DTMT teams." };
    }

    if (!dtmtSchool?.id) {
      return { ok: false, error: "Register your DTMT school before creating teams." };
    }

    const normalizedLabels = Array.from(
      new Set(
        (Array.isArray(teamLabels) ? teamLabels : [])
          .map((item) => String(item || "").trim())
          .filter(Boolean),
      ),
    );

    if (normalizedLabels.some((item) => !hasLetter(item))) {
      return { ok: false, error: "Each DTMT team name must include letters." };
    }

    try {
      await setDoc(
        doc(db, DTMT_SCHOOL_COLLECTION, dtmtSchool.id),
        {
          teamLabels: normalizedLabels,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      await refreshProfile();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: formatFirestoreError(error, "Unable to save the DTMT team list right now."),
      };
    }
  }

  async function submitDtmtStudentRegistration(values) {
    if (!auth.currentUser) {
      return { ok: false, error: "You need to be signed in before registering for DTMT." };
    }

    if ((profile?.accountType || siteProfile?.accountType) === "coach") {
      return { ok: false, error: "Coach accounts cannot submit student DTMT registration." };
    }

    const name = values.name.trim();
    const grade = values.grade.trim();
    const requestedSchoolId = values.schoolId.trim();
    const requestedSchoolName = values.schoolName.trim();
    const registrationMode = requestedSchoolId ? "school" : "individual";
    const waiverSignerName = values.waiverSignerName.trim();
    const subjectRounds = values.subjectRounds.filter(Boolean);
    const lunchPreference = values.lunchPreference.trim();
    const dietaryNotes = values.dietaryNotes.trim();
    const email = (auth.currentUser.email || profile?.email || "").trim().toLowerCase();

    if (!name || !grade) {
      return { ok: false, error: "Fill in your name and grade before continuing." };
    }

    if (!subjectRounds.length) {
      return { ok: false, error: "Choose at least one DTMT subject round." };
    }

    if (!lunchPreference) {
      return { ok: false, error: "Select a lunch preference before continuing." };
    }

    if (!values.waiverAccepted || !waiverSignerName) {
      return { ok: false, error: "Complete the waiver section before registering for DTMT." };
    }

    const nameError = validateTextField(name, "Student name", { requireLetter: true });
    if (nameError) {
      return { ok: false, error: nameError };
    }

    const gradeError = validateTextField(grade, "Grade", { minLength: 1 });
    if (gradeError) {
      return { ok: false, error: gradeError };
    }

    const waiverNameError = validateTextField(waiverSignerName, "Waiver signer name", {
      requireLetter: true,
    });
    if (waiverNameError) {
      return { ok: false, error: waiverNameError };
    }

    try {
      const uid = auth.currentUser.uid;
      let schoolId = "independent";
      let schoolName = "Independent Entry";
      let paymentResponsibility = DTMT_PAYMENT_RESPONSIBILITY.STUDENT;

      if (registrationMode === "school") {
        const schoolSnapshot = await getDoc(doc(db, DTMT_SCHOOL_COLLECTION, requestedSchoolId));

        if (!schoolSnapshot.exists()) {
          return {
            ok: false,
            error: "Choose a currently registered school or continue as an individual.",
          };
        }

        const schoolRecord = schoolSnapshot.data() || {};

        if (schoolRecord.status !== "registered") {
          return {
            ok: false,
            error: "That school is not currently open for DTMT registration.",
          };
        }

        schoolId = requestedSchoolId;
        schoolName = String(schoolRecord.schoolName || requestedSchoolName || "").trim();
        paymentResponsibility = normalizeDtmtPaymentResponsibility(schoolRecord.paymentResponsibility);

        if (!schoolName) {
          return { ok: false, error: "Choose a registered school or continue as an individual." };
        }
      }

      const requiresDirectPayment =
        registrationMode === "individual" || !isCoachManagedDtmtPayment(paymentResponsibility);


      if (!requiresDirectPayment) {
        paymentMethod = "coach-covered";
      }

      const teamLabel =
        registrationMode === "school"
          ? dtmtStudentRegistration?.registrationMode === "individual"
            ? ""
            : dtmtStudentRegistration?.teamLabel || ""
          : buildIndependentTeamLabel(uid);

      await Promise.all([
        setDoc(
          doc(db, SITE_PROFILE_COLLECTION, uid),
          {
            accountUid: uid,
            accountType: "student",
            ...(siteProfile ? {} : { createdAt: serverTimestamp(), source: "dtechmathclub-site" }),
            coachAccount: false,
            dtmtStudentRegistered: true,
            dtmtStudentRegistrationCompletedAt: serverTimestamp(),
            email,
            grade,
            name,
            school: registrationMode === "school" ? schoolName : siteProfile?.school || "",
            studentAccount: true,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        ),
        setDoc(
          doc(db, DTMT_STUDENT_COLLECTION, uid),
          {
            accountUid: uid,
            email,
            eventKey: DTMT_EVENT_KEY,
            grade,
            lunchPreference,
            dietaryNotes,
            name,
            paymentResponsibility,
            paymentMethod,
            paymentStatus: requiresDirectPayment ? "submitted" : "coach-managed",
            registrationStatus: "registered",
            registrationMode,
            schoolId,
            schoolName,
            schoolKey: normalizeSchoolKey(schoolName),
            subjectRounds,
            teamAssignmentMode:
              registrationMode === "school" ? "coach-managed" : "independent-auto",
            teamLabel,
            updatedAt: serverTimestamp(),
            waiverAccepted: true,
            waiverSignerName,
            ...(dtmtStudentRegistration ? {} : { createdAt: serverTimestamp() }),
          },
          { merge: true },
        ),
      ]);

      await refreshProfile();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: formatFirestoreError(error, "Unable to register for DTMT right now."),
      };
    }
  }

  async function assignDtmtTeam(values) {
    if (!auth.currentUser) {
      return { ok: false, error: "You need to be signed in before assigning teams." };
    }

    if (!dtmtSchool) {
      return { ok: false, error: "Register a DTMT school before assigning teams." };
    }

    const studentUid = values.studentUid.trim();
    const schoolId = values.schoolId.trim();
    const teamLabel = values.teamLabel.trim();

    if (!studentUid || !schoolId) {
      return { ok: false, error: "The selected student record is incomplete." };
    }

    if (schoolId !== dtmtSchool.id) {
      return { ok: false, error: "You can only assign teams for students in your own school roster." };
    }

    try {
      await setDoc(
        doc(db, DTMT_STUDENT_COLLECTION, studentUid),
        {
          assignedAt: serverTimestamp(),
          assignedByCoachUid: auth.currentUser.uid,
          teamLabel,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );

      if (studentUid === auth.currentUser.uid) {
        await refreshProfile();
      }

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: formatFirestoreError(error, "Unable to save the team assignment right now."),
      };
    }
  }

  async function listDtmtSchools() {
    try {
      const snapshot = await getDocs(collection(db, DTMT_SCHOOL_COLLECTION));

      return snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .filter((item) => item.status === "registered")
        .sort((left, right) => left.schoolName.localeCompare(right.schoolName));
    } catch (_) {
      return [];
    }
  }

  async function loadDtmtRoster(schoolId = dtmtSchool?.id || auth.currentUser?.uid) {
    if (!schoolId) return [];

    try {
      const snapshot = await getDocs(
        query(collection(db, DTMT_STUDENT_COLLECTION), where("schoolId", "==", schoolId)),
      );

      return snapshot.docs
        .map((item) => ({ id: item.id, ...item.data() }))
        .sort((left, right) => left.name.localeCompare(right.name));
    } catch (_) {
      return [];
    }
  }

  async function updateSiteProfile(values) {
    if (!auth.currentUser) {
      return { ok: false, error: "You need to be signed in to update your profile." };
    }

    const name = values.name.trim();
    const school = values.school.trim();
    const grade = values.grade.trim();
    const isCoachAccount = (profile?.accountType || siteProfile?.accountType) === "coach";

    if (!name || !school || (!isCoachAccount && !grade)) {
      return {
        ok: false,
        error: isCoachAccount
          ? "Fill in your name and school before saving."
          : "Fill in your name, school, and grade before saving.",
      };
    }

    const nameError = validateTextField(name, "Name", { requireLetter: true });
    if (nameError) {
      return { ok: false, error: nameError };
    }

    const schoolError = validateTextField(
      school,
      isCoachAccount ? "School affiliation" : "School",
      { requireLetter: true },
    );
    if (schoolError) {
      return { ok: false, error: schoolError };
    }

    try {
      const uid = auth.currentUser.uid;
      const email = (auth.currentUser.email || profile?.email || "").trim().toLowerCase();
      const sharedProfile = {
        accountType: profile?.accountType || siteProfile?.accountType || "student",
        email,
        grade,
        name,
        firstName: siteProfile?.firstName || "",
        lastName: siteProfile?.lastName || "",
        school,
        updatedAt: serverTimestamp(),
      };

      const writes = [
        setDoc(
          doc(db, SITE_PROFILE_COLLECTION, uid),
          {
            ...sharedProfile,
            ...(siteProfile ? {} : { createdAt: serverTimestamp(), source: "dtechmathclub-site" }),
            ...(profile?.dpotdRegistered ? { dpotdRegistered: true } : {}),
            ...(profile?.puzzleNightRegistered ? { puzzleNightRegistered: true } : {}),
            ...(profile?.dtmtCoachActive ? { dtmtCoachActive: true } : {}),
            ...(profile?.dtmtSchoolRegistered ? { dtmtSchoolRegistered: true } : {}),
            ...(profile?.dtmtStudentRegistered ? { dtmtStudentRegistered: true } : {}),
            ...(profile?.accountType === "coach"
              ? { accountType: "coach", coachAccount: true, studentAccount: false }
              : { accountType: "student", coachAccount: false, studentAccount: true }),
          },
          { merge: true },
        ),
      ];

      if (portalProfile) {
        writes.push(
          setDoc(doc(db, PORTAL_USER_COLLECTION, uid), sharedProfile, { merge: true }),
          setDoc(
            doc(db, DPOTD_REGISTRATION_COLLECTION, uid),
            {
              ...sharedProfile,
              accountUid: uid,
              status: "registered",
            },
            { merge: true },
          ),
        );
      }

      if (puzzleNightRegistration) {
        writes.push(setDoc(doc(db, PUZZLE_NIGHT_COLLECTION, uid), sharedProfile, { merge: true }));
      }

      if (dtmtStudentRegistration) {
        writes.push(
          setDoc(
            doc(db, DTMT_STUDENT_COLLECTION, uid),
            {
              grade: sharedProfile.grade,
              name: sharedProfile.name,
              schoolName: sharedProfile.school || dtmtStudentRegistration.schoolName,
              updatedAt: serverTimestamp(),
            },
            { merge: true },
          ),
        );
      }

      if (isCoachAccount || dtmtCoachProfile) {
        writes.push(
          setDoc(
            doc(db, COACH_ACCOUNT_COLLECTION, uid),
            {
              accountType: "coach",
              accountUid: uid,
              email,
              name: sharedProfile.name,
              school: sharedProfile.school,
              status: "active",
              updatedAt: serverTimestamp(),
              ...(coachAccountRecord ? {} : { createdAt: serverTimestamp(), source: "dtechmathclub-site" }),
            },
            { merge: true },
          ),
          setDoc(
            doc(db, DTMT_COACH_COLLECTION, uid),
            {
              accountUid: uid,
              coachName: sharedProfile.name,
              email,
              eventKey: DTMT_EVENT_KEY,
              phone: dtmtCoachProfile?.phone || "",
              schoolAffiliation: sharedProfile.school,
              status: "active",
              title: dtmtCoachProfile?.title || "",
              updatedAt: serverTimestamp(),
              ...(dtmtCoachProfile ? {} : { createdAt: serverTimestamp() }),
            },
            { merge: true },
          ),
        );
      }

      await Promise.all(writes);
      await updateProfile(auth.currentUser, { displayName: name }).catch(() => null);
      await refreshProfile();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: formatFirestoreError(error, "Unable to save your profile changes right now."),
      };
    }
  }

  async function requestAccountPasswordReset(email) {
    try {
      await sendPasswordResetEmail(auth, email.trim().toLowerCase());
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: formatAuthError(error, "Unable to send a reset email right now."),
      };
    }
  }

  async function signOutAccount() {
    await signOut(auth);
  }

  return (
    <DpotdAuthContext.Provider
      value={{
        assignDtmtTeam,
        authReady,
        dtmtCoachProfile,
        dtmtSchool,
        dtmtStudentRegistration,
        hasDpotdAccess: Boolean(portalProfile),
        hasDtmtCoachAccess: (profile?.accountType || siteProfile?.accountType) === "coach",
        listDtmtSchools,
        loadDtmtRoster,
        portalProfile,
        profile,
        puzzleNightRegistration,
        refreshProfile,
        registerPuzzleNight,
        registerDtmtSchool,
        registerSiteAccount,
        requestAccountPasswordReset,
        saveDtmtCoachRegistration,
        saveDtmtTeamLabels,
        signInSiteAccount,
        signOutAccount,
        siteProfile,
        submitContactInquiry,
        submitDpotdRegistration,
        submitDtmtStudentRegistration,
        submitSponsorInquiry,
        updateSiteProfile,
        user,
        createDtmtCoachProfile,
      }}
    >
      {children}
    </DpotdAuthContext.Provider>
  );
}

export function useDpotdAuth() {
  const context = useContext(DpotdAuthContext);

  if (!context) {
    throw new Error("useDpotdAuth must be used within a DpotdAuthProvider.");
  }

  return context;
}
