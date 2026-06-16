import React, { useRef, useEffect } from 'react';
import { useLessonStore } from '../../store/LessonStore';

/**
 * RectanguloDistanciaSimulation
 *
 * Componente de visualización matemática. Renderiza un diagrama interactivo 
 * o estático para apoyar el contenido de las lecciones.
 */
export const RectanguloDistanciaSimulation: React.FC = () => {
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
      const cy = height / 2;
      
      // Rectángulo 80x60 -> escalado a 160x120
      const w = 160;
      const h = 120;
      const x0 = cx - w/2;
      const y0 = cy - h/2;

      // Dibujar campo (rectángulo completo)
      ctx.fillStyle = '#f0ebe1';
      ctx.fillRect(x0, y0, w, h);
      
      ctx.strokeStyle = '#carbon';
      ctx.lineWidth = 2;
      ctx.strokeRect(x0, y0, w, h);

      const step = activeStep;

      if (step === '1' || step === '2' || step === 'Solucion') {
        // Trazar diagonal
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(x0, y0 + h);
        ctx.lineTo(x0 + w, y0);
        ctx.stroke();
        ctx.setLineDash([]);

        // Resaltar triángulo inferior
        ctx.fillStyle = 'rgba(200, 100, 70, 0.1)';
        ctx.beginPath();
        ctx.moveTo(x0, y0 + h);
        ctx.lineTo(x0 + w, y0 + h);
        ctx.lineTo(x0 + w, y0);
        ctx.fill();

        // Cotas
        ctx.font = '16px sans-serif';
        ctx.fillStyle = '#1a1a1a';
        ctx.fillText('80m', x0 + w/2 - 15, y0 + h + 20);
        ctx.fillText('60m', x0 + w + 10, y0 + h/2 + 5);
      }

      if (step === '1') {
        ctx.fillStyle = '#C86446';
        ctx.fillText('c = ?', cx - 20, cy - 10);
      }

      if (step === '2') {
        ctx.fillStyle = '#C86446';
        ctx.fillText('c² = 10000', cx - 40, cy - 10);
      }

      if (step === 'Solucion') {
        const pulse = 16 + Math.sin(t * 3) * 2;
        ctx.font = `bold ${pulse}px sans-serif`;
        ctx.fillStyle = '#2a6a2a';
        ctx.fillText('c = 100m', cx - 40, cy - 10);
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
        Diagonal del Campo
      </h3>
      <div className="relative border border-carbon/10 shadow-sm bg-[#faf9f5] p-2">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={300} 
        />
      </div>
      <p className="mt-6 text-sm italic text-carbon/60 text-center max-w-sm">
        {(!activeStep) && "Un campo rectangular se puede dividir en dos triángulos rectángulos mediante su diagonal."}
        {activeStep === '1' && "Pregunta 1: Calculamos la suma de los cuadrados de los catetos (80² + 60²)."}
        {activeStep === '2' && "Pregunta 2: Si c² = 10000, ¿cuánto vale c?"}
        {activeStep === 'Solucion' && "Solución: La diagonal mide 100 metros."}
      </p>
    </div>
  );
};
