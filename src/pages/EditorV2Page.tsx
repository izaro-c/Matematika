import React, { useMemo } from 'react';
import { useLocation } from 'wouter';
import { EditorV2Main } from '@/features/editor_v2/ui/EditorV2Main';
import type { DiagramWorkbenchMode } from '@/features/editor/diagrams/hooks/useDiagramWorkbenchLoader';

/**
 * /editor_v2 — sandbox by default.
 * Optional query: ?path=/src/.../File.tsx → file mode with save/roundtrip.
 * Optional: ?new=ComponentName → new diagram mode.
 */
export const EditorV2Page: React.FC = () => {
  const [location] = useLocation();
  const mode = useMemo<DiagramWorkbenchMode | undefined>(() => {
    const query = location.includes('?') ? location.slice(location.indexOf('?') + 1) : window.location.search.replace(/^\?/, '');
    const params = new URLSearchParams(query);
    const path = params.get('path');
    if (path) return { kind: 'file', path };
    const componentName = params.get('new');
    if (componentName) return { kind: 'new', componentName };
    return undefined;
  }, [location]);

  return <EditorV2Main mode={mode} />;
};

export default EditorV2Page;
