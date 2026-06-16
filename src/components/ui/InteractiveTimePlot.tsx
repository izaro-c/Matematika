import React, { useMemo } from 'react';
import type { Mathematician } from '../../store/ContentStore';

interface InteractiveTimePlotProps {
  nodes: Mathematician[];
}

export const InteractiveTimePlot: React.FC<InteractiveTimePlotProps> = ({ nodes }) => {
  // Compute histogram of mathematicians over centuries
  const histogram = useMemo(() => {
    const bins = new Map<number, number>();
    let minYear = Infinity;
    let maxYear = -Infinity;

    nodes.forEach(n => {
      const century = Math.floor(n.year / 100) * 100;
      bins.set(century, (bins.get(century) || 0) + 1);
      if (century < minYear) minYear = century;
      if (century > maxYear) maxYear = century;
    });

    // Fill empty centuries
    for (let c = minYear; c <= maxYear; c += 100) {
      if (!bins.has(c)) bins.set(c, 0);
    }

    const sortedBins = Array.from(bins.entries()).sort((a, b) => a[0] - b[0]);
    const maxCount = Math.max(...sortedBins.map(b => b[1]));

    return { bins: sortedBins, maxCount };
  }, [nodes]);

  const { bins, maxCount } = histogram;

  if (bins.length === 0) return null;

  const height = 60;
  const barWidth = 100 / bins.length;

  return (
    <div className="w-full mt-6 mb-2 border-b border-carbon/20 pb-4">
      <div className="text-[10px] uppercase font-sans tracking-widest text-carbon/40 mb-2">Densidad Histórica</div>
      <div className="relative w-full flex items-end group" style={{ height: `${height}px` }}>
        {bins.map(([century, count]) => {
          const h = maxCount > 0 ? (count / maxCount) * height : 0;
          return (
            <div
              key={century}
              className="relative flex-1 flex flex-col justify-end items-center group/bar cursor-crosshair"
              style={{ width: `${barWidth}%`, height: '100%' }}
            >
              {count > 0 && (
                <div
                  className="bg-carbon/20 hover:bg-terracota transition-colors w-full mx-[1px] rounded-t-sm"
                  style={{ height: `${Math.max(2, h)}px` }}
                />
              )}
              {/* Tooltip on hover */}
              <div className="absolute bottom-full mb-1 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-carbon text-lienzo text-[9px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-50">
                {century > 0 ? `Siglo ${(century/100)+1}` : `Siglo ${Math.abs(century/100)+1} a.C.`}: {count}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] font-sans text-carbon/40 mt-1">
        <span>{bins[0][0]}</span>
        <span>{bins[bins.length - 1][0]}</span>
      </div>
    </div>
  );
};
