import { useLocation } from "react-router";
import { parentRoom } from "../lib/content";
import Breadcrumbs from "./Breadcrumbs";
import Markdown from "./Markdown";
import { Localized, Title } from "./Text";
import styles from "./Collection.module.css";

/** Breadcrumb, title, description and optional Markdown intro for catalogue, freebies and portfolio pages. */
export default function CollectionHeader({ page }) {
  const location = useLocation();
  const parent = parentRoom(page, location.state?.from);
  const { af, en } = page.body;

  return (
    <>
      <Breadcrumbs parent={parent} current={page} />
      <header className={styles.header}>
        <h1 className={styles.title} tabIndex={-1}>
          <Title title={page.title} />
        </h1>
        <Localized as="p" className={styles.description} value={page.description} />
        {(af || en) && (
          <div className={styles.intro}>
            {af && en ? (
              <>
                <div lang="af" data-l="af"><Markdown>{af}</Markdown></div>
                <div lang="en" data-l="en"><Markdown>{en}</Markdown></div>
              </>
            ) : (
              <div lang={af ? "af" : "en"}><Markdown>{af ?? en}</Markdown></div>
            )}
          </div>
        )}
      </header>
    </>
  );
}
