import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollY } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { PAGES, PATH_TO_PAGE, type Theme } from '../lib/types';

interface NavProps {
  theme: Theme;
  toggleTheme: () => void;
}

export function Nav({ theme, toggleTheme }: NavProps) {
  const y = useScrollY();
  const scrolled = y > 24;
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const activePage = PATH_TO_PAGE[pathname] ?? 'home';

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <>
      <div className={'nav-shell ' + (scrolled ? 'is-scrolled' : '')}>
        <nav className="nav" aria-label="Principal">
          <Link className="brand" to="/">
            <span className="brand-mark">
              <picture>
                <source srcSet="/navbar-icon.webp" type="image/webp" />
                <img src="/navbar-icon.png" alt="Caminos de Resistencia" width={28} height={28} />
              </picture>
            </span>
            <span>
              Caminos de Resistencia
              <small>Plataforma de Memoria · UNAL</small>
            </span>
          </Link>

          <div className="nav-links">
            {PAGES.map(p => (
              <Link
                key={p.id}
                to={p.path}
                className={'nav-link ' + (activePage === p.id ? 'is-active' : '')}
                aria-current={activePage === p.id ? 'page' : undefined}
              >
                {p.label}
              </Link>
            ))}
          </div>

          <div className="nav-meta">
            <button className="icon-btn" onClick={toggleTheme} aria-label="Alternar tema" aria-pressed={theme === 'dark'}>
              {theme === 'dark' ? <Icon.Sun /> : <Icon.Moon />}
            </button>
            <Link to="/archivo" className="nav-cta" aria-label="Explorar el Archivo">
              <span className="cta-text">Explorar el Archivo</span>
              <Icon.Arrow />
            </Link>
            <button
              className="icon-btn nav-burger"
              onClick={() => setMenuOpen(m => !m)}
              aria-label="Menú"
            >
              {menuOpen ? <Icon.Close /> : <Icon.Menu />}
            </button>
          </div>
        </nav>
      </div>

      <div className={'mobile-sheet ' + (menuOpen ? 'is-open' : '')}>
        <button
          className="absolute top-4 right-4 z-10 w-11 h-11 flex items-center justify-center rounded-full bg-[var(--bg-warm)] border border-[var(--line)] text-[var(--fg)]"
          onClick={toggleTheme}
          aria-label="Alternar tema"
          aria-pressed={theme === 'dark'}
        >
          {theme === 'dark' ? <Icon.Sun /> : <Icon.Moon />}
        </button>
        {PAGES.map((p, i) => (
          <Link key={p.id} to={p.path} className={activePage === p.id ? 'is-active' : ''}>
            <span className={p.id === 'archive' ? 'text-accent' : ''}>{p.label}</span>
            <small>0{i + 1}</small>
          </Link>
        ))}
      </div>
    </>
  );
}
