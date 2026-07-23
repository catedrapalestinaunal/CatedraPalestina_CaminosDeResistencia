import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, RotateCcw, RotateCw } from 'lucide-react';
import { Icon } from '../lib/icons';
import { useLockBodyScroll } from '../lib/hooks';

interface ImageBookPage {
  src: string;
  alt?: string;
}

interface ImageBookProps {
  src?: string;
  alt?: string;
  pages?: ImageBookPage[];
  label?: string;
  credit?: string;
  naturalWidth?: number;
  naturalHeight?: number;
  className?: string;
}

export function ImageBook({ src, alt, pages, label, credit, naturalWidth, naturalHeight, className = '' }: ImageBookProps) {
  const [open, setOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState({ w: 800, h: 500 });
  const [loadedN, setLoadedN] = useState({ w: 0, h: 0 });

  const isMulti = !!pages;
  const currentSrc = isMulti ? pages[imgIndex].src : src!;
  const currentAlt = isMulti ? (pages[imgIndex].alt ?? label) : (alt ?? label);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setStage({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!open) {
      setScale(1);
      setRotate(0);
      setImgIndex(0);
    }
  }, [open]);

  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    setScale(1);
    setRotate(0);
  }, [open, imgIndex]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
      if (isMulti) {
        if (e.key === 'ArrowLeft') setImgIndex(i => Math.max(i - 1, 0));
        if (e.key === 'ArrowRight') setImgIndex(i => Math.min(i + 1, pages.length - 1));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, isMulti, pages]);

  const aspect = loadedN.w > 0 ? loadedN.w / loadedN.h : (naturalWidth && naturalHeight ? naturalWidth / naturalHeight : 1);
  const maxFitW = stage.w;
  const maxFitH = stage.h;
  const fitByH = maxFitH * aspect;
  const baseW = Math.min(maxFitW, fitByH);
  const baseH = baseW / aspect;

  const zoomIn = () => setScale(s => Math.min(s * 1.4, 20));
  const zoomOut = () => setScale(s => Math.max(s / 1.4, 0.10));
  const zoomReset = () => setScale(1);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setScale(s => Math.max(0.10, Math.min(20, s * (e.deltaY > 0 ? 0.9 : 1.1))));
    }
  }, []);

  const handleDoubleClick = () => {
    if (scale === 1) setScale(2);
    else setScale(1);
  };

  const handleImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth) {
      setLoadedN({ w: img.naturalWidth, h: img.naturalHeight });
    }
  };

  const triggerSrc = isMulti ? pages[0].src : src!;

  return (
    <div className={'image-book ' + className}>
      {/* ============ TRIGGER ============ */}
      <div
        className="image-book-trigger group"
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`Abrir visor: ${label ?? triggerSrc}`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setOpen(true); }}
      >
        <img src={triggerSrc} alt="" aria-hidden className="image-book-trigger-bg" />
        <div className="image-book-trigger-shade" />
        <span className="image-book-trigger-cta absolute bottom-3 right-3 z-10">
          <Icon.Search /> Abrir visor
        </span>

        {credit && (
          <div className="absolute bottom-3 left-3 z-10 flex flex-col items-start pointer-events-none">
            <div className="mb-1 w-56 p-2 bg-neutral-900/95 text-neutral-300 text-[9px] font-mono rounded-md border border-white/10 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-left leading-relaxed">
              {credit}
            </div>
            <button
              type="button"
              className="pointer-events-auto bg-black/40 hover:bg-black/70 backdrop-blur-md border border-white/10 text-white/70 text-[10px] px-2 py-0.5 rounded-md font-mono transition-all opacity-40 group-hover:opacity-100"
              aria-label="Información de licencia"
              onClick={(e) => e.stopPropagation()}
            >
              ©
            </button>
          </div>
        )}
      </div>

      {/* ============ MODAL ============ */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="image-book-modal-veil"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="image-book-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* Header */}
              <div className="image-book-modal-header">
                <div className="kicker truncate">{label}</div>

                {isMulti && pages.length > 1 && (
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button
                      className="icon-btn !w-[30px] !h-[30px] md:!w-[44px] md:!h-[44px]"
                      onClick={() => setImgIndex(i => Math.max(i - 1, 0))}
                      disabled={imgIndex === 0}
                      aria-label="Página anterior"
                    >
                      <Icon.ArrowLeft />
                    </button>
                    <span className="font-mono text-[11px] tracking-[0.1em] text-fg-mute min-w-[44px] text-center">
                      {imgIndex + 1}/{pages.length}
                    </span>
                    <button
                      className="icon-btn !w-[30px] !h-[30px] md:!w-[44px] md:!h-[44px]"
                      onClick={() => setImgIndex(i => Math.min(i + 1, pages.length - 1))}
                      disabled={imgIndex === pages.length - 1}
                      aria-label="Página siguiente"
                    >
                      <Icon.Arrow />
                    </button>
                  </div>
                )}

                <div className="image-book-modal-zoom">
                  <button onClick={zoomOut} aria-label="Alejar"><ZoomOut size={14} /></button>
                  <span className="image-book-modal-zoom-pct">{Math.round(scale * 100)}%</span>
                  <button onClick={zoomIn} aria-label="Acercar"><ZoomIn size={14} /></button>
                  <button onClick={() => setRotate(r => r === 0 ? 180 : 0)} aria-label="Rotar 180°"><RotateCw size={14} /></button>
                  <button onClick={zoomReset} aria-label="Restablecer"><RotateCcw size={14} /></button>
                </div>
                <button className="image-book-modal-close" onClick={() => setOpen(false)} aria-label="Cerrar">
                  <Icon.Close />
                </button>
              </div>

              {/* Stage */}
              <div
                ref={stageRef}
                className="image-book-modal-stage"
                onWheel={handleWheel}
                onDoubleClick={handleDoubleClick}
              >
                <motion.div
                  className="image-book-modal-pan"
                  drag={scale > 1}
                  dragConstraints={stageRef}
                  dragElastic={0}
                >
                  <img
                    key={currentSrc}
                    src={currentSrc}
                    alt={currentAlt ?? ''}
                    draggable={false}
                    className="image-book-modal-img"
                    onLoad={handleImgLoad}
                    style={{
                      width: baseW * scale,
                      height: baseH * scale,
                      transform: `rotate(${rotate}deg)`,
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
