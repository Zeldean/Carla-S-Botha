// Site-wide language for full content (spec §8).
// Both languages are rendered into the HTML and CSS hides the inactive one, keyed on
// <html data-lang>. So switching needs no re-render, and prerendered pages never flash.
import { useSyncExternalStore } from "react";

export const DEFAULT_LANG = "af";
const STORAGE_KEY = "lang";
const EVENT = "langchange";

/** Runs in <head> before first paint: applies the stored choice. Keep in sync with setLang. */
export const LANG_BOOT_SCRIPT = `(function(){var l="${DEFAULT_LANG}";try{var s=localStorage.getItem("${STORAGE_KEY}");if(s==="af"||s==="en")l=s}catch(e){}var d=document.documentElement;d.setAttribute("data-lang",l);d.lang=l})();`;

export function setLang(lang) {
  const root = document.documentElement;
  root.dataset.lang = lang;
  root.lang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    // Private mode or blocked storage: the choice just won't be remembered.
  }
  window.dispatchEvent(new Event(EVENT));
}

const subscribe = (callback) => {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
};

/**
 * Current language, for the few things CSS can't switch (attributes like alt text,
 * aria-pressed). Prerender and hydration use the default, then it updates.
 */
export const useLang = () =>
  useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.lang || DEFAULT_LANG,
    () => DEFAULT_LANG,
  );
