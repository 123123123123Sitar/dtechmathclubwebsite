import EventCard from "../components/EventCard";
import SectionHeader from "../components/SectionHeader";

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

export default function Competitions() {
  return (
    <section className="section section-top">
      <div className="container">
        <SectionHeader
          eyebrow="Calendar"
          title="Upcoming Events"
          description="Explore the club's upcoming public events and competition offerings."
        />
        <div className="event-grid">
          {events.map((event) => (
            <EventCard key={event.title} {...event} />
          ))}
        </div>
      </div>
    </section>
  );
}
