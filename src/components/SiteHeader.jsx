import { useState } from "react";
import { Link, NavLink } from "react-router";
import { getEntry, site, text, ui } from "../lib/content";
import { useLang } from "../lib/lang";
import { whatsappUrl } from "../lib/whatsapp";
import LanguageToggle from "./LanguageToggle";
import { Localized, Title } from "./Text";
import styles from "./SiteHeader.module.css";

/** Always-available navigation (design §5.2, §13.2): brand → home, the six sections, language, WhatsApp. */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const lang = useLang();
  const whatsapp = whatsappUrl("general");

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        {site.brand}
      </Link>

      <button
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((value) => !value)}
      >
        <Localized value={ui.menu} />
      </button>

      <nav id="site-nav" className={styles.nav} data-open={open} aria-label={text(ui.menu, lang)}>
        <ul className={styles.navList}>
          {site.nav.map((slug) => (
            <li key={slug}>
              <NavLink to={`/${slug}`} className={styles.navLink} onClick={() => setOpen(false)}>
                <Title title={getEntry(slug).title} />
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.tools}>
        <LanguageToggle />
        {whatsapp && (
          <a className={styles.whatsapp} href={whatsapp} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        )}
      </div>
    </header>
  );
}
