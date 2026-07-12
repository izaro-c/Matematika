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
  focusRange?: { start: number; end: number };
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  rawBody,
  updateRawBody,
  isDiagramFile,
  isDark,
  focusRange,
}) => {
  const editorRef = React.useRef<any>(null);

  useEffect(() => {
    if (import.meta.env.MODE !== 'e2e') return undefined;
    window.__MATEMATIKA_EDITOR_SET_SOURCE__ = updateRawBody;
    return () => {
      if (window.__MATEMATIKA_EDITOR_SET_SOURCE__ === updateRawBody) {
        delete window.__MATEMATIKA_EDITOR_SET_SOURCE__;
      }
    };
  }, [updateRawBody]);

  useEffect(() => {
    if (editorRef.current && focusRange) {
      const model = editorRef.current.getModel();
      if (model) {
        const startPos = model.getPositionAt(focusRange.start);
        const endPos = model.getPositionAt(focusRange.end);
        editorRef.current.setSelection({
          startLineNumber: startPos.lineNumber,
          startColumn: startPos.column,
          endLineNumber: endPos.lineNumber,
          endColumn: endPos.column,
        });
        editorRef.current.revealRange(
          {
            startLineNumber: startPos.lineNumber,
            startColumn: startPos.column,
            endLineNumber: endPos.lineNumber,
            endColumn: endPos.column,
          },
          1 // Center
        );
        editorRef.current.focus();
      }
    }
  }, [focusRange]);

  return (
    <div className="h-full border border-carbon/15 rounded overflow-hidden bg-lienzo shadow-inner">
      <Editor
        height="100%"
        defaultLanguage={isDiagramFile ? 'typescript' : 'mdx'}
        theme={isDark ? 'vs-dark' : 'vs-light'}
        value={rawBody}
        onChange={(val) => updateRawBody(val || '')}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
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
