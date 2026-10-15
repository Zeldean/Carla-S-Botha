import { getEntry, rooms, site } from "../lib/content";
import ArtworkLink from "./ArtworkLink";
import Breadcrumbs from "./Breadcrumbs";
import { Localized, Title } from "./Text";
import styles from "./Room.module.css";

// Column counts are picked from the number of artworks so rows stay balanced
// (6 → 3 + 3 instead of 4 + 2).
const desktopColumns = (count) => (count <= 4 ? count : count % 3 === 0 ? 3 : 4);
const tabletColumns = (count) => (count % 3 === 0 ? 3 : 2);

/** A gallery room: heading, wall of artworks, per-room atmosphere (spec §7.2, §7.4). */
export default function Room({ room }) {
  const isHome = room.slug === "home";
  const count = room.artworks.length;

  return (
    <div
      className={styles.room}
      data-theme={room.theme}
      style={{ "--cols": desktopColumns(count), "--cols-tablet": tabletColumns(count) }}
    >
      <div className={styles.tint} aria-hidden="true" />

      {room.decor.map((item) => (
        <img
          key={item.image.src}
          className={styles.decor}
          data-position={item.position}
          data-size={item.size}
          src={item.image.src}
          width={item.image.width}
          height={item.image.height}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
      ))}

      <div className={styles.heading}>
        {!isHome && <Breadcrumbs parent={rooms.home} current={room} />}
        <h1 className={styles.title} tabIndex={-1}>
          {isHome ? site.brand : <Title title={room.title} />}
        </h1>
        {room.intro && <Localized as="p" className={styles.intro} value={room.intro} />}
      </div>

      <ul className={styles.wall}>
        {room.artworks.map((artwork, i) => (
          <li
            key={artwork.to}
            className={styles.item}
            data-size={artwork.size}
            data-placed={artwork.place ? "" : undefined}
            style={{
              "--nx": artwork.nudge?.x,
              "--ny": artwork.nudge?.y,
              "--nr": artwork.nudge?.rotate,
              "--col": artwork.place?.col,
              "--row": artwork.place?.row,
              "--span": artwork.place?.span,
            }}
          >
            <ArtworkLink artwork={artwork} target={getEntry(artwork.to)} roomSlug={room.slug} priority={i === 0} />
          </li>
        ))}
      </ul>
    </div>
  );
}
