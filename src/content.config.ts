import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const link = z.object({ label: z.string(), href: z.url() });

// Reusable media: one folder per item, public/media/<id>/, holding the file(s)
// and an info.yaml. Served at /media/<id>/<file>. Listed on / and /media/,
// newest first. The folder name is the item's id (and its #anchor on the page),
// so keep it stable: other people may link to the files.
//
// info.yaml:
//   title: Binary black hole merger
//   description: Simulated inspiral and merger, 1080p, 12 s loop.
//   file: binary-merger.mp4          # in the same folder
//   poster: poster.jpg               # optional, for videos
//   date: 2026-09-01
//   credit: ...                      # optional, default SITE.author
//   license: { name: CC0, url: https://creativecommons.org/publicdomain/zero/1.0/ }  # optional, default MEDIA.license
//   links:                           # optional
//     - { label: Paper, href: https://arxiv.org/abs/0000.00000 }
const media = defineCollection({
  loader: glob({
    pattern: '*/info.yaml',
    base: './public/media',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    file: z.string(),
    poster: z.string().optional(),
    date: z.coerce.date(),
    credit: z.string().optional(),
    license: z.object({ name: z.string(), url: z.url() }).optional(),
    links: z.array(link).default([]),
  }),
});

export const collections = { media };
