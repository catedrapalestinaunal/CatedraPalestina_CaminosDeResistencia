import type { ReactNode, HTMLAttributes } from 'react';
import { useEffect, useRef, useState } from 'react';

interface RevealProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  as?: 'div' | 'section' | 'article' | 'span' | 'li';
}

const TAG_MAP = {
  div: 'div',
  section: 'section',
  article: 'article',
  span: 'span',
  li: 'li',
} as const;

export function Reveal({
  children,
  delay = 0,
  y = 20,
  duration = 0.6,
  as = 'div',
  className,
  ...rest
}: RevealProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const Tag = TAG_MAP[as] as 'div';

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
