import { Link } from "react-router-dom";
import { GalleryItems } from "../data/gallery";
import "./Home.css"

const Home = () => {
  return (
    <div className="museum-page">
      <main className="gallery-room" aria-label="Gallery navigation">
        <div className="ceiling-light ceiling-light--left" />
        <div className="ceiling-light ceiling-light--right" />
        <div className="graffiti-overlay" aria-hidden="true" />
        <div className="gallery-rail">
          {GalleryItems.map((item) => (
            <Link
              className={`painting-link painting-link--${item.shape}`}
              to={`/gallery/${item.slug}`}
              key={item.slug}
              aria-label={`Open ${item.title}`}
            >
              <span className="painting-frame">
                <span className={`painting-art painting-art--${item.palette}`}>
                  <span className="painting-mark" />
                </span>
              </span>
              <span className="painting-caption">
                <span>{item.label}</span>
                <strong>{item.title}</strong>
              </span>
            </Link>
          ))}
        </div>
        <div className="gallery-bench" aria-hidden="true" />
      </main>
    </div>
  );
}

export default Home;
