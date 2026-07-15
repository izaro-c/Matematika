import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { FileNode } from '../lib/editorContracts';
import {
  DEFAULT_EDITOR_CATALOG_FILTERS,
  filterCatalogResources,
  resourceDisplayName,
  type EditorCatalogFilters,
  type EditorResourceSection,
  type EditorWorkspaceLevel,
} from '../navigation/editorNavigationModel';

interface EditorNavigationProps {
  files: FileNode[];
  isLoading: boolean;
  error: string | null;
  currentFile: string | null;
  openFile: (path: string) => void;
  retry: () => void;
  close: () => void;
  level: EditorWorkspaceLevel;
  favoritePaths: string[];
  recentPaths: string[];
  toggleFavorite: (path: string) => void;
  width: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  theorems: 'Teoremas y lemas',
  definitions: 'Definiciones',
  demonstrations: 'Demostraciones',
  methods: 'Métodos',
  exercises: 'Ejercicios',
  mathematicians: 'Matemáticos',
  axioms: 'Axiomas',
  'axiomatic-systems': 'Sistemas axiomáticos',
  models: 'Modelos',
  usecases: 'Casos de uso',
};

function categoryLabel(type: string): string {
  const diagramType = type.startsWith('diagram-') ? type.slice('diagram-'.length) : '';
  if (diagramType) return diagramType.replace(/-/g, ' ').replace(/^\p{L}/u, value => value.toUpperCase());
  return CATEGORY_LABELS[type] ?? type.replace(/-/g, ' ').replace(/^\p{L}/u, value => value.toUpperCase());
}

function capabilityPresentation(file: FileNode): { label: string; className: string } {
  if (file.capability === 'visual-exact') return { label: 'Edición exacta', className: 'border-musgo/25 bg-musgo/10 text-musgo' };
  if (file.capability === 'code-preview') return { label: 'Código + vista previa', className: 'border-pavo/25 bg-pavo/10 text-pavo' };
  return { label: 'Requiere corrección', className: 'border-granada/25 bg-granada/10 text-granada' };
}

