import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import { isDarkMode, setTheme } from '@/lib/theme/theme';
import { Logo } from '@/components/ui/Logo';
import { IconSun, IconMoon } from '@/fixed-pages/editor/diagrams/ui/toolbar/WorkbenchIcons';
import {
  HeaderContainer,
  HeaderPillContainer,
  HeaderPillButton,
  HeaderIconButton,
  UiLanguageSwitch,
} from '../workbench/EditorHeaderPrimitives';
import { EditorLandingCard, EditorLandingCardSkeleton } from './EditorLandingCard';
import { useEditorLanding, type LandingSection } from './useEditorLanding';
import { useI18n } from '@/i18n';
import { Button, IconButton, Tabs, controlClassName } from '../primitives';
import { cx } from '../primitives/classNames';
import { Card } from '@/fixed-pages/editor/ui/primitives';

interface EditorLandingViewProps {
  files: FileNode[];
  isLoading?: boolean;
  initialSection?: LandingSection;
  /** La pestaña activa se refleja en la URL para recordarla al volver. */
  onSectionChange?: (section: LandingSection) => void;
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
  onSectionChange,
  favoritePaths = [],
  recentPaths = [],
  onOpenFile,
  onToggleFavorite,
  onCreateDocument,
  onCreateDiagram,
}) => {
  const [activeSection, setActiveSection] = useState<LandingSection>(initialSection);
  const [isDark, setIsDark] = useState(isDarkMode);
  const { getLocalizedPath, t, lang: currentLang } = useI18n();

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
    currentLang,
  });

  return (
    <div className="flex h-screen w-screen flex-col overflow-y-auto bg-lienzo font-serif text-carbon select-none">
      {/* Top Header */}
      <HeaderContainer>
        <div className="flex items-center justify-self-start gap-2">
          <Link
            href={getLocalizedPath('/')}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-carbon/5 focus-visible:outline-2 focus-visible:outline-canela cursor-pointer"
            title={t('editor.nav.backToMain')}
          >
            <Logo decorative className="h-8 w-8" />
          </Link>
        </div>

        {/* Section Switcher in Header */}
        <HeaderPillContainer className="justify-self-center">
          <HeaderPillButton
            active={activeSection === 'documents'}
            onClick={() => {
              setActiveSection('documents');
              setSelectedType('all');
              onSectionChange?.('documents');
            }}
          >
            {t('editor.nav.documents')}
          </HeaderPillButton>
          <HeaderPillButton
            active={activeSection === 'diagrams'}
            onClick={() => {
              setActiveSection('diagrams');
              setSelectedType('all');
              onSectionChange?.('diagrams');
            }}
          >
            {t('editor.nav.diagrams')}
          </HeaderPillButton>
        </HeaderPillContainer>

        {/* Header Right Actions */}
        <div className="flex items-center justify-self-end gap-2">
          {/* Language Switcher */}
          <UiLanguageSwitch aria-label={t('topbar', 'changeLanguage')} />

          <HeaderIconButton
            onClick={toggleTheme}
            title={t('topbar', 'toggleTheme')}
            aria-label={t('topbar', 'toggleTheme')}
          >
            {isDark ? <IconSun className="h-4 w-4" /> : <IconMoon className="h-4 w-4" />}
          </HeaderIconButton>
        </div>
      </HeaderContainer>

      {/* Main Landing Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <Card className="relative overflow-hidden sm:p-8">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 h-48 w-48 rounded-full bg-canela/10 blur-2xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="mt-3 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-carbon">
                {activeSection === 'documents' ? t('editor.landing.docHeroTitle') : t('editor.landing.diagramHeroTitle')}
              </h1>
              <p className="mt-2 font-serif text-sm italic text-carbon/70 leading-relaxed">
                {activeSection === 'documents' ? t('editor.landing.docHeroDesc') : t('editor.landing.diagramHeroDesc')}
              </p>
            </div>
            <Button
              variant="primary"
              className="shrink-0"
              onClick={activeSection === 'documents' ? onCreateDocument : onCreateDiagram}
            >
              {activeSection === 'documents' ? t('editor.landing.newDocument') : t('editor.landing.newDiagram')}
            </Button>
          </div>
        </Card>

        {/* Toolbar & Filters */}
        <div className="mt-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-carbon/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={activeSection === 'documents' ? t('editor.landing.searchDocPlaceholder') : t('editor.landing.searchDiagramPlaceholder')}
                className={cx(controlClassName, 'pl-9 pr-8')}
              />
              {searchQuery && (
                <IconButton
                  size="sm"
                  label={t('editor.common.close')}
                  onClick={() => setSearchQuery('')}
                  className="absolute right-1 top-1/2 -translate-y-1/2"
                >
                  ✕
                </IconButton>
              )}
            </div>

            {/* View Toggles & Sorting */}
            <div className="flex items-center space-x-2">
              <Button size="sm" aria-pressed={onlyFavorites} onClick={() => setOnlyFavorites(!onlyFavorites)}>
                ★ {t('editor.landing.favoritesOnly')} ({favoritePaths.length})
              </Button>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className={cx(controlClassName, 'w-auto')}
              >
                <option value="name">{t('editor.landing.sortByName')}</option>
                <option value="type">{t('editor.landing.sortByType')}</option>
                <option value="recent">{t('editor.landing.sortByRecent')}</option>
              </select>
            </div>
          </div>

          {/* Category Filter Pills */}
          <Tabs
            variant="nav"
            aria-label={t('editor.create.typeLabel')}
            activeTab={selectedType}
            onTabChange={setSelectedType}
            tabs={availableTypes.map(type => ({ id: type.id, label: <>{type.label} <span className="opacity-60">({type.count})</span></> }))}
          />
        </div>

        {/* Results Info */}
        <div className="mt-6 flex items-center justify-between border-b border-carbon/10 pb-3">
          <h2 className="font-serif text-sm font-bold text-carbon">
            {activeSection === 'documents'
              ? t('editor.landing.availableDocuments')
              : t('editor.landing.availableDiagrams')}
          </h2>
          {isLoading ? (
            <div className="flex items-center gap-2" role="status" aria-live="polite">
              <span className="h-2 w-2 rounded-full bg-canela animate-pulse" />
              <span className="font-serif text-xs italic text-carbon/60">
                {t('editor.nav.loadingContent')}
              </span>
            </div>
          ) : (
            <span className="text-xs text-carbon/55 font-mono">
              {filteredCount === totalCount
                ? t('editor.landing.itemCount', { count: totalCount })
                : t('editor.landing.itemCountFiltered', { filtered: filteredCount, total: totalCount })}
            </span>
          )}
        </div>

        {/* Cards Grid / Skeletons / Empty States */}
        {isLoading ? (
          <div
            className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            role="status"
            aria-busy="true"
            aria-label={t('editor.diagram.loadingElements')}
          >
            {Array.from({ length: 8 }).map((_, idx) => (
              <EditorLandingCardSkeleton key={`skeleton-card-${idx}`} isDiagram={activeSection === 'diagrams'} />
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
          <Card dashed className="mt-12 flex flex-col items-center justify-center text-center">
            <svg className="h-10 w-10 text-carbon/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <p className="mt-3 font-serif text-base font-bold text-carbon">
              {activeSection === 'documents' ? t('editor.landing.noDocumentsYet') : t('editor.landing.noDiagramsYet')}
            </p>
            <p className="mt-1 text-xs text-carbon/60 max-w-sm">
              {t('editor.landing.createFirstPrompt')}
            </p>
          </Card>
        ) : (
          <Card dashed className="mt-12 flex flex-col items-center justify-center text-center">
            <svg className="h-10 w-10 text-carbon/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="mt-3 font-serif text-base font-bold text-carbon">
              {t('search', 'noResults')}
            </p>
            <p className="mt-1 text-xs text-carbon/60 max-w-sm">
              {t('editor.landing.noMatchingItems')}
            </p>
            <Button
              className="mt-4"
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
                setOnlyFavorites(false);
              }}
            >
              {t('editor.landing.clearFilters')}
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
};
