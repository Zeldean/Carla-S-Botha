import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { ui } from "../lib/content";
import Footer from "./Footer";
import SiteHeader from "./SiteHeader";
import { Localized } from "./Text";
import styles from "./MuseumLayout.module.css";

/** Shell for every route: skip link, header, wall, footer. */
export default function MuseumLayout({ children }) {
  const { pathname } = useLocation();
  const isFirstRender = useRef(true);

  // After client-side navigation, move focus to the new page's heading so screen-reader
  // and keyboard users start at the new content (ScrollRestoration handles scroll).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    document.querySelector("#main h1")?.focus();
  }, [pathname]);

  return (
    <div className={`${styles.shell} texture-wall`}>
      <a href="#main" className={styles.skipLink}>
        <Localized value={ui.skipToContent} />
      </a>
      <SiteHeader />
      <main id="main" className={styles.main}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
