// Content schemas. These are the single source of truth for:
//   - build-time validation (scripts/content/load.js)
//   - the editor JSON Schemas in /schemas (scripts/build-schemas.js)
// Objects are strict, so a misspelt field ("prise") is reported instead of silently ignored.
import { z } from "zod";
import { FREEBIE_CATEGORIES } from "../../src/lib/constants.js";

const SLUG_HINT = 'use lowercase words joined by dashes, like "art-lessons"';
const LOCALIZED_HINT = 'must be text, or both languages like { "af": "…", "en": "…" }';

export const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, SLUG_HINT);

const text = z.string().trim().min(1, "can't be empty");

/** Same text in both languages, or { af, en }. */
export const localized = z.union([text, z.strictObject({ af: text, en: text })], {
  error: LOCALIZED_HINT,
});

/** Titles always carry both languages; identical values are shown once. */
export const title = z
  .strictObject({ af: text, en: text })
  .meta({ description: 'Both languages, e.g. { "af": "Kuns", "en": "Art" }. Use the same text twice if it doesn\'t change.' });

const schemaRef = { $schema: z.string().optional() };
const published = z
  .boolean()
  .default(true)
  .meta({ description: "Set to false to hide this item while it's still a draft." });

// ---------------------------------------------------------------- rooms

export const SHAPES = ["portrait", "landscape", "square", "round", "oval", "sign", "palette", "object"];
export const SIZES = ["s", "m", "l"];

const artwork = z.strictObject({
  to: slug.meta({ description: "Slug of the page or room this artwork opens." }),
  image: z
    .string()
    .optional()
    .meta({ description: "Only needed to override the default file name (<room folder>/<to>.png)." }),
  alt: localized.meta({ description: "Short description of what the artwork shows." }),
  shape: z.enum(SHAPES),
  size: z
    .enum(SIZES)
    .default("l")
    .meta({ description: '"l" fills the slot (default, all paintings line up). "m"/"s" make a piece look smaller on purpose.' }),
  place: z
    .strictObject({
      col: z.int().min(1),
      row: z.int().min(1),
      span: z.int().min(1).max(3).default(1),
    })
    .optional()
    .meta({ description: "Desktop only: pin to a grid cell." }),
  nudge: z
    .strictObject({
      x: z.number().min(-5).max(5).default(0),
      y: z.number().min(-5).max(5).default(0),
      rotate: z.number().min(-5).max(5).default(0),
    })
    .optional()
    .meta({ description: "Desktop only: small offset (%) and tilt (degrees) so the wall looks hand-hung." }),
  label: z
    .strictObject({
      artworkTitle: localized.optional(),
      medium: localized.optional(),
      blurb: localized.optional(),
      invite: localized.optional(),
    })
    .optional(),
});

const decor = z.strictObject({
  image: z.string(),
  position: z.enum(["left-top", "left-bottom", "center-top", "center-bottom", "right-top", "right-bottom"]),
  size: z.enum(SIZES).default("m"),
});

export const room = z.strictObject({
  ...schemaRef,
  title,
  intro: localized.optional(),
  theme: slug,
  artworks: z.array(artwork).min(1, "a room needs at least one artwork"),
  decor: z.array(decor).default([]),
});

// ---------------------------------------------------------------- pages

export const PRODUCT_CATEGORIES = ["art", "mindfulness", "c4"];
export { FREEBIE_CATEGORIES };
export const TEMPLATES = ["general", "enquiry", "product", "lessons", "speech"];

const cta = z.strictObject({
  label: localized,
  template: z.enum(TEMPLATES).meta({ description: "Which WhatsApp message template from site.json to prefill." }),
});

const pageBase = {
  ...schemaRef,
  title,
  defaultParent: slug.meta({ description: 'Room the "back" link returns to when the visitor arrived directly.' }),
  description: localized.meta({ description: "One sentence for search results and link previews." }),
  image: z.string().optional().meta({ description: "Override the page artwork (file inside this page's own folder)." }),
};

