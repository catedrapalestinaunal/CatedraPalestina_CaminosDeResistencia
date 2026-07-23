import { Reveal } from './Reveal';
import orgData from '../data/organizations.json';
import type { ExternalOrganization } from '../lib/types';

const orgs: ExternalOrganization[] = orgData as ExternalOrganization[];

export function ExternalOrgs() {
  return (
    <>
      <div className="mt-16" />
      <Reveal>
        <div className="hr-rule mb-8">
          <span>Organizaciones con enlace directo</span>
        </div>
      </Reveal>
      <p className="text-fg-mute text-base leading-relaxed mb-8 max-w-prose">
        Enlaces directos a organizaciones que trabajan sobre el terreno documentando,
        asistiendo y protegiendo a la población palestina.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {orgs.map((org, i) => (
          <Reveal
            key={org.id}
            as="article"
            delay={i * 0.08}
            className="group flex flex-col p-6 rounded-xl border border-[var(--line)] bg-[var(--bg-warm)] transition-all duration-200 hover:border-[var(--terracotta)]/40 hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="font-serif text-xl md:text-2xl tracking-tight leading-tight">
                {org.name}
              </h3>
              <span className="shrink-0 font-mono text-[11px] md:text-[10px] tracking-[0.15em] uppercase text-fg-mute whitespace-nowrap px-2.5 py-1 border border-[var(--line)] rounded-full">
                {org.category}
              </span>
            </div>
            <p className="text-fg-mute text-sm md:text-[14px] leading-relaxed mb-5 flex-1">
              {org.description}
            </p>
            <a
              href={org.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 self-start font-mono text-[12px] tracking-[0.15em] uppercase text-accent hover:text-[var(--carbon)] transition-colors duration-200"
            >
              Sitio oficial
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </a>
          </Reveal>
        ))}
      </div>
    </>
  );
}
