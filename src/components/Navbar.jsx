import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useDpotdAuth } from "../context/DpotdAuthContext";

const navItems = [
  { type: "link", to: "/", label: "Home" },
  { type: "link", to: "/puzzle-night", label: "Puzzle Night" },
  { type: "link", to: "/dpotd", label: "d.PotD" },
  { type: "link", to: "/dtmt", label: "DTMT" },
  {
    type: "dropdown",
    label: "About",
    match: "/about",
    items: [
      { to: "/about/our-team", label: "Our Team" },
      { to: "/about/donate", label: "Donation" },
      { to: "/about/sponsor-us", label: "Sponsor Us" },
    ],
  },
];

function linkClass(isActive) {
  return `px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
    isActive
      ? "bg-brand text-white shadow-md shadow-brand-glow"
      : "text-txt-muted hover:text-brand hover:bg-white/80"
  }`;
}

function dropdownActive(item, location) {
  if (item.match === "/dpotd") {
    return (
      location.pathname.startsWith("/dpotd") ||
      (location.pathname.startsWith("/profile") && location.search.includes("view=dpotd"))
    );
  }

  return location.pathname.startsWith(item.match);
}

function getProfileButtonLabel(authReady, profile, user) {
  if (!authReady || !user) {
    return "Profile";
  }

  const candidate = String(profile?.name || user.displayName || "").trim();
  if (candidate && !candidate.includes("@")) {
    return candidate.split(" ")[0];
  }

  return "Profile";
}

