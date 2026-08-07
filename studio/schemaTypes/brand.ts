import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'brand',
  title: 'Brand',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      type: 'image',
      description: 'Light-background version (transparent PNG/SVG)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'logoInverse', type: 'image', description: 'For use on dark sections' }),
    defineField({ name: 'tagline', type: 'string' }),
    defineField({ name: 'originCountry', type: 'string' }),
    defineField({ name: 'originCity', type: 'string' }),
    defineField({
      name: 'coordinates',
      type: 'geopoint',
      description: 'Powers the homepage supplier map',
    }),
    defineField({
      name: 'secondaryOrigin',
      title: 'Secondary Origin',
      type: 'object',
      description: 'Optional — e.g. SportsArt has USA HQ and Taiwan manufacturing',
      fields: [
        defineField({ name: 'label', type: 'string', description: 'e.g. "R&D HQ"' }),
        defineField({ name: 'city', type: 'string' }),
        defineField({ name: 'country', type: 'string' }),
        defineField({ name: 'coordinates', type: 'geopoint' }),
      ],
    }),
    defineField({ name: 'description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'heroImage', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'website', type: 'url' }),
    defineField({ name: 'isFeatured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'displayOrder', type: 'number' }),
  ],
  preview: {
    select: { title: 'name', media: 'logo' },
  },
})
