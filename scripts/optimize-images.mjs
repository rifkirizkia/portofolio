import { readdir, stat, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import sharp from 'sharp';

async function optimizeDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await optimizeDir(fullPath);
    } else if (entry.name.endsWith('.png') && !entry.name.includes('.bak')) {
      const originalStat = await stat(fullPath);
      const originalBuf = await readFile(fullPath);
      const meta = await sharp(originalBuf).metadata();

      // Optimize PNG in-place
      let pipeline = sharp(originalBuf);
      if (meta.width > 1920) {
        pipeline = pipeline.resize({ width: 1920, withoutEnlargement: true });
      }
      const optPng = await pipeline
        .png({ quality: 80, compressionLevel: 9, effort: 7 })
        .toBuffer();

      if (optPng.length < originalBuf.length) {
        await writeFile(fullPath, optPng);
        console.log(`PNG: ${fullPath} ${originalStat.size} -> ${optPng.length} bytes (-${Math.round((1 - optPng.length/originalStat.size)*100)}%)`);
      }

      // Generate WebP version
      const webpPath = fullPath.replace(/\.png$/, '.webp');
      let webpPipeline = sharp(originalBuf);
      if (meta.width > 720) {
        webpPipeline = webpPipeline.resize({ width: 720, withoutEnlargement: true });
      }
      const webpBuf = await webpPipeline
        .webp({ quality: 80, effort: 6 })
        .toBuffer();
      await writeFile(webpPath, webpBuf);
      console.log(`WebP: ${webpPath} ${webpBuf.length} bytes`);
    }
  }
}

// Special hero image: foto.webp (600x600 for sharp retina display)
const heroBuf = await sharp('asset/foto.png')
  .resize(600, 600)
  .webp({ quality: 82 })
  .toBuffer();
await writeFile('asset/foto-hero.webp', heroBuf);
console.log(`Hero WebP: asset/foto-hero.webp ${heroBuf.length} bytes`);

await optimizeDir('asset');
console.log('Image optimization complete.');
