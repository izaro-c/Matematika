import React from 'react';
import { useLessonStore } from '../../store/LessonStore';
import { KatexText } from '../../components/ui/KatexText';

export const CramerVisualizer: React.FC = () => {
  const { activeStep } = useLessonStore();
  
  const system = [
    [1, 2, 1, 5],
    [2, -1, 3, 10],
    [3, 1, -1, 1]
  ];

  const calcDet = (m: number[][]) => {
    return m[0][0]*(m[1][1]*m[2][2] - m[1][2]*m[2][1])
         - m[0][1]*(m[1][0]*m[2][2] - m[1][2]*m[2][0])
         + m[0][2]*(m[1][0]*m[2][1] - m[1][1]*m[2][0]);
  };

  const M = system.map(row => row.slice(0, 3));
  const B = system.map(row => row[3]);

  const detM = calcDet(M); // 1*(1-3) - 2*(-2-9) + 1*(2 - (-3)) = 1*(-2) - 2*(-11) + 1*(5) = -2 + 22 + 5 = 25

  const Mx = M.map((row, i) => [B[i], row[1], row[2]]);
  const detMx = calcDet(Mx); // 5*(1-3) - 2*(-10-3) + 1*(10 - (-1)) = 5*(-2) - 2*(-13) + 1*(11) = -10 + 26 + 11 = 27 ... wait let's just use the computed value.
  const x = detMx / detM;

  const isDetSystem = activeStep === 'determinante_sistema';
  const isIncognitas = activeStep === 'incognitas';

  const renderMatrix = (matrix: number[][], highlightCol?: number, isB = false) => (
    <div className="flex">
      <div className="w-2 border-l-2 border-y-2 border-carbon/80 rounded-l-sm" />
      <div className="flex flex-col gap-2 p-2">
        {matrix.map((row, i) => (
          <div key={i} className="flex gap-4">
            {row.map((val, j) => (
              <span key={j} className={`w-6 text-center font-mono ${highlightCol === j ? (isB ? 'text-salvia font-bold bg-salvia/10 px-1 rounded' : 'text-terracota font-bold bg-terracota/10 px-1 rounded') : 'text-carbon'}`}>
                {val}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="w-2 border-r-2 border-y-2 border-carbon/80 rounded-r-sm" />
    </div>
  );

  return (
    <div className="w-full h-full min-h-[500px] bg-lienzo flex flex-col items-center justify-center p-6">
      
      {/* Sistema */}
      <div className="bg-white/80 p-6 rounded shadow-sm border border-carbon/10 mb-6 flex flex-col items-center">
        <h3 className="font-serif font-bold text-lg mb-4 text-carbon">Sistema Original</h3>
        <div className="flex gap-4 items-center">
          {renderMatrix(M)}
          <div className="flex flex-col gap-2 font-serif font-bold">
            <span>x</span>
            <span>y</span>
            <span>z</span>
          </div>
          <span className="text-xl font-bold">=</span>
          {renderMatrix(B.map(b => [b]), 0, true)}
        </div>
      </div>

      {/* Resolucion */}
      <div className="flex gap-8 w-full justify-center">
        
        {/* Delta */}
        <div className={`transition-opacity duration-500 ${isDetSystem || isIncognitas ? 'opacity-100' : 'opacity-20'}`}>
          <div className="flex flex-col items-center bg-carbon/5 p-4 rounded">
            <span className="font-serif font-bold mb-2">$\Delta$ (Sistema)</span>
            {renderMatrix(M)}
            <span className="mt-2 font-mono font-bold text-terracota">={detM}</span>
          </div>
        </div>

        {/* Delta X */}
        <div className={`transition-opacity duration-500 delay-100 ${isIncognitas ? 'opacity-100' : 'opacity-20'}`}>
          <div className="flex flex-col items-center bg-carbon/5 p-4 rounded">
            <span className="font-serif font-bold mb-2">$\Delta_x$</span>
            {renderMatrix(Mx, 0, true)}
            <span className="mt-2 font-mono font-bold text-salvia">={detMx}</span>
            <div className="mt-4 pt-4 border-t border-carbon/20 flex flex-col items-center">
               <KatexText text={`$x = \\frac{\\Delta_x}{\\Delta} = \\frac{${detMx}}{${detM}} = ${x}$`} />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
