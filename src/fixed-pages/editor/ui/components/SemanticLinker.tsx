import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useI18n } from '@/i18n';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import type { DiagramTargetRegistry } from '@/fixed-pages/editor/session/editorTypes';
import { useModalFocus } from '@/fixed-pages/editor/ui/page/useModalFocus';
import { getGlossaryDictionary } from '@/lib/stores/GlossaryStore';
import { Button, IconButton, RowButton, Swatch, Tabs, controlClassName } from '@/fixed-pages/editor/ui/primitives';

interface ConceptOption {
  id: string;
  name: string;
  type: string;
  badge?: string;
  path?: string;
}

function getTargetId(path: string): string {
  const basename = path.split('/').pop() || '';
  return basename.replace('.mdx', '');
}

interface SemanticLinkerProps {
  isOpen: boolean;
  onClose: () => void;
  files: FileNode[];
  selectedText: string;
  onLinkCreated: (linkMarkup: string) => void;
  position: { top: number; left: number };
  initialAttrs?: Record<string, any>;
  editingTag?: string;
  editingMarkup?: string;
  diagramTargets?: DiagramTargetRegistry;
}

type LinkType = 'concept' | 'reference' | 'graphic' | 'combined';
type SelectedConcept = string | string[] | null;

const ARTS_CRAFTS_COLORS = [
  { name: 'canela' },
  { name: 'terracota' },
  { name: 'ocre' },
  { name: 'pavo' },
  { name: 'mora' },
  { name: 'granada' }
];

function readableName(file: FileNode): string {
  return file.name.replace(/\.mdx$/, '').replace(/[-_]/g, ' ');
}

function readableType(file: FileNode): string {
  const parts = file.path.split('/');
  return parts.includes('definitions') ? 'definición'
    : parts.includes('theorems') ? 'teorema'
      : parts.includes('demonstrations') ? 'demostración'
        : parts.includes('exercises') ? 'ejercicio'
          : parts.includes('use-cases') ? 'caso de uso'
            : parts.includes('mathematicians') ? 'biografía'
              : parts.includes('models') ? 'modelo'
                : parts[2] || 'contenido';
}

function selectedConceptFrom(value: unknown): SelectedConcept {
  if (typeof value === 'string' && value.length > 0) return value;
  if (Array.isArray(value) && value.every(item => typeof item === 'string' && item.length > 0)) return value;
  return null;
}

function targetIdAttribute(target: Exclude<SelectedConcept, null>): string {
  return Array.isArray(target)
    ? `targetId={${JSON.stringify(target)}}`
    : `targetId="${target}"`;
}

