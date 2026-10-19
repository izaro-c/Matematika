import React, { useEffect, useState } from 'react';
import { useI18n } from '@/i18n';
import {
  getSelectedPlainText,
  insertHtmlAtSelection,
  latexSpanHtml,
  formulaBlockHtml,
  proofStepLinkHtml,
  mdxToEditableHtml,
  wrapSelectionWithTag,
} from '../prose/inlineProseOps';
import { buildInteractiveReference } from '@/fixed-pages/editor/types/editorContracts';
import {
  IconChevronDown,
  IconPlus,
  IconCopy,
  IconTrash,
  IconSparkles,
} from '@/fixed-pages/editor/diagrams/ui/toolbar/WorkbenchIcons';
import { ProofStepLinkModal } from '../components/ProofStepLinkModal';

export interface MdxFormatBarProps {
  isReadOnly?: boolean;
  canMutateStructure?: boolean;
  hasActiveProse: boolean;
  hasActiveDemoStep: boolean;
  onOpenLinker: () => void;
  onInsertStep: () => void;
  onMoveStep?: (direction: -1 | 1) => void;
  onDuplicateStep?: () => void;
  onDeleteStep?: () => void;
  /** Opens the block palette, inserting next to the selection. */
  onOpenPalette: () => void;
  onNotify?: (message: string) => void;
  onProseMutated?: () => void;
}

function keep(handler: () => void) {
  return (event: React.MouseEvent) => {
    event.preventDefault();
    handler();
  };
}

function btnClass(active = false, variant: 'default' | 'canela' = 'default') {
  return `flex h-8 items-center space-x-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canela disabled:opacity-40 disabled:cursor-not-allowed ${
    active
      ? 'bg-canela text-lienzo shadow-xs font-bold'
      : variant === 'canela'
      ? 'bg-canela/10 text-canela border border-canela/30 hover:bg-canela/20 font-bold'
      : 'bg-carbon/5 border border-carbon/15 text-carbon/80 hover:bg-carbon/10'
  }`;
}