export const page = z.discriminatedUnion(
  "type",
  [
    z.strictObject({
      ...pageBase,
      type: z.literal("info"),
      layout: z.enum(["default", "personal"]).default("default"),
      cta: cta.optional(),
    }),
    z.strictObject({
      ...pageBase,
      type: z.literal("catalogue"),
      filter: z.strictObject({ category: z.enum(PRODUCT_CATEGORIES) }).optional(),
      services: z.array(slug).default([]),
      cta: cta.optional(),
    }),
    z.strictObject({
      ...pageBase,
      type: z.literal("freebies"),
      filter: z.strictObject({ category: z.enum(FREEBIE_CATEGORIES) }).optional(),
    }),
    z.strictObject({
      ...pageBase,
      type: z.literal("portfolio"),
    }),
  ],
  { error: 'must have a "type" of "info", "catalogue", "freebies" or "portfolio"' },
);

// ---------------------------------------------------------------- data (edited by non-developers)

export const product = z.strictObject({
  ...schemaRef,
  name: localized,
  category: z.enum(PRODUCT_CATEGORIES).meta({ description: '"art", "mindfulness" or "c4". Decides which catalogue and image folder.' }),
  subcategory: localized.optional(),
  description: localized,
  intendedUse: localized.optional(),
  medium: localized.nullable().optional(),
  dimensions: z.string().nullable().optional().meta({ description: 'e.g. "A4" or "30 × 40 cm"' }),
  price: z
    .number()
    .nonnegative()
    .nullable()
    .meta({ description: 'Whole rand as a number, like 120 (no "R"). Use null for "price on enquiry".' }),
  options: z.array(localized).default([]),
  status: z.enum(["available", "made-to-order", "sold"]).default("available"),
  image: z.string().optional().meta({ description: "File name of the photo in this category's image folder." }),
  published,
});

export const work = z.strictObject({
  ...schemaRef,
  title,
  medium: localized.optional(),
  year: z.int().min(1950).max(2100).optional(),
  kind: z.enum(["painting", "drawing", "aceo", "illustration", "other"]),
  description: localized.optional(),
  image: z.string().meta({ description: "File name inside public/paintings/art/gallery/." }),
  product: slug.nullable().optional().meta({ description: "Product slug, if this piece is also for sale." }),
  published,
});

export const freebie = z.strictObject({
  ...schemaRef,
  title,
  description: localized,
  audience: localized.optional(),
  category: z.enum(FREEBIE_CATEGORIES),
  file: z
    .string()
    .meta({ description: 'Either a file in public/, like "downloads/colouring-book.pdf", or a full https:// link.' }),
  cover: z.string().optional().meta({ description: "File name inside public/paintings/freebies/." }),
  published,
});

// ---------------------------------------------------------------- site & UI strings

const nullableUrl = z.url().nullable();

export const site = z.strictObject({
  ...schemaRef,
  brand: text,
  tagline: localized,
  domain: text,
  contact: z.strictObject({
    email: z.email().nullable(),
    phone: z.string().nullable(),
  }),
  socials: z.array(z.strictObject({ name: text, url: z.url() })).default([]),
  whatsapp: z.strictObject({
    number: z
      .string()
      .regex(/^\d{11,15}$/, 'international format, digits only, like "27821234567"')
      .nullable(),
    catalogs: z.strictObject({
      all: nullableUrl,
      art: nullableUrl,
      mindfulness: nullableUrl,
      c4: nullableUrl,
    }),
    templates: z.strictObject(Object.fromEntries(TEMPLATES.map((t) => [t, text]))),
  }),
  nav: z.array(slug).min(1),
});

export const ui = z.record(z.string().regex(/^[a-zA-Z]+$/), z.strictObject({ af: text, en: text }));

/** Editor-facing schemas, written to /schemas/<name>.schema.json. */
export const EDITOR_SCHEMAS = { room, page, product, work, freebie, site };
