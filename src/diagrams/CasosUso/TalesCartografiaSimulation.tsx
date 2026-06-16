import React, { useState } from 'react';

/**
 * TalesCartografiaSimulation
 *
 * Componente de visualización matemática. Renderiza un diagrama interactivo 
 * o estático para apoyar el contenido de las lecciones.
 */
export const TalesCartografiaSimulation: React.FC = () => {
  const [scale, setScale] = useState(0.5); // Escala de 0.1 a 1.0

  // Terreno real (constante)
  const realWidth = 200;
  const realHeight = 150;
  
  // Distancias reales de dos ciudades al centro
  const distA = 120;
  const distB = 180;
  const realRatio = (distA / distB).toFixed(2);

  // Distancias en el mapa
  const mapA = distA * scale;
  const mapB = distB * scale;
  const mapRatio = (mapA / mapB).toFixed(2);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-carbon">
      <h3 className="font-serif text-xl font-bold mb-4 text-center">Escalas Cartográficas y Tales</h3>
      <p className="text-sm opacity-70 mb-8 text-center max-w-sm">
        Un mapa es una aplicación directa del Teorema de Tales: todas las distancias 
        se reducen por el mismo factor, manteniendo las proporciones exactas.
      </p>

      <div className="flex w-full max-w-sm items-center gap-4 mb-8">
        <label className="font-bold whitespace-nowrap text-sm">Escala Mapa</label>
        <input 
          type="range" min="0.1" max="1.0" step="0.05" 
          value={scale} onChange={e => setScale(Number(e.target.value))} 
          className="flex-1 accent-[#2a6a2a]"
        />
        <span className="text-sm font-mono bg-carbon/5 px-2 py-1 rounded w-16 text-center">
          {Math.round(scale * 100)}%
        </span>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-end justify-center w-full">
        {/* Mundo Real */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-carbon/50 mb-2">Mundo Real</span>
          <div 
            className="relative border-2 border-carbon/20 bg-[#f0f5ec] rounded-lg overflow-hidden flex items-end justify-center pb-4"
            style={{ width: realWidth, height: realHeight }}
          >
            {/* Montañas fondo */}
            <path d="M 0 150 L 50 80 L 100 150 L 150 60 L 200 150 Z" fill="#d0e0d0" className="absolute bottom-0" />
            
            <div className="flex items-end gap-8 relative z-10">
              <div className="flex flex-col items-center">
                <div className="w-1 h-32 bg-carbon border-l-2 border-dashed border-white" style={{ height: distA }} />
                <span className="text-xs font-bold mt-1">Ruta A ({distA}km)</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-1 h-48 bg-[#c49b4f] border-l-2 border-dashed border-white" style={{ height: distB }} />
                <span className="text-xs font-bold mt-1">Ruta B ({distB}km)</span>
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs font-mono bg-carbon/5 px-2 py-1 rounded">
            Proporción A/B = {realRatio}
          </div>
        </div>

        {/* Mapa */}
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold uppercase tracking-widest text-carbon/50 mb-2">Mapa en Papel</span>
          <div 
            className="relative border-2 border-carbon bg-white rounded shadow-lg flex items-end justify-center pb-2 transition-all duration-300"
            style={{ width: realWidth * scale, height: realHeight * scale }}
          >
            <div className="flex items-end gap-2 relative z-10" style={{ gap: 32 * scale }}>
              <div className="flex flex-col items-center">
                <div className="w-0.5 bg-carbon transition-all duration-300" style={{ height: mapA }} />
              </div>
              <div className="flex flex-col items-center">
                <div className="w-0.5 bg-[#c49b4f] transition-all duration-300" style={{ height: mapB }} />
              </div>
            </div>
          </div>
          <div className="mt-2 text-xs font-mono bg-[#2a6a2a]/10 text-[#2a6a2a] px-2 py-1 rounded">
            Proporción A/B = {mapRatio}
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-sm italic text-carbon/60">
        <p>No importa cuán pequeño sea el mapa, la relación entre las distancias ({realRatio}) <strong>jamás cambia</strong>.</p>
      </div>
    </div>
  );
};
