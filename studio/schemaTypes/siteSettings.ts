import { defineField, defineType } from 'sanity'

const SOCIAL_PLATFORMS = ['facebook', 'instagram', 'youtube', 'linkedin']

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'logo', type: 'image', description: 'Primary logo (for dark backgrounds)' }),
    defineField({ name: 'logoInverse', type: 'image', description: 'Logo for light backgrounds' }),
    defineField({ name: 'officeAddress', type: 'text', rows: 3 }),
    defineField({
      name: 'showrooms',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'name', type: 'string' }),
            defineField({ name: 'addressLine', type: 'text', rows: 2 }),
            defineField({ name: 'city', type: 'string' }),
            defineField({ name: 'postalCode', type: 'string' }),
            defineField({ name: 'coordinates', type: 'geopoint' }),
            defineField({ name: 'landmarkNote', type: 'string' }),
            defineField({ name: 'hours', type: 'string' }),
            defineField({ name: 'photo', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'isPrimary', title: 'Primary showroom', type: 'boolean', initialValue: false }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'city' },
          },
        },
      ],
    }),
    defineField({
      name: 'phones',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string' }),
            defineField({ name: 'number', type: 'string' }),
            defineField({ name: 'hasViber', title: 'Viber-enabled', type: 'boolean', initialValue: false }),
            defineField({ name: 'hours', type: 'string' }),
          ],
          preview: {
            select: { title: 'number', subtitle: 'label' },
          },
        },
      ],
    }),
    defineField({ name: 'whatsappNumber', type: 'string', description: 'With country code, e.g. +639178333202' }),
    defineField({
      name: 'emails',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', description: 'e.g. "General Enquiries"' }),
            defineField({ name: 'address', type: 'string' }),
          ],
          preview: {
            select: { title: 'address', subtitle: 'label' },
          },
        },
      ],
    }),
    defineField({
      name: 'contactFormRecipient',
      type: 'string',
      initialValue: 'info@maxxglobalresources.com',
    }),
    defineField({
      name: 'serviceEmail',
      type: 'string',
      initialValue: 'service@maxxglobalresources.com',
    }),
    defineField({
      name: 'socialLinks',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'platform',
              type: 'string',
              options: { list: SOCIAL_PLATFORMS.map((p) => ({ title: p, value: p })) },
            }),
            defineField({ name: 'url', type: 'url' }),
            defineField({ name: 'label', type: 'string', description: 'Display label, e.g. @maxxglobal' }),
          ],
          preview: {
            select: { title: 'platform', subtitle: 'label' },
          },
        },
      ],
    }),
    defineField({ name: 'companyBrochure', type: 'file', options: { accept: '.pdf' } }),
    defineField({ name: 'defaultOgImage', type: 'image' }),
    defineField({
      name: 'stats',
      type: 'object',
      description: 'Authored numbers — not computed. Update manually.',
      fields: [
        defineField({ name: 'installationsCompleted', type: 'number' }),
        defineField({ name: 'provincesServed', type: 'number' }),
        defineField({ name: 'yearsOperating', type: 'number' }),
      ],
    }),
    defineField({ name: 'b2cSiteUrl', title: 'B2C Site URL', type: 'url' }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
