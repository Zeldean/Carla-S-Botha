import { Link, useLocation } from "react-router";
import { CATEGORY_ROOMS, catalogueProducts, pages, parentRoom, rooms, site, ui } from "../lib/content";
import Breadcrumbs from "./Breadcrumbs";
import Markdown from "./Markdown";
import ProductCard from "./ProductCard";
import ResponsiveImage from "./ResponsiveImage";
import { Localized, Title } from "./Text";
import styles from "./Catalogue.module.css";

/**
 * Prints and Paintings, Mindfulness Products and the Shop: one product pool, filtered by
 * category or shown grouped (spec §3.1, §5.4; design §7.5, §8.3, §10). Empty categories
 * still show, with that category's WhatsApp catalogue (D3).
 */
export default function Catalogue({ page }) {
  const location = useLocation();
  const parent = parentRoom(page, location.state?.from);
  const categories = page.filter ? [page.filter.category] : Object.keys(CATEGORY_ROOMS);
  const intro = page.body.af ?? page.body.en;

  return (
    <article className={styles.page}>
      <Breadcrumbs parent={parent} current={page} />

      <header className={styles.header}>
        <h1 className={styles.title} tabIndex={-1}>
          <Title title={page.title} />
        </h1>
        <Localized as="p" className={styles.description} value={page.description} />
        {intro && (
          <div className={styles.intro}>
            {page.body.af && page.body.en ? (
              <>
                <div lang="af" data-l="af"><Markdown>{page.body.af}</Markdown></div>
                <div lang="en" data-l="en"><Markdown>{page.body.en}</Markdown></div>
              </>
            ) : (
              <Markdown>{intro}</Markdown>
            )}
          </div>
        )}
      </header>

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
