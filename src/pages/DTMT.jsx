import SectionHeader from "../components/SectionHeader";
import SponsorSection from "../components/SponsorSection";
import StatBadge from "../components/StatBadge";
import { sponsorTiers } from "../data";

const schedule = [
  ["8:00 AM", "Check-in, breakfast, and campus arrival"],
  ["8:30 AM", "Opening remarks and rules briefing"],
  ["9:00 AM", "Subject rounds begin"],
  ["10:45 AM", "Team round"],
  ["11:30 AM", "Lunch and speaker session"],
  ["12:15 PM", "Sequence round, relay activities, and math jeopardy"],
  ["1:15 PM", "Countdown tiebreakers if needed"],
  ["1:30 PM", "Awards ceremony and closing"],
];

const archives2026 = [
  "Algebra",
  "Geometry",
  "Discrete",
  "6th Grade Test",
  "Team",
  "Sequence",
];

const archives2025 = ["Individual Round", "Team Round"];

export default function DTMT() {
  return (
    <>
      <section className="hero hero-dtmt">
        <div className="container hero-slim">
          <SectionHeader
            eyebrow="Signature Competition"
            title="Design Tech Math Tournament"
            description="The Design Tech Math Club is hosting our biggest competition of the year, the Design Tech Math Tournament (DTMT), on March 8th. This is a competitive yet welcoming event for middle school students in the Bay Area. Competitors face a variety of creative individual and team problems in algebra, geometry, number theory, probability, and combinatorics that reward clever thinking and careful work. Modeled on established contests such as Mathcounts and other college-run competitions like BMT, the tournament gives students a chance to test their skills, learn new strategies, and meet other like-minded students!"
            align="center"
            titleClassName="dtmt-hero-title"
          />
          <div className="info-bar">
            <span>Sunday, March 8</span>
            <span>8:00 AM to 2:00 PM</span>
            <span>Design Tech High School</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="stat-grid">
            <StatBadge value="4" label="Rounds" />
            <StatBadge value="2" label="Speaker Session" />
            <StatBadge value="$3k" label="In Prizes" />
          </div>
          <div className="button-row">
            <a className="button button-ghost" href="https://drive.google.com" target="_blank" rel="noreferrer">
              Competition Handbook
            </a>
            <a className="button button-ghost" href="https://forms.gle" target="_blank" rel="noreferrer">
              Register Now!
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container card detail-grid">
          <div>
            <SectionHeader
              eyebrow="Format"
              title="Tournament Details"
              description="Students compete in subject rounds covering Algebra, Geometry, Discrete, and a 6th Grade Test, followed by a Team Round and Sequence Round. The activities session includes Professor Ciprian Manolescu's presentation on Knot Theory, random math problem sets, math jeopardy, and a relay round. Tiebreakers use a Mathcounts-style Countdown round. The full event runs from 8:00 AM to 2:00 PM, with lunch, snacks, and an awards ceremony included."
            />
          </div>
          <div className="registration-card">
            <p className="eyebrow">Registration</p>
            <h3>Closed</h3>
            <p>Deadline: March 3rd</p>
            <p>Fee: $10</p>
          </div>
        </div>
      </section>

      <section className="section section-muted">
        <div className="container">
          <SectionHeader eyebrow="Day Of" title="Schedule" />
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

      <section className="section">
        <div className="container">
          <SectionHeader eyebrow="Archive" title="Problems and Solutions" />
          <div className="archive-grid">
            <div className="card">
              <h3>DTMT 2026 Problems and Solutions</h3>
              {archives2026.map((entry) => (
                <div className="archive-row" key={entry}>
                  <span>{entry}</span>
                  <div className="archive-links">
                    <a href="https://drive.google.com" target="_blank" rel="noreferrer">
                      Problems
                    </a>
                    <a href="https://drive.google.com" target="_blank" rel="noreferrer">
                      Solutions
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="card">
              <h3>DTMT 2025 Problems and Solutions</h3>
              {archives2025.map((entry) => (
                <div className="archive-row" key={entry}>
                  <span>{entry}</span>
                  <div className="archive-links">
                    <a href="https://drive.google.com" target="_blank" rel="noreferrer">
                      Problems
                    </a>
                    <a href="https://drive.google.com" target="_blank" rel="noreferrer">
                      Solutions
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SponsorSection
        title="Our Sponsors"
        description="The Design Tech Math Tournament is sponsored by the following companies. We are grateful for their support, helping to fund this competition and our club activities."
        tiers={sponsorTiers}
        centered
      />
    </>
  );
}
