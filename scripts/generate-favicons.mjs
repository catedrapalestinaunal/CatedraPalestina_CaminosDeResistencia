import sharp from 'sharp';
import toIco from 'to-ico';
import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, '..', 'public');

const SVG_PATH = resolve(PUBLIC, 'favicon.svg');
const SVG_CONTENT = readFileSync(SVG_PATH, 'utf8')
  /* Render SVG at high resolution so downscales stay crisp */
  .replace('width="325"', 'width="1024"')
  .replace('height="325"', 'height="1024"');

/* ============ 1. Render master PNG from SVG ============ */
const MASTER_SZ = 512;
const master = await sharp(Buffer.from(SVG_CONTENT))
  .resize(MASTER_SZ, MASTER_SZ)
  .png()
  .toBuffer();

/* ============ 2. Generate all raster sizes ============ */
const SIZES = [
  { size: 16,  name: 'favicon-16x16.png',        ico: true },
  { size: 32,  name: 'favicon-32x32.png',        ico: true },
  { size: 48,  name: 'favicon-48x48.png',        ico: true },
  { size: 96,  name: 'favicon-96x96.png',        ico: false },
  { size: 180, name: 'apple-touch-icon.png',     ico: false },
  { size: 192, name: 'icon-192.png',             ico: false },
  { size: 512, name: 'icon-512.png',             ico: false },
];

const icoInputs = [];

for (const { size, name, ico } of SIZES) {
  const buf = await sharp(master).resize(size, size).png().toBuffer();
  writeFileSync(resolve(PUBLIC, name), buf);
  console.log(`  OK  ${name}`);
  if (ico) icoInputs.push(buf);
}

/* ============ 3. .ico ============ */
const icoBuf = await toIco(icoInputs);
writeFileSync(resolve(PUBLIC, 'favicon.ico'), icoBuf);
console.log('  OK  favicon.ico (16+32+48)');

/* ============ 4. OG image (1200×630 from SVG) ============ */
const OG_W = 1200, OG_H = 630;

const ogSvg = `<svg width="${OG_W}" height="${OG_H}" viewBox="0 0 ${OG_W} ${OG_H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${OG_W}" height="${OG_H}" fill="#F3372F"/>
  <g transform="translate(${OG_W/2}, ${OG_H/2}) scale(${OG_H/2596 * 0.6}) translate(-1298, -1298)">
    <use href="/favicon.svg#icon"/>
  </g>
</svg>`;

const ogImage = await sharp(Buffer.from(ogSvg))
  .resize(OG_W, OG_H)
  .png()
  .toBuffer();

writeFileSync(resolve(PUBLIC, 'og-image.png'), ogImage);
console.log('  OK  og-image.png');

/* ============ 5. Navbar icon (28×28 PNG from SVG) ============ */
const navPng = await sharp(master).resize(28, 28).png().toBuffer();
writeFileSync(resolve(PUBLIC, 'navbar-icon.png'), navPng);
console.log('  OK  navbar-icon.png');

const navWebp = await sharp(master).resize(28, 28).webp().toBuffer();
writeFileSync(resolve(PUBLIC, 'navbar-icon.webp'), navWebp);
console.log('  OK  navbar-icon.webp');

console.log('\nAll favicons regenerated from SVG.');
