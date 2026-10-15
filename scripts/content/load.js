// Reads src/content + public/paintings, validates everything and builds the content index.
// Used by the Vite plugin (dev + build) and by `npm run check:content`.
//
// Errors   = the site would be broken (bad JSON, wrong field, link to a missing page) → build fails.
// Warnings = something is still missing but has a fallback (placeholder image, missing translation).
import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import * as schemas from "./schemas.js";

const IMAGE_EXTS = [".png", ".jpg", ".jpeg", ".webp"];
const PLACEHOLDER = { src: "/ui/placeholder-frame.svg", width: 800, height: 1000, placeholder: true };
const PLAQUE_EXTRA_LIMIT = 90;

// Image folders (relative to public/paintings) that aren't derived from a room/page slug.
const PRODUCT_FOLDERS = { art: "art/prints-and-paintings", mindfulness: "mindfulness/mindfulness-products", c4: "shop" };
const WORKS_FOLDER = "art/gallery";
const FREEBIE_FOLDER = "freebies";

// Short examples appended to errors for fields people commonly get wrong.
const FIELD_HINTS = {
  price: '120 (whole rand, no "R"), or null',
  year: "2025",
  number: '"27821234567"',
  title: '{ "af": "Kuns", "en": "Art" }',
};

const roomFolder = (slug) => (slug === "home" ? "" : slug);
const joinFolder = (...parts) => parts.filter(Boolean).join("/");

