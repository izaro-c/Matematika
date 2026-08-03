import { useLayoutEffect } from 'react';
import type { Demo, Theorem } from '@/data/content/types';
import { useParams } from "wouter";
import { db } from "@/data/content";
import { ContentLayout } from "@/components/layouts/ContentLayout";
import { ReadingButton } from '@/content-pages/study-plan/ui/ReadingButton';
import { MetadataSidebar } from '@/components/metadata/MetadataSidebar';
import { FadeIn } from '@/components/ui/FadeIn';
import { ContentCard } from '@/components/ui/ContentCard';
import { ContentHeader } from '@/components/content/ContentHeader';
import { DiagramSlot } from '@/components/ui/skeletons';
import { ContentBody } from '@/components/ui/ContentBody';
import { MaterialPracticoSection } from '@/components/content/MaterialPracticoSection';
import { AplicacionesSection } from '@/components/content/AplicacionesSection';
import { SubtleSeparator } from '@/components/ui/SubtleSeparator';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { useMetadataStore } from '@/data/metadata/MetadataStore';

const TYPE_LABELS: Record<string, string> = {
  teorema: 'Teorema',
  lema: 'Lema',
  corolario: 'Corolario',
};

/**
 * Componente principal para visualizar un Teorema, Lema o Corolario.
 * 
 * Se encarga de:
 * 1. Extraer el slug de la URL.
 * 2. Cargar los metadatos y el componente MDX desde el `ContentStore`.
 * 3. Escanear dinámicamente las secciones y encabezados del DOM (MDX y secciones adicionales)
 *    para inyectar un índice interactivo en tiempo de ejecución.
 * 4. Componer índice + lectura + diagrama con ContentLayout.
 */
