# Carla.S.Botha: Combined Specification

> **Status:** Draft, 2026-10-14. Built from [`design-spec.md`](./design-spec.md) and [`technical-spec.md`](./technical-spec.md), checked against the code at `ec904dd` (the `src/` tree has not changed since `201e29d`). No app code has been changed.
>
> **Source documents:** The two specs above are left unchanged. This document supersedes both **where they disagree**. Where this file is silent, the source documents still apply.
>
> **Legend**
> - **ALIGNED**: the design requirement and the technical plan already agree.
> - **RESOLVED**: there was a conflict or gap, and this spec picks a resolution. It can still be revisited.
> - **DECISION NEEDED**: a judgment call for the site owner. A recommended default is given so work can continue.
> - **CONTENT BLOCKER**: the structure is ready, but real content (prices, numbers, artwork) still has to be supplied.
> - `D#` refers to the decision log in §13. `C#` refers to the conflict log in §2. `B#` refers to the bug table in technical-spec §2.1.

---

## 1. Alignment at a glance

| Area | Design spec | Technical spec | Status |
|---|---|---|---|
| Stack | No stated requirements | React + Vite + React Router + plain CSS | ALIGNED. Nothing in the design needs a CMS, state library or CSS framework. |
| Page inventory | 16 destinations, 16 artwork placements (§16) | Rooms reference pages; 4 page types | ALIGNED in principle. One type is missing a component, and the page→type mapping wasn't written down (C1, §3). |
| Shared pages | One underlying page reachable from several places (§15.4) | Flat slugs, rooms *reference* pages (§3.2–3.3) | ALIGNED. |
| "Only display what is ready" | §15.3, §8.4, §10.3, §11.2 | `published: false` | ALIGNED for pages. It conflicts with the six confirmed homepage artworks (C7 → D3). |
| Square display area per artwork | §2.5 | Existing `.painting-slot` is `aspect-ratio: 1/1` | ALIGNED. Keep it. |
| Varied shapes *and sizes* | §2.4 (ACEO-small to large) | `shape` variants only | GAP (C4). Add `size`. |
| Museum labels | Section title + optional title, medium, blurb, invitation (§2.6) | `Plaque` with bilingual title only; current CSS clamps to 2 lines | GAP (C5). |
| Conventional navigation | Required on the homepage, and "always" reachable (§5.2, §13.2) | `Footer` only | GAP (C6). |
| Back to previous room | §13.2 | `state.from` + `defaultParent`, breadcrumbs | ALIGNED. Also fixes B5. |
| Catalogues with prices | §7.5, §8.3, §10 | `products/*.json` | GAP. The schema is missing size, medium, availability and intended use (C9). |
| Portfolio ("Gallery") | §7.4 | `portfolio` type exists, but there's no component or data shape | GAP (C1). |
| WhatsApp enquiries | On every booking/product/service page (§7.3, §9.4, §9.5, §12) | Only in `Footer` / `ProductCard` | GAP (C10). |
| Bilingual | Mixed per section; About fully in both (§3.2) | Q3 open | RESOLVED for the data model, DECISION NEEDED for presentation (D2). |
| Room atmosphere / decor | Per-room wall colour, props, neon (§2.3, §7.2, §8.2, §9.2) | "atmosphere class" only | GAP (C8). |
| Readability | Long info and price lists must stay readable (§13.6) | Current detail page scrolls inside a 62vh box | CONFLICT with the current code (C11). |
| Footer on every page | §12 | `MuseumLayout` → `Footer` | ALIGNED, but it collides with the current fixed floor (C12). |
| Link sharing | WhatsApp is the main channel | Prerender is "optional" | RESOLVED: make prerender part of the plan (C13). |

---

## 2. Conflict & gap log

Each row lists where the problem is, what's wrong, and the resolution (with the section that specifies it).

