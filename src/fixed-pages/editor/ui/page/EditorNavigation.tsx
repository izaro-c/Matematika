import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import { translateEditorText, type EditorText } from '@/fixed-pages/editor/types/editorMessage';
import {
  DEFAULT_EDITOR_CATALOG_FILTERS,
  filterCatalogResources,
  getCategoryDisplayName,
  resourceDisplayName,
  type EditorCatalogFilters,
  type EditorResourceSection,
  type EditorWorkspaceLevel,
} from '@/fixed-pages/editor/session/editorNavigationModel';
import { SUPPORTED_LANGUAGES, SUPPORTED_LANGUAGE_CODES } from '@/i18n/config';
import { useI18n } from '@/i18n';
import { Button, IconButton, RowButton, Tabs, controlClassName } from '../primitives';
import { DocumentVersions } from '@/fixed-pages/editor/ui/workbench/EditorHeaderPrimitives';
import { buildConceptIndex, conceptKey, documentLang, documentVersionStatuses } from '@/fixed-pages/editor/session/conceptVersions';

interface EditorNavigationProps {
  files: FileNode[];
  isLoading: boolean;
  error: EditorText | null;
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

function capabilityPresentation(file: FileNode, t: ReturnType<typeof useI18n>['t']): { label: string; className: string } {
  if (file.capability === 'visual-exact') return { label: t('editor.landing.editable'), className: 'border-musgo/25 bg-musgo/10 text-musgo' };
  if (file.capability === 'code-preview') return { label: t('editor.landing.sourceOnly'), className: 'border-pavo/25 bg-pavo/10 text-pavo' };
  return { label: t('editor.landing.needsFixing'), className: 'border-granada/25 bg-granada/10 text-granada' };
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
  const { t } = useI18n();
  const capability = capabilityPresentation(file, t);
  const isDocument = file.kind === 'mdx-document';
  const versions = useMemo(
    () => documentVersionStatuses(variants ?? {}, SUPPORTED_LANGUAGE_CODES),
    [variants],
  );
  const activeLang = current ? documentLang(file) : '';

  return (
    <div className="flex flex-col py-0.5">
      <div className="flex items-start justify-between gap-1">
        <RowButton
          data-resource-path={file.path}
          onClick={() => openFile(file.path)}
          aria-current={current ? 'page' : undefined}
          title={`${translateEditorText(t, file.capabilityLabel)}. ${translateEditorText(t, file.reason)}`}
          className="min-w-0 flex-1"
        >
          <span className="block truncate">{resourceDisplayName(file)}</span>
        </RowButton>
        <IconButton
          size="sm"
          onClick={() => toggleFavorite(file.path)}
          label={favorite ? t('editor.nav.removeNamedFromFavorites', { name: resourceDisplayName(file) }) : t('editor.nav.addNamedToFavorites', { name: resourceDisplayName(file) })}
          aria-pressed={favorite}
          title={favorite ? t('editor.landing.removeFromFavorites') : t('editor.landing.addToFavorites')}
        >
          {favorite ? '★' : '☆'}
        </IconButton>
      </div>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-1">
        <span className={`inline-flex rounded border px-1.5 py-0.5 text-[9px] font-bold ${capability.className}`}>
          {capability.label}
        </span>
        {isDocument && (
          <DocumentVersions
            size="compact"
            activeLang={activeLang}
            versions={versions}
            onSelect={code => {
              const target = variants?.[code];
              if (target) openFile(target.path);
            }}
            onCreate={onCreateTranslation ? code => onCreateTranslation(file, code) : undefined}
            aria-label={t('editor.language.versions')}
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

  const variantsByConcept = useMemo(() => buildConceptIndex(files), [files]);

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
      aria-label={t('editor.nav.explorer')}
      className="fixed inset-y-0 left-0 z-40 flex max-w-[92vw] flex-col border-r border-carbon/15 bg-lienzo shadow-xl lg:relative lg:z-auto lg:max-w-none lg:shadow-none"
      style={{ width }}
    >
      <header className="flex items-center justify-between border-b border-carbon/15 px-4 py-3">
        <div>
          <p className="ac-label ac-label--sm ac-label--canela">{t('editor.nav.editorLabel')}</p>
          <h2 className="font-serif text-base font-bold text-carbon">{t('editor.landing.docHeroTitle')}</h2>
        </div>
        <Button size="sm" onClick={close}>{t('editor.common.close')}</Button>
      </header>

      <Tabs
        className="px-3"
        aria-label={t('editor.create.typeLabel')}
        activeTab={section}
        onTabChange={id => {
          setSection(id as typeof section);
          setFilters(DEFAULT_EDITOR_CATALOG_FILTERS);
        }}
        tabs={[
          { id: 'documents', label: <>{t('editor.nav.documents')} <span className="font-mono text-[9px] opacity-70">{sectionCounts.documents}</span></> },
          { id: 'diagrams', label: <>{t('editor.nav.diagrams')} <span className="font-mono text-[9px] opacity-70">{sectionCounts.diagrams}</span></> },
        ]}
      />

      <div className="space-y-2 border-b border-carbon/15 p-3">
        <div className="flex items-center justify-between gap-2">
          <label className="block flex-1">
            <span className="sr-only">{section === 'documents' ? t('editor.landing.searchDocPlaceholder') : t('editor.landing.searchDiagramPlaceholder')}</span>
            <input
              ref={searchRef}
              type="search"
              value={filters.query}
              onChange={event => updateFilter('query', event.target.value)}
              placeholder={section === 'documents' ? t('editor.landing.searchDocPlaceholder') : t('editor.landing.searchDiagramPlaceholder')}
              className={controlClassName}
            />
          </label>
          {section === 'documents' && onCreatePage && (
            <Button size="sm" onClick={onCreatePage} title={t('editor.create.newStructuredPage')}>
              {t('editor.mdx.addPage')}
            </Button>
          )}
          {section === 'diagrams' && onCreateDiagram && (
            <Button size="sm" onClick={onCreateDiagram} title={t('editor.landing.newDiagram')}>
              {t('editor.mdx.addDiagram')}
            </Button>
          )}
        </div>
        <details className="group rounded border border-carbon/10 bg-carbon/[0.02]" open={advancedFilterCount > 0 || undefined}>
          <summary className="flex cursor-pointer list-none items-center justify-between rounded px-3 py-2 text-[10px] font-bold text-carbon/60 hover:bg-carbon/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-canela [&::-webkit-details-marker]:hidden">
            <span>{t('editor.landing.filterResults')}</span>
            <span className="font-mono text-[9px] text-carbon/45">{advancedFilterCount > 0 ? t('editor.nav.activeFilters', { count: advancedFilterCount }) : t('editor.nav.filterHint')} <span aria-hidden="true">▾</span></span>
          </summary>
          <div className="space-y-2 border-t border-carbon/10 p-2.5">
            <div className="grid grid-cols-2 gap-2">
              <label className="ac-label ac-label--xs">
                {t('editor.create.typeLabel')}
                <select value={filters.type} onChange={event => updateFilter('type', event.target.value)} className={`${controlClassName} mt-1`}>
                  <option value="all">{t('editor.landing.allTypes')}</option>
                  {types.map(type => <option key={type} value={type}>{categoryLabel(type)}</option>)}
                </select>
              </label>
              <label className="ac-label ac-label--xs">
                {t('editor.mdx.diagnostics')}
                <select value={filters.status} onChange={event => updateFilter('status', event.target.value as EditorCatalogFilters['status'])} className={`${controlClassName} mt-1`}>
                  <option value="all">{t('editor.common.all')}</option>
                  <option value="available">{t('editor.landing.editable')}</option>
                  <option value="attention">{t('editor.landing.attentionNeeded')}</option>
                  <option value="invalid">{t('editor.mdx.diagnostics')}</option>
                </select>
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="block ac-label ac-label--xs">
                {t('editor.nav.howToEdit')}
                <select value={filters.capability} onChange={event => updateFilter('capability', event.target.value as EditorCatalogFilters['capability'])} className={`${controlClassName} mt-1`}>
                  <option value="all">{t('editor.common.all')}</option>
                  <option value="visual-exact">{t('editor.landing.editable')}</option>
                  <option value="code-preview">{t('editor.landing.sourceOnly')}</option>
                  <option value="invalid">{t('editor.mdx.diagnostics')}</option>
                </select>
              </label>
              <label className="block ac-label ac-label--xs">
                {t('editor.nav.language')}
                <select value={filters.language || 'all'} onChange={event => updateFilter('language', event.target.value)} className={`${controlClassName} mt-1`}>
                  <option value="all">{t('editor.common.all')}</option>
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang.code} value={lang.code}>{lang.name} ({lang.code})</option>
                  ))}
                </select>
              </label>
            </div>
            {advancedFilterCount > 0 && <Button size="sm" fullWidth onClick={() => setFilters(previous => ({ ...DEFAULT_EDITOR_CATALOG_FILTERS, query: previous.query }))}>{t('editor.landing.clearFilters')}</Button>}
          </div>
        </details>
      </div>

