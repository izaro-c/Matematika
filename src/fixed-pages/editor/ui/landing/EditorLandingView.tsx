import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import { isDarkMode, setTheme } from '@/lib/theme/theme';
import { Logo } from '@/components/ui/Logo';
import { IconSun, IconMoon } from '@/fixed-pages/editor/diagrams/ui/toolbar/WorkbenchIcons';
import { HeaderContainer } from '../workbench/EditorHeaderPrimitives';
import { EditorLandingCard } from './EditorLandingCard';
import { useEditorLanding, type LandingSection } from './useEditorLanding';
import { useI18n } from '@/i18n';

interface EditorLandingViewProps {
  files: FileNode[];
  isLoading?: boolean;
  initialSection?: LandingSection;
  favoritePaths?: string[];
  recentPaths?: string[];
  onOpenFile: (path: string) => void;
  onToggleFavorite?: (path: string) => void;
  onCreateDocument: () => void;
  onCreateDiagram: () => void;
}

export const EditorLandingView: React.FC<EditorLandingViewProps> = ({
  files,
  isLoading = false,
  initialSection = 'documents',
  favoritePaths = [],
  recentPaths = [],
  onOpenFile,
  onToggleFavorite,
  onCreateDocument,
  onCreateDiagram,
}) => {
  const [activeSection, setActiveSection] = useState<LandingSection>(initialSection);
  const [isDark, setIsDark] = useState(isDarkMode);
  const { getLocalizedPath, t } = useI18n();

  useEffect(() => {
    setActiveSection(initialSection);
  }, [initialSection]);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setTheme(nextDark);
    setIsDark(nextDark);
  };

  const {
    searchQuery,
    setSearchQuery,
    selectedType,
    setSelectedType,
    onlyFavorites,
    setOnlyFavorites,
    sortBy,
    setSortBy,
    availableTypes,
    filteredFiles,
    totalCount,
    filteredCount,
  } = useEditorLanding({
    files,
    section: activeSection,
    favoritePaths,
    recentPaths,
  });

  return (
    <div className="flex h-screen w-screen flex-col overflow-y-auto bg-lienzo font-serif text-carbon select-none">
      {/* Top Header */}
      <HeaderContainer>
        <div className="flex items-center space-x-3">
          <Link
            href={getLocalizedPath('/')}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-carbon/5 focus-visible:outline-2 focus-visible:outline-salvia cursor-pointer"
            title={t('editor', 'backToMain')}
          >
            <Logo decorative className="h-8 w-8" />
          </Link>
        </div>

        {/* Section Switcher in Header */}
        <div className="flex items-center space-x-1 rounded-lg border border-carbon/15 bg-carbon/5 p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setActiveSection('documents');
              setSelectedType('all');
            }}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeSection === 'documents'
                ? 'bg-lienzo text-carbon shadow-2xs font-bold'
                : 'text-carbon/65 hover:text-carbon hover:bg-carbon/5'
            }`}
          >
            {t('editor', 'documents')}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSection('diagrams');
              setSelectedType('all');
            }}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeSection === 'diagrams'
                ? 'bg-lienzo text-carbon shadow-2xs font-bold'
                : 'text-carbon/65 hover:text-carbon hover:bg-carbon/5'
            }`}
          >
            {t('editor', 'diagrams')}
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-carbon/15 bg-lienzo text-carbon/70 hover:bg-carbon/5 transition-all cursor-pointer"
            title={t('topbar', 'toggleTheme')}
          >
            {isDark ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
          </button>
        </div>
      </HeaderContainer>

      {/* Main Landing Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border border-carbon/15 bg-lienzo/80 p-6 sm:p-8 shadow-sm backdrop-blur-xs">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-salvia/10 blur-2xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="mt-3 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-carbon">
                {activeSection === 'documents' ? t('editor', 'docHeroTitle') : t('editor', 'diagramHeroTitle')}
              </h1>
              <p className="mt-2 font-serif text-sm italic text-carbon/70 leading-relaxed">
                {activeSection === 'documents' ? t('editor', 'docHeroDesc') : t('editor', 'diagramHeroDesc')}
              </p>
            </div>
            <button
              type="button"
              onClick={activeSection === 'documents' ? onCreateDocument : onCreateDiagram}
              className="flex items-center justify-center space-x-2 rounded-xl bg-salvia px-5 py-3 text-sm font-bold text-lienzo shadow-xs hover:bg-salvia/90 transition-all shrink-0 cursor-pointer"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>{activeSection === 'documents' ? t('editor', 'newDocument') : t('editor', 'newDiagram')}</span>
            </button>
          </div>
        </div>

        {/* Toolbar & Filters */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-carbon/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={activeSection === 'documents' ? t('editor', 'searchDocPlaceholder') : t('editor', 'searchDiagramPlaceholder')}
                className="w-full rounded-xl border border-carbon/15 bg-lienzo py-2 pl-9 pr-4 text-xs text-carbon placeholder:text-carbon/40 focus:border-salvia focus:outline-none shadow-2xs font-serif"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-xs text-carbon/40 hover:text-carbon"
                >
                  ✕
                </button>
              )}
            </div>

            {/* View Toggles & Sorting */}
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`flex items-center space-x-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  onlyFavorites
                    ? 'border-ocre bg-ocre/10 text-ocre font-bold shadow-2xs'
                    : 'border-carbon/15 bg-lienzo text-carbon/70 hover:border-carbon/30'
                }`}
              >
                ★ {t('editor', 'favoritesOnly')} ({favoritePaths.length})
              </button>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs font-semibold text-carbon/80 focus:border-salvia focus:outline-none cursor-pointer"
              >
                <option value="name">{t('editor', 'sortByName')}</option>
                <option value="type">{t('editor', 'sortByType')}</option>
                <option value="recent">{t('editor', 'sortByRecent')}</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {availableTypes.map(type => (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedType(type.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedType === type.id
                    ? 'bg-carbon text-lienzo shadow-2xs font-bold'
                    : 'border border-carbon/15 bg-lienzo text-carbon/70 hover:border-carbon/30 hover:bg-carbon/5'
                }`}
              >
                {type.label} <span className="ml-1 opacity-60">({type.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mt-6 flex items-center justify-between border-b border-carbon/10 pb-3">
          <h2 className="font-serif text-sm font-bold text-carbon">
            {activeSection === 'documents'
              ? t('editor', 'availableDocuments')
              : t('editor', 'availableDiagrams')}
          </h2>
          {isLoading ? (
            <div className="flex items-center gap-2" role="status" aria-live="polite">
              <span className="h-2 w-2 rounded-full bg-salvia animate-pulse" />
              <span className="font-serif text-xs italic text-carbon/60">
                {t('editor', 'loadingContent')}
              </span>
            </div>
          ) : (
            <span className="text-xs text-carbon/55 font-mono">
              {t('editor', 'itemCount', { filtered: filteredCount, total: totalCount })}
            </span>
          )}
        </div>

        {/* Cards Grid / Skeletons / Empty States */}
        {isLoading ? (
          <div
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            role="status"
            aria-busy="true"
            aria-label="Cargando elementos"
          >
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={`skeleton-card-${idx}`} className="relative flex flex-col justify-between rounded-xl border border-carbon/15 bg-carbon/5 p-4 shadow-2xs overflow-hidden animate-pulse" />
            ))}
          </div>
        ) : filteredFiles.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredFiles.map(file => (
              <EditorLandingCard
                key={file.path}
                file={file}
                isFavorite={favoritePaths.includes(file.path)}
                onOpenFile={onOpenFile}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        ) : totalCount === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-carbon/20 bg-carbon/5 p-12 text-center">
            <svg className="h-10 w-10 text-carbon/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="mt-3 font-serif text-base font-bold text-carbon">
              {t('editor', 'noItemsYet', { type: activeSection === 'documents' ? t('editor', 'documents').toLowerCase() : t('editor', 'diagrams').toLowerCase() })}
            </p>
            <p className="mt-1 text-xs text-carbon/60 max-w-sm">
              {t('editor', 'createFirstPrompt', { type: activeSection === 'documents' ? t('editor', 'newDocument').toLowerCase() : t('editor', 'newDiagram').toLowerCase() })}
            </p>
          </div>
        ) : (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-carbon/20 bg-carbon/5 p-12 text-center">
            <svg className="h-10 w-10 text-carbon/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="mt-3 font-serif text-base font-bold text-carbon">
              {t('glossary', 'noResults').replace('"{search}"', '').trim() || 'No results'}
            </p>
            <p className="mt-1 text-xs text-carbon/60 max-w-sm">
              {t('editor', 'noMatchingItems', { type: activeSection === 'documents' ? t('editor', 'documents').toLowerCase() : t('editor', 'diagrams').toLowerCase() })}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setOnlyFavorites(false);
              }}
              className="mt-4 rounded-lg border border-carbon/20 bg-lienzo px-4 py-2 text-xs font-bold text-carbon hover:bg-carbon/5 transition-all cursor-pointer"
            >
              {t('editor', 'clearFilters')}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
