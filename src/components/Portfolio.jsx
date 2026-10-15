import { useRef, useState } from "react";
import { Link } from "react-router";
import { availableProduct, publishedWorks, text, ui } from "../lib/content";
import { useLang } from "../lib/lang";
import CollectionHeader from "./CollectionHeader";
import ResponsiveImage from "./ResponsiveImage";
import { Localized } from "./Text";
import styles from "./Collection.module.css";
import portfolioStyles from "./Portfolio.module.css";

const KIND_LABELS = {
  painting: ui.kindPainting,
  drawing: ui.kindDrawing,
  aceo: ui.kindAceo,
  illustration: ui.kindIllustration,
  other: ui.kindOther,
};

/**
 * Gallery: Carla's work for viewing, not shopping (design §7.4). Works hang at their own
 * shapes with a museum-label caption; a click opens a larger view in a native <dialog>.
 */
export default function Portfolio({ page }) {
  const lang = useLang();
  const all = publishedWorks();
  const kinds = [...new Set(all.map((work) => work.kind))];
  const [kind, setKind] = useState(null);
  const shown = kind ? all.filter((work) => work.kind === kind) : all;

  const dialogRef = useRef(null);
  const [current, setCurrent] = useState(null);

  const open = (index) => {
    setCurrent(index);
    dialogRef.current.showModal();
  };
  const step = (delta) => setCurrent((index) => (index + delta + shown.length) % shown.length);

  return (
    <article className={styles.page}>
      <CollectionHeader page={page} />

      {kinds.length > 1 && (
        <div className={portfolioStyles.filters} role="group" aria-label={text(ui.filterByKind, lang)}>
          {[null, ...kinds].map((value) => (
            <button
              key={value ?? "all"}
              type="button"
              className={portfolioStyles.filter}
              aria-pressed={kind === value}
              onClick={() => setKind(value)}
            >
              <Localized value={value ? KIND_LABELS[value] : ui.all} />
            </button>
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <p className={`${styles.empty} texture-plaque`}>
          <Localized value={ui.portfolioComingSoon} />
        </p>
      ) : (
        <ul className={portfolioStyles.wall}>
          {shown.map((work, i) => (
            <li key={work.slug} className={portfolioStyles.work}>
              <figure>
                <button
                  type="button"
                  className={portfolioStyles.frame}
                  onClick={() => open(i)}
                  aria-label={`${text(ui.viewLarger, lang)}: ${text(work.title, lang)}`}
                >
                  <ResponsiveImage
                    className={portfolioStyles.image}
                    image={work.image}
                    sizes="(min-width: 1330px) 400px, (min-width: 720px) 45vw, 90vw"
                    alt=""
                    loading={i < 3 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </button>
                <WorkCaption work={work} />
              </figure>
            </li>
          ))}
        </ul>
      )}

      <dialog
        ref={dialogRef}
        className={portfolioStyles.viewer}
        aria-label={current != null ? text(shown[current].title, lang) : undefined}
        onClose={() => setCurrent(null)}
        onClick={(e) => e.target === e.currentTarget && dialogRef.current.close()}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
      >
        {current != null && (
          <div className={portfolioStyles.viewerInner}>
            <ResponsiveImage
              className={portfolioStyles.viewerImage}
              image={shown[current].image}
              sizes="90vw"
              alt={text(shown[current].title, lang)}
            />
            <WorkCaption work={shown[current]} />
            <div className={portfolioStyles.viewerControls}>
              {shown.length > 1 && (
                <button type="button" onClick={() => step(-1)}>
                  ← <Localized value={ui.previous} />
                </button>
              )}
              <button type="button" onClick={() => dialogRef.current.close()} autoFocus>
                <Localized value={ui.close} />
              </button>
              {shown.length > 1 && (
                <button type="button" onClick={() => step(1)}>
                  <Localized value={ui.next} /> →
                </button>
              )}
            </div>
          </div>
        )}
      </dialog>
    </article>
  );
}

/** Museum label: title, medium · year, description, and a link if the piece is for sale. */
function WorkCaption({ work }) {
  const forSale = availableProduct(work);
  return (
    <figcaption className={`${portfolioStyles.caption} texture-plaque`}>
      <strong className={portfolioStyles.title}>
        <Localized value={work.title} />
      </strong>
      {(work.medium || work.year) && (
        <span className={portfolioStyles.meta}>
          {work.medium && <Localized value={work.medium} />}
          {work.medium && work.year && " · "}
          {work.year}
        </span>
      )}
      {work.description && <Localized as="span" className={portfolioStyles.description} value={work.description} />}
      {forSale && (
        <Link className={portfolioStyles.forSale} to="/prints-and-paintings">
          <Localized value={ui.availableToBuy} /> →
        </Link>
      )}
    </figcaption>
  );
}
