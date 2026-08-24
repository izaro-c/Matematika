import { Suspense, useEffect, useState, useRef, useCallback, useMemo } from 'react';
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

import { StudyTask } from '@/content-pages/study-plan/ui/StudyTask';
import { StudyPlanMinimap } from '@/content-pages/study-plan/ui/StudyPlanMinimap';
import { StudyPlanCheckpoint } from '@/content-pages/study-plan/ui/StudyPlanCheckpoint';
import {
  ExerciseProvider,
  Pregunta,
  Hueco,
  Emparejar,
  Clasificador,
  Ordenacion,
  MatrizInteractiva,
  CanvasInteractivo,
  ErrorComun,
  Resolucion,
  Solucion,
  Apoyo,
} from '@/content-pages/exercise';

const mdxComponents = {
  StudyTask,
  StudyPlanMinimap,
  StudyPlanCheckpoint,
  Pregunta,
  Hueco,
  Emparejar,
  Clasificador,
  Ordenacion,
  MatrizInteractiva,
  CanvasInteractivo,
  ErrorComun,
  Resolucion,
  Solucion,
  Apoyo,
  Capitular,
  BlockTitle,
  OrnamentalDivider,
  GlossaryLink,
};

interface PhasePartition {
  phaseIndex: number;
  nodes: string[];
  checkpointId: string | null;
}

export const StudyPlanPage = () => {
  const { id } = useParams();
  const { lang, getLocalizedPath, t } = useI18n();
  const slug = id || '';
  const plan = db.getStudyPlan(slug, lang);
  const isFallback = slug ? db.isFallback(slug, lang) : false;
  const availableLangs = slug ? db.getAvailableLanguages(slug) : ['es'];
  
  const { isRead, isExerciseComplete } = useProgressStore();

  const isNodeDone = useCallback(
    (nodeId: string): boolean => isRead(nodeId) || isExerciseComplete(nodeId),
    [isRead, isExerciseComplete]
  );

  const [mounted, setMounted] = useState<boolean>(false);
  const [fillHeight, setFillHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const taskRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    setMounted(true);
  }, []);

  const registerTaskRef = useCallback((nodeId: string, el: HTMLElement | null) => {
    taskRefs.current[nodeId] = el;
  }, []);

  // 1. Partición estructurada y resolución de dependencias precalculadas
  const { nodePhaseMap, phaseStates } = useMemo(() => {
  if (!plan || !plan.requiredNodes) {
    return { nodePhaseMap: new Map<string, number>(), phaseStates: [] };
  }

  const rawNodes: string[] = plan.requiredNodes;
  const partitions: PhasePartition[] = [];
  const mapping = new Map<string, number>();

  let currentNodes: string[] = [];
  let currentCheckpoint: string | null = null;
  let phaseIdx = 0;

  for (const node of rawNodes) {
    mapping.set(node, phaseIdx);
    if (node.startsWith('checkpoint-')) {
      currentCheckpoint = node;
      partitions.push({
        phaseIndex: phaseIdx,
        nodes: currentNodes,
        checkpointId: currentCheckpoint,
      });
      currentNodes = [];
      currentCheckpoint = null;
      phaseIdx++;
    } else {
      currentNodes.push(node);
    }
  }

  if (currentNodes.length > 0 || currentCheckpoint !== null) {
    partitions.push({
      phaseIndex: phaseIdx,
      nodes: currentNodes,
      checkpointId: currentCheckpoint,
    });
  }

  // Cálculo secuencial con bloqueo interno para checkpoints
  const states: Array<{
    isPhaseUnlocked: boolean;
    isCheckpointUnlocked: boolean;
    isComplete: boolean;
  }> = [];

  let previousPhaseComplete = true;

  for (let i = 0; i < partitions.length; i++) {
    const partition = partitions[i];
    const isPhaseUnlocked = i === 0 || previousPhaseComplete;

    // Los nodos ordinarios de la fase deben estar todos completos para desbloquear el checkpoint
    const nodesComplete = partition.nodes.every((n) => isNodeDone(n));
    const isCheckpointUnlocked = isPhaseUnlocked && nodesComplete;

    const checkpointComplete = partition.checkpointId
      ? isNodeDone(partition.checkpointId)
      : true;

    const isComplete = nodesComplete && checkpointComplete;

    states.push({
      isPhaseUnlocked,
      isCheckpointUnlocked,
      isComplete,
    });

    previousPhaseComplete = isComplete;
  }

  return { nodePhaseMap: mapping, phaseStates: states };
}, [plan, isNodeDone]);

