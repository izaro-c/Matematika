import React, { useState } from 'react';
import { useI18n } from '@/i18n';
import type { Block } from '@/fixed-pages/editor/session/parser';
import { renderFormattedText, type EditLinkHandler } from './InlineContentPreview';
import { Button, controlClassName, inlineFieldClassName } from '@/fixed-pages/editor/ui/primitives';

interface Props {
  block: Block;
  isReadOnly: boolean;
  updateBlock: (id: string, content: string, metadata?: Record<string, unknown>) => void;
  handleTextareaSelect: (event: React.SyntheticEvent<HTMLTextAreaElement>, blockId: string) => void;
  handleEditLink: EditLinkHandler;
  renderInlineToolbar: (block: Block) => React.ReactNode;
}

type Translate = ReturnType<typeof useI18n>['t'];

const labels = (t: Translate): Record<string, { title: string; help: string; tone: string }> => ({
  StudyTask: { title: t('editor.registered.studyTaskTitle'), help: t('editor.registered.studyTaskHelp'), tone: 'border-canela/25 bg-canela/5' },
  StudyPlanCheckpoint: { title: t('editor.registered.studyPlanCheckpointTitle'), help: t('editor.registered.studyPlanCheckpointHelp'), tone: 'border-ocre/25 bg-ocre/5' },
  Paso: { title: t('editor.registered.stepTitle'), help: t('editor.registered.stepHelp'), tone: 'border-pavo/25 bg-pavo/5' },
  Solucion: { title: t('editor.registered.solutionTitle'), help: t('editor.registered.solutionHelp'), tone: 'border-canela/25 bg-canela/5' },
  Resolucion: { title: t('editor.registered.resolutionTitle'), help: t('editor.registered.resolutionHelp'), tone: 'border-canela/25 bg-canela/5' },
  Apoyo: { title: t('editor.registered.supportTitle'), help: t('editor.registered.supportHelp'), tone: 'border-ocre/25 bg-ocre/5' },
  ErrorComun: { title: t('editor.registered.commonErrorTitle'), help: t('editor.registered.commonErrorHelp'), tone: 'border-granada/25 bg-granada/5' },
  Pregunta: { title: t('editor.registered.questionTitle'), help: t('editor.registered.questionHelp'), tone: 'border-pavo/25 bg-pavo/5' },
  Hueco: { title: t('editor.registered.gapTitle'), help: t('editor.registered.gapHelp'), tone: 'border-ocre/25 bg-ocre/5' },
  Capitular: { title: t('editor.registered.dropCapTitle'), help: t('editor.registered.dropCapHelp'), tone: 'border-canela/25 bg-canela/5' },
});

function TextField({ label, value, placeholder, onChange, type = 'text' }: {
  label: string; value: string | number; placeholder?: string; onChange: (value: string) => void; type?: string;
}) {
  return <label className="block text-[10px] font-bold text-carbon/60">{label}
    <input type={type} value={value} placeholder={placeholder} onChange={event => onChange(event.target.value)} className={`${controlClassName} mt-1`} />
  </label>;
}

