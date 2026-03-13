import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SurfaceCard from "./SurfaceCard";
import { useDpotdAuth } from "../context/DpotdAuthContext";

const initialLogin = {
  email: "",
  password: "",
};

const initialRegister = {
  accountType: "student",
  firstName: "",
  lastName: "",
  email: "",
  school: "",
  grade: "",
  password: "",
  confirmPassword: "",
};

export default function ProfileAuthPanel({
  defaultMode = "signin",
  embedded = false,
  hideWhenSignedIn = false,
  redirectTo = "/profile",
  signedInCopy = "This browser already has an active Design Tech Math Club account session.",
}) {
  const navigate = useNavigate();
  const {
    authReady,
    profile,
    refreshProfile,
    registerSiteAccount,
    requestAccountPasswordReset,
    signInSiteAccount,
    user,
  } = useDpotdAuth();
  const [mode, setMode] = useState(defaultMode);
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const registerType = registerForm.accountType === "coach" ? "coach" : "student";

  function handleLoginChange(event) {
    const { name, value } = event.target;
    setLoginForm((current) => ({ ...current, [name]: value }));
    setError("");
    setMessage("");
  }

  function handleRegisterChange(event) {
    const { name, value } = event.target;
    setRegisterForm((current) => ({ ...current, [name]: value }));
    setError("");
    setMessage("");
  }

  async function submitLogin(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    const result = await signInSiteAccount(loginForm.email, loginForm.password);
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    await refreshProfile().catch(() => null);
    navigate(redirectTo);
  }

  async function submitRegister(event) {
    event.preventDefault();

    const requiredValues = [
      registerForm.firstName,
      registerForm.lastName,
      registerForm.email,
      registerForm.school,
      registerForm.password,
      registerForm.confirmPassword,
    ].map((value) => value.trim());

    if (requiredValues.some((value) => !value)) {
      setError("Fill in every account field before continuing.");
      return;
    }

    if (registerType === "student" && !registerForm.grade.trim()) {
      setError("Enter your grade before continuing.");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    const result = await registerSiteAccount(registerForm);
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    navigate(redirectTo);
  }

  async function sendReset() {
    if (!loginForm.email.trim()) {
      setError("Enter your email first so the reset link has somewhere to go.");
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    const result = await requestAccountPasswordReset(loginForm.email);
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setMessage("Password reset email sent.");
  }

  if (!authReady) {
    return (
      <PanelShell className="p-8 text-center" embedded={embedded}>
        <p className="text-sm font-semibold text-txt-muted">Checking your site profile session...</p>
      </PanelShell>
    );
  }

  if (user) {
    if (hideWhenSignedIn) {
      return null;
    }

    return (
      <PanelShell className="p-8" embedded={embedded}>
        <h2 className="text-3xl font-black text-txt">{profile?.name || "Member"}</h2>
        <p className="mt-2 text-sm text-txt-muted">{profile?.email || user.email}</p>
        <p className="mt-4 leading-relaxed text-txt-muted">{signedInCopy}</p>
        <p className="mt-3 text-sm text-txt-muted">
          Account type: {profile?.accountType === "coach" ? "coach" : "student"}
        </p>
        <button
          className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light"
          onClick={() => navigate(redirectTo)}
          type="button"
        >
          Continue
        </button>
      </PanelShell>
    );
  }

  return (
    <PanelShell className="p-8" embedded={embedded}>
      <div className="grid grid-cols-2 gap-2 rounded-full bg-[#efe6dd] p-1">
        {[
          ["signin", "Sign In"],
          ["register", "Create Account"],
        ].map(([value, label]) => (
          <button
            key={value}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
              mode === value ? "bg-brand text-white shadow-md shadow-brand-glow" : "text-txt-muted"
            }`}
            onClick={() => {
              setMode(value);
              setError("");
              setMessage("");
            }}
            type="button"
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "signin" ? (
        <form className="mt-6 grid gap-4" onSubmit={submitLogin} noValidate>
          <Field
            label="Email"
            name="email"
            onChange={handleLoginChange}
            required
            type="email"
            value={loginForm.email}
          />
          <Field
            label="Password"
            name="password"
            onChange={handleLoginChange}
            required
            type="password"
            value={loginForm.password}
          />
          <div className="flex flex-wrap gap-3">
            <button
              className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busy}
              type="submit"
            >
              {busy ? "Signing In..." : "Sign In"}
            </button>
            <button
              className="inline-flex rounded-full border border-brand px-6 py-3 text-sm font-bold text-brand transition-all duration-200 hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              disabled={busy}
              onClick={sendReset}
              type="button"
            >
              Reset Password
            </button>
          </div>
        </form>
      ) : (
        <form className="mt-6 grid gap-4" onSubmit={submitRegister} noValidate>
          <p className="text-sm leading-relaxed text-txt-muted">
            This account is the shared website login. Choose whether you are signing up as a
            student or a coach, and the profile will start with the right role.
          </p>
          <div className="grid gap-2">
            <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
              Signup Type
            </span>
            <div className="grid grid-cols-2 gap-2 rounded-full bg-[#efe6dd] p-1">
              {[
                ["student", "Student Signup"],
                ["coach", "Coach Signup"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
                    registerType === value ? "bg-brand text-white shadow-md shadow-brand-glow" : "text-txt-muted"
                  }`}
                  onClick={() =>
                    setRegisterForm((current) => ({
                      ...current,
                      accountType: value,
                      grade: value === "coach" ? "" : current.grade,
                    }))
                  }
                  type="button"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="First Name"
              name="firstName"
              onChange={handleRegisterChange}
              required
              value={registerForm.firstName}
            />
            <Field
              label="Last Name"
              name="lastName"
              onChange={handleRegisterChange}
              required
              value={registerForm.lastName}
            />
            <Field
              label="Email"
              name="email"
              onChange={handleRegisterChange}
              required
              type="email"
              value={registerForm.email}
            />
            <Field
              label={registerType === "coach" ? "School Affiliation" : "School"}
              name="school"
              onChange={handleRegisterChange}
              required
              value={registerForm.school}
            />
            {registerType === "student" ? (
              <Field
                label="Grade"
                name="grade"
                onChange={handleRegisterChange}
                placeholder="Student grade"
                required
                value={registerForm.grade}
              />
            ) : (
              <div className="grid gap-2">
                <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">
                  Coach Access
                </span>
                <p className="border-t border-border-subtle pt-3 text-sm leading-relaxed text-txt-muted">
                  Coach accounts can later create the DTMT coach profile, register a school, and
                  manage rosters.
                </p>
              </div>
            )}
            <Field
              label="Password"
              name="password"
              onChange={handleRegisterChange}
              required
              type="password"
              value={registerForm.password}
            />
            <div className="sm:col-span-2">
              <Field
                label="Confirm Password"
                name="confirmPassword"
                onChange={handleRegisterChange}
                required
                type="password"
                value={registerForm.confirmPassword}
              />
            </div>
          </div>
          <button
            className="inline-flex w-fit rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light disabled:cursor-not-allowed disabled:opacity-60"
            disabled={busy}
            type="submit"
          >
            {busy ? "Creating Account..." : "Create Account"}
          </button>
        </form>
      )}

      {error ? <p className="mt-4 text-sm font-semibold text-red-500">{error}</p> : null}
      {message ? <p className="mt-4 text-sm font-semibold text-emerald-500">{message}</p> : null}
    </PanelShell>
  );
}

function PanelShell({ embedded, className, children }) {
  if (embedded) {
    return <div className={className}>{children}</div>;
  }

  return <SurfaceCard className={className}>{children}</SurfaceCard>;
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