      <div className="flex-1 overflow-y-auto p-3" onKeyDown={handleResourceKeys}>
        {isLoading && (
          <div role="status" className="space-y-2 p-2" aria-label={t('editor.nav.loadingContent')}>
            {[0, 1, 2, 3].map(item => <div key={item} className="h-11 animate-pulse rounded bg-carbon/5" />)}
            <p className="pt-2 text-xs italic text-carbon/50">{t('editor.nav.checkingCatalog')}</p>
          </div>
        )}
        {!isLoading && error && (
          <div role="alert" className="rounded border border-granada/25 bg-granada/5 p-3 text-xs text-carbon/70">
            <p className="font-bold text-granada">{t('editor.nav.catalogLoadError')}</p>
            <p className="mt-1">{translateEditorText(t, error)}</p>
            <Button variant="danger" size="sm" className="mt-3" onClick={retry}>{t('editor.common.retry')}</Button>
          </div>
        )}
        {!isLoading && !error && files.length === 0 && (
          <div className="rounded border border-dashed border-carbon/20 p-4 text-center text-xs text-carbon/55">
            {t('editor.nav.noEditableResources')}
          </div>
        )}
        {!isLoading && !error && files.length > 0 && filtered.length === 0 && (
          <div className="rounded border border-dashed border-carbon/20 p-4 text-center text-xs text-carbon/55">
            <p>{t('editor.landing.noMatchingItems')}</p>
            {filtersActive && <Button size="sm" className="mt-3" onClick={() => setFilters(DEFAULT_EDITOR_CATALOG_FILTERS)}>{t('editor.landing.clearFilters')}</Button>}
          </div>
        )}

