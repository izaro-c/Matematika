import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import {
  DEFAULT_EDITOR_CATALOG_FILTERS,
  extractResourceIdentity,
  filterCatalogResources,
  getCategoryDisplayName,
  resourceDisplayName,
  type EditorCatalogFilters,
  type EditorResourceSection,
  type EditorWorkspaceLevel,
} from '@/fixed-pages/editor/session/editorNavigationModel';
import { SUPPORTED_LANGUAGES } from '@/i18n/config';
import { useI18n } from '@/i18n';
import { EditorLanguageBadges } from '@/fixed-pages/editor/ui/workbench/EditorHeaderPrimitives';

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
  onCreatePage?: () => void;
  onCreateDiagram?: () => void;
  onCreateTranslation?: (file: FileNode, targetLang: string) => void;
}

function categoryLabel(type: string): string {
  return getCategoryDisplayName(type, 'plural');
}

function capabilityPresentation(file: FileNode): { label: string; className: string } {
  if (file.capability === 'visual-exact') return { label: 'Editable', className: 'border-musgo/25 bg-musgo/10 text-musgo' };
  if (file.capability === 'code-preview') return { label: 'Solo fuente', className: 'border-pavo/25 bg-pavo/10 text-pavo' };
  return { label: 'Requiere corrección', className: 'border-granada/25 bg-granada/10 text-granada' };
}

