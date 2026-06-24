import proofBlocksData from '@/entities/graph/proof_blocks.json';
import type React from 'react';

interface ProofStepExpanderProps {
  blockIds: string[];
}

interface ProofBlock {
  id: string;
  leanId: string;
  sourceFile: string;
  startLine: number;
  endLine: number;
  code: string;
}

const proofBlocks = (proofBlocksData as { blocks?: ProofBlock[] }).blocks ?? [];
const proofBlockMap = new Map(proofBlocks.map(block => [block.id, block]));

export const ProofStepExpander: React.FC<ProofStepExpanderProps> = ({ blockIds }) => {
  if (blockIds.length === 0) return null;

  const resolved = blockIds.map(id => ({ id, block: proofBlockMap.get(id) }));

  return (
    <details className="mt-5 border border-carbon/15 bg-lienzo px-4 py-3 text-sm">
      <summary className="cursor-pointer select-none font-sans text-xs uppercase tracking-widest text-pizarra">
        Ver en Lean
      </summary>
      <div className="mt-4 space-y-4">
        {resolved.map(({ id, block }) => (
          <div key={id} className="border-l-2 border-pizarra/30 pl-3">
            <div className="mb-2 font-mono text-xs text-carbon/60">
              {block ? `${block.leanId} · ${block.sourceFile}:${block.startLine}` : id}
            </div>
            {block ? (
              <pre className="overflow-x-auto bg-carbon/[0.04] p-3 font-mono text-xs leading-relaxed text-carbon">
                <code>{block.code}</code>
              </pre>
            ) : (
              <p className="m-0 text-sm italic text-granada">
                Bloque Lean no encontrado en proof_blocks.json.
              </p>
            )}
          </div>
        ))}
      </div>
    </details>
  );
};
