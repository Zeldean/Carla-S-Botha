import { Link } from "react-router";
import { FREEBIE_CATEGORIES } from "../lib/constants";
import { formatBytes, freebieCategoryTitle, publishedFreebies, text, ui } from "../lib/content";
import { useLang } from "../lib/lang";
import CollectionHeader from "./CollectionHeader";
import ResponsiveImage from "./ResponsiveImage";
import { Localized, Title } from "./Text";
import styles from "./Collection.module.css";
import cardStyles from "./FreebieList.module.css";

/**
 * Freebies (all, grouped) and Mindfulness Freebies (filtered): the same freebie files,
 * so a resource added once shows in both places (design §8.4, §11). Empty categories
 * still show, with a coming-soon card (D3).
 */
export default function FreebieList({ page }) {
  const categories = page.filter ? [page.filter.category] : FREEBIE_CATEGORIES;

  return (
    <article className={styles.page}>
      <CollectionHeader page={page} />

      {categories.map((category) => (
        <section
          key={category}
          className={styles.category}
          aria-labelledby={page.filter ? undefined : `freebies-${category}`}
        >
          {!page.filter && (
            <h2 id={`freebies-${category}`} className={styles.categoryTitle}>
              <Title title={freebieCategoryTitle(category)} />
            </h2>
          )}
          <FreebieGrid items={publishedFreebies(category)} />
        </section>
      ))}

      {page.filter && (
        <Link className={cardStyles.more} to="/freebies">
          <Localized value={ui.moreFreebies} /> →
        </Link>
      )}
    </article>
  );
}

function FreebieGrid({ items }) {
  if (items.length === 0) {
    return (
      <p className={`${styles.empty} texture-plaque`}>
        <Localized value={ui.freebiesComingSoon} />
      </p>
    );
  }
  return (
    <div className={styles.grid}>
      {items.map((freebie) => (
        <FreebieCard key={freebie.slug} freebie={freebie} />
      ))}
    </div>
  );
}

function FreebieCard({ freebie }) {
  const lang = useLang();
  const { href, external, format, size } = freebie.download;
  const details = [format, size != null && formatBytes(size)].filter(Boolean).join(", ");

  return (
    <article className={`${cardStyles.card} texture-plaque`}>
      <div className={cardStyles.cover}>
        <ResponsiveImage
          className={cardStyles.image}
          image={freebie.cover}
          sizes="(min-width: 1330px) 360px, (min-width: 720px) 45vw, 90vw"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className={cardStyles.body}>
        <h3 className={cardStyles.title}>
          <Localized value={freebie.title} />
        </h3>
        <Localized as="p" value={freebie.description} />
        {freebie.audience && (
          <p className={cardStyles.audience}>
            <Localized value={ui.audience} />: <Localized value={freebie.audience} />
          </p>
        )}
        <a
          className={cardStyles.download}
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : { download: "" })}
          aria-label={`${text(ui.download, lang)}: ${text(freebie.title, lang)}${details ? ` (${details})` : ""}`}
        >
          <Localized value={ui.download} />
          {details && <span className={cardStyles.details}>{details}</span>}
        </a>
      </div>
    </article>
  );
}
