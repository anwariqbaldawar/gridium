# Gridium

A premium Online Store 2.0 Shopify theme for shirting and apparel brands, plus a React "Studio"
preview app that lets you browse the storefront and export the theme as a Shopify-upload-ready ZIP.

```
gridium/            ← the Shopify theme (this is what gets zipped and uploaded)
src/                ← Vite + React preview / theme exporter
scripts/            ← theme audit + packaging tooling
Logo.png            ← master brand monogram (also copied to gridium/assets/logo.png)
```

## Quick start

```bash
npm install
npm run dev          # Studio preview at http://localhost:5173
npm run theme:zip    # → release/gridium-shopify-theme-v1.2.0.zip
npm run theme:audit  # static theme checks
```

## Ship the theme to a client store

1. `npm run theme:zip`
2. Shopify Admin → **Online Store → Themes → Add theme → Upload zip file**
3. Choose `release/gridium-shopify-theme-v1.2.0.zip` → **Publish**

The theme renders a complete storefront with zero editor setup (bundled logo fallback, three
colour schemes, Jost/Inter typography, full homepage and About page). Product, menu and page
data is store data rather than theme data, so the short post-install checklist lives in
[`gridium/README.md`](gridium/README.md).

## What is inside

- **Theme** — 41 sections, 16 snippets, 11 templates, cart drawer, predictive search, wishlist,
  size guide, filters, journal (blog + article), customer account templates, policies with sticky TOC.
- **About experience** — editorial hero, manifesto, principle grid, timeline, craft process,
  material library, team, FAQ and closing CTA.
- **Design system** — architectural 12-column grid, hairline borders, Paper/Stone/Midnight
  schemes, shared motion language, reduced-motion support.
- **Tooling** — dependency-free audit script (JSON, references, settings, translations), Shopify
  Theme Check runner (currently 0 offenses) and a deterministic ZIP packager that mirrors the
  archive structure Shopify requires for upload.
