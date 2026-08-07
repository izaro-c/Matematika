import { useMemo, useState } from 'react';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import { resourceDisplayName } from '@/fixed-pages/editor/session/editorNavigationModel';

export type LandingSection = 'documents' | 'diagrams';
export type SortOption = 'name' | 'type' | 'recent';

interface UseEditorLandingProps {
  files: FileNode[];
  section: LandingSection;
  favoritePaths?: string[];
  recentPaths?: string[];
}

export function useEditorLanding({
  files,
  section,
  favoritePaths = [],
  recentPaths = [],
}: UseEditorLandingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name');

  // Filtrar archivos pertenecientes a la sección correspondiente (documentos MDX vs diagramas TSX)
  const sectionFiles = useMemo(() => {
    return files.filter(file => {
      if (section === 'diagrams') {
        return file.kind === 'diagram' || file.path.endsWith('.tsx');
      }
      return file.kind === 'mdx-document' || file.path.endsWith('.mdx');
    });
  }, [files, section]);

  // Lista de tipos/categorías únicas disponibles en esta sección
  const availableTypes = useMemo(() => {
    const counts = new Map<string, number>();
    for (const file of sectionFiles) {
      const type = file.type || 'general';
      counts.set(type, (counts.get(type) || 0) + 1);
    }
    const typesList = Array.from(counts.entries()).map(([id, count]) => ({
      id,
      label: id.replace(/-/g, ' ').replace(/^\p{L}/u, v => v.toUpperCase()),
      count,
    }));
    return [{ id: 'all', label: 'Todos', count: sectionFiles.length }, ...typesList];
  }, [sectionFiles]);

  // Archivos recientemente accedidos
  const recentFiles = useMemo(() => {
    if (!recentPaths.length) return [];
    return recentPaths
      .map(path => sectionFiles.find(f => f.path === path))
      .filter((f): f is FileNode => Boolean(f));
  }, [recentPaths, sectionFiles]);

  // Filtrar y ordenar archivos
  const filteredFiles = useMemo(() => {
    let result = sectionFiles;

    // Filtro por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(file => {
        const name = resourceDisplayName(file).toLowerCase();
        const path = file.path.toLowerCase();
        const type = file.type.toLowerCase();
        return name.includes(query) || path.includes(query) || type.includes(query);
      });
    }

    // Filtro por tipo/categoría
    if (selectedType !== 'all') {
      result = result.filter(file => file.type === selectedType);
    }

    // Filtro solo favoritos
    if (onlyFavorites) {
      result = result.filter(file => favoritePaths.includes(file.path));
    }

    // Ordenación
    return [...result].sort((a, b) => {
      if (sortBy === 'name') {
        return resourceDisplayName(a).localeCompare(resourceDisplayName(b));
      }
      if (sortBy === 'type') {
        return a.type.localeCompare(b.type);
      }
      if (sortBy === 'recent') {
        const indexA = recentPaths.indexOf(a.path);
        const indexB = recentPaths.indexOf(b.path);
        const valA = indexA === -1 ? 999 : indexA;
        const valB = indexB === -1 ? 999 : indexB;
        return valA - valB;
      }
      return 0;
    });
  }, [sectionFiles, searchQuery, selectedType, onlyFavorites, sortBy, favoritePaths, recentPaths]);

  return {
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
    recentFiles,
    totalCount: sectionFiles.length,
    filteredCount: filteredFiles.length,
  };
}