export default function Navbar() {
  const location = useLocation();
  const { authReady, profile, user } = useDpotdAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopDropdown, setDesktopDropdown] = useState(null);
  const [mobileDropdown, setMobileDropdown] = useState(null);

  useEffect(() => {
    setMobileOpen(false);
    setDesktopDropdown(null);
    setMobileDropdown(null);
  }, [location.pathname]);

  const profileLabel = getProfileButtonLabel(authReady, profile, user);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-brand/20 bg-[rgba(248,241,234,0.82)] shadow-[0_20px_46px_-36px_rgba(49,30,17,0.46)] backdrop-blur-2xl">
      <div className="mx-auto flex min-h-[72px] w-[min(calc(100%-2rem),1240px)] items-center justify-between gap-4">
        <NavLink
          className="flex items-center gap-3 group"
          onClick={() => setMobileOpen(false)}
          to="/"
        >
          <img
            alt="Design Tech Math Club logo"
            className="h-11 w-11 shrink-0 rounded-xl object-cover transition-all duration-200"
            src="/dtechmathclublogo.avif"
          />
          <div className="hidden sm:block">
            <p className="m-0 text-xl font-extrabold leading-tight text-txt">Design Tech Math Club</p>
          </div>
        </NavLink>

        <div className="hidden items-center gap-3 md:flex">
          <nav className="flex items-center gap-1 rounded-full border border-white/60 bg-white/44 p-1.5 shadow-[0_16px_36px_-30px_rgba(49,30,17,0.42)]">
            {navItems.map((item) => {
              if (item.type === "link") {
                return (
                  <NavLink
                    key={item.to}
                    className={({ isActive }) => linkClass(isActive)}
                    to={item.to}
                  >
                    {item.label}
                  </NavLink>
                );
              }

              const active = dropdownActive(item, location);

              return (
                <div
                  key={item.label}
                  className="relative"
                  onMouseEnter={() => setDesktopDropdown(item.label)}
                  onMouseLeave={() => setDesktopDropdown(null)}
                >
                  <button
                    className={linkClass(active)}
                    onClick={() =>
                      setDesktopDropdown((current) => (current === item.label ? null : item.label))
                    }
                    type="button"
                  >
                      <span className="flex items-center gap-2">
                        {item.label}
                        <span className="text-[11px] uppercase">{desktopDropdown === item.label ? "^" : "v"}</span>
                    </span>
                  </button>

                  <AnimatePresence>
                    {desktopDropdown === item.label ? (
                      <motion.div
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="absolute right-0 top-full mt-2 min-w-[210px] rounded-3xl border border-white/50 bg-[linear-gradient(160deg,rgba(255,255,255,0.9),rgba(255,248,242,0.8))] p-3 shadow-2xl shadow-black/15 ring-1 ring-white/35"
                        exit={{ opacity: 0, y: -8, scale: 0.96 }}
                        initial={{ opacity: 0, y: -8, scale: 0.96 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                      >
                        {item.items.map((child) => (
                          <NavLink
                            key={child.to}
                            className={({ isActive }) =>
                              `block rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-150 ${
                                isActive
                                  ? "bg-brand text-white"
                                  : "text-txt-muted hover:bg-brand/10 hover:text-brand"
                              }`
                            }
                            to={child.to}
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          <NavLink
            className={({ isActive }) =>
              `inline-flex rounded-full px-5 py-2 text-sm font-bold shadow-[0_16px_34px_-26px_rgba(49,30,17,0.4)] transition-all duration-200 ${
                isActive || location.pathname.startsWith("/profile")
                  ? "bg-brand text-white shadow-md shadow-brand-glow"
                  : "border border-brand bg-white/60 text-brand hover:bg-brand hover:text-white"
              }`
            }
            to="/profile"
          >
            {profileLabel}
          </NavLink>
        </div>

        <button
          aria-expanded={mobileOpen}
          aria-label="Toggle navigation"
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/60 bg-white/56 shadow-[0_16px_36px_-30px_rgba(49,30,17,0.44)] md:hidden"
          onClick={() => setMobileOpen((current) => !current)}
          type="button"
        >
          <div className="flex flex-col gap-[5px]">
            <span
              className={`block h-0.5 w-5 bg-brand transition-all duration-200 ${
                mobileOpen ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-brand transition-all duration-200 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-brand transition-all duration-200 ${
                mobileOpen ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-brand to-transparent" />

      <AnimatePresence>
        {mobileOpen ? (
          <motion.nav
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute left-4 right-4 top-full mt-2 rounded-3xl border border-white/50 bg-[linear-gradient(160deg,rgba(255,255,255,0.92),rgba(255,248,242,0.82))] p-3 shadow-2xl shadow-black/20 ring-1 ring-white/35 md:hidden"
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => {
                if (item.type === "link") {
                  return (
                    <NavLink
                      key={item.to}
                      className={({ isActive }) =>
                        `rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-150 ${
                          isActive
                            ? "bg-brand text-white"
                            : "text-txt-muted hover:bg-brand/10 hover:text-brand"
                        }`
                      }
                      to={item.to}
                    >
                      {item.label}
                    </NavLink>
                  );
                }

                const active = dropdownActive(item, location);
                const expanded = mobileDropdown === item.label;

                return (
                  <div key={item.label} className="rounded-3xl border border-border-subtle bg-white/70">
                    <button
                      className={`flex w-full items-center justify-between px-4 py-3 text-sm font-semibold ${
                        active ? "text-brand" : "text-txt-muted"
                      }`}
                      onClick={() =>
                        setMobileDropdown((current) => (current === item.label ? null : item.label))
                      }
                      type="button"
                    >
                      <span>{item.label}</span>
                      <span className="text-[11px] uppercase">{expanded ? "^" : "v"}</span>
                    </button>
                    <AnimatePresence initial={false}>
                      {expanded ? (
                        <motion.div
                          animate={{ height: "auto", opacity: 1 }}
                          className="overflow-hidden px-2 pb-2"
                          exit={{ height: 0, opacity: 0 }}
                          initial={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                        >
                          <div className="grid gap-1">
                            {item.items.map((child) => (
                              <NavLink
                                key={child.to}
                                className={({ isActive }) =>
                                  `rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-150 ${
                                    isActive
                                      ? "bg-brand text-white"
                                      : "text-txt-muted hover:bg-brand/10 hover:text-brand"
                                  }`
                                }
                                to={child.to}
                              >
                                {child.label}
                              </NavLink>
                            ))}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })}

              <NavLink
                className={({ isActive }) =>
                  `mt-2 rounded-2xl px-4 py-3 text-center text-sm font-bold transition-all duration-150 ${
                    isActive || location.pathname.startsWith("/profile")
                      ? "bg-brand text-white"
                      : "border border-brand text-brand hover:bg-brand hover:text-white"
                  }`
                }
                to="/profile"
              >
                {profileLabel}
              </NavLink>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
