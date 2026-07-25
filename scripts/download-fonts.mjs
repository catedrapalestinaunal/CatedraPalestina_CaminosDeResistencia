import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const fontsDir = join(root, 'public', 'fonts');

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?' +
  'family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400&' +
  'family=Inter:wght@300;400;500;600;700&' +
  'family=JetBrains+Mono:wght@400;500&' +
  'display=optional';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

async function main() {
  console.log('Fetching Google Fonts CSS…');
  const resp = await fetch(GOOGLE_FONTS_URL, { headers: { 'User-Agent': UA } });
  if (!resp.ok) { console.error(`Failed: ${resp.status}`); return; }
  const css = await resp.text();
  console.log('Parsing @font-face rules…');

  mkdirSync(fontsDir, { recursive: true });

  const fontFaceRegex = /@font-face\s*\{([^}]+)\}/g;
  const best = {};
  let match;
  while ((match = fontFaceRegex.exec(css)) !== null) {
    const block = match[1];
    const props = {};
    const propRegex = /([\w-]+)\s*:\s*(['"]?)([^;]*)\2\s*;/g;
    let pm;
    while ((pm = propRegex.exec(block)) !== null) props[pm[1]] = pm[3].trim();

    const family = (props['font-family'] || '').replace(/['"]/g, '');
    const weight = props['font-weight'] || '400';
    const style = props['font-style'] || 'normal';
    const url = (props['src'] || '').match(/url\((['"]?)([^)]+)\1\)/)?.[2];
    const size = props['size'] || '0';

    if (!url) continue;

    const key = `${family}-${weight}-${style}`;
    // Keep the largest (most complete) version
    if (!best[key] || url.length > best[key].url.length) {
      best[key] = { family, weight, style, url, block };
    }
  }

  console.log(`Found ${Object.keys(best).length} unique variants`);
  const localCssParts = [];

  for (const [key, { family, weight, style, url }] of Object.entries(best)) {
    const safeName = family.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const fileExt = url.endsWith('.ttf') ? 'ttf' : 'woff2';
    const filename = `${safeName}-${weight}${style === 'italic' ? '-italic' : ''}.${fileExt}`;
    const filepath = join(fontsDir, filename);

    console.log(`  ${family} ${weight} ${style} → ${filename}`);

    if (existsSync(filepath)) {
      const existing = readFileSync(filepath).length;
      console.log(`    ✓ already exists (${(existing / 1024).toFixed(1)} KiB)`);
    } else {
      try {
        const fontResp = await fetch(url);
        if (!fontResp.ok) { console.log(`    ✗ Failed (${fontResp.status})`); continue; }
        const buf = Buffer.from(await fontResp.arrayBuffer());
        writeFileSync(filepath, buf);
        console.log(`    ✓ downloaded (${(buf.length / 1024).toFixed(1)} KiB)`);
      } catch (e) {
        console.log(`    ✗ Error: ${e.message}`);
        continue;
      }
    }

    localCssParts.push(`@font-face {
  font-family: '${family}';
  font-style: ${style};
  font-weight: ${weight};
  font-display: optional;
  src: url('/fonts/${filename}') format('${fileExt === 'woff2' ? 'woff2' : 'truetype'});
}`);
  }

  const localCss = localCssParts.join('\n\n');
  writeFileSync(join(root, 'src', 'styles', 'fonts.css'), localCss, 'utf-8');
  console.log(`\n✓ fonts.css written (${localCss.split('\n').length} lines, ${Object.keys(best).length} variants)`);

  // Also print summary
  console.log('\nSummary:');
  const families = {};
  for (const { family, weight, style } of Object.values(best)) {
    if (!families[family]) families[family] = [];
    families[family].push(`${weight}${style === 'italic' ? ' italic' : ''}`);
  }
  for (const [family, variants] of Object.entries(families)) {
    console.log(`  ${family}: ${variants.join(', ')}`);
  }
}

main().catch(console.error);