function ResourceButton({ file, current, favorite, level, openFile, toggleFavorite }: {
  file: FileNode;
  current: boolean;
  favorite: boolean;
  level: EditorWorkspaceLevel;
  openFile: (path: string) => void;
  toggleFavorite: (path: string) => void;
}) {
  const capability = capabilityPresentation(file);
  return (
    <div className={`group flex items-start rounded border ${current ? 'border-salvia/35 bg-salvia/10' : 'border-transparent hover:border-carbon/10 hover:bg-carbon/5'}`}>
      <button
        type="button"
        data-resource-path={file.path}
        onClick={() => openFile(file.path)}
        aria-current={current ? 'page' : undefined}
        title={`${file.capabilityLabel}. ${file.reason}`}
        className="min-w-0 flex-1 px-2.5 py-2 text-left"
      >
        <span className={`block truncate font-serif text-xs ${current ? 'font-bold text-carbon' : 'text-carbon/75'}`}>
          {resourceDisplayName(file)}
        </span>
        <span className={`mt-1 inline-flex rounded border px-1.5 py-0.5 text-[9px] font-bold ${capability.className}`}>
          {capability.label}
        </span>
        {level === 'advanced' && <span className="mt-1 block truncate font-mono text-[9px] text-carbon/40">{file.path}</span>}
      </button>
      <button
        type="button"
        onClick={() => toggleFavorite(file.path)}
        aria-label={favorite ? `Quitar ${resourceDisplayName(file)} de favoritos` : `Añadir ${resourceDisplayName(file)} a favoritos`}
        aria-pressed={favorite}
        title={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        className={`m-1.5 rounded px-1.5 py-1 text-sm ${favorite ? 'text-ocre' : 'text-carbon/25 opacity-70 group-hover:opacity-100'}`}
      >
        {favorite ? '★' : '☆'}
      </button>
    </div>
  );
}

export const EditorNavigation: React.FC<EditorNavigationProps> = ({
  files,
  isLoading,
  error,
  currentFile,
  openFile,
  retry,
  close,
  level,
  favoritePaths,
  recentPaths,
  toggleFavorite,
  width,
}) => {
  const [section, setSection] = useState<EditorResourceSection>('documents');
  const [filters, setFilters] = useState<EditorCatalogFilters>(DEFAULT_EDITOR_CATALOG_FILTERS);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onFocusSearch = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'p') {
        event.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
    };
    window.addEventListener('keydown', onFocusSearch);
    return () => window.removeEventListener('keydown', onFocusSearch);
  }, []);

  const sectionCounts = useMemo(() => ({
    documents: files.filter(file => file.kind === 'mdx-document').length,
    diagrams: files.filter(file => file.kind === 'diagram').length,
  }), [files]);
  const filtered = useMemo(() => filterCatalogResources(files, section, filters), [files, filters, section]);
  const types = useMemo(() => [...new Set(files.filter(file => (section === 'documents' ? file.kind === 'mdx-document' : file.kind === 'diagram')).map(file => file.type))].sort(), [files, section]);
  const byPath = useMemo(() => new Map(files.map(file => [file.path, file])), [files]);
  const favorites = favoritePaths.map(path => byPath.get(path)).filter((file): file is FileNode => Boolean(file) && (section === 'documents' ? file?.kind === 'mdx-document' : file?.kind === 'diagram'));
  const recents = recentPaths.map(path => byPath.get(path)).filter((file): file is FileNode => Boolean(file) && (section === 'documents' ? file?.kind === 'mdx-document' : file?.kind === 'diagram'));
  const grouped = useMemo(() => {
    const groups = new Map<string, FileNode[]>();
    for (const file of filtered) groups.set(file.type, [...(groups.get(file.type) ?? []), file]);
    return [...groups.entries()].sort(([a], [b]) => categoryLabel(a).localeCompare(categoryLabel(b), 'es'));
  }, [filtered]);

  const filtersActive = filters.query !== '' || filters.type !== 'all' || filters.status !== 'all' || filters.capability !== 'all';
  const updateFilter = <Key extends keyof EditorCatalogFilters>(key: Key, value: EditorCatalogFilters[Key]) => setFilters(previous => ({ ...previous, [key]: value }));
  const handleResourceKeys = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const resources = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[data-resource-path]')];
    const index = resources.indexOf(document.activeElement as HTMLButtonElement);
    if (index < 0) return;
    event.preventDefault();
    resources[(index + (event.key === 'ArrowDown' ? 1 : -1) + resources.length) % resources.length]?.focus();
  };

  return (
    <aside
      id="editor-navigation"
      aria-label="Explorador de recursos"
      className="fixed inset-y-0 left-0 z-40 flex max-w-[92vw] flex-col border-r border-carbon/15 bg-lienzo shadow-xl lg:relative lg:z-auto lg:max-w-none lg:shadow-none"
      style={{ width }}
    >
      <header className="flex items-center justify-between border-b border-carbon/15 px-4 py-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-salvia">Editor</p>
          <h2 className="font-serif text-base font-bold text-carbon">Recursos matemáticos</h2>
        </div>
        <button type="button" onClick={close} className="rounded border border-carbon/15 px-2 py-1 text-xs text-carbon/65" aria-label="Ocultar explorador">Ocultar</button>
      </header>

      <div className="grid grid-cols-2 border-b border-carbon/15 p-2" role="tablist" aria-label="Tipo de recurso">
        {([
          ['documents', 'Documentos', sectionCounts.documents],
          ['diagrams', 'Diagramas', sectionCounts.diagrams],
        ] as const).map(([id, label, count]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={section === id}
            onClick={() => {
              setSection(id);
              setFilters(DEFAULT_EDITOR_CATALOG_FILTERS);
            }}
            className={`rounded px-2 py-2 text-xs font-bold ${section === id ? 'bg-carbon text-lienzo' : 'text-carbon/60 hover:bg-carbon/5'}`}
          >
            {label} <span className="font-mono text-[9px] opacity-70">{count}</span>
          </button>
        ))}
      </div>

      <div className="space-y-2 border-b border-carbon/15 p-3">
        <label className="block">
          <span className="sr-only">Buscar recursos por nombre</span>
          <input
            ref={searchRef}
            type="search"
            value={filters.query}
            onChange={event => updateFilter('query', event.target.value)}
            placeholder={`Buscar ${section === 'documents' ? 'documentos' : 'diagramas'}…`}
            className="w-full rounded border border-carbon/20 bg-lienzo px-3 py-2 text-xs text-carbon outline-none placeholder:text-carbon/35 focus:border-salvia"
          />
        </label>
        <div className="grid grid-cols-2 gap-2">
          <label className="text-[9px] font-bold uppercase tracking-wide text-carbon/50">
            Tipo
            <select value={filters.type} onChange={event => updateFilter('type', event.target.value)} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo px-2 py-1.5 text-xs font-normal normal-case text-carbon">
              <option value="all">Todos</option>
              {types.map(type => <option key={type} value={type}>{categoryLabel(type)}</option>)}
            </select>
          </label>
          <label className="text-[9px] font-bold uppercase tracking-wide text-carbon/50">
            Estado
            <select value={filters.status} onChange={event => updateFilter('status', event.target.value as EditorCatalogFilters['status'])} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo px-2 py-1.5 text-xs font-normal normal-case text-carbon">
              <option value="all">Todos</option>
              <option value="available">Disponible</option>
              <option value="attention">Con límites</option>
              <option value="invalid">Con errores</option>
            </select>
          </label>
        </div>
        <label className="block text-[9px] font-bold uppercase tracking-wide text-carbon/50">
          Capacidad de edición
          <select value={filters.capability} onChange={event => updateFilter('capability', event.target.value as EditorCatalogFilters['capability'])} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo px-2 py-1.5 text-xs font-normal normal-case text-carbon">
            <option value="all">Todas</option>
            <option value="visual-exact">Edición visual exacta</option>
            <option value="code-preview">Código con vista previa</option>
            <option value="invalid">Requiere corrección</option>
          </select>
        </label>
      </div>

      <div className="flex-1 overflow-y-auto p-3" onKeyDown={handleResourceKeys}>
        {isLoading && (
          <div role="status" className="space-y-2 p-2" aria-label="Cargando catálogo">
            {[0, 1, 2, 3].map(item => <div key={item} className="h-11 animate-pulse rounded bg-carbon/5" />)}
            <p className="pt-2 text-xs italic text-carbon/50">Comprobando el catálogo seguro…</p>
          </div>
        )}
        {!isLoading && error && (
          <div role="alert" className="rounded border border-granada/25 bg-granada/5 p-3 text-xs text-carbon/70">
            <p className="font-bold text-granada">No se pudo cargar el catálogo</p>
            <p className="mt-1">{error}</p>
            <button type="button" onClick={retry} className="mt-3 rounded bg-granada px-3 py-1 font-bold text-lienzo">Reintentar</button>
          </div>
        )}
        {!isLoading && !error && files.length === 0 && (
          <div className="rounded border border-dashed border-carbon/20 p-4 text-center text-xs text-carbon/55">
            No hay recursos editables en el catálogo seguro.
          </div>
        )}
        {!isLoading && !error && files.length > 0 && filtered.length === 0 && (
          <div className="rounded border border-dashed border-carbon/20 p-4 text-center text-xs text-carbon/55">
            <p>No hay resultados con estos filtros.</p>
            {filtersActive && <button type="button" onClick={() => setFilters(DEFAULT_EDITOR_CATALOG_FILTERS)} className="mt-3 rounded border border-carbon/20 px-3 py-1 font-bold text-carbon">Limpiar filtros</button>}
          </div>
        )}

        {!filtersActive && favorites.length > 0 && (
          <section className="mb-4" aria-labelledby="editor-favorites-heading">
            <h3 id="editor-favorites-heading" className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-widest text-ocre">Favoritos</h3>
            <div className="space-y-1">{favorites.map(file => <ResourceButton key={`favorite-${file.path}`} file={file} current={file.path === currentFile} favorite level={level} openFile={openFile} toggleFavorite={toggleFavorite} />)}</div>
          </section>
        )}
        {!filtersActive && recents.length > 0 && (
          <section className="mb-4" aria-labelledby="editor-recents-heading">
            <h3 id="editor-recents-heading" className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-widest text-pizarra">Recientes</h3>
            <div className="space-y-1">{recents.slice(0, 4).map(file => <ResourceButton key={`recent-${file.path}`} file={file} current={file.path === currentFile} favorite={favoritePaths.includes(file.path)} level={level} openFile={openFile} toggleFavorite={toggleFavorite} />)}</div>
          </section>
        )}

        {grouped.map(([type, resources]) => {
          const expanded = expandedGroups[type] ?? true;
          return (
            <section key={type} className="mb-2">
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setExpandedGroups(previous => ({ ...previous, [type]: !expanded }))}
                className="flex w-full items-center justify-between rounded px-2 py-1.5 text-left font-serif text-xs font-bold text-carbon/70 hover:bg-carbon/5"
              >
                <span>{categoryLabel(type)}</span>
                <span className="font-mono text-[9px] text-carbon/40">{resources.length} {expanded ? '▾' : '▸'}</span>
              </button>
              {expanded && <div className="ml-2 space-y-1 border-l border-carbon/10 pl-2">{resources.map(file => <ResourceButton key={file.path} file={file} current={file.path === currentFile} favorite={favoritePaths.includes(file.path)} level={level} openFile={openFile} toggleFavorite={toggleFavorite} />)}</div>}
            </section>
          );
        })}
      </div>
      <footer className="border-t border-carbon/15 px-3 py-2 text-[9px] text-carbon/45">
        <span className="font-bold">Ctrl/⌘ P</span> busca · <span className="font-bold">↑ ↓</span> recorre recursos
      </footer>
    </aside>
  );
};

export default EditorNavigation;
