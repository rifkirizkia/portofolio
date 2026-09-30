# SEO audit — Rifki Rizkia

Audit date: 30 September 2026. Changes are local; they have not been deployed or submitted to Google Search Console.

## Project audit

- Plain HTML and vanilla JavaScript, with Tailwind CSS 3.4.16 and AOS animation. No Next.js, React, Vite, or application router.
- Homepage: `index.html`. Existing sections: `#tentang`, `#pengalaman`, `#projek`, `#organisasi`, `#penghargaan`, and `#kontak`.
- Case studies use JavaScript modals and `#case-study/{slug}` fragments. These are not separate indexable documents.
- Existing Docker deployment serves static files with Nginx; GitHub Actions builds the image and deploys to EC2 on pushes to `main`.
- Before changes: title/description and partial social metadata existed, but the language module overwrote them with different text. No canonical, robots.txt, sitemap, JSON-LD, favicon declaration, or manifest existed. No `noindex` was found.
- Biography, experience, and contact were already in source HTML. Project cards depended on JavaScript. Tailwind ran in the browser, and scroll/AOS animations could conceal content without JavaScript.
- The existing About section was improved rather than duplicated into `/about`. `/projects` was not invented. The sitemap contains only `/`, the sole public HTML document. Fragment URLs are excluded.
- No manifest was added: this site is not currently a PWA, and a manifest is not needed for this implementation.

## SEO implemented

- [x] Title: **Rifki Rizkia — DevOps Engineer & Software Developer**.
- [x] Natural Indonesian meta description, with consistent English translation.
- [x] One absolute canonical: `https://portofolio.rifkirizkia.site/`.
- [x] Robots metadata: `index, follow, max-image-preview:large`.
- [x] Public `robots.txt` permits crawling and advertises the sitemap.
- [x] XML sitemap lists the actual canonical homepage only.
- [x] `ProfilePage` JSON-LD with the homepage as the profile document.
- [x] `Person` main entity with stable identity, supplied name/profession, and existing profile image.
- [x] `sameAs` uses only existing LinkedIn, GitHub, and Instagram links.
- [x] Open Graph and Twitter summary card, absolute image URL, dimensions, descriptive image alt text, and locale. No Twitter account was invented.
- [x] One H1, including when the DevOps tab or case-study modal is open. Greeting is a paragraph; main content has a `main` landmark.
- [x] Existing crawlable section navigation preserved. Social links have descriptive accessible labels.
- [x] Profile and all 12 project cards are available in production HTML without JavaScript. No crawler-specific or hidden SEO copy was introduced.
- [x] CSS compiled at build time using the same Tailwind version and theme configuration; the browser CDN compiler was removed.
- [x] Existing portrait reused as favicon/social image; profile image dimensions and fetch priority set; secondary images load lazily.
- [x] Animation fallback keeps content visible without JavaScript or when AOS fails to load.
- [x] Language switching keeps document title, description, Open Graph, Twitter metadata, and HTML language consistent.

No companies, qualifications, certifications, addresses, experiences, social accounts, or performance claims were added to the content.

## Files changed

| File | Change |
| --- | --- |
| `index.html` | Metadata, canonical, JSON-LD, existing-image favicon, semantic HTML, profile copy, image attributes, animation fallbacks, static CSS reference, project prerender marker. |
| `js/i18n.js` | Consistent identity and translated metadata; social metadata updates with language selection. |
| `js/portfolio.js` | Shared project renderer, lazy secondary images, and H2 headings in dynamic views. |
| `js/project-card.js` | Existing card template shared between build and browser, preserving card styling and behavior. |
| `robots.txt` | Public crawl permission and sitemap declaration. |
| `sitemap.xml` | Actual canonical homepage URL. |
| `tailwind.config.cjs`, `styles/tailwind.css` | Existing Tailwind configuration moved into static CSS build. |
| `package.json`, `package-lock.json` | Reproducible build, preview and verification commands; Tailwind is a development dependency only. |
| `scripts/build.mjs` | Generates production HTML with project cards and copies public assets into `dist/`. |
| `scripts/serve.mjs` | Local HTTP preview of production files. Production still uses Nginx. |
| `scripts/verify.mjs` | SEO, local asset/anchor, schema, project content and JavaScript checks; optional HTTP checks. |
| `Dockerfile` | Multi-stage static build and verification, then copy final artifacts into the existing Nginx image. |
| `.gitignore` | Exclude dependencies and generated build output. |
| `SEO_AUDIT.md` | Audit, verification evidence, build instructions and remaining actions. |

## Verification: local production artifact

