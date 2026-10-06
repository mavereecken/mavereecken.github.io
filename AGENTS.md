## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## This project

Personal academic site, deployed to https://mavereecken.github.io by
`.github/workflows/deploy.yml` on every push to `main`. See `PLAN.md` for
decisions and phases, `SETUP.md` for the one-time setup.

- Site-wide settings (name, nav, GoatCounter code): `src/site.ts`.
- Design tokens and dark mode: `src/styles/global.css`.
- Reusable media: `public/media/<id>/` (files + `info.yaml`), collection `media`
  in `src/content.config.ts`. For now the site is only this media page; the other
  pages are hidden by a `_` prefix in `src/pages/` and an empty `NAV`.
- Markdown uses Astro 7's default Sätteri processor, not remark/rehype.
  Math is Sätteri's `features.math` plus `src/lib/satteri-katex.mjs`;
  `remark-math`/`rehype-katex` would need the unified processor and aren't used.
- Talks live in a separate repo (`~/projects/presentations`), served at `/presentations/`.
  Never add a `src/pages/presentations/` route: it would collide with that URL space.