const isLocked = useCallback(
  (nodeId: string): boolean => {
    const phaseIdx = nodePhaseMap.get(nodeId);
    if (phaseIdx === undefined) return false;
    const state = phaseStates[phaseIdx];
    if (!state) return false;

    // Si es un checkpoint, requiere que su fase esté desbloqueada Y sus nodos resueltos
    if (nodeId.startsWith('checkpoint-')) {
      return !state.isCheckpointUnlocked;
    }

    // Si es un nodo ordinario, solo requiere que la fase esté desbloqueada
    return !state.isPhaseUnlocked;
  },
  [nodePhaseMap, phaseStates]
);

  // Sincronización geométrica de la línea de progreso
  useEffect(() => {
    if (!containerRef.current || !plan) return;

    const computeProgressLine = () => {
      const nodes = plan.requiredNodes || [];
      const completedNodes = nodes.filter((nodeId) => isNodeDone(nodeId));

      if (completedNodes.length === 0) {
        setFillHeight(0);
        return;
      }

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
        const middleY = relativeTop + targetRect.height / 2;
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
  }, [plan, isNodeDone]);

  if (!plan) {
    return (
      <div className="ac-page flex items-center justify-center">
        <h1 className="text-2xl italic opacity-50">{t('notFound', 'description')}</h1>
      </div>
    );
  }

  const requiredNodes = plan.requiredNodes || [];
  const totalItems = requiredNodes.length;
  const completedCount = requiredNodes.filter((nodeId) => isNodeDone(nodeId)).length;

  const MDXContent = plan.Component;

  return (
    <ExerciseProvider exerciseId={`study-plan-${slug}`}>
      <StudyPlanContext.Provider value={{ registerTaskRef, isLocked }}>
        <div className="bg-lienzo text-carbon font-serif pt-16 sm:pt-24 pb-32 min-h-screen relative overflow-x-hidden">
          <div
            className="fixed inset-0 z-0 pointer-events-none opacity-[0.02] mix-blend-multiply"
            style={{
              backgroundImage: `linear-gradient(var(--page-accent), var(--page-accent)), url(${publicAsset('/images/backgrounds/bg-botanical.webp')})`,
              backgroundBlendMode: 'color',
              backgroundSize: '400px',
            }}
          />

          <div className="relative z-20 max-w-4xl mx-auto px-5 sm:px-8 md:px-12 lg:px-8">
            <header className="mb-12 flex flex-col items-start">
              <Link href={getLocalizedPath('/')} className="inline-block mb-8">
                <span className="ac-link-back ac-interactive text-[9px] text-carbon/40 hover:text-carbon cursor-pointer">
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
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-carbon leading-[1.05] mb-6 break-words">
                {plan.title}
              </h1>
              <p className="text-lg sm:text-xl text-carbon/60 italic leading-relaxed max-w-2xl">
                {plan.description}
              </p>
              <div className="ac-eyebrow text-xs italic text-carbon/50 mt-6">
                {t('studyPlan', 'progress', { count: completedCount, total: totalItems })}
              </div>
              <div className="w-16 h-px bg-carbon/20 mt-12 mb-8" />

              {mounted && <StudyPlanMinimap requiredNodes={requiredNodes} />}
            </header>

            <div className="relative flex">
              <aside 
                aria-hidden="true" 
                className="hidden lg:block absolute -left-8 xl:-left-12 top-0 bottom-0 w-px bg-carbon/10 pointer-events-none"
              >
                <div 
                  className="page-accent-bg absolute top-0 -left-[1px] w-[3px] transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                  style={{ height: `${fillHeight}px` }}
                />
                <div 
                  className="page-accent-border absolute -left-[4px] w-[9px] h-[9px] border-2 bg-lienzo rotate-45 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                  style={{
                    top: `calc(${fillHeight}px - 4px)`,
                    opacity: fillHeight > 0 ? 1 : 0,
                    boxShadow: '1px 1px 0 var(--page-accent)',
                  }}
                />
              </aside>

              <main 
                ref={containerRef}
                className="w-full min-w-0 min-h-[500px] prose prose-stone sm:prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-headings:text-carbon prose-p:text-carbon/80 prose-p:leading-relaxed"
              >
                {mounted && MDXContent && (
                  <Suspense fallback={
                    <div className="animate-pulse flex space-x-4">
                      <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 bg-carbon/10 rounded" />
                      </div>
                    </div>
                  }>
                    <MDXProvider components={mdxComponents}>
                      <MDXContent />
                    </MDXProvider>
                  </Suspense>
                )}
                
                <div className="mt-24 sm:mt-32 pb-12 flex justify-center text-carbon/20" aria-hidden="true">
                  <span className="text-3xl">❦</span>
                </div>
              </main>
            </div>
          </div>
        </div>
      </StudyPlanContext.Provider>
    </ExerciseProvider>
  );
};