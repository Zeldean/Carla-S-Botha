import { Link, useParams } from "react-router-dom";
import { GalleryItems } from "../data/gallery";
import "./Home.css";

export default function GalleryDetail() {
  const { slug } = useParams();
  const item = GalleryItems.find((galleryItem) => galleryItem.slug === slug);

  if (!item) {
    return (
      <main className="detail-page detail-page--missing">
        <p className="museum-kicker">Room not found</p>
        <h1>This painting is not on the wall yet.</h1>
        <Link className="text-link" to="/">
          Return to the gallery
        </Link>
      </main>
    );
  }

  return (
    <main className="detail-page">
      <div className="graffiti-overlay graffiti-overlay--detail" aria-hidden="true" />

      <Link className="text-link" to="/">
        Gallery
      </Link>

      <section className="detail-room" aria-labelledby="detail-title">
        <img className="detail-image" src={item.image} alt={item.title} />

        <article className="detail-copy">
          <p className="museum-kicker">{item.label}</p>
          <h1 id="detail-title">{item.title}</h1>
          <p>{item.description}</p>
          <p>
            This is temporary demo text. In the finished site, this room can
            hold artwork notes, images, shop links, or a more personal page.
          </p>
        </article>
      </section>

      <div className="gallery-floor" aria-hidden="true" />
    </main>
  );
}