        {!filtersActive && favorites.length > 0 && (
          <section className="mb-4" aria-labelledby="editor-favorites-heading">
            <h3 id="editor-favorites-heading" className="mb-1.5 px-1 ac-label ac-label--sm ac-label--ocre">{t('editor.nav.favorites')}</h3>
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
                  variants={file.kind === 'mdx-document' ? variantsByConcept.get(conceptKey(file)) : undefined}
                  onCreateTranslation={onCreateTranslation}
                />
              ))}
            </div>
          </section>
        )}
        {!filtersActive && recents.length > 0 && (
          <section className="mb-4" aria-labelledby="editor-recents-heading">
            <h3 id="editor-recents-heading" className="mb-1.5 px-1 ac-label ac-label--sm ac-label--mora">{t('editor.nav.recents')}</h3>
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
                  variants={file.kind === 'mdx-document' ? variantsByConcept.get(conceptKey(file)) : undefined}
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
              <RowButton
                aria-expanded={expanded}
                onClick={() => setExpandedGroups(previous => ({ ...previous, [type]: !expanded }))}
              >
                <span className="font-semibold">{categoryLabel(type)}</span>
                <span className="font-mono text-[9px] text-carbon/40">{resources.length} {expanded ? '▾' : '▸'}</span>
              </RowButton>
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
                      variants={file.kind === 'mdx-document' ? variantsByConcept.get(conceptKey(file)) : undefined}
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
        <span className="font-bold">Ctrl/⌘ P</span> {t('editor.nav.shortcutSearch')} · <span className="font-bold">↑ ↓</span> {t('editor.nav.shortcutNavigate')}
      </footer>
    </aside>
  );
};

export default EditorNavigation;
