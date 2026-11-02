PRD (to be updated each time there is change):

# Maxx Global B2B — Product Requirements Document

**Site:** `b2b.maxxglobalresources.com`
**Stack:** Astro (static) + Sanity + Netlify (legacy free team)
**Companion doc:** `maxx-b2b-content-model.md`
**Status:** Rev 3 — reconciled with the built design (Design Component files: `Home`, `Catalog`, `Category`, `Product`, `Brands`, `Brand`, `Solutions`, `Projects`, `Project`, `About`, `Contact`, `Terms of Service`, `Refund Policy`, `Privacy Policy`, plus shared `SiteHeader` / `SiteFooter` and `data.js`)

> **Rev 3 changes only:** F1.3 (phones withdrawn), F1.7 (contact order), F1 acceptance criteria, F3.4 supplier origins (Liben, Shamrock Arena confirmed), new F5 (legal pages), new F6 (site chrome & visual direction), new F7 (About page), §5 `product` schema (availability enum reduced, `isEcoPowr` removed), Future §ECO-POWR note, open questions 8–13. Everything else is unchanged from Rev 2.

---

## 0. Overview

A view-only commercial equipment catalog for Maxx Global Resources Corporation, serving B2B buyers who cannot purchase online and must justify a purchase internally.

**Core insight driving every feature here:** the buyer is often not the decision-maker. A facilities manager, gym owner, or procurement officer browses this site, then has to convince someone who controls a budget. Every feature below either helps them build that case or removes an objection that kills the deal.

### Goals

1. Present the full commercial range clearly, with manufacturer spec sheets available on demand
2. Make contacting sales frictionless across three channels
3. Establish credibility for large-ticket purchases through supplier provenance and installation history
4. Surface the commercial-only lines (flooring, playground, heavy strength) absent from the B2C Shopify site

### Non-goals

- No transactions, cart, checkout, or pricing display
- No user accounts or dealer login
- No inventory integration
- No multi-item enquiry list at launch (see §Future)

### Constraints

- Total cost must remain ₱0/month
- Netlify legacy free tier: 300 build minutes, 100GB bandwidth, 100 form submissions/month
- Sanity free tier: 100GB bandwidth, 100GB assets, 1M API CDN requests/month
- All interactivity must be client-side; nothing may trigger a rebuild

---

## F1 — Contact & Enquiry

Three deliberately distinct channels. Different buyers have different habits, and a government procurement officer behaves nothing like a condo gym manager.

### F1.1 — Email via on-site form

**Behaviour**
- Form on `/contact`, plus a compact version on every product detail page
- Submits through Netlify Forms; notification routes to **info@maxxglobalresources.com**
- User never leaves the site and never opens a mail client

**Fields**

| Field | Type | Required |
|---|---|---|
| Name | text | Yes |
| Company / Organisation | text | Yes |
| Role | text | No |
| Email | email | Yes |
| Phone | tel | Yes |
| Facility type | select, mapped to `segment` | Yes |
| Product of interest | hidden, auto-filled on product pages | Auto |
| Message | textarea | Yes |
| Honeypot | hidden | — |

**Requirements**
- On product pages, the subject line and hidden field prefill with title + model code, so sales knows the context without asking
- Inline validation before submit; no full page reload
- Success state renders in place with a clear "we typically reply within one business day" expectation
- Netlify's built-in honeypot plus `data-netlify-recaptcha` if spam becomes an issue

**Routing note:** `info@maxxglobalresources.com` is the general enquiry inbox; `service@maxxglobalresources.com` handles support and maintenance. Consider a second, separate form on the future service/maintenance page routing to `service@` — mixing new-business enquiries with existing-client support tickets in one inbox is how leads get buried. Both addresses live in `siteSettings` so routing can change without a code edit.

### F1.2 — WhatsApp

**Behaviour**
- "Message us on WhatsApp" button on product detail pages and in `/contact`
- Uses `https://wa.me/<number>?text=<encoded>` — works on mobile and WhatsApp Web

