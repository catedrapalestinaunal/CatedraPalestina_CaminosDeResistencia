import type { CSSProperties } from 'react';
import type { ImageVariant } from '../lib/types';

interface ImageSlotProps {
  height?: number;
  label?: string;
  variant?: ImageVariant;
  className?: string;
  src?: string;
  srcSet?: string;
  sizes?: string;
  alt?: string;
  credit?: string;
  objectPosition?: string;
  avifSrcSet?: string;
  loading?: 'lazy' | 'eager';
}

const VARIANT_STRIPES: Record<ImageVariant, string> = {
  olive:  'repeating-linear-gradient(135deg, var(--olive-soft) 0 14px, transparent 14px 28px)',
  terra:  'repeating-linear-gradient(135deg, var(--terracotta-soft) 0 14px, transparent 14px 28px)',
  carbon: 'repeating-linear-gradient(135deg, var(--line-soft) 0 14px, transparent 14px 28px)',
};

export function ImageSlot({ height, label, variant = 'olive', className = '', src, srcSet, sizes, alt, credit, objectPosition, avifSrcSet, loading = 'lazy' }: ImageSlotProps) {
  const style: CSSProperties = {
    ...(height !== undefined ? { height } : {}),
    background: `${VARIANT_STRIPES[variant]}, var(--bg-warm)`,
  };

  return (
    <div className={'image-slot ' + className} style={style}>
      {src ? (
        <>
          {avifSrcSet ? (
            <picture>
              <source srcSet={avifSrcSet} sizes={sizes} type="image/avif" />
              <img src={src} srcSet={srcSet} sizes={sizes} alt={alt ?? label ?? ''} loading={loading} className={'image-slot-img' + (height !== undefined ? '' : ' image-slot-img--auto')} style={{ objectPosition: objectPosition ?? '50% 50%' }} />
            </picture>
          ) : (
            <img src={src} srcSet={srcSet} sizes={sizes} alt={alt ?? label ?? ''} loading={loading} className={'image-slot-img' + (height !== undefined ? '' : ' image-slot-img--auto')} style={{ objectPosition: objectPosition ?? '50% 50%' }} />
          )}
          {credit && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(139, 29, 34, 0.92)',
              color: '#fff7f1',
              padding: '6px 10px',
              fontSize: '10px',
              fontFamily: 'JetBrains Mono, ui-monospace, monospace',
              lineHeight: 1.4,
              zIndex: 15,
            }}>
              © {credit}
            </div>
          )}
        </>
      ) : (
        <div className="image-slot-label">Imagen · {label ?? ''}</div>
      )}
    </div>
  );
}
