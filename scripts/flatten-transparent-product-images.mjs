// Finds product images with alpha transparency (cut-out product photos) and
// flattens them onto a white background, replacing the asset reference in place.
// Brand logos are intentionally left untouched (they're meant to work on
// light and dark sections, per the brand schema).
// Run with: node --env-file=.env scripts/flatten-transparent-product-images.mjs

import { createClient } from '@sanity/client'
import sharp from 'sharp'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN
if (!projectId || !dataset || !token) {
  console.error('Missing env vars. Run with: node --env-file=.env scripts/flatten-transparent-product-images.mjs')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2025-02-19', useCdn: false, perspective: 'raw' })

const products = await client.fetch(`
  *[_type == "product" && defined(images)]{
    _id,
    title,
    images[]{
      _key,
      "assetId": asset._ref,
      "hasAlpha": asset->metadata.hasAlpha,
      "url": asset->url
    }
  }
`)

let checked = 0
let fixed = 0
let errors = 0

for (const p of products) {
  for (const img of p.images || []) {
    checked++
    if (!img.hasAlpha) continue
    try {
      const res = await fetch(img.url)
      if (!res.ok) throw new Error(`download failed (${res.status})`)
      const buffer = Buffer.from(await res.arrayBuffer())
      const flattened = await sharp(buffer).flatten({ background: '#ffffff' }).jpeg({ quality: 90 }).toBuffer()
      const asset = await client.assets.upload('image', flattened, { filename: `${img.assetId}-white-bg.jpg` })
      await client
        .patch(p._id)
        .set({ [`images[_key=="${img._key}"].asset`]: { _type: 'reference', _ref: asset._id } })
        .commit()
      fixed++
      console.log(`fixed: "${p.title}" [${img._key}]`)
    } catch (err) {
      errors++
      console.log(`ERROR: "${p.title}" [${img._key}] -- ${err.message}`)
    }
  }
}

console.log(`\nChecked ${checked} images across ${products.length} products. Flattened ${fixed}, errors ${errors}.`)
