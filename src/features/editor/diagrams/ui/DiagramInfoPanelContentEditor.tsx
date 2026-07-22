import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { DiagramInfoPanelBlock, DiagramInfoPanelRule, DiagramColorToken } from '@/shared/diagrams/public';
import type { VisualDiagramModel, VisualElement } from '../model/types';
import { DiagramExpressionField } from './DiagramExpressionField';
import { DiagramTextRulesEditor } from './DiagramTextRulesEditor';
import { DiagramTemplateField } from './DiagramTemplateField';
import { COLOR_OPTIONS } from '../model/commands';

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
  <label className="block text-xs font-bold text-carbon">{label}
    <select 
      aria-label={label}
      className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs" 
      value={value || ''} 
      onChange={e => onChange(e.target.value as DiagramColorToken || undefined)}
    >
      <option value="">Por defecto (Pavo)</option>
      {COLOR_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
    </select>
  </label>
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
    <details className="border-b border-carbon/10 group" open={expanded} onToggle={event => setExpanded(event.currentTarget.open)}>
      <summary className="flex min-h-11 cursor-pointer items-center justify-between py-2.5 text-xs font-bold text-carbon transition-colors hover:text-pavo">
        <span>{index + 1} · {block.title || block.id || 'Bloque sin título'}</span>
        <span className="text-carbon/50 transition-transform duration-200 group-open:rotate-180">▼</span>
      </summary>
      <div className="space-y-4 pb-4 pl-3 pt-1">
        <div className="flex flex-wrap gap-2" role="group" aria-label={`Organizar ${block.title || block.id}`}>
          <button type="button" disabled={index === 0} className="rounded border border-carbon/15 bg-carbon/5 px-2 py-1 text-[10px] font-bold text-carbon/80 disabled:opacity-30 hover:bg-carbon/10 transition-colors" onClick={() => onMove(-1)}>↑ Subir</button>
          <button type="button" disabled={index === count - 1} className="rounded border border-carbon/15 bg-carbon/5 px-2 py-1 text-[10px] font-bold text-carbon/80 disabled:opacity-30 hover:bg-carbon/10 transition-colors" onClick={() => onMove(1)}>↓ Bajar</button>
          <button type="button" className="rounded border border-pavo/20 bg-pavo/5 px-2 py-1 text-[10px] font-bold text-pavo hover:bg-pavo/10 transition-colors" onClick={onDuplicate}>Duplicar</button>
          <button type="button" className="ml-auto rounded border border-granada/20 bg-granada/5 px-2 py-1 text-[10px] font-bold text-granada hover:bg-granada/10 transition-colors" onClick={onDelete}>Eliminar bloque</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="text-xs font-bold text-carbon flex flex-col min-w-0">Identificador interno
            <input aria-label={`Identificador del bloque ${index + 1}`} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 font-mono text-xs shadow-inner min-w-0" value={block.id} onChange={event => onChange({ ...block, id: event.target.value })} />
          </label>
          <label className="text-xs font-bold text-carbon flex flex-col min-w-0">Encabezado principal
            <input aria-label={`Encabezado del bloque ${index + 1}`} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs shadow-inner min-w-0" value={block.title ?? ''} onChange={event => onChange({ ...block, title: event.target.value || undefined })} placeholder="Ej. Por sus lados" />
          </label>
        </div>
        
        <div className="space-y-1">
          <DiagramTemplateField richText model={model} label="Contenido por defecto" ariaLabel={`Contenido por defecto del bloque ${index + 1}`} value={block.text} onChange={text => onChange({ ...block, text })} placeholder="Se muestra si ninguna variante condicional coincide." rows={3} />
        </div>
        
        <ColorSelector label="Color de acento por defecto" value={block.color} onChange={color => onChange({ ...block, color })} />

        {(block.expression || block.text.includes('{value}')) && <details className="border-l-2 border-carbon/10 pl-3" open={Boolean(block.expression)}>
          <summary className="min-h-9 cursor-pointer py-2 text-[10px] font-bold text-carbon/55 hover:text-carbon transition-colors">Compatibilidad con {'{value}'}</summary>
          <div className="space-y-3 pb-2">
            <DiagramExpressionField compact model={model} label={`Cálculo heredado de ${block.title || block.id}`} value={block.expression ?? ''} onChange={expression => onChange({ ...block, expression: expression || undefined })} optional />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-xs font-bold text-carbon flex flex-col min-w-0">Unidad visual<input aria-label={`Unidad base de ${block.id}`} className="mt-1 w-full rounded border border-carbon/15 p-1.5 text-xs min-w-0" value={block.unit ?? ''} onChange={event => onChange({ ...block, unit: event.target.value || undefined })} /></label>
              <label className="text-xs font-bold text-carbon flex flex-col min-w-0">Precisión (decimales)<input type="number" min="0" max="12" aria-label={`Decimales base de ${block.id}`} className="mt-1 w-full rounded border border-carbon/15 p-1.5 text-xs min-w-0" value={block.precision ?? 2} onChange={event => onChange({ ...block, precision: Number(event.target.value) })} /></label>
            </div>
          </div>
        </details>}

        <section className="space-y-3 border-t border-carbon/10 pt-3" aria-label={`Variantes condicionales de ${block.title || block.id}`}>
          <header>
            <h4 className="text-xs font-bold uppercase tracking-wider text-ocre">Variantes y Casos Específicos</h4>
            <p className="mt-1 text-[10px] leading-relaxed text-carbon/60">Se evalúan en orden. La primera condición que se cumpla reemplazará el texto, color y valor por defecto.</p>
          </header>
          
          <div className="space-y-3">
            {rules.map((rule, ruleIndex) => (
              <details key={`${block.id}-rule-${ruleIndex}`} className="border-t border-carbon/10 group/rule">
                <summary className="flex min-h-10 cursor-pointer items-center justify-between py-2 text-[11px] font-bold text-carbon/80 hover:text-carbon transition-colors">
                  <span className="truncate min-w-0 pr-2">Caso {ruleIndex + 1} {rule.when ? <span className="font-normal opacity-70 ml-1">(Condición: {rule.when})</span> : ''}</span>
                  <span className="flex-shrink-0 text-carbon/50 transition-transform duration-200 group-open/rule:rotate-180">▼</span>
                </summary>
                <div className="space-y-3 pb-3 pl-3">
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={ruleIndex === 0} aria-label={`Subir caso ${ruleIndex + 1}`} className="rounded border border-carbon/15 px-2 py-1 text-[10px] font-medium disabled:opacity-30 hover:bg-carbon/5 transition-colors" onClick={() => moveRule(ruleIndex, -1)}>↑ Subir</button>
                    <button type="button" disabled={ruleIndex === rules.length - 1} aria-label={`Bajar caso ${ruleIndex + 1}`} className="rounded border border-carbon/15 px-2 py-1 text-[10px] font-medium disabled:opacity-30 hover:bg-carbon/5 transition-colors" onClick={() => moveRule(ruleIndex, 1)}>↓ Bajar</button>
                    <button type="button" className="ml-auto rounded border border-granada/20 bg-granada/5 px-2 py-1 text-[10px] font-bold text-granada hover:bg-granada/10 transition-colors" onClick={() => onChange({ ...block, rules: rules.filter((_, candidate) => candidate !== ruleIndex) })}>Eliminar caso</button>
                  </div>
                  
                  <DiagramExpressionField model={model} label="¿Cuándo se activa este caso?" value={rule.when} onChange={when => patchRule(ruleIndex, { when })} help="Expresión matemática. Ej: approx(A.x, 0, 0.001) o dist(A, B) > 5." />
                  
                  <DiagramTemplateField richText model={model} label="Texto a mostrar en este caso" ariaLabel={`Contenido del caso ${ruleIndex + 1}`} value={rule.text} onChange={text => patchRule(ruleIndex, { text })} rows={3} />
                  
                  <ColorSelector label="Color de acento específico" value={rule.color} onChange={color => patchRule(ruleIndex, { color })} />

                  {(rule.expression || rule.text.includes('{value}')) && <details className="border-t border-carbon/10 pt-1" open={Boolean(rule.expression)}>
                    <summary className="min-h-9 cursor-pointer py-2 text-[10px] font-bold text-carbon/55">Compatibilidad con {'{value}'}</summary>
                    <div className="space-y-3 pb-2">
                      <DiagramExpressionField compact model={model} label="Cálculo heredado del caso" ariaLabel="Fórmula para {value} si se cumple el caso" value={rule.expression ?? ''} onChange={expression => patchRule(ruleIndex, { expression: expression || undefined })} optional />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="text-xs font-bold text-carbon flex flex-col min-w-0">Unidad visual<input aria-label={`Unidad del caso ${ruleIndex + 1}`} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs shadow-inner min-w-0" value={rule.unit ?? ''} onChange={event => patchRule(ruleIndex, { unit: event.target.value || undefined })} /></label>
                        <label className="text-xs font-bold text-carbon flex flex-col min-w-0">Precisión (decimales)<input type="number" min="0" max="12" aria-label={`Decimales del caso ${ruleIndex + 1}`} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs shadow-inner min-w-0" value={rule.precision ?? block.precision ?? 2} onChange={event => patchRule(ruleIndex, { precision: Number(event.target.value) })} /></label>
                      </div>
                    </div>
                  </details>}
                </div>
              </details>
            ))}
          </div>
          <button type="button" className="w-full rounded-md border border-ocre/30 bg-lienzo px-3 py-2 text-xs font-bold text-ocre hover:bg-ocre/10 transition-colors shadow-sm" onClick={() => onChange({ ...block, rules: [...rules, { when: '1', text: block.text }] })}>+ Añadir variante condicional</button>
        </section>
      </div>
    </details>
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
      <button 
        type="button" 
        className="min-h-11 w-full rounded bg-carbon/5 px-3 text-xs font-bold text-carbon hover:bg-carbon/10 transition-colors"
        onClick={() => setIsEditorOpen(true)}
      >
        Editar contenido y diseño del panel
      </button>

      {isEditorOpen && createPortal(
      <div className="fixed inset-0 z-[100] m-auto flex items-center justify-center bg-carbon/50 p-2 sm:p-4 shadow-2xl backdrop-blur-sm" role="presentation">
        <div className="flex h-[min(860px,95vh)] w-full min-w-0 max-w-4xl flex-col overflow-hidden rounded-lg border border-carbon/20 bg-lienzo shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="info-panel-dialog-title">
          <header className="flex-shrink-0 flex items-center justify-between border-b border-carbon/10 bg-carbon/5 px-4 sm:px-6 py-4">
            <div>
              <h2 id="info-panel-dialog-title" className="text-base sm:text-lg font-bold text-carbon">Panel informativo</h2>
              <p className="mt-1 hidden text-[11px] leading-relaxed text-carbon/60 sm:block">Edite por tarea: contenido general, bloques dinámicos o posición.</p>
            </div>
            <button 
              type="button" 
              onClick={() => setIsEditorOpen(false)}
              className="rounded-full p-2 text-carbon/60 hover:bg-carbon/10 hover:text-carbon" 
              aria-label="Cerrar editor"
            >
              ✕
            </button>
          </header>
          <nav className="grid grid-cols-3 border-b border-carbon/10 bg-lienzo p-2" role="tablist" aria-label="Secciones del panel informativo">
            {([['content', 'Contenido'], ['blocks', `Bloques · ${blocks.length}`], ['position', 'Posición']] as const).map(([id, label]) => <button key={id} type="button" role="tab" aria-selected={editorTab === id} onClick={() => setEditorTab(id)} className={`min-h-11 rounded px-2 text-xs font-bold ${editorTab === id ? 'bg-carbon text-lienzo' : 'text-carbon/55 hover:bg-carbon/5'}`}>{label}</button>)}
          </nav>
          
          <div className="min-w-0 flex-1 overflow-y-auto p-4 sm:p-6">
        {/* PANEL POSITION CONFIGURATION */}
        <div className={editorTab === 'position' ? 'block' : 'hidden'}>
        <fieldset className="min-w-0 space-y-3">
          <legend className="px-1 text-[10px] font-bold uppercase tracking-wider text-carbon/50">Posición en el Diagrama</legend>
          <label className="block text-xs font-bold text-carbon">
            Tipo de anclaje
            <select
              aria-label="Tipo de anclaje del panel"
              className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs shadow-inner"
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
          </label>
          {(panel.properties?.anchorMode ?? 'reference') === 'reference' && <label className="block text-xs font-bold text-carbon">
            Objeto a seguir
            <select aria-label="Objeto de referencia del panel" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs shadow-inner" value={panel.refs[0] ?? ''} onChange={event => onElementChange({ refs: event.target.value ? [event.target.value] : [] })}>
              <option value="">Seleccione un objeto…</option>
              {[...model.points, ...model.elements.filter(item => item.id !== panel.id), ...model.sliders].map(item => <option key={item.id} value={item.id}>{item.label} ({item.id})</option>)}
            </select>
            <span className="mt-1 block text-[10px] font-normal leading-relaxed text-carbon/45">El panel se moverá en conjunto con este objeto.</span>
          </label>}
          {(panel.properties?.anchorMode ?? 'reference') === 'viewport' && (
            <div className="space-y-2">
              <button
                type="button"
                className="w-full rounded border border-carbon/15 bg-lienzo px-2 py-1.5 text-left text-xs font-semibold text-carbon transition-colors hover:border-ocre/60 hover:bg-ocre/5 shadow-sm"
                aria-label="Alinear panel con el título"
                onClick={() => onPropertiesChange({ viewportPosition: [0, 0] })}
              >
                Alinear con la esquina superior izquierda
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="text-xs font-bold text-carbon flex flex-col min-w-0">
                  Margen Horizontal (%)
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    aria-label="Posición horizontal del panel"
                    className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs shadow-inner min-w-0"
                    value={Math.round((panel.properties?.viewportPosition?.[0] ?? 0.08) * 100)}
                    onChange={(event) => onPropertiesChange({
                      viewportPosition: [Number(event.target.value) / 100, panel.properties?.viewportPosition?.[1] ?? 0.22],
                    })}
                  />
                </label>
                <label className="text-xs font-bold text-carbon flex flex-col min-w-0">
                  Margen Vertical (%)
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    aria-label="Posición vertical del panel"
                    className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs shadow-inner min-w-0"
                    value={Math.round((panel.properties?.viewportPosition?.[1] ?? 0.22) * 100)}
                    onChange={(event) => onPropertiesChange({
                      viewportPosition: [panel.properties?.viewportPosition?.[0] ?? 0.08, Number(event.target.value) / 100],
                    })}
                  />
                </label>
              </div>
            </div>
          )}
        </fieldset>
        </div>

        {/* HEADER CONFIGURATION */}
        <div className={editorTab === 'content' ? 'block' : 'hidden'}>
        <fieldset className="min-w-0 space-y-3">
          <legend className="px-1 text-[10px] font-bold uppercase tracking-wider text-carbon/60">Cabecera e Introducción</legend>
          <label className="block text-xs font-bold text-carbon">Título principal del panel
            <input aria-label="Título del panel" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-2 text-xs font-semibold shadow-inner" value={panel.properties?.title ?? ''} onChange={event => onPropertiesChange({ title: event.target.value || undefined })} placeholder="Ej. Clasificación de Triángulos" />
          </label>
          <DiagramTemplateField richText model={model} label="Texto introductorio opcional" ariaLabel="Contenido del panel" value={panel.text || ''} onChange={onTextChange} placeholder="Texto explicativo común que se muestra antes de todos los bloques…" rows={3} />
        </fieldset>
        </div>

        {/* BLOCKS CONFIGURATION */}
        <div className={editorTab === 'blocks' ? 'block' : 'hidden'}>
        <fieldset className="min-w-0 space-y-4">
          <legend className="px-2 text-xs font-bold uppercase tracking-wider text-pavo">Bloques Informativos</legend>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
            <label className="text-xs font-bold text-carbon flex flex-col min-w-0">Diseño de presentación
              <select aria-label="Distribución de bloques" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs shadow-inner" value={panel.properties?.infoPanelLayout ?? 'stack'} onChange={event => onPropertiesChange({ infoPanelLayout: event.target.value as 'stack' | 'columns' })}>
                <option value="stack">Lista vertical (uno tras otro)</option>
                <option value="columns">Cuadrícula flexible de 2 columns</option>
              </select>
            </label>
            <div className="self-end rounded border border-pavo/15 bg-lienzo p-2 text-[9px] leading-relaxed text-carbon/60 flex items-center shadow-sm">
              <span className="mr-2 text-pavo">ℹ️</span>
              <div>
                <strong>Recomendación:</strong> use <em>Cuadrícula</em> si tiene bloques cortos. Use <em>Lista</em> si hay textos descriptivos.
              </div>
            </div>
          </div>
          
          <details className="border-l-2 border-pavo/20 pl-3">
            <summary className="min-h-9 cursor-pointer py-2 text-[10px] font-bold text-pavo">Guía de formato</summary>
            <h4 className="text-[10px] font-bold text-pavo mb-1">Guía de formato para los textos</h4>
            <ul className="text-[9px] text-carbon/70 space-y-1 pl-3 list-disc">
              <li>Negrita: <strong className="font-bold">**texto**</strong></li>
              <li>Cursiva: <em className="italic">*texto*</em> o _texto_</li>
              <li>Matemáticas: <code>$x^2 + y^2 = r^2$</code></li>
              <li>Cálculos: use «Insertar cálculo»; cada resultado puede tener su unidad y decimales.</li>
              <li>Color: <code>[granada:texto rojo]</code> (colores: carbon, pavo, granada, ocre, salvia, musgo, terracota, pizarra)</li>
            </ul>
          </details>

          {blocks.length === 0 && <div className="rounded-md border-2 border-dashed border-pavo/30 bg-lienzo/50 p-6 text-center shadow-inner">
            <p className="text-[11px] font-medium text-carbon/60 mb-2">Este panel no tiene ningún bloque informativo.</p>
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
          
          <button type="button" className="min-h-11 w-full rounded bg-pavo px-3 text-xs font-bold text-lienzo hover:bg-pavo/90 transition-colors" onClick={addBlock}>
            + Añadir bloque
          </button>
        </fieldset>

        {/* LEGACY SIMPLE MODE */}
        <details className="rounded border border-carbon/15 bg-carbon/[0.02]" open={blocks.length === 0 && Boolean(panel.properties?.expression || panel.properties?.textRules?.length)}>
          <summary className="cursor-pointer px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-carbon/55 hover:text-carbon hover:bg-carbon/5 transition-colors">Modo de Valor Único (Legado)</summary>
          <div className="space-y-3 border-t border-carbon/10 p-3">
            <p className="text-[9px] leading-relaxed text-carbon/50">Este modo se mantiene por compatibilidad. Para paneles nuevos o más ricos, utilice "Bloques Informativos".</p>
            <DiagramExpressionField model={model} label="Valor numérico del panel" value={panel.properties?.expression || ''} onChange={value => onPropertiesChange({ expression: value || undefined })} optional />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="text-xs font-bold text-carbon flex flex-col min-w-0">Unidad visual<input aria-label="Unidad" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs shadow-inner min-w-0" value={panel.properties?.unit || ''} onChange={event => onPropertiesChange({ unit: event.target.value || undefined })} /></label>
              <label className="text-xs font-bold text-carbon flex flex-col min-w-0">Precisión (decimales)<input type="number" min="0" max="12" aria-label="Decimales" className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-1.5 text-xs shadow-inner min-w-0" value={panel.properties?.precision ?? 2} onChange={event => onPropertiesChange({ precision: Number(event.target.value) })} /></label>
            </div>
            <DiagramTextRulesEditor model={model} element={panel} onChange={textRules => onPropertiesChange({ textRules })} />
          </div>
        </details>
        </div>
          </div>
          
          <footer className="border-t border-carbon/10 bg-carbon/5 px-6 py-4 flex justify-end gap-3">
            <button 
              type="button"
              onClick={() => setIsEditorOpen(false)}
              className="rounded bg-carbon px-6 py-2 text-xs font-bold text-lienzo hover:bg-carbon/80 transition-colors shadow-md"
            >
              Hecho
            </button>
          </footer>
        </div>
      </div>
    , document.body)}
    </>
  );
};

export default DiagramInfoPanelContentEditor;