function ResourceButton({
  file,
  current,
  favorite,
  level,
  openFile,
  toggleFavorite,
  variants,
  onCreateTranslation,
}: {
  file: FileNode;
  current: boolean;
  favorite: boolean;
  level: EditorWorkspaceLevel;
  openFile: (path: string) => void;
  toggleFavorite: (path: string) => void;
  variants?: Record<string, FileNode>;
  onCreateTranslation?: (file: FileNode, targetLang: string) => void;
}) {
  const capability = capabilityPresentation(file);
  const isDocument = file.kind === 'mdx-document';
  const availableLangs = useMemo(() => Object.keys(variants ?? {}), [variants]);
  const activeLang = current
    ? (Object.entries(variants ?? {}).find(([_, v]) => v.path === file.path)?.[0] || 'es')
    : '';

  return (
    <div className={`group flex flex-col rounded border p-1.5 ${current ? 'border-canela/35 bg-canela/10' : 'border-transparent hover:border-carbon/10 hover:bg-carbon/5'}`}>
      <div className="flex items-start justify-between gap-1">
        <button
          type="button"
          data-resource-path={file.path}
          onClick={() => openFile(file.path)}
          aria-current={current ? 'page' : undefined}
          title={`${file.capabilityLabel}. ${file.reason}`}
          className="min-w-0 flex-1 text-left"
        >
          <span className={`block truncate font-serif text-xs ${current ? 'font-bold text-carbon' : 'text-carbon/75'}`}>
            {resourceDisplayName(file)}
          </span>
        </button>
        <button
          type="button"
          onClick={() => toggleFavorite(file.path)}
          aria-label={favorite ? `Quitar ${resourceDisplayName(file)} de favoritos` : `Añadir ${resourceDisplayName(file)} a favoritos`}
          aria-pressed={favorite}
          title={favorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          className={`rounded px-1 text-sm ${favorite ? 'text-ocre' : 'text-carbon/25 opacity-70 group-hover:opacity-100'}`}
        >
          {favorite ? '★' : '☆'}
        </button>
      </div>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-1">
        <span className={`inline-flex rounded border px-1.5 py-0.5 text-[9px] font-bold ${capability.className}`}>
          {capability.label}
        </span>
        {isDocument && (
          <EditorLanguageBadges
            mode="document"
            size="compact"
            activeLang={activeLang}
            availableLangs={availableLangs}
            onSelectLang={code => {
              const target = variants?.[code];
              if (target) openFile(target.path);
            }}
            onCreateTranslation={code => onCreateTranslation?.(file, code)}
            aria-label="Versiones de idioma"
          />
        )}
      </div>
      {level === 'advanced' && <span className="mt-1 block truncate font-mono text-[9px] text-carbon/40">{file.path}</span>}
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
  onCreatePage,
  onCreateDiagram,
  onCreateTranslation,
}) => {
  const { t } = useI18n();
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
    const map = new Map<string, FileNode[]>();
    for (const file of filtered) {
      const current = map.get(file.type) || [];
      current.push(file);
      map.set(file.type, current);
    }
    return Array.from(map.entries()).sort(([a], [b]) => categoryLabel(a).localeCompare(categoryLabel(b), 'es'));
  }, [filtered]);

  const variantsByConcept = useMemo(() => {
    const map = new Map<string, Record<string, FileNode>>();
    for (const file of files) {
      if (file.kind !== 'mdx-document') continue;
      const { conceptId, lang } = extractResourceIdentity(file);
      const key = `${file.type}:${conceptId}`;
      const existing = map.get(key) ?? {};
      existing[lang || 'es'] = file;
      map.set(key, existing);
    }
    return map;
  }, [files]);

  const updateFilter = <K extends keyof EditorCatalogFilters>(key: K, value: EditorCatalogFilters[K]) => {
    setFilters(previous => ({ ...previous, [key]: value }));
  };

  const advancedFilterCount = (filters.type !== 'all' ? 1 : 0)
    + (filters.status !== 'all' ? 1 : 0)
    + (filters.capability !== 'all' ? 1 : 0)
    + (filters.language && filters.language !== 'all' ? 1 : 0);

  const filtersActive = Boolean(filters.query) || advancedFilterCount > 0;

  const handleResourceKeys = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button[data-resource-path]'));
    if (buttons.length === 0) return;
    const currentIndex = buttons.findIndex(b => b === document.activeElement);
    event.preventDefault();
    if (currentIndex === -1) {
      buttons[0]?.focus();
      return;
    }
    const nextIndex = event.key === 'ArrowDown' ? Math.min(buttons.length - 1, currentIndex + 1) : Math.max(0, currentIndex - 1);
    buttons[nextIndex]?.focus();
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
          <p className="ac-label ac-label--sm ac-label--canela">Editor</p>
          <h2 className="font-serif text-base font-bold text-carbon">{t('editor', 'docHeroTitle')}</h2>
        </div>
        <button type="button" onClick={close} className="rounded border border-carbon/15 px-2 py-1 text-xs text-carbon/65" aria-label={t('editor', 'close')}>{t('editor', 'close')}</button>
      </header>

      <div className="grid grid-cols-2 border-b border-carbon/15 p-2" role="tablist" aria-label={t('editor', 'typeLabel')}>
        {([
          ['documents', t('editor', 'documents'), sectionCounts.documents],
          ['diagrams', t('editor', 'diagrams'), sectionCounts.diagrams],
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
        <div className="flex items-center justify-between gap-2">
          <label className="block flex-1">
            <span className="sr-only">{t('editor', 'searchDocPlaceholder')}</span>
            <input
              ref={searchRef}
              type="search"
              value={filters.query}
              onChange={event => updateFilter('query', event.target.value)}
              placeholder={section === 'documents' ? t('editor', 'searchDocPlaceholder') : t('editor', 'searchDiagramPlaceholder')}
              className="w-full rounded border border-carbon/20 bg-lienzo px-3 py-2 text-xs text-carbon outline-none placeholder:text-carbon/35 focus:border-canela"
            />
          </label>
          {section === 'documents' && onCreatePage && (
            <button
              type="button"
              onClick={onCreatePage}
              className="rounded bg-canela/10 px-2 py-2 text-[10px] font-bold text-canela hover:bg-canela/20 whitespace-nowrap cursor-pointer"
              title={t('editor', 'newStructuredPage')}
            >
              {t('editor', 'addPage')}
            </button>
          )}
          {section === 'diagrams' && onCreateDiagram && (
            <button
              type="button"
              onClick={onCreateDiagram}
              className="rounded bg-canela/10 px-2 py-2 text-[10px] font-bold text-canela hover:bg-canela/20 whitespace-nowrap cursor-pointer"
              title={t('editor', 'newDiagram')}
            >
              {t('editor', 'addDiagram')}
            </button>
          )}
        </div>
        <details className="group rounded border border-carbon/10 bg-carbon/[0.02]" open={advancedFilterCount > 0 || undefined}>
          <summary className="flex cursor-pointer list-none items-center justify-between rounded px-3 py-2 text-[10px] font-bold text-carbon/60 hover:bg-carbon/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-canela [&::-webkit-details-marker]:hidden">
            <span>{t('editor', 'filterResults')}</span>
            <span className="font-mono text-[9px] text-carbon/45">{advancedFilterCount > 0 ? `${advancedFilterCount} activos` : 'Tipo, estado, capacidad'} <span aria-hidden="true">▾</span></span>
          </summary>
          <div className="space-y-2 border-t border-carbon/10 p-2.5">
            <div className="grid grid-cols-2 gap-2">
              <label className="ac-label ac-label--xs">
                {t('editor', 'typeLabel')}
                <select value={filters.type} onChange={event => updateFilter('type', event.target.value)} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo px-2 py-1.5 text-xs font-normal normal-case text-carbon">
                  <option value="all">{t('editor', 'allTypes')}</option>
                  {types.map(type => <option key={type} value={type}>{categoryLabel(type)}</option>)}
                </select>
              </label>
              <label className="ac-label ac-label--xs">
                {t('editor', 'diagnostics')}
                <select value={filters.status} onChange={event => updateFilter('status', event.target.value as EditorCatalogFilters['status'])} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo px-2 py-1.5 text-xs font-normal normal-case text-carbon">
                  <option value="all">{t('editor', 'all')}</option>
                  <option value="available">{t('editor', 'editable')}</option>
                  <option value="attention">{t('editor', 'attentionNeeded')}</option>
                  <option value="invalid">{t('editor', 'diagnostics')}</option>
                </select>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="block ac-label ac-label--xs">
                {t('editor', 'howToEdit')}
                <select value={filters.capability} onChange={event => updateFilter('capability', event.target.value as EditorCatalogFilters['capability'])} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo px-2 py-1.5 text-xs font-normal normal-case text-carbon">
                  <option value="all">{t('editor', 'all')}</option>
                  <option value="visual-exact">{t('editor', 'editable')}</option>
                  <option value="code-preview">{t('editor', 'sourceOnly')}</option>
                  <option value="invalid">{t('editor', 'diagnostics')}</option>
                </select>
              </label>
              <label className="block ac-label ac-label--xs">
                Idioma
                <select value={filters.language || 'all'} onChange={event => updateFilter('language', event.target.value)} className="mt-1 w-full rounded border border-carbon/15 bg-lienzo px-2 py-1.5 text-xs font-normal normal-case text-carbon">
                  <option value="all">{t('editor', 'all')}</option>
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name} ({lang.code})</option>
                  ))}
                </select>
              </label>
            </div>
            {advancedFilterCount > 0 && <button type="button" onClick={() => setFilters(previous => ({ ...DEFAULT_EDITOR_CATALOG_FILTERS, query: previous.query }))} className="w-full rounded border border-carbon/15 px-2 py-1.5 text-[10px] font-bold text-carbon/65 hover:bg-carbon/5">{t('editor', 'clearFilters')}</button>}
          </div>
        </details>
      </div>

      <div className="flex-1 overflow-y-auto p-3" onKeyDown={handleResourceKeys}>
        {isLoading && (
          <div role="status" className="space-y-2 p-2" aria-label={t('editor', 'loadingContent')}>
            {[0, 1, 2, 3].map(item => <div key={item} className="h-11 animate-pulse rounded bg-carbon/5" />)}
            <p className="pt-2 text-xs italic text-carbon/50">{t('editor', 'checkingCatalog')}</p>
          </div>
        )}
        {!isLoading && error && (
          <div role="alert" className="rounded border border-granada/25 bg-granada/5 p-3 text-xs text-carbon/70">
            <p className="font-bold text-granada">{t('editor', 'catalogLoadError')}</p>
            <p className="mt-1">{error}</p>
            <button type="button" onClick={retry} className="mt-3 rounded bg-granada px-3 py-1 font-bold text-lienzo">{t('editor', 'retry')}</button>
          </div>
        )}
        {!isLoading && !error && files.length === 0 && (
          <div className="rounded border border-dashed border-carbon/20 p-4 text-center text-xs text-carbon/55">
            {t('editor', 'noEditableResources')}
          </div>
        )}
        {!isLoading && !error && files.length > 0 && filtered.length === 0 && (
          <div className="rounded border border-dashed border-carbon/20 p-4 text-center text-xs text-carbon/55">
            <p>{t('editor', 'noMatchingItems')}</p>
            {filtersActive && <button type="button" onClick={() => setFilters(DEFAULT_EDITOR_CATALOG_FILTERS)} className="mt-3 rounded border border-carbon/20 px-3 py-1 font-bold text-carbon">{t('editor', 'clearFilters')}</button>}
          </div>
        )}

        {!filtersActive && favorites.length > 0 && (
          <section className="mb-4" aria-labelledby="editor-favorites-heading">
            <h3 id="editor-favorites-heading" className="mb-1.5 px-1 ac-label ac-label--sm ac-label--ocre">Favoritos</h3>
            <div className="space-y-1">
              {favorites.map(file => (
                <ResourceButton
                  key={`favorite-${file.path}`}
                  file={file}
                  current={file.path === currentFile}
                  favorite
                  level={level}
                  openFile={openFile}
                  toggleFavorite={toggleFavorite}
                  variants={file.kind === 'mdx-document' ? variantsByConcept.get(`${file.type}:${extractResourceIdentity(file).conceptId}`) : undefined}
                  onCreateTranslation={onCreateTranslation}
                />
              ))}
            </div>
          </section>
        )}
        {!filtersActive && recents.length > 0 && (
          <section className="mb-4" aria-labelledby="editor-recents-heading">
            <h3 id="editor-recents-heading" className="mb-1.5 px-1 ac-label ac-label--sm ac-label--mora">Recientes</h3>
            <div className="space-y-1">
              {recents.slice(0, 4).map(file => (
                <ResourceButton
                  key={`recent-${file.path}`}
                  file={file}
                  current={file.path === currentFile}
                  favorite={favoritePaths.includes(file.path)}
                  level={level}
                  openFile={openFile}
                  toggleFavorite={toggleFavorite}
                  variants={file.kind === 'mdx-document' ? variantsByConcept.get(`${file.type}:${extractResourceIdentity(file).conceptId}`) : undefined}
                  onCreateTranslation={onCreateTranslation}
                />
              ))}
            </div>
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
              {expanded && (
                <div className="ml-2 space-y-1 border-l border-carbon/10 pl-2">
                  {resources.map(file => (
                    <ResourceButton
                      key={file.path}
                      file={file}
                      current={file.path === currentFile}
                      favorite={favoritePaths.includes(file.path)}
                      level={level}
                      openFile={openFile}
                      toggleFavorite={toggleFavorite}
                      variants={file.kind === 'mdx-document' ? variantsByConcept.get(`${file.type}:${extractResourceIdentity(file).conceptId}`) : undefined}
                      onCreateTranslation={onCreateTranslation}
                    />
                  ))}
                </div>
              )}
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
