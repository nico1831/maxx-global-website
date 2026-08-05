# Maxx Global B2B — Content Model Spec

**Project:** `b2b.maxxglobalresources.com`
**Stack:** Astro (static) + Sanity + Netlify (legacy free team)
**Purpose:** View-only commercial equipment catalog. No cart, no checkout. Primary conversion is a quote request.

---

## 1. Document types at a glance

| Type | Count (est.) | Role |
|---|---|---|
| `brand` | ~10 | SportsArt, Force USA, Impulse, Stages, Intenza, First Degree, VersaFit, FitPlus Floor, Liben, Shamrock Arena |
| `category` | ~25 | Two-level hierarchy (Cardio → Treadmills) |
| `product` | 150–400 | The core content type |
| `segment` | 5–6 | Hotels, Condos, Corporate Gyms, Schools, Government/LGU |
| `project` | 10–30 | Past installations. Credibility content — the single biggest B2B trust lever. |
| `page` | ~5 | About, Services, Contact, Privacy |
| `siteSettings` | 1 | Singleton |

**Quota note:** Sanity free tier caps at 10,000 documents and drafts count toward it. At ~500 published docs plus drafts you are using roughly 10% of the allowance. Comfortable.

---

## 2. `product` — the core type

This is the type worth getting right. Everything else is scaffolding around it.

| Field | Type | Notes |
|---|---|---|
| `title` | string | "G690 Verde Treadmill" |
| `slug` | slug | Auto from title |
| `modelCode` | string | `G690`, `IT9527`, `LE.QQ.114`. Buyers search by this — make it searchable and visible. |
| `brand` | reference → `brand` | Required |
| `primaryCategory` | reference → `category` | Required. Drives breadcrumb and URL. |
| `additionalCategories` | array of references → `category` | Optional. A cross-trainer can live in both Cardio and Functional. |
| `shortDescription` | string (max 160) | Card text + meta description fallback |
| `description` | portable text | Full copy, 100–300 words. Positioning and use case — **not** a spec dump. |
| `images` | array of image | Hotspot enabled, `alt` required on each. First = primary. |
| `keyFeatures` | array of string | 3–6 bullets. Renders as a scannable list above the fold. |
| `specSheet` | file (PDF) | **Manufacturer datasheet. This is where all specifications live.** See §2.1 |
| `videoUrl` | url | Optional YouTube embed |
| `availability` | string, enum | See §2.2 |
| `leadTimeNote` | string | Shown only when availability ≠ Available. e.g. "8–12 weeks from order confirmation" |
| `segments` | array of references → `segment` | Which markets this suits. Powers the segment pages. |
| `isEcoPowr` | boolean | SportsArt ECO-POWR flag. Their real differentiator — deserves its own badge. |
| `isFeatured` | boolean | Homepage / brand page promotion |
| `b2cUrl` | url | Link to the Shopify listing where one exists. Lets small buyers self-serve. |
| `relatedProducts` | array of references → `product` | Max 4 |
| `displayOrder` | number | Manual sort within category |
| `seo` | object `{ metaTitle, metaDescription, ogImage }` | All optional, fall back to main fields |

### 2.1 The `specSheet` field

**Decision: specifications live in the supplier's PDF, not in structured fields.**

Manufacturer datasheets are authoritative, already designed, and cost nothing to produce. Hand-transcribing specs across 300 products would take weeks and introduce errors in exactly the numbers buyers rely on.

- Upload the supplier PDF directly; name it `MAXX-{brand}-{modelCode}-spec.pdf` on upload
- Product page shows a prominent **"Download Spec Sheet (PDF)"** button with file size displayed
- Coverage is near-complete across the range, so this is the primary path for every product
- On the rare product with no PDF, the button becomes **"Request Spec Sheet"**, opening the contact form prefilled. Add a Studio validation *warning* so gaps surface during content entry.
- ~2MB average × 300 products ≈ 600MB against a 100GB asset allowance. Non-issue.

**What this trades away:** on-page spec search, side-by-side comparison, and spec-level SEO. Structured specs can be added later for a subset of flagship products without reworking anything else.

### 2.2 The `availability` enum

Four values, not a boolean. Commercial equipment is rarely simply in-or-out of stock.

