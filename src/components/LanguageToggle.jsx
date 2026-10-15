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
          aria-label={name}
          lang={code}
          onClick={() => setLang(code)}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
