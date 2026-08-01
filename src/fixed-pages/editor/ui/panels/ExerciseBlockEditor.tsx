import React, { useMemo, useState } from 'react';
import type { Block } from '../../core/parser';
import { parseAttributes } from '../../core/parser';
import { renderFormattedText, type EditLinkHandler } from './InlineContentPreview';

interface QuestionTag { start: number; end: number; source: string; id: string; text: string; correct: string; options: Array<{ value: string; text: string; textStart: number; textEnd: number }> }

function openingTagEnd(source: string, start: number): number {
  let quote: string | null = null;
  let escaped = false;
  let braces = 0;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === '\\') escaped = true;
      else if (char === quote) quote = null;
    } else if (char === '"' || char === "'") quote = char;
    else if (char === '{') braces += 1;
    else if (char === '}') braces = Math.max(0, braces - 1);
    else if (char === '>' && braces === 0) return index + 1;
  }
  return source.length;
}

function parseQuestions(content: string): QuestionTag[] {
  const result: QuestionTag[] = [];
  let cursor = 0;
  while (cursor < content.length) {
    const start = content.indexOf('<Pregunta', cursor);
    if (start === -1) break;
    const end = openingTagEnd(content, start);
    const source = content.slice(start, end);
    const attrs = parseAttributes(source);
    const options: QuestionTag['options'] = [];
    const optionPattern = /value\s*:\s*(['"])(.*?)\1\s*,\s*texto\s*:\s*(['"])(.*?)\3/g;
    let match: RegExpExecArray | null;
    while ((match = optionPattern.exec(source)) !== null) {
      const textOffset = match.index + match[0].lastIndexOf(match[3] + match[4] + match[3]) + 1;
      options.push({ value: match[2], text: match[4], textStart: textOffset, textEnd: textOffset + match[4].length });
    }
    result.push({ start, end, source, id: String(attrs.id || ''), text: String(attrs.texto || ''), correct: String(attrs.correct || ''), options });
    cursor = end;
  }
  return result;
}

function replaceQuotedAttribute(source: string, name: string, value: string): string {
  const pattern = new RegExp(`(\\b${name}\\s*=\\s*)(["'])([\\s\\S]*?)\\2`);
  const match = source.match(pattern);
  if (!match) return source;
  return source.replace(pattern, `${match[1]}${JSON.stringify(value)}`);
}

interface Props {
  block: Block;
  isReadOnly: boolean;
  updateBlock: (id: string, content: string, metadata?: Record<string, unknown>) => void;
  handleTextareaSelect: (event: React.SyntheticEvent<HTMLTextAreaElement>, blockId: string) => void;
  handleEditLink: EditLinkHandler;
  renderInlineToolbar: (block: Block) => React.ReactNode;
}

export const ExerciseBlockEditor: React.FC<Props> = ({ block, isReadOnly, updateBlock, handleTextareaSelect, handleEditLink, renderInlineToolbar }) => {
  const [structureOpen, setStructureOpen] = useState(false);
  const questions = useMemo(() => parseQuestions(block.content), [block.content]);
  const updateAttributes = (next: Record<string, unknown>) => updateBlock(block.id, block.content, { ...block.metadata, ...next });
  const replaceQuestionSource = (question: QuestionTag, nextSource: string) => updateBlock(block.id, `${block.content.slice(0, question.start)}${nextSource}${block.content.slice(question.end)}`);
  const updateQuestionAttribute = (question: QuestionTag, name: string, value: string) => replaceQuestionSource(question, replaceQuotedAttribute(question.source, name, value));
  const updateOption = (question: QuestionTag, optionIndex: number, value: string) => {
    const option = question.options[optionIndex];
    if (!option) return;
    const nextSource = `${question.source.slice(0, option.textStart)}${value.replace(/([\\'])/g, '\\$1')}${question.source.slice(option.textEnd)}`;
    replaceQuestionSource(question, nextSource);
  };

  return <section className="rounded border border-ocre/25 bg-ocre/5 p-4">
    <header className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ocre font-serif text-sm font-bold text-lienzo">{Number(block.metadata?.numero || 1)}</span><div><h4 className="font-serif text-sm font-bold text-carbon">{block.metadata?.titulo || 'Paso de ejercicio'}</h4><p className="font-mono text-[9px] text-carbon/45">{block.metadata?.id || 'sin-id'} · {questions.length} {questions.length === 1 ? 'pregunta' : 'preguntas'}</p></div></div>
      <button type="button" onClick={() => setStructureOpen(value => !value)} className="rounded border border-carbon/15 px-2 py-1 text-[9px] font-bold text-carbon/50">{structureOpen ? 'Ocultar estructura' : 'Estructura avanzada'}</button>
    </header>
    <div className="mt-3 grid gap-2 sm:grid-cols-[6rem_1fr]">
      <label className="text-[10px] font-bold text-carbon/55">Orden<input disabled={isReadOnly} type="number" min="1" value={Number(block.metadata?.numero || 1)} onChange={event => updateAttributes({ numero: Number(event.target.value) || 1 })} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-2 text-xs" /></label>
      <label className="text-[10px] font-bold text-carbon/55">Título del paso<input disabled={isReadOnly} value={String(block.metadata?.titulo || '')} onChange={event => updateAttributes({ titulo: event.target.value })} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo p-2 font-serif text-xs" /></label>
    </div>

    <div className="mt-4 space-y-3">
      {questions.map((question, questionIndex) => <article key={`${question.id}-${question.start}`} className="rounded border border-pavo/20 bg-lienzo p-3">
        <div className="flex items-center justify-between gap-2"><p className="ac-label ac-label--sm ac-label--pavo">Pregunta {questionIndex + 1}</p><span className="font-mono text-[9px] text-carbon/40">{question.id}</span></div>
        <textarea disabled={isReadOnly} value={question.text} onChange={event => updateQuestionAttribute(question, 'texto', event.target.value)} className="mt-2 min-h-16 w-full resize-y bg-transparent font-serif text-sm font-bold leading-relaxed text-carbon outline-none" placeholder="Escriba la pregunta…" />
        <div className="mt-2 space-y-1.5">
          {question.options.map((option, optionIndex) => <label key={`${option.value}-${optionIndex}`} className={`flex items-center gap-2 rounded border p-2 ${question.correct === option.value ? 'border-salvia/35 bg-salvia/10' : 'border-carbon/10'}`}>
            <input disabled={isReadOnly} type="radio" name={`${block.id}-${question.id}`} checked={question.correct === option.value} onChange={() => updateQuestionAttribute(question, 'correct', option.value)} />
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-carbon/5 text-[9px] font-bold text-carbon/50">{String.fromCharCode(65 + optionIndex)}</span>
            <input disabled={isReadOnly} value={option.text} onChange={event => updateOption(question, optionIndex, event.target.value)} className="min-w-0 flex-1 bg-transparent font-serif text-xs text-carbon outline-none" />
            {question.correct === option.value && <span className="text-[9px] font-bold text-salvia">Correcta</span>}
          </label>)}
        </div>
      </article>)}
      {questions.length === 0 && <div className="rounded border border-dashed border-carbon/15 bg-lienzo p-3"><p className="font-serif text-sm leading-relaxed text-carbon">{renderFormattedText(block.content.replace(/<[^>]+>/g, ' '), block.id, handleEditLink)}</p><p className="mt-2 text-[10px] text-carbon/45">Este paso usa respuesta breve u otro tipo de interacción.</p></div>}
    </div>

    {structureOpen && <div className="mt-4 rounded border border-carbon/10 bg-lienzo p-3">{renderInlineToolbar(block)}<textarea value={block.content} onChange={event => updateBlock(block.id, event.target.value)} onSelect={event => handleTextareaSelect(event, block.id)} className="mt-2 min-h-64 w-full resize-y bg-transparent font-mono text-xs leading-relaxed text-carbon outline-none" /></div>}
  </section>;
};

