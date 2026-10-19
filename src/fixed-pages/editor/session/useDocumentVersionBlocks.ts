import { useEffect, useState } from 'react';
import { parseEditorDocument } from '../document';
import { ContentRepository, editorApiClient } from '../save';
import { mapProjectedBlocks } from './blockView';
import type { Block } from './parser';

const contentRepository = new ContentRepository(editorApiClient);

export type DocumentVersionBlocks =
  | { status: 'idle' }
  | { status: 'loading'; path: string }
  | { status: 'ready'; path: string; blocks: Block[] }
  | { status: 'error'; path: string };

/**
 * Bloques de otra versión de idioma, solo para leer (vista de traducción en paralelo).
 * No pasa por la sesión de edición: no toca el documento abierto ni su guardado.
 */
export function useDocumentVersionBlocks(path: string | null): DocumentVersionBlocks {
  const [state, setState] = useState<DocumentVersionBlocks>({ status: 'idle' });

  useEffect(() => {
    if (!path) {
      setState({ status: 'idle' });
      return;
    }
    const controller = new AbortController();
    setState({ status: 'loading', path });
    contentRepository.read({ path }, controller.signal)
      .then(response => {
        if (controller.signal.aborted) return;
        const document = parseEditorDocument(response.source);
        setState({ status: 'ready', path, blocks: mapProjectedBlocks(document.bodyBlocks, document.containers) });
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ status: 'error', path });
      });
    return () => controller.abort();
  }, [path]);

  return state;
}
