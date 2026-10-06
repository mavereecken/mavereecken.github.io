// Site-wide settings. Edit here rather than in individual pages.

export const SITE = {
  author: 'Matthias Vereecken',
  title: 'Matthias Vereecken',
  // Shown under the name on the home page. Empty = line hidden.
  position: 'Postdoctoral researcher (FWO fellow)',
  affiliation: 'Ghent University',
  description: 'Graphics, animations and videos by Matthias Vereecken, free to reuse.',
  // GoatCounter site code (the `xyz` in https://xyz.goatcounter.com). Empty = analytics off.
  goatcounter: '',
};

// Reusable media live in public/media/<id>/; see src/content.config.ts.
export const MEDIA = {
  // Default licence for every item; an item can override it with `license:`.
  license: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
};

// Empty for now: the site is only the media page. Re-enable entries (and rename
// the `_`-prefixed pages in src/pages back) to bring the other sections back.
export const NAV: { href: string; label: string }[] = [
  // { href: '/research/', label: 'Research' },
  // { href: '/publications/', label: 'Publications' },
  // { href: '/cv/', label: 'CV' },
];
