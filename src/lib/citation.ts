import type { Project } from './types';

const KIND_LABELS: Record<string, string> = {
  ensayo: 'Ensayo académico',
  cartografia: 'Cartografía',
  video: 'Video',
  podcast: 'Podcast',
  fanzine: 'Fanzine',
  mural: 'Mural',
  collage: 'Collage',
  grabado: 'Grabado',
};

function formatNameAPA(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  const surname = parts[parts.length - 1];
  const initials = parts.slice(0, -1).map(p => p.charAt(0).toUpperCase() + '.').join(' ');
  return `${surname}, ${initials}`;
}

function formatNameChicago(fullName: string, index: number): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  const surname = parts[parts.length - 1];
  const initials = parts.slice(0, -1).map(p => p.charAt(0).toUpperCase() + '.').join(' ');
  if (index === 0) return `${surname}, ${initials}`;
  return `${initials} ${surname}`;
}

function formatAuthors(
  p: Project,
  style: 'apa' | 'chicago',
): string {
  if (!p.members || p.members.length === 0) return p.author;
  if (style === 'chicago') {
    const formatted = p.members.map((m, i) => formatNameChicago(m, i));
    if (formatted.length <= 3) {
      if (formatted.length === 1) return formatted[0];
      if (formatted.length === 2) return `${formatted[0]} y ${formatted[1]}`;
      return `${formatted[0]}, ${formatted[1]} y ${formatted[2]}`;
    }
    return formatted.slice(0, 3).join(', ') + ', et al.';
  }
  const formatted = p.members.map(formatNameAPA);
  if (formatted.length <= 5) return formatted.join(', ');
  return formatted.slice(0, 5).join(', ') + ', et al.';
}

export function generateAPA(p: Project): string {
  const kindLabel = KIND_LABELS[p.kind] || p.kind;
  const authors = formatAuthors(p, 'apa');
  const url = p.url ? ` ${p.url}` : '';
  return `${authors} (${p.year}). ${p.title} [${kindLabel}]. Cátedra Caminos de Resistencia, Universidad Nacional de Colombia.${url}`;
}

export function generateChicago(p: Project): string {
  const kindLabel = KIND_LABELS[p.kind] || p.kind;
  const authors = formatAuthors(p, 'chicago');
  const url = p.url ? `. ${p.url}` : '.';
  return `${authors}. "${p.title}." ${kindLabel}. Cátedra Caminos de Resistencia, Universidad Nacional de Colombia, ${p.year}${url}`;
}
