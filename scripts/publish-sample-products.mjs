// One-off: fixes up the 5 sample products created by import-shopify-products.mjs
// (drops modelCode, sets availability='available') and publishes them by moving
// the draft document to its published id.
// Run with: node --env-file=.env scripts/publish-sample-products.mjs

import { createClient } from '@sanity/client'

const SAMPLE_HANDLES = [
  'force-usa-pro-series-fid-bench',
  'force-usa-g12-all-in-one-trainer',
  'housefit-smart-420-under-desk-treadmill-with-bluetooth-app-for-walking-and-running-mode-2-in-1',
  'spirit-fitness-cic850-commercial-indoor-cycling-bike',
  'ironbull-fitness-100927-yoga-mat-blue-non-slip',
]

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN
if (!projectId || !dataset || !token) {
  console.error('Missing env vars. Run with: node --env-file=.env scripts/publish-sample-products.mjs')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2025-02-19', useCdn: false, perspective: 'raw' })

for (const slug of SAMPLE_HANDLES) {
  const docId = await client.fetch(`*[_type == "product" && slug.current == $slug][0]._id`, { slug })
  if (!docId) {
    console.log(`${slug} -- not found, skipping`)
    continue
  }

  const isDraft = docId.startsWith('drafts.')
  const doc = await client.getDocument(docId)
  delete doc.modelCode
  doc.availability = 'available'

  if (isDraft) {
    const publishedId = docId.replace(/^drafts\./, '')
    doc._id = publishedId
    await client.transaction().createOrReplace(doc).delete(docId).commit()
    console.log(`${slug} -- was draft, published as ${publishedId}`)
  } else {
    await client.transaction().createOrReplace(doc).commit()
    console.log(`${slug} -- already published, patched in place (${docId})`)
  }
}

console.log('\nDone.')
