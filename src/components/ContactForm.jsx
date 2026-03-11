import { useState } from "react";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  organization: "",
  position: "",
  subject: "",
  message: "",
};

const requiredFields = [
  "firstName",
  "lastName",
  "email",
  "organization",
  "subject",
  "message",
];

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validate(values) {
    const nextErrors = {};

    requiredFields.forEach((field) => {
      if (!values[field].trim()) {
        nextErrors[field] = "This field is required.";
      }
    });

    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    return nextErrors;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setSubmitted(false);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validate(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    console.log("Contact form submitted", form);
    setForm(initialState);
    setErrors({});
    setSubmitted(true);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <FormField
          label="First name *"
          name="firstName"
          value={form.firstName}
          error={errors.firstName}
          onChange={handleChange}
        />
        <FormField
          label="Last name *"
          name="lastName"
          value={form.lastName}
          error={errors.lastName}
          onChange={handleChange}
        />
        <FormField
          label="Email *"
          name="email"
          type="email"
          value={form.email}
          error={errors.email}
          onChange={handleChange}
        />
        <FormField
          label="School/Organization Name *"
          name="organization"
          value={form.organization}
          error={errors.organization}
          onChange={handleChange}
        />
        <FormField
          label="Position"
          name="position"
          value={form.position}
          error={errors.position}
          onChange={handleChange}
        />
        <FormField
          label="Subject *"
          name="subject"
          value={form.subject}
          error={errors.subject}
          onChange={handleChange}
        />
      </div>

      <label className="form-field">
        <span>Write a message *</span>
        <textarea
          name="message"
          rows="6"
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us how you'd like to connect with the club."
        />
        {errors.message ? <small>{errors.message}</small> : null}
      </label>

      <div className="form-actions">
        <button type="submit" className="button">
          Submit
        </button>
        {submitted ? (
          <p className="form-success">Thanks. Your message has been recorded locally.</p>
        ) : null}
      </div>
    </form>
  );
}

function FormField({ label, error, ...props }) {
  return (
    <label className="form-field">
      <span>{label}</span>
      <input {...props} />
      {error ? <small>{error}</small> : null}
    </label>
  );
}