**Prefilled message**
```
Hi MAXX, I'm enquiring about the SportsArt G690 Verde Treadmill (G690).
https://b2b.maxxglobalresources.com/products/sportsart-g690-verde-treadmill
```

**Requirements**
- Number sourced from `siteSettings`, never hardcoded
- Desktop: same link works via WhatsApp Web. Also display a QR code so a desktop visitor can continue on their phone.
- Keep prefilled text under ~300 characters; long URLs get truncated by some clients

### F1.3 — Phone numbers — **withdrawn from the UI (Rev 3)**

**Change:** at the client's instruction, all four numbers were removed from the header, the site footer and `/contact`. The "Call us" card on the contact page was deleted, as were the digits printed under the WhatsApp button. Phone is not a launch contact channel.

**Current state:** two channels — the on-site form (F1.1) and WhatsApp (F1.2) — plus the showroom address and the `info@` mailto in the footer. The header keeps its "Request a Quote" CTA, which routes to the form.

**Retained in `siteSettings` for reference, not rendered:**

| Label | Number | Note |
|---|---|---|
| Sales — Manila Office | (632) 583-2360 | Landline |
| Sales — Showroom | (632) 794-1737 | Landline |
| Mobile / Viber | (63917) 833-3202 | Also the WhatsApp number |
| Hotline | (63925) 7-MAXX-77 | |

**If numbers are restored**, the Rev 2 requirements stand unchanged: label each number with its purpose, show business hours beside it, wrap in `tel:` for mobile dialling, and state Viber availability in text rather than a `viber://` deep link — those links can't prefill message text and trigger an "open external application?" dialog on desktop.

### F1.5 — Showroom map links

**Behaviour**
- Address rendered as text, with a **"Open in Google Maps"** button and a **"Get Directions"** button beside it
- Use documented URL formats, which need no API key and cost nothing:
  - View: `https://www.google.com/maps/search/?api=1&query=14.6305045,121.0025512`
  - Directions: `https://www.google.com/maps/dir/?api=1&destination=14.6305045,121.0025512`
- Prefer coordinates over an address string in the query — address parsing is unreliable in Metro Manila, coordinates never are
- Do **not** embed a Google Maps iframe. Embeds now require a billing-enabled API key and would break the ₱0/month constraint.

**Optional enhancement**
- A static SVG or image map thumbnail that links out to Google Maps, giving the visual benefit of an embed with none of the cost or JavaScript weight

**Schema**
- `siteSettings.showrooms[]` → `{ name, addressLine, city, postalCode, coordinates (geopoint), hours, photo, isPrimary }`
- Coordinates drive the map links; a landmark note field ("same building as UCC") is worth adding, since Metro Manila navigation runs on landmarks more than street numbers

### F1.6 — Social links

**Behaviour**
- Facebook and Instagram icons in the site footer and on `/contact`
- Sourced from `siteSettings.socialLinks[]` → `{ platform (enum: facebook / instagram / youtube / linkedin), url, label }`
- Open in a new tab with `rel="noopener noreferrer"`
- Render only platforms actually populated — no placeholder or dead icons

**Likely URLs** (from the B2C site footer — confirm these are the right accounts for B2B, or whether separate handles exist):
- Facebook: `facebook.com/MaxxGlobalResources`
- Instagram: `instagram.com/maxxglobal`

The enum leaves room for LinkedIn, which is worth considering later — it's the platform where facilities managers and procurement officers actually are.

### F1.7 — Contact page structure

Order matters. Lead with the fastest channel for the visitor, not the most convenient for you.

1. Form (primary, above the fold)
2. WhatsApp button and desktop QR code — no number printed alongside it (Rev 3)
3. Showroom location with map link, coordinates, and photos
4. Office address
5. Social links (Facebook, Instagram)

