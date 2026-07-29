import { Helmet } from 'react-helmet-async';
import { SITE_NAME, SITE_LOCALE, TWITTER_SITE, OG_IMAGE_DEFAULT } from '../lib/seo';

interface OgMetaProps {
  title: string;
  description: string;
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  url: string;
  type?: 'website' | 'article';
  canonical?: string;
}

const OG_W = 1200;
const OG_H = 630;

export function OgMeta({
  title,
  description,
  image = OG_IMAGE_DEFAULT,
  imageWidth = OG_W,
  imageHeight = OG_H,
  imageAlt = 'Cátedra Caminos de Resistencia · UNAL — Plataforma de Memoria y Solidaridad Académica',
  url,
  type = 'website',
  canonical = url,
}: OgMetaProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content={String(imageWidth)} />
      <meta property="og:image:height" content={String(imageHeight)} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content={SITE_LOCALE} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_SITE} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="canonical" href={canonical} />
    </Helmet>
  );
}