export function loadContent(root) {
  const contentDir = path.join(root, "src/content");
  const publicDir = path.join(root, "public");
  const paintingsDir = path.join(publicDir, "paintings");

  const errors = [];
  const warnings = [];
  const watchFiles = [];
  const rel = (file) => path.relative(root, file);

  // ------------------------------------------------------------ reading helpers

  const readJson = (file) => {
    watchFiles.push(file);
    try {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    } catch (err) {
      errors.push(`${rel(file)} → is not valid JSON: ${err.message}. Check for a missing comma, quote or bracket.`);
      return undefined;
    }
  };

  const formatIssue = (file, issue) => {
    const field = issue.path.join(".");
    const where = field ? `${rel(file)} → "${field}"` : `${rel(file)} →`;
    const last = issue.path.at(-1);
    let message;

    if (issue.code === "invalid_type" && issue.input === undefined) {
      message = "is missing";
    } else if (issue.code === "invalid_type") {
      const article = /^[aeiou]/.test(issue.expected) ? "an" : "a";
      message = `must be ${article} ${issue.expected} (got ${JSON.stringify(issue.input)})`;
    } else if (issue.code === "invalid_value") {
      message = `must be one of ${issue.values.map((v) => JSON.stringify(v)).join(", ")}`;
    } else if (issue.code === "unrecognized_keys") {
      message = `has unknown field(s) ${issue.keys.map((k) => `"${k}"`).join(", ")}. Check the spelling.`;
    } else {
      message = issue.message;
    }

    const hint = FIELD_HINTS[last] && issue.code === "invalid_type" ? `. Example: ${FIELD_HINTS[last]}` : "";
    return `${where} ${message}${hint}`;
  };

  const validate = (schema, data, file) => {
    if (data === undefined) return undefined;
    const result = schema.safeParse(data, { reportInput: true });
    if (!result.success) {
      for (const issue of result.error.issues) errors.push(formatIssue(file, issue));
      return undefined;
    }
    return result.data;
  };

  /** Loads every <slug>.json in a folder. Files starting with "_" are templates: validated, not published. */
  const readCollection = (dir, schema) => {
    const items = {};
    if (!fs.existsSync(dir)) return items;
    for (const name of fs.readdirSync(dir).sort()) {
      if (!name.endsWith(".json")) continue;
      const file = path.join(dir, name);
      const slug = name.slice(0, -".json".length);
      const data = validate(schema, readJson(file), file);
      if (name.startsWith("_") || !data) continue;
      if (!schemas.slug.safeParse(slug).success) {
        errors.push(`${rel(file)} → file name must be lowercase words joined by dashes, like "blue-journal.json"`);
        continue;
      }
      items[slug] = { slug, ...data, source: rel(file) };
    }
    return items;
  };

  // ------------------------------------------------------------ image manifest

  const manifest = new Map(); // "art/gallery.png" → { width, height }
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (IMAGE_EXTS.includes(path.extname(entry.name).toLowerCase())) {
        const key = path.relative(paintingsDir, full).split(path.sep).join("/");
        try {
          const { width, height } = imageSize(fs.readFileSync(full));
          manifest.set(key, { width, height });
        } catch {
          errors.push(`${rel(full)} → can't be read as an image`);
        }
      }
    }
  };
  walk(paintingsDir);

  const usedImages = new Set();
  const toImage = (key) => {
    usedImages.add(key);
    return { src: `/paintings/${key}`, ...manifest.get(key), placeholder: false };
  };

  /** Finds "<folder>/<name>" with any image extension. */
  const findByBase = (base) => IMAGE_EXTS.map((ext) => base + ext).find((key) => manifest.has(key));

  /** Resolves an image or falls back to the placeholder, with a warning naming the expected path. */
  const resolveImage = ({ folder, name, exactFile, context }) => {
    const key = exactFile ? joinFolder(folder, exactFile) : findByBase(joinFolder(folder, name));
    if (key && manifest.has(key)) return toImage(key);
    const expected = exactFile ? joinFolder(folder, exactFile) : `${joinFolder(folder, name)}.png`;
    warnings.push(`${context} → no image at public/paintings/${expected}, showing the placeholder`);
    return PLACEHOLDER;
  };

  // ------------------------------------------------------------ read everything

  const site = validate(schemas.site, readJson(path.join(contentDir, "site.json")), path.join(contentDir, "site.json"));
  const ui = validate(schemas.ui, readJson(path.join(contentDir, "ui.json")), path.join(contentDir, "ui.json"));
  const rooms = readCollection(path.join(contentDir, "rooms"), schemas.room);
  // Slugs whose files exist, even if they have errors, so one bad file doesn't cause a cascade of
  // "links to X, which doesn't exist" errors elsewhere.
  const slugsOnDisk = new Set();
  const roomsDir = path.join(contentDir, "rooms");
  if (fs.existsSync(roomsDir)) {
    for (const name of fs.readdirSync(roomsDir)) if (name.endsWith(".json") && !name.startsWith("_")) slugsOnDisk.add(name.slice(0, -5));
  }

  const pages = {};
  const pagesDir = path.join(contentDir, "pages");
  for (const slug of fs.existsSync(pagesDir) ? fs.readdirSync(pagesDir).sort() : []) {
    const dir = path.join(pagesDir, slug);
    if (!fs.statSync(dir).isDirectory()) continue;
    slugsOnDisk.add(slug);
    const metaFile = path.join(dir, "page.json");
    if (!fs.existsSync(metaFile)) {
      errors.push(`${rel(dir)} → is missing its page.json`);
      continue;
    }
    if (!schemas.slug.safeParse(slug).success) {
      errors.push(`${rel(dir)} → folder name must be lowercase words joined by dashes`);
      continue;
    }
    const data = validate(schemas.page, readJson(metaFile), metaFile);
    const body = {};
    for (const lang of ["af", "en"]) {
      const file = path.join(dir, `${lang}.md`);
      body[lang] = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
      if (body[lang] !== null) watchFiles.push(file);
    }
    if (data) pages[slug] = { slug, ...data, body, source: rel(metaFile) };
  }

  const products = readCollection(path.join(contentDir, "products"), schemas.product);
  const works = readCollection(path.join(contentDir, "works"), schemas.work);
  const freebies = readCollection(path.join(contentDir, "freebies"), schemas.freebie);

  // ------------------------------------------------------------ cross-checks

  if (!rooms.home) errors.push("src/content/rooms/home.json → the home room is missing");

  for (const slug of Object.keys(pages)) {
    if (rooms[slug]) errors.push(`"${slug}" is used by both a room and a page. Slugs must be unique.`);
  }
  const exists = (slug) => slugsOnDisk.has(slug);

  const placedIn = {}; // slug → [room slugs]
  for (const room of Object.values(rooms)) {
    for (const [i, artwork] of room.artworks.entries()) {
      const where = `${room.source} → "artworks.${i}"`;
      if (!exists(artwork.to)) errors.push(`${where} links to "${artwork.to}", which doesn't exist`);
      else if (artwork.to === room.slug || artwork.to === "home") errors.push(`${where} can't link to "${artwork.to}"`);
      (placedIn[artwork.to] ??= []).push(room.slug);

      const label = artwork.label ?? {};
      for (const lang of ["af", "en"]) {
        const extra = ["artworkTitle", "medium", "blurb", "invite"]
          .map((k) => (typeof label[k] === "object" ? label[k]?.[lang] : label[k]) ?? "")
          .join("");
        if (extra.length > PLAQUE_EXTRA_LIMIT) {
          warnings.push(`${where} → plaque text is ${extra.length} characters (${lang}). Keep it under ${PLAQUE_EXTRA_LIMIT} so it stays a small label.`);
        }
      }
    }
  }

  for (const slug of [...Object.keys(rooms), ...Object.keys(pages)]) {
    if (slug !== "home" && !placedIn[slug]) warnings.push(`"${slug}" isn't placed in any room, so visitors can only reach it by link`);
  }

  for (const page of Object.values(pages)) {
    if (!rooms[page.defaultParent]) {
      errors.push(`${page.source} → "defaultParent" must be a room, but "${page.defaultParent}" isn't one`);
    } else if (!placedIn[page.slug]?.includes(page.defaultParent)) {
      warnings.push(`${page.source} → "defaultParent" is "${page.defaultParent}", but that room has no artwork for this page`);
    }
    for (const service of page.services ?? []) {
      if (!pages[service]) errors.push(`${page.source} → "services" lists "${service}", which isn't a page`);
    }
    if (page.type === "info") {
      if (!page.body.af && !page.body.en) warnings.push(`${page.source} → no af.md or en.md yet, showing the "still being set up" panel`);
      else if (!page.body.af) warnings.push(`${page.source} → no Afrikaans text yet (af.md), English is shown in both languages`);
      else if (!page.body.en) warnings.push(`${page.source} → no English text yet (en.md), Afrikaans is shown in both languages`);
    }

    // Internal links in Markdown: "/slug" must exist; "/some/file.pdf" must exist in public/.
    for (const lang of ["af", "en"]) {
      for (const [, href] of (page.body[lang] ?? "").matchAll(/\]\((\/[^)\s]*)\)/g)) {
        const target = href.replace(/[?#].*$/, "");
        const where = `${path.dirname(page.source)}/${lang}.md`;
        if (target === "/") continue;
        if (target.slice(1).includes("/") || path.extname(target)) {
          if (!fs.existsSync(path.join(publicDir, target))) errors.push(`${where} → links to "${href}", but public${target} doesn't exist`);
        } else if (!exists(target.slice(1))) {
          errors.push(`${where} → links to "${href}", which isn't a page or room`);
        }
      }
    }
  }

  for (const work of Object.values(works)) {
    if (work.product && !products[work.product]) errors.push(`${work.source} → "product" is "${work.product}", but there's no products/${work.product}.json`);
  }

  for (const freebie of Object.values(freebies)) {
    if (!/^https?:\/\//.test(freebie.file) && !fs.existsSync(path.join(publicDir, freebie.file))) {
      errors.push(`${freebie.source} → the download "${freebie.file}" doesn't exist in public/. Upload it, or use a full https:// link.`);
    }
  }

  if (site) {
    for (const slug of site.nav) if (!exists(slug)) errors.push(`src/content/site.json → "nav" lists "${slug}", which doesn't exist`);
    if (!site.whatsapp.number) warnings.push("src/content/site.json → WhatsApp number isn't set yet, so enquiry buttons are hidden");
  }

  // ------------------------------------------------------------ resolve images

  for (const room of Object.values(rooms)) {
    const folder = roomFolder(room.slug);
    room.artworks = room.artworks.map((artwork, i) => ({
      ...artwork,
      image: resolveImage({ folder, name: artwork.to, exactFile: artwork.image, context: `${room.source} → "artworks.${i}"` }),
    }));
    room.decor = room.decor.flatMap((item, i) => {
      const key = joinFolder(folder, "decor", item.image);
      if (manifest.has(key)) return [{ ...item, image: toImage(key) }];
      warnings.push(`${room.source} → "decor.${i}" has no image at public/paintings/${key}, leaving it out`);
      return [];
    });
  }

  for (const page of Object.values(pages)) {
    // Default: the same artwork that represents the page in its parent room.
    const parentFolder = rooms[page.defaultParent] ? roomFolder(page.defaultParent) : "";
    page.image = page.image
      ? resolveImage({ folder: joinFolder(parentFolder, page.slug), exactFile: page.image, context: page.source })
      : resolveImage({ folder: parentFolder, name: page.slug, context: page.source });
  }

  for (const product of Object.values(products)) {
    product.image = product.image
      ? resolveImage({ folder: PRODUCT_FOLDERS[product.category], exactFile: product.image, context: product.source })
      : PLACEHOLDER;
  }
  for (const work of Object.values(works)) {
    work.image = resolveImage({ folder: WORKS_FOLDER, exactFile: work.image, context: work.source });
  }
  for (const freebie of Object.values(freebies)) {
    freebie.cover = freebie.cover
      ? resolveImage({ folder: FREEBIE_FOLDER, exactFile: freebie.cover, context: freebie.source })
      : PLACEHOLDER;
  }

  for (const key of manifest.keys()) {
    if (!usedImages.has(key)) warnings.push(`public/paintings/${key} → isn't used anywhere (wrong name or folder?)`);
  }

  return {
    errors,
    warnings,
    watchFiles,
    watchDirs: [contentDir, paintingsDir],
    content: { site, ui, rooms, pages, products, works, freebies },
  };
}
