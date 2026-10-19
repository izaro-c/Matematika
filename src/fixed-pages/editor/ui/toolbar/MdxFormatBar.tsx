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
import { Button, Menu, MenuItem } from '../primitives';
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
        className="relative z-50 flex w-full min-w-0 shrink-0 flex-wrap items-center gap-1.5 border-b border-[color:var(--ed-rule-faint)] bg-lienzo p-1.5 text-carbon select-none"
        aria-label={t('editor.mdx.toolbar')}
      >
        {/* Formato de Texto */}
        <Button
          disabled={proseOff}
          variant="quiet"
          size="sm"
          title={t('editor.mdx.bold')}
          onMouseDown={keep(() => {
            if (wrapSelectionWithTag('strong')) after();
            else onNotify?.('Selecciona texto para poner o quitar negrita.');
          })}
        >
          <span className="font-bold">N</span>
          <span className="hidden sm:inline font-medium">{t('editor.mdx.bold')}</span>
        </Button>

        <Button
          disabled={proseOff}
          variant="quiet"
          size="sm"
          title={t('editor.mdx.italic')}
          onMouseDown={keep(() => {
            if (wrapSelectionWithTag('em')) after();
            else onNotify?.('Selecciona texto para poner o quitar cursiva.');
          })}
        >
          <span className="italic font-serif">C</span>
          <span className="hidden sm:inline font-medium">{t('editor.mdx.italic')}</span>
        </Button>

        <Button
          disabled={proseOff}
          variant="quiet"
          size="sm"
          title={t('editor.mdx.inlineFormula')}
          onMouseDown={keep(() => {
            const code = getSelectedPlainText().trim() || 'x';
            if (insertHtmlAtSelection(latexSpanHtml(code))) after();
            else onNotify?.('Haz clic dentro del texto y vuelve a insertar la fórmula.');
          })}
        >
          <span className="font-mono text-xs">$x$</span>
          <span className="hidden sm:inline font-medium">{t('editor.mdx.inlineFormula')}</span>
        </Button>

        <Button
          disabled={proseOff}
          variant="quiet"
          size="sm"
          title={t('editor.format.blockFormulaTitle')}
          onMouseDown={keep(() => {
            if (insertHtmlAtSelection(formulaBlockHtml('$$ x = y $$'))) after();
            else onNotify?.(t('editor.format.blockFormulaNotify'));
          })}
        >
          <span className="font-mono text-xs">$$</span>
          <span className="hidden sm:inline font-medium">{t('editor.format.blockFormula')}</span>
        </Button>

        <span className="mx-1 h-5 w-px bg-[color:var(--ed-rule-faint)]" aria-hidden="true" />

        {/* Enlaces y Diagrama */}
        <Button
          disabled={proseOff}
          variant="quiet"
          size="sm"
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
        </Button>

        {/* Insertar Enlace a Paso (ProofStepLink) con Modal */}
        <Button
          disabled={proseOff}
          variant="quiet"
          size="sm"
          onClick={() => setStepModalOpen(true)}
          title={t('editor.format.stepRefTitle')}
        >
          <span className="font-mono text-xs font-bold text-pavo">#</span>
          <span>{t('editor.format.stepRef')}</span>
        </Button>

        <Button
          disabled={proseOff}
          variant="quiet"
          size="sm"
          title={t('editor.format.highlightTitle')}
          onMouseDown={keep(() => {
            const selected = getSelectedPlainText().trim() || 'elemento';
            if (insertHtmlAtSelection(mdxToEditableHtml(buildInteractiveReference('elemento', 'canela', selected)))) after();
            else onNotify?.(t('editor.format.highlightNotify'));
          })}
        >
          <IconSparkles className="w-3.5 h-3.5 text-canela" />
          <span>{t('editor.format.diagram')}</span>
        </Button>

        <span className="mx-1 h-5 w-px bg-[color:var(--ed-rule-faint)]" aria-hidden="true" />

        <Button disabled={structureOff} variant="quiet" size="sm" aria-keyshortcuts="Control+/" onClick={onOpenPalette}>
          <IconPlus className="w-3.5 h-3.5" />
          <span>{t('editor.format.insertBlock')}</span>
        </Button>

        {/* Control Único de Paso */}
        <div className="relative">
          <Button
            disabled={structureOff}
            aria-expanded={open === 'paso'}
            variant="quiet"
            size="sm"
            onClick={() => setOpen(open === 'paso' ? null : 'paso')}
          >
            <span className="font-bold">{t('editor.format.step')}</span>
            <IconChevronDown className="w-3 h-3 opacity-70" />
          </Button>
          {open === 'paso' && (
            <Menu className="absolute left-0 top-full mt-1.5 w-56">
              <MenuItem
                onClick={() => {
                  onInsertStep();
                  setOpen(null);
                }}
              >
                <IconPlus className="w-3.5 h-3.5" />
                <span>{t('editor.format.addStep')}</span>
              </MenuItem>
              <MenuItem
                disabled={!hasActiveDemoStep}
                onClick={() => {
                  onMoveStep?.(-1);
                  setOpen(null);
                }}
              >
                <span>{t('editor.format.moveStepUp')}</span>
              </MenuItem>
              <MenuItem
                disabled={!hasActiveDemoStep}
                onClick={() => {
                  onMoveStep?.(1);
                  setOpen(null);
                }}
              >
                <span>{t('editor.format.moveStepDown')}</span>
              </MenuItem>
              <MenuItem
                disabled={!hasActiveDemoStep}
                onClick={() => {
                  onDuplicateStep?.();
                  setOpen(null);
                }}
              >
                <IconCopy className="w-3.5 h-3.5" />
                <span>{t('editor.format.duplicateStep')}</span>
              </MenuItem>
              <MenuItem
                disabled={!hasActiveDemoStep}
                onClick={() => {
                  onDeleteStep?.();
                  setOpen(null);
                }}
                tone="danger"
              >
                <IconTrash className="w-3.5 h-3.5" />
                <span>{t('editor.format.deleteStep')}</span>
              </MenuItem>
            </Menu>
          )}
        </div>

        <p className="ml-auto hidden md:block text-sm italic text-carbon/60">
          {t('editor.format.mode')} <span className="not-italic">{t('editor.format.mdxFormat')}</span>
        </p>
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
