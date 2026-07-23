import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '../lib/icons';

interface ImageGalleryProps {
  children: React.ReactNode;
  className?: string;
  hint?: string;
}

export function ImageGallery({ children, className = '', hint }: ImageGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches || 'ontouchstart' in window);
  }, []);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    if (window.innerWidth < 768) return;
    el.scrollBy({
      left: direction === 'left' ? -el.clientWidth * 0.85 : el.clientWidth * 0.85,
      behavior: 'smooth',
    });
  };

  const showButtons = (isTouch || hovering);

  return (
    <div
      className={'relative group ' + className}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="relative">
        <AnimatePresence>
          {showButtons && canScrollLeft && (
            <motion.button
              key="prev"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white transition-colors cursor-pointer"
              onClick={() => scroll('left')}
              aria-label="Imagen anterior"
            >
              <Icon.ArrowLeft />
            </motion.button>
          )}
        </AnimatePresence>

        <div
          ref={scrollRef}
          className="flex touch-scroll snap-x snap-mandatory"
        >
          {children}
        </div>

        <AnimatePresence>
          {showButtons && canScrollRight && (
            <motion.button
              key="next"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white transition-colors cursor-pointer"
              onClick={() => scroll('right')}
              aria-label="Imagen siguiente"
            >
              <Icon.Arrow />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {hint && (
        <div className="text-center font-mono text-[11px] md:text-[10px] text-fg-mute pointer-events-none select-none mt-3 tracking-wider">
          {hint}
        </div>
      )}
    </div>
  );
}