| Value | Label shown | Meaning |
|---|---|---|
| `available` | Available | In showroom or local stock |
| `indent` | Indent Order | Ordered from principal on request. **This is the default for most commercial equipment.** |
| `preorder` | Pre-Order | Incoming shipment, reservable |
| `discontinued` | Discontinued | Kept live for SEO and existing-client reference, visually de-emphasised, quote CTA replaced with "Ask about replacement" |

Each needs a distinct visual treatment in the design phase. Decide the colors before you code.

---

## 3. `brand`

| Field | Type | Notes |
|---|---|---|
| `name` | string | |
| `slug` | slug | |
| `logo` | image | Transparent PNG/SVG. **Store a light-background version.** |
| `logoInverse` | image | Optional, for dark sections |
| `tagline` | string | "The Green Fitness Company" |
| `originCountry` | string | Country of origin matters in B2B tenders |
| `originCity` | string | "Utah", "Tainan" |
| `coordinates` | geopoint | Powers the homepage supplier map |
| `secondaryOrigin` | object `{ label, city, country, coordinates }` | Optional. Exists for SportsArt (USA HQ + Taiwan manufacturing). |
| `description` | portable text | |
| `heroImage` | image | Brand page banner |
| `website` | url | Manufacturer site |
| `isFeatured` | boolean | Homepage logo wall |
| `displayOrder` | number | |

---

## 4. `category`

| Field | Type | Notes |
|---|---|---|
| `title` | string | |
| `slug` | slug | |
| `parent` | reference → `category` | Null = top level. **Two levels only — do not allow deeper.** |
| `description` | portable text | Short intro, good for SEO |
| `image` | image | Card thumbnail |
| `displayOrder` | number | |

**Proposed tree:**

```
Cardio          → Treadmills, Ellipticals, Exercise Bikes, Rowers, Steppers/Climbers
Strength        → Multi-Station, Plate Loaded, Selectorized, Benches & Racks, Free Weights
Functional      → All-in-One Trainers, Rigs & Racks, Accessories
Cycling Studio  → Indoor Cycles, Power Meters, Studio Systems
Flooring        → Rubber Tiles, Rubber Rolls, PVC & Vinyl, Platforms
Playground      → Swings, Slides, Spring Riders, Play Systems
Outdoor Fitness → (if applicable)
```

Flooring and Playground matter — they're in the brochure and completely absent from the B2C site. They're a real reason for this site to exist.

---

## 5. `segment` — what makes this B2B

| Field | Type | Notes |
|---|---|---|
| `title` | string | "Hotels & Resorts" |
| `slug` | slug | |
| `heroImage` | image | |
| `intro` | portable text | Speak to their actual problem: guest expectations, space constraints, budget cycles |
| `considerations` | array of string | "Limited floor area", "Low-maintenance requirement", "Guest-safety compliance" |
| `recommendedCategories` | array of references → `category` | |
| `featuredProducts` | array of references → `product` | 4–8 |
| `relatedProjects` | array of references → `project` | |
| `ctaText` | string | "Request a facility layout consultation" |
| `displayOrder` | number | |

**Segments:** Hotels & Resorts · Residential Condominiums · Corporate Fitness · Schools & Universities · Government & LGU · Commercial Gyms

Government/LGU is worth its own page — public procurement has distinct needs (bid documents, warranty terms, local service capability) and the playground line is squarely aimed at it.

---

## 6. `project` — installations

Undervalued and cheap to produce. A gym owner deciding on ₱2M of equipment wants proof you've done this before.

| Field | Type | Notes |
|---|---|---|
| `title` | string | |
| `slug` | slug | |
| `clientName` | string | Optional — some clients won't want naming |
| `displayAs` | enum: `full` / `anonymised` / `hidden` | Controls how the client is credited |
| `anonymisedLabel` | string | Conditional. "A five-star hotel in Makati" |
| `permissionOnFile` | boolean | **Publishing gate.** Written permission recorded before going live. |
| `location` | string | "Bonifacio Global City, Taguig" |
| `coordinates` | geopoint | Required — powers the Philippine installation map |
| `year` | number | |
| `segment` | reference → `segment` | |
| `images` | array of image | Completed installations only. These are the whole point. |
| `summary` | text | 2–3 sentences |
| `brandsUsed` | array of references → `brand` | |
| `equipmentSupplied` | array of references → `product` | Optional |
| `isFeatured` | boolean | |

