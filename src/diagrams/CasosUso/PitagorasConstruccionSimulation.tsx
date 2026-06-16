import React, { useState, useMemo } from 'react';

/**
 * PitagorasConstruccionSimulation
 *
 * Componente de visualización matemática. Renderiza un diagrama interactivo 
 * o estático para apoyar el contenido de las lecciones.
 */
export const PitagorasConstruccionSimulation: React.FC = () => {
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const c = 12 - a - b;

  // Escala para dibujar
  const UNIT = 30;

  // Calcular las coordenadas del triángulo si se puede cerrar
  const triangle = useMemo(() => {
    // Desigualdad triangular
    if (a + b <= c || a + c <= b || b + c <= a || a <= 0 || b <= 0 || c <= 0) {
      return null;
    }

    // A en el origen, B en el eje X
    const ptA = { x: 0, y: 0 };
    const ptB = { x: a * UNIT, y: 0 };

    // Usando ley del coseno para encontrar el ángulo en A
    // c^2 = a^2 + b^2 - 2ab*cos(C) => aquí tenemos a, b, c.
    // Lados: AB = a, AC = b, BC = c.
    // Ángulo en A: cos(A) = (a^2 + b^2 - c^2) / (2ab)
    const cosA = (a * a + b * b - c * c) / (2 * a * b);
    const angleA = Math.acos(cosA);

    const ptC = {
      x: b * UNIT * Math.cos(angleA),
      y: b * UNIT * Math.sin(angleA)
    };

    return { ptA, ptB, ptC, angleA };
  }, [a, b, c]);

  const isRightTriangle = a * a + b * b === c * c || a * a + c * c === b * b || b * b + c * c === a * a;

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-6 text-carbon">
      <h3 className="font-serif text-xl font-bold mb-4 text-center">La Cuerda de 12 Nudos</h3>
      <p className="text-sm opacity-70 mb-6 text-center max-w-sm">
        Ajusta la posición de los "clavos" para formar un triángulo con la cuerda. 
        Solo una combinación forma un ángulo recto perfecto.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm mb-8">
        <div className="flex items-center gap-4">
          <label className="font-bold w-16">Lado a: {a}</label>
          <input 
            type="range" min="1" max="10" step="1" 
            value={a} onChange={e => setA(Number(e.target.value))} 
            className="flex-1 accent-terracota"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="font-bold w-16">Lado b: {b}</label>
          <input 
            type="range" min="1" max="10" step="1" 
            value={b} onChange={e => setB(Number(e.target.value))} 
            className="flex-1 accent-terracota"
          />
        </div>
        <div className="flex justify-between items-center px-2 py-1 bg-carbon/5 rounded">
          <span className="font-bold text-sm">Lado c (restante): {c}</span>
          <span className="text-xs opacity-60">Total nudos: 12</span>
        </div>
      </div>

      <div className="relative w-full h-64 border border-carbon/10 bg-carbon/5 flex items-center justify-center rounded-lg overflow-hidden">
        {triangle ? (
          <svg width="300" height="200" viewBox="-50 -50 250 150" className="overflow-visible">
            {/* Si es rectángulo, dibujar el cuadradito del ángulo de 90 */}
            {isRightTriangle && (
              <path 
                d={`M 0 ${UNIT*0.5} L ${UNIT*0.5} ${UNIT*0.5} L ${UNIT*0.5} 0`} 
                fill="none" stroke="#2a6a2a" strokeWidth="2" 
              />
            )}
            
            {/* Dibujar la cuerda */}
            <polygon 
              points={`${triangle.ptA.x},${triangle.ptA.y} ${triangle.ptB.x},${triangle.ptB.y} ${triangle.ptC.x},${triangle.ptC.y}`} 
              fill={isRightTriangle ? '#2a6a2a20' : 'none'}
              stroke={isRightTriangle ? '#2a6a2a' : '#C86446'} 
              strokeWidth="4" 
              strokeLinejoin="round"
            />

            {/* Nudos (dividimos cada lado) */}
            {Array.from({ length: a }).map((_, i) => (
              <circle key={`a-${i}`} cx={(triangle.ptB.x / a) * i} cy={0} r="4" fill="#333" />
            ))}
            {Array.from({ length: c }).map((_, i) => {
              const cx = triangle.ptB.x + ((triangle.ptC.x - triangle.ptB.x) / c) * i;
              const cy = triangle.ptB.y + ((triangle.ptC.y - triangle.ptB.y) / c) * i;
              return <circle key={`c-${i}`} cx={cx} cy={cy} r="4" fill="#333" />;
            })}
            {Array.from({ length: b }).map((_, i) => {
              const cx = triangle.ptC.x + ((triangle.ptA.x - triangle.ptC.x) / b) * i;
              const cy = triangle.ptC.y + ((triangle.ptA.y - triangle.ptC.y) / b) * i;
              return <circle key={`b-${i}`} cx={cx} cy={cy} r="4" fill="#333" />;
            })}

            {/* Vértices principales */}
            <circle cx={triangle.ptA.x} cy={triangle.ptA.y} r="6" fill="#111" />
            <circle cx={triangle.ptB.x} cy={triangle.ptB.y} r="6" fill="#111" />
            <circle cx={triangle.ptC.x} cy={triangle.ptC.y} r="6" fill="#111" />
          </svg>
        ) : (
          <div className="text-center text-terracota font-bold">
            <p>La cuerda no se puede cerrar.</p>
            <p className="text-sm font-normal opacity-80 mt-2">La desigualdad triangular impide formar un triángulo con lados {a}, {b} y {c}.</p>
          </div>
        )}
      </div>
      
      {isRightTriangle && (
        <div className="mt-6 p-4 bg-[#2a6a2a]/10 border border-[#2a6a2a]/30 text-[#2a6a2a] rounded text-center animate-fade-in">
          <strong>¡Ángulo recto perfecto!</strong>
          <p className="text-sm mt-1">Con {a}, {b} y {c} nudos has formado un triángulo rectángulo.</p>
        </div>
      )}
    </div>
  );
};
