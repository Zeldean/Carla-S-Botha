import { text, ui } from "../lib/content";
import { setLang, useLang } from "../lib/lang";
import styles from "./LanguageToggle.module.css";

const LANGUAGES = [
  { code: "af", name: "Afrikaans" },
  { code: "en", name: "English" },
];

export default function LanguageToggle() {
  const lang = useLang();

  return (
    <div className={styles.toggle} role="group" aria-label={text(ui.language, lang)}>
      {LANGUAGES.map(({ code, name }) => (
        <button
          key={code}
          type="button"
          className={styles.option}
          aria-pressed={lang === code}
          lang={code}
          onClick={() => setLang(code)}
        >
          {/* Visible "AF" stays part of the accessible name ("AF Afrikaans"), so voice
              control ("click AF") works (WCAG 2.5.3). */}
          {code.toUpperCase()}
          <span className="visually-hidden"> {name}</span>
        </button>
      ))}
    </div>
  );
}
