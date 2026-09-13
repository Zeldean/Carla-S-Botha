import { Link, useParams } from "react-router-dom";
import { GalleryItems } from "../data/gallery";
import "./Gallery.css";

const findGallery = (slug) =>
  GalleryItems.find(
    (item) => item.pageType === "gallery" && item.slug === slug,
  );

const Gallery = () => {
  const { slug } = useParams();
  const gallery = slug ? findGallery(slug) : null;
  const items = slug ? (gallery?.items ?? []) : GalleryItems;

  if (slug && !gallery) {
    return (
      <div className="museum-wall texture-wall">
        <main className="missing-page">
          <h1>This gallery is not on the wall yet.</h1>
          <Link className="text-link" to="/">
            Return to gallery
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="museum-wall texture-wall">
      <main className="gallery-page" aria-label="Gallery navigation">
        <div className="gallery-rail">
          {items.map((item) => (
            <Link
              className={`painting-link painting-link--${item.shape}`}
              to={`/${item.pageType}/${item.slug}`}
              key={item.slug}
              aria-label={`Open ${item.title}`}
            >
              <span className="painting-slot">
                <img
                  className="painting-image"
                  src={item.image}
                  alt={item.title}
                />
              </span>
              <span className="painting-plaque texture-plaque">
                {item.title}
              </span>
            </Link>
          ))}
        </div>
      </main>

      <div className="museum-floor texture-floor" aria-hidden="true" />
3    </div>
  );
};

export default Gallery;
