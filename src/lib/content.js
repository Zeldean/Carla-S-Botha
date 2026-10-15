// Read-only access to the validated content index (built by scripts/content/vite-plugin.js).
import content from "virtual:content";

export const { site, ui, rooms, pages } = content;

/** A room or page by slug, tagged with its kind, or null. */
export function getEntry(slug) {
  if (rooms[slug]) return { kind: "room", ...rooms[slug] };
  if (pages[slug]) return { kind: "page", ...pages[slug] };
  return null;
}

/** Plain text of a localised value ("text" or { af, en }) in one language. */
export const text = (value, lang) => (value && typeof value === "object" ? value[lang] : value) ?? "";

/** "Oor my / About Me", or a single title when both languages are the same. */
export const titleText = (title) => (title.af === title.en ? title.af : `${title.af} / ${title.en}`);

/**
 * The room a "back" link should return to: the room the visitor came from (router state),
 * if that room really shows this page, otherwise the page's default parent.
 */
export function parentRoom(page, fromSlug) {
  const from = rooms[fromSlug];
  if (from?.artworks.some((artwork) => artwork.to === page.slug)) return from;
  return rooms[page.defaultParent];
}

export const absoluteUrl = (path) => `https://${site.domain}${path}`;
