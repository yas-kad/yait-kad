import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import App from '../src/App';
import { PROJECTS } from '../src/data/portfolioData';
import { pageMeta, SITE_URL } from '../src/seo';

const dist = path.resolve('dist');
const shell = readFileSync(path.join(dist, 'index.html'), 'utf8');
const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const routes = ['/', '/projects/', ...PROJECTS.map(project => `/work/${project.id}/`)];

function page(route: string) {
  const meta = pageMeta(route)!;
  const url = `${SITE_URL}${meta.path}`, image = `${SITE_URL}${meta.image}`;
  const jsonLd = meta.jsonLd.map(data => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`).join('\n    ');
  return shell
    .replace(/<title>.*?<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*/g, `$1${escape(meta.description)}`)
    .replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*/g, `$1${escape(meta.title)}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${url}`)
    .replace(/(<link rel="canonical" href=")[^"]*/, `$1${url}`)
    .replace(/(<meta (?:property="og:image"|name="twitter:image") content=")[^"]*/g, `$1${image}`)
    .replace(/(<meta property="og:type" content=")[^"]*/, `$1${route === '/' ? 'profile' : 'article'}`)
    .replace('</head>', `  ${jsonLd}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${renderToString(createElement(App, { initialPath: route }))}</div>`);
}

// Real, prerendered files for each route, so crawlers get full content and static hosts serve a 200 with no rewrite config.
for (const route of routes) {
  const dir = path.join(dist, route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(path.join(dir, 'index.html'), page(route));
}
// Unknown paths on GitHub Pages fall back to 404.html, which client-renders the app's own not-found screen.
writeFileSync(path.join(dist, '404.html'), shell.replace(/<link rel="canonical"[^>]*>\n\s*/, '').replace('</head>', '  <meta name="robots" content="noindex" />\n  </head>'));
const lastmod = new Date().toISOString().slice(0, 10);
writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url><loc>${SITE_URL}${route}</loc><lastmod>${lastmod}</lastmod></url>`).join('\n')}
</urlset>
`);
console.log(`Prerendered: ${routes.join(', ')} + 404.html, sitemap.xml`);
