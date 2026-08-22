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
          <div className="ac-label ac-label--xs ac-label--soft mb-1">{type}</div>
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
        className={`flex flex-col md:flex-row md:items-center gap-4 p-5 my-6 border border-carbon/10 bg-carbon/[0.01] filter blur-[0.6px] opacity-40 select-none pointer-events-none ${containerStyle}`}
      >
        <div className="w-5 h-5 border border-carbon/20 flex items-center justify-center shrink-0 rotate-0 opacity-40">
          <span className="text-carbon/30 text-[10px]">◈</span>
        </div>
        <div className="flex-1">
          <div className="ac-label ac-label--xs ac-label--faint mb-1">
            {type} ({t('studyPlan', 'locked')})
          </div>
          <h3 className="text-xl font-serif text-carbon/50 font-bold">
            {displayTitle}
          </h3>
          <div className="text-xs italic text-carbon/40 mt-1">
            {t('studyPlan', 'unlockHint')}
          </div>
        </div>
        <div className="ac-eyebrow ac-eyebrow--sm font-bold text-carbon/30">
          {actionLabel}
        </div>
      </div>
    );
  }

  return (
    <div ref={(el) => registerTaskRef?.(id, el)} data-node-id={id}>
      <Link href={href}>
        <span 
          className={`group elegant-panel flex flex-col md:flex-row md:items-center gap-4 p-5 my-6 cursor-pointer ${completed ? 'bg-canela/5 border-canela/30' : ''}`}
          style={{ ['--hover-accent' as string]: completed ? 'var(--theme-canela)' : 'var(--page-accent)' }}
        >
          <div className={`w-5 h-5 border flex items-center justify-center shrink-0 transition-all duration-300 ${
            completed 
              ? 'border-canela bg-transparent rotate-45' 
              : 'page-accent-group-border border-carbon/30 rotate-0 group-hover:rotate-45'
          }`}>
            {completed && (
              <div className="w-2.5 h-2.5 bg-canela scale-animation"></div>
            )}
          </div>

          <div className="flex-1">
            <div className={`ac-label ac-label--xs mb-1 font-bold transition-colors ${completed ? 'text-canela/80' : 'page-accent-group-hover text-carbon/50'}`}>
              {type}
            </div>
            <h3 className={`text-xl font-serif font-bold transition-colors ${completed ? 'text-canela' : 'page-accent-group-hover text-carbon'}`}>
              {displayTitle}
            </h3>
          </div>

          {/* Miniatura gráfica visual de la tarea */}
          <div className="hidden sm:block shrink-0">
            <ContentThumbnail id={id} />
          </div>

          <div className={`ac-eyebrow ac-eyebrow--sm font-bold transition-colors ${completed ? 'text-canela' : 'page-accent-group-hover text-carbon/40'}`}>
            {actionLabel}
          </div>
        </span>
      </Link>
    </div>
  );
};
