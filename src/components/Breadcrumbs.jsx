import { Link } from "react-router";
import { text, ui } from "../lib/content";
import { useLang } from "../lib/lang";
import { Localized, Title } from "./Text";
import styles from "./Breadcrumbs.module.css";

/** "Main gallery › Kuns / Art › Kunslesse / Art Lessons". The parent link is the "back to room" link. */
export default function Breadcrumbs({ parent, current }) {
  const lang = useLang();

  return (
    <nav className={styles.breadcrumbs} aria-label={text(ui.breadcrumb, lang)}>
      <ol className={styles.list}>
        <li>
          <Link to="/">
            <Localized value={ui.mainGallery} />
          </Link>
        </li>
        {parent && parent.slug !== "home" && (
          <li>
            <Link to={`/${parent.slug}`}>
              <Title title={parent.title} />
            </Link>
          </li>
        )}
        <li aria-current="page">
          <Title title={current.title} />
        </li>
      </ol>
    </nav>
  );
}
