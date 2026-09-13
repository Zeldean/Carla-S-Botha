import { Link } from "react-router-dom";
import { GalleryItems } from "../data/gallery";
import "./Home.css";

const Home = () => {
  return (
    <div className="museum-page texture-wall">
      <main className="gallery-room" aria-label="Gallery navigation">
        <div className="gallery-rail">
          {GalleryItems.map((item) => (
            <Link
              className={`painting-link painting-link--${item.shape}`}
              to={`/gallery/${item.slug}`}
              key={item.slug}
              aria-label={`Open ${item.title}`}
            >
              <span className="painting-slot">
                <img className="painting-image" src={item.image} alt={item.title} />
              </span>
              <span className="painting-plaque texture-plaque">{item.title}</span>
            </Link>
          ))}
        </div>

        <div className="gallery-floor texture-floor" aria-hidden="true" />
      </main>
    </div>
  );
};

export default Home;
