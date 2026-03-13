import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SurfaceCard from "./SurfaceCard";
import { useDpotdAuth } from "../context/DpotdAuthContext";

const initialLogin = {
  email: "",
  password: "",
};

const initialRegister = {
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
  redirectTo = "/profile",
  signedInCopy = "This browser already has an active Design Tech Math Club account session.",
}) {
  const navigate = useNavigate();
  const {
    authReady,
    hasDpotdAccess,
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
      registerForm.password,
      registerForm.confirmPassword,
    ].map((value) => value.trim());

    if (requiredValues.some((value) => !value)) {
      setError("Fill in the required account fields before continuing.");
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
      <SurfaceCard className="p-8 text-center">
        <p className="text-sm font-semibold text-txt-muted">Checking your site profile session...</p>
      </SurfaceCard>
    );
  }

  if (user) {
    return (
      <SurfaceCard className="p-8">
        <h2 className="text-3xl font-black text-txt">{profile?.name || user.email}</h2>
        <p className="mt-2 text-sm text-txt-muted">{profile?.email || user.email}</p>
        <p className="mt-4 leading-relaxed text-txt-muted">{signedInCopy}</p>
        <p className="mt-3 text-sm text-txt-muted">
          D.PotD access: {hasDpotdAccess ? "active" : "not activated yet"}
        </p>
        <button
          className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:bg-brand-light"
          onClick={() => navigate(redirectTo)}
          type="button"
        >
          Continue
        </button>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="p-8">
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
            type="email"
            value={loginForm.email}
          />
          <Field
            label="Password"
            name="password"
            onChange={handleLoginChange}
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
            This account is the shared website login. School and grade can be added now or later
            when a competition workflow needs them.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="First Name"
              name="firstName"
              onChange={handleRegisterChange}
              value={registerForm.firstName}
            />
            <Field
              label="Last Name"
              name="lastName"
              onChange={handleRegisterChange}
              value={registerForm.lastName}
            />
            <Field
              label="Email"
              name="email"
              onChange={handleRegisterChange}
              type="email"
              value={registerForm.email}
            />
            <Field
              label="School (Optional)"
              name="school"
              onChange={handleRegisterChange}
              value={registerForm.school}
            />
            <Field
              label="Grade (Optional)"
              name="grade"
              onChange={handleRegisterChange}
              placeholder="Student grade if applicable"
              value={registerForm.grade}
            />
            <Field
              label="Password"
              name="password"
              onChange={handleRegisterChange}
              type="password"
              value={registerForm.password}
            />
            <div className="sm:col-span-2">
              <Field
                label="Confirm Password"
                name="confirmPassword"
                onChange={handleRegisterChange}
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
    </SurfaceCard>
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
