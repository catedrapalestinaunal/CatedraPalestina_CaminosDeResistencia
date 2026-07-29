import 'dotenv/config';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SITE_URL = process.env.VITE_SITE_URL || 'https://catedrapalestinacaminosderesistencia.com';
const INDEXNOW_KEY = 'a3d2c8e1b4f70926';
const HOST = new URL(SITE_URL).host;

const urls = [
  `${SITE_URL}/`,
  `${SITE_URL}/historia`,
  `${SITE_URL}/ongs`,
  `${SITE_URL}/genero`,
  `${SITE_URL}/voces`,
  `${SITE_URL}/archivo`,
];

async function pingIndexNow() {
  const body = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      console.log(`  OK  IndexNow pinged for ${urls.length} URLs`);
    } else {
      console.warn(`  WARN IndexNow responded ${res.status}: ${await res.text()}`);
    }
  } catch (err) {
    console.warn(`  WARN IndexNow ping failed:`, err.message);
  }

  try {
    const bingUrl = `https://www.bing.com/indexnow?url=${encodeURIComponent(SITE_URL)}&key=${INDEXNOW_KEY}`;
    const res = await fetch(bingUrl);
    if (res.ok) {
      console.log('  OK  Bing IndexNow notified');
    } else {
      console.warn(`  WARN Bing IndexNow responded ${res.status}`);
    }
  } catch (err) {
    console.warn(`  WARN Bing IndexNow notification failed:`, err.message);
  }

  writeFileSync(join(__dirname, '..', 'public', `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY, 'utf-8');
  console.log(`  OK  ${INDEXNOW_KEY}.txt written to public/`);
}

pingIndexNow();
