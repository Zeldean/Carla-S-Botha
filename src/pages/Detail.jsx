import { Link, useParams } from "react-router-dom";
import { GalleryItems } from "../data/gallery";

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
      <main className="detail-page texture-wall detail-page--missing">
        <h1>This detail page is not on the wall yet.</h1>
        <Link className="text-link" to="/">
          Return to gallery
        </Link>
      </main>
    );
  }

  return (
    <main className="detail-page texture-wall">
      <Link className="back-link" to="/">
        Back to gallery
      </Link>

      <section className="detail-room" aria-labelledby="detail-title">
        <img className="detail-image" src={item.image} alt={item.title} />

        <article className="detail-copy">
          <h1 id="detail-title">{item.title}</h1>
          <p className="detail-description">{item.description}</p>
        </article>
      </section>

      <div className="gallery-floor texture-floor" aria-hidden="true" />
    </main>
  );
};

export default Detail;
