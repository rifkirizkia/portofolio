// Local preview of the production artifact; deployment continues to use Nginx.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import zlib from 'node:zlib';

const root = resolve('dist');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2'
};

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    const file = resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (!file.startsWith(root + sep)) { res.writeHead(404).end(); return; }
    const body = await readFile(file);
    const ext = extname(file);
    const contentType = types[ext] || 'application/octet-stream';
    const acceptEncoding = req.headers['accept-encoding'] || '';

    const headers = {
      'Content-Type': contentType,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
      'Content-Security-Policy': "frame-ancestors 'self';",
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    };

    if (/\.(html|txt|xml|css|js|svg)$/.test(ext) && acceptEncoding.includes('gzip')) {
      headers['Content-Encoding'] = 'gzip';
      const gzipped = zlib.gzipSync(body);
      res.writeHead(200, headers);
      res.end(req.method === 'HEAD' ? undefined : gzipped);
    } else {
      res.writeHead(200, headers);
      res.end(req.method === 'HEAD' ? undefined : body);
    }
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
  }
}).listen(Number(process.env.PORT || 4173), '127.0.0.1', () => {
  console.log(`Production preview: http://127.0.0.1:${process.env.PORT || 4173}`);
});
