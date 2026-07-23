import { Link } from 'react-router-dom';
import { PAGES } from '../lib/types';

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="top">
          <div>
            <div className="mark">Caminos de Resistencia</div>
            <p className="tag">Plataforma autónoma de memoria, investigación y solidaridad académica.</p>
          </div>

          <div>
            <h2>Navegación Rápida</h2>
            {PAGES.map(p => (
              <Link key={p.id} to={p.path}>
                {p.label}
              </Link>
            ))}
          </div>

          <div>
            <h2>Acompañamiento</h2>
            <ul className="footer-inst">
              <li>Cátedra Caminos De Resistencia</li>
              <li>Iniciativa Y Gestión Colectiva Estudiantil</li>
              <li>Apoyo: Facultad De Ciencias Políticas Anfitriona</li>
              <li>Acompañamiento Cultural: Delegaciones Internacionales Aliadas</li>
            </ul>
            <div className="font-mono text-[12px] tracking-[0.05em] mt-3" style={{ color: 'var(--on-dark-legal)' }}>
              Contacto: ctpalestina_bog@unal.edu.co
            </div>
          </div>
        </div>

        <div className="bot">
          <div>© {new Date().getFullYear()} Cátedra Caminos de Resistencia · Colectividad Estudiantil Autónoma</div>
          <div>Desarrollado por Ángel David Beltrán García — Ingeniería de Sistemas</div>
        </div>

        <div className="border-t border-white/10 pt-6 mt-6 text-center">
          <p className="text-[12px] leading-relaxed max-w-none text-justify" style={{ color: 'var(--on-dark-legal)' }}>
            Las obras poéticas, sonoras, audiovisuales y los materiales académicos aquí compilados pertenecen a sus respectivos autores, intérpretes, productoras y comunidades creadoras. Su inclusión en esta plataforma se realiza bajo el derecho de cita y uso justo (<i>fair use</i>), con fines exclusivamente pedagógicos, de memoria, investigación y difusión académica autónoma, sin ánimo de lucro.
          </p>
          <p className="text-[12px] leading-relaxed max-w-none text-justify mt-3" style={{ color: 'var(--on-dark-legal)' }}>
            Este es un espacio gestado y sostenido por la comunidad estudiantil de la facultad anfitriona, bajo la coordinación de la Cátedra Caminos de Resistencia. Los contenidos, análisis y opiniones aquí expresados son responsabilidad exclusiva de sus autores y de la colectividad estudiantil que lo impulsa. En ningún caso constituyen una línea editorial oficial ni comprometen la postura institucional o responsabilidad legal de la institución de educación pública anfitriona, sus facultades, ni de las delegaciones diplomáticas o culturales que han brindado acompañamiento o espacios de diálogo al proyecto.
          </p>
        </div>
      </div>
    </footer>
  );
}
