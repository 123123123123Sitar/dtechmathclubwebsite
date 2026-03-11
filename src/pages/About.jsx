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
  },
  {
    name: "Sitar Eswar",
    role: "Vice President, Director of Competitions",
    description:
      "Sitar leads competition planning, tournament logistics, and outreach so club events feel polished, challenging, and accessible to younger students.",
  },
  {
    name: "Siddhi Prassad",
    role: "Vice President",
    description:
      "Siddhi supports club operations, collaborates on event preparation, and helps create a consistent experience for meetings, practices, and hosted contests.",
  },
];

export default function About() {
  return (
    <>
      <section className="hero hero-about">
        <div className="container about-hero">
          <div>
            <SectionHeader
              eyebrow="About"
              title="About Design Tech Math Club"
              description="Welcome to the Design Tech Math Club! We're a community of math enthusiasts who come together to explore the beauty of mathematics. Whether it's through engaging competitions, problem-solving, or collaborative projects, we strive to inspire and empower the math community. Our club welcomes students who are passionate about math, providing an environment where they can enhance their skills and build lasting friendships."
            />
          </div>
          <div className="building-panel">
            <span>Design Tech High School campus</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container about-sections">
          <div className="card">
            <h3>What We Do</h3>
            <p>
              Our mission is to foster a love for mathematics and help members develop
              their problem-solving abilities. We are dedicated to empowering young
              mathematicians, encouraging critical thinking, and creating opportunities
              for students to grow in their mathematical journey. By hosting and
              participating in math competitions, we aim to inspire confidence in
              students while building a supportive math community around us.
            </p>
          </div>
          <div className="card">
            <h3>Our Club Meetings</h3>
            <p>
              The Design Tech Math Club meets weekly during Flex period on Mondays.
              During these meetings, members come together to share ideas,
              collaborate, and learn from one another. Guided by our club mentors,
              Ms Dy and Mx Atkinson, advanced math teachers at D.Tech, we sharpen
              our mathematical thinking through team problem-solving. We also plan
              and prepare for our club events and competitions to deliver the best
              experience for all participants.
            </p>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container two-column">
          <div>
            <SectionHeader eyebrow="Events" title="Competitions We Participate In" />
            <div className="stack-list">
              {competitions.map((competition) => (
                <div className="card compact-card" key={competition.name}>
                  <h3>{competition.name}</h3>
                  <p>{competition.copy}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionHeader eyebrow="Hosted" title="Competitions We Host" />
            <div className="stack-list">
              {hosted.map((event) => (
                <div className="card compact-card" key={event.name}>
                  <h3>{event.name}</h3>
                  <p>{event.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Team"
            title="Club Leadership"
            description="The leadership of our club is essential in the operations of our club. The president and vice presidents work together, coordinating various activities, while the director of competitions is responsible for organizing and promoting our events and competitions to maximize participation."
            align="center"
          />
        </div>
        <div className="leadership-stage">
          {leaders.map((leader, index) => (
            <div className="container" key={leader.name}>
              <ScrollReveal
                className={`leader-panel-wrap leader-panel-wrap-${index % 2 === 0 ? "left" : "right"}`}
                direction={index % 2 === 0 ? "left" : "right"}
              >
                <article className="leader-panel">
                  <div className="leader-panel-media">
                    <div className={`leader-photo leader-photo-${index + 1}`} />
                    <h3>{leader.name}</h3>
                    <p className="leader-role">{leader.role}</p>
                  </div>
                  <div className="leader-panel-copy">
                    <p>{leader.description}</p>
                  </div>
                </article>
              </ScrollReveal>
            </div>
          ))}
        </div>
      </section>

      <OrbitSponsorSection
        title="Our Sponsors"
        description="We would like to thank our sponsors for supporting the Design Tech Math Club. Their contributions make it possible for us to host our annual competitions and attend various math tournaments. We're deeply grateful for our sponsors' commitment to fostering curiosity, collaboration, and a love for mathematics in our community."
        tiers={sponsorTiers}
      />
    </>
  );
}