**Showroom — confirmed current:**
- Unit 202B, RBL Building, 549 Banawe St, Lourdes, Santa Mesa Heights, Quezon City, 1114 Metro Manila
- Coordinates: `14.6305045, 121.0025512` (verified against Google Maps — the building is listed as "RBL Place")

**Office (from brochure — verify still current):**
- Rm. 606 Downtown Center Building, 516 Quintin Paredes St., Binondo, Manila

⚠️ **Address conflict to resolve.** Three different addresses appear across your existing materials:
| Source | Address |
|---|---|
| 2019 brochure | Ground Flr., Triple A Health Plaza, 36 Scout Torillo St., Bgy. Sacred Heart, QC |
| Shopify B2C site | 2nd Flr, RBL Bldg, 101 Banawe St., Sta Mesa Heights, QC |
| **This PRD (current)** | Unit 202B, RBL Building, 549 Banawe St, Sta Mesa Heights, QC |

The Banawe addresses are the same building with different street numbers on record; Triple A Health Plaza appears to be superseded. **Confirm which showrooms are active before launch** — and update the B2C Shopify site to match, since an outdated address there sends buyers to the wrong floor.

### Acceptance criteria

- Form submission arrives at the configured inbox within 2 minutes, with product context when sent from a product page
- WhatsApp opens with correct number and prefilled text on Android and iOS
- The WhatsApp QR scans correctly from a desktop screen, and no phone number appears anywhere in the UI (Rev 3)
- Zero rebuilds triggered by any submission

### Risk

Netlify's legacy free tier allows **100 form submissions per month**. Now that this is the only form on the site, that ceiling is comfortable — but monitor it. Migration to Web3Forms (250/month free) is a one-hour swap.

---

## F2 — Product Spec Sheets

### Decision

Product pages carry a **plain text description** plus a **downloadable manufacturer PDF** for full specifications. No structured spec tables.

This is a significant simplification and the right call: manufacturer PDFs are authoritative, already exist, are already designed, and cost you nothing to produce. Hand-transcribing specs for 300 products would take weeks and introduce transcription errors on numbers that buyers rely on.

**What you give up:** on-page spec search, side-by-side comparison, and spec-level SEO. If comparison becomes a sales priority later, structured specs can be added for a subset of flagship products without reworking anything.

### Requirements

**F2.1 — Description**
- `description` field is portable text (headings, bold, bullets) — rich enough for real marketing copy, simple enough to write quickly
- Target 100–300 words. Positioning, use case, standout features. Not a spec dump.

**F2.2 — Spec sheet download**
- Prominent button on every product detail page: **"Download Spec Sheet (PDF)"**
- Display file size next to the label. Buyers on mobile data need to know before tapping.
- Opens in a new tab; `download` attribute set so it saves with a sensible filename
- Filename pattern on upload: `MAXX-{brand}-{modelCode}-spec.pdf`

**F2.3 — Missing spec sheet fallback (edge case)**
- Coverage is near-complete, so treat this as a rare exception rather than a designed flow
- When `specSheet` is empty, replace the download button with **"Request Spec Sheet"**, opening the contact form prefilled with that request
- Never render a disabled or broken button
- Add a Studio validation warning (not a hard error) on products missing a spec sheet, so gaps surface during content entry instead of on the live site

**F2.4 — Key features**
- Retain `keyFeatures` as an array of 3–6 short strings, rendered as bullets above the fold
- This is the scannable middle ground between prose and a PDF download, and it costs a minute per product

**F2.5 — Storage**
- PDFs upload to Sanity and serve from its CDN
- At ~2MB average across 300 products that's roughly 600MB against a 100GB asset allowance. Non-issue.
- No build-time processing; PDFs are linked, never bundled

### Acceptance criteria

- Every product either offers a working PDF download or a "Request Spec Sheet" action — never a dead control
- File size displays accurately
- Downloads work on iOS Safari, which handles PDF downloads inconsistently — test explicitly

---