Commands:

```sh
npm ci
npm run build
npm test
npm start
# In a second terminal:
BASE_URL=http://127.0.0.1:4173 npm test
```

Always serve `dist/` after building. Opening the source `index.html` directly does not run the CSS/prerender build.

| Check | Actual result |
| --- | --- |
| Homepage | `http://127.0.0.1:4173/`, HTTP 200. |
| Title | `Rifki Rizkia — DevOps Engineer & Software Developer`. |
| Description | `Portofolio resmi Rifki Rizkia, DevOps Engineer & Software Developer dengan pengalaman cloud AWS/GCP, Docker, CI/CD, serta pengembangan aplikasi web dan mobile.` |
| Canonical | Exactly one, `https://portofolio.rifkirizkia.site/`. |
| Robots | `index, follow, max-image-preview:large`; no noindex in HTML or preview response headers. |
| Sitemap | HTTP 200; canonical homepage only. |
| robots.txt | HTTP 200; `User-agent: *`, `Allow: /`, correct sitemap URL. |
| Structured data | Parses as JSON; ProfilePage/Person types and identity assertions pass; all three sameAs URLs are visible contact links. External Google Rich Results Test has not been run. |
| Local links and assets | 36 references checked, plus all project thumbnails/gallery paths; none missing. |
| Projects in initial HTML | All 12 project cards; browser UI still shows six initially and supports expansion/filtering. |
| Missing routes | `/missing-page`, `/about`, `/projects` return real 404s; they are not advertised in the sitemap. |
| File alias | `/index.html` returns 200 and has the same canonical to `/`. Query variants also retain the single canonical. |
| Build | `npm run build` passed. Compiled CSS is approximately 45 KB, uncompressed. |
| Static tests | `npm test` passed, including inline and external JavaScript syntax checks. |
| Browser runtime | Chrome desktop/mobile checks passed; no JavaScript exceptions or failed external resources during the ordinary desktop test. |
| Desktop interactions | Language changes, metadata synchronization, theme, show-all, case-study open/close, DevOps/mobile filters and single H1 passed. |
| Mobile interactions | 390 px viewport: no horizontal overflow; menu opens, section navigation works, menu closes. |
| JavaScript disabled | CSS loaded; H1, About, Projects and Contact visible; 12 project cards available. |
| AOS unavailable | Simulated blocked animation CDN: hero remains visible, no runtime exception. |
| Container build | Not executed successfully: Docker command is unavailable in this environment. Dockerfile includes the passing build/test commands; container startup needs verification in the deployment environment. |
| Warnings | Tailwind emits a nonfatal outdated Browserslist database notice. Build exits successfully. |

These checks validate the built files and local behavior. They do not establish Google's chosen canonical, indexing status, rich-result eligibility or ranking.

## Verification: current public website, before deployment

- HTTPS homepage: HTTP 200, zero redirects. A request with the `Googlebot` user agent also returned HTTP 200; this does not substitute for Search Console's real crawler inspection.
- HTTP homepage: one 301 redirect directly to the canonical HTTPS origin.
- `/index.html`: HTTP 200. The new canonical will consolidate this alias once deployed.
- `/robots.txt`: HTTP 404. `/sitemap.xml`: HTTP 404. The new files remain local until deployment.
- No `noindex` metadata or `X-Robots-Tag: noindex` was observed in the inspected homepage response.
- `www.portofolio.rifkirizkia.site` did not resolve. No DNS, proxy, TLS, Cloudflare, tunnel or external Nginx configuration was changed.
- No public IP-origin URL was supplied, so an IP-origin duplicate could not be audited. The HTML uses the requested public HTTPS canonical regardless of serving host.

## Remaining manual actions

1. Deploy the reviewed changes through the existing workflow. Verify container build/startup and repeat the live HTTP checks above, particularly robots.txt, sitemap.xml and the new title/canonical.
2. Add and verify the Search Console URL-prefix property `https://portofolio.rifkirizkia.site/` (or use an existing verified domain property).
3. Submit `https://portofolio.rifkirizkia.site/sitemap.xml`; inspect the homepage in URL Inspection and request indexing. Inspect Google's selected canonical after processing.
4. Run Google's Rich Results Test against the deployed page. No Search Console submission or Google validation was claimed here.
5. If absent, add the canonical portfolio URL to the existing LinkedIn, GitHub and Instagram profile website fields. External profile settings were not accessed or modified.

Implementation references: [Google ProfilePage documentation](https://developers.google.com/search/docs/appearance/structured-data/profile-page), [canonicalization guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), and [sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
