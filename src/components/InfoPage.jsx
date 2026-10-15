import { useLocation } from "react-router";
import { parentRoom } from "../lib/content";
import Breadcrumbs from "./Breadcrumbs";
import EnquiryCTA from "./EnquiryCTA";
import PageBody from "./PageBody";
import ResponsiveImage from "./ResponsiveImage";
import { Title } from "./Text";
import styles from "./InfoPage.module.css";

/**
 * Text pages: About, Kunslesse, Breinprofiele, Meer oor ons, Ekstra klasse, Toesprake (spec §7.6).
 * The artwork and enquiry button stay in view beside the text on desktop.
 * `layout: "personal"` (About) frames each section and adds handwritten accents.
 */
export default function InfoPage({ page }) {
  const location = useLocation();
  const parent = parentRoom(page, location.state?.from);

  return (
    <article className={styles.page} data-layout={page.layout}>
      <Breadcrumbs parent={parent} current={page} />

      <div className={styles.layout}>
        <aside className={styles.aside}>
          <ResponsiveImage
            className={styles.image}
            image={page.image}
            sizes="(min-width: 720px) 40vw, 90vw"
            alt=""
            fetchPriority="high"
          />
          <EnquiryCTA cta={page.cta} page={page} className={styles.asideCta} />
        </aside>

        <div className={styles.copy}>
          <h1 className={styles.title} tabIndex={-1}>
            <Title title={page.title} />
          </h1>
          <PageBody page={page} className={styles.body} noteClassName={styles.note} />
          <EnquiryCTA cta={page.cta} page={page} className={styles.endCta} />
        </div>
      </div>
    </article>
  );
}