export const SemanticLinker: React.FC<SemanticLinkerProps> = ({
  isOpen,
  onClose,
  files,
  selectedText,
  onLinkCreated,
  position,
  initialAttrs,
  editingTag,
  editingMarkup,
  diagramTargets = []
}) => {
  const { t } = useI18n();
  const [linkType, setLinkType] = useState<LinkType>('concept');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConcept, setSelectedConcept] = useState<SelectedConcept>(null);
  const [graphElementId, setGraphElementId] = useState('');
  const [selectedColor, setSelectedColor] = useState('canela');
  const [isDependency, setIsDependency] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useModalFocus<HTMLDivElement>(isOpen, onClose, closeButtonRef);

  const [prevOpenState, setPrevOpenState] = useState({
    isOpen: false,
    initialAttrs: undefined as Record<string, any> | undefined,
    editingTag: undefined as string | undefined,
    editingMarkup: undefined as string | undefined,
  });
  if (
    isOpen !== prevOpenState.isOpen ||
    initialAttrs !== prevOpenState.initialAttrs ||
    editingTag !== prevOpenState.editingTag ||
    editingMarkup !== prevOpenState.editingMarkup
  ) {
    setPrevOpenState({ isOpen, initialAttrs, editingTag, editingMarkup });
    if (isOpen) {
      setSearchQuery('');
      if (editingMarkup && initialAttrs) {
        // Modo edición: inicializar estado con los atributos del enlace existente
        if (editingTag === 'ConceptLink') {
          if (initialAttrs.highlightTarget) {
            setLinkType('combined');
            setSelectedConcept(selectedConceptFrom(initialAttrs.targetId));
            setGraphElementId(initialAttrs.highlightTarget || '');
            setSelectedColor(initialAttrs.highlightColor || 'canela');
            setIsDependency(initialAttrs.isDependency === true || initialAttrs.isDependency === 'true');
          } else {
            setLinkType('concept');
            setSelectedConcept(selectedConceptFrom(initialAttrs.targetId));
            setGraphElementId('');
            setSelectedColor('canela');
            setIsDependency(initialAttrs.isDependency === true || initialAttrs.isDependency === 'true');
          }
        } else if (editingTag === 'RefLink') {
          setLinkType('reference');
          setSelectedConcept(selectedConceptFrom(initialAttrs.targetId));
          setGraphElementId('');
        } else if (editingTag === 'InteractiveElement' || editingTag === 'VisualBind') {
          setLinkType('graphic');
          setGraphElementId(initialAttrs.target || initialAttrs.element || '');
          setSelectedColor(initialAttrs.color || 'canela');
          setSelectedConcept(null);
        }
      } else {
        // Modo creación nuevo
        setSelectedConcept(null);
        setGraphElementId('');
        setSelectedColor('canela');
        setSearchQuery(selectedText.trim());
        setLinkType(editingTag === 'InteractiveElement' ? 'graphic' : 'concept');
        setIsDependency(false);
      }
    }
  }

  const suggestions = useMemo<ConceptOption[]>(() => {
    const fileOptions: ConceptOption[] = files
      .filter(f => f.path.endsWith('.mdx'))
      .map(f => ({
        id: getTargetId(f.path),
        name: readableName(f),
        type: readableType(f),
        path: f.path,
      }));

    const dict = getGlossaryDictionary('es');
    const glossaryOptions: ConceptOption[] = Object.entries(dict).map(([key, entry]) => ({
      id: key,
      name: entry.title,
      type: entry.category || 'Glosario',
      badge: entry.category?.toLowerCase().includes('lóg') ? 'LÓGICA'
        : entry.category?.toLowerCase().includes('álg') ? 'ÁLGEBRA'
        : 'GLOSARIO',
    }));

    const allOptions = [...fileOptions, ...glossaryOptions];

    if (!searchQuery.trim()) {
      return allOptions;
    }

    const query = searchQuery.toLowerCase();
    return allOptions
      .filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query) ||
        (item.path && item.path.toLowerCase().includes(query))
      )
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        const aScore = aName === query || a.id === query ? 0 : aName.startsWith(query) || a.id.startsWith(query) ? 1 : 2;
        const bScore = bName === query || b.id === query ? 0 : bName.startsWith(query) || b.id.startsWith(query) ? 1 : 2;
        return aScore - bScore || aName.localeCompare(bName);
      });
  }, [searchQuery, files]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [containerRef, isOpen, onClose]);

  if (!isOpen) return null;

  const handleCreate = () => {
    let markup = '';
    
    if (linkType === 'concept') {
      if (!selectedConcept) return;
      markup = `<ConceptLink ${targetIdAttribute(selectedConcept)} isDependency={${isDependency}}>${selectedText}</ConceptLink>`;
    } else if (linkType === 'reference') {
      if (!selectedConcept) return;
      markup = `<RefLink ${targetIdAttribute(selectedConcept)}>${selectedText}</RefLink>`;
    } else if (linkType === 'graphic') {
      if (!graphElementId.trim()) return;
      markup = editingTag === 'VisualBind'
        ? `<VisualBind element="${graphElementId.trim()}" color="${selectedColor}">${selectedText}</VisualBind>`
        : `<InteractiveElement target="${graphElementId.trim()}" color="${selectedColor}">${selectedText}</InteractiveElement>`;
    } else if (linkType === 'combined') {
      if (!selectedConcept || !graphElementId.trim()) return;
      markup = `<ConceptLink ${targetIdAttribute(selectedConcept)} isDependency={${isDependency}} highlightTarget="${graphElementId.trim()}" highlightColor="${selectedColor}">${selectedText}</ConceptLink>`;
    }

    onLinkCreated(markup);
    onClose();
  };
  const selectedTargetIsValid = !graphElementId.trim() || diagramTargets.some(target => target.id === graphElementId.trim() || target.qualifiedId === graphElementId.trim());

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-label={t('editor.linker.dialogLabel')}
      className="absolute z-50 bg-lienzo border border-carbon/20 rounded shadow-xl p-3 w-80 flex flex-col gap-3 transition-all duration-200 animate-in fade-in zoom-in-95 text-carbon"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
    >
      <div className="flex justify-between items-center border-b border-carbon/15 pb-1">
        <span className="ac-label ac-label--sm text-carbon/60 font-serif">{t('editor.linker.title')}</span>
        <IconButton size="sm" label={t('editor.linker.close')} ref={closeButtonRef} onClick={onClose}>✕</IconButton>
      </div>
      
      <p className="text-xs italic text-carbon/75 truncate select-none">
        {t('editor.linker.selectedText', { text: selectedText })}
      </p>

      {/* Pestañas de tipo de enlace */}
      <Tabs
        aria-label={t('editor.linker.linkType')}
        activeTab={linkType}
        onTabChange={id => setLinkType(id as LinkType)}
        tabs={[
          { id: 'concept', label: t('editor.linker.typeConcept') },
          { id: 'reference', label: t('editor.linker.typeReference') },
          { id: 'graphic', label: t('editor.linker.typeGraphic') },
          { id: 'combined', label: t('editor.linker.typeCombined') },
        ]}
      />

      {/* Contenido según pestaña */}
      {(linkType === 'concept' || linkType === 'reference' || linkType === 'combined') && (
        <div className="space-y-1.5">
          <label className="block ac-label ac-label--xs">{t('editor.linker.libraryConcept')}</label>
          {selectedConcept ? (
            <div className="flex items-center justify-between p-1.5 bg-canela/5 border border-canela/20 rounded text-xs">
              <span className="font-serif font-bold text-canela">{Array.isArray(selectedConcept) ? selectedConcept.join(', ') : selectedConcept}</span>
              <Button size="sm" variant="quiet" onClick={() => setSelectedConcept(null)}>
                {t('editor.linker.change')}
              </Button>
            </div>
          ) : (
            <div className="space-y-1">
              <input
                type="text"
                placeholder={t('editor.linker.searchPlaceholder')}
                className={controlClassName}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <div className="max-h-36 overflow-y-auto border border-carbon/10 rounded divide-y divide-carbon/5 bg-lienzo">
                {suggestions.length === 0 ? (
                  <p className="text-[10px] text-carbon/40 p-2 italic text-center">{t('editor.linker.noConcepts')}</p>
                ) : (
                  suggestions.map(s => (
                    <RowButton key={s.id} className="min-w-0 flex-col items-stretch text-[11px]" onClick={() => setSelectedConcept(s.id)}>
                      <span className="block truncate font-serif font-bold capitalize">{s.name}</span>
                      <span className="mt-0.5 flex items-center justify-between gap-2">
                        <span className="truncate text-[9px] text-carbon/45">{s.type}</span>
                        <span className="truncate font-mono text-[8px] text-carbon/35">{s.id}</span>
                      </span>
                    </RowButton>
                  ))
                )}
              </div>
            </div>
          )}

          {linkType !== 'reference' && <label className="flex items-center justify-between rounded border border-carbon/10 bg-carbon/5 px-2 py-1.5 text-[10px] font-bold text-carbon/60">
            <span>{t('editor.linker.formalDependency')}</span>
            <input
              type="checkbox"
              checked={isDependency}
              onChange={(event) => setIsDependency(event.target.checked)}
              className="accent-canela"
            />
          </label>}
        </div>
      )}

      {(linkType === 'graphic' || linkType === 'combined') && (
        <div className="space-y-2 pt-1 border-t border-carbon/10">
          <div className="space-y-1">
            <label className="block ac-label ac-label--xs">{t('editor.linker.diagramElement')}</label>
            {diagramTargets.length > 0 && (
              <div className="mt-1 max-h-36 space-y-1 overflow-y-auto rounded border border-carbon/10 bg-lienzo p-1">
                {diagramTargets.map(target => (
                  <RowButton
                    key={target.id}
                    aria-current={graphElementId === target.id ? 'true' : undefined}
                    onClick={() => {
                      setGraphElementId(target.id);
                      setSelectedColor(target.kind === 'step' ? 'terracota' : target.color);
                    }}
                    className="block"
                    title={target.label}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate text-[10px] font-bold text-carbon">{target.label}</span>
                      {target.kind === 'step' ? (
                        <span className="text-[9px] font-mono font-bold text-terracota bg-terracota/15 px-1 py-0.5 rounded border border-terracota/30">{t('editor.linker.stepBadge')}</span>
                      ) : (
                        <span className="text-[9px] font-mono text-carbon/40">{target.kind}</span>
                      )}
                    </div>
                    <span className="block truncate font-mono text-[9px] text-carbon/45">{target.id}</span>
                  </RowButton>
                ))}
              </div>
            )}
            <input
              type="text"
              placeholder={t('editor.linker.manualTarget')}
              className={`${controlClassName} mt-1 font-mono`}
              value={graphElementId}
              onChange={(e) => setGraphElementId(e.target.value)}
            />
            {!selectedTargetIsValid && <p className="text-[10px] text-granada" role="alert">{t('editor.linker.targetNotPublished')}</p>}
          </div>

          <div className="space-y-1">
            <label className="block ac-label ac-label--xs">{t('editor.linker.highlightColor')}</label>
            <div className="flex gap-1.5">
              {ARTS_CRAFTS_COLORS.map(c => (
                <Swatch
                  key={c.name}
                  label={c.name}
                  selected={selectedColor === c.name}
                  onClick={() => setSelectedColor(c.name)}
                  style={{ backgroundColor: `var(--theme-${c.name})` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-1.5 mt-1">
        <Button size="sm" variant="primary" fullWidth disabled={
            (linkType === 'concept' && !selectedConcept) ||
            (linkType === 'reference' && !selectedConcept) ||
            (linkType === 'graphic' && !graphElementId.trim()) ||
            (linkType === 'combined' && (!selectedConcept || !graphElementId.trim())) ||
            ((linkType === 'graphic' || linkType === 'combined') && !selectedTargetIsValid)
          } onClick={handleCreate}>
          {editingMarkup ? t('editor.linker.saveChanges') : t('editor.linker.createLink')}
        </Button>

        {editingMarkup && (
          <Button size="sm" variant="danger" fullWidth onClick={() => {
              onLinkCreated(selectedText);
              onClose();
            }}>
            {t('editor.linker.removeLink')}
          </Button>
        )}
      </div>
    </div>
  );
};
