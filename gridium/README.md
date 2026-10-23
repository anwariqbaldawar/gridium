# Gridium — Shopify Online Store 2.0 Theme · v1.1.0

A premium, editorial shirting theme built for real client hand-off: clone it, upload the ZIP,
and the storefront renders a complete brand experience with **zero theme-editor setup**.

---

## 1. Install in three clicks (the ZIP your client drops in)

1. Shopify Admin → **Online Store → Themes → Add theme → Upload zip file**
2. Select `gridium-shopify-theme-v1.1.0.zip` (build it with `npm run theme:zip`)
3. Click **Publish** (or **Preview** first)

That is the whole install. Shopify uploads the theme, reads `templates/index.json`, applies the
bundled colour schemes, fonts and section settings, and the homepage is live immediately.

> **Why one click is not possible:** Shopify has no API that lets a ZIP "self-publish" or
> auto-create products, menus or pages on upload — publishing is a deliberate merchant action
> and product/menu data lives outside the theme. Gridium removes every step that *can* be
> automated, and the remaining ones are listed in §3 as a 5-minute checklist.

### What works with zero configuration

| Feature | Behaviour on a fresh install |
| --- | --- |
| Brand mark | Falls back to the bundled `assets/logo.png` monogram (`{% render 'logo' %}`) |
| Dark mode logo | Pure-black PNG is auto-inverted to white over Midnight / transparent headers |
| Typography | Jost (headings) + Inter (body), fluid scale, mono micro-labels |
| Homepage | Hero, category tiles, tabs, editorial, USP row, bestsellers, reviews, lookbook, newsletter |
| About page | Full editorial story: hero, manifesto, principles, timeline, process, materials, team, FAQ, CTA |
| Header | Sticky/shrinking, mega menu, predictive search, wishlist, cart drawer with free-shipping meter |
| Collections | Filters, sort, density toggle, swatches, quick add, badges, low-stock indicators |
| Journal | Blog index with featured story + topic filters, article layout, comments, related stories |
| Product page | Variant picker, media gallery + zoom, fit bar, size guide, sticky add-to-cart, recommendations |
| Cart | AJAX drawer **or** page, order notes, upsell collection |
| Policies | Sticky auto-built table of contents |

---

## 2. Build / package the theme

```bash
npm install
npm run theme:zip      # → release/gridium-shopify-theme-v1.1.0.zip  (theme dirs at root)
npm run theme:audit    # static checks: JSON, section/snippet refs, settings, translations
npm run theme:check    # Shopify Theme Check (0 offenses on v1.1.0)
npm run theme:zip      # package only when every check passes
```

`theme:zip` refuses to package if any JSON is invalid, and the archive contains only
`assets/ config/ layout/ locales/ sections/ snippets/ templates/` — exactly what the Shopify
uploader expects. `README.md`, `demo/` and dotfiles are excluded.

---

## 3. The 5-minute post-install checklist

1. **Products** — Products → Import → `demo/products_import.csv` (6 shirts, 48 variants,
   sale prices, `new`/`bestseller` tags, low-stock and sold-out sizes so every UI state is visible).
2. **Pages** — Online Store → Pages → Add page, then pick the template on the right:

   | Page | Handle | Template |
   | --- | --- | --- |
   | About Us | `about` | `page.about` |
   | Contact | `contact` | `page.contact` |
   | Privacy Policy | `privacy-policy` | `page.privacy-policy` |
   | Refund Policy | `refund-policy` | `page.refund-policy` |
   | Wishlist | `wishlist` | `page.wishlist` |

3. **Navigation** — Online Store → Navigation → `main-menu`: `Shirts`, `New Arrivals`,
   `Collections`, `About`, `Contact`. Then Header → *Add block → Mega menu feature* → set
   *Menu item title to attach to* = `Shirts`.
4. **Logo** — Header → Logo image (optional; the monogram shows until you upload).
5. **Collections** — Settings → Search & Discovery → Filters → Availability, Price, Color, Size.

Optional product metafields (graceful fallbacks when blank): `custom.fit`, `custom.model_info`,
`custom.fabric`, `custom.denim_weight`.

