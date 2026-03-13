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

async function loadPortalProfile(user) {
  if (!user) return null;

  const directDoc = await getDoc(doc(db, PORTAL_USER_COLLECTION, user.uid));
  if (directDoc.exists()) {
    return { id: directDoc.id, ...directDoc.data() };
  }

  const email = (user.email || "").trim().toLowerCase();
  if (!email) return null;

  const emailMatch = await getDocs(
    query(collection(db, PORTAL_USER_COLLECTION), where("email", "==", email), limit(1)),
  );

  if (!emailMatch.empty) {
    const item = emailMatch.docs[0];
    return { id: item.id, ...item.data() };
  }

  return null;
}

async function loadSiteProfile(user) {
  if (!user) return null;

  const directDoc = await getDoc(doc(db, SITE_PROFILE_COLLECTION, user.uid));
  if (directDoc.exists()) {
    return { id: directDoc.id, ...directDoc.data() };
  }

  const email = (user.email || "").trim().toLowerCase();
  if (!email) return null;

  const emailMatch = await getDocs(
    query(collection(db, SITE_PROFILE_COLLECTION), where("email", "==", email), limit(1)),
  );

  if (!emailMatch.empty) {
    const item = emailMatch.docs[0];
    return { id: item.id, ...item.data() };
  }

  return null;
}

function mergeProfiles(user, siteProfile, portalProfile) {
  return {
    id: siteProfile?.id || portalProfile?.id || user?.uid || null,
    name:
      siteProfile?.name ||
      portalProfile?.name ||
      user?.displayName ||
      user?.email ||
      "Student",
    email:
      siteProfile?.email ||
      portalProfile?.email ||
      user?.email ||
      "",
    school: siteProfile?.school || portalProfile?.school || "",
    grade: siteProfile?.grade || portalProfile?.grade || "",
    dpotdRegistered: Boolean(siteProfile?.dpotdRegistered || portalProfile),
    dpotdRegistrationCompletedAt:
      siteProfile?.dpotdRegistrationCompletedAt || portalProfile?.dpotdRegisteredAt || null,
    isAdmin: Boolean(portalProfile?.isAdmin),
    isGrader: Boolean(portalProfile?.isGrader),
  };
}

export function DpotdAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [siteProfile, setSiteProfile] = useState(null);
  const [portalProfile, setPortalProfile] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  async function refreshProfile(nextUser = auth.currentUser) {
    if (!nextUser) {
      setUser(null);
      setSiteProfile(null);
      setPortalProfile(null);
      setProfile(null);
      return null;
    }

    const [nextSiteProfile, nextPortalProfile] = await Promise.all([
      loadSiteProfile(nextUser),
      loadPortalProfile(nextUser),
    ]);

    const mergedProfile = mergeProfiles(nextUser, nextSiteProfile, nextPortalProfile);

    setUser(nextUser);
    setSiteProfile(nextSiteProfile);
    setPortalProfile(nextPortalProfile);
    setProfile(mergedProfile);

    return {
      siteProfile: nextSiteProfile,
      portalProfile: nextPortalProfile,
      profile: mergedProfile,
    };
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) {
        setUser(null);
        setSiteProfile(null);
        setPortalProfile(null);
        setProfile(null);
        setAuthReady(true);
        return;
      }

      try {
        await refreshProfile(nextUser);
      } catch (_) {
        const fallbackProfile = mergeProfiles(nextUser, null, null);
        setUser(nextUser);
        setSiteProfile(null);
        setPortalProfile(null);
        setProfile(fallbackProfile);
      } finally {
        setAuthReady(true);
      }
    });

    return unsubscribe;
  }, []);

  async function signInSiteAccount(email, password) {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: formatAuthError(error, "Unable to sign in right now."),
      };
    }
  }

  async function registerSiteAccount(values) {
    const firstName = values.firstName.trim();
    const lastName = values.lastName.trim();
    const email = values.email.trim().toLowerCase();
    const school = values.school.trim();
    const grade = values.grade.trim();
    const password = values.password;
    const name = [firstName, lastName].filter(Boolean).join(" ").trim();

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, SITE_PROFILE_COLLECTION, credential.user.uid), {
        name,
        email,
        school,
        grade,
        dpotdRegistered: false,
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

  async function updateSiteProfile(values) {
    if (!auth.currentUser) {
      return { ok: false, error: "You need to be signed in to update your profile." };
    }

    try {
      const uid = auth.currentUser.uid;
      const email = (auth.currentUser.email || profile?.email || "").trim().toLowerCase();
      const sharedProfile = {
        name: values.name.trim(),
        email,
        school: values.school.trim(),
        grade: values.grade.trim(),
        updatedAt: serverTimestamp(),
      };

      const writes = [
        setDoc(
          doc(db, SITE_PROFILE_COLLECTION, uid),
          {
            ...sharedProfile,
            ...(siteProfile ? {} : { createdAt: serverTimestamp(), source: "dtechmathclub-site" }),
            ...(profile?.dpotdRegistered ? { dpotdRegistered: true } : {}),
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
        authReady,
        hasDpotdAccess: Boolean(portalProfile),
        portalProfile,
        profile,
        refreshProfile,
        registerSiteAccount,
        requestAccountPasswordReset,
        signInSiteAccount,
        signOutAccount,
        siteProfile,
        submitDpotdRegistration,
        updateSiteProfile,
        user,
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