export const RegisteredMdxBlockEditor: React.FC<Props> = ({ block, isReadOnly, updateBlock, handleTextareaSelect, handleEditLink, renderInlineToolbar }) => {
  const { t } = useI18n();
  const component = String(block.metadata?.component || 'MDX');
  const presentation = labels(t)[component] ?? { title: component, help: t('editor.registered.defaultHelp'), tone: 'border-pavo/20 bg-pavo/5' };
  const [sourceOpen, setSourceOpen] = useState(false);
  const setAttribute = (name: string, value: unknown) => updateBlock(block.id, block.content, { ...block.metadata, [name]: value });
  const options = Array.isArray(block.metadata?.options) ? block.metadata.options.map(String) : [];

  if (component === 'Capitular') {
    return <div className={`flex items-center gap-3 rounded border p-3 ${presentation.tone}`}>
      <span className="flex h-12 w-12 items-center justify-center font-serif text-4xl font-bold text-canela" aria-hidden="true">{String(block.metadata?.letra || 'A').slice(0, 1)}</span>
      <div className="min-w-0 flex-1"><p className="text-xs font-bold text-carbon">{t('editor.registered.dropCapNextParagraph')}</p><p className="text-[10px] text-carbon/50">{t('editor.registered.dropCapNote')}</p></div>
      <label className="text-[10px] font-bold text-carbon/55">{t('editor.registered.letter')}<input disabled={isReadOnly} maxLength={1} value={String(block.metadata?.letra || '')} onChange={event => setAttribute('letra', event.target.value.toUpperCase())} className={`${controlClassName} ml-2 w-10 text-center`} /></label>
    </div>;
  }

  if (component === 'StudyTask') {
    return <section className={`rounded border p-4 ${presentation.tone}`}>
      <div className="mb-3"><h4 className="font-serif text-sm font-bold text-carbon">{presentation.title}</h4><p className="text-[10px] text-carbon/50">{presentation.help}</p></div>
      <div className="grid gap-3 sm:grid-cols-[1fr_9rem]">
        <TextField label={t('editor.registered.visibleTitle')} value={String(block.metadata?.title || '')} onChange={value => setAttribute('title', value)} />
        <label className="block text-[10px] font-bold text-carbon/60">{t('editor.registered.type')}<select value={String(block.metadata?.type || 'definicion')} onChange={event => setAttribute('type', event.target.value)} className={`${controlClassName} mt-1`}><option value="definicion">{t('editor.registered.typeDefinition')}</option><option value="axioma">{t('editor.registered.typeAxiom')}</option><option value="teorema">{t('editor.registered.typeTheorem')}</option><option value="ejercicio">{t('editor.registered.typeExercise')}</option><option value="demostracion">{t('editor.registered.typeProof')}</option></select></label>
        <div className="sm:col-span-2"><TextField label={t('editor.registered.linkedPageId')} value={String(block.metadata?.id || '')} placeholder="id-kebab-case" onChange={value => setAttribute('id', value)} /></div>
      </div>
    </section>;
  }

  if (component === 'StudyPlanCheckpoint') {
    const correctAnswer = Number(block.metadata?.correctAnswer ?? 0);
    return <section className={`rounded border p-4 ${presentation.tone}`}>
      <div className="mb-3"><h4 className="font-serif text-sm font-bold text-carbon">{presentation.title}</h4><p className="text-[10px] text-carbon/50">{presentation.help}</p></div>
      <label className="block text-[10px] font-bold text-carbon/60">{t('editor.registered.question')}<textarea value={String(block.metadata?.question || '')} onChange={event => setAttribute('question', event.target.value)} className={`${controlClassName} mt-1 min-h-20 resize-y`} /></label>
      <div className="mt-3 space-y-2">
        {options.map((option, index) => <label key={`${block.id}-option-${index}`} className={`flex items-center gap-2 rounded border p-2 ${index === correctAnswer ? 'border-canela/30 bg-canela/10' : 'border-carbon/10 bg-lienzo'}`}>
          <input type="radio" name={`${block.id}-correct`} checked={index === correctAnswer} onChange={() => setAttribute('correctAnswer', index)} />
          <span className="text-[10px] font-bold text-carbon/45">{index + 1}</span>
          <input value={option} onChange={event => { const next = [...options]; next[index] = event.target.value; setAttribute('options', next); }} className={`${inlineFieldClassName} min-w-0 flex-1 text-xs text-carbon`} />
        </label>)}
        <Button size="sm" onClick={() => setAttribute('options', [...options, 'Nueva opción'])}>{t('editor.registered.addOption')}</Button>
      </div>
      <label className="mt-3 block text-[10px] font-bold text-carbon/60">{t('editor.registered.answerExplanation')}<textarea value={String(block.metadata?.explanation || '')} onChange={event => setAttribute('explanation', event.target.value)} className={`${controlClassName} mt-1 min-h-20 resize-y`} /></label>
    </section>;
  }

  const numberField = component === 'Paso' ? <TextField label={t('editor.registered.order')} type="number" value={Number(block.metadata?.numero || 1)} onChange={value => setAttribute('numero', Number(value) || 1)} /> : null;
  const titleKey = component === 'Solucion' ? 'label' : component === 'Paso' || component === 'Apoyo' || component === 'ErrorComun' ? 'titulo' : null;
  return <section className={`rounded border p-4 ${presentation.tone}`}>
    <header className="flex items-start justify-between gap-3">
      <div><h4 className="font-serif text-sm font-bold text-carbon">{presentation.title}</h4><p className="mt-0.5 text-[10px] text-carbon/50">{presentation.help}</p></div>
      <Button size="sm" onClick={() => setSourceOpen(value => !value)}>{sourceOpen ? t('editor.registered.visualView') : t('editor.registered.editStructure')}</Button>
    </header>
    {(numberField || titleKey) && <div className="mt-3 grid gap-2 sm:grid-cols-2">{numberField}{titleKey && <TextField label={component === 'Solucion' ? t('editor.registered.buttonText') : t('editor.registered.title')} value={String(block.metadata?.[titleKey] || '')} onChange={value => setAttribute(titleKey, value)} />}</div>}
    {sourceOpen ? <textarea value={block.content} onChange={event => updateBlock(block.id, event.target.value)} onSelect={event => handleTextareaSelect(event, block.id)} className={`${controlClassName} mt-3 min-h-40 resize-y font-mono`} /> : <div className="mt-3 rounded border border-carbon/10 bg-lienzo p-3">
      {renderInlineToolbar(block)}
      <textarea value={block.content} onChange={event => updateBlock(block.id, event.target.value)} onSelect={event => handleTextareaSelect(event, block.id)} placeholder={t('editor.registered.contentPlaceholder')} className={`${inlineFieldClassName} mt-2 min-h-24 resize-y font-serif text-sm leading-relaxed text-carbon`} />
      {block.content && <div className="mt-3 border-t border-carbon/10 pt-3 font-serif text-sm leading-relaxed text-carbon">{renderFormattedText(block.content, block.id, handleEditLink, t)}</div>}
    </div>}
  </section>;
};

