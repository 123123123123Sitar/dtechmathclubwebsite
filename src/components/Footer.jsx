const quickLinks = [
  { label: "Competitions", href: "/" },
  { label: "About", href: "/about-our-team" },
  { label: "Contact Us", href: "mailto:dtechmathclub@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle mt-8">
      <div className="w-[min(calc(100%-2rem),1260px)] mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 py-10 px-6 md:px-12">
          {/* Logo */}
          <div className="shrink-0">
            <img
              className="h-12 w-auto object-contain block"
              src="/dtechmathclublogolarger.jpg"
              alt="Design Tech Math Club logo"
            />
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-1 text-sm text-txt-muted">
            <span>dtechmathclub@gmail.com</span>
            <a
              className="italic hover:text-brand transition-colors"
              href="https://www.designtechhighschool.org"
              target="_blank"
              rel="noreferrer"
            >
              designtechhighschool.org
            </a>
          </div>

          {/* Address */}
          <div className="text-sm text-txt-muted leading-relaxed">
            <div>275 Oracle Pkwy,</div>
            <div>Redwood City, CA</div>
            <div>94065, USA</div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-2">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                className="text-sm font-medium text-txt-muted hover:text-brand transition-colors"
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border-subtle py-5 px-6 md:px-12 text-center text-xs text-txt-dim">
          © {new Date().getFullYear()} Design Tech Math Club. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