## F3 — Supplier Origin Map (Homepage)

### Problem

"We carry global brands" is a claim. A map is evidence. It also signals import capability, principal relationships, and scale — all of which matter in procurement.

### Requirements

**F3.1 — Visual**
- Interactive world map on the homepage, below the hero
- Muted world landmass in a single flat tone; no political border styling or country fills. This is a supply-chain graphic, not a geopolitical one.
- Animated pins at each supplier origin
- Optional: subtle arcs converging on Manila, reinforcing "we bring the world here." Use sparingly — arcs get noisy past ~8 origins.

**F3.2 — Interaction**
- Hover (desktop) / tap (mobile) a pin → card with brand logo, city and country, tagline, product count, link to brand page
- Brand logo strip below the map, synced with pin highlight on hover
- Mobile: render a simplified static map with a swipeable brand carousel beneath. Do not force pin-tapping on a 380px viewport.

**F3.3 — Data**

Add to the `brand` schema:
```
originCountry: string
originCity: string
coordinates: geopoint { lat, lng }
secondaryOrigin: object (optional) {
  label, city, country, coordinates
}
```

`secondaryOrigin` exists for SportsArt, which needs two pins.

**F3.4 — Supplier origins**

| Brand | Origin | Status |
|---|---|---|
| **SportsArt** | Woodinville, Washington, USA (HQ) **and** Tainan, Taiwan (manufacturing) | Confirmed — show both, connected, labelled "Headquarters" and "Manufacturing" |
| **Force USA** | Utah, USA | Confirmed |
| **VersaFit** | Australia | Confirmed |
| **FitPlus Floor** | Taiwan | Confirmed |
| Stages Cycling | Boulder, Colorado, USA | Verify city |
| First Degree Fitness | Perth, Australia | Verify city |
| Impulse Fitness | Shandong, China | Verify city |
| Intenza Fitness | Taiwan | Verify city |
| **Liben** | Zhejiang, China | Confirmed (Rev 3) |
| **Shamrock Arena** | Selangor, Malaysia | Confirmed (Rev 3) |

Liben and Shamrock Arena were confirmed in Rev 3. Confirm the remaining "verify city" rows with your principals before publishing. Misstating a manufacturer's country of origin on a public B2B site is the kind of error that surfaces during a tender review.

**F3.5 — SportsArt dual-pin treatment**
- Two pins connected by a thin line, each with its own label
- The shared hover card shows both locations
- Worth doing properly rather than picking one: the USA HQ signals design provenance and the Taiwan facility signals manufacturing scale. Both help you.

**F3.6 — Technical**
- Pins are positioned by percentage from each brand's Sanity `coordinates`. The basemap is a stylised outline rather than an equirectangular map, so the conversion is calibrated to the image in `src/lib/worldMap.ts`; replacing the image means recalibrating it
- Static SVG basemap. No mapping library, no API key, no tile costs.
- If accurate projection is needed later, upgrade to `d3-geo` + `world-atlas` TopoJSON rendered at build time
- Total added weight target: under 40KB

### Acceptance criteria

- Renders under 40KB with no external map service calls
- Every pin links to a working brand page
- SportsArt's two pins read clearly as one brand, not two
- Mobile version legible without pinch-zoom

---

## F4 — Clients & Installations Showcase

### Problem

For a ₱2M+ purchase, proof of prior delivery outweighs any product feature. A logo grid is the default treatment and it's weak — logos prove a transaction happened, not that it went well.

### Solution: "From the World to Your Floor"

Pair the homepage supplier world map with a **Philippine installation map** on this page. The two maps bookend the narrative: global sourcing at one end, local delivery at the other. Coherent, ownable, and not something competitors are doing.

### Requirements

**F4.1 — Philippine installation map (page hero)**
- SVG outline of the Philippines with pins at each installation
- Pins colour-coded by segment (hotel / condo / corporate / school / government / commercial gym)
- Cluster where density demands it — Metro Manila will dominate
- Click a pin → scroll to and highlight that project card
- Headline stat bar: installations completed · provinces served · brands deployed · years operating

