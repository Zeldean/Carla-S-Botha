import { useLocation } from "react-router";
import { parentRoom } from "../lib/content";
import Breadcrumbs from "./Breadcrumbs";
import EnquiryCTA from "./EnquiryCTA";
import PageBody from "./PageBody";
import ResponsiveImage from "./ResponsiveImage";
import { Title } from "./Text";
import styles from "./PageView.module.css";

// Interim view for catalogue, freebies and portfolio pages until they get their own
// components (tasks 5–7). Info pages use InfoPage.
export default function PageView({ page }) {
  const location = useLocation();
  const parent = parentRoom(page, location.state?.from);

  return (
    <article className={styles.page}>
      <Breadcrumbs parent={parent} current={page} />

      <div className={styles.layout}>
        <ResponsiveImage
          className={styles.image}
          image={page.image}
          sizes="(min-width: 720px) 40vw, 90vw"
          alt=""
          fetchPriority="high"
        />

        <div className={styles.copy}>
          <h1 className={styles.title} tabIndex={-1}>
            <Title title={page.title} />
          </h1>
          <PageBody page={page} className={styles.body} noteClassName={styles.note} />
          <EnquiryCTA cta={page.cta} page={page} className={styles.cta} />
        </div>
      </div>
    </article>
  );
}
