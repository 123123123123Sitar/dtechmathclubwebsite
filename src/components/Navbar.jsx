import { useState } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/puzzle-night", label: "Puzzle Night" },
  { to: "/dpotd", label: "d.PotD" },
  { to: "/dtmt", label: "DTMT" },
  { to: "/about-our-team", label: "About" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur-xl bg-surface-glass border-b border-brand">
      <div className="w-[min(calc(100%-2rem),1180px)] mx-auto flex items-center justify-between gap-4 min-h-[72px]">
        {/* Brand */}
        <NavLink
          className="flex items-center gap-3 group"
          to="/"
          onClick={() => setOpen(false)}
        >
          <img
            className="w-11 h-11 rounded-xl object-cover shrink-0 transition-all duration-200"
            src="/dtechmathclublogo.avif"
            alt="Design Tech Math Club logo"
          />
          <div className="hidden sm:block">
            <p className="m-0 font-extrabold text-txt text-xl leading-tight">
              Design Tech Math Club
            </p>
          </div>
        </NavLink>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-brand text-white shadow-md shadow-brand-glow"
                    : "text-txt-muted hover:text-brand hover:bg-brand/10"
                }`
              }
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden w-10 h-10 rounded-xl bg-surface-3 border border-border-subtle grid place-items-center cursor-pointer"
          type="button"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="flex flex-col gap-[5px]">
            <span
              className={`block w-5 h-0.5 bg-brand transition-all duration-200 ${
                open ? "rotate-45 translate-y-[7px]" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-brand transition-all duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-5 h-0.5 bg-brand transition-all duration-200 ${
                open ? "-rotate-45 -translate-y-[7px]" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            className="md:hidden absolute top-full left-4 right-4 mt-2 p-3 rounded-2xl bg-surface-2 border border-border-subtle shadow-2xl shadow-black/40 flex flex-col gap-1"
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? "bg-brand text-white"
                      : "text-txt-muted hover:text-brand hover:bg-brand/10"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
