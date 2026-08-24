import React, { useRef, useState, useLayoutEffect, createContext, useContext } from 'react';
import { useI18n } from '@/i18n';
import type { ErrorComunData, ResolucionData, ExerciseCardTab } from '../../types';

export interface ExerciseCardContextType {
  bare?: boolean;
}

export const ExerciseCardContext = createContext<ExerciseCardContextType>({ bare: false });

export const useExerciseCardContext = () => useContext(ExerciseCardContext);

export interface ExerciseCardProps {
  id?: string;
  hasBookmarks?: boolean;
  errorComunData?: ErrorComunData | null;
  resolucionData?: ResolucionData | null;
  isCorrect?: boolean;
  hasFailed?: boolean;
  activeTab: ExerciseCardTab;
  onTabChange: (tab: ExerciseCardTab) => void;
  children: React.ReactNode;
  className?: string;
  pregunta?: string;
  bare?: boolean;
}

const RIBBON_CLIP_PATH = 'polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 6px), 0 100%)';

const RIBBON_COLORS = {
  carbon: {
    front: 'var(--theme-carbon)',
    fold: 'color-mix(in srgb, var(--theme-carbon) 65%, var(--theme-lienzo))',
    text: 'var(--theme-lienzo)',
  },
  terracota: {
    front: 'var(--theme-terracota)',
    fold: 'color-mix(in srgb, var(--theme-terracota) 65%, var(--theme-lienzo))',
    text: 'var(--theme-lienzo)',
  },
  musgo: {
    front: 'var(--theme-musgo)',
    fold: 'color-mix(in srgb, var(--theme-musgo) 65%, var(--theme-lienzo))',
    text: 'var(--theme-lienzo)',
  },
} as const;

interface RibbonBackProps {
  colorType: keyof typeof RIBBON_COLORS;
  isHighlighted?: boolean;
  isEmerging?: boolean;
  rightStyle: string;
}

const RibbonBack: React.FC<RibbonBackProps> = ({ colorType, isHighlighted, isEmerging, rightStyle }) => {
  const c = RIBBON_COLORS[colorType];
  return (
    <div
      className={`absolute top-0 select-none pointer-events-none ${
        isEmerging ? 'animate-bookmark-emerge-back' : isHighlighted ? 'animate-bookmark-bounce' : ''
      }`}
      style={{ right: rightStyle }}
    >
      <div
        className="absolute -top-2 -left-1 w-7 h-6 rounded-t-sm"
        style={{
          backgroundColor: c.fold,
          boxShadow: '0 -1px 2px rgba(0, 0, 0, 0.08)',
        }}
      />
    </div>
  );
};

interface RibbonFrontProps {
  title: string;
  ariaLabel: string;
  icon: React.ReactNode;
  isActive: boolean;
  isHighlighted?: boolean;
  isEmerging?: boolean;
  colorType: keyof typeof RIBBON_COLORS;
  onClick: () => void;
  rightStyle: string;
}

const RibbonFront: React.FC<RibbonFrontProps> = ({
  title,
  ariaLabel,
  icon,
  isActive,
  isHighlighted,
  isEmerging,
  colorType,
  onClick,
  rightStyle,
}) => {
  const c = RIBBON_COLORS[colorType];

  return (
    <div
      className={`absolute top-0 select-none pointer-events-auto ${
        isEmerging ? 'animate-bookmark-emerge-front' : isHighlighted ? 'animate-bookmark-bounce' : ''
      }`}
      style={{ right: rightStyle }}
    >
      <button
        type="button"
        role="tab"
        aria-selected={isActive}
        onClick={onClick}
        title={title}
        aria-label={ariaLabel}
        style={{
          clipPath: RIBBON_CLIP_PATH,
          backgroundColor: c.front,
        }}
        className={`absolute -top-2 w-7 rounded-tr-sm transition-all duration-300 ease-out flex flex-col items-center justify-start pt-2 pb-3 cursor-pointer drop-shadow-sm focus-visible:ring-2 focus-visible:ring-carbon focus-visible:outline-none ${
          isActive
            ? 'h-13 sm:h-14'
            : isHighlighted
              ? 'h-10 sm:h-11 hover:h-12'
              : 'h-8 sm:h-9 hover:h-11'
        }`}
      >
        <div style={{ color: c.text }} className="shrink-0 drop-shadow-xs">
          {icon}
        </div>
      </button>
    </div>
  );
};

/**
 * Contenedor visual estandarizado de tarjeta con marcapáginas Arts & Crafts
 * para todos los tipos de ejercicios.
 */
