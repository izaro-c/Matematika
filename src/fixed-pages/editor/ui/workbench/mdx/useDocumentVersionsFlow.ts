import { useCallback, useEffect, useMemo, useState } from 'react';
import { SUPPORTED_LANGUAGE_CODES } from '@/i18n/config';
import {
  buildConceptIndex,
  conceptKey,
  documentVersionStatuses,
  translationOriginLang,
} from '@/fixed-pages/editor/session/conceptVersions';
import type { FileNode } from '@/fixed-pages/editor/types/editorContracts';

interface Options {
  files: FileNode[];
  currentFile: string | null;
  currentResource: FileNode | undefined;
  metadata: Record<string, unknown>;
  loading: boolean;
  urlOriginLang: string | null | undefined;
  routePath: string | null;
  hasPendingNavigation: boolean;
  openFileSafely: (path: string) => void;
  createTranslation: (lang: string) => Promise<unknown>;
}

/** Idioma del documento, sus versiones y la creación de traducciones (no confundir con el idioma de la interfaz). */
export function useDocumentVersionsFlow({
  files,
  currentFile,
  currentResource,
  metadata,
  loading,
  urlOriginLang,
  routePath,
  hasPendingNavigation,
  openFileSafely,
  createTranslation,
}: Options) {
  const currentLang = useMemo(() => {
    if (metadata && typeof metadata === 'object' && 'lang' in metadata && typeof (metadata as { lang?: unknown }).lang === 'string') {
      return (metadata as { lang: string }).lang;
    }
    if (currentFile) {
      const match = currentFile.split('/').find(p => /^[a-z]{2}(-[A-Z]{2})?$/.test(p));
      if (match) return match;
    }
    return 'es';
  }, [currentFile, metadata]);

  const currentConceptVariants = useMemo<Record<string, FileNode>>(() => {
    if (!currentResource || currentResource.kind !== 'mdx-document') return {};
    return buildConceptIndex(files).get(conceptKey(currentResource)) ?? {};
  }, [currentResource, files]);

  const documentVersions = useMemo(
    () => documentVersionStatuses(currentConceptVariants, SUPPORTED_LANGUAGE_CODES),
    [currentConceptVariants],
  );

  // Vista de traducción: el original es el de `desde=` si existe; si no, el de referencia.
  const translationOrigin = useMemo(() => {
    const paths = Object.fromEntries(Object.entries(currentConceptVariants).map(([lang, file]) => [lang, file.path]));
    const lang = urlOriginLang && urlOriginLang !== currentLang && paths[urlOriginLang]
      ? urlOriginLang
      : translationOriginLang(paths, currentLang);
    return {
      lang,
      path: lang ? paths[lang] ?? null : null,
      options: Object.keys(paths).filter(candidate => candidate !== currentLang),
    };
  }, [currentConceptVariants, currentLang, urlOriginLang]);

  const handleSwitchLanguage = useCallback((targetLang: string) => {
    const targetFile = currentConceptVariants[targetLang];
    if (targetFile) {
      // Cambia la versión del documento; el idioma de la interfaz (`:lang`) se mantiene.
      openFileSafely(targetFile.path);
    }
  }, [currentConceptVariants, openFileSafely]);

  // Abrir otro archivo solo navega: la traducción espera a que el núcleo lo haya cargado.
  const [pendingTranslation, setPendingTranslation] = useState<{ path: string; lang: string } | null>(null);
  const handleCreateTranslation = useCallback(async (fileOrLang: FileNode | string, maybeLang?: string) => {
    const targetLang = typeof fileOrLang === 'string' ? fileOrLang : maybeLang;
    if (!targetLang) return;
    if (typeof fileOrLang !== 'string' && fileOrLang.path !== currentFile) {
      setPendingTranslation({ path: fileOrLang.path, lang: targetLang });
      openFileSafely(fileOrLang.path);
      return;
    }
    await createTranslation(targetLang);
  }, [createTranslation, currentFile, openFileSafely]);

  useEffect(() => {
    if (!pendingTranslation) return;
    if (routePath !== pendingTranslation.path) {
      // Navegación cancelada en el aviso de cambios sin guardar o sustituida por otra.
      if (!hasPendingNavigation) setPendingTranslation(null);
      return;
    }
    if (currentFile !== pendingTranslation.path || loading) return;
    setPendingTranslation(null);
    void createTranslation(pendingTranslation.lang);
  }, [createTranslation, currentFile, hasPendingNavigation, loading, pendingTranslation, routePath]);

  return {
    currentLang,
    documentVersions,
    translationOrigin,
    handleSwitchLanguage,
    handleCreateTranslation,
  };
}
