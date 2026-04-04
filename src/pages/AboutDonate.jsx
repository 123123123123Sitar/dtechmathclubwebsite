import { motion } from "framer-motion";
import FlowSection from "../components/FlowSection";
import SectionHeader from "../components/SectionHeader";
import SplitPanel from "../components/SplitPanel";
import { donationImpact } from "../content/sponsorship";

const givingTemplate = [
  { label: "Friend of the Club", amount: "$25", copy: "Template tier for small individual support." },
  { label: "Program Supporter", amount: "$100", copy: "Template tier for helping fund prizes and materials." },
  { label: "Event Champion", amount: "$250", copy: "Template tier for families or alumni supporting growth." },
];

export default function AboutDonate() {
  return (
    <>
      <section className="relative overflow-hidden pt-28 pb-18">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(234,109,74,0.22),transparent_28%),radial-gradient(circle_at_top_left,rgba(45,121,183,0.12),transparent_24%),linear-gradient(145deg,#f7f0e8_0%,#f3ece6_42%,#faf6f2_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.22)_0%,transparent_32%,rgba(255,255,255,0.18)_52%,transparent_72%)] opacity-60" />
        <div className="absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-white/55 blur-[120px]" />

        <div className="relative z-10 mx-auto w-[min(calc(100%-2rem),1180px)]">
          <div className="relative overflow-hidden rounded-[38px] border border-[rgba(234,109,74,0.16)] bg-[linear-gradient(155deg,rgba(255,255,255,0.86),rgba(255,248,242,0.72))] p-7 shadow-[0_34px_90px_-48px_rgba(49,30,17,0.42)] ring-1 ring-white/40 backdrop-blur-xl before:pointer-events-none before:absolute before:-right-14 before:top-[-72px] before:h-56 before:w-56 before:rounded-full before:bg-brand/12 before:blur-3xl after:pointer-events-none after:absolute after:-left-10 after:bottom-[-88px] after:h-48 after:w-48 after:rounded-full after:bg-[#2d79b7]/10 after:blur-3xl md:p-10">
            <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-transparent via-brand/70 to-transparent" />
            <motion.div
              className="w-full text-center mb-8"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-txt">Support the Design Tech Math Club</h1>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-8 items-start">
              <motion.p
                className="text-txt-muted text-base md:text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Support from families, alumni, and community members helps the Design Tech Math Club fund prizes, materials, and accessible math programming.
              </motion.p>
              <motion.div
                className="flex justify-center md:justify-end flex-shrink-0"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <img
                  src="/assets/logos/dtechmathclublogo.jpg"
                  alt="Design Tech Math Club banner"
                  style={{ maxWidth: 300, height: "auto", display: "block", borderRadius: 16 }}
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <FlowSection>
        <section className="py-18">
          <div className="mx-auto w-[min(calc(100%-2rem),1120px)]">
            <SectionHeader
              title="What Donations Help Fund"
              description="These focus areas show how support can help student programs, event quality, and broader access."
              align="center"
            />
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {donationImpact.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[30px] border border-border-subtle bg-surface-card p-7"
                >
                  <h3 className="text-xl font-black text-txt">{item.title}</h3>
                  <p className="mt-4 leading-relaxed text-txt-muted">{item.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </FlowSection>

    </>
  );
}
