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

const DpotdAuthContext = createContext(null);

function formatAuthError(error, fallback) {
  const code = error?.code ?? "";

  if (code.includes("email-already-in-use")) {
    return "That email already has a portal account.";
  }
  if (code.includes("invalid-email")) {
    return "Enter a valid email address.";
  }
  if (code.includes("weak-password")) {
    return "Use a stronger password with at least 6 characters.";
  }
  if (code.includes("user-not-found") || code.includes("wrong-password") || code.includes("invalid-credential")) {
    return "Unable to sign in with that email and password.";
  }
  if (code.includes("too-many-requests")) {
    return "Too many attempts. Wait a moment and try again.";
  }

  return fallback;
}

async function loadUserProfile(user) {
  if (!user) return null;

  const directDoc = await getDoc(doc(db, "users", user.uid));
  if (directDoc.exists()) {
    return { id: directDoc.id, ...directDoc.data() };
  }

  const email = (user.email || "").trim().toLowerCase();
  if (!email) return null;

  const emailMatch = await getDocs(
    query(collection(db, "users"), where("email", "==", email), limit(1)),
  );
  if (!emailMatch.empty) {
    const doc = emailMatch.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  return null;
}

export function DpotdAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (nextUser) => {
      if (!nextUser) {
        setUser(null);
        setProfile(null);
        setAuthReady(true);
        return;
      }

      setUser(nextUser);

      try {
        const nextProfile = await loadUserProfile(nextUser);
        setProfile(
          nextProfile ?? {
            name: nextUser.displayName || nextUser.email || "Portal User",
            email: nextUser.email || "",
          },
        );
      } catch (_) {
        setProfile({
          name: nextUser.displayName || nextUser.email || "Portal User",
          email: nextUser.email || "",
        });
      } finally {
        setAuthReady(true);
      }
    });

    return unsubscribe;
  }, []);

  async function refreshProfile() {
    if (!auth.currentUser) return null;
    const nextProfile = await loadUserProfile(auth.currentUser);
    setProfile(
      nextProfile ?? {
        name: auth.currentUser.displayName || auth.currentUser.email || "Portal User",
        email: auth.currentUser.email || "",
      },
    );
    return nextProfile;
  }

  async function signInPortalAccount(email, password) {
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

  async function registerPortalAccount(values) {
    const firstName = values.firstName.trim();
    const lastName = values.lastName.trim();
    const email = values.email.trim().toLowerCase();
    const school = values.school.trim();
    const grade = values.grade.trim();
    const password = values.password;
    const name = [firstName, lastName].filter(Boolean).join(" ").trim();

    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", credential.user.uid), {
        name,
        email,
        school,
        grade,
        isAdmin: false,
        isGrader: false,
        createdAt: serverTimestamp(),
        source: "dtechmathclub-site",
      });
      await refreshProfile();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        error: formatAuthError(error, "Unable to create your portal account."),
      };
    }
  }

  async function updatePortalProfile(values) {
    if (!auth.currentUser) {
      return { ok: false, error: "You need to be signed in to update your profile." };
    }

    try {
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          name: values.name.trim(),
          email: (auth.currentUser.email || profile?.email || "").trim().toLowerCase(),
          school: values.school.trim(),
          grade: values.grade.trim(),
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
      await refreshProfile();
      return { ok: true };
    } catch (_) {
      return { ok: false, error: "Unable to save your profile changes right now." };
    }
  }

  async function requestPortalPasswordReset(email) {
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

  async function signOutPortalAccount() {
    await signOut(auth);
  }

  return (
    <DpotdAuthContext.Provider
      value={{
        authReady,
        profile,
        refreshProfile,
        registerPortalAccount,
        requestPortalPasswordReset,
        signInPortalAccount,
        signOutPortalAccount,
        updatePortalProfile,
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
