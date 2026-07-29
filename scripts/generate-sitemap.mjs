import 'dotenv/config';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const today = new Date().toISOString().split('T')[0];

const SITE_URL = process.env.VITE_SITE_URL || 'https://catedrapalestinacaminosderesistencia.com';

const urls = [
  { loc: '/', priority: 1.0, changefreq: 'weekly' },
  { loc: '/historia', priority: 0.8, changefreq: 'monthly' },
  { loc: '/ongs', priority: 0.8, changefreq: 'monthly' },
  { loc: '/genero', priority: 0.8, changefreq: 'monthly' },
  { loc: '/voces', priority: 0.8, changefreq: 'monthly' },
  { loc: '/archivo', priority: 0.9, changefreq: 'weekly' },
  { loc: '/admin/login', priority: 0.1, changefreq: 'monthly' },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

writeFileSync(join(__dirname, '..', 'public', 'sitemap.xml'), xml, 'utf-8');
console.log(`\u2713 sitemap.xml generated (${today})`);

const INDEXNOW_KEY = 'a3d2c8e1b4f70926';
writeFileSync(join(__dirname, '..', 'public', `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY, 'utf-8');
console.log(`\u2713 ${INDEXNOW_KEY}.txt generated`);
