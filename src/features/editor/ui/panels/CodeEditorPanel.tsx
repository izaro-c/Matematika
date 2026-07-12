import React, { useEffect } from 'react';
import Editor from '@monaco-editor/react';

declare global {
  interface Window {
    __MATEMATIKA_EDITOR_SET_SOURCE__?: (source: string) => void;
  }
}

interface CodeEditorPanelProps {
  rawBody: string;
  updateRawBody: (source: string) => void;
  isDiagramFile: boolean;
  isDark: boolean;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  rawBody,
  updateRawBody,
  isDiagramFile,
  isDark,
}) => {
  useEffect(() => {
    if (!import.meta.env.DEV) return undefined;
    window.__MATEMATIKA_EDITOR_SET_SOURCE__ = updateRawBody;
    return () => {
      if (window.__MATEMATIKA_EDITOR_SET_SOURCE__ === updateRawBody) {
        delete window.__MATEMATIKA_EDITOR_SET_SOURCE__;
      }
    };
  }, [updateRawBody]);

  return (
    <div className="h-full border border-carbon/15 rounded overflow-hidden bg-lienzo shadow-inner">
      <Editor
        height="100%"
        defaultLanguage={isDiagramFile ? 'typescript' : 'mdx'}
        theme={isDark ? 'vs-dark' : 'vs-light'}
        value={rawBody}
        onChange={(val) => updateRawBody(val || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: 'Fira Code, monospace',
          lineNumbers: 'on',
          wordWrap: 'on',
          automaticLayout: true,
        }}
      />
    </div>
  );
};
export default CodeEditorPanel;