**F4.2 — Project gallery**
- Masonry grid below the map, filterable by segment and by brand
- Cards show install photo, client name or anonymised label, location, year, segment badge, brands deployed
- Filter state syncs to URL query params so filtered views are shareable

**F4.3 — Project detail**
- Photo gallery with lightbox — completed installations only
- Structured narrative: the brief → what was supplied → outcome
- Equipment list linking to product pages
- "Planning something similar?" CTA opening the contact form prefilled with that segment

**F4.4 — Client confidentiality**
- `clientName` optional; `displayAs` enum: `full` / `anonymised` ("A five-star hotel in Makati") / `hidden`
- **Written permission required before naming any client or publishing install photos.** Some corporate and government clients contractually cannot be named. Legal requirement, not a nicety.
- `permissionOnFile` boolean acts as a publishing gate in Studio

**F4.5 — Logo wall (secondary)**
- Permissioned client logos belong near the footer, not the top
- Only logos with explicit display permission

**F4.6 — Content strategy**
- Minimum 6 projects to look credible at launch. Three looks like you're struggling; twelve looks established.
- Photos likely exist in staff phones, the Facebook page, or sales archives. Sourcing and permissions are the long pole of this entire build — start now, not at Phase 3.
- Shoot new photos at the next installation. A single planned shoot produces better material than a year of incidental phone snaps.

### Acceptance criteria

- Page works and looks intentional with 6 projects
- Every pin maps to a project card
- Filters produce shareable URLs
- No client named without recorded permission

---

## F5 — Legal pages (new in Rev 3)

Three static pages carrying client-supplied copy **verbatim** — no edits, additions, reordering or paraphrase: `/terms-of-service`, `/refund-policy`, `/privacy-policy`.

**Structure**
- Terms of Service holds the overview, Sections 1–20, and the Terms & Conditions block (product usage, delivery, warranty, terms of trade, disclaimer of liability, trademarks, force majeure, conflict of terms)
- Refund Policy holds the 30-day return policy, damages and issues, exceptions, exchanges and refunds
- Privacy Policy holds the privacy text including both Shopify cookie tables
- Reached from a "Legal" row at the foot of `/about`; each page carries a switcher to the other two, and a breadcrumb back to About

⚠️ **Three conflicts in the supplied copy to resolve before launch.** The pages render as supplied until legal confirms.
- The copy names **Maxx Home Fitness** as operator and **Shopify** as the platform, and states products are "for Home Use ONLY and not to be used for commercial purposes" — wrong entity, wrong platform and the opposite claim for a B2B commercial-equipment site
- The privacy policy is an unfilled Shopify template: `[INSERT AGE]`, `[DO/DO NOT]`, `[email address]`, `[DATE]`, plus vendor and opt-out placeholders. All left in place deliberately
- The refund policy describes a 30-day consumer return window with return shipping labels, which does not describe project-quoted B2B supply

Recorded as open questions 8–10.

---

## F6 — Site chrome & visual direction (new in Rev 3)

**Palette and type.** Near-black `#0a0a0a` base, `#f2f2f0` type, blue `#5b8def` for eyebrows and links, red `#d92632` for CTAs and rule marks. Manrope throughout. No more than two background tones per page.

**Header — fixed floating capsule.** A pill bar, `rgba(18,18,18,.66)` with a 14px backdrop blur and a hairline white border, fixed 20px in from the top edge; pill nav, pill "Request a Quote". It floats over the hero on the homepage; every other page carries a 92px spacer beneath it. In-page sticky elements (catalog filter rail, category tabs, project filters) offset to 112px.

**Logo.** The supplied file is navy on transparent and sinks into the black. It renders as a white knockout (CSS filter) and returns to full brand colour whenever the cursor is anywhere over the header; the footer follows the same rule, held at 72% opacity at rest. **Request a true white or mono logo file from the brand owner** — the filter is a workaround, not a deliverable.

