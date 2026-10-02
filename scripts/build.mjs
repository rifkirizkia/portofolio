import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const renderCard = require('../js/project-card.js');
const context = vm.createContext({ window: {} });
vm.runInContext(await readFile('js/projects-data.js', 'utf8'), context);
const projects = context.window.PROJECTS_DATA;
if (!projects?.length) throw new Error('Project data is missing');
const source = await readFile('index.html', 'utf8');
const marker = '<!-- prerender:projects -->';
if (!source.includes(marker)) throw new Error('Project prerender marker is missing');
// Prerender default view projects (Mobile and Web) for initial static HTML.
const defaultProjects = projects.filter(p => p.category === 'mobile' || p.category === 'web');
const html = source.replace(marker, defaultProjects.map((project, i) => renderCard(project, i)).join(''));
await mkdir('dist/styles', { recursive: true });
await writeFile('dist/index.html', html);
await cp('styles/remixicon', 'dist/styles/remixicon', { recursive: true });
for (const path of ['js', 'asset', 'robots.txt', 'sitemap.xml', 'llms.txt']) {
  await cp(path, `dist/${path}`, { recursive: true });
}
console.log(`Static HTML built with ${defaultProjects.length} project cards.`);
