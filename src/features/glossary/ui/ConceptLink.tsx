import React from 'react';
import { Link } from 'wouter';
import { useGlossaryStore, dictionary } from '@/features/glossary/GlossaryStore';
import { db } from '@/entities/content';
import { useProgressStore } from '@/features/progress/UserProgressStore';
import { useMathStore } from '@/app/providers/MathStoreContext';

interface ConceptLinkProps {
  targetId: string | string[];
  isDependency?: boolean;
  children: React.ReactNode;
  /** ID del elemento gráfico en el diagrama lateral a resaltar (opcional) */
  highlightTarget?: string;
  /** Token de la paleta Arts & Crafts para colorear el subrayado/fondo de interactividad (opcional) */
  highlightColor?: string;
}

const isIdValid = (id: string): boolean => !!(  
  dictionary[id] || db.getTheorem(id) || db.getDefinition(id) || db.getMathematicianById(id) ||
  db.lessons.get(id) || db.examples.get(id) || db.exercises.get(id) ||
  db.usecases.get(id) || db.axioms.get(id) || db.getAxiomaticSystem(id) ||
  db.models.get(id) || db.demos.get(id)
);

const COLOR_MAP: Record<string, string> = {
  'terracota': 'var(--theme-terracota)',
  'salvia': 'var(--theme-salvia)',
  'pizarra': 'var(--theme-pizarra)',
  'carbon': 'var(--theme-carbon)',
  'granada': 'var(--theme-granada)',
  'ocre': 'var(--theme-ocre)',
  'pavo': 'var(--theme-pavo)',
  'musgo': 'var(--theme-musgo)',
};

export const ConceptLink: React.FC<ConceptLinkProps> = ({
  targetId,
  children,
  highlightTarget,
  highlightColor
}) => {
  const { openTerm, activeTerms } = useGlossaryStore();
  const setVariable = useMathStore((state) => state.setVariable);

  const targetIds = Array.isArray(targetId) ? targetId : [targetId];
  const isRead = useProgressStore(state => targetIds.every(id => state.isRead(id)));
  
  const validIds = targetIds.filter(isIdValid);
  const allValid = validIds.length === targetIds.length;
  const isActive = activeTerms ? targetIds.some(id => activeTerms.includes(id)) : false;

  const dataAttr = validIds.length > 0 ? validIds.join(',') : undefined;

  // Manejadores para la interactividad del gráfico
  const handleMouseEnter = () => {
    if (highlightTarget) setVariable('highlight', highlightTarget);
  };
  const handleMouseLeave = () => {
    if (highlightTarget) setVariable('highlight', null);
  };
  const handleClickHighlight = () => {
    if (highlightTarget) setVariable('highlight', highlightTarget);
  };

  // Estilos visuales de interactividad si tiene highlightTarget
  const cssColor = highlightColor ? (COLOR_MAP[highlightColor] ?? COLOR_MAP['salvia']) : undefined;
  const highlightStyles: React.CSSProperties = cssColor ? {
    borderColor: cssColor,
    backgroundColor: `color-mix(in srgb, ${cssColor} 12%, transparent)`,
  } : {};

  if (!allValid) {
    const firstInvalid = targetIds.find(id => !isIdValid(id)) || targetIds[0];

    return (
      <Link
        href={`/construccion/${firstInvalid}`}
        data-target-id={dataAttr}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClickHighlight}
        style={highlightStyles}
        className={[
          "page-accent-link font-bold underline decoration-dashed decoration-2 underline-offset-4 transition-all duration-150 rounded-none cursor-pointer",
          highlightTarget ? "border-b-2 box-decoration-clone px-[2px] py-[1px]" : ""
        ].join(' ')}
        title={`"${firstInvalid}" — página en construcción`}
      >
        {children}
      </Link>
    );
  }

  return (
    <span
      onClick={() => {
        openTerm(targetIds);
        handleClickHighlight();
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-target-id={targetIds.join(',')}
      title={`Ver contenido relacionado`}
      style={highlightStyles}
      className={[
        'page-accent-link font-bold cursor-pointer transition-all duration-150 rounded-none',
        isActive
          ? 'underline decoration-2 underline-offset-4'
          : 'underline decoration-2 underline-offset-4',
        highlightTarget ? "border-b-2 box-decoration-clone px-[2px] py-[1px]" : ""
      ].join(' ')}
    >
      {children}
      {isRead && <span className="ml-[2px] text-salvia opacity-80" style={{ fontSize: '0.85em' }}>✓</span>}
    </span>
  );
};
