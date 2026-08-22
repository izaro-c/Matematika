import React, { useEffect, useMemo, useState } from 'react';
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
import type { BlockPreset } from '../panels/visualEditorPresets';
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
  blockPresets: BlockPreset[];
  onOpenLinker: () => void;
  onInsertStep: () => void;
  onMoveStep?: (direction: -1 | 1) => void;
  onDuplicateStep?: () => void;
  onDeleteStep?: () => void;
  onInsertPreset: (preset: BlockPreset) => void;
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
  blockPresets,
  onOpenLinker,
  onInsertStep,
  onMoveStep,
  onDuplicateStep,
  onDeleteStep,
  onInsertPreset,
  onNotify,
  onProseMutated,
}: MdxFormatBarProps) {
  const [open, setOpen] = useState<'insert' | 'paso' | null>(null);
  const [query, setQuery] = useState('');
  const [stepModalOpen, setStepModalOpen] = useState(false);

  const after = () => onProseMutated?.();
  const structureOff = isReadOnly || !canMutateStructure;
  const proseOff = isReadOnly || !hasActiveProse;

  const filteredPresets = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('es');
    return blockPresets.filter(p => !q || `${p.label} ${p.type}`.toLocaleLowerCase('es').includes(q));
  }, [blockPresets, query]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!(event.target as HTMLElement)?.closest('[data-mdx-format-bar]')) setOpen(null);
    };
    window.addEventListener('mousedown', close);
    return () => window.removeEventListener('mousedown', close);
  }, []);

  return (
    <>
      <nav
        data-mdx-format-bar
        className="relative z-50 flex w-full min-w-0 shrink-0 flex-wrap items-center gap-1.5 border-b border-carbon/10 bg-lienzo/95 p-1.5 font-serif text-carbon shadow-2xs backdrop-blur-md select-none transition-colors motion-safe:transition-all"
        aria-label="Barra de formato del documento"
      >
        {/* Formato de Texto */}
        <button
          type="button"
          disabled={proseOff}
          className={btnClass()}
          title="Alternar Negrita (Ctrl+B)"
          onMouseDown={keep(() => {
            if (wrapSelectionWithTag('strong')) after();
            else onNotify?.('Selecciona texto para poner o quitar negrita.');
          })}
        >
          <span className="font-bold">N</span>
          <span className="hidden sm:inline font-medium">Negrita</span>
        </button>

        <button
          type="button"
          disabled={proseOff}
          className={btnClass()}
          title="Alternar Cursiva (Ctrl+I)"
          onMouseDown={keep(() => {
            if (wrapSelectionWithTag('em')) after();
            else onNotify?.('Selecciona texto para poner o quitar cursiva.');
          })}
        >
          <span className="italic font-serif">C</span>
          <span className="hidden sm:inline font-medium">Cursiva</span>
        </button>

        <button
          type="button"
          disabled={proseOff}
          className={btnClass()}
          title="Fórmula inline $…$"
          onMouseDown={keep(() => {
            const code = getSelectedPlainText().trim() || 'x';
            if (insertHtmlAtSelection(latexSpanHtml(code))) after();
            else onNotify?.('Haz clic dentro del texto y vuelve a insertar la fórmula.');
          })}
        >
          <span className="font-mono text-xs">$x$</span>
          <span className="hidden sm:inline font-medium">Fórmula Inline</span>
        </button>

        <button
          type="button"
          disabled={proseOff}
          className={btnClass()}
          title="Fórmula destacada (bloque)"
          onMouseDown={keep(() => {
            if (insertHtmlAtSelection(formulaBlockHtml('$$ x = y $$'))) after();
            else onNotify?.('Haz clic dentro del paso o párrafo donde quieras la fórmula.');
          })}
        >
          <span className="font-mono text-xs">$$</span>
          <span className="hidden sm:inline font-medium">Fórmula Bloque</span>
        </button>

        <div className="mx-1 h-5 w-px bg-carbon/15" />

        {/* Enlaces y Diagrama */}
        <button
          type="button"
          disabled={proseOff}
          className={btnClass()}
          title="Enlazar la selección a un concepto"
          onMouseDown={keep(() => {
            if (!getSelectedPlainText().trim()) {
              onNotify?.('Selecciona el texto que quieres enlazar.');
              return;
            }
            onOpenLinker();
          })}
        >
          <span>Enlazar</span>
        </button>

        {/* Insertar Enlace a Paso (ProofStepLink) con Modal */}
        <button
          type="button"
          disabled={proseOff}
          className={btnClass()}
          onClick={() => setStepModalOpen(true)}
          title="Insertar referencia a un paso de demostración"
        >
          <span className="font-mono text-xs font-bold text-pavo">#</span>
          <span>Paso ref.</span>
        </button>

        <button
          type="button"
          disabled={proseOff}
          className={btnClass()}
          title="Resaltar elemento del diagrama"
          onMouseDown={keep(() => {
            const selected = getSelectedPlainText().trim() || 'elemento';
            if (insertHtmlAtSelection(mdxToEditableHtml(buildInteractiveReference('elemento', 'canela', selected)))) after();
            else onNotify?.('Haz clic en el texto del paso y selecciona o escribe el rótulo.');
          })}
        >
          <IconSparkles className="w-3.5 h-3.5 text-canela" />
          <span>Diagrama</span>
        </button>

        <div className="mx-1 h-5 w-px bg-carbon/15" />

        {/* Insertar Bloque General */}
        <div className="relative">
          <button
            type="button"
            disabled={structureOff}
            aria-expanded={open === 'insert'}
            className={btnClass(open === 'insert')}
            onClick={() => setOpen(open === 'insert' ? null : 'insert')}
          >
            <IconPlus className="w-3.5 h-3.5" />
            <span>Insertar Bloque</span>
            <IconChevronDown className="w-3 h-3 opacity-70" />
          </button>
          {open === 'insert' && (
            <div role="menu" className="absolute left-0 top-full z-[80] mt-1.5 w-80 max-h-96 overflow-hidden rounded-2xl border border-carbon/20 bg-lienzo shadow-2xl">
              <div className="border-b border-carbon/10 p-2">
                <input
                  autoFocus
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar bloque…"
                  className="h-8 w-full rounded-lg border border-carbon/15 bg-carbon/5 px-2.5 text-xs outline-none focus:border-canela font-sans"
                />
              </div>
              <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5">
                {filteredPresets.map(preset => (
                  <button
                    key={`${preset.type}-${preset.label}`}
                    type="button"
                    role="menuitem"
                    className="w-full rounded-xl border border-transparent px-3 py-2 text-left hover:border-canela/30 hover:bg-canela/5 transition-all cursor-pointer"
                    onClick={() => {
                      onInsertPreset(preset);
                      setOpen(null);
                      setQuery('');
                    }}
                  >
                    <span className="block text-xs font-bold text-carbon">{preset.label}</span>
                    <span className="block text-[10px] text-carbon/45">{preset.type}</span>
                  </button>
                ))}
                {filteredPresets.length === 0 && (
                  <p className="px-3 py-4 text-[11px] italic text-carbon/50">Ningún bloque coincide.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Control Único de Paso */}
        <div className="relative">
          <button
            type="button"
            disabled={structureOff}
            aria-expanded={open === 'paso'}
            className={btnClass(open === 'paso' || hasActiveDemoStep)}
            onClick={() => setOpen(open === 'paso' ? null : 'paso')}
          >
            <span className="font-bold">Paso</span>
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
                <span>Añadir paso</span>
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
                <span>Subir paso seleccionado</span>
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
                <span>Bajar paso seleccionado</span>
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
                <span>Duplicar paso</span>
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
                <span>Eliminar paso</span>
              </button>
            </div>
          )}
        </div>

        <div className="ml-auto hidden md:flex items-center space-x-2 bg-carbon/5 px-2.5 py-1 rounded-lg border border-carbon/15 text-xs">
          <span className="text-[11px] text-carbon/50">Modo:</span>
          <span className="font-bold text-canela">Formato MDX</span>
        </div>
      </nav>

      <ProofStepLinkModal
        isOpen={stepModalOpen}
        initialStep={1}
        onClose={() => setStepModalOpen(false)}
        onConfirm={step => {
          if (insertHtmlAtSelection(proofStepLinkHtml(step))) {
            after();
          } else {
            onNotify?.('Haz clic dentro del paso o párrafo donde quieras insertar la referencia.');
          }
        }}
      />
    </>
  );
}
