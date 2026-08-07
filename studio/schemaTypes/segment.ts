import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'segment',
  title: 'Segment',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroImage',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          validation: (Rule) => Rule.required().error('Alt text is required'),
        }),
      ],
    }),
    defineField({
      name: 'intro',
      type: 'array',
      of: [{ type: 'block' }],
      description: "Speak to their actual problem: guest expectations, space constraints, budget cycles",
    }),
    defineField({
      name: 'considerations',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. "Limited floor area", "Low-maintenance requirement", "Guest-safety compliance"',
    }),
    defineField({
      name: 'recommendedCategories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    }),
    defineField({
      name: 'featuredProducts',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      validation: (Rule) => Rule.max(8),
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Text',
      type: 'string',
      description: 'e.g. "Request a facility layout consultation"',
    }),
    defineField({ name: 'displayOrder', type: 'number' }),
  ],
  preview: {
    select: { title: 'title', media: 'heroImage' },
  },
})
