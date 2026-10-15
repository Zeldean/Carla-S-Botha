import { Link } from "react-router";
import { ui } from "../lib/content";
import { Localized } from "./Text";
import styles from "./NotFound.module.css";

/** Shared "not on the wall yet" page for unknown URLs (replaces the two old copies). */
export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <h1 tabIndex={-1}>
        <Localized value={ui.notFound} />
      </h1>
      <Link to="/" className={styles.link}>
        <Localized value={ui.mainGallery} />
      </Link>
    </div>
  );
}
