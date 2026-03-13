import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
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

const SITE_PROFILE_COLLECTION = "siteProfiles";
const PORTAL_USER_COLLECTION = "users";
const DPOTD_REGISTRATION_COLLECTION = "dpotdRegistrations";
const PUZZLE_NIGHT_COLLECTION = "puzzleNightRegistrations";
const DTMT_COACH_COLLECTION = "dtmtCoachProfiles";
const DTMT_SCHOOL_COLLECTION = "dtmtSchools";
const DTMT_STUDENT_COLLECTION = "dtmtStudentRegistrations";

const PUZZLE_NIGHT_EVENT_KEY = "puzzle-night-2026";
const DTMT_EVENT_KEY = "dtmt-2026";

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

  return fallback;
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

function mergeProfiles(user, siteProfile, portalProfile, puzzleNightRegistration, dtmtCoachProfile, dtmtSchool, dtmtStudentRegistration) {
  const accountType =
    siteProfile?.accountType || (dtmtCoachProfile ? "coach" : "student");

  return {
    id: siteProfile?.id || portalProfile?.id || user?.uid || null,
    accountType,
    name:
      siteProfile?.name ||
      dtmtStudentRegistration?.name ||
      dtmtCoachProfile?.coachName ||
      portalProfile?.name ||
      user?.displayName ||
      user?.email ||
      "Member",
    email: siteProfile?.email || portalProfile?.email || user?.email || "",
    school:
      dtmtStudentRegistration?.schoolName ||
      dtmtSchool?.schoolName ||
      siteProfile?.school ||
      portalProfile?.school ||
      "",
    grade: dtmtStudentRegistration?.grade || siteProfile?.grade || portalProfile?.grade || "",
    dpotdRegistered: Boolean(siteProfile?.dpotdRegistered || portalProfile),
    dpotdRegistrationCompletedAt:
      siteProfile?.dpotdRegistrationCompletedAt || portalProfile?.dpotdRegisteredAt || null,
    puzzleNightRegistered: Boolean(puzzleNightRegistration),
    dtmtCoachActive: Boolean(dtmtCoachProfile),
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
  const [portalProfile, setPortalProfile] = useState(null);
  const [puzzleNightRegistration, setPuzzleNightRegistration] = useState(null);
  const [dtmtCoachProfile, setDtmtCoachProfile] = useState(null);
  const [dtmtSchool, setDtmtSchool] = useState(null);
  const [dtmtStudentRegistration, setDtmtStudentRegistration] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  async function refreshProfile(nextUser = auth.currentUser) {
    if (!nextUser) {
      setUser(null);
      setSiteProfile(null);
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
      nextPortalProfile,
      nextPuzzleNightRegistration,
      nextDtmtCoachProfile,
      nextDtmtSchool,
      nextDtmtStudentRegistration,
    ] = await Promise.all([
      loadSiteProfile(nextUser),
      loadPortalProfile(nextUser),
      loadPuzzleNightRegistration(nextUser),
      loadDtmtCoachProfile(nextUser),
      loadDtmtSchool(nextUser),
      loadDtmtStudentRegistration(nextUser),
    ]);

    const mergedProfile = mergeProfiles(
      nextUser,
      nextSiteProfile,
      nextPortalProfile,
      nextPuzzleNightRegistration,
      nextDtmtCoachProfile,
      nextDtmtSchool,
      nextDtmtStudentRegistration,
    );

    setUser(nextUser);
    setSiteProfile(nextSiteProfile);
    setPortalProfile(nextPortalProfile);
    setPuzzleNightRegistration(nextPuzzleNightRegistration);
    setDtmtCoachProfile(nextDtmtCoachProfile);
    setDtmtSchool(nextDtmtSchool);
    setDtmtStudentRegistration(nextDtmtStudentRegistration);
    setProfile(mergedProfile);

    return {
      siteProfile: nextSiteProfile,
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
      if (!nextUser) {
        setUser(null);
        setSiteProfile(null);
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
        const fallbackProfile = mergeProfiles(nextUser, null, null, null, null, null, null);
        setUser(nextUser);
        setSiteProfile(null);
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

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, SITE_PROFILE_COLLECTION, credential.user.uid), {
        accountType,
        coachAccount: accountType === "coach",
        studentAccount: accountType === "student",
        name,
        email,
        school,
        grade,
        dpotdRegistered: false,
        dtmtCoachActive: false,
        dtmtSchoolRegistered: false,
        dtmtStudentRegistered: false,
        puzzleNightRegistered: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        source: "dtechmathclub-site",
      });

      await refreshProfile(credential.user);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: formatAuthError(error, "Unable to create your account right now."),
      };
    }
  }

  async function submitDpotdRegistration(values) {
    if (!auth.currentUser) {
      return { ok: false, error: "You need to be signed in before registering for D.PotD." };
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

    const name = values.name.trim();
    const email = values.email.trim().toLowerCase();
    const school = values.school.trim();
    const grade = values.grade.trim();
    const parentName = values.parentName.trim();
    const parentEmail = values.parentEmail.trim().toLowerCase();
    const notes = values.notes.trim();
    const accountUid = auth.currentUser.uid;

    if (!name || !email || !school || !grade || !parentName || !parentEmail) {
      return {
        ok: false,
        error: "Fill in every required Puzzle Night detail before continuing.",
      };
    }

    try {
      const payload = {
        accountUid,
        email,
        eventKey: PUZZLE_NIGHT_EVENT_KEY,
        grade,
        name,
        notes,
        parentEmail,
        parentName,
        registrationSource: "signed-in-account",
        school,
        status: "registered",
        submittedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await Promise.all([
        setDoc(doc(db, PUZZLE_NIGHT_COLLECTION, accountUid), payload, { merge: true }),
        setDoc(
          doc(db, SITE_PROFILE_COLLECTION, accountUid),
          {
            ...(siteProfile ? {} : { createdAt: serverTimestamp(), source: "dtechmathclub-site" }),
            name,
            email: (auth.currentUser.email || email).trim().toLowerCase(),
            school,
            grade,
            puzzleNightRegistered: true,
            puzzleNightRegisteredAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        ),
      ]);

      await refreshProfile();
      return { ok: true };
    } catch (_) {
      return { ok: false, error: "Unable to submit Puzzle Night registration right now." };
    }
  }

  async function createDtmtCoachProfile(values) {
    if (!auth.currentUser) {
      return { ok: false, error: "You need to be signed in before creating a coach profile." };
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

    if (!dtmtCoachProfile) {
      return { ok: false, error: "Create the coach profile first before registering a school." };
    }

    const schoolName = values.schoolName.trim();
    const shortName = values.shortName.trim();
    const city = values.city.trim();
    const state = values.state.trim();
    const maxStudents = values.maxStudents.trim();

    if (!schoolName || !shortName || !city || !state || !maxStudents) {
      return {
        ok: false,
        error: "Fill in every school registration detail before continuing.",
      };
    }

    try {
      const uid = auth.currentUser.uid;
      await Promise.all([
        setDoc(
          doc(db, DTMT_SCHOOL_COLLECTION, uid),
          {
            city,
            coachEmail: dtmtCoachProfile.email,
            coachName: dtmtCoachProfile.coachName,
            coachUid: uid,
            eventKey: DTMT_EVENT_KEY,
            maxStudents,
            schoolName,
            shortName,
            state,
            status: "registered",
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
    } catch (_) {
      return { ok: false, error: "Unable to register the DTMT school right now." };
    }
  }

  async function submitDtmtStudentRegistration(values) {
    if (!auth.currentUser) {
      return { ok: false, error: "You need to be signed in before registering for DTMT." };
    }

    const name = values.name.trim();
    const grade = values.grade.trim();
    const schoolId = values.schoolId.trim();
    const schoolName = values.schoolName.trim();
    const waiverSignerName = values.waiverSignerName.trim();
    const subjectRounds = values.subjectRounds.filter(Boolean);
    const paymentMethod = values.paymentMethod.trim();
    const email = (auth.currentUser.email || profile?.email || "").trim().toLowerCase();

    if (!name || !grade || !schoolId || !schoolName) {
      return { ok: false, error: "Fill in your name, grade, and school before continuing." };
    }

    if (!subjectRounds.length) {
      return { ok: false, error: "Choose at least one DTMT subject round." };
    }

    if (!values.waiverAccepted || !waiverSignerName) {
      return { ok: false, error: "Complete the waiver section before registering for DTMT." };
    }

    if (!values.paymentAcknowledged || !paymentMethod) {
      return { ok: false, error: "Complete the payment section before registering for DTMT." };
    }

    try {
      const uid = auth.currentUser.uid;
      await Promise.all([
        setDoc(
          doc(db, SITE_PROFILE_COLLECTION, uid),
          {
            accountType: "student",
            ...(siteProfile ? {} : { createdAt: serverTimestamp(), source: "dtechmathclub-site" }),
            coachAccount: false,
            dtmtStudentRegistered: true,
            dtmtStudentRegistrationCompletedAt: serverTimestamp(),
            email,
            grade,
            name,
            school: schoolName,
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
            name,
            paymentMethod,
            paymentStatus: "submitted",
            registrationStatus: "registered",
            schoolId,
            schoolName,
            subjectRounds,
            teamLabel: dtmtStudentRegistration?.teamLabel || "",
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
    } catch (_) {
      return { ok: false, error: "Unable to register for DTMT right now." };
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
    } catch (_) {
      return { ok: false, error: "Unable to save the team assignment right now." };
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

    try {
      const uid = auth.currentUser.uid;
      const email = (auth.currentUser.email || profile?.email || "").trim().toLowerCase();
      const sharedProfile = {
        accountType: profile?.accountType || siteProfile?.accountType || "student",
        email,
        grade,
        name,
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

      await Promise.all(writes);
      await refreshProfile();
      return { ok: true };
    } catch (_) {
      return { ok: false, error: "Unable to save your profile changes right now." };
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
        hasDtmtCoachAccess: Boolean(dtmtCoachProfile),
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
        signInSiteAccount,
        signOutAccount,
        siteProfile,
        submitDpotdRegistration,
        submitDtmtStudentRegistration,
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
