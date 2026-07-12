import React from 'react';
import type { FileNode } from '../../lib/editorContracts';

interface DiagramSourcePanelProps {
  currentFile: string | null;
  diagramLinkedPages: FileNode[];
  diagramUsageError?: string | null;
  openFile: (path: string) => void;
  setActiveDiagramBlockId: (id: string | null) => void;
  setActiveDiagramIndex: (index: number | null) => void;
  setDiagramBuilderOpen: (open: boolean) => void;
}

export const DiagramSourcePanel: React.FC<DiagramSourcePanelProps> = ({
  currentFile,
  diagramLinkedPages,
  diagramUsageError,
  openFile,
  setActiveDiagramBlockId,
  setActiveDiagramIndex,
  setDiagramBuilderOpen,
}) => {
  const formatFileName = (name: string) => {
    let clean = name.replace(/\.(mdx|tsx)$/, '');
    clean = clean.replace(/^(teorema|lema|corolario|definicion|axioma|ejercicio|ejemplo|modelo)-/, '');
    clean = clean.replace(/-/g, ' ');
    return clean.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const renderLinkedPages = () => {
    if (diagramUsageError) {
      return (
        <p className="mt-3 rounded border border-terracota/25 bg-terracota/5 p-3 text-xs italic text-terracota select-none">
          {diagramUsageError}
        </p>
      );
    }
    if (diagramLinkedPages.length === 0) {
      return (
        <p className="mt-3 rounded border border-dashed border-carbon/20 bg-carbon/5 p-3 text-xs italic text-carbon/55 select-none">
          No se ha encontrado ninguna página MDX que importe este diagrama.
        </p>
      );
    }
    return (
      <div className="mt-3 space-y-2">
        {diagramLinkedPages.map(page => (
          <button
            key={page.path}
            type="button"
            onClick={() => openFile(page.path)}
            className="block w-full rounded border border-carbon/10 bg-carbon/5 px-3 py-2 text-left hover:border-salvia/30 hover:bg-salvia/5 cursor-pointer"
          >
            <span className="block truncate font-serif text-xs font-bold text-carbon">{formatFileName(page.name)}</span>
            <span className="mt-1 block truncate font-mono text-[9px] text-carbon/45">{page.path}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="w-80 shrink-0 overflow-hidden border-l border-carbon/15 bg-lienzo flex flex-col h-full">
      <div className="border-b border-carbon/15 bg-carbon/5 p-4 select-none">
        <h3 className="text-xs font-bold uppercase tracking-widest text-carbon/60">Diagrama TSX</h3>
        <p className="mt-1 font-mono text-[10px] text-carbon/45 truncate">{currentFile}</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        <section className="p-4">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-carbon/55 select-none">Páginas conectadas</h4>
          {renderLinkedPages()}
        </section>
        <section className="border-t border-carbon/15 p-4">
          <button
            type="button"
            onClick={() => {
              setActiveDiagramBlockId(null);
              setActiveDiagramIndex(null);
              setDiagramBuilderOpen(true);
            }}
            className="mb-3 w-full rounded bg-salvia/10 px-3 py-2 text-xs font-bold text-salvia hover:bg-salvia/20 cursor-pointer"
          >
            Editar visualmente
          </button>
          <p className="text-xs italic text-carbon/55 select-none">
            Si el archivo contiene un modelo generado por el editor, se reabrirá en modo visual. Si es manual, se conserva como TSX avanzado.
          </p>
        </section>
      </div>
    </div>
  );
};
export default DiagramSourcePanel;
