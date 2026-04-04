import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import BrandWordmark from "../components/BrandWordmark";
import ContactForm from "../components/ContactForm";
import EventCard from "../components/EventCard";
import FlowSection from "../components/FlowSection";
import ScrollStatPanel from "../components/ScrollStatPanel";
import SectionHeader from "../components/SectionHeader";

const stats = [
  { value: "45", label: "Members", direction: "right" },
  { value: "6", label: "Competitions Attended", direction: "left" },
  { value: "3", label: "Competitions Hosted", direction: "left" },
];

const events = [
  {
    title: "Design Tech Puzzle Night",
    date: "Late November",
    location: "Design Tech High School",
    accent: "accent-puzzle",
    to: "/puzzle-night",
    imageSrc: "/assets/puzzle-night/countdown_event.jpg",
  },
  {
    title: "Design Tech Problem of the Day Challenge",
    date: "February",
    location: "Online in our website's D.PotD portal",
    accent: "accent-dpotd",
    to: "/dpotd/about",
    imageSrc: "/assets/dpotd/logo.png",
  },
  {
    title: "Design Tech Math Tournament 2027",
    date: "Early March",
    location: "Design Tech High School",
    accent: "accent-dtmt",
    to: "/dtmt",
    imageSrc: "/assets/dtmt/opening.jpg",
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,rgba(234,109,74,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(45,121,183,0.10),transparent_22%),linear-gradient(145deg,#f7f0e8_0%,#f3ece6_42%,#faf6f2_100%)]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-white/50 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-125 h-125 bg-brand/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-[min(calc(100%-2rem),1180px)] mx-auto flex justify-center py-16">
          <motion.div
            className="w-full max-w-195 text-center rounded-[36px] border border-[rgba(234,109,74,0.14)] bg-white/72 p-10 shadow-[0_34px_90px_-48px_rgba(49,30,17,0.42)] backdrop-blur-xl md:p-14"
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
              className="mt-6 flex flex-wrap justify-center gap-3"
            >
              <Link
                to="/about/our-team"
                className="inline-flex items-center px-7 py-3 rounded-full bg-brand text-white font-bold hover:bg-brand-light hover:shadow-lg hover:shadow-brand-glow transition-all duration-200"
              >
                Learn More →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── About Section ─────────────────────────────────── */}
      <FlowSection className="-mt-px">
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
              to="/about/our-team"
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
            title="Our Events"
            description="Every year, our club hosts three competitions and events."
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
        <section className="py-16" id="contact">
        <div className="w-[min(calc(100%-2rem),1180px)] mx-auto">
          <SectionHeader title="Contact Us" align="center" />
          <motion.div
            className="max-w-250 mx-auto rounded-3xl border border-border-subtle bg-surface-card backdrop-blur-sm py-3 px-6 md:py-5 md:px-8 text-[0.8rem]"
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
