import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const dir = fileURLToPath(new URL('..', import.meta.url));
const src = join(dir, 'src', 'styles');
const css = readFileSync(join(src, 'global.css'), 'utf-8');

const sections = {
  // name: { label, startMarker, endMarker, remove: true/false }
  // These are extracted in order (top to bottom)
};

// We'll extract sections using string markers and strip them from the base

// Define extraction blocks by marker strings (more reliable than line numbers)
const extractions = [
  {
    page: 'history.css',
    start: '/* ============================================================\n   MythCards',
    end: '.myth-source-item:last-child { border-bottom: none; }',
  },
  {
    page: 'genero.css',
    start: '/* ============================================================\n   PalestinaDeTodas',
    end: '  margin-top: 0.5rem;\n}',
  },
  {
    page: 'genero.css',
    start: '/* ============================================================\n   QuotesMarquee',
    end: '.qm-light .qm-source { color: var(--fg-mute); }',
  },
  {
    page: 'archive.css',
    start: '/* ============================================================\n   Enhanced archive search',
    end: '.biblio-item:hover .work { color: var(--fg); }',
  },
  {
    page: 'voces.css',
    start: '/* ============================================================\n   Voces de la Resistencia',
    end: 'html[data-theme="dark"] .voces-cij-footer {\n  background: rgba(46,71,49,.18);\n  border-color: #3F5D43;\n}',
  },
  // Card readmore — keep in shared (or could move to ongs.css but it's dead code)
  // Timeline cues, biblio-suggest — keep in shared
];

// Track page-specific content for each file
const pageFiles = {};

// Start with full CSS, strip out each section
let remaining = css;

for (const ex of extractions) {
  const startIdx = remaining.indexOf(ex.start);
  if (startIdx === -1) {
    console.error(`  ✗ Could not find start marker for ${ex.page}: ${ex.start.substring(0, 40)}`);
    continue;
  }

  const endContentEnd = remaining.indexOf(ex.end, startIdx);
  if (endContentEnd === -1) {
    console.error(`  ✗ Could not find end marker for ${ex.page}: ${ex.end.substring(0, 40)}`);
    continue;
  }

  // End marker is the LAST line of the section. Find the end of that line.
  const endOfEndLine = remaining.indexOf('\n', endContentEnd);
  const sectionEnd = endOfEndLine !== -1 ? endOfEndLine + 1 : remaining.length;

  const sectionContent = remaining.slice(startIdx, sectionEnd);

  if (!pageFiles[ex.page]) {
    pageFiles[ex.page] = '';
  }
  pageFiles[ex.page] += (pageFiles[ex.page] ? '\n\n' : '') + sectionContent;

  // Remove from remaining
  remaining = remaining.slice(0, startIdx) + remaining.slice(sectionEnd);

  console.log(`  ✓ Extracted ${sectionContent.split('\n').length} lines → ${ex.page}`);
}

// Also extract the reading-note section that was incorrectly included in genero
// The reading-note classes should stay in shared.css because they're used across pages
// Let me check if they were extracted into genero: read the section again

// Write extracted page files
for (const [filename, content] of Object.entries(pageFiles)) {
  writeFileSync(join(src, filename), content, 'utf-8');
  console.log(`  ✎ ${filename} (${content.split('\n').length} lines)`);
}

// Write remaining as shared.css
writeFileSync(join(src, 'shared.css'), remaining, 'utf-8');
console.log(`\n  ✎ shared.css (${remaining.split('\n').length} lines)`);

// Check that reading-note stayed in shared.css
if (remaining.includes('reading-note-eyebrow') || remaining.includes('reading-note-body')) {
  console.log('  ✓ reading-note classes correctly preserved in shared.css');
} else {
  console.log('  ⚠ reading-note classes may have been extracted elsewhere');
}