---

## 4. About page — the brand story system

`templates/page.about.json` ships a nine-section narrative, each section reusable and editable:

| Section | Purpose |
| --- | --- |
| `about-hero` | Split editorial hero, outlined display accent, atelier note card, 4 metrics |
| `about-manifesto` | Oversized statement, founder signature, two-column reasoning, ticker |
| `about-story` | "Why we exist" statement + principle grid |
| `about-timeline` | Sticky year rail, chapters, optional per-chapter imagery |
| `about-craft` | Four-stage process accordion + sticky figure |
| `about-materials` | Fabric library cards with real swatches, mill, weight, certification |
| `about-team` | Grayscale→colour portraits, roles, bios, closing CTA |
| `faq` | Accordion (also usable as a standalone section) |
| `about-cta` | Midnight closing statement + studio contact grid |

All copy is real, specific and editable — no lorem ipsum.

---

## 5. Design system

- **Type** — Jost 500 headings (geometric, fashion-editorial), Inter 400 body, system mono labels.
  Fluid scale custom properties: `--fs-display … --fs-micro`.
- **Colour** — three schemes: Paper `#FAFAF8`, Stone `#EFECE6` / olive accent `#3D4A35`, Midnight `#111211`.
- **Grid** — 12-column architectural grid, 1px hairlines, `1360px` max width, optional faint column guides.
- **Motion** — one shared language: 22px reveal, 80ms stagger, `cubic-bezier(.22,1,.36,1)`,
  clip-path image wipes, marquee, badge pop, button sweep fill. Fully disabled under
  `prefers-reduced-motion`.
- **Accessibility** — skip link, focus traps in drawers/modals, `aria-pressed` on swatches,
  visible focus rings, 44px touch targets, contrast-checked schemes.

---

## 6. Local development

```bash
npm install -g @shopify/cli @shopify/theme
cd gridium && shopify theme dev --store your-store.myshopify.com   # http://127.0.0.1:9292
shopify theme check                                                # linter
shopify theme push --unpublished --store your-store.myshopify.com
```

Each section is self-contained (Liquid + `{% schema %}` + optional `{% stylesheet %}`),
so the theme editor previews changes instantly.

---

## 7. Theme settings map

| Group | Controls |
| --- | --- |
| Colours | Paper / Stone / Midnight tokens, sale/success/warning |
| Typography | Heading & body font pickers, heading/body scale |
| Layout | Page width, grid gap, corner radii, uppercase buttons, motion toggle, hairline grid |
| Product cards | Secondary image, vendor, swatches, quick add, wishlist, image fit, badges, low-stock |
| Size guide | Page override, garment table rows, fit-finder matrix |
| Cart | Drawer or page, order notes, free-shipping threshold, upsell collection |
| Utilities | Logo invert on dark, scroll progress, back-to-top, WhatsApp, cookie notice, newsletter popup, market/language selectors |
| Social | Instagram, TikTok, Pinterest, YouTube, X, Facebook, WhatsApp |

---

## 8. Troubleshooting

| Symptom | Fix |
| --- | --- |
| Header shows "GRIDIUM" text only | `assets/logo.png` missing from the ZIP, or Header logo not uploaded — check **Header → Logo height** |
| Logo invisible on dark hero | Enable **Brand mark & scroll affordances → Invert logo on dark schemes** |
| Collections look empty | Import `demo/products_import.csv`, or point sections at an existing collection |
| Mega menu does not open | A header block's *Menu item title* must match a top-level menu link exactly |
| Fonts not applying | Theme settings → Typography → re-pick the fonts, then Save |

---

## 9. Version history

- **v1.1.0** — About story system (8 new/rewritten sections), journal templates (blog + article),
  brand lockup with auto-inverting monogram,
  Jost typography, refinement motion layer, scroll progress, footer grid fix, OG/favicon fallbacks,
  packaging + audit scripts, spec-compliant `settings_data.json` presets.
- **v1.0.0** — Initial Online Store 2.0 release: 33 sections, cart drawer, predictive search,
  wishlist, size guide, policies, customer templates.
