import { defineField, defineType } from 'sanity'

const AVAILABILITY_OPTIONS = [
  { title: 'Available — In showroom or local stock', value: 'available' },
  { title: 'Indent Order — Ordered from principal on request (default)', value: 'indent' },
  { title: 'Pre-Order — Incoming shipment, reservable', value: 'preorder' },
  { title: 'Discontinued — Kept live for SEO and reference', value: 'discontinued' },
]

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Full product name, e.g. "G690 Verde Treadmill"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'modelCode',
      title: 'Model Code',
      type: 'string',
      description: 'e.g. G690, IT9527, LE.QQ.114 — buyers search and reference by this',
    }),
    defineField({
      name: 'brand',
      type: 'reference',
      to: [{ type: 'brand' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'primaryCategory',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Drives breadcrumb and URL. Use the most specific sub-category.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'additionalCategories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      description: 'Optional — a cross-trainer can appear in both Cardio and Functional',
    }),
    defineField({
      name: 'shortDescription',
      type: 'string',
      description: 'Max 160 chars — shown on cards and used as meta description fallback',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Positioning and use case, 100–300 words. Not a spec dump.',
    }),
    defineField({
      name: 'images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              validation: (Rule) =>
                Rule.required().error('Alt text is required on every image'),
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.min(1).error('At least one image is required'),
    }),
    defineField({
      name: 'keyFeatures',
      title: 'Key Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: '3–6 bullets shown above the fold on the product page',
    }),
    defineField({
      name: 'specSheet',
      title: 'Spec Sheet (PDF)',
      type: 'file',
      description: 'Manufacturer datasheet. Name uploads: MAXX-{brand}-{modelCode}-spec.pdf',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'url',
      description: 'Optional YouTube embed URL',
    }),
    defineField({
      name: 'availability',
      type: 'string',
      options: { list: AVAILABILITY_OPTIONS, layout: 'radio' },
      initialValue: 'indent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'leadTimeNote',
      title: 'Lead Time Note',
      type: 'string',
      description: 'Shown when availability ≠ Available. e.g. "8–12 weeks from order confirmation"',
      hidden: ({ document }) =>
        (document as Record<string, unknown>)?.['availability'] === 'available',
    }),
    defineField({
      name: 'segments',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'segment' }] }],
      description: 'Which market segments this product suits',
    }),
    defineField({
      name: 'isEcoPowr',
      title: 'ECO-POWR Certified',
      type: 'boolean',
      description: 'SportsArt ECO-POWR energy-generating flag',
      initialValue: false,
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured',
      type: 'boolean',
      description: 'Show on homepage and brand page featured spots',
      initialValue: false,
    }),
    defineField({
      name: 'b2cUrl',
      title: 'B2C URL',
      type: 'url',
      description: 'Link to Shopify listing — lets small buyers self-serve',
    }),
    defineField({
      name: 'relatedProducts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({ name: 'displayOrder', type: 'number' }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', type: 'string' }),
        defineField({
          name: 'metaDescription',
          type: 'string',
          validation: (Rule) => Rule.max(160),
        }),
        defineField({ name: 'ogImage', type: 'image' }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      modelCode: 'modelCode',
      media: 'images.0',
      availability: 'availability',
    },
    prepare({ title, modelCode, media, availability }) {
      const icon: Record<string, string> = {
        available: '✓',
        indent: '○',
        preorder: '◎',
        discontinued: '✕',
      }
      const prefix = icon[availability as string] ?? ''
      return { title: `${prefix} ${title}`, subtitle: modelCode, media }
    },
  },
})
