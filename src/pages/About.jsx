import { motion } from "framer-motion";
import FlowSection from "../components/FlowSection";
import SectionHeader from "../components/SectionHeader";
import OrbitSponsorSection from "../components/OrbitSponsorSection";
import ScrollReveal from "../components/ScrollReveal";
import { sponsorTiers } from "../data";

const competitions = [
  {
    name: "BMT (Berkeley Math Tournament)",
    copy: "A university-run contest that pushes students through rich proof-based and contest-style problems.",
  },
  {
    name: "SMT (Stanford Math Tournament)",
    copy: "A collaborative and competitive tournament that rewards deep mathematical thinking and teamwork.",
  },
  {
    name: "CMM (Caltech Math Meet)",
    copy: "An advanced invitational event known for creative rounds and thoughtful problem design.",
  },
  {
    name: "AMC (American Mathematics Competition)",
    copy: "A foundational national contest pathway that introduces students to olympiad-style problem solving.",
  },
  {
    name: "BAMO (Bay Area Math Olympiad)",
    copy: "A proof-focused regional olympiad that emphasizes elegant solutions and clear mathematical writing.",
  },
];

const hosted = [
  {
    name: "Puzzle Night (December)",
    copy: "An exploratory event where middle schoolers rotate through logic, modeling, and collaborative puzzle stations.",
  },
  {
    name: "Problems of the Day Challenge (February)",
    copy: "A month-long online challenge that encourages consistent problem solving and mathematical persistence.",
  },
  {
    name: "Math Tournament (March)",
    copy: "Our largest event of the year, featuring individual and team rounds alongside community-building activities.",
  },
];

const leaders = [
  {
    name: "Kai Lidzborski",
    role: "President",
    description:
      "Kai helps set the direction for the club, coordinates meetings, and keeps the team focused on building a thoughtful, welcoming math community.",
    gradient: "from-[#f6a56d] to-[#f05a28]",
  },
  {
    name: "Sitar Eswar",
    role: "Vice President, Director of Competitions",
    description:
      "Sitar leads competition planning, tournament logistics, and outreach so club events feel polished, challenging, and accessible to younger students.",
    gradient: "from-[#6aaae4] to-[#2d79b7]",
  },
  {
    name: "Siddhi Prassad",
    role: "Vice President",
    description:
      "Siddhi supports club operations, collaborates on event preparation, and helps create a consistent experience for meetings, practices, and hosted contests.",
    gradient: "from-[#78c79e] to-[#3d9a70]",
  },
];

