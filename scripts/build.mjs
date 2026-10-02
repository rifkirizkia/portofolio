import { cp, mkdir, rm, readFile, writeFile, readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import { minify } from 'terser';

const require = createRequire(import.meta.url);
const renderCard = require('../js/project-card.js');
const context = vm.createContext({ window: {} });
vm.runInContext(await readFile('js/projects-data.js', 'utf8'), context);
const projects = context.window.PROJECTS_DATA;
if (!projects?.length) throw new Error('Project data is missing');
const source = await readFile('index.html', 'utf8');
const marker = '<!-- prerender:projects -->';
if (!source.includes(marker)) throw new Error('Project prerender marker is missing');

await rm('dist', { recursive: true, force: true });
await mkdir('dist/styles', { recursive: true });
await mkdir('dist/js', { recursive: true });

// Prerender default view projects (Mobile and Web) for initial static HTML.
const defaultProjects = projects.filter(p => p.category === 'mobile' || p.category === 'web');
let html = source.replace(marker, defaultProjects.map((project, i) => renderCard(project, i)).join(''));

// Dynamic asset versioning for cache busting on each build/deploy
const buildVersion = Date.now().toString(36);
html = html.replace(/(href|src)="((?:\/styles\/|js\/)[^"?#]+)(?:\?v=[^"']*)?"/g, `$1="$2?v=${buildVersion}"`);

await writeFile('dist/index.html', html);
await cp('styles/remixicon', 'dist/styles/remixicon', { recursive: true });

// Minify application JavaScript files
const jsFiles = await readdir('js');
for (const file of jsFiles) {
  if (file.endsWith('.js')) {
    const raw = await readFile(`js/${file}`, 'utf8');
    if (file === 'aos.js') {
      await writeFile(`dist/js/${file}`, raw);
    } else {
      const minResult = await minify(raw, { compress: true, mangle: true });
      await writeFile(`dist/js/${file}`, minResult.code);
    }
  }
}

for (const path of ['asset', 'robots.txt', 'sitemap.xml', 'llms.txt']) {
  await cp(path, `dist/${path}`, { recursive: true });
}
console.log(`Static HTML built with ${defaultProjects.length} project cards and minified JS.`);
