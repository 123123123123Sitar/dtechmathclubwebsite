export default function SponsorSection({ title, description, tiers, centered = false }) {
  return (
    <section className="section">
      <div className="container">
        <div className={`section-heading ${centered ? "section-heading-center" : ""}`}>
          <p className="eyebrow">Partners</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <div className="sponsor-tiers">
          {tiers.map((tier) => (
            <div className="card sponsor-tier" key={tier.name}>
              <div className="tier-header">
                <h3>{tier.name}</h3>
              </div>
              <div className="sponsor-grid">
                {tier.sponsors.map((sponsor) => (
                  <a
                    key={sponsor.name}
                    className="sponsor-tile"
                    href={sponsor.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span className="sponsor-name">{sponsor.name}</span>
                    <span className="sponsor-copy">{sponsor.copy}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
