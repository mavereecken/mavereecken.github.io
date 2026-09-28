# Setup: Astro site on GitHub Pages

Setup that has to happen once to get from an empty folder to a live site at
`https://mavereecken.github.io`. Steps marked **(you)** need your GitHub account
or `sudo`. The rest we can do together in the repo.

---

## 0. How it fits together

```
 your laptop                         GitHub
 ───────────                         ──────
 src/  (Astro + Svelte)   git push   repo mavereecken.github.io
 public/talks/...  ───────────────▶    │
                                       ▼  GitHub Actions (on every push to main)
                                     npm ci && astro build  →  dist/
                                       │
                                       ▼  deploy-pages
                                     https://mavereecken.github.io
```

- **Astro** turns `src/` (pages, Markdown, Svelte components) into plain static
  HTML/CSS/JS in `dist/`.
- **Anything in `public/`** is copied to `dist/` byte-for-byte. That's how
  self-contained presentations get published: `public/talks/2026-foo/index.html`
  becomes `https://mavereecken.github.io/talks/2026-foo/`.
- **GitHub Pages** only serves static files. There's no server code or database,
  and that's fine for everything you've described.
- **GitHub Actions** runs the build on GitHub's machines on every push, so
  publishing is just `git push`.

---

## 1. Local prerequisites (you)

### 1a. Node.js 22+ (you currently have 20, which is too old)

Either system-wide on Arch:

```sh
sudo pacman -S nodejs npm        # current Node; replaces nodejs-lts-* if installed
node --version                   # want v22.x or newer
```

Or per-user with a version manager (useful if other projects need Node 20):

```sh
sudo pacman -S fnm
echo 'eval "$(fnm env --use-on-cd)"' >> ~/.zshrc && exec zsh
fnm install 24 && fnm default 24
```

### 1b. GitHub CLI (optional, but it saves clicking around)

```sh
sudo pacman -S github-cli
gh auth login        # choose: GitHub.com → HTTPS → login with browser
```

This also sets up git to push over HTTPS, so you don't need SSH keys.

### 1c. Git identity (skip if already set)

```sh
git config --global user.name  "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main
```

---

## 2. Create the repository (you)

**The name matters.** GitHub Pages has two kinds of sites:

| Repo name              | URL                                        | Notes                                    |
|------------------------|--------------------------------------------|------------------------------------------|
| `mavereecken.github.io` | `https://mavereecken.github.io/`            | **User site.** One per account. Recommended for the main site. |
| anything else, e.g. `talks` | `https://mavereecken.github.io/talks/` | **Project site.** Unlimited. Astro needs `base: '/talks'`. |

For the main site, create a **public** repo named exactly
`mavereecken.github.io`, with no README, license, or .gitignore (we'll add
those locally):

```sh
gh repo create mavereecken.github.io --public
```

or use https://github.com/new.

> Pages on private repos requires a paid plan. A public repo means your source,
> including talk slides, is readable on GitHub. "Unlisted" talks are hard to
> find, not secret.

Then create the second repo for the slides, also public:

```sh
gh repo create presentations --public
```

Because it's a project repo under the same account, GitHub serves it at
`https://mavereecken.github.io/presentations/`, on the same domain as the main
site. Folders map directly to URLs:

```
presentations/                        (repo root)
├── media/shared-clip.mp4          →  …/presentations/media/shared-clip.mp4
└── 2026/Conference1/index.html    →  …/presentations/2026/Conference1/
```

---

## 3. Turn on Pages via Actions (you, once)

In **both** repos: Settings → Pages → Build and deployment → **Source: "GitHub Actions"**.

This is the only setting you need. Don't use "Deploy from a branch", which is the
old Jekyll flow. The `presentations` repo also gets a small workflow (in
PLAN.md, phase 1). It publishes the files as-is and automatically adds a
`noindex` tag to every HTML page.

---

## 4. The project side (we'll do this together)

1. Scaffold Astro in this folder and add the Svelte integration:
   ```sh
   npm create astro@latest .
   npx astro add svelte
   ```
2. In `astro.config.mjs`, set
   `site: 'https://mavereecken.github.io'` (and `base` only for a project site).
3. Add `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages
   on:
     push:
       branches: [main]
     workflow_dispatch:          # adds a manual "Run workflow" button
   permissions:
     contents: read
     pages: write
     id-token: write
   concurrency:
     group: pages
     cancel-in-progress: false
   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v5
         - uses: withastro/action@v5   # installs deps, builds, uploads dist/
     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - id: deployment
           uses: actions/deploy-pages@v4
   ```
   (Before committing we'll check the action versions against Astro's current
   deploy guide.)
4. Connect and push:
   ```sh
   git init
   git remote add origin https://github.com/mavereecken/mavereecken.github.io.git
   git add -A && git commit -m "Initial site"
   git push -u origin main
   ```
5. Watch the **Actions** tab. When the run is green (about 1 minute), the site is live.

Day-to-day workflow after that:

```sh
npm run dev        # live preview at http://localhost:4321
git commit -am "..." && git push   # publish
```

---

## 5. Optional: custom domain (you)

If you get a domain such as `yourname.be`:

1. Add a file `public/CNAME` containing just `yourname.be`.
2. At your DNS provider, add `A` records for the apex pointing to GitHub's Pages
   IPs (185.199.108–111.153) and/or a `CNAME` for `www` → `mavereecken.github.io`.
3. Repo → Settings → Pages → Custom domain → enter it and tick **Enforce HTTPS**.
4. Change `site:` in `astro.config.mjs`.

You can do this at any point later. Links to `mavereecken.github.io` will redirect.

---

## 6. GitHub Pages limits that affect presentations

Figures and videos make these limits matter:

| Limit                                | Value                         | Consequence |
|--------------------------------------|-------------------------------|-------------|
| Single file in git                   | warn at 50 MB, **reject > 100 MB** | Compress videos (H.264/AV1, sized for slides) |
| Published site size                  | 1 GB (soft)                   | Plenty for compressed talks, not for raw footage |
| Bandwidth                            | ~100 GB/month (soft)          | Fine for an academic site |
| Git history                          | **forever**                   | Every version of every video you commit stays in the repo. This limit bites first. |

Ways to deal with media (a question below):
- commit compressed media directly (simplest, fine for dozens of talks),
- keep talks in a **separate repo** so the main site's history stays small,
- Git LFS (small free quota, and it complicates things),
- put large videos on external storage (e.g. Cloudflare R2, YouTube/Vimeo embed).

Reference: https://docs.astro.build/en/guides/deploy/github/
