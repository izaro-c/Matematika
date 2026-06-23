import { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { Link, useParams } from 'wouter';
import { MDXProvider } from '@mdx-js/react';
import { db } from '@/entities/content';
import { useProgressStore } from '@/features/progress/UserProgressStore';
import { Capitular, BlockTitle, OrnamentalDivider } from '@/shared/ui/MDXBlocks';
import { StudyPlanContext } from '@/app/providers/StudyPlanContext';
import { GlossaryLink } from '@/shared/ui/GlossaryLink';

// Componentes interactivos permitidos en los planes
import { StudyTask } from '@/features/progress/ui/StudyTask';

const mdxComponents = {
  StudyTask,
  Capitular,
  BlockTitle,
  OrnamentalDivider,
  GlossaryLink,
};

/**
 * Página principal de un Plan de Estudio.
 * 
 * Un plan de estudio es un currículo orquestado que incluye pasos, lecciones, 
 * ejercicios y evaluaciones organizadas para dominar un tema.
 * Provee un contexto React (`StudyPlanContext`) para que los componentes interactivos
 * MDX puedan registrar su estado (completado, pendiente) e influir en el progreso global.
 * 
 * Renderiza un MDX que sirve como ruta de aprendizaje guiada e inyecta componentes
 * específicos como `StudyTask` que persisten el progreso del usuario.
 */
export const StudyPlanPage = () => {
  const { id } = useParams();
  const slug = id || '';
  const plan = db.getStudyPlan(slug);
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

  useEffect(() => {
    if (!plan || !containerRef.current) return;

    const updateHeight = () => {
      let firstIncompleteId: string | null = null;
      const nodes = plan.requiredNodes || [];
      for (const nodeId of nodes) {
        if (!isRead(nodeId)) {
          firstIncompleteId = nodeId;
          break;
        }
      }

      if (!firstIncompleteId) {
        // All complete
        setFillHeight(containerRef.current!.scrollHeight);
      } else {
        const el = taskRefs.current[firstIncompleteId];
        if (el) {
          // Calculate relative to the container
          const containerTop = containerRef.current!.getBoundingClientRect().top;
          const elTop = el.getBoundingClientRect().top;
          const offset = elTop - containerTop;
          // Add half the element's height so the line points exactly to the middle of the box
          setFillHeight(offset + el.offsetHeight / 2);
        } else {
          setFillHeight(0);
        }
      }
    };

    const timeout = setTimeout(updateHeight, 300);
    window.addEventListener('resize', updateHeight);

    let resizeObserver: ResizeObserver | null = null;
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updateHeight);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [plan, isRead]);

  if (!plan) {
    return (
      <div className="min-h-screen bg-lienzo flex items-center justify-center font-serif text-carbon">
        <h1 className="text-2xl italic opacity-50">El índice no existe.</h1>
      </div>
    );
  }

  const requiredNodes = plan.requiredNodes || [];
  const totalItems = requiredNodes.length;
  const completedCount = requiredNodes.filter(nodeId => isRead(nodeId)).length;

  const MDXContent = plan.Component;

  return (
    <StudyPlanContext.Provider value={{ registerTaskRef }}>
      <div className="bg-lienzo text-carbon font-serif pt-24 pb-32 min-h-screen relative">
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-[0.02] mix-blend-multiply fixed"
          style={{ backgroundImage: 'url(/images/bg-botanical.png)', backgroundSize: '400px' }}
        />

        <div className="relative z-20 max-w-4xl mx-auto px-6 md:px-0">
          
          <div className="mb-12 flex flex-col items-start">
            <Link href="/">
              <a className="inline-block text-[9px] font-sans tracking-[0.2em] uppercase text-carbon/40 hover:text-carbon transition-colors mb-8">
                ← Retornar al Archivo
              </a>
            </Link>
            <p className="text-xs tracking-[0.3em] uppercase font-sans mb-4 text-terracota font-bold">
              {plan.subtitle}
            </p>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-carbon leading-none mb-6" style={{ fontVariant: 'small-caps' }}>
              {plan.title}
            </h1>
            <p className="text-xl text-carbon/60 italic leading-relaxed max-w-2xl">
              {plan.description}
            </p>
            <div className="text-xs italic text-carbon/50 mt-6 font-sans tracking-widest uppercase">
              Progreso: {completedCount} de {totalItems} asimilados
            </div>
            <div className="w-16 h-px bg-carbon/20 mt-12" />
          </div>

          <div className="relative flex">
            {/* BARRA DE PROGRESO VERTICAL DE LONGITUD TOTAL */}
            <div className="hidden md:block absolute left-[-4rem] top-0 bottom-0 w-px bg-carbon/10">
               <div 
                  className="absolute top-0 left-[-1px] w-[3px] bg-terracota transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)]"
                  style={{ height: `${fillHeight}px` }}
               />
               <div 
                  className="absolute left-[-4px] w-[9px] h-[9px] border-2 border-terracota bg-lienzo rotate-45 transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[1px_1px_0px_var(--theme-terracota)]"
                  style={{ top: `calc(${fillHeight}px - 4px)`, opacity: fillHeight > 0 ? 1 : 0 }}
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
