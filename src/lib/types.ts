export interface Page {
  id: PageId;
  label: string;
  sub: string;
  path: string;
}

export type PageId = 'home' | 'history' | 'ongs' | 'genero' | 'voces' | 'archive';

export const PAGES: Page[] = [
  { id: 'home',    label: 'Inicio',   sub: 'El Surco de la Memoria',   path: '/' },
  { id: 'history', label: 'Historia', sub: 'Raíces Milenarias',       path: '/historia' },
  { id: 'ongs',    label: 'ONGs',     sub: 'Savia y Sumud',           path: '/ongs' },
  { id: 'genero',  label: 'Género',   sub: 'Palestina de Todas',      path: '/genero' },
  { id: 'voces',   label: 'Voces',    sub: 'Cultura y Medios',        path: '/voces' },
  { id: 'archive', label: 'Archivo',  sub: 'Cosecha de Saberes',      path: '/archivo' },
];

export const PATH_TO_PAGE: Record<string, PageId> = {
  '/':        'home',
  '/historia':'history',
  '/ongs':    'ongs',
  '/genero':  'genero',
  '/voces':   'voces',
  '/archivo': 'archive',
};

export type Theme = 'light' | 'dark';

export type ImageVariant = 'olive' | 'terra' | 'carbon';

export interface Event {
  id: number;
  title: string;
  description?: string;
  place?: string;
  eventDate: string;
  eventTime?: string;
  organizer?: string;
  category?: string;
  images: string[];
}

export interface Project {
  id: number;
  kind: ProjectKind;
  title: string;
  author: string;
  year: string;
  n: string;
  tags: string[];
  description?: string;
  url?: string;
  urlAlt?: string;
  links?: { label: string; url: string }[];
  linkLabel?: string;
  thumbnail?: string;
  aiThumbnail?: boolean;
  members?: string[];
  group?: string;
}

export type ProjectKind = 'ensayo' | 'cartografia' | 'video' | 'podcast' | 'fanzine' | 'mural' | 'collage' | 'grabado';

export interface Book {
  author: string;
  work: string;
  year: string;
  origin: string;
}

export interface TimelineEntry {
  year: string;
  title: string;
  body: string;
  tags: string[];
  major: boolean;
}

export interface GlossaryEntry {
  term: string;
  author: string;
  def: string;
}

export interface OngCard {
  tag: string;
  title: string;
  body: string;
  stats: { v: string; k: string }[];
  blockade: boolean;
  img: ImageVariant;
  label: string;
  size: 's6' | 's12';
  imgHeight?: number;
  src?: string;
  alt?: string;
  credit?: string;
  objectPosition?: string;
}

export interface OngPartner {
  name: string;
  city: string;
  since: string;
  focus: string;
  url?: string;
}

export interface ExternalOrganization {
  id: string;
  name: string;
  category: string;
  description: string;
  url: string;
}

export interface KindFilter {
  id: 'all' | ProjectKind;
  label: string;
  n: number;
}

export interface Myth {
  id: string;
  myth: string;
  reality: string;
  sources: string[];
}

export interface Source {
  author: string;
  work: string;
  url?: string;
}

export interface PodcastEpisode {
  n: number;
  title: string;
  url: string;
  description?: string;
  sources: Source[];
}

export interface PodcastSeries {
  title: string;
  author: string;
  episodes: PodcastEpisode[];
}
