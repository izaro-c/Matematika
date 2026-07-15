import React, { useState } from 'react';
import type { Block } from '../../core/parser';
import { renderFormattedText, type EditLinkHandler } from './InlineContentPreview';

interface Props {
  block: Block;
  isReadOnly: boolean;
  updateBlock: (id: string, content: string, metadata?: Record<string, unknown>) => void;
  handleTextareaSelect: (event: React.SyntheticEvent<HTMLTextAreaElement>, blockId: string) => void;
  handleEditLink: EditLinkHandler;
  renderInlineToolbar: (block: Block) => React.ReactNode;
}

const labels: Record<string, { title: string; help: string; tone: string }> = {
  StudyTask: { title: 'Recurso del plan', help: 'Enlaza una parada del itinerario con una página de Matematika.', tone: 'border-salvia/25 bg-salvia/5' },
  StudyPlanCheckpoint: { title: 'Comprobación del plan', help: 'Pregunta de control antes de continuar con el itinerario.', tone: 'border-ocre/25 bg-ocre/5' },
  Paso: { title: 'Paso de ejemplo', help: 'Una etapa visible de la resolución, con orden, título y explicación.', tone: 'border-pavo/25 bg-pavo/5' },
  Solucion: { title: 'Solución revelable', help: 'Agrupa los pasos que desarrollan la solución completa.', tone: 'border-salvia/25 bg-salvia/5' },
  Resolucion: { title: 'Resolución', help: 'Explica la respuesta del paso con su justificación.', tone: 'border-salvia/25 bg-salvia/5' },
  Apoyo: { title: 'Ayuda contextual', help: 'Ofrece una pista o un enlace de repaso sin revelar la solución.', tone: 'border-ocre/25 bg-ocre/5' },
  ErrorComun: { title: 'Error común', help: 'Explica una respuesta incorrecta y cómo reconocerla.', tone: 'border-granada/25 bg-granada/5' },
  Pregunta: { title: 'Pregunta', help: 'Pregunta evaluable con sus opciones y respuesta correcta.', tone: 'border-pavo/25 bg-pavo/5' },
  Hueco: { title: 'Respuesta breve', help: 'Campo que comprueba una respuesta corta.', tone: 'border-ocre/25 bg-ocre/5' },
  Capitular: { title: 'Capitular', help: 'Inicial decorativa aplicada al párrafo siguiente.', tone: 'border-salvia/25 bg-salvia/5' },
};

function TextField({ label, value, placeholder, onChange, type = 'text' }: {
  label: string; value: string | number; placeholder?: string; onChange: (value: string) => void; type?: string;
}) {
  return <label className="block text-[10px] font-bold text-carbon/60">{label}
    <input type={type} value={value} placeholder={placeholder} onChange={event => onChange(event.target.value)} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo px-2.5 py-2 text-xs font-normal text-carbon outline-none focus:border-salvia" />
  </label>;
}

