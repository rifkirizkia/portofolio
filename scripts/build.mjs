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
// All projects are available without JavaScript. The existing UI enhances this
// into the same six-card view with category filters and case-study modals.
const html = source.replace(marker, projects.map((project, i) => renderCard(project, i)).join(''));
await mkdir('dist/styles', { recursive: true });
await writeFile('dist/index.html', html);
for (const path of ['js', 'asset', 'robots.txt', 'sitemap.xml']) {
  await cp(path, `dist/${path}`, { recursive: true });
}
console.log(`Static HTML built with ${projects.length} project cards.`);
