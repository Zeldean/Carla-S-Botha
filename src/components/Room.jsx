import { Link } from "react-router";
import { getEntry, rooms, site, text } from "../lib/content";
import { useLang } from "../lib/lang";
import Breadcrumbs from "./Breadcrumbs";
import { Localized, Title } from "./Text";
import styles from "./Room.module.css";

// Interim wall: carries the current layout over to the new content model.
// Task 3 replaces it with shape/size/placement variants and the full plaque.
export default function Room({ room }) {
  const lang = useLang();
  const isHome = room.slug === "home";

  return (
    <div className={styles.room}>
      <div className={styles.heading}>
        {!isHome && <Breadcrumbs parent={rooms.home} current={room} />}
        <h1 className={styles.title} tabIndex={-1}>
          {isHome ? site.brand : <Title title={room.title} />}
        </h1>
        {room.intro && <Localized as="p" className={styles.intro} value={room.intro} />}
      </div>

      <ul className={styles.wall}>
        {room.artworks.map((artwork, i) => {
          const id = `${room.slug}-${artwork.to}`;
          return (
            <li key={artwork.to}>
              <Link
                className={styles.artwork}
                to={`/${artwork.to}`}
                state={{ from: room.slug }}
                aria-labelledby={`${id}-label`}
                aria-describedby={`${id}-image`}
              >
                <span className={styles.slot}>
                  <img
                    id={`${id}-image`}
                    className={styles.image}
                    src={artwork.image.src}
                    width={artwork.image.width}
                    height={artwork.image.height}
                    alt={text(artwork.alt, lang)}
                    loading={i === 0 ? "eager" : "lazy"}
                    fetchPriority={i === 0 ? "high" : undefined}
                  />
                </span>
                <span id={`${id}-label`} className={`${styles.plaque} texture-plaque`}>
                  <Title title={getEntry(artwork.to).title} />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
