import { Link } from "react-router";
import { getEntry, site, ui } from "../lib/content";
import { whatsappUrl } from "../lib/whatsapp";
import { Localized, Title } from "./Text";
import styles from "./Footer.module.css";

/** Brand, contact, socials and the main sections (design §12). Contact rows appear once set in site.json. */
export default function Footer() {
  const { email, phone } = site.contact;
  const whatsapp = whatsappUrl("general");
  const hasContact = email || phone || whatsapp || site.socials.length > 0;

  return (
    <footer className={styles.footer}>
      <div className={styles.brand}>
        <p className={styles.name}>{site.brand}</p>
        <Localized as="p" value={site.tagline} />
      </div>

      <nav aria-label={site.brand}>
        <ul className={styles.list}>
          {site.nav.map((slug) => (
            <li key={slug}>
              <Link to={`/${slug}`}>
                <Title title={getEntry(slug).title} />
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {hasContact && (
        <div>
          <h2 className={styles.heading}>
            <Localized value={ui.contact} />
          </h2>
          <ul className={styles.list}>
            {whatsapp && (
              <li>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`}>{email}</a>
              </li>
            )}
            {phone && (
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
              </li>
            )}
            {site.socials.map((social) => (
              <li key={social.url}>
                <a href={social.url} target="_blank" rel="noopener noreferrer">{social.name}</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </footer>
  );
}
