// One-off/sample importer: pulls product data from the public maxxhomefitness.com
// Shopify storefront feed and creates draft `product` documents in Sanity, uploading
// each product's images as real assets. Run with:
//   node --env-file=.env scripts/import-shopify-products.mjs
//
// Category/brand mapping comes from the reviewed import manifest, not auto-detection —
// add entries to SAMPLE_PRODUCTS below to import more.

import { createClient } from '@sanity/client'
import crypto from 'node:crypto'

const SHOPIFY_BASE = 'https://maxxhomefitness.com'
const MAX_IMAGES_PER_PRODUCT = 8

const SAMPLE_PRODUCTS = [
  { handle: 'force-usa-pro-series-fid-bench', brandSlug: 'force-usa', categorySlug: 'benches' },
  { handle: 'force-usa-g12-all-in-one-trainer', brandSlug: 'force-usa', categorySlug: 'multi-station-gym' },
  {
    handle: 'housefit-smart-420-under-desk-treadmill-with-bluetooth-app-for-walking-and-running-mode-2-in-1',
    brandSlug: 'housefit',
    categorySlug: 'treadmills',
  },
  { handle: 'spirit-fitness-cic850-commercial-indoor-cycling-bike', brandSlug: 'spirit-fitness', categorySlug: 'exercise-bikes' },
  { handle: 'ironbull-fitness-100927-yoga-mat-blue-non-slip', brandSlug: 'ironbull-fitness', categorySlug: 'flooring' },
]

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_TOKEN

if (!projectId || !dataset || !token) {
  console.error('Missing SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET, or SANITY_API_TOKEN. Run with: node --env-file=.env scripts/import-shopify-products.mjs')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-02-19',
  useCdn: false,
})

const ENTITY_MAP = {
  amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", apos: "'",
  nbsp: ' ', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
  ndash: '–', mdash: '—', hellip: '…',
}

function decodeEntities(str) {
  return str.replace(/&(#\d+|[a-zA-Z]+);/g, (m, code) => {
    if (code.startsWith('#')) return String.fromCharCode(Number(code.slice(1)))
    return ENTITY_MAP[code] ?? m
  })
}

function htmlToParagraphs(html) {
  if (!html) return []
  const text = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|li|div|h[1-6])>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')
  return decodeEntities(text)
    .split(/\n+/)
    .map((s) => s.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

function toShortDescription(paragraphs) {
  const first = paragraphs.find((p) => !p.startsWith('•') && !/^[A-Z\s:]+$/.test(p))
  if (!first) return undefined
  if (first.length <= 160) return first
  return first.slice(0, 157).replace(/\s+\S*$/, '') + '…'
}

function toKeyFeatures(paragraphs) {
  return paragraphs
    .filter((p) => p.startsWith('• '))
    .map((p) => p.slice(2).trim())
    .filter(Boolean)
    .slice(0, 6)
}

function toDescriptionBlocks(paragraphs) {
  return paragraphs
    .filter((p) => !p.startsWith('•') && !/^[A-Z\s:]+$/.test(p))
    .slice(0, 6)
    .map((text) => ({
      _type: 'block',
      _key: crypto.randomUUID(),
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: crypto.randomUUID(), text, marks: [] }],
    }))
}

async function findDocId(type, slug) {
  const id = await client.fetch(`*[_type == $type && slug.current == $slug][0]._id`, { type, slug })
  return id ?? null
}

async function productExists(slug) {
  const id = await client.fetch(`*[_type == "product" && slug.current == $slug][0]._id`, { slug })
  return id ?? null
}

async function uploadImage(url, filename) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`)
  const buffer = Buffer.from(await res.arrayBuffer())
  return client.assets.upload('image', buffer, { filename })
}

async function importProduct({ handle, brandSlug, categorySlug }) {
  console.log(`\n--- ${handle} ---`)

  const existingId = await productExists(handle)
  if (existingId) {
    console.log(`  skip: product with slug "${handle}" already exists (${existingId})`)
    return
  }

  const brandId = await findDocId('brand', brandSlug)
  if (!brandId) throw new Error(`Brand not found for slug "${brandSlug}"`)
  const categoryId = await findDocId('category', categorySlug)
  if (!categoryId) throw new Error(`Category not found for slug "${categorySlug}"`)

  const res = await fetch(`${SHOPIFY_BASE}/products/${handle}.js`)
  if (!res.ok) throw new Error(`Failed to fetch Shopify product "${handle}": ${res.status}`)
  const shopify = await res.json()

  const paragraphs = htmlToParagraphs(shopify.description)
  const shortDescription = toShortDescription(paragraphs)
  const keyFeatures = toKeyFeatures(paragraphs)
  const description = toDescriptionBlocks(paragraphs)

  const imageUrls = shopify.images.slice(0, MAX_IMAGES_PER_PRODUCT).map((src) => (src.startsWith('//') ? `https:${src}` : src))
  console.log(`  uploading ${imageUrls.length}/${shopify.images.length} image(s)...`)
  const images = []
  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i]
    const filename = url.split('/').pop().split('?')[0]
    const asset = await uploadImage(url, filename)
    images.push({
      _type: 'image',
      _key: crypto.randomUUID(),
      asset: { _type: 'reference', _ref: asset._id },
      alt: `${shopify.title} — view ${i + 1}`,
    })
    console.log(`    uploaded ${filename}`)
  }

  const doc = {
    _id: `drafts.${crypto.randomUUID()}`,
    _type: 'product',
    title: shopify.title,
    slug: { _type: 'slug', current: handle },
    modelCode: shopify.variants?.[0]?.sku || undefined,
    brand: { _type: 'reference', _ref: brandId },
    primaryCategory: { _type: 'reference', _ref: categoryId },
    shortDescription,
    description,
    images,
    keyFeatures: keyFeatures.length ? keyFeatures : undefined,
    availability: 'indent',
    b2cUrl: `${SHOPIFY_BASE}${shopify.url}`,
    isFeatured: false,
  }

  const created = await client.create(doc)
  console.log(`  created draft product: ${created._id} (${created.title})`)
}

for (const entry of SAMPLE_PRODUCTS) {
  await importProduct(entry)
}

console.log('\nDone.')