export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  id,
  hasBookmarks,
  errorComunData,
  resolucionData,
  isCorrect = false,
  hasFailed = false,
  activeTab,
  onTabChange,
  children,
  className = '',
  pregunta = '',
  bare,
}) => {
  const { t } = useI18n();
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const { bare: contextBare } = useExerciseCardContext();
  const isBare = bare ?? contextBare ?? false;

  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const updateHeight = () => {
      if (el.offsetHeight > 0) {
        setHeight(el.offsetHeight);
      }
    };

    updateHeight();

    if (typeof ResizeObserver !== 'undefined') {
      const resizeObserver = new ResizeObserver(updateHeight);
      resizeObserver.observe(el);
      return () => resizeObserver.disconnect();
    }
  }, [activeTab]);

  if (isBare) {
    return (
      <div id={id} className={`my-2 relative font-serif isolate ${className}`}>
        {pregunta && (
          <p className="text-base font-bold text-carbon mb-4 leading-relaxed relative z-30">
            {isCorrect && <span className="text-musgo mr-2">❦</span>}
            {pregunta}
          </p>
        )}
        {children}
      </div>
    );
  }

  const showResolutionBookmark = isCorrect && Boolean(resolucionData);
  const showBookmarks = hasBookmarks ?? Boolean(errorComunData || showResolutionBookmark);

  console.log('[ExerciseCard Debug]', {
  id,
  isCorrect,
  resolucionData,
  showResolutionBookmark,
  showBookmarks
});

  return (
    <div id={id} className={`my-8 relative font-serif isolate ${className}`}>
      {/* 1. Capa Trasera: Tiras que se extienden físicamente detrás del panel (z-0) */}
      {showBookmarks && (
        <div className="absolute top-0 right-2 sm:right-6 left-0 h-0 pointer-events-none z-0">
          <RibbonBack colorType="carbon" rightStyle="var(--ribbon-carbon-right, 5rem)" />
          {errorComunData && (
            <RibbonBack colorType="terracota" isHighlighted={hasFailed} rightStyle="var(--ribbon-terracota-right, 2.75rem)" />
          )}
          {showResolutionBookmark && (
            <RibbonBack colorType="musgo" isEmerging rightStyle="var(--ribbon-musgo-right, 0.5rem)" />
          )}
        </div>
      )}

      {/* 2. Capa Principal: Panel Arts & Crafts impreso (z-10) */}
      <div className={`p-6 md:p-8 elegant-panel relative z-10 overflow-visible transition-all duration-300 ease-out`}
          style={{ '--hover-accent': isCorrect ? 'var(--theme-musgo)' : undefined } as React.CSSProperties}>
        <div
          role="tabpanel"
          style={{ height: height !== undefined ? `${height}px` : undefined }}
          className="transition-[height] duration-300 ease-out motion-reduce:transition-none"
        >
          <div ref={contentRef} className="flow-root">
            {/* Pestaña: Pregunta */}
            {activeTab === 'pregunta' && (
              <div key="pregunta" className="animate-page-enter">
                {/* Muesca invisible para esquivar los marcapáginas */}
                {showBookmarks && (
                  <div className="float-right h-5 w-18 sm:w-22 pointer-events-none" />
                )}
                {pregunta && (
                  <p className={`text-base font-bold text-carbon mb-6 leading-relaxed relative z-30`}>
                    {isCorrect && <span className="text-musgo mr-2">❦</span>}
                    {pregunta}
                  </p>
                )}
                {children}
              </div>
            )}

            {/* Pestaña: Error Común */}
            {activeTab === 'error' && errorComunData && (
              <div key="error" className="animate-page-enter pt-2">
                <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-terracota/20">
                  <div className="flex items-center gap-2">
                    <span className="ac-label ac-label--sm ac-label--terracota-soft">
                      {t('exercise', 'commonError')}
                    </span>
                    {(errorComunData.titulo || errorComunData.title) && (
                      <span className="text-sm font-semibold text-carbon">
                        {errorComunData.titulo || errorComunData.title}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onTabChange('pregunta')}
                    className="text-xs text-carbon/60 hover:text-carbon font-sans flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    ← {t('exercise', 'backToQuestion') || 'Volver a la pregunta'}
                  </button>
                </div>
                <div className="text-sm text-carbon/80 leading-relaxed font-serif">
                  {errorComunData.children}
                </div>
              </div>
            )}

            {/* Pestaña: Resolución */}
            {activeTab === 'resolucion' && resolucionData && (
              <div key="resolucion" className="animate-page-enter pt-2">
                <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-musgo/20">
                  <div className="flex items-center gap-2">
                    <span className="ac-label ac-label--sm ac-label--musgo-soft">
                      ✦ {t('exercise', 'resolutionExplained')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onTabChange('pregunta')}
                    className="text-xs text-carbon/60 hover:text-carbon font-sans flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    ← {t('exercise', 'backToQuestion') || 'Volver a la pregunta'}
                  </button>
                </div>
                <div className="text-sm text-carbon/80 leading-relaxed font-serif">
                  {resolucionData.children}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Capa Frontal: Marcapáginas que caen por delante del panel (z-20) */}
      {showBookmarks && (
        <div
          role="tablist"
          aria-label={t('exercise', 'tabsAria')}
          className="absolute top-0 right-2 sm:right-6 left-0 h-0 pointer-events-none z-20"
          style={{
            ['--ribbon-carbon-right' as string]: '5rem',
            ['--ribbon-terracota-right' as string]: '2.75rem',
            ['--ribbon-musgo-right' as string]: '0.5rem',
          }}
        >
          <RibbonFront
            title={t('exercise', 'question')}
            ariaLabel={t('exercise', 'question')}
            icon={
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            }
            isActive={activeTab === 'pregunta'}
            colorType="carbon"
            onClick={() => onTabChange('pregunta')}
            rightStyle="var(--ribbon-carbon-right, 5rem)"
          />

          {errorComunData && (
            <RibbonFront
              title={t('exercise', 'commonError')}
              ariaLabel={t('exercise', 'commonError')}
              icon={
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              }
              isActive={activeTab === 'error'}
              isHighlighted={hasFailed}
              colorType="terracota"
              onClick={() => onTabChange(activeTab === 'error' ? 'pregunta' : 'error')}
              rightStyle="var(--ribbon-terracota-right, 2.75rem)"
            />
          )}

          {showResolutionBookmark && (
            <RibbonFront
              title={t('exercise', 'resolutionExplained')}
              ariaLabel={t('exercise', 'resolutionExplained')}
              icon={
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              }
              isActive={activeTab === 'resolucion'}
              isEmerging
              colorType="musgo"
              onClick={() => onTabChange(activeTab === 'resolucion' ? 'pregunta' : 'resolucion')}
              rightStyle="var(--ribbon-musgo-right, 0.5rem)"
            />
          )}
        </div>
      )}
    </div>
  );
};
