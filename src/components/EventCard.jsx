import { Link } from "react-router-dom";

export default function EventCard({ title, date, location, accent, imageLabel, to }) {
  return (
    <article className="event-card">
      <div className={`event-card-image ${accent}`}>
        <div className="event-card-image-overlay">
          <span>{imageLabel}</span>
        </div>
      </div>
      <div className="event-card-body">
        <p className="eyebrow">{date}</p>
        <h3>{title}</h3>
        <p>{location}</p>
        <div className="event-card-actions">
          <Link to={to} className="text-link">
            More info
          </Link>
          <Link to={to} className="button button-small">
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
