import React from 'react';
import type { TemplateKind } from '../../model/types';
import { useI18n } from '@/i18n';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (kind: TemplateKind, title: string) => void;
}

const PRESETS: { kind: TemplateKind; title: string; modelTitle: string; desc: string; icon: React.ReactNode }[] = [
  {
    kind: 'lienzo-inicial',
    title: 'editor.diagramModals.presetBlankTitle',
    modelTitle: 'Lienzo Vacío',
    desc: 'editor.diagramModals.presetBlankDesc',
    icon: (
      <svg className="w-6 h-6 text-canela" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    kind: 'triangulo-deformable',
    title: 'editor.diagramModals.presetTriangleTitle',
    modelTitle: 'Triángulo General',
    desc: 'editor.diagramModals.presetTriangleDesc',
    icon: (
      <svg className="w-6 h-6 text-canela" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3l9 17H3L12 3z" />
      </svg>
    ),
  },
  {
    kind: 'circunferencia',
    title: 'editor.diagramModals.presetCircleTitle',
    modelTitle: 'Circunferencia & Radio',
    desc: 'editor.diagramModals.presetCircleDesc',
    icon: (
      <svg className="w-6 h-6 text-canela" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" strokeWidth={1.8} />
        <line x1="12" y1="12" x2="20" y2="12" strokeWidth={1.8} />
      </svg>
    ),
  },
  {
    kind: 'eje-cartesiano',
    title: 'editor.diagramModals.presetAxisTitle',
    modelTitle: 'Eje Cartesiano con Deslizador',
    desc: 'editor.diagramModals.presetAxisDesc',
    icon: (
      <svg className="w-6 h-6 text-canela" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12h18M12 3v18" />
        <circle cx="17" cy="7" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    kind: 'lugar-geometrico',
    title: 'editor.diagramModals.presetLocusTitle',
    modelTitle: 'Lugar Geométrico (Mediatriz)',
    desc: 'editor.diagramModals.presetLocusDesc',
    icon: (
      <svg className="w-6 h-6 text-canela" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <line x1="4" y1="18" x2="20" y2="18" strokeWidth={1.8} />
        <line x1="12" y1="4" x2="12" y2="20" strokeWidth={1.8} strokeDasharray="3 3" />
        <circle cx="12" cy="9" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    kind: 'cuadrilatero-clasificable',
    title: 'editor.diagramModals.presetQuadTitle',
    modelTitle: 'Cuadrilátero & Diagonal',
    desc: 'editor.diagramModals.presetQuadDesc',
    icon: (
      <svg className="w-6 h-6 text-canela" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6l14-2 3 14-15 3z" />
        <line x1="4" y1="6" x2="21" y2="18" strokeWidth={1.5} strokeDasharray="3 3" />
      </svg>
    ),
  },
  {
    kind: 'demostracion-pasos',
    title: 'editor.diagramModals.presetStepsTitle',
    modelTitle: 'Demostración por Pasos',
    desc: 'editor.diagramModals.presetStepsDesc',
    icon: (
      <svg className="w-6 h-6 text-canela" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5l7 7-7 7" />
      </svg>
    ),
  },
  {
    kind: 'modelo-estatico',
    title: 'editor.diagramModals.presetFixedTitle',
    modelTitle: 'Modelo Fijo (No Interactivo)',
    desc: 'editor.diagramModals.presetFixedDesc',
    icon: (
      <svg className="w-6 h-6 text-canela" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth={1.8} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 11V7a4 4 0 018 0v4" />
      </svg>
    ),
  },
];

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  const { t } = useI18n();
  if (!isOpen) return null;

  return (
    <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/50 backdrop-blur-xs p-4">
      <div role="dialog" aria-modal="true" className="w-full max-w-2xl bg-lienzo rounded-2xl border border-carbon/15 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-carbon/10 bg-carbon/5">
          <div>
            <h2 className="font-serif font-bold text-base text-carbon">{t('editor.diagramModals.initialTemplatesGallery')}</h2>
            <p className="text-xs text-mora/70 italic">{t('editor.diagramModals.presetsSubtitle')}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-carbon/60 hover:text-carbon p-1 rounded-lg text-lg font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto">
          {PRESETS.map((p) => (
            <button
              key={p.kind}
              type="button"
              onClick={() => {
                onSelectPreset(p.kind, p.modelTitle);
                onClose();
              }}
              className="flex items-start space-x-3 p-3 rounded-xl border border-carbon/15 bg-carbon/5 hover:border-canela hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="p-2 bg-canela/10 rounded-xl group-hover:scale-110 transition-transform shrink-0">
                {p.icon}
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-carbon group-hover:text-canela transition-colors">
                  {t(p.title)}
                </h4>
                <p className="text-[11px] text-mora/80 leading-relaxed mt-0.5">{t(p.desc)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