| # | Sources | Problem | Resolution |
|---|---|---|---|
| C1 | design §7.4, §16 / tech §3.3–3.4 | The tech spec lists the page type `portfolio`, but there's no component and no data shape for portfolio works. | Add `Portfolio` + `WorkCard` components and `content/works/*.json` (§5.5, §6). |
| C2 | design §8.4, §16 / tech §3.3 | "Mindfulness Freebies" is one of the 16 destinations, but the tech spec only has a category filter inside `FreebieList`. There's no page for it. | It becomes its own page (`type: freebies`, `filter: { category: mindfulness }`) with its own URL and back-link to the Mindfulness room. Its items come from the same freebie files as the main Freebies page. **RESOLVED.** |
| C3 | design §8.3, §7.5, §10 / tech §3.3 | Products, Prints and Paintings, and Shop are 3 destinations that all show products. The tech spec doesn't say how they relate. | All 3 are `type: catalogue` pages over **one** product pool, each with a category filter. Shop shows everything, grouped. This satisfies §15.4 ("same underlying information"). **RESOLVED.** |
| C4 | design §2.4 / tech §3.4 / code `Gallery.css` | The design wants some pieces to feel ACEO-small and others large. Today every slot is the same width (300–380px), and `shape` does nothing (B2). | Add a `size: s \| m \| l` field per placement. It scales the artwork *inside* its square slot, so the "invisible square" rule (§2.5) still holds (§7.2). **RESOLVED.** |
| C5 | design §2.6 / code `.painting-plaque` (fixed `height: 58px`, `line-clamp: 2`) | Plaques can't hold the optional title, medium, blurb or invitation. A bilingual title plus anything extra gets cut off. | The plaque gets structured fields with an auto height. The destination title is always line 1 and is the link's accessible name. Validation caps the extra text (§7.3). **RESOLVED.** |
| C6 | design §5.2, §13.2 / tech §3.4 | The design needs "conventional navigation" and a way to reach Shop, Freebies and Contact *at all times*. A footer at the bottom of a long room doesn't meet "at all times". | Add a slim `SiteHeader`: the brand (→ home), a compact menu with the 6 main sections, and a WhatsApp button. The footer repeats the links (§8.1). **RESOLVED.** The look still needs owner sign-off with the first visual prototype. |
| C7 | design §15.3 vs §3.2/§13.3 | "Only display what is ready" conflicts with "six confirmed homepage destinations" when a destination has nothing to show yet. For example, Freebies may have zero completed resources at launch. | **DECISION NEEDED (D3).** Default: the six homepage artworks always show. Empty catalogue/freebie pages show a single friendly fallback instead of empty categories. Room placements whose page is `published: false` are hidden. |
| C8 | design §2.3, §7.2, §8.2, §9.2 / tech §3.4 | Per-room atmosphere (wall colour, props, neon, plants) has no data model. The current code has one global `wall.png`. | Each room file gets a `theme` (CSS class with tokens) and an optional `decor[]` list of non-interactive images (§7.4). **RESOLVED.** |
| C9 | design §7.5, §8.3, §10.3 / tech §3.3 | The product schema `{ name, description, price, category[], options[], image, orderUrl }` has no field for dimensions, medium, availability or intended use. It also has no rule for sold items. | Extend the schema (§5.4). Only `status: available \| made-to-order` items appear in catalogues. Sold originals can still appear in the Portfolio. **RESOLVED.** |
| C10 | design §7.3, §9.4, §9.5, §12 / tech §3.4 | Every service page has a WhatsApp call to action ("Enquire about…"), but the tech spec has no component for it. | Add an `EnquiryCTA` component. It takes a prefilled WhatsApp message from page frontmatter, and the number comes from `site.json` (§9). **RESOLVED.** Number and wording are D7. |
| C11 | design §13.6 / code `.detail-copy` (`overflow-y: auto; max-height: 62vh` at ≥720px) | Long biographies and price tables get trapped in a small inner scroll box. Keyboard users can't scroll it either (tech §2.4). | Info pages scroll as a normal document. The image sits beside the text on desktop (sticky) and above it on mobile (§7.5). **RESOLVED.** |
| C12 | design §12 / code `.museum-floor` (`position: fixed; z-index: 9`, 100–150px tall) | A fixed floor would cover the footer and the last row of content. On phones it takes 100px of every screen. | The floor becomes a normal band at the bottom of *room* pages, and the footer sits below it. Info pages get a thin floor edge or none (§7.1). **RESOLVED.** |
| C13 | design §12 (WhatsApp-centric) / tech §3.2 (prerender "optional") | Links shared in WhatsApp show previews from the static HTML. A client-only SPA gives every page the same generic preview, because React 19's hoisted `<title>/<meta>` only exist after JavaScript runs. | Prerender every route at build time (§4.2). **RESOLVED.** This is a developer call, not an owner decision. |
| C14 | design §3.2 / tech §3.3 `title: { af, en }` | Some titles are Afrikaans only (*Breinprofiele en Studiemetodes*), some English only (*Mindfulness*, *Gallery*, *Products*). A required `{af, en}` pair would force fake translations. | `title` is either a string with a `lang` attribute, or `{ af, en }` when the title really is bilingual (§5.1). **RESOLVED.** |
| C15 | design §6.2, §5.3 "retro lettering", handwritten mix / tech §3.5 "display + body" fonts | No fonts have been chosen. The current font is Arial everywhere. | Tokens get 3 font roles: `--font-body`, `--font-display`, `--font-hand`. The actual fonts are **DECISION NEEDED (D6)**. |
| C16 | design §2.2 "no strict palette" / tech §3.5 "no raw hex outside tokens" | These look contradictory, but they aren't. | The token rule only applies to **UI chrome** (plaques, text, header, footer, room walls). Artwork colour lives in the images and isn't restricted. **RESOLVED.** |
| C17 | design §14 / tech Q6 / `public/paintings/` | The tech spec calls `artwork-01…15.png`, `shop.png` and `mindfulness/free.png` "unreferenced, maybe leftovers". A visual check shows they are photos of **work-in-progress artworks that match the design's §14 concepts** (mapping in §10.3). | They are planned assets, not leftovers. Move them out of `public/` so they stop shipping (≈25 MB), but keep them as masters. **RESOLVED.** Q6 is partly answered. |
| C18 | design §7.3 (Kunslesse = painter's palette) / code `data/gallery.js` | The existing painted palette (`art.png`) is currently the **Kuns** homepage artwork. Kunslesse uses a *Girl with a Pearl Earring*-style sketch instead. `shop.png` is an octagonal sign that reads **"STOP"**, not "SHOP". | **DECISION NEEDED (D4).** The design says the Art homepage and Art Lessons artworks aren't final (§17), so the current code is a placeholder, not a commitment. |
| C19 | design §5.2 brand "Carla.S.Botha" / code `<title>Carla S Botha</title>` (`index.html`, `404.html`) | The brand name is spelled differently. | Use "Carla.S.Botha" everywhere (`site.json` → `PageMeta`). **RESOLVED.** |
| C20 | tech §3.2 (data router now, framework-mode prerender "optional later") | Moving to `createBrowserRouter` and then to framework mode later would mean rewriting the router twice. | Go straight to the final routing approach (§4.2). **RESOLVED.** |
| C21 | design §6.6, §9.3 ("can link to the detailed service pages") / tech §3.3 | Markdown bodies will contain internal links (`/kuns`, `/ekstra-klasse`). Rendered as plain `<a>`, these cause full page reloads, and broken links can't be caught. | Make Markdown `a` render as a router `<Link>` for internal paths, and validate internal link targets at build time (§5.6). **RESOLVED.** |
| C22 | tech §3.3 (`ready` on freebies vs `published` elsewhere) | Two different flags have the same meaning. | Use `published` everywhere. **RESOLVED.** |
| C23 | design §2.4, §5.3 (sign-shaped, palette-shaped, oval artworks) / assets | Most artwork photos still include the blue cloth background (`art.png` has no transparency at all). The shapes can't read as objects on a wall until they are cut out. | Add a cut-out step to the asset workflow (§10.2). **RESOLVED.** |

---

## 3. Information architecture

### 3.1 Destinations → slug, type, component

Slugs follow the recommended rule in D1: **the language of the first label word**. If D1 changes, only this column changes.

| # | Destination (design §16) | Slug (D1 default) | Type | Rendered by | Placed in room(s) | Default parent |
|---|---|---|---|---|---|---|
| 1 | Home | `/` | room | `Room` | — | — |
| 2 | Oor my / About Me | `/oor-my` | info (`layout: personal`) | `InfoPage` | home | home |
| 3 | Kuns / Art | `/kuns` | room | `Room` | home | home |
| 4 | Kunslesse / Art Lessons | `/kunslesse` | info | `InfoPage` + `EnquiryCTA` | kuns | kuns |
| 5 | Gallery | `/gallery` | portfolio | `Portfolio` | kuns | kuns |
| 6 | Prints and Paintings | `/prints-and-paintings` | catalogue (`filter: art`) | `Catalogue` | kuns | kuns |
| 7 | Mindfulness | `/mindfulness` | room | `Room` | home | home |
| 8 | Products | `/mindfulness-products` | catalogue (`filter: mindfulness`) | `Catalogue` | mindfulness | mindfulness |
| 9 | Mindfulness Freebies | `/mindfulness-freebies` | freebies (`filter: mindfulness`) | `FreebieList` | mindfulness | mindfulness |
| 10 | Breinprofiele en Studiemetodes | `/breinprofiele` | info | `InfoPage` + `EnquiryCTA` | mindfulness **and** c4-akademie | c4-akademie (see §8.2) |
| 11 | C4 Akademie | `/c4-akademie` | room | `Room` | home | home |
| 12 | Meer oor ons | `/meer-oor-ons` | info | `InfoPage` | c4-akademie | c4-akademie |
| 13 | Ekstra klasse | `/ekstra-klasse` | info | `InfoPage` + `EnquiryCTA` | c4-akademie | c4-akademie |
| 14 | Toesprake | `/toesprake` | info | `InfoPage` + `EnquiryCTA` | c4-akademie | c4-akademie |
| 15 | Winkel / Shop | `/winkel` | catalogue (all, grouped) | `Catalogue` | home | home |
| 16 | Freebies | `/freebies` | freebies (all, grouped) | `FreebieList` | home | home |

That's **16 destinations** = 4 rooms + 12 pages, and **16 placements**: home 6, kuns 3, mindfulness 3, c4-akademie 4. Breinprofiele has 2 placements but only 1 destination. This matches design §16 exactly.

### 3.2 What exists in code today

| Today | Maps to | Notes |
|---|---|---|
| `about-me` (detail) | `/oor-my` | Placeholder text |
| `art` (gallery) | `/kuns` | Room is missing **Gallery** (Q5 is answered by design §7: 3 artworks) |
| `art-lessons` (detail) | `/kunslesse` | Placeholder text |
| `prints-paintings` (detail) | `/prints-and-paintings` | Will become a catalogue, not an info page |

Everything else is new.

---

## 4. Routing

### 4.1 URL scheme: ALIGNED with tech §3.2

```
/                → home room
/:slug           → look up slug in the content index → render by `type`
/gallery/:slug   → legacy redirect (only if D1/Q2 says the old URLs were shared)
/detail/:slug    → legacy redirect (same condition)
*                → NotFound
```

- Every slug is unique across rooms and pages. The build fails on a duplicate.
- `/gallery` (the portfolio, one path segment) and the legacy `/gallery/:slug` (two segments) don't collide.
- Import from `react-router`, not `react-router-dom` (tech §3.2).

### 4.2 Rendering: RESOLVED (C13, C20)

**Use React Router framework mode with `ssr: false` + `prerender`.** The prerender list comes from the content index, so every slug gets its own `index.html` with the correct `<title>`, description and `og:image`.

- Think of it as Jekyll output that becomes a React app after loading. GitHub Pages serves `/kuns/index.html` directly.
- This removes the `404.html` → `sessionStorage` → `replaceState` redirect for every real page. Keep `404.html` only for truly unknown URLs.
- WhatsApp/Facebook link previews then show the right artwork and title for each page.
- Assumption to verify first: `@react-router/dev` must support the project's Vite major version (8.x). If it doesn't yet, use the data router (`createBrowserRouter`) as tech §3.2 describes, plus a ~30-line post-build script that writes a per-slug `index.html` copy with the right meta tags. The route modules and components stay the same either way.

### 4.3 Back-navigation: ALIGNED with tech §3.2 (fixes B5)

- A room passes `state: { from: roomSlug }` when it links to a page.
- `BackLink` uses `state.from`. If that's missing (direct link, refresh, shared URL), it falls back to `defaultParent`.
- Breadcrumb: `Main gallery › C4 Akademie › Toesprake`. Rooms only show `‹ Main gallery`.

---

## 5. Content model

### 5.1 Shared conventions

- **Title** (C14): either `"Mindfulness"` with `titleLang: en`, or `{ af: "Oor my", en: "About Me" }`.
  - Bilingual titles always render **AF first**, matching the order in design §3.2/§4.
  - Both halves get the same size and weight, each in its own `<span lang>`.
- **Flags**: `published: boolean` on every page, product, freebie and work (C22).
- **Images**: referenced by path relative to `src/assets/` (e.g. `artworks/kuns/palette.png`). They're resolved through `import.meta.glob`, so the build fails on a missing file.

### 5.2 Layout

```
src/content/
  site.json                 # brand, tagline, email, phone, whatsapp, socials, nav order
  rooms/{home,kuns,mindfulness,c4-akademie}.json
  pages/*.md                # 12 pages, frontmatter + Markdown body
  products/*.json
  freebies/*.json
  works/*.json              # portfolio pieces (C1)
src/assets/
  artworks/<room>/*.png     # cut-out wall artworks (C23)
  decor/<room>/*.png
  products/  works/  freebies/   # covers / photos
```

### 5.3 Room (`rooms/*.json`)

```jsonc
{
  "slug": "kuns",
  "title": { "af": "Kuns", "en": "Art" },
  "intro": "Optional one-liner under the room heading",   // home: the welcoming phrase (design §5.2)
  "theme": "kuns",                                          // → .room--kuns tokens (§7.4)
  "artworks": [
    {
      "to": "kunslesse",                 // any slug: page OR room (home → kuns)
      "image": "artworks/kuns/palette.png",
      "alt": "A painter's palette covered in thick rainbow paint",
      "shape": "palette",                // portrait|landscape|square|round|oval|sign|object
      "size": "m",                       // s|m|l  (C4)
      "nudge": { "x": -1, "y": 2, "rotate": -2 }, // optional, desktop only (§7.2)
      "label": {                         // plaque (C5); title defaults to the target's title
        "artworkTitle": "Die Palet",
        "medium": "Acrylic on board",
        "blurb": "Come paint with me",
        "invite": "Step inside →"
      }
    }
  ],
  "decor": [ { "image": "decor/kuns/easel.png", "position": "left-bottom", "size": "m" } ]
}
```

### 5.4 Product (`products/*.json`): extends tech §3.3 (C9)

```jsonc
{
  "slug": "ouchie-fidget",
  "name": "Ouchie sensory fidget",
  "category": "mindfulness",            // art | mindfulness | c4
  "subcategory": "Sensory fidgets",     // used for grouping as the catalogue grows
  "description": "…",
  "intendedUse": "…",                   // design §8.3
  "medium": null, "dimensions": null,   // design §7.5 (art items)
  "price": 120,                         // ZAR, whole rand; null → "Price on enquiry"
  "options": ["Pink", "Blue"],          // design §8.3 "available variations"
  "status": "available",                // available | made-to-order | sold
  "image": "products/ouchie.jpg",
  "order": { "whatsappMessage": "Hi Carla, I'd like to order the Ouchie fidget" },
  "published": true
}
```

Catalogues list only `published && status !== "sold"` (design §7.5 "only available as available", §10.4).

### 5.5 Portfolio work (`works/*.json`): new (C1)

```jsonc
{ "slug": "…", "title": "…", "medium": "…", "year": 2025, "description": "…",
  "image": "works/…", "kind": "painting|drawing|aceo|illustration|other",
  "product": "optional-product-slug", "published": true }
```

The portfolio is "for viewing, not shopping" (design §7.4). A work only shows a small "available in Prints and Paintings" link if `product` is set and that product is available.

### 5.6 Page (`pages/*.md`)

```yaml
---
slug: toesprake
type: info                     # info | catalogue | freebies | portfolio
title: Toesprake
titleLang: af
defaultParent: c4-akademie
image: artworks/c4/mouth-braces.png
layout: default                # info only: default | personal (About)
filter: { category: mindfulness }   # catalogue/freebies only
services: [kunslesse, ekstra-klasse, toesprake, breinprofiele]  # winkel only (design §10.2)
cta: { label: "Bestel 'n toespraak op WhatsApp", message: "Hallo Carla, ek wil graag 'n toespraak bestel" }
description: "Speech writing for school and ATKV speeches, Grade R–12."   # <meta>, og
published: false               # stays false until prices are confirmed (design §9.5)
---
```

- **Body**: Markdown with GFM tables (price lists, design §9.4–9.5) and container directives for language blocks:

  ```md
  :::section{lang=af}
  **Onderwyser. Kunstenaar. Skrywer. Nuuskierige mens.**
  :::
  ```

  Rendered with `react-markdown` + `remark-gfm` + `remark-directive`. The directive becomes `<section lang="af">`.
- **Build-time parse and validation**: a small Vite plugin turns `.md` into `{ frontmatter, body }` at build time and runs `zod` schemas over all content. It fails the build on:
  - missing required fields
  - an unknown or duplicate slug
  - a room `to:` pointing at a missing slug
  - a missing image or freebie file
  - an internal Markdown link to a missing slug (C21)
  - plaque text over the length limit (§7.3)

  Parsing at build time, in Node, avoids shipping a frontmatter parser to the browser. Parsers like `gray-matter` expect Node's `Buffer`.

### 5.7 Freebie (`freebies/*.json`): extends tech §3.3

```jsonc
{ "slug": "…", "title": "…", "description": "…", "audience": "Ages 6+",
  "category": "mindfulness",          // mindfulness | art | education
  "file": "/freebies/colouring-book-1.pdf",   // or an external URL (D9)
  "cover": "freebies/colouring-book-1.png", "published": true }
```

---

## 6. Components: design requirement → component

| Component | Design requirement served | Source |
|---|---|---|
| `MuseumLayout` | Shell for every page: skip link, `SiteHeader`, `<Outlet>`, `Footer`, scroll restoration, route-change focus | tech §3.4 + C6 |
| `SiteHeader` | Brand signature (§5.2), conventional nav to the 6 sections, always-visible WhatsApp (§13.2) | **new** (C6) |
| `Room` | Gallery rooms (§4, §7–9), theme class, decor layer, irregular composition (§2.5, §13.4) | tech §3.4 + C8 |
| `ArtworkLink` | Artwork as entrance (§1), shape + size variants (§2.4), focus ring that follows the shape | tech §3.4 + C4 |
| `Plaque` | Museum label (§2.6), equal-weight bilingual titles (§3.2) | tech §3.4 + C5 |
| `InfoPage` | About, Kunslesse, Breinprofiele, Meer oor ons, Ekstra klasse, Toesprake. The `personal` layout adds framed sections and handwritten accents (§6.2) | tech §3.4 |
| `Catalogue` / `ProductCard` | Prints and Paintings, Products, Shop (§7.5, §8.3, §10). Groups by category, hides empty groups, shows a "services" strip on Shop and a WhatsApp catalogue fallback | tech §3.4 + C3, C9 |
| `Portfolio` / `WorkCard` | Gallery (§7.4) | **new** (C1) |
| `FreebieList` / `FreebieCard` | Freebies + Mindfulness Freebies (§8.4, §11). Shows the file type and size on the download button | tech §3.4 + C2 |
| `EnquiryCTA` | "Enquire via WhatsApp" on service and product pages (§7.3, §9.4, §9.5, §12) | **new** (C10) |
| `Breadcrumbs` / `BackLink` | §13.2 | tech §3.4 |
| `Footer` | §12 | tech §3.4 |
| `NotFound` | One shared page that replaces both copies of the "not on the wall yet" markup | tech §3.4 (fixes B4) |
| `PageMeta` | Per-page title and description. With prerender, these are also baked into the HTML (C13) | tech §3.4 |

---

## 7. Visual system & layout

### 7.1 Shell (C12)

- Wall: a per-room colour token, with the existing `wall.png` texture over it (`background-blend-mode: multiply`). Painted with a fixed-position `::before` instead of `background-attachment: fixed` (tech §3.5; iOS ignores `fixed`).
- Floor: a static band at the bottom of room pages, inside the page flow. It's no longer `position: fixed`.
- Footer: below the floor, visually quiet (design §12: "should not compete").

### 7.2 Composition (design §2.5, §13.4–13.5; tech Q7)

- Every placement keeps a **square slot**, which already exists today (`.painting-slot`).
- **Size within the slot** (C4): `s` ≈ 55% (reads as ACEO), `m` ≈ 80%, `l` = 100% plus a slightly larger slot on desktop.
- **Desktop (≥1330px)**: a CSS grid. Each placement can carry a small `nudge` (a few % offset, ±3° rotation) so the wall looks hand-hung but stays balanced. This avoids fully hand-placed absolute positions, which break when the viewport changes. *Owner reviews the result in a prototype (D11).*
- **Tablet (720–1329px)**: 2–3 column grid, with `nudge` reduced to half.
- **Phone (<720px)**: 1 column, plus 2 columns for consecutive `s` pieces. Rows alternate left and right alignment. Shapes, sizes and plaques stay, so the page never looks like a list of identical buttons (design §13.5).
- No horizontal scroll at any width.

### 7.3 Plaque (C5)

```
┌──────────────────────────┐
│ OOR MY / ABOUT ME        │  ← destination title (required). Link's accessible name.
│ "Self-portrait in blue"  │  ← artworkTitle (optional, italic)
│ Pencil on canvas         │  ← medium (optional, small)
│ Step inside →            │  ← invite or blurb (optional, small)
└──────────────────────────┘
```

- Height grows with content (remove `height: 58px` and `line-clamp`).
- Validation limits: the optional lines together ≤ 90 characters, so plaques stay "small museum labels".
- Accessibility: the link is named by the plaque title (`aria-labelledby`). The image `alt` describes the artwork and is exposed with `aria-describedby`. This replaces the current `aria-label="Open …"`, which violates WCAG 2.5.3 (tech §2.4).
- Contrast: plaque ink on the plaque gradient must be ≥ 4.5:1. Today's text is `#2d261d` on light plaques, which is fine on the plaque. B6 (dark text on the dark fallback background) is fixed by moving page text onto tokens.

### 7.4 Room atmosphere (C8, C16)

- `.room--home`, `.room--kuns`, `.room--mindfulness`, `.room--c4` set `--wall`, `--accent`, `--plaque-ink` and an optional texture overlay. The actual colours come from design §2.2 and are tuned per room.
- `decor[]` images: `aria-hidden`, `pointer-events: none`, placed behind artworks. On phones they're dropped or reduced to one item, because decor must not compete with clickable artworks (design §2.3).
- Neon (C4 sign, §9.2): an optional CSS glow or flicker, only inside `@media (prefers-reduced-motion: no-preference)`.

### 7.5 Info pages (C11; design §13.6, §15.5)

- Normal document scroll. On desktop: two columns, with the artwork in a sticky left column and text at a max of ~68ch. On mobile: artwork on top.
- `layout: personal` (About): framed text panels, `--font-hand` for short accents only (pull quotes, the "Onderwyser. Kunstenaar…" line). Body text always uses `--font-body`.
- Price tables: real `<table>`s with right-aligned prices and a caption.
- Gallery identity is kept with the wall texture, a plaque-style heading and the breadcrumb (design §15.5).

### 7.6 Tokens (tech §3.5)

`src/styles/tokens.css`: colours (UI chrome only, C16), 3 font roles (C15, D6), a spacing scale, and breakpoints as comments (`720px`, `1330px`). All other CSS is in CSS Modules, except `reset.css`, `tokens.css` and the `texture-*` utilities.

---

## 8. Navigation & wayfinding (design §13)

### 8.1 Always available

| Need (design §13.2) | Where |
|---|---|
| Return to main gallery | Header brand link · breadcrumb root · footer |
| Return to previous room | `BackLink` / breadcrumb (§4.3) |
| Reach another main section | Header menu · footer |
| Find Shop / Freebies | Header menu (both are main sections) |
| Contact Carla | Header WhatsApp button · footer · `EnquiryCTA` on service pages |

Labels are identical everywhere (design §13.3). They are generated from the room and page `title`s, never typed in twice.

### 8.2 Shared page parent: RESOLVED

Breinprofiele's `defaultParent` is **c4-akademie**. The consultation is an educational service, and parents are the main audience of that room (design §9.1). Visitors arriving from Mindfulness still get "back to Mindfulness" through router state.

---

## 9. Enquiries & WhatsApp (design §7.3, §8.3, §9.4–9.5, §10.4, §12)

- Links use `https://wa.me/<number>?text=<url-encoded prefilled message>`. The number lives only in `site.json`.
- Each service page and product sets its own prefilled message, in the language of that page.
- Shop/Products: while the catalogue is thin, the page shows a prominent "Browse the full WhatsApp catalogue" link (design §8.3, §10.4). Whether that's one link or one per category is D7.
- No contact form. Design §12 only asks for contact info and WhatsApp, which keeps GitHub Pages hosting viable. This answers part of tech Q11.

---

## 10. Assets

### 10.1 Pipeline: ALIGNED with tech §3.6

- Artwork goes in `src/assets/`, so Vite fingerprints it and drops anything unused. Variants come from `vite-imagetools` (AVIF + WebP + PNG fallback, widths 400/800/1200).
- Always emit `width`/`height`. Use `fetchpriority="high"` on the first homepage artwork and `loading="lazy"` on the rest.
- Budget: ≤ 200 KB per wall image at 800w. The home wall should be under 1 MB total, compared with about 4.5 MB today.
- Freebie PDFs live in `public/freebies/` (stable URLs, no hashing) unless D9 chooses external hosting.

### 10.2 Cut-out step (C23)

Physical artworks are photographed on blue cloth. Before import:

1. Mask to the object edge (GIMP, or `rembg` for a batch first pass).
2. Export a transparent PNG master.
3. Store the masters outside `src/`, for example in a `assets-src/` folder that isn't deployed, or outside the repo (tech Q6).

The shape is then carried by the image itself (palette, sign, oval). `shape` in content only tunes the focus ring and hover shadow, e.g. `border-radius: 50%` for round pieces.

### 10.3 Existing images → design concepts (answers part of Q6)

| File | What it shows (WIP sketch unless noted) | Likely design concept |
|---|---|---|
| `about-me.png` | Portrait sketch | §5.3 About Me (not final) |
| `art.png` | **Painted** artist palette | §7.3 Kunslesse *or* §5.3 Kuns → **D4** |
| `art/art-lessons.png` | Girl-with-a-Pearl-Earring-style sketch | Kunslesse placeholder, or Gallery (§7.4) → **D4** |
| `art/prints-and-paintings.png` | Small pieces laid out on a surface | §7.5 / §14.9 ACEO workspace |
| `artwork-01.png` | Head silhouette with stationery | §8.5 / §14.8 Breinprofiele |
| `artwork-03.png` | Planner, calendar, journal | §8.3 / §14.7 Mindfulness Products |
| `artwork-04.png` | Round smiley | Unassigned (Mindfulness homepage candidate?) |
| `artwork-05.png` | House with sun | Unassigned |
| `artwork-06.png` | Square pop-art gift | §5.3 / §14.2 Freebies (square) |
| `artwork-08.png` | Books, set square, stationery | §14.3 C4 still life or §14.6 Ekstra klasse |
| `artwork-09.png` | "C4" neon-style lettering | §5.3 / §9.2 C4 neon sign |
| `artwork-10.png` | Irregular shard/cone shape | Unassigned |
| `artwork-11.png` | Key with heart | §9.3 / §14.4 Meer oor ons |
| `artwork-14.png` | Lightbulb with brain | Unassigned (Breinprofiele alt / C4) |
| `artwork-15.png` | Oval mouth with braces | §9.5 / §14.1 Toesprake |
| `mindfulness/free.png` | Oval pop-art gift | §14.2 Freebies (oval) |
| `shop.png` | **Painted** octagonal sign reading "STOP" | §5.3 Winkel sign → **D4** |

---

## 11. Accessibility, SEO & quality (tech §2.4, §3.5–3.6)

- Each page has one `<h1>`: the room or page title. On the home page, the h1 is the "Carla.S.Botha" signature.
- Room artworks go in a `<ul>` inside `<main>`. The header menu is the `<nav>`. Remove `aria-label="Gallery navigation"` from `<main>`.
- `:focus-visible` style on every interactive element. All motion (hover scale, neon) goes inside `prefers-reduced-motion: no-preference`.
- On route change, focus moves to the `<h1>` and scroll is restored or reset.
- Language: `<html lang>` = the primary language (D2). Every block or title in the other language gets its own `lang`.
- `PageMeta` gives every page a title (`<Page> — Carla.S.Botha`), a description and `og:image`. These are prerendered (C13).
- Content guardrails from the design, applied in content review rather than code:
  - No medical claims (§8.3, §8.5).
  - The Master's in Art Therapy is described as a future ambition (§6.5).
  - Adult sessions aren't shown as bookable unless they are (§7.3).
  - Only confirmed subjects are listed (§9.4).
- `npm run check` = lint + content validation, run in CI before the build. Vitest smoke test: every published slug renders, unknown paths render `NotFound`.
- Housekeeping from tech §2.2 / §3.6:
  - Drop `master` from the workflow trigger.
  - Add `"engines": { "node": ">=22" }`.
  - Switch to the `react-router` package.

### 11.1 Current bugs → where they're fixed

| Bug | Fixed by |
|---|---|
| B1 stray `3` (`src/pages/Gallery.jsx:55`) | Replaced by `Room` (fix directly if a hotfix is shipped earlier) |
| B2 `portriat` / `shape` has no effect | `shape` enum validated by zod + shape CSS (§7.2) |
| B3 non-recursive gallery lookup | Flat slug index (§4.1) |
| B4 no catch-all | `NotFound` route |
| B5 back-link always `/` | `BackLink` (§4.3) |
| B6 dark text on dark fallback | Tokens (§7.6) |

---

## 12. Out of scope (design §15.3)

Robotics, SmartyPantZ, new art courses, extra subjects and an expanded shop are **not** built. Adding them later should only need a new content file plus a placement in a room.

---

## 13. Decision log: DECISION NEEDED

| # | Question | Recommended default | Blocks |
|---|---|---|---|
| D1 | URL language: slugs follow the first label (`/oor-my`, `/kuns`, `/winkel`, `/gallery`), all-English, or all-Afrikaans? Also tech Q2: were the old `/gallery/*` and `/detail/*` links shared? | First-label rule (table §3.1). Add legacy redirects only if the old links were shared. | Routing (task 2) |
| D2 | Bilingual presentation, and which language is primary site-wide (tech Q3, design §17 last bullet). Is About shown as AF and EN **stacked**, or with an in-page AF/EN switch? | No site-wide toggle. About is stacked, AF first, with "Lees in Afrikaans / Read in English" jump links. Primary `lang`: **af**. | About page, `<html lang>` |
| D3 | Destinations with nothing ready (C7). Do the homepage artworks always show? What do empty Shop/Freebies pages show? | The six homepage artworks always show. Empty Shop/Products show the WhatsApp-catalogue fallback. Empty Freebies shows a single "first gifts are being wrapped" note, not empty categories. Room placements whose target page is unpublished are hidden. | Catalogue/FreebieList states |
| D4 | Artwork assignment (C18). Is the painted palette for **Kuns** (current code) or **Kunslesse** (design §7.3)? Is the pearl-earring sketch Kunslesse or Gallery? Is "STOP" on the shop sign intended (a pun) or still to be repainted as "SHOP"? Where do `artwork-04/05/10/14` go? | Follow the design: palette → Kunslesse. Keep everything else as a placeholder until §17 items are final. | Room content only (not code) |
| D5 | Speech-writing price list and delivery format (PDF vs Word). Design §9.5 says these must be confirmed. | Use the second list and PDF. Keep `toesprake` at `published: false` until confirmed. | Toesprake publication |
| D6 | Fonts: display (retro/sign lettering), handwritten accent, body | Self-hosted through `@fontsource` (no Google Fonts requests, so no third-party IP logging). Pick 1 display + 1 hand + 1 readable body. | Tokens |
| D7 | WhatsApp: the number, one catalogue link or one per category, and the wording of prefilled messages (tech Q9) | One number. Per-category catalogue links if WhatsApp Business collections exist, otherwise one link. | `EnquiryCTA`, Shop |
| D8 | Who edits content after launch (tech Q4)? | Markdown/JSON in the repo now. The file-based schema allows a git-backed CMS (Decap) later without restructuring. | Editing workflow |
| D9 | Freebie file hosting (tech Q8) | `public/freebies/` in the repo while the total is under ~50 MB | Freebies |
| D10 | Final domain (Q10), analytics/privacy (Q11; South Africa's POPIA applies if anything is tracked), browser support (Q12) | Keep the current domain. No analytics, or cookieless analytics only. Last 2 versions of evergreen browsers, plus iOS Safari 16+ with WebP/PNG fallback. | Prerender base URL, `<picture>` formats |
| D11 | Irregular composition (Q7): approve the grid + nudge approach from a prototype of the home wall | Grid + `size` + `nudge` (§7.2) | Room layout sign-off |

### 13.1 Content blockers (from design §17)

These don't block building. Pages ship with `published: false` until they're filled in.

- Final artworks:
  - About, Art and Mindfulness homepage artworks
  - Shop sign
  - Gallery portfolio pieces
  - Kunslesse and Toesprake artworks
- Art lesson formats, ages and prices. Adult sessions only if they can be booked.
- Extra C4 subjects. Breinprofiele consultation offerings and prices.
- Product inventory and availability, and which freebies are ready.
- The approved full AF and EN biographies (design §6.5 refers to them, but they aren't in the repo).
- Contact details and social links.

---

## 14. Implementation plan

The phases run in dependency order. Each task leaves the site deployable.

1. **Content model + build-time validation** (§5).
   - Create `src/content/` and the zod schemas.
   - Write the Vite plugin that parses Markdown and validates content.
   - Build the slug index.
   - Migrate the 3 existing nodes, and stub the remaining 13 destinations with `published: false`.
   - Add `npm run check` to CI.
   - No UI changes yet. This makes the 16-destination structure real and testable, and it's what every later task reads from.
2. **Routing + layout shell** (§4, §6, §7.1, §8).
   - Verify Vite 8 support, then set up framework-mode prerender (or the fallback).
   - Add the flat `/:slug` route, `MuseumLayout` with `SiteHeader` / `Footer` / static floor, `NotFound`, `PageMeta`, `BackLink`/breadcrumbs, and legacy redirects if D1 calls for them.
   - This closes B1, B3, B4, B5 and B6, and C6, C12, C13, C19 and C20.
3. **Room wall: `Room` / `ArtworkLink` / `Plaque`** (§7.2–7.4).
   - Add shape, size and nudge variants, the structured plaque, the accessible names, focus and reduced-motion handling, and per-room theme tokens.
   - Use the existing images for now, behind `vite-imagetools`.
   - Ship it as the home-wall prototype for D11 sign-off. This closes B2, C4, C5 and C8.

After that:

4. `InfoPage` + `EnquiryCTA` + Markdown rendering. About, then the services.
5. `Catalogue` / `ProductCard` (3 pages).
6. `FreebieList` (2 pages).
7. `Portfolio`.
8. Asset cut-out and optimisation pass, and moving the masters out of `public/`.
9. Accessibility and Lighthouse audit, then content fill as the blockers clear.
