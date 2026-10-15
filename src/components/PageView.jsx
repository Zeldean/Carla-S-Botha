import { useLocation } from "react-router";
import { parentRoom, ui } from "../lib/content";
import { whatsappUrl } from "../lib/whatsapp";
import Breadcrumbs from "./Breadcrumbs";
import Markdown from "./Markdown";
import { Localized, Title } from "./Text";
import styles from "./PageView.module.css";

// Interim page view for every page type. Task 4 turns it into InfoPage + EnquiryCTA;
// catalogue, freebies and portfolio get their own components in tasks 5–7.
export default function PageView({ page }) {
  const location = useLocation();
  const parent = parentRoom(page, location.state?.from);
  const enquiry = page.cta && whatsappUrl(page.cta.template, { page: page.title.en });

  return (
    <article className={styles.page}>
      <Breadcrumbs parent={parent} current={page} />

      <div className={styles.layout}>
        <img
          className={styles.image}
          src={page.image.src}
          width={page.image.width}
          height={page.image.height}
          alt=""
        />

        <div className={styles.copy}>
          <h1 className={styles.title} tabIndex={-1}>
            <Title title={page.title} />
          </h1>
          <PageBody page={page} />
          {enquiry && (
            <a className={styles.cta} href={enquiry} target="_blank" rel="noopener noreferrer">
              <Localized value={page.cta.label} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

/** Both languages when available (CSS shows the toggled one); otherwise the one there is, plus a note. */
function PageBody({ page }) {
  const { af, en } = page.body;

  if (af && en) {
    return (
      <>
        <div className={styles.body} lang="af" data-l="af"><Markdown>{af}</Markdown></div>
        <div className={styles.body} lang="en" data-l="en"><Markdown>{en}</Markdown></div>
      </>
    );
  }

  if (af || en) {
    const only = af ? "af" : "en";
    const other = af ? "en" : "af";
    const note = af ? ui.onlyAfrikaans : ui.onlyEnglish;
    return (
      <>
        <p className={styles.note} lang={other} data-l={other}>{note[other]}</p>
        <div className={styles.body} lang={only}><Markdown>{af ?? en}</Markdown></div>
      </>
    );
  }

  return (
    <p className={styles.note}>
      <Localized value={page.type === "info" ? ui.roomSetup : ui.comingSoon} />
    </p>
  );
}
