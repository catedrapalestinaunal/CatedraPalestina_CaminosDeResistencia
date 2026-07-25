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

function formatAuthorName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  const surname = parts[parts.length - 1];
  const initials = parts.slice(0, -1).map(p => p.charAt(0).toUpperCase() + '.').join(' ');
  return `${surname}, ${initials}`;
}

export function generateAPA(p: Project): string {
  const kindLabel = KIND_LABELS[p.kind] || p.kind;
  const authors = (() => {
    if (p.members && p.members.length > 0) {
      const formatted = p.members.map(formatAuthorName);
      if (formatted.length <= 5) return formatted.join(', ');
      return formatted.slice(0, 5).join(', ') + ', et al.';
    }
    return p.author;
  })();
  const url = p.url ? ` ${p.url}` : '';
  return `${authors} (${p.year}). ${p.title} [${kindLabel}]. Cátedra Caminos de Resistencia, Universidad Nacional de Colombia.${url}`;
}
