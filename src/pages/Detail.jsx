import { Link, useParams } from "react-router-dom";
import { GalleryItems } from "../data/gallery";
import "./Detail.css";

const findDetail = (slug, items = GalleryItems) => {
  for (const item of items) {
    if (item.pageType === "detail" && item.slug === slug) {
      return item;
    }

    if (item.items) {
      const nestedItem = findDetail(slug, item.items);

      if (nestedItem) {
        return nestedItem;
      }
    }
  }

  return null;
};

const Detail = () => {
  const { slug } = useParams();
  const item = findDetail(slug);

  if (!item) {
    return (
      <div className="museum-wall texture-wall">
        <main className="missing-page">
          <h1>This detail page is not on the wall yet.</h1>
          <Link className="text-link" to="/">
            Return to gallery
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="museum-wall texture-wall">
      
      <nav>
        <Link className="back-link" to="/">
          Back to gallery
        </Link>
      </nav>

      <main className="detail-page">
        <section className="detail-room" aria-labelledby="detail-title">
          <img className="detail-image" src={item.image} alt={item.title} />

          <article className="detail-copy">
            <h1 id="detail-title">{item.title}</h1>
            <p className="detail-description">{item.description}</p>
          </article>
        </section>
      </main>

      <div className="museum-floor texture-floor" aria-hidden="true" />
    </div>
  );
};

export default Detail;
