import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import vm from 'node:vm';

const html = await readFile('dist/index.html', 'utf8');
const canonical = 'https://portofolio.rifkirizkia.site/';
const title = 'Rifki Rizkia — DevOps Engineer & Software Developer';
const decode = value => value.replaceAll('&amp;', '&');
const tags = [...html.matchAll(/<(meta|link|a|img|script)\b([^>]*)>/g)].map(([, tag, attrs]) => ({
  tag, ...Object.fromEntries([...attrs.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key, decode(value)])),
}));
const getMeta = name => tags.filter(t => t.tag === 'meta' && (t.name === name || t.property === name));
const oneMeta = name => { const found = getMeta(name); assert.equal(found.length, 1, name); return found[0].content; };
assert.equal(decode(html.match(/<title>(.*?)<\/title>/s)[1]), title);
assert.equal((html.match(/<title>/g) || []).length, 1);
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert.equal(html.match(/<h1\b[^>]*>(.*?)<\/h1>/s)[1].trim(), 'Rifki Rizkia');
assert.match(oneMeta('description'), /Rifki Rizkia/);
assert.match(oneMeta('robots'), /index, follow/);
assert(!/noindex/i.test(html));
assert.deepEqual(tags.filter(t => t.rel === 'canonical').map(t => t.href), [canonical]);
assert.equal(oneMeta('og:url'), canonical);
for (const name of ['og:title', 'twitter:title']) assert.equal(oneMeta(name), title);
for (const name of ['og:description', 'twitter:description']) assert.equal(oneMeta(name), oneMeta('description'));
for (const name of ['og:image', 'twitter:image']) assert.match(oneMeta(name), /^https:\/\/portofolio\.rifkirizkia\.site\//);
assert.match(html, /<html lang="id"/);
assert(tags.some(t => t.rel === 'icon'));
assert(!html.includes('cdn.tailwindcss.com'));
assert((await readFile('dist/styles/site.css')).length > 0);

const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
assert.equal(schema['@type'], 'ProfilePage');
assert.equal(schema.url, canonical);
assert.equal(schema.mainEntity['@type'], 'Person');
assert.equal(schema.mainEntity.name, 'Rifki Rizkia');
assert.equal(schema.mainEntity.jobTitle, 'DevOps Engineer & Software Developer');
assert.equal(schema.mainEntity.sameAs.length, 3);
for (const url of schema.mainEntity.sameAs) assert(tags.some(t => t.tag === 'a' && t.href === url), `Visible social link: ${url}`);

const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
let links = 0;
for (const tag of tags) {
  const url = tag.href || tag.src;
  if (!url || /^(https?:|mailto:|tel:)/.test(url)) continue;
  if (url.startsWith('#')) {
    assert(url === '#' || ids.has(url.slice(1)), `Missing anchor: ${url}`);
  } else {
    await access(resolve('dist', url.replace(/^\//, '').split('?')[0]));
  }
  links++;
}
for (const img of tags.filter(t => t.tag === 'img' && t.src)) assert(img.alt && !/^(image|photo|img)$/i.test(img.alt));
for (const id of ['tentang', 'pengalaman', 'projek', 'kontak']) assert(ids.has(id));
const context = vm.createContext({ window: {} });
vm.runInContext(await readFile('js/projects-data.js', 'utf8'), context);
const defaultProjects = context.window.PROJECTS_DATA.filter(p => p.category === 'mobile' || p.category === 'web');
for (const project of defaultProjects) {
  assert(html.includes(project.title), `Project missing from static HTML: ${project.title}`);
}
for (const project of context.window.PROJECTS_DATA) {
  for (const img of [project.thumbnailUrl, ...(project.gallery || []).map(i => i.image)]) {
    if (img && !img.startsWith('http')) await access(resolve('dist', img));
  }
}
const robots = await readFile('dist/robots.txt', 'utf8');
assert.match(robots, /User-agent: \*\s+Allow: \//);
assert(!/^Disallow:\s*\/\s*$/m.test(robots));
assert(robots.includes(`Sitemap: ${canonical}sitemap.xml`));
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]), [canonical]);
for (const [, script] of html.matchAll(/<script>(.*?)<\/script>/gs)) new vm.Script(script);
for (const file of ['i18n', 'portfolio', 'projects-data', 'project-card']) new vm.Script(await readFile(`dist/js/${file}.js`, 'utf8'));
console.log(`PASS: metadata, one H1, JSON-LD, social identity, ${links} local links/assets, ${defaultProjects.length} static projects, robots, sitemap and JavaScript syntax.`);

if (process.env.BASE_URL) {
  for (const [path, status] of [['/', 200], ['/robots.txt', 200], ['/sitemap.xml', 200], ['/styles/site.css', 200], ['/missing-page', 404], ['/about', 404], ['/projects', 404], ['/index.html', 200]]) {
    const response = await fetch(new URL(path, process.env.BASE_URL), { redirect: 'manual' });
    assert.equal(response.status, status, path);
    assert(!/noindex/i.test(response.headers.get('x-robots-tag') || ''));
    console.log(`HTTP ${status}: ${path}`);
  }
}
