import React, { useState, useEffect, useRef } from 'react';
import type { FileNode } from '../../lib/editorContracts';
import type { DiagramTargetRegistry } from '../../core/editorTypes';

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

type LinkType = 'concept' | 'graphic' | 'combined';

const ARTS_CRAFTS_COLORS = [
  { name: 'salvia' },
  { name: 'terracota' },
  { name: 'ocre' },
  { name: 'pavo' },
  { name: 'pizarra' },
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
  const [linkType, setLinkType] = useState<LinkType>('concept');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);
  const [graphElementId, setGraphElementId] = useState('');
  const [selectedColor, setSelectedColor] = useState('salvia');
  const [isDependency, setIsDependency] = useState(false);
  const [suggestions, setSuggestions] = useState<FileNode[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setSearchQuery('');
    setSuggestions(files.filter(f => f.path.endsWith('.mdx')));

    if (editingMarkup && initialAttrs) {
      // Modo edición: inicializar estado con los atributos del enlace existente
      if (editingTag === 'ConceptLink') {
        if (initialAttrs.highlightTarget) {
          setLinkType('combined');
          setSelectedConcept(initialAttrs.targetId || null);
          setGraphElementId(initialAttrs.highlightTarget || '');
          setSelectedColor(initialAttrs.highlightColor || 'salvia');
          setIsDependency(initialAttrs.isDependency === true || initialAttrs.isDependency === 'true');
        } else {
          setLinkType('concept');
          setSelectedConcept(initialAttrs.targetId || null);
          setGraphElementId('');
          setSelectedColor('salvia');
          setIsDependency(initialAttrs.isDependency === true || initialAttrs.isDependency === 'true');
        }
      } else if (editingTag === 'InteractiveElement') {
        setLinkType('graphic');
        setGraphElementId(initialAttrs.target || '');
        setSelectedColor(initialAttrs.color || 'salvia');
        setSelectedConcept(null);
      }
    } else {
      // Modo creación nuevo
      setSelectedConcept(null);
      setGraphElementId('');
      setSelectedColor('salvia');
      setSearchQuery(selectedText.trim());
      setLinkType(diagramTargets.length > 0 ? 'combined' : 'concept');
      setIsDependency(false);
    }
  }, [isOpen, files, initialAttrs, editingTag, editingMarkup, selectedText, diagramTargets.length]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions(files.filter(f => f.path.endsWith('.mdx')));
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = files
      .filter(f =>
        f.path.endsWith('.mdx') &&
        (`${readableName(f)} ${f.path}`.toLowerCase().includes(query))
      )
      .sort((a, b) => {
        const aName = readableName(a).toLowerCase();
        const bName = readableName(b).toLowerCase();
        const aScore = aName === query ? 0 : aName.startsWith(query) ? 1 : 2;
        const bScore = bName === query ? 0 : bName.startsWith(query) ? 1 : 2;
        return aScore - bScore || aName.localeCompare(bName);
      });
    setSuggestions(filtered);
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getTargetId = (path: string): string => {
    const basename = path.split('/').pop() || '';
    return basename.replace('.mdx', '');
  };

  const handleCreate = () => {
    let markup = '';
    
    if (linkType === 'concept') {
      if (!selectedConcept) return;
      markup = `<ConceptLink targetId="${selectedConcept}" isDependency={${isDependency}}>${selectedText}</ConceptLink>`;
    } else if (linkType === 'graphic') {
      if (!graphElementId.trim()) return;
      markup = `<InteractiveElement target="${graphElementId.trim()}" color="${selectedColor}">${selectedText}</InteractiveElement>`;
    } else if (linkType === 'combined') {
      if (!selectedConcept || !graphElementId.trim()) return;
      markup = `<ConceptLink targetId="${selectedConcept}" isDependency={${isDependency}} highlightTarget="${graphElementId.trim()}" highlightColor="${selectedColor}">${selectedText}</ConceptLink>`;
    }

    onLinkCreated(markup);
    onClose();
  };

  return (
    <div
      ref={containerRef}
      className="absolute z-50 bg-lienzo border border-carbon/20 rounded shadow-xl p-3 w-80 flex flex-col gap-3 transition-all duration-200 animate-in fade-in zoom-in-95 text-carbon"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
    >
      <div className="flex justify-between items-center border-b border-carbon/15 pb-1">
        <span className="text-[10px] font-serif font-bold text-carbon/60 uppercase tracking-wider">Conectar texto</span>
        <button onClick={onClose} className="text-xs text-carbon/40 hover:text-carbon font-bold">✕</button>
      </div>
      
      <p className="text-xs italic text-carbon/75 truncate select-none">
        Texto seleccionado: "{selectedText}"
      </p>

      {/* Pestañas de tipo de enlace */}
      <div className="flex bg-carbon/5 rounded p-0.5 text-[10px] font-sans font-bold">
        <button
          type="button"
          onClick={() => setLinkType('concept')}
          className={`flex-1 py-1 rounded-sm text-center transition-all ${linkType === 'concept' ? 'bg-lienzo shadow-sm text-carbon' : 'text-carbon/50 hover:text-carbon'}`}
        >
          Concepto
        </button>
        <button
          type="button"
          onClick={() => setLinkType('graphic')}
          className={`flex-1 py-1 rounded-sm text-center transition-all ${linkType === 'graphic' ? 'bg-lienzo shadow-sm text-carbon' : 'text-carbon/50 hover:text-carbon'}`}
        >
          Gráfico
        </button>
        <button
          type="button"
          onClick={() => setLinkType('combined')}
          className={`flex-1 py-1 rounded-sm text-center transition-all ${linkType === 'combined' ? 'bg-lienzo shadow-sm text-carbon' : 'text-carbon/50 hover:text-carbon'}`}
        >
          Combinado
        </button>
      </div>

      {/* Contenido según pestaña */}
      {(linkType === 'concept' || linkType === 'combined') && (
        <div className="space-y-1.5">
          <label className="block text-[9px] uppercase font-bold text-carbon/50 font-sans">Concepto en Biblioteca</label>
          {selectedConcept ? (
            <div className="flex items-center justify-between p-1.5 bg-salvia/5 border border-salvia/20 rounded text-xs">
              <span className="font-serif font-bold text-salvia">{selectedConcept}</span>
              <button
                type="button"
                onClick={() => setSelectedConcept(null)}
                className="text-[10px] text-carbon/40 hover:text-carbon font-bold"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <input
                type="text"
                placeholder="Buscar por nombre, tipo o carpeta..."
                className="w-full bg-carbon/5 border border-carbon/15 p-1.5 rounded text-xs focus:outline-none focus:border-salvia/50 text-carbon"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <div className="max-h-28 overflow-y-auto border border-carbon/10 rounded divide-y divide-carbon/5 bg-lienzo">
                {suggestions.length === 0 ? (
                  <p className="text-[10px] text-carbon/40 p-2 italic text-center">No se encontraron conceptos</p>
                ) : (
                  suggestions.map(s => {
                    const targetId = getTargetId(s.path);
                    return (
                      <button
                        key={s.path}
                        type="button"
                        onClick={() => setSelectedConcept(targetId)}
                        className="w-full text-left px-2 py-1.5 text-[11px] hover:bg-carbon/5 hover:text-carbon transition-colors"
                      >
                        <span className="block truncate font-serif font-bold capitalize">{readableName(s)}</span>
                        <span className="mt-0.5 flex items-center justify-between gap-2">
                          <span className="truncate text-[9px] text-carbon/45">{readableType(s)}</span>
                          <span className="truncate font-mono text-[8px] text-carbon/35">{targetId}</span>
                        </span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}

          <label className="flex items-center justify-between rounded border border-carbon/10 bg-carbon/5 px-2 py-1.5 text-[10px] font-bold text-carbon/60">
            <span>Crear dependencia formal</span>
            <input
              type="checkbox"
              checked={isDependency}
              onChange={(event) => setIsDependency(event.target.checked)}
              className="accent-salvia"
            />
          </label>
        </div>
      )}

      {(linkType === 'graphic' || linkType === 'combined') && (
        <div className="space-y-2 pt-1 border-t border-carbon/10">
          <div className="space-y-1">
            <label className="block text-[9px] uppercase font-bold text-carbon/50 font-sans">Elemento del diagrama</label>
            {diagramTargets.length > 0 && (
              <div className="mt-1 max-h-32 space-y-1 overflow-y-auto rounded border border-carbon/10 bg-lienzo p-1">
                {diagramTargets.map(target => (
                  <button
                    key={target.id}
                    type="button"
                    onClick={() => {
                      setGraphElementId(target.id);
                      setSelectedColor(target.color);
                    }}
                    className={`block w-full rounded border px-2 py-1 text-left hover:border-salvia/30 hover:bg-salvia/5 ${graphElementId === target.id ? 'border-salvia/40 bg-salvia/10' : 'border-carbon/10 bg-carbon/5'}`}
                    title={target.label}
                  >
                    <span className="block truncate text-[10px] font-bold text-carbon">{target.label}</span>
                    <span className="block truncate font-mono text-[9px] text-carbon/45">{target.id} · {target.kind}</span>
                  </button>
                ))}
              </div>
            )}
            <input
              type="text"
              placeholder="Target manual avanzado"
              className="mt-1 w-full bg-carbon/5 border border-carbon/15 p-1.5 rounded text-xs focus:outline-none focus:border-salvia/50 text-carbon font-mono"
              value={graphElementId}
              onChange={(e) => setGraphElementId(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[9px] uppercase font-bold text-carbon/50 font-sans">Color de Resaltado</label>
            <div className="flex gap-1.5">
              {ARTS_CRAFTS_COLORS.map(c => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setSelectedColor(c.name)}
                  className={`w-6 h-6 rounded-full transition-transform relative flex items-center justify-center ${
                    selectedColor === c.name ? 'scale-110 ring-2 ring-carbon/25' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: `var(--theme-${c.name})` }}
                  title={c.name}
                >
                  {selectedColor === c.name && (
                    <span className="text-[9px] text-white font-bold select-none">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-1.5 mt-1">
        <button
          type="button"
          disabled={
            (linkType === 'concept' && !selectedConcept) ||
            (linkType === 'graphic' && !graphElementId.trim()) ||
            (linkType === 'combined' && (!selectedConcept || !graphElementId.trim()))
          }
          onClick={handleCreate}
          className="w-full py-1.5 bg-salvia text-lienzo rounded text-xs font-serif font-bold hover:bg-salvia/80 disabled:opacity-40 transition-all shadow-sm"
        >
          {editingMarkup ? 'Guardar Cambios' : 'Crear Vínculo'}
        </button>

        {editingMarkup && (
          <button
            type="button"
            onClick={() => {
              onLinkCreated(selectedText);
              onClose();
            }}
            className="w-full py-1 bg-terracota/10 text-terracota border border-terracota/20 rounded text-xs font-serif font-bold hover:bg-terracota/20 transition-all"
          >
            Quitar Vínculo
          </button>
        )}
      </div>
    </div>
  );
};