**Availability tag.** Hollow, square-cornered, 9.5px uppercase, muted moss `#8fb79b` / sand `#c2a768`, replacing the earlier filled green/amber pill. Same treatment on catalog, category, brand and product pages, and on the product hero panel.

**Catalog filters.** Category (expandable tree), Brand, Availability. The Facility type filter was removed — segments still power the Solutions pages, the Projects filters and the contact form's facility field. The filter rail scrolls independently below the fixed header.

**Grids.** Product grids reflow with `auto-fill` at a 280px minimum rather than a fixed 3-up, so card footers never wrap at narrow widths.

---

## F7 — About page (revised in Rev 3)

Client-supplied copy, verbatim: the **About Us** paragraph, **Mission**, **Vision**, and five **Core Values** (three across, then 04 and 05 splitting the full width). The stats bar is retained — installations completed, provinces served, principal brands held, and "2007 — operating since".

Everything below Core Values was deleted at the client's instruction: the four-stage "how a project runs with us" sequence, the product-lines panel, the showroom/office panel, the principals grid and the showroom CTA. The page now ends at Core Values, followed by the Legal row (F5) and the footer.

The stats figures remain placeholders pending confirmation.

---

## 5. Schema changes required

Updates to the content model doc:

**`product`**
- **Remove** `specs` array — replaced by `specSheet` PDF
- `description` → portable text, 100–300 words
- `specSheet` (file, PDF) — now a primary field, surfaced prominently
- `specSheetSize` — derived at build time, not authored
- Retain `keyFeatures`
- **Rev 3:** `availability` enum reduced to two values — `available` (rendered **"In Stock"**) and `indent` (**"Indent Order"**). `preorder` and `discontinued` are removed from the model, the filters and the UI; the four products that carried them were reassigned
- **Rev 3: remove** `isEcoPowr` — the ECO-POWR badge was pulled from all product cards, the product hero and the brands list. ECO-POWR survives as prose on the SportsArt brand page and category intro only

**`brand`**
- Add `originCountry`, `originCity`, `coordinates` (geopoint)
- Add `secondaryOrigin` object for SportsArt

**`project`**
- Add `coordinates` (geopoint) — required for the PH map
- Add `displayAs` enum and `anonymisedLabel`
- Add `permissionOnFile` boolean (publishing gate)
- Add `equipmentSupplied` (array of references → product)
- **No** `beforeImages` field — completed installations only

**`siteSettings`**
- `contactFormRecipient` — set to `info@maxxglobalresources.com`
- `serviceEmail` — `service@maxxglobalresources.com`, for future service enquiries
- `whatsappNumber` (string)
- `phones[]` → `{ label, number, hasViber (boolean), hours }`
- `showrooms[]` → `{ name, addressLine, city, postalCode, coordinates (geopoint), landmarkNote, hours, photo, isPrimary }`
- `socialLinks[]` → `{ platform (enum: facebook / instagram / youtube / linkedin), url, label }`
- `stats` object: `{ installationsCompleted, provincesServed, yearsOperating }` — authored, not computed

---

## 6. Technical notes

| Concern | Approach |
|---|---|
| Forms | Netlify Forms → info@maxxglobalresources.com. Monitor the 100/month ceiling. |
| WhatsApp | `wa.me` links, number from `siteSettings` |
| Maps | Static SVG + percentage-positioned pins. No library, no API key. |
| Spec sheets | PDFs on Sanity CDN, linked not bundled |
| Images | Sanity CDN with `?w=&auto=format`. Keeps build minutes low. |
| Availability freshness | Client-side fetch of the `availability` field only, so stock changes appear without a rebuild |
| Search | Pagefind, static index built at build time |
| Analytics | Netlify Analytics is paid. Use Umami Cloud free tier or Cloudflare Web Analytics. |

