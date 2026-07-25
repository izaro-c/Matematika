import React from 'react';
import type { TemplateKind } from '../../editor/diagrams/model/types';

interface V2PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPreset: (kind: TemplateKind, title: string) => void;
}

const PRESETS: { kind: TemplateKind; title: string; desc: string; icon: React.ReactNode }[] = [
  {
    kind: 'lienzo-inicial',
    title: 'Lienzo Vacío',
    desc: 'Un lienzo limpio con un punto inicial A(0,0) para comenzar desde cero.',
    icon: (
      <svg className="w-6 h-6 text-salvia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    kind: 'triangulo-deformable',
    title: 'Triángulo General',
    desc: 'Triángulo ABC interactivo con tres vértices arrastrabiles y ángulo en C.',
    icon: (
      <svg className="w-6 h-6 text-salvia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3l9 17H3L12 3z" />
      </svg>
    ),
  },
  {
    kind: 'circunferencia',
    title: 'Circunferencia & Radio',
    desc: 'Centro O fijo, punto A periférico arrastrable y segmento de radio OA.',
    icon: (
      <svg className="w-6 h-6 text-salvia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8" strokeWidth={1.8} />
        <line x1="12" y1="12" x2="20" y2="12" strokeWidth={1.8} />
      </svg>
    ),
  },
  {
    kind: 'eje-cartesiano',
    title: 'Eje Cartesiano con Deslizador',
    desc: 'Plano cartesiano con rejilla, eje de coordenadas y parámetro slider t.',
    icon: (
      <svg className="w-6 h-6 text-salvia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 12h18M12 3v18" />
        <circle cx="17" cy="7" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    kind: 'lugar-geometrico',
    title: 'Lugar Geométrico (Mediatriz)',
    desc: 'Punto P restringido a deslizarse sobre la mediatriz equidistante de A y B.',
    icon: (
      <svg className="w-6 h-6 text-salvia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <line x1="4" y1="18" x2="20" y2="18" strokeWidth={1.8} />
        <line x1="12" y1="4" x2="12" y2="20" strokeWidth={1.8} strokeDasharray="3 3" />
        <circle cx="12" cy="9" r="2.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    kind: 'cuadrilatero-clasificable',
    title: 'Cuadrilátero & Diagonal',
    desc: 'Polígono de 4 lados con vértices libres y diagonal auxiliar discontinua.',
    icon: (
      <svg className="w-6 h-6 text-salvia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6l14-2 3 14-15 3z" />
        <line x1="4" y1="6" x2="21" y2="18" strokeWidth={1.5} strokeDasharray="3 3" />
      </svg>
    ),
  },
  {
    kind: 'demostracion-pasos',
    title: 'Demostración por Pasos',
    desc: 'Figura preparada con 3 pasos explicativos y resaltados progresivos.',
    icon: (
      <svg className="w-6 h-6 text-salvia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5l7 7-7 7" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5l7 7-7 7" />
      </svg>
    ),
  },
  {
    kind: 'modelo-estatico',
    title: 'Modelo Fijo (No Interactivo)',
    desc: 'Diagrama estático con puntos fijos sin interacción directa de arrastre.',
    icon: (
      <svg className="w-6 h-6 text-salvia" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth={1.8} />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 11V7a4 4 0 018 0v4" />
      </svg>
    ),
  },
];

export const V2PresetsModal: React.FC<V2PresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/50 backdrop-blur-xs p-4">
      <div role="dialog" aria-modal="true" className="w-full max-w-2xl bg-lienzo rounded-2xl border border-carbon/15 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-carbon/10 bg-carbon/5">
          <div>
            <h2 className="font-serif font-bold text-base text-carbon">Galería de Plantillas Iniciales</h2>
            <p className="text-xs text-pizarra/70 italic">Elige un esquema predefinido para acelerar la creación visual.</p>
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
                onSelectPreset(p.kind, p.title);
                onClose();
              }}
              className="flex items-start space-x-3 p-3 rounded-xl border border-carbon/15 bg-carbon/5 hover:border-salvia hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="p-2 bg-salvia/10 rounded-xl group-hover:scale-110 transition-transform shrink-0">
                {p.icon}
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-carbon group-hover:text-salvia transition-colors">
                  {p.title}
                </h4>
                <p className="text-[11px] text-pizarra/80 leading-relaxed mt-0.5">{p.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
