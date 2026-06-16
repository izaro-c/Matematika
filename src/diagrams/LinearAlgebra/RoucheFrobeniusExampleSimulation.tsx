import React, { useRef, useEffect } from 'react';
import { useLessonStore } from '../../store/LessonStore';

export const RoucheFrobeniusExampleSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { activeStep } = useLessonStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const draw = () => {
      t += 0.05;
      const width = canvas.width;
      const height = canvas.height;
      
      // Limpiar lienzo
      ctx.clearRect(0, 0, width, height);

      // Centro
      const cx = width / 2;
      const cy = height / 2;
      const scale = 40; // píxeles por unidad

      // Dibujar ejes
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, cy); ctx.lineTo(width, cy);
      ctx.moveTo(cx, 0); ctx.lineTo(cx, height);
      ctx.stroke();

      // Función auxiliar para dibujar recta: y = mx + n
      const drawLine = (m: number, n: number, color: string, alpha: number = 1) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        // x = -10 to 10
        const x1 = -10; const y1 = m * x1 + n;
        const x2 = 10; const y2 = m * x2 + n;
        ctx.moveTo(cx + x1 * scale, cy - y1 * scale);
        ctx.lineTo(cx + x2 * scale, cy - y2 * scale);
        ctx.stroke();
        ctx.globalAlpha = 1;
      };

      // 1. Matriz / Rectas base
      // L1: 2x + y = 5 => y = -2x + 5
      // L2: x - y = 1 => y = x - 1
      
      const step = parseInt(activeStep || '0', 10);
      
      const alphaL1 = step >= 1 ? Math.min(1, t) : 0.2;
      const alphaL2 = step >= 1 ? Math.min(1, t) : 0.2;

      drawLine(-2, 5, '#C86446', alphaL1);
      drawLine(1, -1, '#2a6a2a', alphaL2);

      // Si step >= 3, mostrar punto de intersección (2, 1)
      if (step >= 3 || activeStep === 'Solucion') {
        const ptX = cx + 2 * scale;
        const ptY = cy - 1 * scale;
        
        // Pulso
        const pulse = 4 + Math.sin(t * 2) * 2;
        
        ctx.fillStyle = '#1a1a1a';
        ctx.beginPath();
        ctx.arc(ptX, ptY, pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '14px serif';
        ctx.fillText('(2, 1)', ptX + 10, ptY - 10);
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeStep]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 relative font-serif">
      <h3 className="text-xl font-bold mb-4 text-carbon/80 text-center uppercase tracking-widest" style={{ fontVariant: 'small-caps' }}>
        Sistema Compatible Determinado
      </h3>
      <div className="relative border border-carbon/10 shadow-sm bg-lienzo/50 p-2">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
          className="bg-[#faf9f5]"
        />
        
        {/* Leyenda interactiva según paso */}
        <div className="absolute top-4 left-4 bg-lienzo/90 p-3 border border-carbon/10 text-sm shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-[#C86446]" />
            <span className={!activeStep ? "opacity-50" : "font-bold"}>2x + y = 5</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#2a6a2a]" />
            <span className={!activeStep ? "opacity-50" : "font-bold"}>x - y = 1</span>
          </div>
        </div>
      </div>
      
      <p className="mt-6 text-sm italic text-carbon/60 text-center max-w-sm">
        {(!activeStep || activeStep === '0') && "Observa la representación en el plano de ambas ecuaciones."}
        {activeStep === '1' && "Paso 1: Planteamos las ecuaciones."}
        {activeStep === '2' && "Paso 2: Rango(A) = 2 indica que las rectas no son paralelas."}
        {activeStep === '3' && "Paso 3: Rango(A*) = 2 indica que el sistema es consistente."}
        {activeStep === 'Solucion' && "Solución: Un único punto de intersección en (2, 1)."}
      </p>
    </div>
  );
};
