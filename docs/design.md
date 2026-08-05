# Maxx Global Resources — B2B Site Design Spec

Handoff document for implementation. The reference prototype lives in this project as a set of
`*.dc.html` files (a streaming-component format, inline styles only). **Do not port the format** —
port the design. Rebuild in whatever stack you like (Next.js + Tailwind, Astro, etc.). Everything
below is the source of truth; the prototype files are the visual reference.

---

## 1. Product

B2B catalog and lead-gen site for **Maxx Global Resources Corporation** — importer, installer and
servicer of commercial fitness equipment, sports flooring and playground systems for the Philippine
market (Southeast Asia sourcing).

- **No e-commerce.** No prices, no cart, no checkout. Every product path terminates in *Request a
  Quote*.
- **Audience:** facility specifiers — hotel/resort groups, condo developers, corporate HR/admin,
  schools, LGUs, commercial gym operators.
- **Primary conversion:** quote request form. Secondary: spec-sheet download, showroom visit.

---

## 2. Art direction

Cinematic, dark, editorial. Photography-forward with a lot of black. Restraint over decoration:
thin hairline rules, square-to-slightly-rounded corners, no glassmorphic cards, no gradients as
decoration (only as photo scrims), no shadows except on the floating header. Type does the work —
light weights at large sizes, semibold at small sizes.

Deliberately **not** a consumer store: information density and specification tone over marketing
fluff.

### Colour

| Token | Value | Use |
|---|---|---|
| `bg` | `#0a0a0a` | page background |
| `bg-deep` | `#080808` | footer |
| `surface` | `#0d0d0d` | cards, map canvas |
| `surface-raised` | `#111111` | segmented controls, inputs |
| `border` | `#1e1e1e` | hairline rules, card borders |
| `border-soft` | `#161616` / `#242422` | inner dividers, nested rules |
| `border-strong` | `#3a3a38` | hover borders, secondary button |
| `text` | `#f2f2f0` | body |
| `text-hi` | `#ffffff` | headings, active nav |
| `text-mid` | `#b8b8b4` | hero subcopy |
| `text-muted` | `#9a9a96` | section subcopy |
| `text-dim` | `#8a8a86` | labels, footer links |
| `text-faint` | `#5a5a56` | breadcrumbs, legal line |
| `accent` | `#d92632` (hover `#e63e49`) | primary CTA, stat plus signs, eyebrow tick |
| `link` | `#5b8def` (hover `#82a9f2`) | links, eyebrows, "view all" |
| `map-pin` | `#2f6fe0` | Manila HQ pin + glow |
| `warn` | `#f0a63c` | map hint line |

**Availability colours** (hollow tags, square corners — see §4):

| State | Text | Border |
|---|---|---|
| In Stock | `#8fb79b` (moss) | `#3c5a45` |
| Indent Order | `#c2a768` (sand) | `#5c4e2e` |

Max two background tones per page. Accent red appears at most twice per viewport.

### Type

**Manrope** (Google Fonts, weights 300–800), fallback `system-ui, sans-serif`.
`ui-monospace, monospace` for counts, model numbers, spec metadata and image placeholders.

| Role | Spec |
|---|---|
| Hero H1 | `clamp(34px, 7vw, 64px)` / 1.05 / **300** / `-0.01em` |
| Page H1 | `clamp(28px, 5.5vw, 46px)` / **300** / `-0.01em` |
| Section H2 | `clamp(24px, 4.4vw, 38px)` / **300** |
| Stat numeral | 40px / **300** |
| Card title | 22px / **600** |
| Body lead | 18px / 1.6 / `text-mid` |
| Body | 16px / 1.6 / `text-muted` |
| Meta / labels | 13px, `text-dim` |
| Eyebrow | 12–13px / **600** / `letter-spacing .18em` / uppercase / `link` colour |
| Sidebar group label | 12px / **700** / `.1em` / uppercase / `text-dim` |
| Legal / caption | 12px, `text-faint` |

`text-wrap: pretty` on headings and long paragraphs.

### Space & shape

- Page gutter: `clamp(20px, 5vw, 48px)`.
- Section rhythm: `88–100px` top padding between major sections.
- Radii: **4px** buttons, **6px** cards/media, **8px** large panels, **100px** pills (header, chips,
  segmented control), **0px** availability tags.
