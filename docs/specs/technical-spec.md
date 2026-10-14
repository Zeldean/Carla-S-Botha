# Carla.S.Botha: Technical Specification

> **Status:** Draft, written from a code review of `main` @ `46a0849` on 2026-10-14. No code has been changed.
> **Companion:** [`design-spec.md`](./design-spec.md), which covers content, visual direction and the page inventory.
>
> **Legend:** **[EXISTS]** means it is in the code today. **[SUGGEST]** means it is a proposal, not implemented.

---

## 1. Current State [EXISTS]

### 1.1 Stack

| Area | Choice | Version (lockfile) |
|---|---|---|
| UI | React + React DOM | 19.3.0 |
| Routing | `react-router-dom` (declarative `<BrowserRouter>`) | 7.18.3 |
| Build / dev server | Vite + `@vitejs/plugin-react` | 8.2.2 / 6.1.1 |
| Lint | ESLint 10 flat config, `react-hooks`, `react-refresh` | 10.10.0 |
| Language | Plain JS/JSX (no TypeScript, though `@types/react*` are installed) | — |
| Styling | Plain global CSS files imported per page | — |
| Hosting | GitHub Pages via Actions, custom domain `carla-s-botha.zeldean.me` | Node 22 in CI |
| Tests | None | — |

- `npm run lint` passes cleanly.
- `npm audit --omit=dev` reports 0 vulnerabilities.
- `npm outdated` shows only patch/minor drift (Vite 8.2→8.3, ESLint 10.10→10.12, RR 7.18.3→7.18.4). Nothing is a major version behind.

### 1.2 Folder structure

```
.github/workflows/deploy-pages.yml   # build + deploy dist/ on push to main|master
docs/specs/design-spec.md            # product/design spec
index.html                           # SPA shell + GH Pages redirect-restore script
public/
  404.html                           # GH Pages SPA fallback (stores URL, redirects to /)
  CNAME, favicon.svg
  graffiti-overlay.svg, icons.svg    # not referenced anywhere
  paintings/*.png                    # ~32 MB, mostly unreferenced (see 2.3)
  textures/{wall,floor}.png
src/
  main.jsx                           # createRoot + StrictMode
  App.jsx                            # router + global CSS import
  App.css                            # tokens, reset, textures, shared layout classes
  data/gallery.js                    # all content: one nested JS array
  pages/Gallery.jsx + .css           # page type 1
  pages/Detail.jsx  + .css           # page type 2
```

### 1.3 Routing

```jsx
<Route path="/"              element={<Gallery />} />   // top-level wall
<Route path="/gallery/:slug" element={<Gallery />} />   // a "room" (nested wall)
<Route path="/detail/:slug"  element={<Detail />} />    // an info page
```

- There's no catch-all (`*`) route.
- Deep links on GitHub Pages work through the `404.html` → `sessionStorage.redirect` → `history.replaceState` trick in `index.html`.

### 1.4 How the 2 pages get their content

All content lives in `src/data/gallery.js` as `GalleryItems`, a tree of nodes:

```js
{ slug, pageType: "gallery" | "detail", title, shape, image, description?, items? }
```

- **`pageType` is used as the URL segment.** `Gallery.jsx` builds links as `` `/${item.pageType}/${item.slug}` ``.
- **Gallery page** (`Gallery.jsx`):
  - On `/`, it renders the top-level `GalleryItems`.
  - On `/gallery/:slug`, it looks for a matching *top-level* node (`findGallery`, not recursive) and renders its `items`.
  - Each item is rendered as a `<Link>` with an image in a square "slot" and a "plaque" label.
- **Detail page** (`Detail.jsx`):
  - It searches the whole tree *recursively* (`findDetail`) for a `detail` node.
  - It renders the image, an `<h1>` and `description` as one `<p>` with `white-space: pre-wrap`. Formatting comes from literal `\n`/`\t` characters.
- **Current content:** 2 top-level nodes.
  - About Me (detail).
  - Art (gallery). It contains Art Lessons and Prints & Paintings, and both are detail pages.
  - All descriptions are placeholder text.
- Both pages use the same shell: `.museum-wall.texture-wall` → `<main>` → fixed `.museum-floor`.

### 1.5 Styling

- One global stylesheet (`App.css`):
  - 3 CSS variables (`--background`, `--text`, `--museum-floor-height`).
  - A reset.
  - "Texture" utility classes (`texture-wall`, `texture-floor`, `texture-plaque`).
  - Shared layout classes.
