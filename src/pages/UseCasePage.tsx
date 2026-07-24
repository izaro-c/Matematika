import { useParams } from 'wouter';
import { Suspense, useEffect } from 'react';
import { db } from '@/entities/content';
import { ContentDiagram, ContentLayout } from '@/widgets/layouts/ContentLayout';
import { useProgressStore } from '@/features/progress/UserProgressStore';
import { ReadingButton } from '@/features/progress/ui/ReadingButton';
import { FadeIn } from '@/shared/ui/FadeIn';
import { ContentHeader } from '@/widgets/content/ContentHeader';
import { ContentBody } from '@/shared/ui/ContentBody';
import { ContentCard } from '@/shared/ui/ContentCard';
import { DifficultyBadge } from '@/shared/ui/DifficultyBadge';
import { SubtleSeparator } from '@/shared/ui/SubtleSeparator';
import { DOMAIN_ICONS, DOMAIN_COLORS } from '@/shared/lib/constants';

/**
 * Componente interno para mostrar un chip visual con la disciplina (dominio) donde se aplica el caso de uso.
 * Ej: "Física", "Criptografía", "Economía".
 */
function DomainBadge({ domain }: { domain?: string }) {
  if (!domain) return null;
  const key = domain.toLowerCase();
  const icon = DOMAIN_ICONS[key] ?? '◈';
  const style = DOMAIN_COLORS[key];
  const accent = style?.text ?? 'var(--theme-carbon)';

  return (
    <span
      className="ac-pill ac-pill-accent"
      style={{ ['--pill-accent' as string]: accent }}
    >
      <span className="ac-pill-ornament" aria-hidden>{icon}</span>
      {domain}
    </span>
  );
}

/**
 * Página principal para visualizar un Caso de Uso (Aplicación en el mundo real).
 *
 * Muestra cómo un concepto matemático abstracto se aplica en la ingeniería, ciencias u otros campos.
 * Registra en el sistema de progreso (UserProgressStore) que el usuario visitó este caso,
 * desbloqueando logros de gamificación relacionados.
 */
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
      <div className="ac-page flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 opacity-20">◎</div>
          <h1 className="text-2xl italic text-carbon/50">Caso de uso no encontrado.</h1>
        </div>
      </div>
    );
  }

  const concept = usecase.concept
    ? (db.getTheorem(usecase.concept) ||
       db.getDefinition(usecase.concept) ||
       db.getMethod(usecase.concept))
    : null;

  const related = usecase.concept
    ? db.getUseCasesByConcept(usecase.concept).filter(u => u.id !== usecase.id)
    : [];

  const c = concept as { title?: string; slug: string; type?: string } | null;
  const breadcrumbs = c
    ? [{
        name: c.title || c.slug,
        href: c.type === 'metodo'
          ? `/metodo/${c.slug}`
          : c.type === 'definicion'
            ? `/definicion/${c.slug}`
            : `/teorema/${c.slug}`,
      }]
    : [];

  const renderContent = () => (
    <div className="min-h-viewport bg-transparent text-carbon font-serif">
      <FadeIn>
        <div className="w-full px-6 md:px-10 pt-4 pb-16">
          <ContentHeader
            type="caso-de-uso"
            typeLabel="Caso de Uso Real"
            title={usecase.title}
            description={usecase.description}
            breadcrumbs={breadcrumbs}
            tags={usecase.tags || []}
            badgesSlot={
              <>
                <DomainBadge domain={usecase.domain} />
                {usecase.difficulty && <DifficultyBadge difficulty={usecase.difficulty} />}
              </>
            }
            backLink={c ? {
              href: `/teorema/${c.slug || usecase.concept}`,
              label: `← ${c.title || c.slug}`,
            } : undefined}
          />

          <ContentBody>
            <Suspense fallback={<div className="animate-pulse h-64 bg-carbon/5 rounded" />}>
              <usecase.Component />
            </Suspense>
          </ContentBody>
        </div>

        {related.length > 0 && (
          <div className="w-full px-6 md:px-10 pb-16">
            <SubtleSeparator />
            <h3 className="ac-label ac-label--md ac-label--faint mb-6">
              Más aplicaciones de este concepto
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {related.map(rel => (
                <ContentCard
                  key={rel.id}
                  href={`/caso/${rel.slug}`}
                  title={rel.title}
                  description={rel.description}
                  type="caso-de-uso"
                  domain={rel.domain}
                  domainIcon={rel.domain ? DOMAIN_ICONS[rel.domain.toLowerCase()] : undefined}
                  actionLabel="Explorar"
                />
              ))}
            </div>
          </div>
        )}

        <div className="w-full px-6 md:px-10 pb-16">
          <ReadingButton id={slug} />
        </div>
      </FadeIn>
    </div>
  );

  return (
    <ContentLayout pageType="caso-de-uso" diagram={usecase.Simulation ? <ContentDiagram component={usecase.Simulation} /> : undefined}>
      {renderContent()}
    </ContentLayout>
  );
};
