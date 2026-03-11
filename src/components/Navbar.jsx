import { useState } from "react";
import { NavLink } from "react-router-dom";

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
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink className="brand" to="/" onClick={() => setOpen(false)}>
          <img
            className="brand-logo"
            src="/dtechmathclublogo.avif"
            alt="Design Tech Math Club logo"
          />
          <div>
            <p className="brand-title">Design Tech Math Club</p>
            <p className="brand-subtitle">Mu Alpha Theta</p>
          </div>
        </NavLink>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${open ? "nav-links-open" : ""}`}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link-active" : ""}`
              }
              onClick={() => setOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
