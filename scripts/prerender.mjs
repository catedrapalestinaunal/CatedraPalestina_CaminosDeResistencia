import { spawn, execSync } from 'child_process';
import { mkdirSync, writeFileSync, readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PORT = 4199;
const IS_VERCEL = process.env.VERCEL === '1';

let puppeteer, executablePath;

if (IS_VERCEL) {
  const chromium = await import('@sparticuz/chromium');
  puppeteer = await import('puppeteer-core');
  executablePath = await chromium.default.executablePath();
} else {
  puppeteer = await import('puppeteer');
}

function getFontFaces() {
  const assets = readdirSync(join(DIST, 'assets'));
  const cssFile = assets.find(f => f.startsWith('index-') && f.endsWith('.css'));
  if (!cssFile) return '';
  const css = readFileSync(join(DIST, 'assets', cssFile), 'utf-8');
  const faces = css.match(/@font-face\s*\{[^}]*\}/gs);
  return faces ? faces.join('\n') : '';
}

const FONT_FACES = getFontFaces();

function injectFontFaces(html) {
  if (!FONT_FACES) return html;
  return html.replace('</head>', `<style>${FONT_FACES}</style></head>`);
}

const ROUTES = [
  { path: '/',         file: 'index.html' },
  { path: '/historia', file: 'historia/index.html' },
  { path: '/ongs',     file: 'ongs/index.html' },
  { path: '/genero',   file: 'genero/index.html' },
  { path: '/voces',    file: 'voces/index.html' },
  { path: '/archivo',  file: 'archivo/index.html' },
];

const ESSENTIAL_CHUNK_PATTERNS = ['rolldown-runtime', 'preload-helper', 'vendor', 'index'];

function cleanModulePreloads(html) {
  return html.replace(
    /<link\s+rel="modulepreload"[^>]*href="([^"]*)"[^>]*>\s*/g,
    (match, href) => {
      const isEssential = ESSENTIAL_CHUNK_PATTERNS.some(p => href.includes(p));
      return isEssential ? match : '';
    }
  );
}

function killPort(port) {
  try {
    if (process.platform === 'win32') {
      const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf-8', timeout: 3000 });
      for (const line of result.split('\n').filter(Boolean)) {
        const match = line.trim().match(/(\d+)\s*$/);
        if (match) {
          try { execSync(`taskkill /F /PID ${match[1]}`, { stdio: 'ignore', timeout: 2000 }); } catch {}
        }
      }
    } else {
      try { execSync(`lsof -ti :${port} | xargs kill -9`, { stdio: 'ignore', timeout: 3000 }); } catch {}
    }
  } catch {}
}

async function waitForServer(url, timeout = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`Server did not start within ${timeout}ms`);
}

async function prerender() {
  killPort(PORT);

  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT)], {
    cwd: ROOT,
    stdio: 'pipe',
    shell: true,
    env: { ...process.env, BROWSER: 'none', OPEN: 'false' },
  });

  server.stdout.on('data', d => process.stdout.write(d));
  server.stderr.on('data', d => process.stderr.write(d));

  const cleanup = () => {
    try { server.kill(); } catch {}
    killPort(PORT);
  };
  process.on('exit', cleanup);

  const BASE = `http://localhost:${PORT}`;
  await waitForServer(BASE);

  const launchOpts = { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'] };
  if (executablePath) launchOpts.executablePath = executablePath;

  const browser = await puppeteer.launch(launchOpts);
  let ok = 0;
  let fail = 0;

  for (const route of ROUTES) {
    const page = await browser.newPage();
    try {
      await page.goto(BASE + route.path, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.waitForSelector('title', { timeout: 10000 });
      await new Promise(r => setTimeout(r, 500));
      const raw = await page.content();
      const html = injectFontFaces(cleanModulePreloads(raw));
      const filePath = join(DIST, route.file);
      mkdirSync(dirname(filePath), { recursive: true });
      writeFileSync(filePath, html, 'utf-8');
      if (html.includes('data-rh="true"')) {
        ok++;
        console.log(`\u2713  ${route.path} \u2192 ${route.file} [data-rh OK]`);
      } else {
        fail++;
        console.warn(`\u26A0  ${route.path} \u2192 ${route.file} [sin data-rh]`);
      }
    } catch (err) {
      fail++;
      console.error(`\u2717  ${route.path} failed:`, err.message);
    }
    await page.close();
  }

  await browser.close();
  cleanup();
  console.log(`\n\u2705 Prerendering complete \u2014 ${ok} ok, ${fail} failed`);
}

prerender();
