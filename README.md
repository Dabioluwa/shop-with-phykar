# Shop with Phykar

Static multi-page storefront for **Shop with Phykar** — cosmetics, jewelry, hair accessories,
lifestyle items and gift boxes. Every order button opens WhatsApp with a pre-filled
message to **+234 810 144 7062**. No build step, no dependencies, no backend.

## Pages

| File | Purpose |
|---|---|
| `index.html` | Hero with brand portrait, big category tiles, services teaser, catalogue CTA |
| `beauty.html` | Cosmetics & Skincare — 20 items |
| `jewelry.html` | Jewelry & Accessories — 8 items |
| `hair.html` | Hair Accessories — 7 items |
| `lifestyle.html` | Personal Care & Gadgets — 6 items |
| `bundles.html` | Gift-box tiers, build-your-own-box CTA, box builder, FAQ |
| `appointments.html` | Service booking: pick service, date and time → WhatsApp request |
| `404.html` | Not-found page |

## Structure

```
.
├── index.html · beauty.html · jewelry.html · hair.html · lifestyle.html
├── bundles.html · appointments.html · 404.html
├── assets/
│   ├── css/styles.css      design system + all component styles
│   ├── js/data.js          ← brand, products, prices, categories, bundles,
│   │                         services, booking hours, FAQs
│   └── js/app.js           rendering, search, WhatsApp links, box builder, booking
├── assets/img/logo.png     circular header mark + browser tab icon (favicon)
├── assets/img/face.jpeg    home-page brand portrait
├── assets/img/favicon.svg
├── netlify.toml            cache + security headers
└── README.md
```

## Editing content

Almost everything lives in **`assets/js/data.js`**:

```js
{ id: "b10", cat: "beauty", group: "Skincare & Makeup",
  name: "Sunscreen", price: 3800, glyph: "🧴", tag: "Bestseller" }
```

| Field | Notes |
|---|---|
| `price` | Naira amount. Use `null` for "ask for price". |
| `priceMax` | Adds a range → `₦1,300 – ₦2,000` |
| `priceFrom` | Renders as `From ₦800` |
| `glyph` | Emoji shown as the placeholder image |
| `image` | Local path to a WebP photo (e.g. `assets/img/Product/sunscreen.webp`) and the grid uses the photo instead of the emoji. All 41 products and all 3 gift-box tiers have one. Leave it out and the emoji is used instead |
| `tag` | Optional badge, e.g. `Bestseller` |

The WhatsApp number lives in one place: `window.STORE.waNumber` at the top of `data.js`.
Change it there and every link on the site updates (including the `wa.me/c/` catalogue link).

## Branding

| Setting | Where | Value |
|---|---|---|
| Site / page name | `STORE.brand` in `data.js` | `Shop with Phykar` |
| Short name for greetings | `STORE.shortName` | `Phykar` — so messages read "Hi Phykar!" |
| Logo image | `STORE.logo` | `assets/img/logo.png` — circular header mark + browser tab icon |
| Brand portrait | `STORE.face` | `assets/img/face.jpeg` — home-page hero |
| TikTok | `STORE.tiktok` | header + footer icon button |
| Catalogue | `STORE.catalogueUrl` | `wa.me/c/2348101447062` — home banner + footer |
| Email | `STORE.email` | `onashokuntao@gmail.com` — footer envelope button (`mailto:`). Set to `""` to hide it |
| Location | `STORE.locationUrl` | Google Maps short link — footer map-pin button. Set to `""` to hide it |

**Where the logo appears.** The header leads with a brand lockup — the logo in a
circular border beside the "ShopwithPhykar" wordmark (the three words run together
as one mark in the nav only) — with the nav links, cart and TikTok pushed to the
right. The same image is also the browser tab icon: every
page sets `<link rel="icon" href="assets/img/logo.png" type="image/png">`, so the
mark shows as the tab and bookmark icon. The footer opens with a plain **Home**
link rather than the wordmark, because as a footer tile the solid pink image read
as a flat block.

**To set your logo:** save the image as `assets/img/logo.png`; the header lockup
and every page's tab icon pick it up automatically. If the file is missing the
header mark falls back to the rose/gold disc instead of a broken image. Replace
`assets/img/favicon.svg` with your logo (or point the `<link rel="icon">` tags at a
PNG) to change the browser tab icon.

To add a category: add it to `STORE.categories`, give products that `cat` id, add a
`nav` entry, then copy a category page and change `data-category` on `<body>`.

## Gift box tiers

Edit `STORE.bundles` in `data.js`. The Starter / Signature / Deluxe cards and
their WhatsApp links all render from that array, so adding or removing a tier is
a one-line change. All three tiers are currently level — set `featured: true` on
one to give it the dark card treatment and the "Most popular" ribbon. The
Custom Concierge tier was removed; custom orders go through the box builder.

