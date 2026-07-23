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
}

const VARIANT_STRIPES: Record<ImageVariant, string> = {
  olive:  'repeating-linear-gradient(135deg, var(--olive-soft) 0 14px, transparent 14px 28px)',
  terra:  'repeating-linear-gradient(135deg, var(--terracotta-soft) 0 14px, transparent 14px 28px)',
  carbon: 'repeating-linear-gradient(135deg, var(--line-soft) 0 14px, transparent 14px 28px)',
};

export function ImageSlot({ height, label, variant = 'olive', className = '', src, srcSet, sizes, alt, credit, objectPosition }: ImageSlotProps) {
  const style: CSSProperties = {
    ...(height !== undefined ? { height } : {}),
    background: `${VARIANT_STRIPES[variant]}, var(--bg-warm)`,
  };

  return (
    <div className={'image-slot ' + className} style={style}>
      {src ? (
        <>
          <img src={src} srcSet={srcSet} sizes={sizes} alt={alt ?? label ?? ''} className={'image-slot-img' + (height !== undefined ? '' : ' image-slot-img--auto')} style={{ objectPosition: objectPosition ?? '50% 50%' }} />
          {credit && (
            <div className="absolute bottom-3 right-3 z-10 flex flex-col items-end">
              <button
                type="button"
                className="bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 text-white/70 text-[10px] px-2 py-0.5 rounded-md font-mono"
                title={credit}
                aria-label={credit}
              >
                ©
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="image-slot-label">Imagen · {label ?? ''}</div>
      )}
    </div>
  );
}
