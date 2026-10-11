import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import PROJECTS_DATA from '../js/projects-data.js';

const html = await readFile('dist/index.html', 'utf8');
const canonical = 'https://portofolio.rifkirizkia.site/';
const title = 'Rifki Rizkia — DevOps Engineer & Software Developer';
const decode = (value) => value.replaceAll('&amp;', '&');
const tags = [...html.matchAll(/<(meta|link|a|img|script)\b([^>]*)>/g)].map(([, tag, attrs]) => {
  const obj = { tag };
  for (const [, key, value] of attrs.matchAll(/([\w:-]+)(?:="([^"]*)")?/g)) {
    obj[key] = value !== undefined ? decode(value) : '';
  }
  return obj;
});
const getMeta = (name) => tags.filter((t) => t.tag === 'meta' && (t.name === name || t.property === name));
const oneMeta = (name) => {
  const found = getMeta(name);
  assert.equal(found.length, 1, name);
  return found[0].content;
};

assert.equal(decode(html.match(/<title>(.*?)<\/title>/s)[1]), title);
assert.equal((html.match(/<title>/g) || []).length, 1);
assert.equal((html.match(/<h1\b/g) || []).length, 1);
assert.equal(html.match(/<h1\b[^>]*>(.*?)<\/h1>/s)[1].trim(), 'Rifki Rizkia');
assert.match(oneMeta('description'), /Rifki Rizkia/);
assert.match(oneMeta('robots'), /index, follow/);
assert(!/noindex/i.test(html));
assert.deepEqual(
  tags.filter((t) => t.rel === 'canonical').map((t) => t.href),
  [canonical]
);
assert.equal(oneMeta('og:url'), canonical);
for (const name of ['og:title', 'twitter:title']) assert.equal(oneMeta(name), title);
for (const name of ['og:description', 'twitter:description'])
  assert.equal(oneMeta(name), oneMeta('description'));
for (const name of ['og:image', 'twitter:image'])
  assert.match(oneMeta(name), /^https:\/\/portofolio\.rifkirizkia\.site\//);
assert.match(html, /<html lang="id"/);
assert(tags.some((t) => t.rel === 'icon'));
assert(!html.includes('cdn.tailwindcss.com'));

// Verify Vite-compiled CSS bundle and SRI
const cssLink = tags.find((t) => t.tag === 'link' && t.rel === 'stylesheet' && t.href?.includes('/assets/'));
assert(cssLink, 'Compiled Vite CSS link missing');
assert(
  (await readFile(resolve('dist', cssLink.href.replace(/^\//, '').split('?')[0]))).length > 0,
  'Compiled CSS bundle is empty'
);
assert(
  cssLink.integrity?.startsWith('sha384-'),
  'Subresource Integrity (SRI) sha384 missing on stylesheet'
);

const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
assert.equal(schema['@type'], 'ProfilePage');
assert.equal(schema.url, canonical);
assert.equal(schema.mainEntity['@type'], 'Person');
assert.equal(schema.mainEntity.name, 'Rifki Rizkia');
assert.equal(schema.mainEntity.jobTitle, 'DevOps Engineer & Software Developer');
assert.equal(schema.mainEntity.sameAs.length, 3);
for (const url of schema.mainEntity.sameAs) {
  assert(tags.some((t) => t.tag === 'a' && t.href === url), `Visible social link: ${url}`);
}

const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]));
let links = 0;
for (const tag of tags) {
  const url = tag.href || tag.src;
  if (!url || /^(https?:|mailto:|tel:|data:)/.test(url)) continue;
  if (url.startsWith('#')) {
    assert(url === '#' || ids.has(url.slice(1)), `Missing anchor: ${url}`);
  } else {
    await access(resolve('dist', url.replace(/^\//, '').split('?')[0]));
  }
  links++;
}
for (const img of tags.filter((t) => t.tag === 'img' && t.src)) {
  assert(img.alt && !/^(image|photo|img)$/i.test(img.alt));
}
for (const id of ['tentang', 'pengalaman', 'projek', 'kontak']) assert(ids.has(id));

// Verify prerendered projects in HTML
const defaultProjects = PROJECTS_DATA.filter((p) => p.category === 'mobile' || p.category === 'web');
for (const project of defaultProjects) {
  assert(html.includes(project.title), `Project missing from static HTML: ${project.title}`);
}
for (const project of PROJECTS_DATA) {
  for (const img of [project.thumbnailUrl, ...(project.gallery || []).map((i) => i.image)]) {
    if (img && !img.startsWith('http')) await access(resolve('dist', img));
  }
}

const llms = await readFile('dist/llms.txt', 'utf8');
assert.match(llms, /^#\s+.+/m, 'llms.txt missing H1 title');
assert.match(llms, /\[.+\]\(https?:\/\/.+\)/, 'llms.txt missing links');
const robots = await readFile('dist/robots.txt', 'utf8');
assert.match(robots, /User-agent: \*\s+Allow: \//);
assert(!/^Disallow:\s*\/\s*$/m.test(robots));
assert(robots.includes(`Sitemap: ${canonical}sitemap.xml`));
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
assert.deepEqual(
  [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]),
  [canonical]
);

// Verify strict CSP compliance: zero inline executable scripts
const inlineExecScripts = [...html.matchAll(/<script(?![^>]*type=["']application\/ld\+json["'])[^>]*>(.*?)<\/script>/gs)]
  .map((m) => m[1].trim())
  .filter(Boolean);
assert.equal(inlineExecScripts.length, 0, 'No inline scripts should exist (enables strict CSP without unsafe-inline)');

// Verify Vite-compiled JS bundle and SRI
const jsScript = tags.find((t) => t.tag === 'script' && t.src?.includes('/assets/'));
assert(jsScript, 'Compiled Vite JS bundle missing');
assert(
  jsScript.integrity?.startsWith('sha384-'),
  'Subresource Integrity (SRI) sha384 missing on JS bundle'
);
assert('crossorigin' in jsScript, 'crossorigin attribute required for SRI');
const jsCode = await readFile(resolve('dist', jsScript.src.replace(/^\//, '').split('?')[0]), 'utf8');
assert(jsCode.length > 0, 'Bundled JS is empty');

console.log(
  `PASS: metadata, one H1, JSON-LD, social identity, ${links} local links/assets, ${defaultProjects.length} static projects, llms.txt, robots, sitemap, Vite bundles, and SRI validation.`
);

if (process.env.BASE_URL) {
  for (const [path, status] of [
    ['/', 200],
    ['/robots.txt', 200],
    ['/sitemap.xml', 200],
    ['/llms.txt', 200],
    ['/styles/remixicon/remixicon.min.css', 200],
    ['/missing-page', 404],
    ['/about', 404],
    ['/projects', 404],
    ['/index.html', 200],
  ]) {
    const response = await fetch(new URL(path, process.env.BASE_URL), { redirect: 'manual' });
    assert.equal(response.status, status, path);
    assert(!/noindex/i.test(response.headers.get('x-robots-tag') || ''));
    console.log(`HTTP ${status}: ${path}`);
  }
}
