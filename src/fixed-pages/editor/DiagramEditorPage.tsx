import React, { useMemo } from 'react';
import { useLocation } from 'wouter';
import { DiagramWorkbench } from '@/fixed-pages/editor/diagrams/ui/workbench/DiagramWorkbench';
import type { DiagramWorkbenchMode } from '@/fixed-pages/editor/diagrams/ui/workbench/useDiagramWorkbenchLoader';

/**
 * /editor_v2 — sandbox by default.
 * Optional query: ?path=/src/.../File.tsx → file mode with save/roundtrip.
 * Optional: ?new=ComponentName → new diagram mode.
 */
export const DiagramEditorPage: React.FC = () => {
  const [location, setLocation] = useLocation();
  const mode = useMemo<DiagramWorkbenchMode | undefined>(() => {
    const query = location.includes('?') ? location.slice(location.indexOf('?') + 1) : window.location.search.replace(/^\?/, '');
    const params = new URLSearchParams(query);
    const path = params.get('path');
    if (path) return { kind: 'file', path };
    const componentName = params.get('new');
    if (componentName) return { kind: 'new', componentName };
    return undefined;
  }, [location]);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <DiagramWorkbench mode={mode} onClose={() => setLocation('/editor?tab=diagrams')} />
    </div>
  );
};

export default DiagramEditorPage;
