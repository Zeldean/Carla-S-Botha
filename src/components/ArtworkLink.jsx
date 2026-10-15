import { Link } from "react-router";
import { text } from "../lib/content";
import { useLang } from "../lib/lang";
import Plaque from "./Plaque";
import ResponsiveImage from "./ResponsiveImage";
import styles from "./ArtworkLink.module.css";

// Slot width per breakpoint (see Room.module.css), for the browser's srcset choice.
const SIZES = "(min-width: 1330px) 400px, (min-width: 720px) 34vw, 90vw";

/**
 * One artwork on a wall: square slot + image + plaque, linking to its destination (spec §7.2–7.3).
 * The link is named by the plaque title and described by the image's alt text.
 */
export default function ArtworkLink({ artwork, target, roomSlug, priority = false }) {
  const lang = useLang();
  const id = `${roomSlug}-${artwork.to}`;

  return (
    <Link
      className={styles.artwork}
      to={`/${artwork.to}`}
      state={{ from: roomSlug }}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-image`}
      data-shape={artwork.shape}
      data-size={artwork.size}
      data-placeholder={artwork.image.placeholder || undefined}
    >
      <span className={styles.slot}>
        <ResponsiveImage
          id={`${id}-image`}
          className={styles.image}
          image={artwork.image}
          sizes={SIZES}
          alt={text(artwork.alt, lang)}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          decoding="async"
        />
      </span>
      <Plaque className={styles.plaque} title={target.title} label={artwork.label} titleId={`${id}-title`} />
    </Link>
  );
}
