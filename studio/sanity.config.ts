import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

// Replace YOUR_PROJECT_ID with the project ID from https://sanity.io/manage
// Run `npm create sanity@latest -- --output-path . --reconfigure` in this directory
// if you want Sanity CLI to patch this file automatically.
const PROJECT_ID = 'w81o6o6b'
const DATASET = 'production'

export default defineConfig({
  name: 'maxx-global-b2b',
  title: 'Maxx Global B2B',
  projectId: PROJECT_ID,
  dataset: DATASET,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Catalog')
              .child(
                S.list()
                  .title('Catalog')
                  .items([
                    S.documentTypeListItem('product').title('Products'),
                    S.documentTypeListItem('brand').title('Brands'),
                    S.documentTypeListItem('category').title('Categories'),
                  ]),
              ),
            S.listItem()
              .title('Segments')
              .child(S.documentTypeList('segment').title('Segments')),
            S.listItem()
              .title('Projects')
              .child(S.documentTypeList('project').title('Projects')),
            S.listItem()
              .title('Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .title('Site Settings'),
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
