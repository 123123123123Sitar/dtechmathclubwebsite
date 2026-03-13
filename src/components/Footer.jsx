import { Link } from "react-router-dom";

const quickLinks = [
  { label: "About", to: "/about/our-team" },
  { label: "Sponsor Us", to: "/about/sponsor-us" },
  { label: "Contact Us", to: "/#contact" },
];

export default function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden border-t border-brand/15 bg-[#31231b] text-[#f7ede6]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(234,109,74,0.22),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_24%),linear-gradient(180deg,rgba(49,35,27,0.98),rgba(39,28,22,0.98))]" />
      <div className="relative mx-auto w-[min(calc(100%-2rem),1260px)] px-6 py-12 md:px-10">
        <div className="grid gap-8 rounded-[34px] border border-white/10 bg-white/6 p-8 shadow-[0_28px_80px_-48px_rgba(0,0,0,0.65)] backdrop-blur-xl md:grid-cols-[1.2fr_0.8fr_0.8fr] md:items-start">
          <div>
            <div className="flex items-center gap-4">
              <img
                className="h-16 w-16 rounded-[22px] object-contain shadow-[0_18px_34px_-24px_rgba(0,0,0,0.5)]"
                src="/dtechmathclublogo.avif"
                alt="Design Tech Math Club logo"
              />
              <div>
                <h2 className="text-3xl font-extrabold leading-none text-white">Design Tech</h2>
                <p className="mt-1 text-lg font-semibold text-[#f1dbcf]">Math Club</p>
              </div>
            </div>
            <p className="mt-5 max-w-[34rem] text-sm leading-relaxed text-[#f1dbcf]/84">
              Design Tech Math Club is a student-led Mu Alpha Theta chapter building competition,
              outreach, and problem-solving experiences for younger mathematicians.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Contact</h3>
            <div className="mt-4 grid gap-3 text-sm leading-relaxed text-[#f1dbcf]/84">
              <a className="transition-colors hover:text-white" href="mailto:dtechmathclub@gmail.com">
                dtechmathclub@gmail.com
              </a>
              <a
                className="transition-colors hover:text-white"
                href="https://www.designtechhighschool.org"
                rel="noreferrer"
                target="_blank"
              >
                designtechhighschool.org
              </a>
              <div>
                <div>275 Oracle Parkway</div>
                <div>Redwood City, CA 94065</div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Quick Links</h3>
            <div className="mt-4 flex flex-col gap-2 max-w-xs w-full">
              {quickLinks.map((link) => {
                if (link.label === "Contact Us") {
                  return (
                    <a
                      key={link.label}
                      className="inline-flex rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-[#f7ede6] transition-all duration-200 hover:border-brand/50 hover:bg-brand hover:text-white w-full max-w-xs mx-auto"
                      href="/#contact"
                    >
                      {link.label}
                    </a>
                  );
                }
                if (link.to) {
                  return (
                    <Link
                      key={link.label}
                      className="inline-flex rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-[#f7ede6] transition-all duration-200 hover:border-brand/50 hover:bg-brand hover:text-white w-full max-w-xs mx-auto"
                      to={link.to}
                    >
                      {link.label}
                    </Link>
                  );
                }
                return (
                  <a
                    key={link.label}
                    className="inline-flex rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm font-semibold text-[#f7ede6] transition-all duration-200 hover:border-brand/50 hover:bg-brand hover:text-white w-full max-w-xs mx-auto"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-2 py-5 text-center text-xs text-[#c8aea0]">
          © {new Date().getFullYear()} Design Tech Math Club. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
