# Personal website: plan

Status: design pinned down on 2026-09-28. Phase 0 and phase 1 done (2026-09-29):
`presentations` repo at `~/projects/presentations`, first talk live at
`https://mavereecken.github.io/presentations/2026/gravigammanu/`. Phase 2 done: main site skeleton live at
`https://mavereecken.github.io/`. Interim (2026-10-06): the site shows only a media
page (name/position/affiliation + reusable media, §1 "Media page"); Research,
Publications and CV are hidden. Next: phase 3 (needs your content, see §3). The one-time
account/tooling setup is in [SETUP.md](SETUP.md).

---

## 1. Decisions

### Hosting & repos
| Topic | Decision |
|---|---|
| Host | GitHub Pages, free, deployed by GitHub Actions on push to `main` |
| Main site | repo `mavereecken.github.io` → `https://mavereecken.github.io/` |
| Custom domain | Not now. Can be added later without restructuring (SETUP.md §5) |
| Presentations | Separate repo `presentations` → `https://mavereecken.github.io/presentations/` |
| Stack | Astro + Svelte islands, TypeScript, npm, Node ≥ 22 |
| Language | English only |
| Analytics | GoatCounter (cookieless, no banner) |

### Presentations
| Topic | Decision |
|---|---|
| Layout | `presentations/<year>/<Name>/index.html` (e.g. `2026/Conference1/`) |
| Content | Existing self-contained talks dropped in as-is. Mixed tech: video, live JS, GIFs, CSS. No framework imposed |
| Authoring tooling | None. The repo is just a place to put talks |
| Shared media | Optional `presentations/media/`, referenced as `../../media/x.mp4`, so a clip is stored once and used by many talks |
| Video quality | Commit originals (currently a few MB each). No lossy re-encoding |
| Search engines | Never indexed. CI injects `<meta name="robots" content="noindex, nofollow">` into every `.html` at deploy time. Source files are untouched |
| Listing | No automatic index page at `/presentations/`, so unlisted talks are only reachable by direct link. Public talks get listed on the main site's Talks page (later) |
| Visibility caveat | The repo is public: "unlisted" means hard to find, not secret |

About robots.txt: we deliberately **don't** `Disallow: /presentations/` in
`robots.txt`. A crawler that is blocked never sees the `noindex` tag, and Google
may then still index the bare URL if someone links to it. The meta tag is the
reliable mechanism for HTML. Non-HTML files (mp4, pdf) can't carry the tag, and
Pages doesn't allow `X-Robots-Tag` headers. We accept that, since media files
are only found through the slides.

### Media page (interim home page)
| Topic | Decision |
|---|---|
| Files | This repo, one folder per item: `public/media/<id>/` with the file(s) and an `info.yaml` (format in `src/content.config.ts`). Served at `/media/<id>/<file>` |
| Why here | File and description in one commit/deploy; no cross-repo rebuild trigger. Talks can use the same files via `/media/<id>/<file>` (same domain) |
| Size | Counts toward this site's ~1 GB Pages limit. If it grows past a few hundred MB, move big files to external storage |
| Pages | `/media/` (stable URL) and, for now, also `/` |
| Licence | Site-wide default in `src/site.ts` (`MEDIA.license`), overridable per item |
| Hidden pages | `src/pages/_research.astro` etc.: the `_` prefix keeps them out of the build. Rename back and restore `NAV` to bring them back |

### Main site content
| Section | v1? | Source |
|---|---|---|
| Home | ✅ | Research-forward: hero media + one-line research statement → grid of research topics → short bio |
| Research / Projects | ✅ | Content collection `src/content/research/*.mdx`: figures, video, embedded Svelte demos |
| Publications | ✅ | Rendered from `publications.bib` at build time, grouped by year, own name highlighted, links (DOI/arXiv/PDF/code) |
| CV | ✅ | Short hand-written web summary + download of the PDF compiled from your LaTeX CV (`public/cv.pdf`) |
| Blog | later | `src/content/blog/`. Structure allowed for from day 1 |
| Talks | later | Data file of talks (date, venue, link to `/presentations/…`, recording). Only public ones appear |
| Teaching | later | Simple page/collection |

### Look & feel
- **Impression:** "curious & visual". Research visuals do the talking.
- **Layout:** option C. Top nav, full-width hero (looping animation/video,
  placeholder for now), then topic cards with thumbnails.