- Grids: `repeat(auto-fill, minmax(280px, 1fr))` category cards, `minmax(260px, 1fr)` product cards,
  `gap: 16px`. Always `auto-fill`/`auto-fit` + `gap` — never fixed column counts.
- Transitions: `.18–.2s ease`. No entrance animations, no parallax.

---

## 3. Layout shell

### Header — floating capsule (fixed)

- `position: fixed; top: 0; z-index: 50`. Pages start with a `92px` spacer, or heroes use
  `min-height` + `~118px` top padding so content clears it.
- Capsule: `margin: 14px clamp(12px,3.5vw,24px)`, `border-radius: 100px`,
  `background: rgba(18,18,18,.72)`, `border: 1px solid rgba(255,255,255,.09)`,
  `backdrop-filter: blur(14px)`, `box-shadow: 0 12px 40px rgba(0,0,0,.5)`.
- Logo `uploads/logo.png` at `clamp(28px,7vw,38px)`, rendered **white-knockout** via
  `filter: brightness(0) invert(1)`; on hover **anywhere in the header** the filter drops to `none`
  and the logo returns to full colour (`.2s ease`). Same trick in the footer at 64px with
  `opacity(.72)` in the resting state.
- Nav: Catalog · Brands · Solutions · Projects · About · Contact — 13.5px/600, `#a8a8a4`, active
  `#fff`. Right-side pill CTA "Request a Quote" in accent red.
- **< 900px:** nav collapses. CTA shortens to "Get a Quote"; 44px circular hamburger toggles a
  dropdown panel (`rgba(16,16,16,.96)`, 22px radius) with 16px/600 rows, 15×18px padding, active row
  tinted `rgba(255,255,255,.07)`. Bars animate to an X.

### Footer

`#080808`, `border-top: 1px solid #1e1e1e`, `56px clamp(20px,5vw,48px) 40px`.
Four columns via `repeat(auto-fit, minmax(190px, 1fr))`, `gap: 48px`: brand blurb · Catalog links ·
Contact · Showroom address with a Google Maps deep link and opening hours. Bottom bar: copyright
left, Facebook/Instagram right, 12px `text-faint`, divided by `#161616`.

---

## 4. Components

**Primary button** — `#d92632`, white, 4px radius, `16px 34px`, 15px/600. Hover `#e63e49`.
**Secondary button** — transparent, `1px solid #3a3a38`, same metrics. Hover border `#fff`.
**Pill CTA** (header) — same red, `100px` radius, `12px 24px`, 13.5px/600.

**Availability tag** — hollow, **square corners (0 radius)**, 1px border, transparent fill, text and
border from the availability palette. Muted moss / sand only; never a filled badge, never red.

**Product card** — `#0d0d0d`, `1px solid #1e1e1e`, 6px radius; hover `border-color: #3a3a38`.
Image area, then brand (12px `text-dim`), title (600), model in mono, availability tag.

**Category card** — 300px tall, 6px radius, full-bleed photo, bottom scrim
`linear-gradient(180deg, transparent 40%, rgba(10,10,10,.9))`, title 22px/600 + subtitle 13px.
Hover: `outline: 1px solid #3a3a38`.

**Stat band** — full-bleed grid, `repeat(auto-fit, minmax(200px,1fr))`, hairline top/bottom and
between cells, 36px padding, 40px/300 numeral with a red `+`.

**Eyebrow** — 22×3px red bar + uppercase tracked label in `link` blue.

**Chip / segmented control** — `#111` track, `1px solid #242422`, 100px radius, 5px padding;
selected chip fills lighter.

**Image placeholder** (prototype only) — 45° repeating stripe `#101010/#161616` with a mono
`[ description ]` caption top-right. Replace with real photography at build; keep aspect ratios.

---

## 5. Pages

| Page | Contents |
|---|---|
| **Home** | Hero (photo + scrim, eyebrow, H1, lead, two CTAs) → stat band → **interactive map** → category grid → featured products → segments/solutions teaser → projects teaser → CTA band |
| **Catalog** | Header band with live result count → two-column: sticky filter sidebar + product grid |
| **Category** | Category hero, subcategory chips, product grid |
| **Product** | Gallery, brand/model, availability + lead time, spec-sheet download (size in MB), description, quote CTA, related products |
| **Brands** | Brand index grid with tagline, origin, product count |
| **Brand** | Brand hero, story, product grid filtered to brand |
| **Solutions** | One block per market segment (hotels, condos, corporate, schools, LGU, gyms) |
| **Projects** | Filterable installation grid (segment, year, location) |
| **Project** | Case study: client, location, year, brands used, unit count, photo set |
| **Contact** | Quote form, showroom address + map link, hours |
| **About** | Company history, mission, vision, five core values (grid; 04–05 span full width) |
| **Terms of Service / Refund Policy / Privacy Policy** | Verbatim legal copy, single-column, ~720px measure |

