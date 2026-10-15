# Carla S Botha

Bilingual (Afrikaans/English) museum-style gallery site for Carla S Botha. React 19 + React Router 7 (framework mode, prerendered static site) + Vite, deployed to GitHub Pages.

## Commands

```bash
npm install
npm run dev        # dev server with live content reload
npm run check      # lint + content validation (CI runs this before building)
npm run build      # prerender every page to dist/client, then image variants
npm run preview    # serve dist/client with GitHub Pages rules (port 4173)
npm run audit      # axe accessibility audit + page weights (needs a build and Firefox)
npm run schemas    # regenerate schemas/*.schema.json after changing scripts/content/schemas.js
```

Node 22 or newer.

## Where things live

- `src/content/`: all site content (JSON + Markdown), validated at build time. Editing guide: [docs/editing-guide.md](docs/editing-guide.md).
- `public/paintings/<room>/<slug>.png`: wall artwork, found by naming convention.
- `docs/specs/combined-spec.md`: the aligned spec, decision log and implementation plan.

## Deploy

Pushing to `main` runs `.github/workflows/deploy-pages.yml`: `npm run check`, `npm run build`, then publishes `dist/client` to GitHub Pages. Other branches don't deploy.
