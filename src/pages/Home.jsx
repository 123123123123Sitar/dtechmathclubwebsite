import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BrandWordmark from "../components/BrandWordmark";
import ContactForm from "../components/ContactForm";
import EventCard from "../components/EventCard";
import FlowSection from "../components/FlowSection";
import ScrollStatPanel from "../components/ScrollStatPanel";
import SectionHeader from "../components/SectionHeader";

const stats = [
  { value: "5", label: "Competitions Attended", direction: "left" },
  { value: "45", label: "Members", direction: "right" },
  { value: "3", label: "Competitions Hosted", direction: "left" },
];

const events = [
  {
    title: "Design Tech Math Tournament (DTMT 2026)",
    date: "Sun, Mar 08",
    location: "Design Tech High School",
    imageLabel: "Students competing in timed rounds",
    accent: "accent-dtmt",
    to: "/dtmt",
  },
  {
    title: "Design Tech Problem of the Day Challenge (D.PotD)",
    date: "Mon, Feb 23",
    location: "Online in our website's D.PotD portal",
    imageLabel: "Math problems and scratch work",
    accent: "accent-dpotd",
    to: "/dpotd",
  },
  {
    title: "D.Tech Puzzle Night",
    date: "Fri, Dec 05",
    location: "Design Tech High School",
    imageLabel: "Puzzle pieces and collaborative tables",
    accent: "accent-puzzle",
    to: "/puzzle-night",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export default function Home() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-linear-to-br from-[#0a1628] via-surface to-[#1a0f0a]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-[min(calc(100%-2rem),1180px)] mx-auto flex justify-center py-16">
          <motion.div
            className="w-full max-w-[760px] text-center rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-10 md:p-14 shadow-2xl shadow-black/30"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <BrandWordmark centered className="mb-5" />
            <motion.p
              className="text-txt-muted text-base md:text-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Members of the Mu Alpha Theta Honor Society
            </motion.p>
            <motion.p
              className="max-w-[58ch] mx-auto mt-4 text-txt-muted/80 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Welcome to the Design Tech Math Club! Join us as we inspire each
              other and deepen our love for math through attending and hosting
              competitions!
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-6"
            >
              <Link
                to="/about-our-team"
                className="inline-flex items-center px-7 py-3 rounded-full bg-brand text-white font-bold hover:bg-brand-light hover:shadow-lg hover:shadow-brand-glow transition-all duration-200"
              >
                Learn More →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── About Section ─────────────────────────────────── */}
      <FlowSection className="mt-[-1px]">
        <section className="py-20">
        <div className="w-[min(calc(100%-2rem),800px)] mx-auto text-center">
          <SectionHeader
            eyebrow="About Us"
            title="Empowering Students Through Collaborative Learning in Math"
            description="The Design Tech Math Club is all about fostering a love for math through engaging activities, competitions, and collaborative projects. We host math competitions for middle schoolers, helping to empower the next generation of mathematicians and build a supportive community."
            align="center"
          />
          <motion.div {...fadeUp}>
            <Link
              className="inline-flex items-center px-7 py-3 rounded-full border border-brand text-brand font-bold hover:bg-brand hover:text-white transition-all duration-200"
              to="/about-our-team"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
        </section>
      </FlowSection>

      {/* ── Stats ─────────────────────────────────────────── */}
      <section className="grid gap-0 my-4" aria-label="Club statistics">
        {stats.map((stat) => (
          <ScrollStatPanel key={stat.label} {...stat} />
        ))}
      </section>

      {/* ── Events ────────────────────────────────────────── */}
      <FlowSection glow="muted">
        <section className="py-20 relative">
        <div className="absolute inset-0 bg-surface-2/50" />
        <div className="relative z-10 w-[min(calc(100%-2rem),1180px)] mx-auto">
          <SectionHeader
            eyebrow="Calendar"
            title="Upcoming Events"
            description="Explore the club's upcoming public events and competition offerings."
            align="center"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {events.map((event) => (
              <EventCard key={event.title} {...event} />
            ))}
          </div>
        </div>
        </section>
      </FlowSection>

      {/* ── Contact ───────────────────────────────────────── */}
      <FlowSection>
        <section className="py-20">
        <div className="w-[min(calc(100%-2rem),1180px)] mx-auto">
          <SectionHeader title="Contact Us" align="center" />
          <motion.div
            className="max-w-[1000px] mx-auto rounded-3xl border border-border-subtle bg-surface-card backdrop-blur-sm p-8 md:p-10"
            {...fadeUp}
          >
            <ContactForm />
          </motion.div>
        </div>
        </section>
      </FlowSection>
    </>
  );
}
