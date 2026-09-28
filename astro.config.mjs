// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';

import svelte from '@astrojs/svelte';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import { katexPlugin } from './src/lib/satteri-katex.mjs';

// https://astro.build/config
export default defineConfig({
  site: 'https://mavereecken.github.io',
  integrations: [svelte(), mdx(), sitemap()],
  markdown: {
    processor: satteri({
      features: { math: true },
      mdastPlugins: [katexPlugin],
    }),
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
});