export const TheoremPage = () => {
  const { id } = useParams();
  const slug = id || '';
  const setMetadata = useMetadataStore((state) => state.setMetadata);

  const theorem = id ? db.getTheorem(id) : undefined;

  const corollaries = theorem?.corollaries?.map(cId => db.getTheorem(cId)).filter(Boolean) as Theorem[] || [];
  const lemmas = theorem?.lemmas?.map(lId => db.getTheorem(lId)).filter(Boolean) as Theorem[] || [];
  const demos = theorem?.demos?.map(dId => db.demos.get(dId) || Array.from(db.demos.values()).find(d => d.slug === dId)).filter(Boolean) as Demo[] || [];
  const parentTheorem = theorem?.parentTheorem ? db.getTheorem(theorem.parentTheorem) : null;
  const examples = theorem ? db.getExamplesByTheorem(theorem.id) : [];
  const exercises = theorem ? db.getExercisesByTheorem(theorem.id) : [];
  const useCases = theorem ? db.getUseCasesByConcept(theorem.id) : [];

  const displayType = theorem ? (TYPE_LABELS[theorem.type || 'teorema'] || 'Teorema') : 'Teorema';
  const Simulation = theorem?.Simulation;

  useLayoutEffect(() => {
    if (!theorem) {
      setMetadata(null);
      return;
    }

    const tocList: { id: string; title: string; level: number }[] = [];
    const seenIds = new Set<string>();

    const elements = Array.from(
      document.querySelectorAll(
        '.content-reading h2, .content-reading h3, .content-reading h4, .content-secondary section'
      )
    );

    elements.forEach((el, index) => {
      let targetId = el.id;
      let title = el.textContent || '';
      let level: number;

      if (el.tagName === 'SECTION') {
        targetId = el.id;
        const h2 = el.querySelector('h2');
        if (h2) {
          title = h2.textContent || '';
        } else {
          return;
        }
        level = 1;
      } else {
        const tagLevel = parseInt(el.tagName.substring(1), 10);
        level = tagLevel - 1;

        if (!targetId) {
          targetId = title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
          if (!targetId) targetId = `seccion-${index}`;
          el.id = targetId;
        }
      }

      if (targetId && title && !seenIds.has(targetId)) {
        seenIds.add(targetId);
        tocList.push({ id: targetId, title, level });
      }
    });

    setMetadata({
      id: theorem.id,
      title: theorem.title,
      type: displayType,
      domain: undefined,
      author: theorem.authors,
      difficulty: theorem.difficulty,
      tags: theorem.tags || [],
      description: theorem.description,
      tableOfContents: tocList,
      lemmas: lemmas.map(l => ({ id: l.id, title: l.title })),
      corollaries: corollaries.map(c => ({ id: c.id, title: c.title })),
      demos: demos.map(d => ({ id: d.id, title: d.title })),
      date: undefined,
    });

    return () => setMetadata(null);
  }, [theorem, setMetadata, displayType, lemmas, corollaries, demos, id]);

  if (!theorem) {
    return (
      <div className="ac-page flex items-center justify-center">
        <h1 className="text-2xl">El teorema especificado no existe o no ha sido catalogado.</h1>
      </div>
    );
  }

  const breadcrumbs: { name: string; href?: string }[] = [];
  if (theorem.tags && theorem.tags.length > 0) {
    const mainBranchName = theorem.tags[0];
    const branchTaxonomy = db.getBranchTaxonomy(mainBranchName);
    breadcrumbs.push(
      ...branchTaxonomy.breadcrumbs.map(b => ({ name: b.name, href: `/rama/${b.slug}` })),
      { name: branchTaxonomy.name || branchTaxonomy.id, href: `/rama/${branchTaxonomy.slug}` }
    );
  }

  const renderMainContent = () => (
    <div className="bg-transparent text-carbon font-serif pb-16">
      <FadeIn className="w-full pt-4">
        <div id="enunciado">
          <ContentHeader
            type={theorem.type || 'teorema'}
            typeLabel={displayType}
            title={theorem.title}
            description={theorem.description}
            breadcrumbs={breadcrumbs}
            authors={theorem.authors || []}
            tags={theorem.tags || []}
            nodeId={theorem.id}
            backLink={parentTheorem ? {
              href: `/teorema/${parentTheorem.id}`,
              label: `← ${TYPE_LABELS[parentTheorem.type || 'teorema'] || 'Teorema'}: ${parentTheorem.title}`,
            } : undefined}
          />
        </div>

        <ContentBody>
          <theorem.Component />
        </ContentBody>
      </FadeIn>
    </div>
  );

  const renderSecondaryContent = () => (
    <FadeIn>
      {demos.length > 0 && (
        <section id="demostraciones" className="mb-20">
          <SectionTitle>Demostraciones Disponibles</SectionTitle>
          <div className="grid gap-4 lg:grid-cols-2">
            {demos.map(demo => (
              <ContentCard
                key={demo.slug}
                href={`/demo/${demo.id}`}
                title={demo.title}
                description={demo.description}
                type="demostracion"
                layout="row"
                actionLabel="Explorar Demostración"
              />
            ))}
          </div>
        </section>
      )}

      {(examples.length > 0 || exercises.length > 0) && (
        <section id="material-practico" className="mb-20">
          <MaterialPracticoSection examples={examples} exercises={exercises} />
        </section>
      )}

      {useCases.length > 0 && (
        <section id="aplicaciones" className="mb-20">
          <AplicacionesSection useCases={useCases} />
        </section>
      )}

      {lemmas.length > 0 && (
        <section id="lemas" className="my-16">
          <SubtleSeparator />
          <SectionTitle>Lemas Previos</SectionTitle>
          <div className="grid gap-4 lg:grid-cols-2">
            {lemmas.map(lem => (
              <ContentCard
                key={lem.slug}
                href={`/teorema/${lem.id}`}
                title={lem.title}
                description={lem.description}
                type="lema"
                layout="row"
              />
            ))}
          </div>
        </section>
      )}

      {corollaries.length > 0 && (
        <section id="corolarios" className="my-16">
          <SubtleSeparator />
          <SectionTitle>Corolarios Derivados</SectionTitle>
          <div className="grid gap-4 lg:grid-cols-2">
            {corollaries.map(cor => (
              <ContentCard
                key={cor.slug}
                href={`/teorema/${cor.id}`}
                title={cor.title}
                description={cor.description}
                type="corolario"
                layout="row"
              />
            ))}
          </div>
        </section>
      )}

      <div className="mt-24">
        <ReadingButton id={slug} />
      </div>
    </FadeIn>
  );

  return (
    <ContentLayout
      className="theorem-content-layout"
      pageType={theorem.type || 'teorema'}
      metadata={<MetadataSidebar />}
      diagram={Simulation ? (
        <DiagramSlot>
          <Simulation />
        </DiagramSlot>
      ) : undefined}
      diagramLabel={`Visualización de ${theorem.title}`}
      secondary={renderSecondaryContent()}
    >
      {renderMainContent()}
    </ContentLayout>
  );
};