### Homepage map (the signature element)

620px-tall panel, `#0d0d0d`, 8px radius, `1px solid #1e1e1e`, with a 62px `#141414` grid overlay.
Segmented control toggles two views:

1. **Global suppliers** — muted single-tone landmass, absolutely-positioned pins at supplier
   origins (Woodinville & Tainan; Utah; Shandong; Boulder; Taiwan; Perth; Zhejiang, China — Liben;
   Selangor, Malaysia — Shamrock Arena) plus a glowing blue **MANILA — HQ & SHOWROOM** marker at
   `83.6% / 41.9%`. East-Asia labels are compressed to avoid collision (Tainan renders as
   "Tainan, TW" at `37.2%`).
2. **Our clients in the Philippines** — country outline, project pins colour-coded by segment,
   legend bottom-left, each pin links to its project page.

Pins are `left/top` percentages over the panel. If you re-implement with a real projection, keep the
flat single-tone landmass (`#1a1a1a`, no borders, no labels) and the percentage-tuned label offsets.

### Catalog filtering

Sidebar is `position: sticky; top: 112px; max-height: calc(100vh - 112px); overflow-y: auto;
overscroll-behavior: contain` — **it scrolls independently of the grid**. Thin scrollbar
(`#3a3a38` on transparent). Groups: Category (expandable to subcategories, each with a mono count),
Brand (checkboxes), Availability. "Clear all" top-right.

**Explicitly removed and must not return:** ECO-POWR badges, facility-type filter, pre-order filter,
discontinued filter.

---

## 6. Data model

`data.js` holds all content as plain exported arrays. Shapes:

```js
AVAIL      { available|indent: { label, color, border } }
LEAD       { indent: "8–12 weeks from order confirmation" }
BRANDS     [{ key, name, tagline, origin, count }]
CATEGORIES [{ key, name, count, sub, img, children: [[key, name, count], …] }]
SEGMENTS   [{ key, name }]           // hotel, condo, corp, school, lgu, gym
PRODUCTS   [{ title, model, brand, cat, sub, avail, segs, featured,
              brandName, catName, subName, slug, specSize,
              availLabel, availColor, availBorder, lead }]
PROJECTS   [{ title, client, displayAs, location, year, segment, brands, units,
              photos, slug, clientLabel, segmentName, brandNames }]
```

- `slug` = `brand + "-" + model` lowercased, non-alphanumerics → `-`.
- `displayAs: "anonymised"` ⇒ render `clientLabel` ("Client name withheld"); never leak `client`.
- All copy in the prototype is placeholder except the About page and the three legal pages, which
  are **client-supplied verbatim** — do not rewrite. Privacy Policy still contains unfilled
  placeholders (`[INSERT AGE]`, etc.); leave them until the client fills them in.

---

## 7. Responsive

Single breakpoint at **900px** (header collapse). Everything else is fluid:

- `clamp()` on all page-level type and gutters — no per-breakpoint font sizes.
- All grids `auto-fill`/`auto-fit` + `minmax` so they reflow continuously.
- Heroes use `min-height` (never fixed `height`) plus top padding to clear the fixed capsule.
- Catalog sidebar drops above the grid when the flex row wraps (`flex: 1 1 250px`).
- Tap targets ≥ 44px on mobile.

---

## 8. Build notes

- Fonts: preconnect + Manrope 300–800 from Google Fonts (or self-host).
- Real photography replaces every striped placeholder; the caption text inside each placeholder
  describes the intended shot.
- Spec sheets are PDFs; show file size next to the download control.
- Contact form fields: name, company, role, email, phone, segment, project location, timeline,
  message, optional product/brand context prefilled from the originating page.
- Accessibility: the dark palette meets AA at the listed text tones on `#0a0a0a`; keep `text-faint`
  (`#5a5a56`) for non-essential text only.
