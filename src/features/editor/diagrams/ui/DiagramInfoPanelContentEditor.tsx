import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { DiagramInfoPanelBlock, DiagramInfoPanelRule, DiagramColorToken } from '@/shared/diagrams/public';
import type { VisualDiagramModel, VisualElement } from '../model/types';
import { DiagramExpressionField } from './DiagramExpressionField';
import { DiagramTextRulesEditor } from './DiagramTextRulesEditor';
import { DiagramTemplateField } from './DiagramTemplateField';
import { COLOR_OPTIONS } from '../model';
import { DiagramButton, DiagramField, DiagramPanel, DiagramTabBar } from './primitives';

interface DiagramInfoPanelContentEditorProps {
  model: VisualDiagramModel;
  panel: VisualElement;
  onElementChange: (update: Partial<VisualElement>) => void;
  onTextChange: (text: string) => void;
  onPropertiesChange: (update: NonNullable<VisualElement['properties']>) => void;
}

interface PanelBlockEditorProps {
  model: VisualDiagramModel;
  block: DiagramInfoPanelBlock;
  index: number;
  count: number;
  onChange: (block: DiagramInfoPanelBlock) => void;
  onMove: (direction: -1 | 1) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function nextBlockId(blocks: readonly DiagramInfoPanelBlock[]): string {
  const used = new Set(blocks.map(block => block.id));
  let index = blocks.length + 1;
  while (used.has(`bloque-${index}`)) index += 1;
  return `bloque-${index}`;
}

function panelAnchorReferences(model: VisualDiagramModel, element: VisualElement, anchorMode: 'reference' | 'viewport'): string[] {
  if (anchorMode === 'viewport') return [];
  if (element.refs.length > 0) return element.refs;
  return model.points[0] ? [model.points[0].id] : [];
}

const ColorSelector = ({ value, onChange, label }: { value: DiagramColorToken | undefined, onChange: (v: DiagramColorToken | undefined) => void, label: string }) => (
  <DiagramField label={label}>
    <select
      aria-label={label}
      value={value || ''}
      onChange={e => onChange(e.target.value as DiagramColorToken || undefined)}
    >
      <option value="">Por defecto (Pavo)</option>
      {COLOR_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
    </select>
  </DiagramField>
);

const PanelBlockEditor: React.FC<PanelBlockEditorProps> = ({
  model,
  block,
  index,
  count,
  onChange,
  onMove,
  onDuplicate,
  onDelete,
}) => {
  const [expanded, setExpanded] = useState(index === 0);
  const rules = block.rules ?? [];
  const patchRule = (ruleIndex: number, update: Partial<DiagramInfoPanelRule>) => onChange({
    ...block,
    rules: rules.map((rule, candidate) => candidate === ruleIndex ? { ...rule, ...update } : rule),
  });
  const moveRule = (ruleIndex: number, direction: -1 | 1) => {
    const target = ruleIndex + direction;
    if (target < 0 || target >= rules.length) return;
    const next = [...rules];
    [next[ruleIndex], next[target]] = [next[target], next[ruleIndex]];
    onChange({ ...block, rules: next });
  };

  return (
    <DiagramPanel
      title={`${index + 1} · ${block.title || block.id || 'Bloque sin título'}`}
      collapsible
      open={expanded}
      onOpenChange={setExpanded}
      className="border-b border-carbon/10 bg-transparent"
    >
        <div className="flex flex-wrap gap-2" role="group" aria-label={`Organizar ${block.title || block.id}`}>
          <DiagramButton variant="danger" disabled={index === 0} className="!min-h-0 border-carbon/15 bg-carbon/5 px-2 py-1 text-[10px] text-carbon/80 hover:bg-carbon/10" onClick={() => onMove(-1)}>↑ Subir</DiagramButton>
          <DiagramButton variant="danger" disabled={index === count - 1} className="!min-h-0 border-carbon/15 bg-carbon/5 px-2 py-1 text-[10px] text-carbon/80 hover:bg-carbon/10" onClick={() => onMove(1)}>↓ Bajar</DiagramButton>
          <DiagramButton variant="danger" className="!min-h-0 border-pavo/20 bg-pavo/5 px-2 py-1 text-[10px] text-pavo hover:bg-pavo/10" onClick={onDuplicate}>Duplicar</DiagramButton>
          <DiagramButton variant="danger" className="!min-h-0 ml-auto border-granada/20 bg-granada/5 px-2 py-1 text-[10px] text-granada hover:bg-granada/10" onClick={onDelete}>Eliminar bloque</DiagramButton>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DiagramField label="Identificador interno">
            <input aria-label={`Identificador del bloque ${index + 1}`} className="font-mono shadow-inner" value={block.id} onChange={event => onChange({ ...block, id: event.target.value })} />
          </DiagramField>
          <DiagramField label="Encabezado principal">
            <input aria-label={`Encabezado del bloque ${index + 1}`} className="shadow-inner" value={block.title ?? ''} onChange={event => onChange({ ...block, title: event.target.value || undefined })} placeholder="Ej. Por sus lados" />
          </DiagramField>
        </div>

        <div className="space-y-1">
          <DiagramTemplateField richText model={model} label="Contenido por defecto" ariaLabel={`Contenido por defecto del bloque ${index + 1}`} value={block.text} onChange={text => onChange({ ...block, text })} placeholder="Se muestra si ninguna variante condicional coincide." rows={3} />
        </div>

        <ColorSelector label="Color de acento por defecto" value={block.color} onChange={color => onChange({ ...block, color })} />

        {(block.expression || block.text.includes('{value}')) && <DiagramPanel title={`Compatibilidad con {'{value}'}`} collapsible defaultOpen={Boolean(block.expression)} className="border-l-2 border-carbon/10 bg-transparent pl-3">
          <DiagramExpressionField compact model={model} label={`Cálculo heredado de ${block.title || block.id}`} value={block.expression ?? ''} onChange={expression => onChange({ ...block, expression: expression || undefined })} optional />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DiagramField label="Unidad visual"><input aria-label={`Unidad base de ${block.id}`} value={block.unit ?? ''} onChange={event => onChange({ ...block, unit: event.target.value || undefined })} /></DiagramField>
            <DiagramField label="Precisión (decimales)"><input type="number" min="0" max="12" aria-label={`Decimales base de ${block.id}`} value={block.precision ?? 2} onChange={event => onChange({ ...block, precision: Number(event.target.value) })} /></DiagramField>
          </div>
        </DiagramPanel>}

        <section className="space-y-3 border-t border-carbon/10 pt-3" aria-label={`Variantes condicionales de ${block.title || block.id}`}>
          <header>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ocre">Variantes y Casos Específicos</h4>
            <p className="mt-1 text-[10px] leading-relaxed text-carbon/60">Se evalúan en orden. La primera condición que se cumpla reemplazará el texto, color y valor por defecto.</p>
          </header>

          <div className="space-y-3">
            {rules.map((rule, ruleIndex) => (
              <DiagramPanel
                key={`${block.id}-rule-${ruleIndex}`}
                title={rule.when ? `Caso ${ruleIndex + 1} (Condición: ${rule.when})` : `Caso ${ruleIndex + 1}`}
                collapsible
                defaultOpen={false}
                className="border-t border-carbon/10 bg-transparent"
              >
                <div className="flex flex-wrap gap-2">
                  <DiagramButton variant="danger" disabled={ruleIndex === 0} aria-label={`Subir caso ${ruleIndex + 1}`} className="!min-h-0 border-carbon/15 px-2 py-1 text-[10px] font-medium hover:bg-carbon/5" onClick={() => moveRule(ruleIndex, -1)}>↑ Subir</DiagramButton>
                  <DiagramButton variant="danger" disabled={ruleIndex === rules.length - 1} aria-label={`Bajar caso ${ruleIndex + 1}`} className="!min-h-0 border-carbon/15 px-2 py-1 text-[10px] font-medium hover:bg-carbon/5" onClick={() => moveRule(ruleIndex, 1)}>↓ Bajar</DiagramButton>
                  <DiagramButton variant="danger" className="!min-h-0 ml-auto border-granada/20 bg-granada/5 px-2 py-1 text-[10px] text-granada hover:bg-granada/10" onClick={() => onChange({ ...block, rules: rules.filter((_, candidate) => candidate !== ruleIndex) })}>Eliminar caso</DiagramButton>
                </div>

                <DiagramExpressionField model={model} label="¿Cuándo se activa este caso?" value={rule.when} onChange={when => patchRule(ruleIndex, { when })} help="Expresión matemática. Ej: approx(A.x, 0, 0.001) o dist(A, B) > 5." />

                <DiagramTemplateField richText model={model} label="Texto a mostrar en este caso" ariaLabel={`Contenido del caso ${ruleIndex + 1}`} value={rule.text} onChange={text => patchRule(ruleIndex, { text })} rows={3} />

                <ColorSelector label="Color de acento específico" value={rule.color} onChange={color => patchRule(ruleIndex, { color })} />

                {(rule.expression || rule.text.includes('{value}')) && <DiagramPanel title={`Compatibilidad con {'{value}'}`} collapsible defaultOpen={Boolean(rule.expression)} className="border-t border-carbon/10 bg-transparent">
                  <DiagramExpressionField compact model={model} label="Cálculo heredado del caso" ariaLabel="Fórmula para {value} si se cumple el caso" value={rule.expression ?? ''} onChange={expression => patchRule(ruleIndex, { expression: expression || undefined })} optional />
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <DiagramField label="Unidad visual"><input aria-label={`Unidad del caso ${ruleIndex + 1}`} className="shadow-inner" value={rule.unit ?? ''} onChange={event => patchRule(ruleIndex, { unit: event.target.value || undefined })} /></DiagramField>
                    <DiagramField label="Precisión (decimales)"><input type="number" min="0" max="12" aria-label={`Decimales del caso ${ruleIndex + 1}`} className="shadow-inner" value={rule.precision ?? block.precision ?? 2} onChange={event => patchRule(ruleIndex, { precision: Number(event.target.value) })} /></DiagramField>
                  </div>
                </DiagramPanel>}
              </DiagramPanel>
            ))}
          </div>
          <DiagramButton variant="danger" fullWidth className="border-ocre/30 bg-lienzo text-ocre shadow-sm hover:bg-ocre/10" onClick={() => onChange({ ...block, rules: [...rules, { when: '1', text: block.text }] })}>+ Añadir variante condicional</DiagramButton>
        </section>
    </DiagramPanel>
  );
};

export const DiagramInfoPanelContentEditor: React.FC<DiagramInfoPanelContentEditorProps> = ({
  model,
  panel,
  onElementChange,
  onTextChange,
  onPropertiesChange,
}) => {
  const blocks = panel.properties?.infoPanelBlocks ?? [];
  const updateBlocks = (next: DiagramInfoPanelBlock[]) => onPropertiesChange({ infoPanelBlocks: next.length ? next : undefined });
  const patchBlock = (index: number, block: DiagramInfoPanelBlock) => updateBlocks(blocks.map((candidate, candidateIndex) => candidateIndex === index ? block : candidate));
  const moveBlock = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[target]] = [next[target], next[index]];
    updateBlocks(next);
  };
  const addBlock = () => updateBlocks([...blocks, { id: nextBlockId(blocks), title: 'Nuevo bloque', text: 'Contenido...', rules: [] }]);

  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorTab, setEditorTab] = useState<'content' | 'blocks' | 'position'>('content');

  return (
    <>
      <DiagramButton
        variant="danger"
        fullWidth
        className="bg-carbon/5 text-carbon hover:bg-carbon/10"
        onClick={() => setIsEditorOpen(true)}
      >
        Editar contenido y diseño del panel
      </DiagramButton>

      {isEditorOpen && createPortal(
      <div className="fixed inset-0 z-[100] m-auto flex items-center justify-center bg-carbon/50 p-2 shadow-2xl backdrop-blur-sm sm:p-4" role="presentation">
        <div className="flex h-[min(860px,95vh)] w-full min-w-0 max-w-4xl flex-col overflow-hidden rounded-lg border border-carbon/20 bg-lienzo shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="info-panel-dialog-title">
          <header className="flex flex-shrink-0 items-center justify-between border-b border-carbon/10 bg-carbon/5 px-4 py-4 sm:px-6">
            <div>
              <h2 id="info-panel-dialog-title" className="text-base font-bold text-carbon sm:text-lg">Panel informativo</h2>
              <p className="mt-1 hidden text-[11px] leading-relaxed text-carbon/60 sm:block">Edite por tarea: contenido general, bloques dinámicos o posición.</p>
            </div>
            <DiagramButton
              variant="ghost"
              className="!min-h-0 rounded-full p-2 text-carbon/60 hover:bg-carbon/10 hover:text-carbon hover:no-underline"
              onClick={() => setIsEditorOpen(false)}
              aria-label="Cerrar editor"
            >
              ✕
            </DiagramButton>
          </header>
          <DiagramTabBar
            variant="tabs"
            aria-label="Secciones del panel informativo"
            className="grid grid-cols-3 border-b border-carbon/10 bg-lienzo p-2"
            tabs={[
              { id: 'content', label: 'Contenido' },
              { id: 'blocks', label: `Bloques · ${blocks.length}` },
              { id: 'position', label: 'Posición' },
            ]}
            activeTab={editorTab}
            onTabChange={tabId => setEditorTab(tabId as 'content' | 'blocks' | 'position')}
          />

          <div className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
        <div className={editorTab === 'position' ? 'block' : 'hidden'}>
        <DiagramPanel title="Posición en el Diagrama" className="border-transparent bg-transparent">
          <DiagramField label="Tipo de anclaje">
            <select
              aria-label="Tipo de anclaje del panel"
              className="shadow-inner"
              value={panel.properties?.anchorMode ?? 'reference'}
              onChange={(event) => {
                const anchorMode = event.target.value as 'reference' | 'viewport';
                onElementChange({
                  refs: panelAnchorReferences(model, panel, anchorMode),
                  properties: {
                    ...panel.properties,
                    anchorMode,
                    ...(anchorMode === 'viewport' && !panel.properties?.viewportPosition
                      ? { viewportPosition: [0.08, 0.22] as [number, number] }
                      : {}),
                  },
                });
              }}
            >
              <option value="reference">Acompañar a un objeto geométrico</option>
              <option value="viewport">Fijar a la vista (relativo al lienzo)</option>
            </select>
          </DiagramField>
          {(panel.properties?.anchorMode ?? 'reference') === 'reference' && <>
            <DiagramField label="Objeto a seguir">
              <select aria-label="Objeto de referencia del panel" className="shadow-inner" value={panel.refs[0] ?? ''} onChange={event => onElementChange({ refs: event.target.value ? [event.target.value] : [] })}>
                <option value="">Seleccione un objeto…</option>
                {[...model.points, ...model.elements.filter(item => item.id !== panel.id), ...model.sliders].map(item => <option key={item.id} value={item.id}>{item.label} ({item.id})</option>)}
              </select>
            </DiagramField>
            <span className="mt-1 block text-[10px] font-normal leading-relaxed text-carbon/45">El panel se moverá en conjunto con este objeto.</span>
          </>}
          {(panel.properties?.anchorMode ?? 'reference') === 'viewport' && (
            <div className="space-y-2">
              <DiagramButton
                variant="danger"
                fullWidth
                className="border-carbon/15 bg-lienzo text-left text-xs font-semibold text-carbon shadow-sm hover:border-ocre/60 hover:bg-ocre/5"
                aria-label="Alinear panel con el título"
                onClick={() => onPropertiesChange({ viewportPosition: [0, 0] })}
              >
                Alinear con la esquina superior izquierda
              </DiagramButton>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <DiagramField label="Margen Horizontal (%)">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    aria-label="Posición horizontal del panel"
                    className="shadow-inner"
                    value={Math.round((panel.properties?.viewportPosition?.[0] ?? 0.08) * 100)}
                    onChange={(event) => onPropertiesChange({
                      viewportPosition: [Number(event.target.value) / 100, panel.properties?.viewportPosition?.[1] ?? 0.22],
                    })}
                  />
                </DiagramField>
                <DiagramField label="Margen Vertical (%)">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    aria-label="Posición vertical del panel"
                    className="shadow-inner"
                    value={Math.round((panel.properties?.viewportPosition?.[1] ?? 0.22) * 100)}
                    onChange={(event) => onPropertiesChange({
                      viewportPosition: [panel.properties?.viewportPosition?.[0] ?? 0.08, Number(event.target.value) / 100],
                    })}
                  />
                </DiagramField>
              </div>
            </div>
          )}
        </DiagramPanel>
        </div>

        <div className={editorTab === 'content' ? 'block' : 'hidden'}>
        <DiagramPanel title="Cabecera e Introducción" className="border-transparent bg-transparent">
          <DiagramField label="Título principal del panel">
            <input aria-label="Título del panel" className="font-semibold shadow-inner" value={panel.properties?.title ?? ''} onChange={event => onPropertiesChange({ title: event.target.value || undefined })} placeholder="Ej. Clasificación de Triángulos" />
          </DiagramField>
          <DiagramTemplateField richText model={model} label="Texto introductorio opcional" ariaLabel="Contenido del panel" value={panel.text || ''} onChange={onTextChange} placeholder="Texto explicativo común que se muestra antes de todos los bloques…" rows={3} />
        </DiagramPanel>
        </div>

        <div className={editorTab === 'blocks' ? 'block' : 'hidden'}>
        <DiagramPanel title="Bloques Informativos" className="border-transparent bg-transparent">
          <div className="mb-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DiagramField label="Diseño de presentación">
              <select aria-label="Distribución de bloques" className="shadow-inner" value={panel.properties?.infoPanelLayout ?? 'stack'} onChange={event => onPropertiesChange({ infoPanelLayout: event.target.value as 'stack' | 'columns' })}>
                <option value="stack">Lista vertical (uno tras otro)</option>
                <option value="columns">Cuadrícula flexible de 2 column</option>
              </select>
            </DiagramField>
            <div className="flex items-center self-end rounded border border-pavo/15 bg-lienzo p-2 text-[9px] leading-relaxed text-carbon/60 shadow-sm">
              <span className="mr-2 text-pavo">ℹ️</span>
              <div>
                <strong>Recomendación:</strong> use <em>Cuadrícula</em> si tiene bloques cortos. Use <em>Lista</em> si hay textos descriptivos.
              </div>
            </div>
          </div>

          <DiagramPanel title="Guía de formato" collapsible defaultOpen={false} className="border-l-2 border-pavo/20 bg-transparent pl-3">
            <h4 className="mb-1 text-[10px] font-bold text-pavo">Guía de formato para los textos</h4>
            <ul className="list-disc space-y-1 pl-3 text-[9px] text-carbon/70">
              <li>Negrita: <strong className="font-bold">**texto**</strong></li>
              <li>Cursiva: <em className="italic">*texto*</em> o _texto_</li>
              <li>Matemáticas: <code>$x^2 + y^2 = r^2$</code></li>
              <li>Cálculos: use «Insertar cálculo»; cada resultado puede tener su unidad y decimales.</li>
              <li>Color: <code>[granada:texto rojo]</code> (colores: carbon, pavo, granada, ocre, salvia, musgo, terracota, pizarra)</li>
            </ul>
          </DiagramPanel>

          {blocks.length === 0 && <div className="rounded-md border-2 border-dashed border-pavo/30 bg-lienzo/50 p-6 text-center shadow-inner">
            <p className="mb-2 text-[11px] font-medium text-carbon/60">Este panel no tiene ningún bloque informativo.</p>
            <p className="text-[10px] text-carbon/50">Los bloques permiten estructurar la información, combinar lecturas, aplicar colores, y cambiar el contenido basado en la geometría.</p>
          </div>}

          <div className="space-y-4">
            {blocks.map((block, index) => (
              <PanelBlockEditor
                key={`${block.id}-${index}`}
                model={model}
                block={block}
                index={index}
                count={blocks.length}
                onChange={next => patchBlock(index, next)}
                onMove={direction => moveBlock(index, direction)}
                onDuplicate={() => updateBlocks([...blocks.slice(0, index + 1), { ...block, id: nextBlockId(blocks), title: block.title ? `${block.title} (copia)` : undefined, rules: block.rules?.map(rule => ({ ...rule })) }, ...blocks.slice(index + 1)])}
                onDelete={() => updateBlocks(blocks.filter((_, candidate) => candidate !== index))}
              />
            ))}
          </div>

          <DiagramButton variant="primary" fullWidth onClick={addBlock}>
            + Añadir bloque
          </DiagramButton>
        </DiagramPanel>

        <DiagramPanel
          title="Modo de Valor Único (Legado)"
          collapsible
          defaultOpen={blocks.length === 0 && Boolean(panel.properties?.expression || panel.properties?.textRules?.length)}
          className="border-carbon/15 bg-carbon/[0.02]"
        >
          <p className="text-[9px] leading-relaxed text-carbon/50">Este modo se mantiene por compatibilidad. Para paneles nuevos o más ricos, utilice "Bloques Informativos".</p>
          <DiagramExpressionField model={model} label="Valor numérico del panel" value={panel.properties?.expression || ''} onChange={value => onPropertiesChange({ expression: value || undefined })} optional />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <DiagramField label="Unidad visual"><input aria-label="Unidad" className="shadow-inner" value={panel.properties?.unit || ''} onChange={event => onPropertiesChange({ unit: event.target.value || undefined })} /></DiagramField>
            <DiagramField label="Precisión (decimales)"><input type="number" min="0" max="12" aria-label="Decimales" className="shadow-inner" value={panel.properties?.precision ?? 2} onChange={event => onPropertiesChange({ precision: Number(event.target.value) })} /></DiagramField>
          </div>
          <DiagramTextRulesEditor model={model} element={panel} onChange={textRules => onPropertiesChange({ textRules })} />
        </DiagramPanel>
        </div>
          </div>

          <footer className="flex justify-end gap-3 border-t border-carbon/10 bg-carbon/5 px-6 py-4">
            <DiagramButton variant="primary" className="bg-carbon px-6 shadow-md hover:bg-carbon/80" onClick={() => setIsEditorOpen(false)}>
              Hecho
            </DiagramButton>
          </footer>
        </div>
      </div>
    , document.body)}
    </>
  );
};

export default DiagramInfoPanelContentEditor;
