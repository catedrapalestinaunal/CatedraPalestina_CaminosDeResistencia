export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://catedrapalestinacaminosderesistencia.com';
export const OG_IMAGE = `${SITE_URL}/og-image.png`;

export const SITE_NAME = 'Cátedra Caminos de Resistencia · UNAL';
export const SITE_DESCRIPTION = 'Plataforma de Memoria y Solidaridad Académica · UNAL + Embajada del Estado de Palestina';
export const SITE_LOCALE = 'es_CO';
export const SITE_LANG = 'es-CO';

export const TWITTER_SITE = '@ctpalestina';

const OG_API = `${SITE_URL}/api/og`;

export function ogPageUrl(title: string, sub?: string): string {
  const params = new URLSearchParams({ title });
  if (sub) params.set('sub', sub);
  return `${OG_API}?${params.toString()}`;
}

export function ogImageUrl(image: string): string {
  const url = new URL(image);
  url.searchParams.set('w', '1200');
  return url.toString();
}

export function toPngUrl(image: string): string {
  if (image.includes('cloudinary')) {
    return image.replace('/upload/', '/upload/f_png/');
  }
  return image;
}
