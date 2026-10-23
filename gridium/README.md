# Gridium — Online Store 2.0 Shopify Theme (v1.0.0)

**Gridium** is a Theme Store–grade Online Store 2.0 Shopify theme engineered specifically for premium shirts brands (Oxford button-downs, formal poplins, Belgian flax linens, knit polos, oversized shirts, and heavyweight Supima T-shirts).

---

## 1. Local Development & Preview in VS Code

### Prerequisites
1. Install **Node.js** (LTS v20+): [https://nodejs.org](https://nodejs.org)
2. Install **Shopify CLI** globally in your terminal:
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```
3. Create a free **Shopify Partner account** ([partners.shopify.com](https://partners.shopify.com)) and click **Stores -> Add store -> Create development store**.

### Run Live Hot-Reload Preview
Open the `gridium/` folder in VS Code and run:
```bash
cd gridium
shopify theme dev --store your-store.myshopify.com
```
- Log in via the browser prompt once.
- Open `http://127.0.0.1:9292` to preview with instant hot-reload for Liquid, CSS, and JSON changes.

### Run Theme Check (Linter)
```bash
shopify theme check
```

### Push or Package `.zip` for Upload
- Push directly to your store as an unpublished theme:
  ```bash
  shopify theme push --unpublished --store your-store.myshopify.com
  ```
- Or create a clean `.zip` archive (respecting `.shopifyignore`) to upload in **Shopify Admin -> Online Store -> Themes -> Add theme -> Upload zip file**:
  ```bash
  shopify theme package
  ```

---

## 2. Import the 6 Demo Shirt Products (`demo/products_import.csv`)

1. In Shopify Admin, go to **Products -> Import**.
2. Upload `demo/products_import.csv`.
3. Click **Import products**.
   - Imports **6 realistic shirt styles** (48 total variants across 2 colors × S/M/L/XL) including sale pricing, `new` & `bestseller` tags, low-stock variants (`Qty = 2`), and sold-out sizes (`Qty = 0`) so swatches, badges, quick-add, and filters work immediately.

---

## 3. Create Required Store Pages & Assign Templates

Go to **Online Store -> Pages -> Add page** and create these 5 pages with the exact **Theme template** dropdown on the right:

| Page Title | URL Handle | Theme Template |
| :--- | :--- | :--- |
| **About Us** | `/pages/about` | `about` (`page.about.json`) |
| **Contact** | `/pages/contact` | `contact` (`page.contact.json`) |
| **Privacy Policy** | `/pages/privacy-policy` | `privacy-policy` (`page.privacy-policy.json`) |
| **Refund Policy** | `/pages/refund-policy` | `refund-policy` (`page.refund-policy.json`) |
| **Wishlist** | `/pages/wishlist` | `wishlist` (`page.wishlist.json`) |

*(Note: Privacy & Refund pages automatically display `Settings -> Policies` when populated, or `page.content`, or Gridium's built-in legal copy with an auto-generated sticky Table of Contents.)*

---

## 4. Configure Collections, Storefront Filters, Menus & Metafields

### Collections & Storefront Filtering
1. Visit `/collections/all` — automatically titled **All Products** with sticky filter/sort bar and 2/3/4 column density toggle.
2. Install Shopify's free **Search & Discovery** app (**Apps -> Search & Discovery -> Filters**) to enable facets for **Availability**, **Price**, **Color** (`Option1`), **Size** (`Option2`), **Product type**, and custom metafields (`Fit`, `Fabric`).

### Menus (**Online Store -> Navigation**)
- Edit `main-menu` and add top-level items (`Shirts`, `New Arrivals`, `Collections`, `About`, `Contact`).
- In the Theme Editor (**Header -> Add block -> Mega menu feature**), set **Menu item title to attach to** = `Shirts` to display the 3-column mega menu + editorial feature card.

### Product Metafields (**Settings -> Custom data -> Products -> Add definition**)
Create these 3 optional Single-line text metafields (Gridium includes graceful fallbacks when left blank):
1. `custom.fit` — e.g. `Regular`, `Slim`, `Oversized` (shown on Product Cards & PDP Fit Bar)
2. `custom.model_info` — e.g. `Model is 6'1" (185 cm) and wears size M`
3. `custom.fabric` — e.g. `100% Organic Two-Ply Portuguese Poplin (135 GSM)`

---

## 5. Theme Editor Settings Reference (**Online Store -> Themes -> Customize**)

- **Colors & Schemes**: Customize **Paper** (`#FAFAF8`), **Stone** (`#EFECE6` + olive accent), and **Midnight** (`#111211`), selectable per section.
- **Typography**: Heading & body `font_picker` + fluid scale sliders.
- **Grid, Borders & Motion**: Max container width (`1360px`), gutter spacing, corner radius (`0–4px`), architectural `1px` hairlines, scroll motion toggle.
- **Product Cards & Badges**: Secondary hover image, Quick Add size popover, Wishlist heart, `New` days window, `Bestseller` tag, Low-stock threshold, and `Color:#HEX` swatch map.
- **Size Guide & Fit Finder**: Flat garment table (`XS–XXL`), custom page override, and `Find My Size` height/weight matrix.
- **Cart & Free Shipping**: Slide-out AJAX Drawer vs. Page, Order notes, Free-shipping progress threshold (`$150`), and Cart Upsell collection.
- **Store Utilities & Popups**: Back-to-top, optional floating WhatsApp concierge button, cookie notice bar, and delayed newsletter modal.
