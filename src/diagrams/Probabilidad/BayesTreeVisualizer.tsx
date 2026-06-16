import React, { useState } from 'react';
import { useLessonStore } from '../../store/LessonStore';
import { KatexText } from '../../components/ui/KatexText';

export const BayesTreeVisualizer: React.FC = () => {
  const { activeStep } = useLessonStore();
  
  // P(Enfermo)
  const [pE, setPE] = useState(0.01);
  const pS = 1 - pE; // Sano

  // P(+ | E) = Sensibilidad
  const pPosDadoE = 0.99; // True positive
  const pPosDadoS = 0.05; // False positive

  const isFalsoPositivo = activeStep === 'falso_positivo';
  const isBayes = activeStep === 'formula_bayes';

  // Calculos totales
  const pE_Pos = pE * pPosDadoE;
  const pS_Pos = pS * pPosDadoS;
  const pPosTotal = pE_Pos + pS_Pos;

  // P(E | +)
  const bayesResult = pE_Pos / pPosTotal;

  return (
    <div className="w-full h-full min-h-[500px] bg-lienzo flex flex-col items-center justify-center p-6">
      
      <div className="bg-white/80 p-4 rounded border border-carbon/10 shadow-sm w-full max-w-[500px] mb-8">
        <h4 className="font-serif font-bold text-carbon mb-4 text-center border-b border-carbon/10 pb-2">Árbol de Probabilidad</h4>
        
        <div className="flex justify-between items-center text-sm font-mono text-carbon mb-2">
          <span className="w-24 text-right">P(Enfermo)</span>
          <input 
            type="range" min="0.001" max="0.5" step="0.005" 
            value={pE} onChange={e => setPE(parseFloat(e.target.value))} 
            className="flex-1 mx-4 accent-terracota" 
          />
          <span className="w-16 font-bold text-terracota">{(pE*100).toFixed(1)}%</span>
        </div>
        
        <div className="flex gap-4 w-full h-[200px] mt-6 relative">
          {/* Nodo Raiz */}
          <div className="w-1/3 flex flex-col justify-center items-end pr-4 border-r border-carbon/20">
             <div className="bg-carbon/5 p-2 rounded text-center">Población</div>
          </div>
          
          {/* Ramas Principales */}
          <div className="w-1/3 flex flex-col justify-between py-4 pr-4 border-r border-carbon/20 relative">
            <div className="bg-terracota/10 p-2 rounded border border-terracota/30 text-center relative">
              <span className="text-terracota font-bold text-xs absolute -left-8 -top-3 bg-white px-1">{(pE*100).toFixed(1)}%</span>
              Enfermo (E)
            </div>
            <div className="bg-salvia/10 p-2 rounded border border-salvia/30 text-center relative">
              <span className="text-salvia font-bold text-xs absolute -left-8 -top-3 bg-white px-1">{(pS*100).toFixed(1)}%</span>
              Sano (S)
            </div>
          </div>

          {/* Ramas Secundarias */}
          <div className="w-1/3 flex flex-col justify-between py-0 relative gap-2">
             {/* E -> + */}
             <div className={`bg-terracota/20 p-2 rounded text-center transition-all ${isFalsoPositivo || isBayes ? 'ring-2 ring-terracota ring-offset-2' : ''}`}>
               <span className="text-xs font-bold absolute -left-4 top-2 text-pizarra">95%</span>
               Test (+)
             </div>
             {/* E -> - */}
             <div className="bg-carbon/5 p-2 rounded text-center opacity-50 text-xs">Test (-)</div>
             
             {/* S -> + */}
             <div className={`bg-salvia/20 p-2 rounded text-center mt-4 transition-all ${isFalsoPositivo || isBayes ? 'ring-2 ring-salvia ring-offset-2' : ''}`}>
               <span className="text-xs font-bold absolute -left-4 top-[55%] text-pizarra">10%</span>
               Test (+)
             </div>
             {/* S -> - */}
             <div className="bg-carbon/5 p-2 rounded text-center opacity-50 text-xs">Test (-)</div>
          </div>
        </div>
      </div>

      <div className={`flex flex-col items-center transition-opacity duration-500 w-full max-w-[500px] ${isFalsoPositivo || isBayes ? 'opacity-100' : 'opacity-20'}`}>
        <p className="text-sm font-bold text-carbon/60 uppercase tracking-wider mb-2">Teorema de Bayes</p>
        
        <div className="bg-carbon/5 p-4 rounded text-center w-full border border-carbon/10">
          <p className="text-sm text-pizarra mb-2">Si das positivo en el test, ¿qué probabilidad real hay de estar enfermo?</p>
          <div className="font-mono text-lg bg-white p-2 rounded border border-carbon/10 inline-block">
             P(E | +) = <span className={bayesResult < 0.5 ? "text-terracota font-bold" : "text-salvia font-bold"}>{(bayesResult * 100).toFixed(1)}%</span>
          </div>
        </div>

        {isBayes && (
          <div className="mt-4 p-4 bg-terracota/5 rounded text-sm font-mono border border-terracota/20 w-full">
            <KatexText text={`$$ P(E|+) = \\frac{P(E \\cap +)}{P(+)} = \\frac{${(pE*100).toFixed(1)}\\% \\times 95\\%}{${(pPosTotal*100).toFixed(2)}\\%} $$`} />
          </div>
        )}
      </div>

    </div>
  );
};
