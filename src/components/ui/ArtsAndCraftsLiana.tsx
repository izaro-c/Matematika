import React from 'react';

export const ArtsAndCraftsLiana = ({
  scrollProgress,
  totalHeight,
}: {
  scrollProgress: number;
  totalHeight: number;
}) => {
  const SEGMENT_H = 320;
  const segments = Math.max(1, Math.ceil(totalHeight / SEGMENT_H));

  let pathD = 'M100,0 ';
  let innerPathD = 'M100,0 ';
  const elements: React.ReactNode[] = [];

  for (let i = 0; i < segments; i++) {
    const yStart = i * SEGMENT_H;
    const yEnd = (i + 1) * SEGMENT_H;
    const isLeft = i % 2 === 0;
    const ctrlX = isLeft ? -40 : 240;
    const midY = yStart + SEGMENT_H / 2;

    pathD += `Q ${ctrlX} ${midY} 100 ${yEnd} `;
    innerPathD += `Q ${ctrlX + (isLeft ? 6 : -6)} ${midY} 100 ${yEnd} `;

    const getStemX = (t: number) =>
      Math.pow(1 - t, 2) * 100 + 2 * (1 - t) * t * ctrlX + Math.pow(t, 2) * 100;
    const getStemY = (t: number) => yStart + SEGMENT_H * t;

    // Hoja superior
    const [ax1, ay1] = [getStemX(0.25), getStemY(0.25)];
    const d1 = isLeft ? -1 : 1;
    elements.push(
      <g key={`l1-${i}`} transform={`translate(${ax1},${ay1}) scale(${d1},1)`}>
        <path d="M0,0 Q-15,-5 -35,10" className="stroke-salvia/70 fill-none" strokeWidth="1" />
        <path d="M-35,10 C-15,-10 -5,15 0,0 C-10,-5 -25,-15 -35,10" className="fill-salvia/30 stroke-salvia/50" strokeWidth="1" />
        <path d="M-35,10 C-30,20 -20,15 0,0 C-15,10 -25,25 -35,10" className="fill-salvia/20 stroke-salvia/40" strokeWidth="0.5" />
      </g>
    );

    // Hoja inferior
    const [ax2, ay2] = [getStemX(0.75), getStemY(0.75)];
    const d2 = isLeft ? 1 : -1;
    elements.push(
      <g key={`l2-${i}`} transform={`translate(${ax2},${ay2}) scale(${d2},1)`}>
        <path d="M0,0 Q10,10 25,20" className="stroke-salvia/70 fill-none" strokeWidth="1" />
        <path d="M25,20 C15,5 5,20 0,0 C10,5 20,0 25,20" className="fill-salvia/30 stroke-salvia/50" strokeWidth="1" />
      </g>
    );

    // Flor botánica en segmentos impares
    if (i % 2 !== 0 && i !== 0) {
      const [ax3, ay3] = [getStemX(0.5), getStemY(0.5)];
      const d3 = isLeft ? -1 : 1;
      elements.push(
        <g key={`f-${i}`} transform={`translate(${ax3},${ay3}) scale(${d3},1)`}>
          <path d="M0,0 Q-8,5 -15,-5" className="stroke-terracota/60 fill-none" strokeWidth="1" />
          <g transform="translate(-15,-5) rotate(-30)">
            <path d="M0,0 Q-4,-2 -5,-6 Q0,-4 5,-6 Q4,-2 0,0" className="fill-salvia stroke-salvia/80" strokeWidth="0.5" />
            <path d="M0,0 C12,10 8,22 0,28 C-8,22 -12,10 0,0" className="fill-terracota/30 stroke-terracota/60" strokeWidth="1" />
          </g>
        </g>
      );
    }
  }

  const clipHeight = Math.max(0, scrollProgress * totalHeight + (typeof window !== 'undefined' ? window.innerHeight / 2 : 400));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 flex justify-center">
      <svg width="200" height={totalHeight} viewBox={`0 0 200 ${totalHeight}`}>
        <defs>
          <clipPath id="scroll-clip">
            <rect x="0" y="0" width="200" height={clipHeight} />
          </clipPath>
        </defs>
        <g clipPath="url(#scroll-clip)">
          <path d={pathD} className="stroke-salvia/30 fill-none" strokeWidth="4" strokeLinecap="round" />
          <path d={innerPathD} className="stroke-lienzo/50 fill-none" strokeWidth="1.5" />
          {elements}
        </g>
      </svg>
    </div>
  );
};
