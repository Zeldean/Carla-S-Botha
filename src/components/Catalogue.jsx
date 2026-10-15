import { Link } from "react-router";
import { CATEGORY_ROOMS, catalogueProducts, pages, rooms, site, ui } from "../lib/content";
import CollectionHeader from "./CollectionHeader";
import ProductCard from "./ProductCard";
import ResponsiveImage from "./ResponsiveImage";
import { Localized, Title } from "./Text";
import styles from "./Collection.module.css";

/**
 * Prints and Paintings, Mindfulness Products and the Shop: one product pool, filtered by
 * category or shown grouped (spec §3.1, §5.4; design §7.5, §8.3, §10). Empty categories
 * still show, with that category's WhatsApp catalogue (D3).
 */
export default function Catalogue({ page }) {
  const categories = page.filter ? [page.filter.category] : Object.keys(CATEGORY_ROOMS);

  return (
    <article className={styles.page}>
      <CollectionHeader page={page} />

      {categories.map((category) => (
        <CategorySection key={category} category={category} showHeading={!page.filter} />
      ))}

      {page.services.length > 0 && <Services slugs={page.services} />}
    </article>
  );
}

function CategorySection({ category, showHeading }) {
  const items = catalogueProducts(category);
  const catalog = site.whatsapp.catalogs[category] ?? site.whatsapp.catalogs.all;
  const headingId = `category-${category}`;

  return (
    <section className={styles.category} aria-labelledby={showHeading ? headingId : undefined}>
      {showHeading && (
        <h2 id={headingId} className={styles.categoryTitle}>
          <Title title={rooms[CATEGORY_ROOMS[category]].title} />
        </h2>
      )}

      {items.length > 0 ? (
        <div className={styles.grid}>
          {items.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <p className={`${styles.empty} texture-plaque`}>
          <Localized value={ui.noProductsYet} />
        </p>
      )}

      {catalog && (
        <a className={styles.catalog} href={catalog} target="_blank" rel="noopener noreferrer">
          <Localized value={ui.browseCatalogue} />
        </a>
      )}
    </section>
  );
}

/** Shop: services aren't products, but visitors should find them from here (design §10.2). */
function Services({ slugs }) {
  return (
    <section className={styles.category} aria-labelledby="services">
      <h2 id="services" className={styles.categoryTitle}>
        <Localized value={ui.services} />
      </h2>
      <ul className={styles.services}>
        {slugs.map((slug) => {
          const service = pages[slug];
          return (
            <li key={slug}>
              <Link className={`${styles.service} texture-plaque`} to={`/${slug}`}>
                <ResponsiveImage className={styles.serviceImage} image={service.image} sizes="96px" alt="" loading="lazy" />
                <span className={styles.serviceTitle}>
                  <Title title={service.title} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