const cardVariants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function About() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-[#0d1a2d] via-surface to-[#1a0f0a]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 w-[min(calc(100%-2rem),1180px)] mx-auto grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
              <SectionHeader
                title="About Design Tech Math Club"
                description="Welcome to the Design Tech Math Club! We're a community of math enthusiasts who come together to explore the beauty of mathematics. Whether it's through engaging competitions, problem-solving, or collaborative projects, we strive to inspire and empower the math community."
              />
          </motion.div>

          <motion.div
            className="relative min-h-[300px] rounded-3xl overflow-hidden bg-linear-to-br from-[#1d4875]/40 to-[#8ec6a3]/30 border border-white/5"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
            <span className="absolute bottom-5 left-5 right-5 text-white text-sm font-medium z-10">
              Design Tech High School campus
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── What We Do / Meetings ─────────────────────────── */}
      <FlowSection>
        <section className="py-20">
        <div className="w-[min(calc(100%-2rem),1180px)] mx-auto grid md:grid-cols-2 gap-5">
          {[
            {
              title: "What We Do",
              text: "Our mission is to foster a love for mathematics and help members develop their problem-solving abilities. We are dedicated to empowering young mathematicians, encouraging critical thinking, and creating opportunities for students to grow in their mathematical journey. By hosting and participating in math competitions, we aim to inspire confidence in students while building a supportive math community around us.",
            },
            {
              title: "Our Club Meetings",
              text: "The Design Tech Math Club meets weekly during Flex period on Mondays. During these meetings, members come together to share ideas, collaborate, and learn from one another. Guided by our club mentors, Ms Dy and Mx Atkinson, advanced math teachers at D.Tech, we sharpen our mathematical thinking through team problem-solving. We also plan and prepare for our club events and competitions to deliver the best experience for all participants.",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              className="rounded-3xl border border-border-subtle bg-surface-card backdrop-blur-sm p-7 hover:border-brand/30 transition-all duration-300"
              {...cardVariants}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <h3 className="text-xl font-bold text-txt mb-3">{card.title}</h3>
              <p className="text-txt-muted leading-relaxed">{card.text}</p>
            </motion.div>
          ))}
        </div>
        </section>
      </FlowSection>

      {/* ── Competitions ──────────────────────────────────── */}
      <FlowSection glow="muted">
        <section className="py-20 relative">
        <div className="absolute inset-0 bg-surface-2/50" />
        <div className="relative z-10 w-[min(calc(100%-2rem),1180px)] mx-auto grid md:grid-cols-2 gap-10">
          <div>
              <SectionHeader title="Competitions We Participate In" />
            <div className="grid gap-3">
              {competitions.map((c, i) => (
                <motion.div
                  key={c.name}
                  className="rounded-2xl border border-border-subtle bg-surface-card backdrop-blur-sm p-5 hover:border-brand/30 hover:bg-brand/5 transition-all duration-300"
                  {...cardVariants}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <h3 className="text-base font-bold text-txt mb-1">{c.name}</h3>
                  <p className="text-sm text-txt-muted leading-relaxed">{c.copy}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div>
              <SectionHeader title="Competitions We Host" />
            <div className="grid gap-3">
              {hosted.map((e, i) => (
                <motion.div
                  key={e.name}
                  className="rounded-2xl border border-border-subtle bg-surface-card backdrop-blur-sm p-5 hover:border-brand/30 hover:bg-brand/5 transition-all duration-300"
                  {...cardVariants}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <h3 className="text-base font-bold text-txt mb-1">{e.name}</h3>
                  <p className="text-sm text-txt-muted leading-relaxed">{e.copy}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        </section>
      </FlowSection>

      {/* ── Leadership ────────────────────────────────────── */}
      <FlowSection>
        <section className="py-20">
        <div className="w-[min(calc(100%-2rem),1180px)] mx-auto">
          <SectionHeader
            title="Club Leadership"
            description="The leadership of our club is essential in the operations of our club. The president and vice presidents work together, coordinating various activities, while the director of competitions is responsible for organizing and promoting our events."
            align="center"
          />
        </div>
        <div className="w-[min(calc(100%-2rem),1180px)] mx-auto grid md:grid-cols-3 gap-6">
          {leaders.map((leader, index) => (
            <motion.article
              className="flex flex-col items-center rounded-2xl overflow-hidden bg-surface-2 cursor-default"
              key={leader.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              style={{
                boxShadow: `inset 0 0 0 2px ${
                  leader.gradient === "from-[#f6a56d] to-[#f05a28]"
                    ? "#f05a28"
                    : leader.gradient === "from-[#6aaae4] to-[#2d79b7]"
                    ? "#2d79b7"
                    : "#3d9a70"
                }`,
              }}
            >
              <div className="w-full p-6 flex flex-col items-center text-center gap-4">
                <div>
                  <div
                    className={`w-[120px] h-[120px] rounded-2xl bg-linear-to-br ${leader.gradient}`}
                  />
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-txt">
                    {leader.name}
                  </h3>
                  <p className="text-brand font-bold text-sm md:text-base mb-2">
                    {leader.role}
                  </p>
                  <p className="text-txt-muted leading-relaxed text-sm md:text-base">
                    {leader.description}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        </section>
      </FlowSection>

      {/* ── Sponsors ──────────────────────────────────────── */}
      <OrbitSponsorSection
        title="Our Sponsors"
        description="We would like to thank our sponsors for supporting the Design Tech Math Club. Their contributions make it possible for us to host our annual competitions and attend various math tournaments."
        tiers={sponsorTiers}
      />
    </>
  );
}