---

## 7. `siteSettings` (singleton)

| Field | Type |
|---|---|
| `logo` / `logoInverse` | image |
| `officeAddress` | text |
| `showrooms` | array of `{ name, addressLine, city, postalCode, coordinates (geopoint), landmarkNote, hours, photo, isPrimary }` |
| `socialLinks` | array of `{ platform (enum: facebook / instagram / youtube / linkedin), url, label }` |
| `phones` | array of `{ label, number, hasViber (boolean), hours }` |
| `whatsappNumber` | string |
| `emails` | array of `{ label, address }` |
| `contactFormRecipient` | string — `info@maxxglobalresources.com` |
| `serviceEmail` | string — `service@maxxglobalresources.com` |
| `socialLinks` | array of `{ platform, url }` |
| `companyBrochure` | file (PDF) |
| `defaultOgImage` | image |
| `stats` | object `{ installationsCompleted, provincesServed, yearsOperating }` — authored, not computed |
| `b2cSiteUrl` | url |

Existing data to seed it:
- **Showroom (confirmed current):** Unit 202B, RBL Building, 549 Banawe St, Lourdes, Santa Mesa Heights, Quezon City, 1114 Metro Manila — `14.6305045, 121.0025512`
- **Office (from brochure, verify):** Rm. 606 Downtown Center Building, 516 Quintin Paredes St., Binondo, Manila
- (632) 583-2360 · (632) 794-1737 · (63917) 833-3202 (Viber) · (63925) 7-MAXX-77
- info@ / service@maxxglobalresources.com
- Facebook and Instagram — confirm handles

---

## 8. `page` — generic content pages

`title`, `slug`, `heroImage`, `body` (portable text), `seo`. For About, Services, Privacy. Keep it simple; resist building a page-builder.

---

## 9. URL structure

```
/                                 Home
/brands                           Brand index
/brands/sportsart                 Brand detail
/catalog                          All products, filterable
/catalog/cardio                   Top-level category
/catalog/cardio/treadmills        Sub-category
/products/sportsart-g690-verde-treadmill    Product detail
/solutions/hotels-resorts         Segment
/projects                         Installation index
/projects/bgc-corporate-gym       Installation detail
/about  /contact  /request-quote
```

Flat product URLs (`/products/[slug]`) rather than nested under category — a product living in two categories otherwise creates duplicate URLs and an SEO canonical problem.

---

## 10. Decisions to make before design

These change the layout, so settle them now:

1. **Prices — show or hide?** Recommendation: hide. B2B pricing is negotiated by volume, and publishing list prices undercuts your sales team and your B2C store simultaneously. Every product CTA becomes "Request a Quote."
2. **Quote cart, or per-product enquiry?** ~~Decided:~~ per-product enquiry at launch. The multi-item enquiry list is deferred to a future phase — see the PRD's Future Considerations. Nothing in this model blocks adding it later.
3. **Gated content?** Dealer price lists behind a login is a common B2B pattern and would break the static/free architecture. Recommendation: no. Keep everything public, use the quote form as the gate.
4. **Bilingual?** English only unless you have a reason otherwise.

---

## 11. Sanity Studio ergonomics

Small things that decide whether your admin actually keeps this updated:

- **Custom desk structure** — group by Catalog / Brands / Segments / Projects / Settings rather than the default flat document list.
- **Preview panes** — configure `preview` on `product` so the list shows the thumbnail, title, model code, and availability at a glance.
- **Orderable lists** — use `@sanity/orderable-document-list` for brands and categories so drag-to-reorder replaces typing numbers.
- **Required fields** — mark `title`, `brand`, `primaryCategory`, `availability`, and at least one image as required. Validation is what stops half-finished products going live.
- **Alt text validation** — require it on every image. Accessibility and SEO, and it costs nothing to enforce at the schema level.

---

## 12. Build order

1. `siteSettings`, `brand`, `category` — no dependencies
2. `product` — depends on the above
3. `segment`, `project` — depend on products
4. `page` — standalone

Enter 5–10 real products by hand before writing any frontend code. Use actual SportsArt G690 and Impulse IT9527 data, not placeholders. Real content is what exposes a bad model.