**Build-minute discipline:** debounce the Sanity → Netlify webhook. During bulk content entry, disable it entirely and rebuild once at the end.

---

## 7. Phasing

**Phase 1 — Foundation.** Catalog, brands, categories, product detail with description + spec sheet download, contact form, WhatsApp, phone numbers. Fully useful on its own.

**Phase 2 — Credibility.** Supplier origin map (F3) and installations showcase (F4). Gated on photo sourcing and client permissions, which is why it follows — the engineering is a fraction of the effort.

**Phase 3 — Polish.** Pagefind search, filtering, print stylesheet, analytics.

Ship Phase 1 before Phase 2 is designed. A live site capturing enquiries beats a perfect one in staging.

---

## Future considerations

Not in scope. Recorded so the architecture doesn't preclude them.

**Multi-item enquiry list.** A "Build Your Facility" list persisted in `localStorage`, letting a buyer accumulate 8–15 products across a session and submit as one structured enquiry, with a printable spec sheet as output. Genuinely valuable for someone speccing a whole gym, and it turns the site from a catalog into a document generator.

Deferred because it's meaningfully more build effort than the rest of Phase 1 combined, and because it's worth confirming with sales whether they'd rather field individual product leads first. Nothing in the current architecture blocks adding it later — it's purely client-side.

**Structured specs and product comparison.** Would require transcribing specs from supplier PDFs. Only worth it if sales reports buyers asking to compare models directly, and even then only for flagship products.

**ECO-POWR savings calculator.** SportsArt converts 74% of human energy to electricity. Turning that into a peso figure — machines × hours × local kWh rate → annual savings and payback period — converts a sustainability story into a CFO-legible business case. Likely the strongest single differentiator available, but needs maintained electricity-rate data to stay credible. **Rev 3 note:** the ECO-POWR badge has been removed from the UI, so this calculator would now be the only place the programme is quantified — the SportsArt brand page carries the story in prose.

**Space planner.** Room dimensions → recommended equipment mix and footprint. Requires adding `footprint` dimensions to the product schema. Cheap to add to the model now, annoying to retrofit across 300 products later — worth considering even if the feature waits.

---

## 8. Open questions

1. **Do we have written permission from any client to name them or publish install photos?** Determines whether F4 is achievable at launch or slips.
2. ~~How many products have supplier spec-sheet PDFs?~~ **Resolved:** near-complete coverage. The "Request Spec Sheet" fallback is an edge case, not a designed flow.
3. **Which inbox is monitored, by whom, during what hours?** Applies to both the form and WhatsApp.
4. ~~**Origins for Liben and Shamrock Arena** — unverified.~~ **Resolved:** Liben — Zhejiang, China; Shamrock Arena — Selangor, Malaysia.
5. **Which showrooms are actually active?** Three different addresses appear across the brochure, the Shopify site, and this PRD. See F1.7.
6. **Are the Facebook and Instagram accounts shared with B2C, or separate?** Shared is fine and probably preferable — it consolidates social proof.
7. **Prices: confirmed hidden?** Assumed yes throughout.
8. **Do the supplied legal pages apply to this entity and platform?** They name Maxx Home Fitness and Shopify, and restrict products to home use. See F5.
9. **Who fills the privacy-policy placeholders?** `[INSERT AGE]`, `[DATE]`, `[email address]`, vendor lists and the data-protection authority link are all still bracketed.
10. **Does a 30-day consumer return window apply to B2B project supply,** or does the commercial side need its own returns and warranty terms?
11. **Is a white or mono logo file available?** The current knockout is a CSS filter on the colour file.
12. **Are the phone numbers withdrawn permanently or restored before launch?** See F1.3.
13. **Client names are still placeholders.** SM Supermalls, Ayala Land, Shangri-La, Megaworld and Robinsons Land appear on the homepage map and project cards as stand-ins; none may ship without written permission per F4.4.