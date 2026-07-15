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
  onRewriteVisually: () => void;
  capability?: FileNode['capability'];
}

function capabilityDescription(capability: FileNode['capability'] | undefined): string {
  if (capability === 'visual-exact') {
    return 'El modelo visual representa el archivo completo y puede regenerarlo sin pérdida.';
  }
  if (capability === 'invalid') {
    return 'El recurso es inválido. Solo se ofrece el código para corregirlo; el guardado permanece bloqueado mientras no sea TSX válido.';
  }
  return 'El TSX completo es autoritativo. Se ofrece una vista previa real, sin regeneración desde un modelo parcial.';
}

export const DiagramSourcePanel: React.FC<DiagramSourcePanelProps> = ({
  currentFile,
  diagramLinkedPages,
  diagramUsageError,
  openFile,
  setActiveDiagramBlockId,
  setActiveDiagramIndex,
  setDiagramBuilderOpen,
  onRewriteVisually,
  capability,
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
    <div className="h-full w-full overflow-hidden bg-lienzo flex flex-col">
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
            {capability === 'visual-exact' ? 'Abrir edición visual exacta' : 'Abrir código y vista previa'}
          </button>
          {capability === 'code-preview' && (
            <button
              type="button"
              onClick={onRewriteVisually}
              className="mb-3 w-full rounded border border-ocre/30 bg-ocre/10 px-3 py-2 text-xs font-bold text-ocre hover:bg-ocre/20"
            >
              Reescribir visualmente desde cero
            </button>
          )}
          <p className="text-xs italic text-carbon/55 select-none">
            {capabilityDescription(capability)}
          </p>
          {capability === 'code-preview' && (
            <p className="mt-2 text-[10px] leading-relaxed text-carbon/50">
              Esta opción crea un modelo visual nuevo y solo sustituye el TSX heredado después de una confirmación y un guardado explícitos.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};
export default DiagramSourcePanel;
