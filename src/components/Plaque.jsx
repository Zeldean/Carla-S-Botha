import { Localized, Title } from "./Text";
import styles from "./Plaque.module.css";

/**
 * Museum label (spec §7.3). The destination title shows both languages and names the link
 * (via `titleId`); the optional lines follow the language toggle.
 */
export default function Plaque({ title, label = {}, titleId, className = "" }) {
  const { artworkTitle, medium, blurb, invite } = label;

  return (
    <span className={`${styles.plaque} texture-plaque ${className}`}>
      <span id={titleId} className={styles.title}>
        <Title title={title} />
      </span>
      {artworkTitle && <Localized className={styles.artworkTitle} value={artworkTitle} />}
      {medium && <Localized className={styles.medium} value={medium} />}
      {blurb && <Localized className={styles.blurb} value={blurb} />}
      {invite && <Localized className={styles.invite} value={invite} />}
    </span>
  );
}
