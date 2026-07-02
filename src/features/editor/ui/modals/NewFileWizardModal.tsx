import React from 'react';
import type { WizardData } from '@/features/editor/hooks/useEditorState';
import {
  EDITOR_THEME_COLOR_OPTIONS,
  normalizeContentId,
} from '@/features/editor/lib/editorContracts';

interface NewFileWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  wizardData: WizardData;
  setWizardData: (data: WizardData) => void;
  onConfirm: (data: WizardData) => void;
}

export const NewFileWizardModal: React.FC<NewFileWizardModalProps> = ({
  isOpen,
  onClose,
  wizardData,
  setWizardData,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-carbon/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-carbon/10 bg-white/90 shrink-0">
          <h3 className="text-2xl font-serif font-bold text-carbon">Nuevo Documento</h3>
          <p className="text-sm text-carbon/60 mt-1">Configura la estructura inicial de tu página.</p>
        </div>
        <div className="p-6 overflow-y-auto space-y-4 bg-carbon/5 flex-1">
          <div>
            <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Tipo de Documento</label>
            <select
              className="w-full bg-white p-2 border border-carbon/20 rounded focus:outline-none focus:border-salvia"
              value={wizardData.type}
              onChange={(e) => setWizardData({ ...wizardData, type: e.target.value })}
            >
              <option value="theorems">Teorema</option>
              <option value="definitions">Definición</option>
              <option value="lessons">Lección</option>
              <option value="demonstrations">Demostración</option>
              <option value="mathematicians">Biografía (Matemático)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">ID (slug del archivo) *</label>
            <input type="text" placeholder="ej: mi-nuevo-teorema" className="w-full bg-white p-2 border border-carbon/20 rounded focus:outline-none focus:border-salvia"
              value={wizardData.id}
              onChange={(e) => setWizardData({ ...wizardData, id: normalizeContentId(e.target.value) })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Título *</label>
            <input type="text" placeholder="ej: Teorema de Tales" className="w-full bg-white p-2 border border-carbon/20 rounded focus:outline-none focus:border-salvia"
              value={wizardData.title}
              onChange={(e) => setWizardData({ ...wizardData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Breve Descripción</label>
            <textarea className="w-full bg-white p-2 border border-carbon/20 rounded focus:outline-none focus:border-salvia resize-none h-20"
              value={wizardData.description}
              onChange={(e) => setWizardData({ ...wizardData, description: e.target.value })}
            />
          </div>
          <div className="border-t border-carbon/10 pt-4 mt-4">
            <h4 className="text-xs uppercase tracking-widest text-carbon/50 font-bold mb-4">Campos Opcionales</h4>
            {wizardData.type === 'mathematicians' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Época (Era)</label>
                  <input type="text" placeholder="ej: 300 a.C." className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.era} onChange={(e) => setWizardData({ ...wizardData, era: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Nacimiento</label>
                  <input type="text" placeholder="ej: c. 325 a.C., Alejandría" className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.birth} onChange={(e) => setWizardData({ ...wizardData, birth: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Fallecimiento</label>
                  <input type="text" placeholder="ej: c. 265 a.C." className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.death} onChange={(e) => setWizardData({ ...wizardData, death: e.target.value })} />
                </div>
              </div>
            )}
            {(wizardData.type === 'theorems' || wizardData.type === 'definitions') && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Color Temático</label>
                  <select className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.color} onChange={(e) => setWizardData({ ...wizardData, color: e.target.value })}>
                    {EDITOR_THEME_COLOR_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Autores (separados por coma)</label>
                  <input type="text" placeholder="ej: euclides, pitagoras" className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.authors} onChange={(e) => setWizardData({ ...wizardData, authors: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Tags (separados por coma)</label>
                  <input type="text" placeholder="ej: geometria, aritmetica" className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.tags} onChange={(e) => setWizardData({ ...wizardData, tags: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Corolarios</label>
                    <input type="text" className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.corollaries} onChange={(e) => setWizardData({ ...wizardData, corollaries: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Demostraciones (IDs)</label>
                    <input type="text" className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.demos} onChange={(e) => setWizardData({ ...wizardData, demos: e.target.value })} />
                  </div>
                </div>
              </div>
            )}
            {wizardData.type === 'demonstrations' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Teorema Padre (ID)</label>
                    <input type="text" className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.parentTheorem} onChange={(e) => setWizardData({ ...wizardData, parentTheorem: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Método de Prueba</label>
                    <select className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.proofMethod} onChange={(e) => setWizardData({ ...wizardData, proofMethod: e.target.value })}>
                      <option value="">Selecciona Método...</option>
                      <option value="directo">Directo</option>
                      <option value="contradiccion">Por Contradicción</option>
                      <option value="induccion">Inducción</option>
                      <option value="contraposicion">Contraposición</option>
                      <option value="visual">Visual / Geométrica</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Lemas (separados por coma)</label>
                  <input type="text" className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.lemmas} onChange={(e) => setWizardData({ ...wizardData, lemmas: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Autores (separados por coma)</label>
                  <input type="text" className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.authors} onChange={(e) => setWizardData({ ...wizardData, authors: e.target.value })} />
                </div>
              </div>
            )}
            {wizardData.type === 'lessons' && (
              <div>
                <label className="block text-xs font-bold text-carbon/70 mb-1 uppercase tracking-wider">Tags (separados por coma)</label>
                <input type="text" placeholder="ej: algebra, logica" className="w-full bg-white p-2 border border-carbon/20 rounded" value={wizardData.tags} onChange={(e) => setWizardData({ ...wizardData, tags: e.target.value })} />
              </div>
            )}
          </div>
        </div>
        <div className="p-4 bg-white border-t border-carbon/10 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-carbon/60 hover:text-carbon font-bold text-sm">Cancelar</button>
          <button onClick={() => onConfirm(wizardData)} className="px-6 py-2 bg-salvia text-white rounded font-bold text-sm hover:bg-salvia/80 shadow-md">Crear Plantilla</button>
        </div>
      </div>
    </div>
  );
};
