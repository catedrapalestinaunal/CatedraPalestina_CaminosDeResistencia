import { useState } from 'react';

interface LazyYouTubeProps {
  embedId: string;
  title: string;
}

export function LazyYouTube({ embedId, title }: LazyYouTubeProps) {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <button
        onClick={() => setLoaded(true)}
        className="relative w-full aspect-video rounded-xl overflow-hidden bg-black group cursor-pointer border-0 p-0"
        aria-label={`Reproducir: ${title}`}
      >
        <img
          src={`https://img.youtube.com/vi/${embedId}/hqdefault.jpg`}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors">
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--terracotta)' }}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-white ml-0.5">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </button>
    );
  }

  return (
    <div className="aspect-video rounded-xl overflow-hidden bg-black">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${embedId}?autoplay=1`}
        width="100%"
        height="100%"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        className="border-0"
        title={title}
        allowFullScreen
      />
    </div>
  );
}