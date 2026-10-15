import { absoluteUrl, site, text } from "./content";

/** Route `meta` entries: title, description and link-preview tags. Prerendered in Afrikaans. */
export function buildMeta({ title, description, image, path }) {
  const fullTitle = title ? `${title} — ${site.brand}` : `${site.brand} — ${text(site.tagline, "af")}`;
  const desc = text(description ?? site.tagline, "af");
  const tags = [
    { title: fullTitle },
    { name: "description", content: desc },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: desc },
    { property: "og:type", content: "website" },
    { property: "og:url", content: absoluteUrl(path) },
    { property: "og:locale", content: "af_ZA" },
  ];
  if (image && !image.placeholder) {
    tags.push({ property: "og:image", content: absoluteUrl(image.src) });
  }
  return tags;
}
