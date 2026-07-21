import React from 'react';
import { Link } from 'wouter';
import { useProgressStore } from '@/features/progress/UserProgressStore';
import { db } from '@/entities/content';
import { StudyPlanContext } from '@/features/progress/context/StudyPlanContext';
import { ContentThumbnail } from './ContentThumbnail';

/**
 * Define las propiedades de una tarea de estudio dentro del plan.
 */
interface StudyTaskProps {
  /** ID único o slug del elemento de contenido */
  id: string;
  /** Tipo de contenido para formatear el botón y el icono visualmente */
  type: 'teorema' | 'ejercicio' | 'ejemplo' | 'caso' | 'metodo' | 'definicion' | 'axioma';
  /** Título human-readable que se mostrará en la lista */
  title: string;
}

/**
 * Componente tipo "tarjeta" que se utiliza en la página del Plan de Estudio.
 * Funciona como un enlace hacia el contenido específico, mostrando un rombo 
 * que se rellena con color cuando la tarea se marca como leída.
 * Soporta registro en `StudyPlanContext` para permitir scroll interactivo.
 */
const TYPE_PATH_PREFIX: Record<string, string> = {
  teorema: '/teorema/', ejercicio: '/ejercicio/', ejemplo: '/ejemplo/',
  caso: '/caso/', definicion: '/definicion/', axioma: '/axioma/',
  metodo: '/metodo/',
};

function lookupExists(id: string): boolean {
  return !!(
    db.getTheorem(id) ||
    db.getDefinition(id) ||
    db.axioms.get(id) ||
    db.getUseCase(id) ||
    db.getExample(id) ||
    db.getExercise(id) ||
    db.getMethod(id) ||
    db.models.get(id) ||
    db.demos.get(id)
  );
}

export const StudyTask: React.FC<StudyTaskProps> = ({ id, type, title }) => {
  const { isRead } = useProgressStore();
  const completed = isRead(id);
  const context = React.useContext(StudyPlanContext);
  const registerTaskRef = context?.registerTaskRef;
  const isLocked = context?.isLocked ? context.isLocked(id) : false;
  
  const exists = lookupExists(id);

  // Resolver el tipo real a partir de la DB para ser resiliente a imprecisiones de metadatos en MDX
  let resolvedType: string = type;
  if (db.getTheorem(id))          resolvedType = 'teorema';
  else if (db.axioms.get(id))     resolvedType = 'axioma';
  else if (db.getDefinition(id))  resolvedType = 'definicion';
  else if (db.getUseCase(id))     resolvedType = 'caso';
  else if (db.getExample(id))     resolvedType = 'ejemplo';
  else if (db.getExercise(id))    resolvedType = 'ejercicio';
  else if (db.getMethod(id))      resolvedType = 'metodo';

  const href = TYPE_PATH_PREFIX[resolvedType] ? `${TYPE_PATH_PREFIX[resolvedType]}${id}` : `/${id}`;

  const isTheory = ['teorema', 'definicion', 'metodo', 'axioma'].includes(resolvedType);
  const isPractice = ['ejercicio', 'ejemplo', 'caso'].includes(resolvedType);
  const containerStyle = isTheory ? 'border-solid bg-lienzo' : 'border-dashed border-2 bg-carbon/[0.02]';

  let actionLabel: string;
  if (isLocked) {
    actionLabel = 'Bloqueado';
  } else if (completed) {
    actionLabel = 'Asimilado';
  } else if (isPractice) {
    actionLabel = 'Practicar →';
  } else {
    actionLabel = 'Estudiar →';
  }

  if (!exists) {
    return (
      <div
        ref={(el) => registerTaskRef?.(id, el)}
        data-node-id={id}
        className={`flex flex-col md:flex-row md:items-center gap-4 p-5 my-6 border-2 border-carbon/15 opacity-60 ${containerStyle}`}
      >
        <div className="w-5 h-5 border-2 border-carbon/15 flex items-center justify-center shrink-0">
          <span className="text-carbon/30 text-[10px]">◈</span>
        </div>
        <div>
          <div className="text-[9px] font-sans uppercase tracking-[0.2em] text-carbon/50 mb-1 font-bold">{type}</div>
          <h3 className="text-xl font-serif text-carbon">{title}</h3>
          <div className="text-xs italic text-carbon/50 mt-1">Próximamente</div>
        </div>
      </div>
    );
  }

  // Renderizado en estado Bloqueado (Niebla de Guerra)
  if (isLocked) {
    return (
      <div
        ref={(el) => registerTaskRef?.(id, el)}
        data-node-id={id}
        className={`flex flex-col md:flex-row md:items-center gap-4 p-5 my-6 border border-carbon/10 bg-carbon/[0.01] filter blur-[0.6px] opacity-40 select-none pointer-events-none ${containerStyle}`}
      >
        <div className="w-5 h-5 border border-carbon/20 flex items-center justify-center shrink-0 rotate-0 opacity-40">
          <span className="text-carbon/30 text-[10px]">◈</span>
        </div>
        <div className="flex-1">
          <div className="text-[9px] font-sans uppercase tracking-[0.2em] text-carbon/40 mb-1 font-bold">
            {type} (Bloqueado)
          </div>
          <h3 className="text-xl font-serif text-carbon/50 font-bold">
            {title}
          </h3>
          <div className="text-xs italic text-carbon/40 mt-1">Asimila los conceptos previos para desbloquear</div>
        </div>
        <div className="text-[10px] font-sans uppercase tracking-widest font-bold text-carbon/30">
          {actionLabel}
        </div>
      </div>
    );
  }

  return (
    <div ref={(el) => registerTaskRef?.(id, el)} data-node-id={id}>
      <Link href={href}>
        <a 
          className={`group elegant-panel flex flex-col md:flex-row md:items-center gap-4 p-5 my-6 ${completed ? 'bg-salvia/5 border-salvia/30' : ''}`}
          style={{ '--hover-accent': completed ? 'var(--theme-salvia)' : 'var(--page-accent)' } as React.CSSProperties}
        >
          <div className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-all duration-300 ${
            completed 
              ? 'border-salvia bg-transparent rotate-45' 
              : 'page-accent-group-border border-carbon/30 rotate-0 group-hover:rotate-45'
          }`}>
            {completed && (
              <div className="w-2.5 h-2.5 bg-salvia scale-animation"></div>
            )}
          </div>

          <div className="flex-1">
            <div className={`text-[9px] font-sans uppercase tracking-[0.2em] mb-1 font-bold transition-colors ${completed ? 'text-salvia/80' : 'page-accent-group-hover text-carbon/50'}`}>
              {type}
            </div>
            <h3 className={`text-xl font-serif font-bold transition-colors ${completed ? 'text-salvia' : 'page-accent-group-hover text-carbon'}`}>
              {title}
            </h3>
          </div>

          {/* Miniatura gráfica visual de la tarea */}
          <div className="hidden sm:block shrink-0">
            <ContentThumbnail id={id} />
          </div>

          <div className={`text-[10px] font-sans uppercase tracking-widest font-bold transition-colors ${completed ? 'text-salvia' : 'page-accent-group-hover text-carbon/40'}`}>
            {actionLabel}
          </div>
        </a>
      </Link>
    </div>
  );
};