export function MdxFormatBar({
  isReadOnly = false,
  canMutateStructure = true,
  hasActiveProse,
  hasActiveDemoStep,
  onOpenLinker,
  onInsertStep,
  onMoveStep,
  onDuplicateStep,
  onDeleteStep,
  onOpenPalette,
  onNotify,
  onProseMutated,
}: MdxFormatBarProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState<'paso' | null>(null);
  const [stepModalOpen, setStepModalOpen] = useState(false);

  const after = () => onProseMutated?.();
  const structureOff = isReadOnly || !canMutateStructure;
  const proseOff = isReadOnly || !hasActiveProse;

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!(event.target as HTMLElement)?.closest('[data-mdx-format-bar]')) setOpen(null);
    };
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, []);

  return (
    <>
      <div
        data-mdx-format-bar
        className="relative z-50 flex w-full min-w-0 shrink-0 flex-wrap items-center gap-1.5 border-b border-carbon/10 bg-lienzo/95 p-1.5 font-serif text-carbon shadow-2xs backdrop-blur-md select-none transition-colors motion-safe:transition-all"
        aria-label={t('editor.mdx.toolbar')}
      >
        {/* Formato de Texto */}
        <button
          type="button"
          disabled={proseOff}
          className={btnClass()}
          title={t('editor.mdx.bold')}
          onMouseDown={keep(() => {
            if (wrapSelectionWithTag('strong')) after();
            else onNotify?.('Selecciona texto para poner o quitar negrita.');
          })}
        >
          <span className="font-bold">N</span>
          <span className="hidden sm:inline font-medium">{t('editor.mdx.bold')}</span>
        </button>

        <button
          type="button"
          disabled={proseOff}
          className={btnClass()}
          title={t('editor.mdx.italic')}
          onMouseDown={keep(() => {
            if (wrapSelectionWithTag('em')) after();
            else onNotify?.('Selecciona texto para poner o quitar cursiva.');
          })}
        >
          <span className="italic font-serif">C</span>
          <span className="hidden sm:inline font-medium">{t('editor.mdx.italic')}</span>
        </button>

        <button
          type="button"
          disabled={proseOff}
          className={btnClass()}
          title={t('editor.mdx.inlineFormula')}
          onMouseDown={keep(() => {
            const code = getSelectedPlainText().trim() || 'x';
            if (insertHtmlAtSelection(latexSpanHtml(code))) after();
            else onNotify?.('Haz clic dentro del texto y vuelve a insertar la fórmula.');
          })}
        >
          <span className="font-mono text-xs">$x$</span>
          <span className="hidden sm:inline font-medium">{t('editor.mdx.inlineFormula')}</span>
        </button>

        <button
          type="button"
          disabled={proseOff}
          className={btnClass()}
          title={t('editor.format.blockFormulaTitle')}
          onMouseDown={keep(() => {
            if (insertHtmlAtSelection(formulaBlockHtml('$$ x = y $$'))) after();
            else onNotify?.(t('editor.format.blockFormulaNotify'));
          })}
        >
          <span className="font-mono text-xs">$$</span>
          <span className="hidden sm:inline font-medium">{t('editor.format.blockFormula')}</span>
        </button>

        <div className="mx-1 h-5 w-px bg-carbon/15" />

        {/* Enlaces y Diagrama */}
        <button
          type="button"
          disabled={proseOff}
          className={btnClass()}
          title={t('editor.format.linkTitle')}
          onMouseDown={keep(() => {
            if (!getSelectedPlainText().trim()) {
              onNotify?.(t('editor.format.linkNotify'));
              return;
            }
            onOpenLinker();
          })}
        >
          <span>{t('editor.format.link')}</span>
        </button>

        {/* Insertar Enlace a Paso (ProofStepLink) con Modal */}
        <button
          type="button"
          disabled={proseOff}
          className={btnClass()}
          onClick={() => setStepModalOpen(true)}
          title={t('editor.format.stepRefTitle')}
        >
          <span className="font-mono text-xs font-bold text-pavo">#</span>
          <span>{t('editor.format.stepRef')}</span>
        </button>

        <button
          type="button"
          disabled={proseOff}
          className={btnClass()}
          title={t('editor.format.highlightTitle')}
          onMouseDown={keep(() => {
            const selected = getSelectedPlainText().trim() || 'elemento';
            if (insertHtmlAtSelection(mdxToEditableHtml(buildInteractiveReference('elemento', 'canela', selected)))) after();
            else onNotify?.(t('editor.format.highlightNotify'));
          })}
        >
          <IconSparkles className="w-3.5 h-3.5 text-canela" />
          <span>{t('editor.format.diagram')}</span>
        </button>

        <div className="mx-1 h-5 w-px bg-carbon/15" />

        <button type="button" disabled={structureOff} className={btnClass(false)} aria-keyshortcuts="Control+/" onClick={onOpenPalette}>
          <IconPlus className="w-3.5 h-3.5" />
          <span>{t('editor.format.insertBlock')}</span>
        </button>

        {/* Control Único de Paso */}
        <div className="relative">
          <button
            type="button"
            disabled={structureOff}
            aria-expanded={open === 'paso'}
            className={btnClass(open === 'paso' || hasActiveDemoStep)}
            onClick={() => setOpen(open === 'paso' ? null : 'paso')}
          >
            <span className="font-bold">{t('editor.format.step')}</span>
            <IconChevronDown className="w-3 h-3 opacity-70" />
          </button>
          {open === 'paso' && (
            <div role="menu" className="absolute left-0 top-full z-[80] mt-1.5 w-56 overflow-hidden rounded-2xl border border-carbon/20 bg-lienzo p-1.5 shadow-2xl space-y-0.5">
              <button
                type="button"
                role="menuitem"
                className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold text-canela hover:bg-canela/10 transition-colors cursor-pointer"
                onClick={() => {
                  onInsertStep();
                  setOpen(null);
                }}
              >
                <IconPlus className="w-3.5 h-3.5" />
                <span>{t('editor.format.addStep')}</span>
              </button>
              <button
                type="button"
                role="menuitem"
                disabled={!hasActiveDemoStep}
                className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs disabled:opacity-40 hover:bg-carbon/5 transition-colors cursor-pointer"
                onClick={() => {
                  onMoveStep?.(-1);
                  setOpen(null);
                }}
              >
                <span>{t('editor.format.moveStepUp')}</span>
              </button>
              <button
                type="button"
                role="menuitem"
                disabled={!hasActiveDemoStep}
                className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs disabled:opacity-40 hover:bg-carbon/5 transition-colors cursor-pointer"
                onClick={() => {
                  onMoveStep?.(1);
                  setOpen(null);
                }}
              >
                <span>{t('editor.format.moveStepDown')}</span>
              </button>
              <button
                type="button"
                role="menuitem"
                disabled={!hasActiveDemoStep}
                className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs disabled:opacity-40 hover:bg-carbon/5 transition-colors cursor-pointer"
                onClick={() => {
                  onDuplicateStep?.();
                  setOpen(null);
                }}
              >
                <IconCopy className="w-3.5 h-3.5" />
                <span>{t('editor.format.duplicateStep')}</span>
              </button>
              <button
                type="button"
                role="menuitem"
                disabled={!hasActiveDemoStep}
                className="w-full flex items-center gap-2 rounded-xl px-3 py-2 text-left text-xs text-granada disabled:opacity-40 hover:bg-granada/5 transition-colors cursor-pointer"
                onClick={() => {
                  onDeleteStep?.();
                  setOpen(null);
                }}
              >
                <IconTrash className="w-3.5 h-3.5" />
                <span>{t('editor.format.deleteStep')}</span>
              </button>
            </div>
          )}
        </div>

        <div className="ml-auto hidden md:flex items-center space-x-2 bg-carbon/5 px-2.5 py-1 rounded-lg border border-carbon/15 text-xs">
          <span className="text-[11px] text-carbon/50">{t('editor.format.mode')}</span>
          <span className="font-bold text-canela">{t('editor.format.mdxFormat')}</span>
        </div>
      </div>

      <ProofStepLinkModal
        isOpen={stepModalOpen}
        initialStep={1}
        onClose={() => setStepModalOpen(false)}
        onConfirm={step => {
          if (insertHtmlAtSelection(proofStepLinkHtml(step))) {
            after();
          } else {
            onNotify?.(t('editor.format.stepRefNotify'));
          }
        }}
      />
    </>
  );
}
