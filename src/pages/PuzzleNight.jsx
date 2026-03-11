import SectionHeader from "../components/SectionHeader";
import SponsorSection from "../components/SponsorSection";

const puzzleSponsors = [
  {
    name: "Featured Sponsors",
    sponsors: [
      {
        name: "AoPS",
        href: "https://artofproblemsolving.com",
        copy: "Textbooks, online courses, and a math community for curious students.",
      },
      {
        name: "Math Kangaroo",
        href: "https://mathkangaroo.org",
        copy: "Contest experiences that make mathematical thinking more approachable.",
      },
    ],
  },
];

const schedule = [
  ["4:15 PM - 4:30 PM", "Arrive and Check In"],
  ["4:30 PM - 4:45 PM", "Welcome and Introduction"],
  ["4:45 PM - 6:30 PM", "Exploration activities"],
  ["5:00 PM - 5:30 PM", "Estimation round"],
  ["5:45 PM - 6:15 PM", "Countdown round"],
  ["5:45 PM", "Snacks"],
  ["6:30 PM - 7:00 PM", "Raffle and Closing"],
];

const stations = [
  "Pattern and Sequences",
  "Word Problems",
  "Logic Puzzles",
  "Grid Puzzles",
  "Math Modeling",
  "Geometry",
  "Math Kangaroo Problems",
  "AMC Style Problems",
];

export default function PuzzleNight() {
  return (
    <>
      <section className="hero hero-puzzle">
        <div className="container hero-slim">
          <SectionHeader
            eyebrow="Community Event"
            title="Design Tech Puzzle Night"
            description="The Design Math Club hosts an exploration-focused Puzzle Night for Middle Schoolers in the Bay Area during late November. The Puzzle Night features a variety of interactive puzzle stations, each offering a different way to explore the fun side of mathematics. Students can try AMC-style math challenge problems, explore creative math modeling activities, and work through hands-on puzzle stations that highlight logic, problem-solving, and discovery. Students are awarded raffle tickets for completing activities, with the opportunity to win fun prizes at the end. The goal of the event is to spark curiosity and help middle schoolers see math as enjoyable, engaging, and rewarding beyond the classroom. With puzzles for all levels, students can explore at their own pace, find what excites them, and build confidence in their problem-solving skills. We hope to inspire students and encourage them to pursue math."
            align="center"
          />
          <div className="banner-card">
            <div className="banner-badge">Puzzle Night</div>
            <div>
              <h3>Interactive stations, prizes, and AoPS support</h3>
              <p>Promotional banner recreation with sponsor callout and event branding.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="message-strip">
            <h2>We hope you had a good time at Puzzle Night!</h2>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container two-column">
          <div>
            <SectionHeader
              eyebrow="Activities"
              title="Activities and Stations"
              description="We are offering the following activities and stations."
            />
            <div className="pill-grid">
              {stations.map((station) => (
                <span className="pill" key={station}>
                  {station}
                </span>
              ))}
              <span className="pill">Countdown</span>
              <span className="pill">Estimation</span>
            </div>
          </div>

          <div className="photo-stack">
            <div className="photo-card photo-puzzle-one">
              <span>Students rotating through logic and modeling stations</span>
            </div>
            <div className="photo-card photo-puzzle-two">
              <span>Raffle tickets, puzzles, and collaborative problem solving</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <SectionHeader eyebrow="Timeline" title="Schedule" />
          <div className="timeline">
            {schedule.map(([time, detail]) => (
              <div className="timeline-row" key={`${time}-${detail}`}>
                <div className="timeline-time">{time}</div>
                <div className="timeline-detail">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SponsorSection
        title="Sponsors"
        description="The Design Tech Math Club and Design Tech Puzzle Night last year were sponsored by the Art of Problem Solving (AoPS) and Math Kangaroo, two leading organizations dedicated to fostering problem-solving excellence and a lifelong passion for mathematics."
        tiers={puzzleSponsors}
        centered
      />
    </>
  );
}