- Page CSS files are imported per page, but they're still **global** (not scoped).
- Mobile-first breakpoints are at `720px` and `1330px`.
- The only font is Arial.

---

## 2. Issues & Risks [EXISTS]

### 2.1 Bugs

| # | Where | Issue |
|---|---|---|
| B1 | `src/pages/Gallery.jsx:55` | A stray **`3`** before `</div>` renders the literal text "3" on every gallery wall. |
| B2 | `src/data/gallery.js` (all nodes) | `shape: "portriat"` is misspelled. There are also no `.painting-link--portrait/--landscape` CSS rules, so `shape` currently has no visible effect. |
| B3 | `Gallery.jsx:5` vs `Detail.jsx:5` | Lookup is inconsistent. Detail search is recursive, but gallery search only checks the top level, so a room nested inside a room would 404. |
| B4 | `App.jsx` | There's no `*` route. Unknown paths (e.g. `/foo`) render an empty dark page instead of a "not found" message. |
| B5 | `Detail.jsx:44` | "Back to gallery" always goes to `/`. From `/detail/art-lessons`, it skips the Art room, which breaks design-spec §13.2 ("return to the previous gallery room"). |
| B6 | `App.css` `.missing-page`, `.text-link` | Text is dark (`#2d261d`) but sits on `--background: #17181a`. If `wall.png` fails or loads slowly, the text becomes unreadable. `--text` is defined but barely used. |

### 2.2 Inconsistencies / maintainability

- Coupling `pageType` to the URL means renaming a type changes every URL. It also limits the site to 2 page kinds, while the design spec needs at least room, info, catalogue, freebies and portfolio.
- Content is stored as escaped strings (`\n`, `\t`).
  - It can't hold headings, lists, links, prices or bilingual (AF/EN) sections, all of which the design spec requires.
  - The text isn't semantic: the whole description is one `<p>`.
