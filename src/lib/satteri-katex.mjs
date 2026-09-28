// Render `$…$` / `$$…$$` math (parsed by Sätteri's `features.math`) with KaTeX at build time.
// The page still needs `katex/dist/katex.min.css`; BaseLayout loads it.
import katex from 'katex';
import { defineMdastPlugin } from 'satteri';

// Plain Markdown takes an `html` node as-is. MDX can't hold raw HTML, so there the
// HTML is parsed into JSX; `mdxExpressions: false` keeps KaTeX's `{…}` literal.
// (A `raw` node in plain Markdown would be re-parsed and wrapped in an extra <p>.)
const render = (tex, displayMode, ctx) => {
  const html = katex.renderToString(tex, { displayMode, throwOnError: false, output: 'htmlAndMathml' });
  return ctx.sourceFormat === 'mdx' ? { raw: html, mdxExpressions: false } : { type: 'html', value: html };
};

export const katexPlugin = defineMdastPlugin({
  name: 'katex',
  math: (node, ctx) => render(node.value, true, ctx),
  inlineMath: (node, ctx) => render(node.value, false, ctx),
});
