import { defineField, defineType } from 'sanity'

const DISPLAY_AS_OPTIONS = [
  { title: 'Full — show client name and photos', value: 'full' },
  { title: 'Anonymised — use the anonymised label below', value: 'anonymised' },
  { title: 'Hidden — internal reference only, never shown on site', value: 'hidden' },
]

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Internal title, e.g. "BGC Corporate Gym 2023"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'clientName', type: 'string', description: 'Actual client name (internal use)' }),
    defineField({
      name: 'displayAs',
      type: 'string',
      options: { list: DISPLAY_AS_OPTIONS, layout: 'radio' },
      initialValue: 'anonymised',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'anonymisedLabel',
      type: 'string',
      description: 'What to show publicly, e.g. "A five-star hotel in Makati"',
      hidden: ({ document }) =>
        (document as Record<string, unknown>)?.['displayAs'] !== 'anonymised',
    }),
    defineField({
      name: 'permissionOnFile',
      title: 'Written Permission on File',
      type: 'boolean',
      description: 'PUBLISHING GATE — written client permission received before using name or photos',
      initialValue: false,
    }),
    defineField({
      name: 'location',
      type: 'string',
      description: 'e.g. "Bonifacio Global City, Taguig"',
    }),
    defineField({
      name: 'coordinates',
      type: 'geopoint',
      description: 'Required — powers the Philippine installation map',
    }),
    defineField({ name: 'year', type: 'number' }),
    defineField({ name: 'segment', type: 'reference', to: [{ type: 'segment' }] }),
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
              validation: (Rule) => Rule.required().error('Alt text is required'),
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 3,
      description: '2–3 sentences about the project',
    }),
    defineField({
      name: 'brandsUsed',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'brand' }] }],
    }),
    defineField({
      name: 'equipmentSupplied',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'Optional — specific products installed',
    }),
    defineField({ name: 'isFeatured', title: 'Featured', type: 'boolean', initialValue: false }),
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      location: 'location',
      media: 'images.0',
    },
    prepare({ title, year, location, media }) {
      const parts = [year, location].filter(Boolean)
      return { title, subtitle: parts.join(' · '), media }
    },
  },
})
