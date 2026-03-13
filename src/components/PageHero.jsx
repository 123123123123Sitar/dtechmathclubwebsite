import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import SectionHeader from "./SectionHeader";

export default function PageHero({
  actions = [],
  align = "left",
  aside = null,
  description,
  eyebrow,
  highlights = [],
  prepend = null,
  title,
  titleClassName = "",
}) {
  const centered = align === "center" && !aside;
  const hasGrid = Boolean(aside);

  return (
    <section className="relative overflow-hidden pt-28 pb-18">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,109,74,0.22),transparent_28%),radial-gradient(circle_at_top_left,rgba(45,121,183,0.12),transparent_24%),linear-gradient(145deg,#f7f0e8_0%,#f3ece6_42%,#faf6f2_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.22)_0%,transparent_32%,rgba(255,255,255,0.18)_52%,transparent_72%)] opacity-60" />
      <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-white/55 blur-[120px]" />

      <div className="relative z-10 mx-auto w-[min(calc(100%-2rem),1180px)]">
        <div
          className={`relative overflow-hidden rounded-[38px] border border-[rgba(234,109,74,0.16)] bg-[linear-gradient(155deg,rgba(255,255,255,0.86),rgba(255,248,242,0.72))] p-7 shadow-[0_34px_90px_-48px_rgba(49,30,17,0.42)] ring-1 ring-white/40 backdrop-blur-xl before:pointer-events-none before:absolute before:-right-14 before:top-[-72px] before:h-56 before:w-56 before:rounded-full before:bg-brand/12 before:blur-3xl after:pointer-events-none after:absolute after:-left-10 after:bottom-[-88px] after:h-48 after:w-48 after:rounded-full after:bg-[#2d79b7]/10 after:blur-3xl md:p-10 ${
            hasGrid ? "grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center" : ""
          }`}
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-brand/70 to-transparent" />
          <motion.div
            className={centered ? "mx-auto max-w-4xl text-center" : ""}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            {prepend}
            <SectionHeader
              align={centered ? "center" : "left"}
              description={description}
              eyebrow={eyebrow}
              title={title}
              titleClassName={`w-full max-w-none text-left ${titleClassName}`}
            />
            {actions.length ? (
              <div className={`mt-6 flex flex-wrap gap-3 ${centered ? "justify-center" : ""}`}>
                {actions.map((action) =>
                  action.href ? (
                    <a
                      key={action.label}
                      className={buttonClass(action.variant)}
                      href={action.href}
                      rel={action.href.startsWith("http") ? "noreferrer" : undefined}
                      target={action.href.startsWith("http") ? "_blank" : undefined}
                    >
                      {action.label}
                    </a>
                  ) : (
                    <Link key={action.label} className={buttonClass(action.variant)} to={action.to}>
                      {action.label}
                    </Link>
                  ),
                )}
              </div>
            ) : null}
          </motion.div>

          {aside ? (
            <motion.div
              className="border-t border-border-subtle pt-6 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
            >
              {aside}
            </motion.div>
          ) : null}
        </div>

        {highlights.length ? (
          <motion.div
            className={`mt-5 grid gap-3 ${highlights.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
          >
            {highlights.map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-[rgba(234,109,74,0.12)] bg-[linear-gradient(160deg,rgba(255,255,255,0.84),rgba(255,248,242,0.76))] px-5 py-4 text-center text-sm font-extrabold tracking-[0.08em] text-brand shadow-[0_18px_50px_-40px_rgba(49,30,17,0.35)] ring-1 ring-white/45"
              >
                {item}
              </div>
            ))}
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}

function buttonClass(variant = "solid") {
  if (variant === "ghost") {
    return "inline-flex items-center rounded-full border border-brand/80 bg-white/50 px-6 py-3 text-sm font-bold text-brand shadow-[0_16px_38px_-28px_rgba(49,30,17,0.4)] transition-all duration-200 hover:bg-brand hover:text-white";
  }

  return "inline-flex items-center rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-[0_20px_44px_-28px_rgba(234,109,74,0.62)] transition-all duration-200 hover:bg-brand-light hover:shadow-lg hover:shadow-brand-glow";
}