## Appointments (`appointments.html`)

The booking page is fully generated from `data.js` — no form backend, the customer
just confirms on WhatsApp.

| Setting | Notes |
|---|---|
| `STORE.services` | One entry per bookable service. Currently **4**: lash extensions, lash refill, lash removal, brow lamination & tint. `duration` (minutes) drives the "45m / 1h 30m" label and the summary. |
| `STORE.booking.leadDays` | Earliest bookable day offset (currently `2` — 2 days' notice). |
| `STORE.booking.maxDays` | How many date chips to offer (currently `90`). |
| `STORE.booking.slotMinutes` | Slot step (currently `30`). |
| `STORE.booking.hours` | Array of 7 entries, `0` = Sunday … `6` = Saturday, each `["10:00","18:00"]` or `null` for closed. |

The page auto-hides closed days, greys out slots that have already passed today, and
builds a pre-filled WhatsApp message with service, date, time, duration and the
customer's name/phone/notes. Date chips are built from the browser's current date
on every load, and the list re-checks itself every 60 seconds plus on tab
focus / `visibilitychange` / bfcache restore — so a page left open overnight
rolls over to the new day on its own and clears a date that has passed. Each
chip shows the weekday, day number, month and year, and carries a full
`aria-label`. Deep links work too: `appointments.html?service=lashes`
pre-selects that service.

## Cart

Every product has an **Add to cart** button. Adds accumulate in a virtual cart
(`localStorage` key `phykar.cart.v1`) — nothing is charged and no form is sent.

| Piece | Where |
|---|---|
| `Add to cart` | every product card; the card then shows an `In cart · n` pill |
| Bag button in the header | opens the slide-over cart panel (badge shows the item count) |
| `−` / `+` in the panel | change the quantity of a line; `×` removes it |
| Floating **Order on WhatsApp** button | shows a live count badge and pulses while the cart has items |

Tapping the Order on WhatsApp button composes a message containing every line
(quantity × price, running estimated total), explicitly asks which items are in
stock, whether any prices differ, and for the delivery fee and timeline, then
leaves blank lines for name, phone and address. Items with no listed price are
sent as "please send the price" and flagged in the total.

This is separate from the gift-box builder on `bundles.html`, which has its own
`−` / `+` steppers and produces a different message.

## WhatsApp links

| Type | Format | Used for |
|---|---|---|
| Direct chat | `wa.me/2348101447062?text=…` | per-item order/enquiry buttons and the cart order |
| Catalogue | `wa.me/c/2348101447062` | the "Open WhatsApp catalogue" banner and footer link |

## Box builder

The builder on `bundles.html` lists every priced item with a **− / + stepper** so
customers can raise or lower the quantity of each product, tracks quantities,
computes a running total, nudges the customer toward the ₦10k / ₦25k / ₦50k marks
(above ₦50k it simply says "Building a custom package 🎉"), and composes one
WhatsApp message with items, total, budget, recipient, occasion and notes.
The selection persists in `localStorage` under `phykar.box.v1`.
Items with `price: null` are excluded from the builder (they go through "Enquire").

## Local preview

Any static server works:

```powershell
npx serve .          # or: python -m http.server 8000
```

Opening the `.html` files directly also works, but a server is recommended so the
canonical URLs and favicon resolve as they will in production.

## Deploy (free)

**Netlify** — drag the folder onto <https://app.netlify.com/drop>, or connect the repo.
`netlify.toml` is picked up automatically. Publish directory: `.`

**Render** — new *Static Site*, build command empty, publish path `.`

**Surge.sh** — `npm i -g surge` then `surge ./ your-subdomain.surge.sh`

**GitHub Pages** — push to a repo and enable Pages on the branch root.

Set a custom short link on top with [Dub.co](https://dub.co) or
[Bitly](https://bitly.com) pointing at the deployed URL, e.g. `dub.sh/shop-name`.

## Notes before going live

- Confirm the WhatsApp number is correct in `STORE.waNumber` (the `wa.me/c/` catalogue
  link is already confirmed working — keep it as-is).
- Every product and gift-box tier has a photo wired up in `data.js`, converted to WebP from the
  originals in `assets/img/_originals_png/` (about 20 MB of PNGs down to 1.6 MB). To swap in a
  better photo, drop a WebP into `assets/img/Product/` and change the `image` path on the item.
  Delete `assets/img/_originals_png/` when you no longer need them; nothing in the site
  references it.
- Confirm the salon opening hours in `STORE.booking.hours` — they are currently set to
  Mon–Fri 10:00–18:00, Sat 10:00–16:00, closed Sunday.
- Update the delivery area, payment methods and contact details in `mountFooter()`
  in `app.js`, and the `Store` JSON-LD block in each page's `<head>`.
- Update `sitemap.xml` / `robots.txt` with the real domain once deployed.
