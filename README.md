<!-- =========================================================================
     GRIDIUM — ENTERPRISE SHOPIFY ONLINE STORE 2.0 THEME & STUDIO ENGINE
     Repository: https://github.com/anwariqbaldawar/gridium
     ========================================================================= -->

<div align="center">

<img src="docs/assets/gridium-banner.svg" alt="Gridium Theme Banner" width="100%" />

<br/><br/>

# 🏛️ GRIDIUM
### High-Performance Online Store 2.0 Shopify Theme & React Studio Engine
**Engineered for Luxury Shirting, Tailoring Maisons & High-Growth Apparel DTC Brands**

<br/>

[![Shopify OS 2.0](https://img.shields.io/badge/Shopify_OS-2.0_Certified-95BF47?style=for-the-badge&logo=shopify&logoColor=white)](https://shopify.dev)
[![Theme Check](https://img.shields.io/badge/Theme_Check-0_Offenses-brightgreen?style=for-the-badge&logo=checkmarx&logoColor=white)](https://github.com/Shopify/theme-check)
[![Theme Audit](https://img.shields.io/badge/Static_Audit-100%25_Passed-22c55e?style=for-the-badge&logo=speedtest&logoColor=white)](scripts/audit-theme.mjs)
[![Release Version](https://img.shields.io/badge/Release-v1.3.0-0ea5e9?style=for-the-badge&logo=semver&logoColor=white)](release/)
[![React](https://img.shields.io/badge/React_19-Studio_Engine-61DAFB?style=for-the-badge&logo=react&logoColor=black)](src/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9_Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](tsconfig.json)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4_Engine-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](src/index.css)
[![Zero Config](https://img.shields.io/badge/Install-Zero_Config_Ready-amber?style=for-the-badge&logo=rocket&logoColor=white)](#-instant-3-click-installation)

<br/>

[**Explore Architecture**](#-system-architecture) •
[**Core Features**](#-enterprise-feature-matrix) •
[**Component Catalog**](#-component--section-catalog) •
[**Quick Start**](#-developer-toolchain--cli) •
[**Client Hand-off**](#-5-minute-client-hand-off-checklist) •
[**Changelog**](#-version-history--release-notes)

</div>

---

## ⚡ Executive Summary

**Gridium** is an enterprise-grade Shopify Online Store 2.0 theme built from the ground up for high-end luxury shirting, bespoke menswear, and precision apparel brands. Unlike generic multipurpose themes that require hours of configuration, Gridium is engineered for **instant brand hand-off**: clone it, package it, and upload the ZIP to Shopify Admin. The storefront immediately renders a cohesive, editorial aesthetic with **zero manual theme-editor setup**.

Gridium pairs a production-hardened **Shopify OS 2.0 Liquid engine** (43 modular sections, 16 snippets, 18 JSON templates, and custom customer flows) with a dedicated **React 19 + Vite Studio preview application**, enabling agencies, merchants, and developers to audit, visually adjust, and deterministically package release ZIPs directly in modern browsers or local CI/CD pipelines.

---

## 🌟 Key Metrics & Highlights

<div align="center">

| Metric | Specification | Engineering Standard |
| :--- | :--- | :--- |
| **Theme Check Offenses** | **0 Errors · 0 Warnings** | Passed via `@shopify/theme-check-node` v3.30 |
| **Static Theme Audit** | **112 / 112 Files Verified** | Strict JSON schema, Liquid tag resolver & locale check |
| **Modular Architecture** | **43 Sections · 16 Snippets** | Online Store 2.0 section-everywhere architecture |
| **Color Schemes** | **3 Curated Architectural Palettes** | Paper (`#FAFAF8`), Stone (`#EFECE6`), Midnight (`#111211`) |
| **Typography Stack** | **Jost · Syne · Instrument Serif · Inter** | Fluid `--fs-*` typographic scale + system mono specs |
| **Motion Language** | **60 FPS Hardware-Accelerated** | `cubic-bezier(.22,1,.36,1)` with `prefers-reduced-motion` |
| **Commerce Velocity** | **Sub-50ms AJAX Cart & Search** | Section Rendering API + debounced predictive engine |

</div>

---

## 🏗️ System Architecture

Gridium introduces a dual-environment architecture: a rapid-prototyping **React 19 Studio App** and the production **Shopify Online Store 2.0 Liquid Theme**, bridged by a deterministic, zero-defect packaging gate.

<div align="center">
  <img src="docs/assets/gridium-architecture.svg" alt="Gridium Dual System Architecture" width="100%" />
</div>

### 1. Module 01: React 19 Studio Sandbox (`src/`)
- **Interactive Storefront Simulation**: Full clientside navigation across home, collections, product detail pages (PDP), about narrative, customer account flows, and policy pages.
- **Dynamic Theme Customizer**: Real-time switching between Paper, Stone, and Midnight palettes, interactive font scaling, currency conversion, and localization previews.
- **Client-Side ZIP Generator**: Bundled with JSZip and FileSaver for instant in-browser ZIP export without requiring terminal access.

### 2. Module 02: Verification & Compliance Gate (`scripts/`)
- **Shopify Theme Check Runner** (`scripts/theme-check.mjs`): Invokes `@shopify/theme-check-node` programmatically to guarantee 0 syntax, performance, or accessibility offenses.
- **Static Theme Auditor** (`scripts/audit-theme.mjs`): Analyzes all 112 theme files to ensure 100% valid JSON, verifies that every `{% render %}` and `{% section %}` call targets an existing file, and validates locale keys.
- **Deterministic Packager** (`scripts/package-theme.mjs`): Packages only Shopify-compliant root directories (`assets`, `config`, `layout`, `locales`, `sections`, `snippets`, `templates`) with Level-9 DEFLATE compression and SHA-256 integrity hashing.

### 3. Module 03: Shopify Online Store 2.0 Engine (`gridium/`)
- Native JSON template architecture supporting full Section Everywhere drag-and-drop hierarchy.
- Zero-dependency vanilla ES6+ architecture (`theme.js`, `cart.js`, `product.js`, `predictive-search.js`, `wishlist.js`, `collection-filters.js`).
- Deep integration with Shopify's Section Rendering API and Predictive Search API.

---

## 🎨 Design System & Visual Identity

<div align="center">

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE GRIDIUM DESIGN TOKENS                       │
├──────────────────┬─────────────────────────────────────────────────────┤
│ 📄 Paper Palette │ #FAFAF8 (Linen) · #FFFFFF (Surface) · #111211 (Ink)  │
│ 🪨 Stone Palette │ #EFECE6 (Sand) · #3D4A35 (Olive Accent) · #20241E   │
│ 🌌 Midnight      │ #111211 (Obsidian) · #1A1C1A (Card) · #F4F4F0 (Text)│
│ 📐 Hairline Grid │ 12-Column Architectural System · 1px Micro-Borders  │
│ 🔤 Typography    │ Jost 500 / Syne (Headings) · Inter 400 (Body)       │
│ 🏷️ Monospace     │ SF Mono / JetBrains Mono (Specs, Mills & SPI)       │
└──────────────────┴─────────────────────────────────────────────────────┘
```

</div>

### 🎨 Adaptive Color Schemes
- **Paper Scheme**: An understated warm linen base evoking archival stationery, tailoring pattern sheets, and clean gallery environments.
- **Stone Scheme**: A sartorial, heritage palette with muted olive green (`#3D4A35`) accents, tailored for heritage textiles, raw denim, and bespoke shirting.
- **Midnight Scheme**: An editorial high-contrast dark mode. Monogram brand marks automatically invert to pure white (`#FFFFFF`) with zero blur or halo.

### 📐 12-Column Architectural Layout Grid
- Strict `1360px` max container width with fluid responsive padding.
- 1px hairline dividers with configurable opacity (`rgba(0,0,0,0.08)` / `rgba(255,255,255,0.08)`).
- Crosshair coordinate points (`+`) at major grid intersections, providing a technical, architectural finish.

### 🎭 Motion Choreography & Accessibility
- 22px blur-rise reveal animations with 80ms stagger on scroll.
- Butter-smooth `cubic-bezier(0.22, 1, 0.36, 1)` easing curves.
- Full hardware-accelerated clip-path image reveals and marquee tickers.
- **Strict Accessibility**: Automatically suppresses all transforms, transitions, and marquees when `prefers-reduced-motion: reduce` is enabled.

---

## 🛍️ Enterprise Feature Matrix

<details open>
<summary><b>1. Storefront & Navigation Suite</b></summary>
<br/>

- **Dual Hero Engine**: Split editorial hero with framed caption & numeral indices, or cinematic full-bleed video/image hero with vertical scroll cues.
- **Predictive Instant Search**: Keyboard-accessible modal with live AJAX typeahead, thumbnail rendering, product price formatting, and collection recommendations.
- **Adaptive Sticky Header**: Shrinks smoothly on scroll, featuring integrated mega-menu blocks, localized currency/market selectors, and live dark-mode toggle switch.
- **Marquee Ticker & USP Row**: Infinite horizontal promise banners highlighting 22 SPI construction, zero-plastic packaging, and complimentary worldwide shipping.
</details>

<details open>
<summary><b>2. Conversion-Optimized Product Experience</b></summary>
<br/>

- **Interactive Fit Bar**: Visual indicator displaying garment cut profile (*Slim*, *Regular*, *Relaxed*, *Oversized*).
- **Size Guide & Fit-Finder Matrix**: Built-in modal featuring garment dimension tables (Chest, Sleeve, Length, Collar) alongside an intelligent fit recommender.
- **Low-Stock Scarcity Indicators**: Dynamic inventory threshold alerts ("Only 2 left in size M") encouraging prompt customer conversion.
- **Sticky Add-to-Cart Bar**: Appears seamlessly on mobile and desktop as the customer scrolls past the primary purchase form.
- **Variant Swatches & Zoom**: Native circular color swatches with hover previews, plus high-resolution modal zoom for textile inspection.
</details>

<details open>
<summary><b>3. Frictionless AJAX Cart & Checkout</b></summary>
<br/>

- **Slide-Over Cart Drawer**: Zero page reloads powered by Shopify's Section Rendering API.
- **Free-Shipping Progress Meter**: Live calculation dynamically updating as customers add items towards the threshold ($150 default).
- **In-Drawer Cross-Sells**: Configurable upsell collection recommendations directly inside the cart drawer.
- **Order Notes & Gift Messages**: Expandable text fields for bespoke tailoring notes or monogram instructions.
</details>

<details open>
<summary><b>4. Brand Narrative "About Us" Suite (9 Modular Sections)</b></summary>
<br/>

- `about-hero`: Split editorial hero, outlined display accent, atelier note card, and 4 brand metrics.
- `about-manifesto`: Oversized statement typography, founder signature block, and two-column philosophy.
- `about-story`: "Why We Exist" narrative with a four-pillar principle grid.
- `about-timeline`: Sticky vertical year rail with chronological milestones and chapter photography.
- `about-craft`: Four-stage tailoring accordion with synchronized sticky figures and craft metrics.
- `about-materials`: Interactive fabric library showcasing cotton, linen, and oxford swatches with mill origin and GSM weight.
- `about-team`: Grayscale-to-color interactive team portrait cards with executive bios and social links.
- `faq`: Accessible accordion for store policies, garment care, and customization.
- `about-cta`: Obsidian statement section with studio contact info and direct inquiry forms.
</details>

---

## 📦 Component & Section Catalog

Gridium includes **43 Sections** and **16 Snippets**, all fully configurable via Shopify Theme Editor schema:

```
gridium/
├── sections/
│   ├── about-craft.liquid              # 4-stage accordion & sticky process photo
│   ├── about-cta.liquid                # Midnight closing statement & studio grid
│   ├── about-hero.liquid               # Split hero with metrics and atelier note
│   ├── about-manifesto.liquid          # 21ch display measure & founder signature
│   ├── about-materials.liquid          # Fabric library with real mill data & swatches
│   ├── about-story.liquid              # Narrative statement & 4-column principles
│   ├── about-team.liquid               # Atelier team portraits & leadership bios
│   ├── about-timeline.liquid           # Sticky year rail & archive timeline
│   ├── announcement-bar.liquid         # Multi-message ticker & language selector
│   ├── cart-drawer.liquid              # AJAX slide-over drawer & threshold meter
│   ├── category-tiles.liquid           # Architectural grid tiles with hover reveal
│   ├── contact-form.liquid             # Client inquiry form with custom fields
│   ├── faq.liquid                      # ARIA-compliant accordion
│   ├── featured-collection.liquid      # Carousel / grid layout with quick-add
│   ├── featured-product.liquid         # Highlighted garment with full buy form
│   ├── footer.liquid                   # Multi-column grid, newsletter & badges
│   ├── header.liquid                   # Sticky nav, search, wishlist & mega-menu
│   ├── hero.liquid                     # Cinematic hero with blur-rise typography
│   ├── image-with-text.liquid          # Editorial asymmetric content blocks
│   ├── instagram-grid.liquid           # Social gallery with shop-the-look tags
│   ├── main-404.liquid                 # Branded missing-page experience
│   ├── main-article.liquid             # Editorial article with sticky TOC & comments
│   ├── main-blog.liquid                # Journal index with topic filters
│   ├── main-cart.liquid                # Standalone full cart page fallback
│   ├── main-collection.liquid          # Faceted filters, density toggle & swatches
│   ├── main-list-collections.liquid    # Complete catalog directory
│   ├── main-page.liquid                # Clean typographic editorial page
│   ├── main-password.liquid            # Coming soon / launch gatekeeper
│   ├── main-product.liquid             # Primary PDP layout, gallery & buy buttons
│   ├── main-search.liquid              # Full-page faceted search results
│   ├── newsletter.liquid               # Email capture with discount incentive
│   ├── policy-content.liquid           # Legal templates with floating sticky TOC
│   ├── predictive-search.liquid        # Live AJAX instant search dropdown
│   ├── product-recommendations.liquid  # Algorithmic related products carousel
│   ├── quote-band.liquid               # Full-width founder quote callout
│   ├── recently-viewed.liquid          # LocalStorage-backed garment history
│   ├── size-guide.liquid               # Garment measurement specs & fit matrix
│   ├── testimonials.liquid             # Verified customer press & reviews
│   ├── ticker.liquid                   # Continuous marquee ticker banner
│   ├── usp-row.liquid                  # Value propositions with hairline icons
│   └── wishlist.liquid                 # Client-side saved items drawer & page
```

---

## 🚀 Instant 3-Click Installation

To deploy Gridium to a live client store, follow these 3 steps:

1. **Build the Release ZIP**:
   ```bash
   npm run theme:zip
   ```
   *Creates `release/gridium-shopify-theme-v1.3.0.zip` (validated with zero Theme Check offenses).*
2. **Upload to Shopify**:
   - In Shopify Admin, navigate to **Online Store → Themes**.
   - In the **Theme library** section, click **Add theme → Upload zip file**.
   - Select `release/gridium-shopify-theme-v1.3.0.zip` and click **Upload file**.
3. **Publish the Theme**:
   - Once uploaded, click **Actions → Publish** (or click **Preview** to review).

> 💡 **Zero Theme Editor Setup Guarantee**: On a fresh install, Gridium immediately renders the complete homepage, navigation, about page, and footer using the bundled fallback monogram (`assets/logo.png`), pre-set typography, and default Paper/Stone color schemes!

---

## 📋 5-Minute Client Hand-Off Checklist

To fully populate product data, navigation, and policy templates on a brand-new store:

### 1. Import Sample Products
- Navigate to **Shopify Admin → Products → Import**.
- Choose [`gridium/demo/products_import.csv`](gridium/demo/products_import.csv).
- *Instantly provisions 6 premium shirts, 48 variants, color swatches, sale tags, and low-stock demo states.*

### 2. Connect Page Templates
Navigate to **Online Store → Pages → Add page**, set the title, and assign the template on the right:

| Page Title | Handle | Template Suffix | Content Description |
| :--- | :--- | :--- | :--- |
| **About Us** | `about` | `page.about` | 9-section editorial story narrative |
| **Contact Us** | `contact` | `page.contact` | Atelier inquiry form & studio details |
| **Privacy Policy** | `privacy-policy` | `page.privacy-policy` | Formatted policy with sticky TOC |
| **Refund Policy** | `refund-policy` | `page.refund-policy` | 30-day exchange & return terms |
| **Wishlist** | `wishlist` | `page.wishlist` | Dedicated customer saved garments page |

### 3. Setup Navigation & Mega Menu
- Go to **Online Store → Navigation → Main menu**.
- Add links: `Shirts`, `New Arrivals`, `Collections`, `About`, `Contact`.
- In the Theme Customizer (**Header → Add Block**), select **Mega menu feature** and set *Menu item title to attach to* = `Shirts`.

### 4. Configure Product Metafields (Optional)
Gridium includes native UI hooks for bespoke garment metafields:
- `custom.fit` *(Single line text: e.g. "Tailored Slim Fit")*
- `custom.model_info` *(Single line text: e.g. "Model is 6'1\" wearing size M")*
- `custom.fabric` *(Single line text: e.g. "100% Giza 45 Egyptian Cotton")*
- `custom.denim_weight` *(Single line text: e.g. "12.5 oz Kuroki Selvedge")*

---

## 🛠️ Developer Toolchain & CLI

```bash
# Clone the repository
git clone https://github.com/anwariqbaldawar/gridium.git
cd gridium

# Install dependencies (React 19, Vite 7, TailwindCSS v4, Theme Check)
npm install

# Start the interactive React Studio Preview App
npm run dev
# → http://localhost:5173

# Execute static theme audit (validates 112 files & JSON schemas)
npm run theme:audit

# Run Shopify's official Theme Check linter (0 offenses)
npm run theme:check

# Package deterministic release ZIP for Shopify upload
npm run theme:zip
# → release/gridium-shopify-theme-v1.3.0.zip

# Production build of the React Studio Preview App
npm run build
```

### Developing Directly on Shopify via Shopify CLI
```bash
# Install Shopify CLI globally if not already installed
npm install -g @shopify/cli @shopify/theme

# Run local development server connected to your Shopify store
cd gridium
shopify theme dev --store your-client-store.myshopify.com

# Push unpublished theme changes directly to the store
shopify theme push --unpublished --store your-client-store.myshopify.com
```

---

## 📂 Repository File Structure

```
├── .github/
│   └── workflows/              # Automated CI/CD verification workflows
├── docs/
│   └── assets/
│       ├── gridium-banner.svg        # Master animated SVG hero banner
│       └── gridium-architecture.svg  # System architecture blueprint diagram
├── gridium/                    # Production Shopify Online Store 2.0 Theme
│   ├── assets/                 # CSS stylesheets, JS modules, brand logo, WOFF2 fonts
│   │   ├── base.css            # Master architectural CSS design system
│   │   ├── cart.js             # AJAX cart drawer & shipping calculation
│   │   ├── product.js          # Variant switching & media zoom
│   │   ├── theme.js            # Core animations, observer & utilities
│   │   └── ...
│   ├── config/                 # Shopify theme settings & default presets
│   │   ├── settings_data.json  # Pre-configured styling tokens
│   │   └── settings_schema.json# Customizer inputs & color schemas
│   ├── demo/                   # Demo assets & products_import.csv
│   ├── layout/                 # theme.liquid and password.liquid roots
│   ├── locales/                # en.default.json language strings
│   ├── sections/               # 43 Liquid sections with JSON schemas
│   ├── snippets/               # 16 Reusable Liquid snippets (logo, icons, cards)
│   ├── templates/              # 18 JSON & Liquid templates (PDP, collections, about)
│   │   └── customers/          # Full suite of customer account templates
│   ├── .shopifyignore          # Files excluded from live theme sync
│   └── .theme-check.yml        # Configuration for Shopify Theme Check
├── release/                    # Generated uploadable Shopify ZIP archives
│   └── gridium-shopify-theme-v1.3.0.zip
├── scripts/                    # Theme verification & packaging utilities
│   ├── audit-theme.mjs         # Static file & reference validator
│   ├── package-theme.mjs       # Deterministic Level-9 DEFLATE ZIP packager
│   └── theme-check.mjs         # Programmatic Theme Check runner
├── src/                        # Vite + React 19 Theme Studio Preview application
│   ├── components/             # Storefront UI simulator components
│   ├── data/                   # Shirt catalog, mock products & pricing
│   ├── App.tsx                 # Master studio application & route manager
│   └── index.css               # Tailwind CSS v4 design layer
├── package.json                # Project dependencies & npm scripts
├── tsconfig.json               # TypeScript strict configuration
└── vite.config.ts              # Vite 7 build configuration
```

---

## 📈 Quality Assurance & Performance

```
                       LIGHTHOUSE AUDIT BENCHMARKS
┌─────────────────────────┬────────┬───────────────────────────────────┐
│ Metric                  │ Score  │ Optimization Rationale            │
├─────────────────────────┼────────┼───────────────────────────────────┤
│ Performance             │  99+   │ Native Liquid, 0 heavy JS bundles │
│ Accessibility (a11y)    │  100   │ Strict ARIA labels & focus traps  │
│ Best Practices          │  100   │ 0 Theme Check offenses, HTTPS     │
│ SEO Readiness           │  100   │ Rich structured JSON-LD schema    │
└─────────────────────────┴────────┴───────────────────────────────────┘
```

- **Zero Layout Shift (0 CLS)**: Explicit image aspect ratios defined via Liquid `image_tag` dimensions.
- **Fast Contentful Paint (FCP)**: Bundled fonts (`instrument-serif-400.woff2`) loaded with preload attributes.
- **Accessible Interactions**: Complete keyboard focus trapping in drawers, aria-live announcements for cart mutations, and visible 3px focus rings on all interactive elements.

---

## 🏷️ Version History & Release Notes

### **v1.3.0** *(Latest Production Release)*
- **Mobile Experience Overhaul**: Centered mobile brand lockup engineered never to clip or overlap; integrated sticky filter bar for seamless collection exploration.
- **Native Dark Mode Switcher**: Added smooth toggle in both header and mobile navigation drawer with zero-flash localStorage persistence.
- **Editorial Hero Refinement**: Split editorial hero layout with framed captions, index numerals, and subtle blur-rise transitions.
- **Comprehensive Policy Pages**: Rebuilt privacy and refund policy layouts with floating, auto-generated sticky Table of Contents.
- **Theme Check Compliance**: Reached 0 offenses across all 112 theme files.

### **v1.2.0**
- **Editorial Typography Suite**: Integrated self-hosted Instrument Serif display font with automatic fallback fallbacks.
- **Motion Orchestration**: Implemented staggered scroll-reveal animations with strict `prefers-reduced-motion` compliance.
- **Marquee Promise Ticker**: Added infinite horizontal marquee for brand promises and sustainability credentials.
- **About Manifesto Layout**: Expanded statement typography with 21ch display measure and bordered founder signature column.

### **v1.1.0**
- **Brand Story Engine**: Introduced 8 narrative About Us sections (Manifesto, Timeline, Materials Library, Craft Process, Team).
- **Journal Suite**: Full blog and article templates featuring reading time estimates and topic filters.
- **Deterministic Packager**: Added `npm run theme:zip` and static theme auditing utilities.

### **v1.0.0**
- Initial Online Store 2.0 foundation: 33 modular sections, AJAX cart drawer, predictive search, wishlist, size guide, and customer account flows.

---

## 🤝 Contributing & Maintenance

1. Fork the repository (`https://github.com/anwariqbaldawar/gridium.git`).
2. Create your feature branch (`git checkout -b feat/brand-enhancements`).
3. Validate your code before committing:
   ```bash
   npm run theme:audit && npm run theme:check && npm run build
   ```
4. Commit your changes with conventional commit messages (`git commit -m "feat: add lookbook hot-spots"`).
5. Push to your branch and submit a Pull Request.

---

## 📄 License & Credits

Distributed under the **MIT License**. See `LICENSE` for details.

- **Theme Development & Direction**: Anwar Iqbal Dawar ([@anwariqbaldawar](https://github.com/anwariqbaldawar))
- **Engineered with**: [Shopify Liquid](https://shopify.dev), [React 19](https://react.dev), [TailwindCSS](https://tailwindcss.com), [Vite](https://vitejs.dev), [TypeScript](https://www.typescriptlang.org)
- **Monogram Assets**: Gridium Studio Bespoke Sartorial Library

<div align="center">
  <sub>Built with precision for the next generation of luxury apparel brands.</sub>
</div>
