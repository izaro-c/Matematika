import React from 'react';
import { Link } from 'wouter';
import { useProgressStore } from '@/lib/stores/UserProgressStore';
import { db } from '@/data/content';
import { StudyPlanContext } from '@/content-pages/study-plan/context/StudyPlanContext';
import { ContentThumbnail } from './ContentThumbnail';
import { useI18n } from '@/i18n';

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

const TYPE_PATH_PREFIX: Record<string, string> = {
  teorema: '/teorema/', ejercicio: '/ejercicio/', ejemplo: '/ejemplo/',
  caso: '/caso/', definicion: '/definicion/', axioma: '/axioma/',
  metodo: '/metodo/',
};

function lookupExists(id: string): boolean {
  return !!(
    db.getTheorem(id) ||
    db.getDefinition(id) ||
    db.getAxiom(id) ||
    db.getUseCase(id) ||
    db.getExample(id) ||
    db.getExercise(id) ||
    db.getMethod(id) ||
    db.getModel(id) ||
    db.getDemo(id)
  );
}

export const StudyTask: React.FC<StudyTaskProps> = ({ id, type, title }) => {
  const { lang, t, getLocalizedPath } = useI18n();
  const { isRead, isExerciseComplete } = useProgressStore();
  const context = React.useContext(StudyPlanContext);
  const registerTaskRef = context?.registerTaskRef;
  const isLocked = context?.isLocked ? context.isLocked(id) : false;
  
  const exists = lookupExists(id);

  // Buscar título localizado en el idioma actual si existe
  const localizedDoc = db.getTheorem(id, lang)
    || db.getDefinition(id, lang)
    || db.getAxiom(id, lang)
    || db.getUseCase(id, lang)
    || db.getExample(id, lang)
    || db.getExercise(id, lang)
    || db.getMethod(id, lang);

  const displayTitle = localizedDoc?.title || title;

  // Resolver el tipo real a partir de la DB
  let resolvedType: string = type;
  if (db.getTheorem(id))          resolvedType = 'teorema';
  else if (db.getAxiom(id))       resolvedType = 'axioma';
  else if (db.getDefinition(id))  resolvedType = 'definicion';
  else if (db.getUseCase(id))     resolvedType = 'caso';
  else if (db.getExample(id))     resolvedType = 'ejemplo';
  else if (db.getExercise(id))    resolvedType = 'ejercicio';
  else if (db.getMethod(id))      resolvedType = 'metodo';

  const completed = resolvedType === 'ejercicio' ? isExerciseComplete(id) : isRead(id);

  const rawHref = TYPE_PATH_PREFIX[resolvedType] ? `${TYPE_PATH_PREFIX[resolvedType]}${id}` : `/${id}`;
  const href = getLocalizedPath(rawHref);

  const isTheory = ['teorema', 'definicion', 'metodo', 'axioma'].includes(resolvedType);
  const isPractice = ['ejercicio', 'ejemplo', 'caso'].includes(resolvedType);
  const containerStyle = isTheory ? 'border-solid bg-lienzo' : 'border-dashed border-2 bg-carbon/[0.02]';

  let actionLabel: string;
  if (isLocked) {
    actionLabel = t('studyPlan', 'locked');
  } else if (completed) {
    actionLabel = t('studyPlan', 'assimilated');
  } else if (isPractice) {
    actionLabel = t('studyPlan', 'practice');
  } else {
    actionLabel = t('studyPlan', 'study');
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
          <div className="ac-label ac-label--xs ac-label--soft mb-1">{t('metadata','types', type)}</div>
          <h3 className="text-xl font-serif text-carbon">{displayTitle}</h3>
          <div className="text-xs italic text-carbon/50 mt-1">{t('studyPlan', 'comingSoon')}</div>
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
        className={`elegant-panel flex items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 my-6 border border-carbon/50 bg-carbon/[0.01] filter blur-[0.5px] opacity-70 select-none pointer-events-none w-full ${containerStyle}`}
      >
        {/* Contenedor principal izquierdo: Cuadrado + Textos */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          {/* Cuadrado indicador bloqueado: Centrado verticalmente de forma fija */}
          <div 
            className="w-5 h-5 border border-carbon/50 flex items-center justify-center shrink-0 rotate-0 opacity-40" 
            aria-hidden="true"
          />

          {/* Textos: Justo al lado del cuadrado */}
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <div className="ac-label ac-label--xs ac-label--faint truncate leading-tight">
              {t('metadata', 'types', type)}
            </div>
            <h3 className="text-base sm:text-lg md:text-xl font-serif text-carbon/80 font-bold break-words leading-snug mt-0.5">
              {displayTitle}
            </h3>
          </div>
        </div>

        {/* Contenedor derecho: Miniatura y Acción */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 pl-2">
          {/* Miniatura gráfica visual de la tarea */}
          <div className="block shrink-0">
            <ContentThumbnail id={id} />
          </div>

          {/* Etiqueta de acción */}
          <div className="ac-eyebrow ac-eyebrow--sm font-bold text-carbon/50 whitespace-nowrap">
            {actionLabel}
          </div>
        </div>
      </div>
    );
  }

  return (
  <div ref={(el) => registerTaskRef?.(id, el)} data-node-id={id} className="w-full my-6">
    <Link href={href} className="block w-full no-underline">
      <div 
        className={`group elegant-panel flex items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 cursor-pointer transition-all duration-300 ${
          completed ? 'bg-canela/5 border-canela/30' : ''
        }`}
        style={{ ['--hover-accent' as string]: completed ? 'var(--theme-canela)' : 'var(--page-accent)' }}
      >
        {/* Contenedor principal izquierdo: Cuadrado + Textos */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
          {/* Cuadrado indicador: Centrado verticalmente de forma fija */}
          <div 
            className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-all duration-300 ${
              completed 
                ? 'border-canela bg-transparent rotate-45' 
                : 'page-accent-group-border border-carbon/30 rotate-0 group-hover:rotate-45'
            }`}
            aria-hidden="true"
          >
            {completed && (
              <div className="w-2.5 h-2.5 bg-canela scale-animation" />
            )}
          </div>

          {/* Textos: Pegados al cuadrado, ocupando el espacio disponible */}
          <div className="min-w-0 flex-1 flex flex-col justify-center">
            <div className={`ac-label ac-label--xs font-bold truncate transition-colors leading-tight ${
              completed ? 'text-canela/80' : 'page-accent-group-hover text-carbon/50'
            }`}>
              {t('metadata','types', type)}
            </div>
            <h3 className={`text-base sm:text-lg md:text-xl font-serif font-bold break-words transition-colors leading-snug mt-0.5 ${
              completed ? 'text-canela' : 'page-accent-group-hover text-carbon'
            }`}>
              {displayTitle}
            </h3>
          </div>
        </div>

        {/* Contenedor derecho: Miniatura y Acción */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 pl-2">
          {/* Miniatura gráfica (oculta en pantallas muy estrechas) */}
          <div className="block shrink-0">
            <ContentThumbnail id={id} />
          </div>

          {/* Etiqueta de acción */}
          <div className={`ac-eyebrow ac-eyebrow--sm font-bold whitespace-nowrap transition-colors ${
            completed ? 'text-canela' : 'page-accent-group-hover text-carbon/40'
          }`}>
            {actionLabel}
          </div>
        </div>
      </div>
    </Link>
  </div>
  );
};
