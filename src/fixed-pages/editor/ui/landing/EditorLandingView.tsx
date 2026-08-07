import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import { isDarkMode, setTheme } from '@/lib/theme/theme';
import { routePath } from '@/lib/routes';
import { Logo } from '@/components/ui/Logo';
import { IconSun, IconMoon } from '@/fixed-pages/editor/diagrams/ui/toolbar/WorkbenchIcons';
import { HeaderContainer } from '../workbench/EditorHeaderPrimitives';
import { EditorLandingCard } from './EditorLandingCard';
import { useEditorLanding, type LandingSection } from './useEditorLanding';

interface EditorLandingViewProps {
  files: FileNode[];
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
            href={routePath('/')}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-carbon/5 focus-visible:outline-2 focus-visible:outline-salvia cursor-pointer"
            title="Volver a la portada principal"
          >
            <Logo decorative className="h-8 w-8" />
          </Link>
          <div className="flex items-center space-x-2 border-l border-carbon/15 pl-3">
            <span className="font-serif text-sm font-bold text-carbon">Taller de Edición</span>
            <span className="rounded bg-salvia/15 border border-salvia/30 px-1.5 py-0.5 text-[10px] font-bold text-salvia uppercase">
              Matematika
            </span>
          </div>
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
            Documentos MDX
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
            Diagramas TSX
          </button>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center justify-end space-x-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-carbon/15 bg-lienzo text-carbon/70 hover:bg-carbon/5 transition-all cursor-pointer"
            title={isDark ? 'Modo claro' : 'Modo oscuro'}
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
              <span className="inline-block rounded-md border border-salvia/30 bg-salvia/10 px-2.5 py-1 text-xs font-bold text-salvia tracking-wide">
                {activeSection === 'documents' ? 'Módulo Editorial MDX' : 'Módulo Interactivo TSX'}
              </span>
              <h1 className="mt-3 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-carbon">
                {activeSection === 'documents'
                  ? 'Página de Inicio — Documentos Matemáticos'
                  : 'Página de Inicio — Diagramas y Modelos Visuales'}
              </h1>
              <p className="mt-2 text-sm text-carbon/70 leading-relaxed font-sans">
                {activeSection === 'documents'
                  ? 'Crea, explora y edita las páginas estructuradas de teoremas, lemas, definiciones y demostraciones del corpus.'
                  : 'Construye y ajusta diagramas geométricos interactivos y modelos matemáticos de alta precisión visual.'}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              {activeSection === 'documents' ? (
                <button
                  type="button"
                  onClick={onCreateDocument}
                  className="inline-flex items-center gap-2 rounded-xl bg-salvia px-5 py-3 text-xs font-bold text-lienzo shadow-md hover:bg-salvia/90 transition-all cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Crear Nuevo Documento
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onCreateDiagram}
                  className="inline-flex items-center gap-2 rounded-xl bg-pavo px-5 py-3 text-xs font-bold text-lienzo shadow-md hover:bg-pavo/90 transition-all cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  Crear Nuevo Diagrama
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-carbon/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={
                  activeSection === 'documents'
                    ? 'Buscar documento por nombre, tipo o ruta...'
                    : 'Buscar diagrama por componente o categoría...'
                }
                className="w-full rounded-xl border border-carbon/15 bg-lienzo py-2.5 pl-10 pr-4 text-xs font-sans text-carbon placeholder:text-carbon/40 focus:border-salvia focus:outline-none focus:ring-1 focus:ring-salvia transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-carbon/40 hover:text-carbon"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort & Favorites Toggle */}
            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setOnlyFavorites(prev => !prev)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  onlyFavorites
                    ? 'border-ocre/40 bg-ocre/10 text-ocre'
                    : 'border-carbon/15 bg-lienzo text-carbon/70 hover:bg-carbon/5'
                }`}
              >
                ★ Favoritos ({favoritePaths.length})
              </button>

              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs font-semibold text-carbon/80 focus:border-salvia focus:outline-none cursor-pointer"
              >
                <option value="name">Ordenar por nombre</option>
                <option value="type">Ordenar por tipo</option>
                <option value="recent">Recientes primero</option>
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
            {activeSection === 'documents' ? 'Documentos Disponibles' : 'Diagramas Disponibles'}
          </h2>
          <span className="text-xs text-carbon/55 font-mono">
            {filteredCount} de {totalCount} elementos
          </span>
        </div>

        {/* Cards Grid */}
        {filteredFiles.length > 0 ? (
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
        ) : (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-carbon/20 bg-carbon/5 p-12 text-center">
            <svg className="h-10 w-10 text-carbon/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="mt-3 font-serif text-base font-bold text-carbon">No se encontraron elementos</p>
            <p className="mt-1 text-xs text-carbon/60 max-w-sm">
              No hay {activeSection === 'documents' ? 'documentos' : 'diagramas'} que coincidan con los filtros aplicados.
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
              Restablecer filtros
            </button>
          </div>
        )}
      </main>
    </div>
  );
};
