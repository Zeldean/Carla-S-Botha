import { useId, useState } from "react";
import { formatPrice, text, ui } from "../lib/content";
import { whatsappUrl } from "../lib/whatsapp";
import ResponsiveImage from "./ResponsiveImage";
import { Localized } from "./Text";
import styles from "./ProductCard.module.css";

/**
 * One product (design §8.3, §10.3): photo, name, description, details, price,
 * options and a WhatsApp order link that includes the chosen option.
 */
export default function ProductCard({ product }) {
  const selectId = useId();
  const [option, setOption] = useState(0);
  const chosen = product.options[option];
  const order = whatsappUrl("product", {
    product: text(product.name, "en"),
    option: chosen ? ` (${text(chosen, "en")})` : "",
  });
  const price = formatPrice(product.price);

  return (
    <article className={`${styles.card} texture-plaque`}>
      <div className={styles.photo}>
        <ResponsiveImage
          className={styles.image}
          image={product.image}
          sizes="(min-width: 1330px) 360px, (min-width: 720px) 45vw, 90vw"
          alt=""
          loading="lazy"
          decoding="async"
        />
        {product.status === "made-to-order" && (
          <span className={styles.badge}>
            <Localized value={ui.madeToOrder} />
          </span>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.name}>
          <Localized value={product.name} />
        </h3>
        <Localized as="p" value={product.description} />

        {(product.intendedUse || product.medium || product.dimensions) && (
          <dl className={styles.details}>
            {product.intendedUse && <Detail label={ui.use} value={product.intendedUse} />}
            {product.medium && <Detail label={ui.medium} value={product.medium} />}
            {product.dimensions && <Detail label={ui.size} value={product.dimensions} />}
          </dl>
        )}

        <div className={styles.buy}>
          <p className={styles.price}>{price ?? <Localized value={ui.priceOnEnquiry} />}</p>

          {product.options.length > 0 && (
            <div className={styles.option}>
              <label htmlFor={selectId}>
                <Localized value={ui.option} />
              </label>
              <select id={selectId} value={option} onChange={(e) => setOption(Number(e.target.value))}>
                {product.options.map((value, i) => (
                  <option key={i} value={i}>
                    {text(value, "af") === text(value, "en") ? text(value, "af") : `${text(value, "af")} / ${text(value, "en")}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {order && (
            <a className={styles.order} href={order} target="_blank" rel="noopener noreferrer">
              <Localized value={ui.orderWhatsapp} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt><Localized value={label} /></dt>
      <dd><Localized value={value} /></dd>
    </div>
  );
}
