import { motion } from "framer-motion";
import FlowSection from "../components/FlowSection";
import SectionHeader from "../components/SectionHeader";
import OrbitSponsorSection from "../components/OrbitSponsorSection";
import ScrollReveal from "../components/ScrollReveal";
import { sponsorTiers } from "../data";

const competitions = [
  {
    name: "College run competitions",
    copy: "Berekly Math Tournament, Caltech Math Meet, and the Stanford Math Tournament",
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
    photo: "/assets/leadership/president_kai_lidzborski.jpg",
  },
  {
    name: "Sitar Eswar",
    role: "Vice President, Director of Competitions",
    description:
      "Sitar leads competition planning, tournament logistics, and outreach so club events feel polished, challenging, and accessible to younger students.",
    gradient: "from-[#f6a56d] to-[#f05a28]",
    photo: "/assets/leadership/sitar_eswar_vice_president.png",
  },
  {
    name: "Siddhi Prasad",
    role: "Vice President",
    description:
      "Siddhi supports club operations and helps create a consistent experience for meetings, practices, and hosted contests.",
    gradient: "from-[#f6a56d] to-[#f05a28]",
    photo: "/assets/leadership/vice_president_siddhi_prasad.png",
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
              <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-black text-txt">About Design Tech Math Club</h1>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_0.8fr] gap-8 items-start">
              <motion.p
                className="text-txt-muted text-base md:text-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Welcome to the Design Tech Math Club. We are a community of students who explore mathematics through competitions, collaboration, and outreach built for younger problem solvers.
              </motion.p>
              <motion.div
                className="flex justify-center md:justify-end flex-shrink-0 overflow-hidden rounded-[30px]"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="relative min-h-[250px] w-full bg-linear-to-br from-[#1d4875]/45 to-[#8ec6a3]/35">
                  <img
                    src="/assets/logos/dtech.avif"
                    alt="Design Tech Math Club hero image"
                    className="absolute inset-0 w-full h-full object-cover rounded-[30px]"
                    style={{ zIndex: 1 }}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" style={{ zIndex: 2 }} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Do / Meetings ─────────────────────────── */}
      <FlowSection>
        <section className="py-20">
        <div className="w-[min(calc(100%-2rem),1180px)] mx-auto grid md:grid-cols-2 gap-8">
          {[
            {
              title: "What We Do",
              text: "Our mission is to foster a love for mathematics and help members develop their problem-solving abilities. We are dedicated to empowering young mathematicians, encouraging critical thinking, and creating opportunities for students to grow in their mathematical journey. By hosting and participating in math competitions, we aim to inspire confidence in students while building a supportive math community around us.",
              image: "/assets/club/bmt_team_photo.jpg",
            },
            {
              title: "Our Club Meetings",
              text: "The Design Tech Math Club meets weekly during Flex period on Mondays. During these meetings, members come together to share ideas, collaborate, and learn from one another. Guided by our club mentors, Ms Dy and Mx Atkinson, advanced math teachers at D.Tech, we sharpen our mathematical thinking through team problem-solving. We also plan and prepare for our club events and competitions to deliver the best experience for all participants.",
              image: "/assets/club/bmt_testing.png",
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              className="rounded-3xl border border-border-subtle bg-surface-card backdrop-blur-sm p-7 hover:border-brand/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <img
                src={card.image}
                alt={card.title}
                className="mb-5 w-full h-[220px] object-cover rounded-2xl border border-white/40 shadow-md"
              />
              <h3 className="text-xl font-black text-txt mb-3">{card.title}</h3>
              <p className="text-txt-muted leading-relaxed">{card.text}</p>
            </motion.div>
          ))}
        </div>
        
        <div className="relative z-10 w-[min(calc(100%-2rem),1180px)] mx-auto mt-10">
            <motion.div
              className="rounded-3xl border border-border-subtle bg-surface-card backdrop-blur-sm p-7 hover:border-brand/30 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl font-black text-txt mb-3">Competitions We Participate In</h3>
              <p className="text-txt-muted leading-relaxed mb-4">
                Our club regularly participates in a variety of math competitions throughout the year. These events help members challenge themselves, grow as problem solvers, and connect with the broader math community.
              </p>
              <ul className="list-disc pl-6 text-txt-muted text-base space-y-3">
                <li>
                  <span className="font-semibold">College run competitions:</span> Berkeley Math Tournament, Caltech Math Meet, and the Stanford Math Tournament.
                </li>
                <li>
                  <span className="font-semibold">AMC (American Mathematics Competition):</span> A national contest pathway that introduces students to olympiad-style problem solving. This includes the AMC10/12 and AIME.
                </li>
                <li>
                  <span className="font-semibold">BAMO (Bay Area Math Olympiad):</span> A rigorous proof-based olympiad focused on clear mathematical writing.
                </li>
              </ul>
            </motion.div>
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
                boxShadow:
                  leader.name === "Sitar Eswar" || leader.name === "Siddhi Prassad"
                    ? "inset 0 0 0 2.5px #f05a28"
                    : leader.gradient === "from-[#f6a56d] to-[#f05a28]"
                    ? "inset 0 0 0 2px #f05a28"
                    : leader.gradient === "from-[#6aaae4] to-[#2d79b7]"
                    ? "inset 0 0 0 2px #2d79b7"
                    : "inset 0 0 0 2px #3d9a70",
              }}
            >
              <div className="w-full p-6 flex flex-col items-center text-center gap-4">
                <div>
                  {leader.photo ? (
                    <img
                      src={leader.photo}
                      alt={leader.name + " photo"}
                      className="w-28 h-28 rounded-2xl object-cover border border-white/40 shadow-md mb-2"
                    />
                  ) : (
                    <div
                      className={`w-28 h-28 rounded-2xl bg-linear-to-br ${leader.gradient}`}
                    />
                  )}
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