- The "missing page" markup is duplicated in both pages, and so is the wall/floor shell.
- `font-family: Arial, sans-serif` is repeated in 6 places, and colours are hard-coded (`#2d261d` ×5) instead of using tokens.
- The `/gallery/:slug` + `/detail/:slug` URLs are English and type-based. The design spec's labels are AF/EN (e.g. *Kuns / Art*), so the URL language isn't decided (see §4).
- The CI workflow triggers on both `main` and `master`. Only `main` exists.
- `package.json` is still at `"version": "0.0.0"`, and the local `dist/` is stale (it's gitignored, so this is harmless).

### 2.3 Performance

- **Images are unoptimised PNGs at 1–3 MB each** (e.g. `art.png` 3.2 MB, `shop.png` 3.2 MB). The home wall alone loads about 4.5 MB.
- The images have no `width`/`height` (which causes layout shift), no `loading="lazy"`, no `srcset`, and no WebP/AVIF versions.
- **About 25 MB of `public/` is unreferenced** and still ships in `dist/`: `artwork-01…15.png`, `shop.png`, `mindfulness/free.png`, `graffiti-overlay.svg`, `icons.svg`.
- `background-attachment: fixed` on the wall forces repaints on scroll and is ignored on iOS Safari.
- The 404 redirect costs an extra full page load on every deep link or refresh.

### 2.4 Accessibility

- `<main aria-label="Gallery navigation">` gives a landmark the wrong role. A list of links belongs in `<nav>` (or a `<ul>` inside `main`).
- The link `aria-label="Open {title}"` overrides the visible plaque text and the image `alt`. Screen readers then announce something different from what's on screen (WCAG 2.5.3, Label in Name).
- `.detail-copy` scrolls on its own (`overflow-y: auto; max-height: 62vh`) but can't be focused, so keyboard users can't scroll it.
- There's no `prefers-reduced-motion` handling for the hover `scale(1.08)`.
- Focus styling relies on browser defaults, and the dark plaque text on a textured wall hasn't been checked for contrast.
- `document.title` is always "Carla S Botha", and there's no `<meta name="description">`. On route change, focus and scroll aren't reset (scroll position carries over between pages).
- `<html lang="en">` is fixed, but the content will be partly Afrikaans. Afrikaans blocks need `lang="af"`.

### 2.5 Risks vs. design spec

- The design spec defines **16 destinations and 16 artwork placements**, but the code models 4.
- The design spec also needs features the code has no support for:
  - Shared pages reachable from 2 rooms (*Breinprofiele en Studiemetodes*).
  - Product catalogues with prices.
  - Downloadable freebies.
  - A footer with contact details and WhatsApp.
  - Bilingual titles with equal visual weight.

---

## 3. Suggested Architecture [SUGGEST]

### 3.1 Principles

- Keep the stack small: **React + Vite + React Router + plain CSS**. Nothing in the design spec needs a CMS, state library or CSS framework.
- **Content is data, not code.** Adding a page should mean adding a file, not editing JSX.
- **Use one canonical URL per destination.** Shared pages (Breinprofiele, Freebies, products) exist once and are *referenced* from rooms (design-spec §15.4).

### 3.2 Routing

Move to the **data router** (`createBrowserRouter` + `RouterProvider`). This gives you:

- `<ScrollRestoration />`
- an `errorElement` / catch-all 404
- route-level `lazy()` code splitting.

```
/                      → HomeRoom        (the 6-artwork main gallery)
/:slug                 → resolves slug in content index → renders by page `type`
*                      → NotFound
```

- **Flat slugs** (e.g. `/kuns`, `/kunslesse`, `/breinprofiele`):
  - The URL no longer encodes the page type or the parent room.
  - This gives each shared page one canonical address.
- **"Back to room":**
  - When a room links to a page, it passes `state: { from: roomSlug }`.
  - The page uses that if it's present. Otherwise it falls back to the page's `defaultParent` from its content file.
  - Breadcrumb: `Main gallery › Kuns › Kunslesse`.
- **Import from `react-router`, not `react-router-dom`.** In v7, `-dom` is only a re-export shim.
- **Optional:** use React Router's framework-mode `prerender` to generate one static HTML file per route at build time.
  - This removes the `404.html` redirect hack.
  - It also gives real per-page HTML for SEO and link previews.
  - Think of it as Hugo/Jekyll output with React on top.

### 3.3 Content storage & loading

```
src/content/
  site.json                 # brand, footer, contact, WhatsApp, socials
  rooms/
    home.json               # { slug, title:{af,en}, artworks:[{ page, image, shape, position? }] }
    kuns.json
    mindfulness.json
    c4-akademie.json
  pages/
    oor-my.md               # frontmatter + Markdown body
    kunslesse.md
    breinprofiele.md        # shared: referenced by mindfulness.json AND c4-akademie.json
    ...
  products/*.json           # { name, description, price, category[], options[], image, orderUrl }
  freebies/*.json           # { title, category, file, image, ready: boolean }
```

- **Rooms** list *references* (`page: "kunslesse"`). They never embed page content. This is how one page appears in 2 rooms without duplication.
- **Pages** are Markdown with frontmatter:
  - `type` (`info | catalogue | freebies | portfolio`)
  - `title: { af, en }`, which is bilingual-aware
  - `defaultParent`
  - `image`
  - `published`.

  Bilingual bodies go in fenced sections, e.g. `:::af … :::` / `:::en … :::`, or as two files `oor-my.af.md` / `oor-my.en.md`. Which one depends on Q3.
- **Loading:**
  - Use `import.meta.glob('/src/content/**/*', { eager: true })` to build a slug → entry index at build time. No runtime fetch is needed and the content stays type-checked by the bundler.
  - Render Markdown with `react-markdown`, or `marked` if bundle size matters.
- **Validation:** add a small build-time check (`npm run check:content`, or a Vite plugin). It should fail the build if:
  - a room references a missing slug
  - an image file doesn't exist
  - required fields are missing.

  `zod` schemas work well for this.
- **`published: false`** hides unfinished items (design-spec §15.3, "only display what is ready") without deleting them.

### 3.4 Component breakdown

| Component | Responsibility |
|---|---|
| `MuseumLayout` | Skip link, wall + floor shell, `<Footer>`, `<ScrollRestoration>`. It's used by every route (as the root layout route with `<Outlet>`). |
| `Room` | Renders a room's `artworks` as `<ul>` of `ArtworkLink`. It handles the per-room layout and atmosphere class. |
| `ArtworkLink` | Frame + image + `Plaque`. It supports `shape` variants (`portrait`, `landscape`, `square`, `round`…), and the accessible name is the plaque text. |
| `Plaque` | Museum label. It renders bilingual titles with equal weight (`<span lang="af">` / `<span lang="en">`). |
| `InfoPage` | Image + Markdown body. It's used for About, Kunslesse, Ekstra klasse, Toesprake, etc. |
| `Catalogue` / `ProductCard` | Name, image, price, options and the WhatsApp order link (design-spec §10.3–10.4). |
| `FreebieList` | Downloadable resources, filtered by category (main Freebies plus the Mindfulness subset). |
| `Breadcrumbs` / `BackLink` | Builds the "return to room" and "return to main gallery" links from router state and `defaultParent`. |
| `Footer` | Brand, contact, WhatsApp, socials and main-section links (design-spec §12). |
| `NotFound` | One shared "not on the wall yet" page that replaces the 2 duplicates. |
| `PageMeta` | Sets `<title>`/`<meta name="description">`. React 19 hoists these natively, so no Helmet is needed. |

### 3.5 Styling conventions

- **Tokens** in `src/styles/tokens.css`:
  - colours: `--ink-plaque`, `--bg`, `--text`, room accent colours
  - fonts: display + body
  - spacing scale
  - breakpoints, documented as comments.
- No raw hex values or font stacks outside the tokens file.
- **CSS Modules** (`ArtworkLink.module.css`). Vite supports these natively. Class names are scoped per component (like Vue/Svelte scoped styles), so `.painting-plaque` can't leak or collide.
- Keep the `texture-*` classes and `reset.css` global.
- Keep mobile-first `min-width` breakpoints (`720px`, `1330px`).
- Define shape variants explicitly. The design spec requires varied shapes on mobile too, not identical buttons.
- Wrap all motion in `@media (prefers-reduced-motion: no-preference)`.
- Give every interactive element a visible `:focus-visible` style.
- Replace `background-attachment: fixed` with a fixed-position pseudo-element background.

### 3.6 Assets & build

- Move artwork to `src/assets/` so Vite fingerprints it and drops anything unused.
- Generate AVIF/WebP at 2–3 widths (`vite-imagetools`, or a one-off `sharp` script). Target ≤ 200 KB per wall image.
- Always emit `width`/`height`. Use `loading="lazy"` below the first row and `fetchpriority="high"` on the first artwork.
- Delete or archive the unreferenced files in `public/paintings/`, or keep the masters outside the repo (Q6).
- Add `"engines": { "node": ">=22" }`. Drop `master` from the workflow trigger.
- Add `npm run check` = lint + content validation, and run it in CI before build.
- Optional: Vitest + Testing Library smoke tests (every content slug renders, and the 404 route works).

---

## 4. Open Questions

| # | Question | Why it matters |
|---|---|---|
| Q1 | Should URLs use Afrikaans slugs (`/kuns`), English ones (`/art`), or both with redirects? | URL scheme is hard to change after launch. |
| Q2 | Are the current `/gallery/*` and `/detail/*` URLs already shared or indexed anywhere? | If they are, they need redirects when routing changes. |
| Q3 | Bilingual model: should there be a site-wide AF/EN toggle, or the mixed-per-section approach in design-spec §3.2 (with only About fully in both)? | This decides the content file format and whether i18n tooling is needed. |
| Q4 | Who edits content after launch? Will Carla edit it directly, or will a developer? | It decides whether Markdown-in-repo is enough or a git-backed CMS (e.g. Decap) is needed. |
| Q5 | Is the design-spec page inventory (16 destinations) final? Should the current "Art" room match §7: Kunslesse, Gallery, Prints & Paintings? | The code currently has Art Lessons + Prints & Paintings only. |
| Q6 | Are `artwork-01…15.png`, `shop.png`, `mindfulness/free.png`, `graffiti-overlay.svg` and `icons.svg` planned assets or leftovers? Where are the full-resolution masters kept? | About 25 MB of dead weight in every deploy. |
| Q7 | Should desktop rooms use the "balanced but irregular composition" (design-spec §13.4) with hand-placed artwork positions, or an auto flex-wrap layout? | Hand placement needs per-artwork `position` data in the room files. |
| Q8 | Where are freebie files (PDFs) hosted? In the repo/`public`, or externally (Drive, etc.)? | Repo size, plus whether downloads need tracking. |
| Q9 | Shop: is the WhatsApp catalogue link per category or one global link? What's the WhatsApp number? | `ProductCard` order-link design. |
| Q10 | Is `carla-s-botha.zeldean.me` the final domain? | Canonical URLs, CNAME, and the prerender base URL. |
| Q11 | Analytics, cookie or privacy requirements? A contact form, or only WhatsApp/email links? | A form would need a backend or third-party service, which GitHub Pages can't host. |
| Q12 | What is the target browser/device support (e.g. older Android phones)? | It affects AVIF use, CSS features and the image-size budget. |
