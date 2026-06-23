import React from 'react';

interface PreviewPaneProps {
  previewUrl: string;
  leftWidth: number;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({ previewUrl, leftWidth }) => {
  return (
    <div 
      className="border-l border-carbon/20 bg-white relative flex-1"
      style={{ width: `${100 - leftWidth}%` }}
    >
      <div className="absolute top-0 left-0 w-full bg-carbon/5 border-b border-carbon/10 p-2 text-xs text-carbon/50 font-mono text-center z-10 flex justify-between px-4">
        <span>Live Preview</span>
        <span>{previewUrl}</span>
      </div>
      {previewUrl ? (
        <iframe 
          id="preview-iframe"
          src={previewUrl} 
          className="w-full h-full pt-8"
          title="Live Preview"
        />
      ) : (
        <div className="flex items-center justify-center h-full italic text-carbon/40">Sin previsualización</div>
      )}
    </div>
  );
};
