/**
 * UseCasePage.tsx
 *
 * Página de Caso de Uso Real. Muestra cómo un concepto matemático
 * aparece en una disciplina o situación concreta del mundo real.
 *
 * Layout:
 * - Cabecera con dominio y badge de dificultad
 * - Banda superior "El concepto matemático" → enlace al nodo origen
 * - Contenido MDX (narrativa aplicada + visualización si la hay)
 * - Pie con "Otros casos de uso" de ese mismo concepto
 */
import { useParams, Link } from 'wouter';
import { Suspense, useEffect } from 'react';
import { db } from '../store/content';
import { KatexText } from '../components/ui/KatexText';
import { SimulationLayout } from "../components/layout/SimulationLayout";
import { useProgressStore } from '../store/UserProgressStore';
import { ReadingButton } from '../components/ui/ReadingButton';

// Iconos por dominio real
const DOMAIN_ICONS: Record<string, string> = {
  ingeniería: '⚙',
  arquitectura: '🏛',
  medicina: '⚕',
  biología: '🌿',
  economía: '📈',
  finanzas: '💹',
  naturaleza: '🌊',
  arte: '🎨',
  música: '♩',
  astronomía: '✦',
  física: '⚛',
  geografía: '🗺',
  cartografía: '🗺',
  informática: '◻',
};

const DOMAIN_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  ingeniería:   { bg: '#F5F0E8', text: '#7A5C2A', border: '#C4A06A' },
  arquitectura: { bg: '#F0EEF5', text: '#5A4878', border: '#9A82C2' },
  medicina:     { bg: '#F0F5F0', text: '#2A6A4A', border: '#6AAA82' },
  biología:     { bg: '#F0F5EC', text: '#3A6A2A', border: '#7AAA62' },
  economía:     { bg: '#F5F2E8', text: '#7A6A2A', border: '#C4B06A' },
  finanzas:     { bg: '#F5F2E8', text: '#7A6A2A', border: '#C4B06A' },
  naturaleza:   { bg: '#EEF5F0', text: '#2A6A4A', border: '#6AAA82' },
  física:       { bg: '#EEF2F5', text: '#2A4A7A', border: '#6A82C4' },
  astronomía:   { bg: '#EEEEF5', text: '#3A2A7A', border: '#7A6AC4' },
  cartografía:  { bg: '#F0F5F0', text: '#2A6A4A', border: '#6AAA82' },
};

function getDomainStyle(domain?: string) {
  if (!domain) return { bg: '#F5F5F0', text: '#666655', border: '#CCCC99' };
  const key = domain.toLowerCase();
  return DOMAIN_COLORS[key] ?? { bg: '#F5F5F0', text: '#5A5A48', border: '#AAAA88' };
}

