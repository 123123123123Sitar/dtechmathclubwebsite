const quickLinks = [
  { label: "Competitions", href: "/" },
  { label: "About", href: "/about-our-team" },
  { label: "Contact Us", href: "mailto:dtechmathclub@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-shell">
        <div className="footer-bar">
          <div className="footer-logo-block">
            <img
              className="footer-logo"
              src="/dtechmathclublogolarger.avif"
              alt="Design Tech Math Club logo"
            />
          </div>

          <div className="footer-col">
            <div className="footer-email">dtechmathclub@gmail.com</div>
            <a
              className="footer-site"
              href="https://www.designtechhighschool.org"
              target="_blank"
              rel="noreferrer"
            >
              designtechhighschool.org
            </a>
          </div>

          <div className="footer-col">
            <div>275 Oracle Pkwy,</div>
            <div>Redwood City, CA</div>
            <div>94065, USA</div>
          </div>

          <div className="footer-links">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
