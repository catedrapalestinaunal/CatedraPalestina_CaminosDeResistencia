import sharp from 'sharp';
import { readFile, stat } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOME = join(__dirname, '..', 'public', 'images', 'home');

const SIZES = [
  { name: 'ancient-olive-al-badawi-1200', width: 1200, height: 800 },
  { name: 'ancient-olive-al-badawi-768',  width: 768,  height: 512 },
  { name: 'ancient-olive-al-badawi-480',  width: 480,  height: 320 },
];

async function optimize() {
  const src = join(HOME, 'ancient-olive-al-badawi.webp');
  const buffer = await readFile(src);

  for (const s of SIZES) {
    await sharp(buffer)
      .resize(s.width, s.height, { fit: 'cover', position: 'centre' })
      .webp({ quality: 65, effort: 6 })
      .toFile(join(HOME, `${s.name}.webp`));
    console.log(`  ✓ ${s.name}.webp re-compressed`);

    await sharp(buffer)
      .resize(s.width, s.height, { fit: 'cover', position: 'centre' })
      .avif({ quality: 25, effort: 6 })
      .toFile(join(HOME, `${s.name}.avif`));
    console.log(`  ✓ ${s.name}.avif generated`);
  }

  for (const s of SIZES) {
    const wp = join(HOME, `${s.name}.webp`);
    const av = join(HOME, `${s.name}.avif`);
    const wSize = (await stat(wp)).size;
    const aSize = (await stat(av)).size;
    console.log(`  ${s.name}: WebP=${(wSize/1024).toFixed(1)}KiB  AVIF=${(aSize/1024).toFixed(1)}KiB`);
  }
}

optimize().catch(console.error);
