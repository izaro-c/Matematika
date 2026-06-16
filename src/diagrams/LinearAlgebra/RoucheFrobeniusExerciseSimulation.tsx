import React, { useRef, useEffect } from 'react';
import { useLessonStore } from '../../store/LessonStore';

export const RoucheFrobeniusExerciseSimulation: React.FC = () => {
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
      
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2 + 50; // Offset hacia abajo para centrar mejor
      const scale = 40; 

      // Ejes
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, cy); ctx.lineTo(width, cy);
      ctx.moveTo(cx, 0); ctx.lineTo(cx, height);
      ctx.stroke();

      const drawLine = (m: number, n: number, color: string, alpha: number = 1) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        const x1 = -10; const y1 = m * x1 + n;
        const x2 = 10; const y2 = m * x2 + n;
        ctx.moveTo(cx + x1 * scale, cy - y1 * scale);
        ctx.lineTo(cx + x2 * scale, cy - y2 * scale);
        ctx.stroke();
        ctx.globalAlpha = 1;
      };

      // L1: x + 2y = 4 => y = -0.5x + 2
      // L2: x + 2y = 7 => y = -0.5x + 3.5
      
      const step = activeStep;
      
      const alphaL1 = step === '1' || step === '2' || step === 'Solucion' ? Math.min(1, t) : 0.2;
      const alphaL2 = step === '1' || step === '2' || step === 'Solucion' ? Math.min(1, t) : 0.2;

      drawLine(-0.5, 2, '#3b82f6', alphaL1);
      drawLine(-0.5, 3.5, '#ef4444', alphaL2);

      // Si step >= 2 o Solucion, destacar paralelismo
      if (step === '2' || step === 'Solucion') {
        const offset = Math.sin(t * 3) * 5;
        // Dibujar flechas indicando distancia constante
        ctx.strokeStyle = '#1a1a1a';
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        const px = cx;
        const py1 = cy - 2 * scale;
        const py2 = cy - 3.5 * scale;
        ctx.moveTo(px, py1 - offset);
        ctx.lineTo(px, py2 + offset);
        ctx.stroke();
        ctx.globalAlpha = 1;
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
        Sistema Incompatible
      </h3>
      <div className="relative border border-carbon/10 shadow-sm bg-lienzo/50 p-2">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
          className="bg-[#faf9f5]"
        />
        
        <div className="absolute top-4 right-4 bg-lienzo/90 p-3 border border-carbon/10 text-sm shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-[#3b82f6]" />
            <span className={!activeStep ? "opacity-50" : "font-bold"}>x + 2y = 4</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
            <span className={!activeStep ? "opacity-50" : "font-bold"}>x + 2y = 7</span>
          </div>
        </div>
      </div>
      
      <p className="mt-6 text-sm italic text-carbon/60 text-center max-w-sm">
        {(!activeStep) && "Observa la representación en el plano de ambas ecuaciones."}
        {activeStep === '1' && "Paso 1: Planteamos las ecuaciones. Rango de A es 1."}
        {activeStep === '2' && "Paso 2: Rango de A* es 2."}
        {activeStep === 'Solucion' && "Solución: Rectas paralelas, no hay intersección."}
      </p>
    </div>
  );
};
