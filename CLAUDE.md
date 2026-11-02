## Development

A dev server usually runs in the background on http://localhost:4321. Check with
`astro dev status`; start it with `astro dev --background` if it isn't up.
Manage it with `astro dev stop`, `astro dev status`, and `astro dev logs`.

**Verify changes against the running dev server, not a production build.**
`curl -s http://localhost:4321/<path>` returns the rendered HTML in about a
second. A full `astro build` renders ~190 pages and takes 45-70s, so reach for
it only when you specifically need to test the production build or the built
output. Content edits in Sanity show up immediately in dev (`useCdn` is off
outside production).

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
