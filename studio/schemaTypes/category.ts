import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
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
      name: 'parent',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Leave blank for top-level categories. Two levels maximum — do not nest deeper.',
    }),
    defineField({ name: 'description', type: 'array', of: [{ type: 'block' }] }),
    defineField({
      name: 'image',
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
    defineField({ name: 'displayOrder', type: 'number' }),
  ],
  preview: {
    select: {
      title: 'title',
      parentTitle: 'parent.title',
      media: 'image',
    },
    prepare({ title, parentTitle, media }) {
      return {
        title,
        subtitle: parentTitle ? `↳ ${parentTitle}` : 'Top level',
        media,
      }
    },
  },
})
