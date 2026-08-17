import { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { Link, useParams } from 'wouter';
import { MDXProvider } from '@mdx-js/react';
import { db } from '@/data/content';
import { useProgressStore } from '@/lib/stores/UserProgressStore';
import { Capitular, BlockTitle, OrnamentalDivider } from '@/components/mdx/MDXBlocks';
import { StudyPlanContext } from '@/content-pages/study-plan/context/StudyPlanContext';
import { GlossaryLink } from '@/components/ui/GlossaryLink';
import { publicAsset } from '@/lib/routes';
import { UntranslatedFallbackBanner } from '@/components/content/UntranslatedFallbackBanner';
import { useI18n } from '@/i18n';

// Componentes interactivos permitidos en los planes
import { StudyTask } from '@/content-pages/study-plan/ui/StudyTask';
import { StudyPlanMinimap } from '@/content-pages/study-plan/ui/StudyPlanMinimap';
import { StudyPlanCheckpoint } from '@/content-pages/study-plan/ui/StudyPlanCheckpoint';

const mdxComponents = {
  StudyTask,
  StudyPlanMinimap,
  StudyPlanCheckpoint,
  Capitular,
  BlockTitle,
  OrnamentalDivider,
  GlossaryLink,
};

/**
 * Página principal de un Plan de Estudio.
 * 
 * Un plan de estudio es un recorrido orquestado que incluye pasos y páginas
 * ejercicios y evaluaciones organizadas para dominar un tema.
 * Provee un contexto React (`StudyPlanContext`) para que los componentes interactivos
 * MDX puedan registrar su estado (completado, pendiente) e influir en el progreso global.
 * 
 * Renderiza un MDX que sirve como ruta de aprendizaje guiada e inyecta componentes
 * específicos como `StudyTask` que persisten el progreso del usuario.
 */
export const StudyPlanPage = () => {
  const { id } = useParams();
  const { lang, getLocalizedPath, t } = useI18n();
  const slug = id || '';
  const plan = db.getStudyPlan(slug, lang);
  const isFallback = slug ? db.isFallback(slug, lang) : false;
  const availableLangs = slug ? db.getAvailableLanguages(slug) : ['es'];
  const { isRead } = useProgressStore();

  const [mounted, setMounted] = useState(false);
  const [fillHeight, setFillHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const taskRefs = useRef<Record<string, HTMLElement | null>>({});

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setMounted(true); }, []);

  const registerTaskRef = useCallback((nodeId: string, el: HTMLElement | null) => {
    taskRefs.current[nodeId] = el;
  }, []);

  const isLocked = useCallback((nodeId: string) => {
    if (!plan) return false;
    const nodes = plan.requiredNodes || [];

    // 1. Dividir los nodos en fases/bloques delimitados por checkpoints
    const blocks: string[][] = [];
    let currentBlock: string[] = [];
    for (const node of nodes) {
      currentBlock.push(node);
      if (node.startsWith('checkpoint-')) {
        blocks.push(currentBlock);
        currentBlock = [];
      }
    }
    if (currentBlock.length > 0) {
      blocks.push(currentBlock);
    }

    // 2. Localizar el bloque al que pertenece el nodo objetivo
    let targetBlockIdx = -1;
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].includes(nodeId)) {
        targetBlockIdx = i;
        break;
      }
    }

    // Si el nodo no está en ningún bloque conocido, no bloquearlo
    if (targetBlockIdx <= 0) return false;

    // 3. El bloque actual está bloqueado si el bloque ANTERIOR no está completado al 100%
    const prevBlock = blocks[targetBlockIdx - 1];
    const prevBlockCompleted = prevBlock.every((reqId) => {
      if (reqId.startsWith('checkpoint-')) return true;
      return isRead(reqId);
    });

    return !prevBlockCompleted;
  }, [plan, isRead]);

  useEffect(() => {
    if (!containerRef.current || !plan) return;

    const computeProgressLine = () => {
      const nodes = plan.requiredNodes || [];
      const completedNodes = nodes.filter((nodeId) => isRead(nodeId));

      if (completedNodes.length === 0) {
        setFillHeight(0);
        return;
      }

      // Encontrar el último nodo completado que tenga su elemento en el DOM
      let targetEl: HTMLElement | null = null;
      for (let i = completedNodes.length - 1; i >= 0; i--) {
        const id = completedNodes[i];
        const el = taskRefs.current[id];
        if (el) {
          targetEl = el;
          break;
        }
      }

      if (targetEl && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const targetRect = targetEl.getBoundingClientRect();
        const relativeTop = targetRect.top - containerRect.top;
        const middleY = relativeTop + (targetRect.height / 2);
        setFillHeight(Math.max(0, middleY));
      }
    };

    const timer = setTimeout(computeProgressLine, 100);
    window.addEventListener('resize', computeProgressLine);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(computeProgressLine);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', computeProgressLine);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [plan, isRead]);

  if (!plan) {
    return (
      <div className="ac-page flex items-center justify-center">
        <h1 className="text-2xl italic opacity-50">{t('notFound', 'description')}</h1>
      </div>
    );
  }

  const requiredNodes = plan.requiredNodes || [];
  const totalItems = requiredNodes.length;
  const completedCount = requiredNodes.filter(nodeId => isRead(nodeId)).length;

  const MDXContent = plan.Component;

  return (
    <StudyPlanContext.Provider value={{ registerTaskRef, isLocked }}>
      <div className="bg-lienzo text-carbon font-serif pt-24 pb-32 min-h-viewport relative">
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.02] mix-blend-multiply fixed"
          style={{
            backgroundImage: `linear-gradient(var(--page-accent), var(--page-accent)), url(${publicAsset('/images/bg-botanical.png')})`,
            backgroundBlendMode: 'color',
            backgroundSize: '400px',
          }}
        />

        <div className="relative z-20 max-w-4xl mx-auto px-6 md:px-0">
          
          <div className="mb-12 flex flex-col items-start">
            <Link href={getLocalizedPath('/')}>
              <span className="ac-link-back ac-interactive text-[9px] text-carbon/40 mb-8 inline-block hover:text-carbon cursor-pointer">
                {t('studyPlan', 'backToArchive')}
              </span>
            </Link>

            {isFallback && (
              <UntranslatedFallbackBanner
                availableLangs={availableLangs}
                className="mb-8 w-full"
              />
            )}

            <p className="page-accent-text ac-eyebrow ac-eyebrow--accent mb-4">
              {plan.subtitle}
            </p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-carbon leading-none mb-6">
              {plan.title}
            </h1>
            <p className="text-xl text-carbon/60 italic leading-relaxed max-w-2xl">
              {plan.description}
            </p>
            <div className="ac-eyebrow text-xs italic text-carbon/50 mt-6">
              {t('studyPlan', 'progress', { count: completedCount, total: totalItems })}
            </div>
            <div className="w-16 h-px bg-carbon/20 mt-12 mb-8" />

            {/* Renderizar el Minimapa del Plan de Estudios */}
            {mounted && <StudyPlanMinimap requiredNodes={requiredNodes} />}
          </div>

          <div className="relative flex">
            {/* BARRA DE PROGRESO VERTICAL DE LONGITUD TOTAL */}
            <div className="hidden md:block absolute left-[-4rem] top-0 bottom-0 w-px bg-carbon/10">
               <div 
                  className="page-accent-bg absolute top-0 left-[-1px] w-[3px] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                  style={{ height: `${fillHeight}px` }}
               />
               <div 
                  className="page-accent-border absolute left-[-4px] w-[9px] h-[9px] border-2 bg-lienzo rotate-45 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                  style={{
                    top: `calc(${fillHeight}px - 4px)`,
                    opacity: fillHeight > 0 ? 1 : 0,
                    boxShadow: '1px 1px 0 var(--page-accent)',
                  }}
               />
            </div>

            <div 
              ref={containerRef}
              className="flex-1 min-h-[500px] prose prose-lg prose-stone max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-carbon prose-p:text-carbon/80 prose-p:leading-relaxed"
            >
              {mounted && MDXContent && (
                <Suspense fallback={<div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-6 py-1"><div className="h-2 bg-carbon/10 rounded"></div></div></div>}>
                  <MDXProvider components={mdxComponents}>
                    <MDXContent />
                  </MDXProvider>
                </Suspense>
              )}
              
              <div className="mt-32 pb-12 flex justify-center text-carbon/20">
                <span className="text-3xl">❦</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </StudyPlanContext.Provider>
  );
};
