import { useState } from "react";
import { Link, NavLink } from "react-router";
import { getEntry, site, text, ui } from "../lib/content";
import { useLang } from "../lib/lang";
import { whatsappUrl } from "../lib/whatsapp";
import LanguageToggle from "./LanguageToggle";
import { Localized, Title } from "./Text";
import styles from "./SiteHeader.module.css";

/**
 * Always-available navigation (design §5.2, §13.2).
 * Below desktop: logo · language · burger, and the menu (with WhatsApp) drops down.
 * Desktop: logo · six sections · language + WhatsApp.
 */
export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const lang = useLang();
  const whatsapp = whatsappUrl("general");

  const whatsappLink = (className) =>
    whatsapp && (
      <a className={className} href={whatsapp} target="_blank" rel="noopener noreferrer">
        WhatsApp
      </a>
    );

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand}>
        {site.brand}
      </Link>

      <div className={styles.tools}>
        <LanguageToggle />
        {whatsappLink(`${styles.whatsapp} ${styles.desktopOnly}`)}
      </div>

      <button
        type="button"
        className={styles.menuButton}
        aria-expanded={open}
        aria-controls="site-nav"
        onClick={() => setOpen((value) => !value)}
      >
        <svg className={styles.burger} viewBox="0 0 24 24" aria-hidden="true">
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
        <Localized className="visually-hidden" value={ui.menu} />
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
        {whatsappLink(`${styles.whatsapp} ${styles.menuOnly}`)}
      </nav>
    </header>
  );
}
