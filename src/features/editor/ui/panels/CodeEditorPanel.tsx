import React from 'react';
import Editor from '@monaco-editor/react';

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
