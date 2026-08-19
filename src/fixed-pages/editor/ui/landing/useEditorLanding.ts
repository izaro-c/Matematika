import { useMemo, useState } from 'react';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';
import {
  extractResourceIdentity,
  getCategoryDisplayName,
  resourceDisplayName,
} from '@/fixed-pages/editor/session/editorNavigationModel';

export type LandingSection = 'documents' | 'diagrams';
export type SortOption = 'name' | 'type' | 'recent';

interface UseEditorLandingProps {
  files: FileNode[];
  section: LandingSection;
  favoritePaths?: string[];
  recentPaths?: string[];
  currentLang?: string;
}

export function useEditorLanding({
  files,
  section,
  favoritePaths = [],
  recentPaths = [],
  currentLang,
}: UseEditorLandingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('name');

  // Filtrar archivos pertenecientes a la sección correspondiente (documentos MDX vs diagramas TSX)
  const sectionFiles = useMemo(() => {
    const rawSection = files.filter(file => {
      if (section === 'diagrams') {
        return file.kind === 'diagram' || file.path.endsWith('.tsx');
      }
      return file.kind === 'mdx-document' || file.path.endsWith('.mdx');
    });

    if (section === 'diagrams') {
      return rawSection;
    }

    // Deduplicar documentos MDX por concepto, mostrando solo 1 ficha con preferencia por el idioma actual
    const conceptMap = new Map<string, FileNode[]>();
    for (const file of rawSection) {
      const { conceptId } = extractResourceIdentity(file);
      const key = `${file.type}:${conceptId}`;
      const list = conceptMap.get(key) || [];
      list.push(file);
      conceptMap.set(key, list);
    }

    const deduplicated: FileNode[] = [];
    for (const variants of conceptMap.values()) {
      if (variants.length === 1) {
        deduplicated.push(variants[0]);
        continue;
      }
      // 1. Preferir variante en idioma actual
      const currentMatch = variants.find(f => extractResourceIdentity(f).lang === currentLang);
      if (currentMatch) {
        deduplicated.push(currentMatch);
        continue;
      }
      // 2. Fallback: preferir base 'es' o la primera disponible
      const esMatch = variants.find(f => extractResourceIdentity(f).lang === 'es');
      deduplicated.push(esMatch || variants[0]);
    }

    return deduplicated;
  }, [files, section, currentLang]);

  // Archivos base filtrados por los modificadores activos (favoritos y búsqueda)
  const baseFilteredFiles = useMemo(() => {
    let result = sectionFiles;

    // Filtro solo favoritos
    if (onlyFavorites) {
      result = result.filter(file => favoritePaths.includes(file.path));
    }

    // Filtro por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(file => {
        const name = resourceDisplayName(file).toLowerCase();
        const path = file.path.toLowerCase();
        const type = file.type.toLowerCase();
        const catSingular = getCategoryDisplayName(file.type, 'singular').toLowerCase();
        const catPlural = getCategoryDisplayName(file.type, 'plural').toLowerCase();
        return (
          name.includes(query) ||
          path.includes(query) ||
          type.includes(query) ||
          catSingular.includes(query) ||
          catPlural.includes(query)
        );
      });
    }

    return result;
  }, [sectionFiles, onlyFavorites, favoritePaths, searchQuery]);

  // Lista de tipos/categorías únicas disponibles en esta sección según los filtros activos
  const availableTypes = useMemo(() => {
    const counts = new Map<string, number>();
    for (const file of baseFilteredFiles) {
      const type = file.type || 'general';
      counts.set(type, (counts.get(type) || 0) + 1);
    }
    const typesList = Array.from(counts.entries())
      .filter(([_, count]) => count > 0)
      .map(([id, count]) => ({
        id,
        label: getCategoryDisplayName(id, 'plural', currentLang),
        count,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, currentLang || 'es'));

    const allLabel = currentLang === 'eu' ? 'Guztiak' : 'Todos';
    return [{ id: 'all', label: allLabel, count: baseFilteredFiles.length }, ...typesList];
  }, [baseFilteredFiles, currentLang]);

  // Si la categoría seleccionada ya no existe entre las disponibles, usar 'all'
  const effectiveSelectedType = selectedType !== 'all' && availableTypes.some(t => t.id === selectedType)
    ? selectedType
    : 'all';

  // Archivos recientemente accedidos
  const recentFiles = useMemo(() => {
    if (!recentPaths.length) return [];
    return recentPaths
      .map(path => sectionFiles.find(f => f.path === path))
      .filter((f): f is FileNode => Boolean(f));
  }, [recentPaths, sectionFiles]);

  // Filtrar por categoría y ordenar archivos finales
  const filteredFiles = useMemo(() => {
    let result = baseFilteredFiles;

    // Filtro por tipo/categoría
    if (effectiveSelectedType !== 'all') {
      result = result.filter(file => file.type === effectiveSelectedType);
    }

    // Ordenación
    return [...result].sort((a, b) => {
      if (sortBy === 'name') {
        return resourceDisplayName(a).localeCompare(resourceDisplayName(b), 'es');
      }
      if (sortBy === 'type') {
        return a.type.localeCompare(b.type, 'es');
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
  }, [baseFilteredFiles, effectiveSelectedType, sortBy, recentPaths]);

  return {
    searchQuery,
    setSearchQuery,
    selectedType: effectiveSelectedType,
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
