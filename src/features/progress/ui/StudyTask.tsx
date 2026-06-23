import React from 'react';
import { Link } from 'wouter';
import { useProgressStore } from '@/features/progress/UserProgressStore';
import { db } from '@/entities/content';
import { StudyPlanContext } from '@/app/providers/StudyPlanContext';

/**
 * Define las propiedades de una tarea de estudio dentro del plan.
 */
interface StudyTaskProps {
  /** ID único o slug del elemento de contenido */
  id: string;
  /** Tipo de contenido para formatear el botón y el icono visualmente */
  type: 'teorema' | 'ejercicio' | 'ejemplo' | 'caso' | 'lección' | 'definicion';
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
  caso: '/caso/', definicion: '/definicion/',
};

function lookupExists(type: string, id: string): boolean {
  if (type === 'teorema') return !!db.getTheorem(id);
  if (type === 'ejercicio') return !!db.getExercise(id);
  if (type === 'ejemplo') return !!db.getExample(id);
  if (type === 'caso') return !!db.getUseCase(id);
  if (type === 'definicion') return !!db.getDefinition(id);
  return true; // lección y otros: asumimos que existen
}

export const StudyTask: React.FC<StudyTaskProps> = ({ id, type, title }) => {
  const { isRead } = useProgressStore();
  const completed = isRead(id);
  const context = React.useContext(StudyPlanContext);
  const registerTaskRef = context?.registerTaskRef;
  
  const href = TYPE_PATH_PREFIX[type] ? `${TYPE_PATH_PREFIX[type]}${id}` : `/${id}`;
  const exists = lookupExists(type, id);

  const isTheory = ['teorema', 'definicion', 'lección'].includes(type);
  const isPractice = ['ejercicio', 'ejemplo', 'caso'].includes(type);
  const containerStyle = isTheory ? 'border-solid bg-lienzo' : 'border-dashed border-2 bg-carbon/[0.02]';

  let actionLabel: string;
  if (completed) {
    actionLabel = 'Asimilado';
  } else if (isPractice) {
    actionLabel = 'Practicar →';
  } else {
    actionLabel = 'Estudiar →';
  }

  if (!exists && type !== 'lección') {
    return (
      <div ref={(el) => registerTaskRef?.(id, el)} className={`flex flex-col md:flex-row md:items-center gap-4 p-5 my-6 border-2 border-carbon/15 opacity-60 ${containerStyle}`}>
        <div className="w-5 h-5 border-2 border-carbon/15 flex items-center justify-center shrink-0">
          <span className="text-carbon/30 text-[10px]">◈</span>
        </div>
        <div>
          <div className="text-[9px] font-sans uppercase tracking-[0.2em] text-carbon/50 mb-1 font-bold">{type}</div>
          <h3 className="text-xl font-serif text-carbon" style={{ fontVariant: 'small-caps' }}>{title}</h3>
          <div className="text-xs italic text-carbon/50 mt-1">Próximamente</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={(el) => registerTaskRef?.(id, el)}>
      <Link href={href}>
        <a 
          className={`group elegant-panel flex flex-col md:flex-row md:items-center gap-4 p-5 my-6 ${completed ? 'bg-salvia/5 border-salvia/30' : ''}`}
          style={{ '--hover-accent': completed ? 'var(--theme-salvia)' : 'var(--theme-terracota)' } as React.CSSProperties}
        >
          <div className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-all duration-300 ${
            completed 
              ? 'border-salvia bg-transparent rotate-45' 
              : 'border-carbon/30 rotate-0 group-hover:rotate-45 group-hover:border-terracota'
          }`}>
            {completed && (
              <div className="w-2.5 h-2.5 bg-salvia scale-animation"></div>
            )}
          </div>
          <div className="flex-1">
            <div className={`text-[9px] font-sans uppercase tracking-[0.2em] mb-1 font-bold transition-colors ${completed ? 'text-salvia/80' : 'text-carbon/50 group-hover:text-terracota'}`}>
              {type}
            </div>
            <h3 className={`text-xl font-serif font-bold transition-colors ${completed ? 'text-salvia' : 'text-carbon group-hover:text-terracota'}`} style={{ fontVariant: 'small-caps' }}>
              {title}
            </h3>
          </div>
          <div className={`text-[10px] font-sans uppercase tracking-widest font-bold transition-colors ${completed ? 'text-salvia' : 'text-carbon/40 group-hover:text-terracota'}`}>
            {actionLabel}
          </div>
        </a>
      </Link>
    </div>
  );
};
