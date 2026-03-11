import { Link } from "react-router-dom";
import BrandWordmark from "../components/BrandWordmark";
import ContactForm from "../components/ContactForm";
import EventCard from "../components/EventCard";
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

export default function Home() {
  return (
    <>
      <section className="hero hero-home">
        <div className="container hero-content">
          <div className="hero-card home-hero-card">
            <BrandWordmark centered className="hero-wordmark" />
            <p className="hero-subtitle">Members of the Mu Alpha Theta Honor Society</p>
            <p className="home-hero-copy">
              Welcome to the Design Tech Math Club! Join us as we inspire each other and
              deepen our love for math through attending and hosting competitions!
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container home-about-copy home-about-copy-centered">
          <SectionHeader
            eyebrow="About Us"
            title="Empowering Students Through Collaborative Learning in Math"
            description="The Design Tech Math Club is all about fostering a love for math through engaging activities, competitions, and collaborative projects. We host math competitions for middle schoolers, helping to empower the next generation of mathematicians and build a supportive community. Through these events, we not only develop our own skills but also inspire others to explore the wonders of numbers and problem-solving!"
            align="center"
          />
          <Link className="button" to="/about-our-team">
            Learn More
          </Link>
        </div>
      </section>

      <section className="home-stats-stage" aria-label="Club statistics">
        {stats.map((stat) => (
          <ScrollStatPanel key={stat.label} {...stat} />
        ))}
      </section>

      <section className="section section-muted">
        <div className="container home-section-block">
          <SectionHeader
            eyebrow="Calendar"
            title="Upcoming Events"
            description="Explore the club's upcoming public events and competition offerings."
            align="center"
          />
          <div className="event-grid">
            {events.map((event) => (
              <EventCard key={event.title} {...event} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container home-section-block">
          <SectionHeader eyebrow="Contact" title="Contact Us" align="center" />
          <div className="card home-contact-card">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