export const RegisteredMdxBlockEditor: React.FC<Props> = ({ block, isReadOnly, updateBlock, handleTextareaSelect, handleEditLink, renderInlineToolbar }) => {
  const component = String(block.metadata?.component || 'MDX');
  const presentation = labels[component] ?? { title: component, help: 'Componente estructurado de Matematika.', tone: 'border-pavo/20 bg-pavo/5' };
  const [sourceOpen, setSourceOpen] = useState(false);
  const setAttribute = (name: string, value: unknown) => updateBlock(block.id, block.content, { ...block.metadata, [name]: value });
  const options = Array.isArray(block.metadata?.options) ? block.metadata.options.map(String) : [];

  if (component === 'Capitular') {
    return <div className={`flex items-center gap-3 rounded border p-3 ${presentation.tone}`}>
      <span className="flex h-12 w-12 items-center justify-center font-serif text-4xl font-bold text-salvia" aria-hidden="true">{String(block.metadata?.letra || 'A').slice(0, 1)}</span>
      <div className="min-w-0 flex-1"><p className="text-xs font-bold text-carbon">Capitular del párrafo siguiente</p><p className="text-[10px] text-carbon/50">La letra se une visualmente al texto al publicar.</p></div>
      <label className="text-[10px] font-bold text-carbon/55">Letra<input disabled={isReadOnly} maxLength={1} value={String(block.metadata?.letra || '')} onChange={event => setAttribute('letra', event.target.value.toUpperCase())} className="ml-2 h-9 w-10 rounded border border-carbon/15 bg-lienzo text-center font-serif text-lg font-bold" /></label>
    </div>;
  }

  if (component === 'StudyTask') {
    return <section className={`rounded border p-4 ${presentation.tone}`}>
      <div className="mb-3"><h4 className="font-serif text-sm font-bold text-carbon">{presentation.title}</h4><p className="text-[10px] text-carbon/50">{presentation.help}</p></div>
      <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
        <TextField label="Título visible" value={String(block.metadata?.title || '')} onChange={value => setAttribute('title', value)} />
        <label className="block text-[10px] font-bold text-carbon/60">Tipo<select value={String(block.metadata?.type || 'definicion')} onChange={event => setAttribute('type', event.target.value)} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo px-2 py-2 text-xs font-normal"><option value="definicion">Definición</option><option value="axioma">Axioma</option><option value="teorema">Teorema</option><option value="ejercicio">Ejercicio</option><option value="demostracion">Demostración</option></select></label>
        <div className="sm:col-span-2"><TextField label="Página enlazada (ID)" value={String(block.metadata?.id || '')} placeholder="id-kebab-case" onChange={value => setAttribute('id', value)} /></div>
      </div>
    </section>;
  }

  if (component === 'StudyPlanCheckpoint') {
    const correctAnswer = Number(block.metadata?.correctAnswer ?? 0);
    return <section className={`rounded border p-4 ${presentation.tone}`}>
      <div className="mb-3"><h4 className="font-serif text-sm font-bold text-carbon">{presentation.title}</h4><p className="text-[10px] text-carbon/50">{presentation.help}</p></div>
      <label className="block text-[10px] font-bold text-carbon/60">Pregunta<textarea value={String(block.metadata?.question || '')} onChange={event => setAttribute('question', event.target.value)} className="mt-1 min-h-20 w-full rounded border border-carbon/15 bg-lienzo p-2.5 font-serif text-sm font-normal leading-relaxed" /></label>
      <div className="mt-3 space-y-2">
        {options.map((option, index) => <label key={`${block.id}-option-${index}`} className={`flex items-center gap-2 rounded border p-2 ${index === correctAnswer ? 'border-salvia/30 bg-salvia/10' : 'border-carbon/10 bg-lienzo'}`}>
          <input type="radio" name={`${block.id}-correct`} checked={index === correctAnswer} onChange={() => setAttribute('correctAnswer', index)} />
          <span className="text-[10px] font-bold text-carbon/45">{index + 1}</span>
          <input value={option} onChange={event => { const next = [...options]; next[index] = event.target.value; setAttribute('options', next); }} className="min-w-0 flex-1 bg-transparent text-xs text-carbon outline-none" />
        </label>)}
        <button type="button" onClick={() => setAttribute('options', [...options, 'Nueva opción'])} className="rounded border border-carbon/15 px-2 py-1 text-[10px] font-bold text-carbon/60">＋ Añadir opción</button>
      </div>
      <label className="mt-3 block text-[10px] font-bold text-carbon/60">Explicación de la respuesta<textarea value={String(block.metadata?.explanation || '')} onChange={event => setAttribute('explanation', event.target.value)} className="mt-1 min-h-20 w-full rounded border border-carbon/15 bg-lienzo p-2.5 font-serif text-xs font-normal leading-relaxed" /></label>
    </section>;
  }

  const numberField = component === 'Paso' ? <TextField label="Orden" type="number" value={Number(block.metadata?.numero || 1)} onChange={value => setAttribute('numero', Number(value) || 1)} /> : null;
  const titleKey = component === 'Solucion' ? 'label' : component === 'Paso' || component === 'Apoyo' || component === 'ErrorComun' ? 'titulo' : null;
  return <section className={`rounded border p-4 ${presentation.tone}`}>
    <header className="flex items-start justify-between gap-3">
      <div><h4 className="font-serif text-sm font-bold text-carbon">{presentation.title}</h4><p className="mt-0.5 text-[10px] text-carbon/50">{presentation.help}</p></div>
      <button type="button" onClick={() => setSourceOpen(value => !value)} className="rounded border border-carbon/15 px-2 py-1 text-[9px] font-bold text-carbon/50">{sourceOpen ? 'Vista visual' : 'Editar estructura'}</button>
    </header>
    {(numberField || titleKey) && <div className="mt-3 grid gap-2 sm:grid-cols-2">{numberField}{titleKey && <TextField label={component === 'Solucion' ? 'Texto del botón' : 'Título'} value={String(block.metadata?.[titleKey] || '')} onChange={value => setAttribute(titleKey, value)} />}</div>}
    {sourceOpen ? <textarea value={block.content} onChange={event => updateBlock(block.id, event.target.value)} onSelect={event => handleTextareaSelect(event, block.id)} className="mt-3 min-h-40 w-full resize-y rounded border border-carbon/15 bg-lienzo p-3 font-mono text-xs leading-relaxed text-carbon outline-none focus:border-pavo" /> : <div className="mt-3 rounded border border-carbon/10 bg-lienzo p-3">
      {renderInlineToolbar(block)}
      <textarea value={block.content} onChange={event => updateBlock(block.id, event.target.value)} onSelect={event => handleTextareaSelect(event, block.id)} placeholder="Escriba el contenido…" className="mt-2 min-h-24 w-full resize-y bg-transparent font-serif text-sm leading-relaxed text-carbon outline-none" />
      {block.content && <div className="mt-3 border-t border-carbon/10 pt-3 font-serif text-sm leading-relaxed text-carbon">{renderFormattedText(block.content, block.id, handleEditLink)}</div>}
    </div>}
  </section>;
};

