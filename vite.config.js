import { defineConfig } from 'vite';
import crypto from 'node:crypto';
import PROJECTS_DATA from './js/projects-data.js';
import createProjectCardHTML from './js/project-card.js';

/**
 * Prerenders default project cards into index.html for SEO and no-JS visitors.
 */
function prerenderProjectsPlugin() {
  return {
    name: 'vite-plugin-prerender-projects',
    transformIndexHtml(html) {
      const marker = '<!-- prerender:projects -->';
      if (!html.includes(marker)) return html;
      const defaultProjects = PROJECTS_DATA.filter(
        (p) => p.category === 'mobile' || p.category === 'web'
      );
      const cardsHtml = defaultProjects
        .map((project, i) => createProjectCardHTML(project, i))
        .join('');
      return html.replace(marker, cardsHtml);
    },
  };
}

/**
 * Injects Subresource Integrity (SRI) sha384 hashes and crossorigin attributes into
 * generated scripts and stylesheets for maximum supply-chain and tamper protection.
 */
function subresourceIntegrityPlugin() {
  return {
    name: 'vite-plugin-sri',
    enforce: 'post',
    apply: 'build',
    transformIndexHtml(html, { bundle }) {
      if (!bundle) return html;
      return html.replace(/<(script|link)([^>]+)>/g, (tag, tagName, attrs) => {
        const isScript = tagName === 'script' && attrs.includes('src=');
        const isCss = tagName === 'link' && /rel=["']stylesheet["']/.test(attrs) && attrs.includes('href=');
        if (!isScript && !isCss) return tag;

        const srcMatch = attrs.match(/(?:src|href)=["']([^"']+)["']/);
        if (!srcMatch) return tag;

        const assetUrl = srcMatch[1];
        if (/^(https?:|\/\/)/.test(assetUrl)) return tag;

        const fileName = assetUrl.replace(/^\.?\//, '').split('?')[0];
        const chunk = bundle[fileName];
        if (!chunk) return tag;

        const content = chunk.type === 'asset' ? chunk.source : chunk.code;
        const hash = crypto.createHash('sha384').update(content).digest('base64');
        const integrity = `sha384-${hash}`;

        let newAttrs = attrs;
        if (!newAttrs.includes('crossorigin')) {
          newAttrs += ' crossorigin="anonymous"';
        }
        if (!newAttrs.includes('integrity')) {
          newAttrs += ` integrity="${integrity}"`;
        }
        return `<${tagName}${newAttrs}>`;
      });
    },
  };
}

export default defineConfig({
  plugins: [
    prerenderProjectsPlugin(),
    subresourceIntegrityPlugin(),
  ],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: false,
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    port: 5173,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },
  preview: {
    port: 4173,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    },
  },
});
