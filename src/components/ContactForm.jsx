import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDpotdAuth } from "../context/DpotdAuthContext";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  organization: "",
  position: "",
  subject: "",
  message: "",
};

const requiredFields = ["firstName", "lastName", "email", "organization", "subject", "message"];

export default function ContactForm() {
  const { submitContactInquiry } = useDpotdAuth();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ error: "", success: "" });
  const [submitting, setSubmitting] = useState(false);

  function validate(values) {
    const next = {};
    requiredFields.forEach((f) => {
      if (!values[f].trim()) next[f] = "This field is required.";
    });
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      next.email = "Please enter a valid email address.";
    }
    return next;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((c) => ({ ...c, [name]: value }));
    setErrors((c) => ({ ...c, [name]: "" }));
    setStatus({ error: "", success: "" });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const next = validate(form);
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    setSubmitting(true);
    const result = await submitContactInquiry(form);
    setSubmitting(false);

    if (!result.ok) {
      setStatus({ error: result.error, success: "" });
      return;
    }

    setForm(initialState);
    setErrors({});
    setStatus({ error: "", success: "Thanks! Your message has been recorded." });
  }

  const inputClass =
    "w-full rounded-2xl border border-border-accent bg-white/84 px-4 py-3 text-txt placeholder:text-txt-dim shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] focus:outline-none focus:ring-2 focus:ring-brand/35 focus:border-brand transition-all duration-200";

  return (
    <form className="grid gap-5" onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="First name *" name="firstName" value={form.firstName} error={errors.firstName} onChange={handleChange} inputClass={inputClass} />
        <Field label="Last name *" name="lastName" value={form.lastName} error={errors.lastName} onChange={handleChange} inputClass={inputClass} />
        <Field label="Email *" name="email" type="email" value={form.email} error={errors.email} onChange={handleChange} inputClass={inputClass} />
        <Field label="School / Organization *" name="organization" value={form.organization} error={errors.organization} onChange={handleChange} inputClass={inputClass} />
        <Field label="Position" name="position" value={form.position} error={errors.position} onChange={handleChange} inputClass={inputClass} />
        <Field label="Subject *" name="subject" value={form.subject} error={errors.subject} onChange={handleChange} inputClass={inputClass} />
      </div>

      <label className="grid gap-1.5">
        <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">Message *</span>
        <textarea
          name="message"
          rows="5"
          className={inputClass}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us how you'd like to connect with the club."
        />
        {errors.message && <small className="text-red-400 text-xs">{errors.message}</small>}
      </label>

      <div className="flex items-center gap-4 flex-wrap">
        <motion.button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 rounded-full bg-brand text-white font-bold hover:bg-brand-light hover:shadow-lg hover:shadow-brand-glow transition-all duration-200 cursor-pointer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {submitting ? "Submitting..." : "Submit"}
        </motion.button>
        <AnimatePresence>
          {status.success ? (
            <motion.p
              className="text-sm font-semibold text-emerald-600"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
            >
              ✓ {status.success}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>
      {status.error ? <p className="text-sm font-semibold text-red-500">{status.error}</p> : null}
    </form>
  );
}

function Field({ label, error, inputClass, ...props }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold uppercase tracking-[0.14em] text-brand">{label}</span>
      <input className={inputClass} {...props} />
      {error && <small className="text-red-400 text-xs">{error}</small>}
    </label>
  );
}
