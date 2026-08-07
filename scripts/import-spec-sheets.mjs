// Pulls each product's spec sheet PDF from its maxxhomefitness.com page (via `b2cUrl`)
// and uploads it as the `specSheet` file asset on the matching Sanity `product` document.
// Run with:
//   node --env-file=.env scripts/import-spec-sheets.mjs             # full run
//   node --env-file=.env scripts/import-spec-sheets.mjs --limit=5   # test on first N products
//   node --env-file=.env scripts/import-spec-sheets.mjs --dry-run   # find + validate links only, no writes

import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, or SANITY_API_TOKEN. Run with: node --env-file=.env scripts/import-spec-sheets.mjs')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2025-02-19', useCdn: false })

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const limitArg = args.find((a) => a.startsWith('--limit='))
const limit = limitArg ? Number(limitArg.split('=')[1]) : Infinity

const SPEC_KEYWORDS = /data\s*sheet|spec(ification)?s?\s*sheet|datasheet|user\s*manual|owner'?s?\s*manual/i
const UA = { 'user-agent': 'Mozilla/5.0' }

function extractLinks(html) {
  const linkRe = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi
  const links = []
  let m
  while ((m = linkRe.exec(html))) {
    const href = m[1]
    const text = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    links.push({ href, text })
  }
  return links
}

// Text is a stronger signal than the URL — some hosts serve PDFs from extension-less
// generator endpoints. Order candidates by confidence; caller verifies actual content.
function candidatePdfLinks(links) {
  const keyworded = links.filter((c) => SPEC_KEYWORDS.test(c.text))
  const pdfExt = links.filter((c) => /\.pdf(\?|#|$)/i.test(c.href))
  const ordered = []
  const seen = new Set()
  const push = (href) => {
    if (href && !seen.has(href)) {
      seen.add(href)
      ordered.push(href)
    }
  }
  keyworded.filter((c) => /pdf/i.test(c.href)).forEach((c) => push(c.href))
  keyworded.forEach((c) => push(c.href))
  pdfExt.forEach((c) => push(c.href))
  return ordered
}

// Confirms the URL actually serves a PDF (content-type or magic-number check) — source
// pages sometimes mislabel a link's text (e.g. "DATA SHEET!" pointing at a normal page).
async function fetchIfPdf(url) {
  const res = await fetch(url, { headers: UA })
  if (!res.ok) return null
  const contentType = (res.headers.get('content-type') || '').toLowerCase()
  const buffer = Buffer.from(await res.arrayBuffer())
  const looksLikePdf = contentType.includes('pdf') || buffer.subarray(0, 5).toString('latin1') === '%PDF-'
  return looksLikePdf ? buffer : null
}

function sanitizeFilename(brandSlug, modelCode, title) {
  const base = (modelCode || title).toString().replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  const brand = (brandSlug || 'product').replace(/[^a-zA-Z0-9]+/g, '-')
  return `MAXX-${brand}-${base}-spec.pdf`
}

async function run() {
  const products = await client.fetch(
    `*[_type == "product" && defined(b2cUrl) && !defined(specSheet.asset)] | order(title asc) {
      _id, title, modelCode, b2cUrl, "brandSlug": brand->slug.current
    }`
  )

  console.log(`Found ${products.length} product(s) missing a spec sheet.`)
  const toProcess = products.slice(0, limit)
  console.log(`Processing ${toProcess.length} of them.${dryRun ? ' (dry run — no writes)' : ''}\n`)

  const results = { updated: [], noPdfFound: [], failed: [] }

  for (const p of toProcess) {
    console.log(`--- ${p.title} ---`)
    try {
      const pageRes = await fetch(p.b2cUrl, { headers: UA })
      if (!pageRes.ok) throw new Error(`page fetch ${pageRes.status}`)
      const html = await pageRes.text()
      const candidates = candidatePdfLinks(extractLinks(html))

      if (candidates.length === 0) {
        console.log('  no candidate link found')
        results.noPdfFound.push(p.title)
        continue
      }

      let buffer = null
      let usedUrl = null
      for (const url of candidates) {
        try {
          const b = await fetchIfPdf(url)
          if (b) {
            buffer = b
            usedUrl = url
            break
          }
          console.log(`  candidate rejected (not a PDF): ${url}`)
        } catch (e) {
          console.log(`  candidate errored (${e.message}): ${url}`)
        }
      }

      if (!buffer) {
        console.log('  no valid PDF among candidates')
        results.noPdfFound.push(p.title)
        continue
      }
      console.log(`  found: ${usedUrl}`)

      if (dryRun) {
        results.updated.push(p.title)
        continue
      }

      const filename = sanitizeFilename(p.brandSlug, p.modelCode, p.title)
      const asset = await client.assets.upload('file', buffer, { filename, contentType: 'application/pdf' })
      await client
        .patch(p._id)
        .set({ specSheet: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } } })
        .commit()

      console.log(`  uploaded + linked: ${filename}`)
      results.updated.push(p.title)
    } catch (err) {
      console.log(`  FAILED: ${err.message}`)
      results.failed.push({ title: p.title, error: err.message })
    }
  }

  console.log('\n=== Summary ===')
  console.log(`Updated: ${results.updated.length}`)
  console.log(`No PDF found: ${results.noPdfFound.length}`)
  console.log(`Failed: ${results.failed.length}`)
  if (results.noPdfFound.length) console.log('\nNo PDF found for:\n' + results.noPdfFound.map((t) => `  - ${t}`).join('\n'))
  if (results.failed.length) console.log('\nFailed:\n' + results.failed.map((f) => `  - ${f.title}: ${f.error}`).join('\n'))
}

run()
