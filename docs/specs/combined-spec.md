# Carla.S.Botha: Combined Specification

> **Status:** Draft v2, 2026-10-15. Owner decisions D1–D11 are applied (§13). Built from [`design-spec.md`](./design-spec.md) and [`technical-spec.md`](./technical-spec.md), checked against the code at `ec904dd` (the `src/` tree has not changed since `201e29d`). No app code has been changed.
>
> **Source documents:** The two specs above are left unchanged. This document supersedes both **where they disagree**, and the owner decisions in §13 supersede both. Where this file is silent, the source documents still apply.
>
> **Legend**
> - **ALIGNED**: the design requirement and the technical plan already agree.
> - **RESOLVED**: there was a conflict or gap, and this spec picks a resolution.
> - **OWNER DECISION**: settled by the site owner (§13).
> - **ASSUMPTION**: a call made here where the owner said "use best judgement". It's easy to change.
> - **CONTENT BLOCKER**: the structure is ready, but real content (final artworks, prices, numbers) still has to be supplied.
> - `D#` refers to the decision log in §13. `C#` refers to the conflict log in §2. `B#` refers to the bug table in technical-spec §2.1.

---

## 1. Alignment at a glance

| Area | Design spec | Technical spec | Status |
|---|---|---|---|
| Stack | No stated requirements | React + Vite + React Router + plain CSS | ALIGNED. |
| Page inventory | 16 destinations, 16 artwork placements (§16) | Rooms reference pages; 4 page types | ALIGNED. The mapping is written down in §3. |
| Shared pages | One underlying page reachable from several places (§15.4) | Flat slugs, rooms *reference* pages | ALIGNED. |
| "Only display what is ready" | §15.3, §8.4, §10.3, §11.2 | `published: false` hides pages | **Replaced by D3.** Every destination is always shown, and missing artwork gets a placeholder (§7.5). |
| Language | Mixed AF/EN per section; About fully in both (§3.2) | Q3 open | **Replaced by D2.** AF is primary, short labels show both languages, and a site-wide toggle switches full content (§8). |
| URLs & code | AF/EN labels | Q1 open | **D1:** URLs, file names and code are all English (§3). |
| Artwork storage | — | Move images to `src/assets/` for hashing | **Replaced by D4.** Images stay in `public/paintings/`, in a folder tree that mirrors the rooms. A build step optimises them instead (§10). |
| Square display area per artwork | §2.5 | Existing `.painting-slot` is `aspect-ratio: 1/1` | ALIGNED. Keep it. |
| Varied shapes *and sizes* | §2.4 | `shape` variants only | RESOLVED (C4): add `size`. |
| Museum labels | §2.6 | Bilingual title; current CSS clamps to 2 lines | RESOLVED (C5). |
| Conventional navigation | §5.2, §13.2 | `Footer` only | RESOLVED (C6): add `SiteHeader`. |
| Back to previous room | §13.2 | `state.from` + `defaultParent` | ALIGNED. Also fixes B5. |
| Catalogues with prices | §7.5, §8.3, §10 | `products/*.json` | RESOLVED (C9): the schema is extended. |
| Portfolio ("Gallery") | §7.4 | No component or data shape | RESOLVED (C1). |
| WhatsApp enquiries | §7.3, §9.4, §9.5, §12 | `Footer` / `ProductCard` only | RESOLVED (C10) with D7. |
| Content editing | — | Q4 open | **D8:** the developer edits code and Markdown; a non-developer (Carla's family) edits JSON data files (§5.8). |
| Readability | §13.6 | Detail page scrolls inside a 62vh box | RESOLVED (C11). |
| Footer on every page | §12 | `MuseumLayout` → `Footer` | ALIGNED. The fixed-floor collision is fixed (C12). |
| Link sharing | WhatsApp is the main channel | Prerender "optional" | RESOLVED (C13): prerender is part of the plan. |

---

## 2. Conflict & gap log

| # | Sources | Problem | Resolution |
|---|---|---|---|
| C1 | design §7.4 / tech §3.3–3.4 | The `portfolio` type has no component and no data shape. | Add `Portfolio` + `WorkCard` and `content/works/*.json` (§5.5). |
| C2 | design §8.4, §16 / tech §3.3 | Mindfulness Freebies is one of the 16 destinations, but the tech spec only has a category filter for it. | It becomes its own page, `/mindfulness-freebies`, reading the same freebie files with a filter (§3.1). |
| C3 | design §7.5, §8.3, §10 | Products, Prints and Paintings, and Shop all show products. The tech spec doesn't say how they relate. | All 3 are `catalogue` pages over **one** product pool. Shop shows everything (§3.1, §5.4). |
| C4 | design §2.4 / code `Gallery.css` | Every slot is the same width, so nothing reads as ACEO-small or large. `shape` has no effect (B2). | A `size: s \| m \| l` field scales the artwork inside its square slot (§7.2). |
| C5 | design §2.6 / code `.painting-plaque` | `height: 58px` + `line-clamp: 2` cuts off bilingual titles and the optional label lines. | Structured plaque with an auto height (§7.3). |
| C6 | design §5.2, §13.2 | A footer alone doesn't make Shop, Freebies and Contact reachable *at all times*. | A slim `SiteHeader` with the brand, the 6 sections, the AF/EN toggle and WhatsApp (§9). |
| C7 | design §15.3 vs §3.2, §13.3 | "Only show what's ready" conflicts with the confirmed destinations. | **D3:** everything is shown, with placeholders where artwork or content is missing (§7.5). |
| C8 | design §2.3, §7.2, §8.2, §9.2 | Room atmosphere has no data model. | `theme` + optional `decor[]` per room (§7.4). |
| C9 | design §7.5, §8.3, §10.3 | The product schema has no field for dimensions, medium, availability or intended use. | Extended schema (§5.4). |
| C10 | design §7.3, §9.4, §9.5, §12 | There's no WhatsApp call-to-action component. | `EnquiryCTA` with message templates (§11, D7). |
| C11 | design §13.6 / code `.detail-copy` | Long text is trapped in an inner scroll box that keyboards can't reach. | Normal document scroll (§7.6). |
| C12 | design §12 / code `.museum-floor` (`position: fixed`) | The fixed floor would cover the footer and costs 100px of every phone screen. | **Owner decision (2026-10-15):** the floor stays fixed to the viewport bottom on every page, in front of the wall content. Main content gets bottom padding equal to the floor height, and the footer scrolls up over the floor at the end of the page (§7.1). |
| C13 | design §12 / tech §3.2 | A client-only SPA gives every page the same generic WhatsApp link preview. | Prerender every route at build time (§4.2). |
| C14 | design §3.2 / tech §3.3 | Some titles are AF-only or EN-only. | **D2:** every title stores both `af` and `en`. If they're identical (e.g. "Mindfulness"), it's shown once (§8.2). |
| C15 | design §6.2, §5.3 / tech §3.5 | No fonts chosen; Arial everywhere. | **D6:** Bungee / Caveat / Nunito (§7.7). |
| C16 | design §2.2 "no strict palette" / tech §3.5 "no raw hex" | Looks contradictory, but isn't. | The token rule covers **UI chrome** only. Artwork colour lives in the images. |
| C17 | tech §2.3, Q6 / `public/paintings/` | The tech spec treats `artwork-*.png` etc. as possibly dead weight. A visual check shows they're photos of unfinished artworks matching design §14. | **D4:** they're renamed into the room folder structure. Only the one unassigned file moves out of `public/` (§10.3). |
| C18 | tech §3.6 (`src/assets/` + `vite-imagetools`) vs D4 (`public/` folders) | Files in `public/` are copied as-is. They don't get Vite's hashing, resizing or unused-file removal. | A build-time manifest plus a `sharp` post-build step brings back sizes and modern formats (§10.2). |
| C19 | design brand / `index.html`, `404.html` | The brand appears as "Carla S Botha" in the code but "Carla.S.Botha" in the design. | "Carla.S.Botha" everywhere, from `site.json`. |
| C20 | tech §3.2 | Moving to the data router now and to framework mode later means rewriting the router twice. | Go straight to the final approach (§4.2). |
| C21 | design §6.6, §9.3 | Internal links in Markdown cause full reloads and can't be checked. | Render internal links as router `<Link>`s, and validate their targets at build time (§5.7). |
| C22 | tech §3.3 (`ready` vs `published`) | Two flags have the same meaning. | One optional `published` flag, defaulting to `true` (§5.1). |
| C23 | design §2.4 / photos on blue cloth | Shaped artworks (palette, sign, oval) don't read as objects while the background cloth is visible. | A cut-out step when the **final** artworks arrive (§10.4). The current photos are temporary (D4), so they're used as they are. |
| C24 | D1 (all-English URLs) vs D2 (Afrikaans primary) | The URLs are English while the default display language is Afrikaans. | This is deliberate. URLs and code are an internal convention, and visitors read the AF/EN labels, not the slugs. |

---

## 3. Information architecture

### 3.1 Destinations → slug, type, component (D1: English)

| # | Destination (design §16) | Slug | Type | Rendered by | Placed in | Default parent |
|---|---|---|---|---|---|---|
| 1 | Home | `/` | room | `Room` | — | — |
| 2 | Oor my / About Me | `/about-me` | info (`layout: personal`) | `InfoPage` | home | home |
| 3 | Kuns / Art | `/art` | room | `Room` | home | home |
| 4 | Kunslesse / Art Lessons | `/art-lessons` | info | `InfoPage` + `EnquiryCTA` | art | art |
| 5 | Gallery | `/gallery` | portfolio | `Portfolio` | art | art |
| 6 | Prints and Paintings | `/prints-and-paintings` | catalogue (`filter: art`) | `Catalogue` | art | art |
| 7 | Mindfulness | `/mindfulness` | room | `Room` | home | home |
| 8 | Products | `/mindfulness-products` | catalogue (`filter: mindfulness`) | `Catalogue` | mindfulness | mindfulness |
| 9 | Mindfulness Freebies | `/mindfulness-freebies` | freebies (`filter: mindfulness`) | `FreebieList` | mindfulness | mindfulness |
| 10 | Breinprofiele en Studiemetodes | `/brain-profiles` | info | `InfoPage` + `EnquiryCTA` | mindfulness **and** c4-akademie | c4-akademie |
| 11 | C4 Akademie | `/c4-akademie` | room | `Room` | home | home |
| 12 | Meer oor ons | `/about-c4` | info | `InfoPage` | c4-akademie | c4-akademie |
| 13 | Ekstra klasse | `/extra-classes` | info | `InfoPage` + `EnquiryCTA` | c4-akademie | c4-akademie |
| 14 | Toesprake | `/speeches` | info | `InfoPage` + `EnquiryCTA` | c4-akademie | c4-akademie |
| 15 | Winkel / Shop | `/shop` | catalogue (all, grouped) | `Catalogue` | home | home |
| 16 | Freebies | `/freebies` | freebies (all, grouped) | `FreebieList` | home | home |

- That's 16 destinations (4 rooms + 12 pages) and 16 placements (home 6, art 3, mindfulness 3, c4-akademie 4). This matches design §16.
- **Owner exception to D1:** *C4 Akademie* is a brand name, so its slug stays `/c4-akademie` (decided 2026-10-15). Its displayed title is **C4 Akademie** in both languages.
- `/about-c4` is used instead of `/about-us`, so it can't be confused with `/about-me`.
- Breinprofiele's default parent is c4-akademie, because consultations are an educational service and parents are that room's audience. Visitors arriving from Mindfulness still get "back to Mindfulness" through router state.

### 3.2 What exists in code today

| Today | Becomes |
|---|---|
| `about-me` (detail) | `/about-me` (the slug is unchanged) |
| `art` (gallery) | `/art` room. It gains **Gallery** as its 3rd artwork. |
| `art-lessons` (detail) | `/art-lessons` |
| `prints-paintings` (detail) | `/prints-and-paintings`, now a catalogue |

---

## 4. Routing

### 4.1 URL scheme

```
/        → home room
/:slug   → content index lookup → render by `type`
*        → NotFound
```

- **D1:** no old links were shared, so there are **no legacy redirects** for `/gallery/*` and `/detail/*`.
- Slugs are unique across rooms and pages. The build fails on a duplicate.
- The language is **not** part of the URL. There's one URL per destination, and the toggle is a display preference (§8).
- Import from `react-router`, not `react-router-dom`.

### 4.2 Rendering (C13, C20)

**React Router framework mode, `ssr: false` + `prerender`**, with the route list taken from the content index.

- Every slug gets its own `index.html` with the right title, description and `og:image`. That gives correct WhatsApp link previews.
- GitHub Pages serves these files directly, so the `404.html` → `sessionStorage` redirect isn't needed for real pages.
- Pages are prerendered in **Afrikaans**, the primary language (D2).
- Check first: `@react-router/dev` must support Vite 8.x. If it doesn't yet, use `createBrowserRouter` plus a small post-build script that writes one `index.html` per slug with the right meta tags. Route modules and components are the same either way.

### 4.3 Back-navigation (fixes B5)

- A room passes `state: { from: roomSlug }` when it links to a page. `BackLink` falls back to `defaultParent` when that state is missing.
- Breadcrumb: `Main gallery › C4 Akademie › Toesprake / Speeches`.

---

## 5. Content model

### 5.1 Shared conventions

- **Everything in code and data is English**: keys, slugs, file and folder names (D1). Afrikaans appears only in text *values*.
- **Localised text** is either a plain string (the same in both languages) or `{ "af": "…", "en": "…" }`. Titles are always `{ af, en }` (C14).
- **`published`** is optional, defaults to `true`, and only means "draft, hide this item". It isn't used to hide whole destinations (D3).
- **Images** are found by convention, not by full paths (§10.1). Data files list just a file name, or nothing at all.

### 5.2 Layout

```
src/content/
  site.json                    # brand, contact, socials, WhatsApp number + catalogue links + message templates
  ui.json                      # interface strings {af,en}: "Back to", "Download", "Coming soon"…
  rooms/{home,art,mindfulness,c4-akademie}.json
  pages/<slug>/
    page.json                  # metadata (editable by the non-developer editor)
    af.md                      # Afrikaans body (developer-edited)
    en.md                      # English body (optional)
  products/<slug>.json         # one file per product
  freebies/<slug>.json
  works/<slug>.json
schemas/*.schema.json          # generated from zod; gives editors autocomplete + inline errors
```

Splitting metadata (`page.json`) from bodies (`af.md` / `en.md`) does 3 things:
- it keeps D8 clean, because the JSON editor never touches Markdown
- it makes the language toggle a simple file choice
- it removes the need for a frontmatter parser.

### 5.3 Room (`rooms/art.json`)

```json
{
  "$schema": "../../../schemas/room.schema.json",
  "title": { "af": "Kuns", "en": "Art" },
  "intro": { "af": "…", "en": "…" },
  "theme": "art",
  "artworks": [
    {
      "to": "art-lessons",
      "alt": { "af": "…", "en": "A painter's palette covered in thick rainbow paint" },
      "shape": "palette",
      "size": "m",
      "place": { "col": 2, "row": 1, "span": 1 },
      "nudge": { "x": -1, "y": 2, "rotate": -2 },
      "label": { "artworkTitle": "…", "medium": "Acrylic on board", "invite": { "af": "Stap in →", "en": "Step inside →" } }
    }
  ],
  "decor": [ { "image": "easel.png", "position": "left-bottom", "size": "m" } ]
}
```

- The slug comes from the file name (`rooms/art.json` → `art`; `pages/<slug>/`, `products/<slug>.json` likewise), so it can't get out of sync with a field. Files starting with `_` are ignored, so `_example.json` templates can sit next to the real data.
- `to` can be a page **or** a room (home → art).
- No `image` field is needed. The artwork is `public/paintings/art/art-lessons.*` by convention (§10.1). An optional `image` override exists for the shared Breinprofiele placement (design §9.6).
- `shape` is one of `portrait | landscape | square | round | oval | sign | palette | object`.
- `place` and `nudge` are optional and desktop-only (§7.2).

### 5.4 Product (`products/<slug>.json`)

```json
{
  "$schema": "../../../schemas/product.schema.json",
  "name": { "af": "Ouchie sensoriese fidget", "en": "Ouchie sensory fidget" },
  "category": "mindfulness",
  "subcategory": "Sensory fidgets",
  "description": { "af": "…", "en": "…" },
  "intendedUse": { "af": "…", "en": "…" },
  "medium": null,
  "dimensions": null,
  "price": 120,
  "options": ["Pink", "Blue"],
  "status": "available",
  "image": "ouchie-fidget.jpg"
}
```

- `category` is one of `art | mindfulness | c4`.
- `price` is a number in whole rand. Use `null` for "price on enquiry".
- `status` is one of `available | made-to-order | sold`. Sold items drop out of catalogues but can still appear in the Portfolio.
- The `image` file lives in that category's catalogue folder (§10.1).

### 5.5 Portfolio work (`works/<slug>.json`)

```json
{ "title": { "af": "…", "en": "…" }, "medium": "…", "year": 2025, "kind": "painting",
  "description": { "af": "…", "en": "…" }, "image": "blue-portrait.jpg", "product": null }
```

- `kind` is one of `painting | drawing | aceo | illustration | other`.
- If `product` is set and that product is available, the card shows a small "available in Prints and Paintings" link.

### 5.6 Freebie (`freebies/<slug>.json`)

```json
{ "title": { "af": "…", "en": "…" }, "description": { "af": "…", "en": "…" },
  "audience": "Ages 6+", "category": "mindfulness",
  "file": "downloads/colouring-book-1.pdf", "cover": "colouring-book-1.png" }
```

- **D9:** `file` takes either a path in `public/` or a full `https://` URL, so moving to Google Drive later is a data change only.

### 5.7 Page (`pages/<slug>/page.json` + bodies)

```json
{
  "$schema": "../../../../schemas/page.schema.json",
  "type": "info",
  "title": { "af": "Toesprake", "en": "Speeches" },
  "defaultParent": "c4-akademie",
  "layout": "default",
  "description": { "af": "…", "en": "Speech writing for school and ATKV speeches, Grade R–12." },
  "cta": { "label": { "af": "Bestel 'n toespraak", "en": "Order a speech" }, "template": "speech" }
}
```

- Catalogue and freebies pages add `"filter": { "category": "…" }`. Shop adds `"services": ["art-lessons", "extra-classes", "speeches", "brain-profiles"]` (design §10.2).
- **Bodies** are Markdown with GFM tables for price lists, rendered with `react-markdown` + `remark-gfm`. Internal links like `/extra-classes` render as router `<Link>`s (C21).
- **Validation** runs in a small Vite plugin with zod. It runs in dev, at build, and via `npm run check` in CI.
  - **Errors fail the build:** bad JSON, a wrong field type, an unknown or duplicate slug, a `to:` or internal link pointing at a missing slug.
  - **Warnings don't fail the build** (D3): a missing artwork image (the placeholder is used), a missing `en.md`, a missing product image.

### 5.8 Editing by a non-developer (D8)

The person editing the JSON files isn't a developer, so the setup has to protect them from mistakes:

- **One item per file.** Adding a product means copying a file and changing its values. There's never a long array to break with a stray comma.
- **Strict JSON, plain values.** Prices are numbers (`120`, not `"R120"`). There are no nested structures beyond `{ af, en }`.
- **`$schema` at the top of every file.** In VSCodium this gives autocomplete, dropdowns for `category`/`status`, and red underlines on mistakes while typing. The schemas are generated from the zod schemas, so they can't drift apart.
- **Friendly errors**, which name the file, the field and an example. For example: `products/ouchie-fidget.json → "price" must be a number like 120 (got "R120")`.
- **The CI check runs before deploy,** so a broken edit never reaches the live site.
- **ASSUMPTION:** the editor edits through VSCodium, or through GitHub's web editor (which has no schema hints, but the CI check still protects the live site). A short `docs/editing-guide.md` is part of task 1 (§14).

---

## 6. Components

| Component | Design requirement served |
|---|---|
| `MuseumLayout` | Shell for every page: skip link, `SiteHeader`, `<Outlet>`, `Footer`, scroll restoration, focus on route change |
| `SiteHeader` | Brand (→ home), the 6 sections, `LanguageToggle`, WhatsApp button (C6) |
| `LanguageToggle` | AF \| EN switch for full content, site-wide (D2, §8) |
| `Room` | Rooms, theme, decor layer, composition (§7.2, §7.4) |
| `ArtworkLink` | Artwork entrance with shape and size variants, a focus ring that follows the shape, and a placeholder fallback (§7.5) |
| `Plaque` | Museum label with both-language title (§7.3) |
| `Localized` / `useLang()` | Picks `af` or `en` from a localised value, with fallback (§8.3) |
| `InfoPage` | 6 info pages. The `personal` layout is for About (§7.6) |
| `Catalogue` / `ProductCard` | Prints and Paintings, Products, Shop. Includes the services strip and per-category WhatsApp catalogue links |
| `Portfolio` / `WorkCard` | Gallery (C1) |
| `FreebieList` / `FreebieCard` | Freebies and Mindfulness Freebies. Downloads show the file type and size |
| `EnquiryCTA` | WhatsApp enquiry with a prefilled message (§11) |
| `Breadcrumbs` / `BackLink` | §4.3 |
| `Footer` | design §12 |
| `NotFound` | One shared page (fixes B4) |
| `PageMeta` | Title, description and og tags, baked in by prerender |
| `ResponsiveImage` | `<picture>` built from the image manifest (§10.2): width/height, WebP/AVIF, placeholder fallback |

---

## 7. Visual system & layout

### 7.1 Shell (C12)

- Wall: a per-room colour token with the `wall.png` texture blended over it. It's painted with a fixed `::before` instead of `background-attachment: fixed`, which iOS ignores.
- Floor: fixed to the viewport bottom on every page, layered in front of the wall content, so artworks pass behind its edge.
- Footer: normal flow, layered above the floor, and the same height as the floor. Once the page is scrolled to the end it lands exactly on the floor. There's no full-width bar: brand, links and contact are separate semi-transparent blocks with the planks visible around them. Below 1330px (where the floor is 100px) the tagline is hidden so it still fits.

### 7.2 Composition (D11: approved, with one improvement)

- Every placement keeps its **square slot**.
- `size`: `l` = 100% of the slot, which is the **default** (owner preference, 2026-10-15: all paintings line up at the same height). `m` ≈ 80% and `s` ≈ 55% (reads as ACEO) are opt-in, to make a piece look small on purpose.
- **Desktop (≥1330px):** a CSS grid. By default artworks auto-flow, each with an optional `nudge` (small offset, ±3° rotation) so the wall looks hand-hung.
  - **Improvement:** an optional `place: { col, row, span }` pins a piece to a specific grid cell. Rooms work out of the box, and once the final artworks arrive each wall can be hand-curated without breaking other screen sizes. `place` is ignored below 1330px.
- **Tablet (720–1329px):** 2–3 columns, with `nudge` at half strength.
- **Phone (<720px):** 1 column, every artwork centred (owner preference, 2026-10-15: the alternating left/right rows read as misaligned). Shapes, plaques and per-room atmosphere carry the gallery feel (design §13.5).
- No horizontal scroll at any width.

### 7.3 Plaque (C5)

```
┌──────────────────────────┐
│ OOR MY / ABOUT ME        │  ← title: both languages, equal weight (D2). Link's accessible name.
│ "Self-portrait in blue"  │  ← artworkTitle (optional) ┐
│ Pencil on canvas         │  ← medium (optional)       ├ follow the language toggle
│ Stap in →                │  ← invite / blurb          ┘
└──────────────────────────┘
```

- The height grows with the content, and the optional lines are capped at 90 characters (that's a warning, not an error).
- The link is named by the plaque title (`aria-labelledby`). The image `alt` is exposed via `aria-describedby`. This replaces the current `aria-label="Open …"` (WCAG 2.5.3).

### 7.4 Room atmosphere (C8, C16)

- `.room--home`, `.room--art`, `.room--mindfulness` and `.room--c4-akademie` each set `--wall`, `--accent`, `--plaque-ink` and an optional texture.
- `decor[]` images are `aria-hidden`, use `pointer-events: none`, sit behind the artworks, and are reduced to at most one on phones.
- Neon glow or flicker only runs inside `prefers-reduced-motion: no-preference`.

### 7.5 Placeholders (D3)

- **Missing artwork:** `public/ui/placeholder-frame.svg` is an empty ornate frame on the wall, with "Kom binnekort / Coming soon" on its canvas. It sits in the same square slot, so the wall composition doesn't change when the real painting arrives.
- **Missing page body:** a short "Hierdie kamer word nog ingerig / This room is still being set up" panel, plus the page's `EnquiryCTA`.
- **Empty catalogue category:** the category still shows, with "Coming soon" and that category's WhatsApp catalogue link.
- **Empty freebie category:** the category still shows, with a "Coming soon" card.
- Design guardrails still apply. Placeholders say "coming soon", but the site never presents something as *bookable* or *available* when it isn't (design §7.3, §10.4).

### 7.6 Info pages (C11)

- Normal document scroll. On desktop the artwork sits in a sticky left column and the text is ~68ch wide. On mobile the artwork goes on top.
- `layout: personal` (About): framed text panels, with handwritten-font accents for short lines only.
- Price tables are real `<table>`s with right-aligned prices and a caption.

### 7.7 Tokens & fonts (D6: ASSUMPTION, free, swappable)

`src/styles/tokens.css` holds UI-chrome colours, a spacing scale, breakpoints (`720px`, `1330px`) and 3 font roles. All 3 fonts are free (SIL Open Font License), self-hosted via `@fontsource`, and include the Afrikaans characters ê ë ô ï.

| Role | Font | Why |
|---|---|---|
| `--font-display` | **Bungee** | Made for signage, so it suits the retro/neon lettering in design §5.3. Used for room titles and the brand only. |
| `--font-hand` | **Caveat** | A legible handwritten font for About-page accents (design §6.2) |
| `--font-body` | **Nunito** | Rounded, friendly and very readable for long text and price lists (design §13.6) |

Self-hosting means no requests to Google, which helps with privacy (§12). To swap a font, change one token and one import.

---

## 8. Language (D2)

### 8.1 Rules

1. **Afrikaans is the primary language.** It's the default, it's used for prerendered HTML, and the root element is `<html lang="af">`.
2. **Short labels always show both languages** where they differ: titles, plaque titles, nav items, breadcrumbs. For example "Oor my / About Me", with both halves the same size and weight, each wrapped in `<span lang>`. Where both are the same ("Mindfulness", "C4 Akademie") the label is shown once.
3. **Full content follows a site-wide AF \| EN toggle.** That covers page bodies, descriptions, plaque extra lines, UI strings and alt text.

### 8.2 Toggle mechanics

- The choice is stored in `localStorage` as a per-visitor convenience, defaulting to `af`. Storage access is wrapped in try/catch, so a private window simply stays in AF.
- **No flash, no hydration mismatch:** prerendered pages contain **both** language bodies. A tiny inline script in `<head>` sets `<html data-lang>` from storage before the first paint, and CSS hides the inactive language (`[data-lang="en"] [data-body-lang="af"] { display: none }`). The same script updates `<html lang>`.
- `display: none` also hides the inactive language from screen readers, so assistive tech only reads the active version.

### 8.3 Missing translations

- If `en.md` (or an `en` value) is missing, the AF content is shown with a small note: "This page is currently only available in Afrikaans." The reverse works the same way.
- The build reports missing translations as warnings, so they're visible but don't block deploys.

---

## 9. Navigation & wayfinding (design §13)

| Need (design §13.2) | Where |
|---|---|
| Return to main gallery | Header brand link, breadcrumb root, footer |
| Return to previous room | `BackLink` / breadcrumb |
| Reach another main section | Header menu, footer |
| Find Shop / Freebies | Header menu |
| Contact Carla | Header WhatsApp button, footer, `EnquiryCTA` |

All labels are generated from content titles, never typed twice (design §13.3).

---

## 10. Assets (D4)

### 10.1 Folder convention

**The image folders mirror the gallery.**
- The root of `public/paintings/` holds *only* the 6 homepage artworks.
- Each room or page that has its own images gets a sub-folder named exactly like its root image (which is also its slug).
- All names are English and lowercase-kebab-case.

```
public/
  paintings/
    about-me.png               ← homepage artworks (exactly 6)
    art.png
    mindfulness.png
    c4-akademie.png
    shop.png
    freebies.png
    about-me/                  ← extra images used on the About page
    art/
      art-lessons.png          ← Art room artworks
      gallery.png
      prints-and-paintings.png
      gallery/                 ← portfolio works (works/*.json → image)
      prints-and-paintings/    ← product photos, category "art"
      decor/                   ← non-clickable room decoration
    mindfulness/
      mindfulness-products.png
      mindfulness-freebies.png
      brain-profiles.png
      mindfulness-products/    ← product photos, category "mindfulness"
    c4-akademie/
      about-c4.png
      extra-classes.png
      speeches.png
      brain-profiles.png       ← may differ from the Mindfulness one (design §9.6)
      brain-profiles/          ← images inside the shared page (lives under its default parent)
    shop/                      ← product photos, category "c4" (no separate C4 catalogue page)
    freebies/                  ← freebie covers (shared by both freebie pages)
  downloads/                   ← freebie PDFs (D9)
  ui/placeholder-frame.svg
  textures/{wall,floor}.png
```

**Resolution rule:**
- A room artwork is `paintings/<room-folder>/<target-slug>.<ext>`, where the home room's folder is the root.
- A page's own images live in the folder for its slug, under its default parent.
- The `.png`, `.jpg` and `.webp` extensions are all accepted.
- To replace a temporary painting with the final one, **drop a file with the same name into the same folder**. No code or data changes are needed.

### 10.2 Optimisation without `src/assets/` (C18)

`public/` files aren't processed by Vite, so 2 small build steps replace what `vite-imagetools` would have done:

1. **Manifest (Vite plugin, build start):**
   - Scans `public/paintings/` and records which files exist, with their pixel width and height (using `sharp`).
   - Lets the build report missing artworks (which get the placeholder) and orphaned files that nothing uses.
   - Gives every `<img>` its `width`/`height`, which fixes layout shift.
2. **Variants (post-build script, `sharp`):** writes `name-400w.webp`, `-800w.webp`, `-1200w.webp` (plus AVIF) next to each image in `dist/`. The originals stay in the repo and aren't changed.

Other notes:
- Budget: ≤ 200 KB per wall image at 800w, and the home wall under 1 MB in total (it's about 4.5 MB today).
- Use `fetchpriority="high"` on the first homepage artwork and `loading="lazy"` on the others.
- Caching trade-off: unhashed file names mean a replaced painting can take up to ~10 minutes to show, because of GitHub Pages' cache headers. That's acceptable, and it's what makes the drop-in replacement from §10.1 work.

### 10.3 Renaming the current temporary images (D4: ASSUMPTION, best judgement)

All of these are unfinished stand-ins.

| Current file | New path | Why |
|---|---|---|
| `about-me.png` | `paintings/about-me.png` | Portrait sketch |
| `art/art-lessons.png` | `paintings/art.png` | A classic-portrait study reads as "Art" |
| `artwork-04.png` | `paintings/mindfulness.png` | A round smiley suits the calm, playful tone |
| `artwork-09.png` | `paintings/c4-akademie.png` | C4 neon lettering (design §5.3) |
| `shop.png` | `paintings/shop.png` | Sign-shaped (it currently reads "STOP", but it's temporary) |
| `artwork-06.png` | `paintings/freebies.png` | Square pop-art gift (design §14.2) |
| `art.png` | `paintings/art/art-lessons.png` | Painter's palette (design §7.3) |
| `artwork-05.png` | `paintings/art/gallery.png` | Finished-looking drawing, a portfolio stand-in |
| `art/prints-and-paintings.png` | `paintings/art/prints-and-paintings.png` | ACEO workspace (design §14.9) |
| `artwork-03.png` | `paintings/mindfulness/mindfulness-products.png` | Planner, calendar, journal (design §14.7) |
| `mindfulness/free.png` | `paintings/mindfulness/mindfulness-freebies.png` | Oval gift (design §14.2) |
| `artwork-01.png` | `paintings/mindfulness/brain-profiles.png` | Head silhouette (design §14.8) |
| `artwork-11.png` | `paintings/c4-akademie/about-c4.png` | Key with heart (design §14.4) |
| `artwork-08.png` | `paintings/c4-akademie/extra-classes.png` | Books and maths instruments (design §14.6) |
| `artwork-15.png` | `paintings/c4-akademie/speeches.png` | Mouth with braces (design §14.1) |
| `artwork-14.png` | `paintings/c4-akademie/brain-profiles.png` | Lightbulb brain, a different take for the C4 room (design §9.6) |
| `artwork-10.png` | `assets-unused/artwork-10.png` | Unassigned. Kept outside `public/` so it doesn't deploy. |
| `graffiti-overlay.svg`, `icons.svg` | `assets-unused/` | Not referenced anywhere (tech §2.3) |

- Every one of the 16 placements gets a stand-in, so no wall placeholder is needed at launch.
- `art.png` and `art/art-lessons.png` swap names. Do the swap through a temporary name (`git mv`) so neither file overwrites the other.

### 10.4 When final artworks arrive (C23)

1. Cut the object out of its background so its shape reads on the wall (GIMP, or `rembg` for a first pass).
2. Export a transparent PNG at roughly 2000px on the long side.
3. Save it under its convention name (§10.1).
4. Keep the full-resolution masters outside the repo.

---

## 11. Enquiries & WhatsApp (D7)

- **Channel:** WhatsApp Business, which is free. Its catalogue and **collections** features are free too.
- **`site.json`** holds:

  ```json
  "whatsapp": {
    "number": "27XXXXXXXXX",
    "catalogs": {
      "all": "https://wa.me/c/27XXXXXXXXX",
      "art": "<collection share link>",
      "mindfulness": "<collection share link>",
      "c4": "<collection share link>"
    },
    "templates": {
      "general":  "Hi Carla! I found you on carla-s-botha.zeldean.me and would like to get in touch.",
      "enquiry":  "Hi Carla! I'm interested in {page} and would like more information, please.",
      "product":  "Hi Carla! I'd like to order: {product}{option}. Is it still available?",
      "lessons":  "Hi Carla! I'd like to ask about {page}. My child is in Grade __ and I'm looking for lessons on __ (weekdays/weekends).",
      "speech":   "Hi Carla! I'd like to order a speech. Grade: __ · Topic: __ · Due date: __ · Extras (PowerPoint / pictures / prep session): __"
    }
  }
  ```

- **ASSUMPTION:** collection links are copied from the WhatsApp Business app (*Catalogue → collection → Share link*). They aren't built by the site, because WhatsApp's link format isn't a stable public API. Any category without a link falls back to `all`.
- Templates are in **English** for consistency (D7). `{page}` and `{product}` are filled in with the English title. Links use `https://wa.me/<number>?text=<url-encoded>`.
- No contact form, so hosting stays on GitHub Pages.

---

## 12. Accessibility, SEO, privacy & quality

- Each page has one `<h1>`. On the home page it's the "Carla.S.Botha" signature, with a welcoming phrase (design §5.2).
- Room artworks go in a `<ul>` inside `<main>`. The header menu is the `<nav>`.
- `:focus-visible` style on everything interactive. All motion goes inside `prefers-reduced-motion: no-preference`. Focus moves to the `<h1>` on route change.
- `PageMeta`: title `<Page title> — Carla.S.Botha`, plus description and `og:image`, all prerendered in AF.
- **D10 defaults** (the owner had no preference, and these are easy to change):
  - Keep `carla-s-botha.zeldean.me`.
  - **No analytics** and no cookies, so there's no consent banner and nothing to declare under POPIA.
  - Support the last 2 versions of evergreen browsers plus iOS Safari 16+, using `<picture>` with a PNG fallback.
- Content guardrails from the design:
  - No medical claims (§8.3, §8.5).
  - The Master's in Art Therapy is described as a future ambition (§6.5).
  - Adult sessions aren't shown as bookable unless they are (§7.3).
  - Only confirmed subjects are listed (§9.4).
  - **D5:** speeches use the second price list, delivered as **PDF**.
- `npm run check` = lint + content validation, and it runs in CI before the build. Vitest smoke test: every slug renders in both languages, and unknown paths render `NotFound`.
- Housekeeping:
  - Drop `master` from the workflow trigger.
  - Add `"engines": { "node": ">=22" }`.
  - Switch to the `react-router` package.

### 12.1 Current bugs → where they're fixed

| Bug | Fixed by |
|---|---|
| B1 stray `3` (`src/pages/Gallery.jsx:55`) | Replaced by `Room` |
| B2 `portriat` / `shape` has no effect | zod `shape` enum + shape CSS |
| B3 non-recursive gallery lookup | Flat slug index |
| B4 no catch-all | `NotFound` |
| B5 back-link always `/` | `BackLink` |
| B6 dark text on dark fallback | Tokens |

---

## 13. Decision log

### 13.1 Owner decisions (2026-10-15)

| # | Decision | Applied in |
|---|---|---|
| D1 | No old links were shared. All URLs and code are English, except the brand slug `/c4-akademie`. | §3.1, §4.1, §5.1 |
| D2 | Afrikaans is primary. Short labels also show English. A site-wide toggle picks the language for full content. | §8 |
| D3 | Every destination is shown, and missing artwork gets a placeholder. "Only show what is ready" no longer applies. | §5.1, §7.5 |
| D4 | The current paintings are temporary, so use best judgement for which goes where. Store them in `public/` in folders that mirror the gallery, named in English. | §10 |
| D5 | Speeches are delivered as PDF, using the second price list. | §12 |
| D6 | Fonts: best judgement, may change later. | §7.7 |
| D7 | Free option: WhatsApp Business catalogue links per category, with English message templates. | §11 |
| D8 | The developer edits code and Markdown. A non-developer family member edits the JSON data files. | §5.2, §5.8 |
| D9 | Freebie files in the repo for now, possibly Google Drive later. | §5.6 |
| D10 | No preference on domain, analytics or browser support, so the defaults are used. | §12 |
| D11 | Grid composition approved. Improvements are welcome. | §7.2 (`place` added) |

### 13.2 Still open (small)

- How the JSON editor will edit: VSCodium locally or GitHub's web editor. This decides how much the editing guide covers.
- Who writes the English versions of the full page bodies. The approved AF and EN biographies (design §6.5) aren't in the repo yet.

### 13.3 Content blockers (from design §17)

These don't block building, because placeholders cover them (D3).

- Final artworks for every placement.
- Art lesson formats, ages and prices. Extra C4 subjects. Brain-profile consultation offerings and prices.
- Product inventory, which freebies are ready, and the PDFs themselves.
- The WhatsApp number, collection share links, contact details and social links.

---

## 14. Implementation plan

Each task leaves the site deployable.

1. **Content model, image reorganisation and validation** (§5, §10.1–10.3). **Done 2026-10-15.**
   - Rename and move the images per §10.3.
   - Create `src/content/` with the 4 rooms, 12 page folders, `site.json` and `ui.json`.
   - Write the zod schemas and generate JSON Schema from them.
   - Write the Vite plugin: content index, image manifest, errors and warnings.
   - Add `npm run check` to CI.
   - Write `docs/editing-guide.md` for the JSON editor.
   - No UI changes yet. Every later task reads from this.
2. **Routing, layout shell and language** (§4, §6, §8, §9). **Done 2026-10-15** on React Router 7.18.4 (v8 exists; upgrading is a separate step). Pages are emitted as `<slug>.html` and `404.html` is the SPA fallback with the not-found page baked in. `npm run preview` (`scripts/preview.js`) mimics GitHub Pages, because `vite preview` serves the home HTML for every path. Room and page views are interim until tasks 3–4, and Markdown rendering (`react-markdown` + `remark-gfm`) was pulled forward from task 4.
   - Verify Vite 8 support, then set up prerender (or the fallback).
   - Add `/:slug`, `MuseumLayout` with `SiteHeader` / `Footer` / static floor, `LanguageToggle` with the no-flash script, `NotFound`, `PageMeta`, `BackLink`/breadcrumbs, and the 3 fonts.
   - Closes B1, B3, B4, B5, B6 and C6, C12, C13, C19, C20.
3. **Room wall: `Room` / `ArtworkLink` / `Plaque` / `ResponsiveImage`** (§7.2–7.5, §10.2). **Done 2026-10-15.** Sizes default to `l` (owner preference). Column counts come from the number of artworks (6 → 3 + 3). Room tints are multiplied over the wall at 55% opacity. Variants are generated by `scripts/optimize-images.js` in postbuild: 29.4 MB of sources becomes 1.7 MB at 800w WebP, and browsers pick AVIF.
   - Add shape, size, `place` and `nudge`, the bilingual plaque, the placeholder frame, theme tokens, accessible names, focus and reduced-motion handling, and the `sharp` variants step.
   - Closes B2, C4, C5 and C8.

After that:

4. `InfoPage` + `EnquiryCTA` + Markdown. About first, then the services. **Done 2026-10-15.**
   - Markdown bodies are split into one `<section>` per `##`. Tables get a caption from the heading above them. Both are small rehype plugins in `src/lib/rehype.js`.
   - On desktop the artwork and enquiry button are sticky beside the text, with the artwork height capped so the button never ends up behind the floor. On phones the button sits under the artwork and again after the text.
   - `layout: personal` frames each section and turns bold-only lines and headings into the handwritten font.
5. `Catalogue` / `ProductCard`. **Done 2026-10-15.**
   - All 3 catalogue pages read one product pool: Shop groups it by category and adds a Services section; the other two filter it.
   - Sold items are hidden. Prices are formatted as "R1 200"; `null` shows "Prys op navraag / Price on enquiry".
   - Choosing an option updates the prefilled WhatsApp message.
   - An empty category shows a "coming soon" note, plus that category's WhatsApp catalogue link (falling back to `all`).
6. `FreebieList`. **Done 2026-10-15.**
   - Both pages read the same freebie files: Freebies groups them into Mindfulness, Kuns / Art and Onderwys / Education; Mindfulness Freebies filters to one category and links back to the main page.
   - The download button shows the file type and size, which the content loader measures at build time. Local files download directly; external links open in a new tab.
   - Drafts (`published: false`) are hidden, and empty categories show a coming-soon card.
   - Catalogue, freebies and portfolio pages share `CollectionHeader` and `Collection.module.css`.
7. `Portfolio`.
8. Accessibility and Lighthouse audit, then content fill as the blockers clear.
