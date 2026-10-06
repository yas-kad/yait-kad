import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { PERSONAL_INFO, PROJECTS } from '../src/data/portfolioData';

const dist = path.resolve('dist');
const shell = readFileSync(path.join(dist, 'index.html'), 'utf8');
const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function withMeta(html: string, title: string, description: string, url: string) {
  return html
    .replace(/<title>.*?<\/title>/, `<title>${escape(title)}</title>`)
    .replace(/(<meta (?:name="description"|property="og:description") content=")[^"]*/g, `$1${escape(description)}`)
    .replace(/(<meta property="og:title" content=")[^"]*/, `$1${escape(title)}`)
    .replace(/(<meta property="og:url" content=")[^"]*/, `$1${escape(url)}`);
}

// Real files for each client-side route, so static hosts serve them with a 200 status and no rewrite config.
for (const project of PROJECTS) {
  const dir = path.join(dist, 'work', project.id);
  mkdirSync(dir, { recursive: true });
  const html = withMeta(shell, `${project.title} — ${PERSONAL_INFO.name}`, project.description, `https://yait-kad.me/work/${project.id}/`);
  writeFileSync(path.join(dir, 'index.html'), html);
}
// Unknown paths on GitHub Pages fall back to 404.html, which renders the app's own not-found screen.
writeFileSync(path.join(dist, '404.html'), shell);
console.log(`Route pages: ${PROJECTS.map(project => `/work/${project.id}`).join(', ')}, /404.html`);
