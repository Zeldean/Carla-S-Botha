import { site } from "./content";

/** wa.me link with a prefilled message from site.json templates, or null while no number is set. */
export function whatsappUrl(template, vars = {}) {
  const { number, templates } = site.whatsapp;
  if (!number) return null;
  const message = templates[template].replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
