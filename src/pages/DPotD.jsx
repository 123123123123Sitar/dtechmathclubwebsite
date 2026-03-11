import { Link } from "react-router-dom";

export default function DPotD() {
  return (
    <section className="section section-top">
      <div className="container">
        <div className="empty-state tall">
          <p className="eyebrow">d.PotD</p>
          <h1>Page Under Construction</h1>
          <p>
            The original d.PotD page currently behaves like a 404, so this portal is
            represented as a placeholder for now.
          </p>
          <Link className="button" to="/competitions">
            View Competitions
          </Link>
        </div>
      </div>
    </section>
  );
}
