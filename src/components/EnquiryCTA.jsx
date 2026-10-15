import { whatsappUrl } from "../lib/whatsapp";
import { Localized } from "./Text";
import styles from "./EnquiryCTA.module.css";

/**
 * WhatsApp enquiry button with a prefilled English message (spec §11, D7).
 * Renders nothing until the WhatsApp number is set in site.json.
 */
export default function EnquiryCTA({ cta, page, className = "" }) {
  const href = cta && whatsappUrl(cta.template, { page: page.title.en });
  if (!href) return null;

  return (
    <a className={`${styles.cta} ${className}`} href={href} target="_blank" rel="noopener noreferrer">
      <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z" />
        <path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.5-2-1-1 1c-1.2-.5-2.5-1.8-3-3l1-1-1-2L9 8.5Z" />
      </svg>
      <Localized value={cta.label} />
    </a>
  );
}
