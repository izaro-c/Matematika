import React from 'react';
import type { TemplateKind } from '../../model/types';
import { useI18n } from '@/i18n';
import { Modal, RowButton } from '@/fixed-pages/editor/ui/primitives';

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
  return (
    <Modal open={isOpen} onClose={onClose} title={t('editor.diagramModals.initialTemplatesGallery')} size="md">
      <p className="mb-3 italic">{t('editor.diagramModals.presetsSubtitle')}</p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {PRESETS.map((p) => (
          <RowButton key={p.kind} className="items-start justify-start gap-3 border border-[color:var(--ed-rule-faint)] p-3" onClick={() => {
              onSelectPreset(p.kind, p.modelTitle);
              onClose();
            }}>
            <div className="shrink-0">{p.icon}</div>
            <div>
              <h4 className="font-semibold">{t(p.title)}</h4>
              <p className="text-sm text-carbon/65">{t(p.desc)}</p>
            </div>
          </RowButton>
        ))}
      </div>
    </Modal>
  );
};
