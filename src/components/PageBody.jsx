import { ui } from "../lib/content";
import Markdown from "./Markdown";
import { Localized } from "./Text";

/**
 * A page's Markdown body (spec §8.2–8.3): both languages when available (CSS shows the
 * toggled one); otherwise the one there is, plus a note in the other language;
 * otherwise the "still being set up" message.
 */
export default function PageBody({ page, className, noteClassName }) {
  const { af, en } = page.body;

  if (af && en) {
    return (
      <>
        <div className={className} lang="af" data-l="af"><Markdown>{af}</Markdown></div>
        <div className={className} lang="en" data-l="en"><Markdown>{en}</Markdown></div>
      </>
    );
  }

  if (af || en) {
    const only = af ? "af" : "en";
    const other = af ? "en" : "af";
    const note = af ? ui.onlyAfrikaans : ui.onlyEnglish;
    return (
      <>
        <p className={noteClassName} lang={other} data-l={other}>{note[other]}</p>
        <div className={className} lang={only}><Markdown>{af ?? en}</Markdown></div>
      </>
    );
  }

  return (
    <p className={noteClassName}>
      <Localized value={page.type === "info" ? ui.roomSetup : ui.comingSoon} />
    </p>
  );
}
