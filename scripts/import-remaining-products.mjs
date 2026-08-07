// Bulk importer: creates + PUBLISHES `product` documents (no draft step) for every
// product in the reviewed import manifest that hasn't already been imported.
// Run with: node --env-file=.env scripts/import-remaining-products.mjs
//
// - No modelCode is set (dropped per catalog decision).
// - availability is 'available' when Shopify reports in-stock, otherwise 'indent'.
// - Images are uploaded uncapped (all images in the Shopify feed).
// - 4 products with no manifest category match get a manual override below.

import { createClient } from '@sanity/client'
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { htmlToParagraphs, toShortDescription, toKeyFeatures, toDescriptionBlocks } from './lib/shopify-html.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SHOPIFY_BASE = 'https://maxxhomefitness.com'

const CATEGORY_OVERRIDES = {
  'impulse-it7004-stretch': 'strength',
  'sportsart-c510-gym-bike-gold-console': 'other-accessories',
  'inotec-fitness-nl10-arm-curl-natural-line-selectorized-machine': 'strength',
  'inotec-fitness-nl6-seated-leg-curl-natural-line-selectorized-machine': 'strength',
}

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/shopify-import-manifest.json'), 'utf8'))

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN
if (!projectId || !dataset || !token) {
  console.error('Missing SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, or SANITY_API_TOKEN. Run with: node --env-file=.env scripts/import-remaining-products.mjs')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2025-02-19', useCdn: false, perspective: 'raw' })

const brandIdCache = new Map()
const categoryIdCache = new Map()

async function findDocId(type, slug, cache) {
  if (cache.has(slug)) return cache.get(slug)
  const id = await client.fetch(`*[_type == $type && slug.current == $slug][0]._id`, { type, slug })
  cache.set(slug, id ?? null)
  return id ?? null
}

async function productExists(slug) {
  const id = await client.fetch(`*[_type == "product" && slug.current == $slug][0]._id`, { slug })
  return id ?? null
}

async function uploadImage(url, filename) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`image download failed (${res.status}): ${url}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  return client.assets.upload('image', buffer, { filename })
}

async function importProduct(row, index, total) {
  const { handle, brandSlug, vendor } = row
  const categorySlug = row.categorySlug || CATEGORY_OVERRIDES[handle]
  const prefix = `[${index + 1}/${total}] ${handle}`

  if (!categorySlug) {
    console.log(`${prefix} -- SKIP: no category mapping`)
    return { status: 'skipped', reason: 'no category' }
  }

  const existingId = await productExists(handle)
  if (existingId) {
    console.log(`${prefix} -- skip: already exists (${existingId})`)
    return { status: 'skipped', reason: 'exists' }
  }

  const brandId = await findDocId('brand', brandSlug, brandIdCache)
  if (!brandId) {
    console.log(`${prefix} -- SKIP: brand not found for slug "${brandSlug}" (vendor "${vendor}")`)
    return { status: 'skipped', reason: 'no brand' }
  }
  const categoryId = await findDocId('category', categorySlug, categoryIdCache)
  if (!categoryId) {
    console.log(`${prefix} -- SKIP: category not found for slug "${categorySlug}"`)
    return { status: 'skipped', reason: 'no category doc' }
  }

  const res = await fetch(`${SHOPIFY_BASE}/products/${handle}.js`)
  if (!res.ok) {
    console.log(`${prefix} -- SKIP: Shopify fetch failed (${res.status})`)
    return { status: 'skipped', reason: 'shopify fetch failed' }
  }
  const shopify = await res.json()

  const paragraphs = htmlToParagraphs(shopify.description)
  const shortDescription = toShortDescription(paragraphs)
  const keyFeatures = toKeyFeatures(paragraphs)
  const description = toDescriptionBlocks(paragraphs)

  const imageUrls = shopify.images.map((src) => (src.startsWith('//') ? `https:${src}` : src))
  const images = []
  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i]
    const filename = url.split('/').pop().split('?')[0]
    try {
      const asset = await uploadImage(url, filename)
      images.push({
        _type: 'image',
        _key: crypto.randomUUID(),
        asset: { _type: 'reference', _ref: asset._id },
        alt: `${shopify.title} — view ${i + 1}`,
      })
    } catch (err) {
      console.log(`${prefix} -- image upload failed (${filename}): ${err.message}`)
    }
  }

  if (images.length === 0) {
    console.log(`${prefix} -- SKIP: no images uploaded successfully (schema requires >=1)`)
    return { status: 'skipped', reason: 'no images' }
  }

  const doc = {
    _type: 'product',
    title: shopify.title,
    slug: { _type: 'slug', current: handle },
    brand: { _type: 'reference', _ref: brandId },
    primaryCategory: { _type: 'reference', _ref: categoryId },
    shortDescription,
    description,
    images,
    keyFeatures: keyFeatures.length ? keyFeatures : undefined,
    availability: shopify.available ? 'available' : 'indent',
    b2cUrl: `${SHOPIFY_BASE}${shopify.url}`,
    isFeatured: false,
  }

  const created = await client.create(doc)
  console.log(`${prefix} -- published: ${created._id} (${images.length} images, ${doc.availability})`)
  return { status: 'created', id: created._id }
}

const results = { created: 0, skipped: 0, errors: 0 }
for (let i = 0; i < manifest.length; i++) {
  try {
    const r = await importProduct(manifest[i], i, manifest.length)
    if (r.status === 'created') results.created++
    else results.skipped++
  } catch (err) {
    results.errors++
    console.log(`[${i + 1}/${manifest.length}] ${manifest[i].handle} -- ERROR: ${err.message}`)
  }
}

console.log('\n--- Summary ---')
console.log(results)