export const UseCasePage: React.FC = () => {
  const { id } = useParams();
  const slug = id || '';
  const usecase = db.getUseCase(slug);
  const { markUseCaseVisited } = useProgressStore();

  useEffect(() => {
    if (usecase) {
      markUseCaseVisited(slug);
    }
  }, [slug, usecase, markUseCaseVisited]);

  if (!usecase) {
    return (
      <div className="min-h-screen bg-lienzo flex items-center justify-center font-serif text-carbon">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">◎</div>
          <h1 className="text-2xl italic text-carbon/50">Caso de uso no encontrado.</h1>
        </div>
      </div>
    );
  }

  // Concepto matemático relacionado
  const concept = usecase.concept
    ? (db.getTheorem(usecase.concept) ||
       db.getDefinition(usecase.concept) ||
       db.lessons.get(usecase.concept))
    : null;

  // Otros casos de uso del mismo concepto
  const related = usecase.concept
    ? db.getUseCasesByConcept(usecase.concept).filter(u => u.id !== usecase.id)
    : [];

  const domainKey = (usecase.domain || '').toLowerCase();
  const domainIcon = DOMAIN_ICONS[domainKey] ?? '◈';
  const domainStyle = getDomainStyle(usecase.domain);

  const DIFF_COLORS: Record<string, string> = {
    básico:     '#2a6a2a',
    intermedio: '#c49b4f',
    avanzado:   '#A42A04',
  };
  const diffColor = DIFF_COLORS[usecase.difficulty ?? 'básico'] ?? '#333';

  const renderContent = () => (
    <div className="min-h-screen bg-transparent text-carbon font-serif">

      {/* ── Cabecera ─────────────────────────────────────────────────────── */}
      <div className="border-b border-carbon/10">
        <div className="max-w-3xl mx-auto px-6 md:px-10 pt-16 pb-10">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[10px] font-sans uppercase tracking-widest text-carbon/35 mb-8">
            <Link href="/"><a className="hover:text-carbon transition-colors">Biblioteca</a></Link>
            <span>/</span>
            {concept && (
              <>
                <Link href={`/teorema/${(concept as any).slug || usecase.concept}`}>
                  <a className="hover:text-carbon transition-colors">{(concept as any).title as string}</a>
                </Link>
                <span>/</span>
              </>
            )}
            <span className="text-carbon/55">Caso de Uso</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-5">
            {/* Dominio */}
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-bold rounded-sm"
              style={{ backgroundColor: domainStyle.bg, color: domainStyle.text, border: `1px solid ${domainStyle.border}` }}
            >
              <span aria-hidden>{domainIcon}</span>
              {usecase.domain || 'Aplicación'}
            </span>

            {/* Dificultad */}
            {usecase.difficulty && (
              <span
                className="text-[10px] font-sans font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-sm"
                style={{ color: diffColor, backgroundColor: `${diffColor}15`, border: `1px solid ${diffColor}30` }}
              >
                {usecase.difficulty}
              </span>
            )}

            <span className="text-[10px] font-sans uppercase tracking-widest text-carbon/35 border border-carbon/15 px-2.5 py-1.5 rounded-sm">
              Caso de Uso Real
            </span>
          </div>

          {/* Título */}
          <h1
            className="text-4xl md:text-5xl font-bold text-carbon leading-tight mb-5"
            style={{ fontVariant: 'small-caps' }}
          >
            {usecase.title}
          </h1>

          {/* Descripción */}
          {usecase.description && (
            <p className="text-base italic text-carbon/60 border-l-4 border-carbon/15 pl-5 leading-relaxed">
              <KatexText text={usecase.description} />
            </p>
          )}

          {/* Enlace al concepto matemático */}
          {concept && (
            <div className="mt-8 flex items-center gap-4">
              <div className="text-[10px] font-sans uppercase tracking-widest text-carbon/35">
                Concepto matemático
              </div>
              <Link href={`/teorema/${(concept as any).slug || usecase.concept}`}>
                <a className="inline-flex items-center gap-2 px-4 py-2 border border-terracota/25 text-terracota text-sm font-sans hover:border-terracota hover:bg-terracota/5 transition-all">
                  {(concept as any).title as string}
                  <span className="text-xs opacity-60">→</span>
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Contenido MDX ────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 md:px-10 py-16">
        <div className="prose prose-base max-w-none [&_p]:text-carbon/85 [&_p]:leading-relaxed [&_strong]:text-carbon [&_h3]:text-2xl [&_h3]:font-serif [&_h3]:text-terracota [&_h3]:mt-12 [&_h3]:mb-6 [&_h3]:italic">
          <Suspense fallback={<div className="animate-pulse h-64 bg-carbon/5 rounded" />}>
            <usecase.Component />
          </Suspense>
        </div>
      </div>

      {/* ── Pie: otros casos de uso relacionados ─────────────────────────── */}
      {related.length > 0 && (
        <div className="border-t border-carbon/10 bg-carbon/[0.015]">
          <div className="max-w-3xl mx-auto px-6 md:px-10 py-12">
            <div className="text-[10px] font-sans uppercase tracking-widest text-carbon/40 mb-6">
              Más aplicaciones de este concepto
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map(rel => {
                const relDomainKey = (rel.domain || '').toLowerCase();
                const relIcon = DOMAIN_ICONS[relDomainKey] ?? '◈';
                const relStyle = getDomainStyle(rel.domain);
                return (
                  <Link key={rel.id} href={`/caso/${rel.slug}`}>
                    <a className="block p-4 border border-carbon/10 hover:border-carbon/25 transition-colors group">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-sm"
                          style={{ backgroundColor: relStyle.bg, color: relStyle.text }}
                        >
                          {relIcon} {rel.domain}
                        </span>
                      </div>
                      <div className="font-serif font-bold text-carbon group-hover:text-terracota transition-colors">
                        {rel.title}
                      </div>
                      {rel.description && (
                        <div className="text-xs text-carbon/50 mt-1 line-clamp-2 font-sans">
                          {rel.description}
                        </div>
                      )}
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Botón de Lectura */}
      <ReadingButton id={slug} />
    </div>
  );

  return (
    <SimulationLayout simulationComponent={usecase.Simulation}>
      {renderContent()}
    </SimulationLayout>
  );
};
