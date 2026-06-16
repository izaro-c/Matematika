import React, { useRef, useEffect } from 'react';
import { useLessonStore } from '../../store/LessonStore';

export const EscaleraSimulation: React.FC = () => {
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

      // Origen de coordenadas: esquina inferior izquierda (pared y suelo)
      const ox = 100;
      const oy = height - 100;
      const scale = 40; 

      // 1. Dibujar suelo y pared
      ctx.fillStyle = '#f0ebe1';
      ctx.fillRect(ox, oy, width - ox, height - oy); // Suelo
      
      ctx.fillStyle = '#dcd7cd';
      ctx.fillRect(0, 0, ox, oy); // Pared

      ctx.strokeStyle = '#carbon';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(ox, 0); ctx.lineTo(ox, oy); // Pared línea
      ctx.lineTo(width, oy); // Suelo línea
      ctx.stroke();

      // Escalera
      // a = 3, c = 5 => b = 4
      const a = 3;
      const b = 4;
      
      const px = ox + a * scale;
      const py = oy - b * scale;

      // Dibujar escalera
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(px, oy);
      ctx.lineTo(ox, py);
      ctx.stroke();

      // Peldaños
      ctx.lineWidth = 2;
      for (let i = 1; i < 10; i++) {
        const tStep = i / 10;
        const xStep = px + (ox - px) * tStep;
        const yStep = oy + (py - oy) * tStep;
        
        ctx.beginPath();
        // perpendicular
        const dx = ox - px;
        const dy = py - oy;
        const len = Math.sqrt(dx*dx + dy*dy);
        const nx = -dy / len * 5;
        const ny = dx / len * 5;
        
        ctx.moveTo(xStep + nx, yStep + ny);
        ctx.lineTo(xStep - nx, yStep - ny);
        ctx.stroke();
      }

      const step = activeStep;

      // Animaciones según paso
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#C86446';
      
      if (step === '1' || step === '2' || step === '3' || step === '4' || step === 'Solucion') {
        // Mostrar a = 3
        ctx.fillText('a = 3m', ox + (a*scale)/2 - 20, oy + 25);
        // Mostrar c = 5
        ctx.fillText('c = 5m', ox + (a*scale)/2 + 10, oy - (b*scale)/2 - 10);
      }

      if (step === '2' || step === '3' || step === '4') {
        ctx.fillText('b = ?', ox - 45, oy - (b*scale)/2);
        // Triángulo rectángulo
        ctx.strokeStyle = '#C86446';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(ox, oy - 15, 15, 15);
        ctx.stroke();
      }

      if (step === 'Solucion') {
        const pulse = 16 + Math.sin(t * 3) * 2;
        ctx.font = `bold ${pulse}px sans-serif`;
        ctx.fillStyle = '#2a6a2a';
        ctx.fillText('b = 4m', ox - 55, oy - (b*scale)/2);
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
        El Problema de la Escalera
      </h3>
      <div className="relative border border-carbon/10 shadow-sm bg-[#faf9f5] p-2">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={400} 
        />
      </div>
      <p className="mt-6 text-sm italic text-carbon/60 text-center max-w-sm">
        {(!activeStep) && "Una escalera apoyada en la pared forma un triángulo rectángulo."}
        {activeStep === '1' && "Paso 1: Conocemos la hipotenusa (c=5) y la base (a=3)."}
        {activeStep === '2' && "Paso 2: Identificamos los catetos."}
        {activeStep === '3' && "Paso 3: Aplicamos Pitágoras."}
        {activeStep === '4' && "Paso 4: Despejamos el cateto b."}
        {activeStep === 'Solucion' && "Solución: La altura alcanzada es 4m."}
      </p>
    </div>
  );
};
