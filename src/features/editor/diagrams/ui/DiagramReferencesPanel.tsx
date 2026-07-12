import React, { useMemo } from 'react';
import { getDiagramUsages } from '../references/usageIndex';

interface DiagramReferencesPanelProps {
  filePath: string | null;
}

export const DiagramReferencesPanel: React.FC<DiagramReferencesPanelProps> = ({
  filePath,
}) => {
  const usages = useMemo(() => {
    if (!filePath) return [];
    return getDiagramUsages(filePath);
  }, [filePath]);

  return (
    <section className="rounded border border-carbon/10 bg-lienzo p-3 h-full overflow-y-auto">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-carbon/45 border-b border-carbon/10 pb-1 mb-3">
        Referencias del Diagrama
      </h4>

      {usages.length === 0 ? (
        <p className="text-xs italic text-carbon/55">
          Este diagrama no está importado ni referenciado en ninguna página MDX todavía.
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-[11px] text-carbon/60 mb-2">
            Referenciado en <span className="font-bold text-carbon">{usages.length}</span> página(s):
          </p>
          <ul className="space-y-1.5">
            {usages.map((u, i) => (
              <li
                key={i}
                className="flex flex-col gap-0.5 rounded border border-carbon/10 bg-carbon/5 p-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-carbon truncate max-w-[180px]">{u.contentId}</span>
                  <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                    u.referenceKind === 'Simulation'
                      ? 'bg-pavo/15 text-pavo'
                      : u.referenceKind === 'Diagram'
                        ? 'bg-salvia/15 text-salvia'
                        : 'bg-pizarra/15 text-pizarra'
                  }`}>
                    {u.referenceKind}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-carbon/45 truncate mt-0.5">{u.contentPath}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
export default DiagramReferencesPanel;