- **Type:** sans-serif, self-hosted (e.g. Inter / IBM Plex Sans via `@fontsource`, final pick in the mockup).
- **Colour:** near-monochrome plus one accent colour. Figures supply the colour.
- **Theme:** follows the system by default, with a manual toggle. No flash of the wrong theme on load.
- **Content features:** KaTeX math, syntax highlighting (Astro's built-in Shiki), interactive Svelte widgets in MDX.
- **Motion:** the hero and autoplay videos respect `prefers-reduced-motion` (show a still poster instead).

---

## 2. Phases

### Phase 0: Setup (you, ~30 min) → see SETUP.md
- [x] Upgrade Node to ≥ 22
- [x] Install `github-cli`, run `gh auth login`
- [x] Create public repos `mavereecken.github.io` and `presentations`
- [x] Set Pages source to "GitHub Actions" in both

### Phase 1: Presentations live (top priority, needed now)
- [x] Scaffold the `presentations` repo: `README.md` (how to add a talk), `.gitignore`, `media/`
- [x] Workflow `.github/workflows/deploy.yml`:
      checkout → small script adds the noindex meta to every `*.html` →
      `actions/upload-pages-artifact` → `actions/deploy-pages`
- [x] Add `.nojekyll`-equivalent behaviour (not needed with the Actions flow, but check that `_`-prefixed files are served)
- [x] Drop in the first existing talk, push, and check that it loads online and that videos play from the live URL
- [x] Check that relative paths work, especially links to `../../media/` and trailing-slash behaviour (`/2026/Conf1` vs `/2026/Conf1/`)
- [ ] Optional helper: `scripts/bundle-talk.sh 2026/Conf1` → zip containing the talk plus the shared media it references, rewritten to local paths, for USB/offline use

### Phase 2: Main site skeleton, deployed
- [x] `npm create astro@latest`, `astro add svelte mdx sitemap`, TypeScript strict
- [x] `astro.config.mjs`: `site`, math, Shiki themes (light + dark). Astro 7 uses the Sätteri
      Markdown processor, so math is its built-in `features.math` + a small KaTeX plugin
      (`src/lib/satteri-katex.mjs`) instead of remark-math + rehype-katex
- [x] Deploy workflow (`withastro/action`). The first push goes live
- [x] Base layout: nav, footer, theme toggle, font, CSS design tokens (colour, spacing, type scale)
- [x] Placeholder pages: Home, Research, Publications, CV, plus 404
- [x] Sitemap excludes nothing sensitive (the presentations repo isn't part of this build anyway)
- [x] GoatCounter snippet (off until a site code is set in `src/site.ts`)

### Phase 3: Content plumbing
- [ ] Content collections with schemas (`src/content.config.ts`): `research` (title, summary, thumbnail, heroMedia, order, draft), later `blog`, `talks`, `news`
- [ ] BibTeX → publications page: parse at build time (evaluate `@citation-js/core` vs a light BibTeX parser), custom fields for links (`url_pdf`, `url_code`, …), bold own name
- [ ] Media component: `<Figure>` / `<Video>` with poster, lazy loading, reduced-motion handling, and Astro's `<Image>` for responsive images
- [ ] A worked example research page with a figure, a video, an equation, and a small Svelte widget
- [ ] CV page: summary + "Download PDF" (you compile the LaTeX locally and copy it to `public/cv.pdf`)

### Phase 4: Design pass
- [ ] Mockup page with 2–3 accent colour options and 2 font options, light + dark, so you can pick
- [ ] Home hero: component that takes video, image, or Svelte animation, with a placeholder until you have one
- [ ] Research topic cards
- [ ] Responsive check (phone, laptop, projector-sized screen), accessibility check (contrast, focus, alt text)

### Phase 5: Later
- [ ] Talks page reading `src/data/talks.yaml` (entries with `listed: true`)
- [ ] Blog (+ RSS if wanted then)
- [ ] Teaching page
- [ ] Custom domain
- [ ] Move shared media into `presentations/media/` and point old talks at it
- [ ] If the presentations repo grows past ~1 GB: move big media to external storage

---

## 3. Inputs needed from you

Needed for phase 1:
- [x] GitHub username: `mavereecken`
- [x] One existing talk folder to test with (`2026/gravigammanu`)

Needed for phase 3:
- [ ] Name, position, affiliation, email, ORCID / Scholar / GitHub links
- [ ] Photo
- [ ] Short bio (2–3 paragraphs) and a one-line research statement
- [ ] List of research topics (3–5?) with a thumbnail figure each
- [ ] `.bib` file of your publications
- [ ] Compiled CV PDF + what to highlight in the web summary

Needed for phase 4:
- [ ] Hero media (later; placeholder is fine)
- [ ] Any sites you like or dislike (academic or not), for design reference

## 4. Open questions (small, decide when we get there)
- Should the Talks page link to recordings (YouTube etc.) as well as slides?
- Publications: group by year or by type (journal / conference / preprint)?
- Draft/preview mechanism for research pages (`draft: true` hidden in production)?
- Is a `/presentations/` landing page wanted at all, or should it 404?
