# mavereecken.github.io

Source of https://mavereecken.github.io/. Every push to `main` rebuilds and
publishes the site automatically (takes 1–2 minutes). Nothing goes live until
you push.

## Updating the site

All commands are run from this folder (`~/projects/personalwebsite`).

1. **Make your changes** (e.g. add or edit media, see below).

2. **Preview locally** (optional, recommended):

       npx astro dev --background

   Open http://localhost:4321. The page reloads by itself when you save a file.
   Stop the preview with `npx astro dev stop`.

   `astro` is installed inside this project, so always run it via `npx`
   (plain `astro` gives "command not found").

3. **Check for errors** (catches typos in `info.yaml`, missing fields, …):

       npx astro build

   It should end with `Complete!`. If it fails, the error says which file is wrong.

4. **Publish:**

       git add -A
       git commit -m "Short description of the change"
       git push

5. **Check the deploy:** on GitHub, the repo's *Actions* tab shows the run
   (or run `gh run watch`). When it's green, reload the site. If you still see
   the old version, force-reload with Ctrl+Shift+R.

## Adding a media item

Each item is one folder in `public/media/`:

    public/media/gw-sky-gwtc5-grid/
      gw-sky-gwtc5-grid.mp4
      poster.jpg            (optional)
      info.yaml

`info.yaml`:

```yaml
title: GW sky up to O4b (GWTC-5)
description: One or two sentences on what it shows.
file: gw-sky-gwtc5-grid.mp4          # file in this folder
poster: poster.jpg                   # optional: still shown before a video plays
date: 2026-10-06                     # items are sorted newest first
credit: Matthias Vereecken (animation), GWOSC (data)
license: { name: CC BY 4.0, url: https://creativecommons.org/licenses/by/4.0/ }
links:                               # optional
  - { label: Paper, href: https://arxiv.org/abs/0000.00000 }
```

- `title`, `description`, `file` and `date` are required. `credit` and
  `license` fall back to the defaults in `src/site.ts` if left out.
- Videos (`.mp4`, `.webm`, `.mov`, `.m4v`) get a player; anything else is shown
  as an image (`.png`, `.jpg`, `.webp`, `.gif`, `.svg`).
- The file is published at `https://mavereecken.github.io/media/<folder>/<file>`.
  **Don't rename the folder or file once it's live**: people may have linked to it.
- Keep files reasonably small: GitHub rejects files over 100 MB, and the whole
  site should stay well under 1 GB. Every committed version of a file stays in
  the git history.

## Other settings

- Name, position, affiliation, default licence: `src/site.ts`.
- Intro text above the media list: `src/components/Intro.astro`.
- Plans and design decisions: `PLAN.md`. One-time setup: `SETUP.md`.
