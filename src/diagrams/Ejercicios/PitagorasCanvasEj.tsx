import React, { useState, useRef, useEffect } from 'react';

interface PitagorasCanvasEjProps {
  onComplete?: () => void;
  isCompleted?: boolean;
}

export const PitagorasCanvasEj: React.FC<PitagorasCanvasEjProps> = ({ onComplete, isCompleted }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  
  // A and B are fixed.
  const ptA = { x: 50, y: 150 };
  const ptB = { x: 250, y: 150 };
  
  // C is draggable
  const [ptC, setPtC] = useState({ x: 100, y: 50 });
  const [isDragging, setIsDragging] = useState(false);

  const getAngleC = (c: {x: number, y: number}) => {
    // Vector CA
    const vCA = { x: ptA.x - c.x, y: ptA.y - c.y };
    // Vector CB
    const vCB = { x: ptB.x - c.x, y: ptB.y - c.y };
    
    const dotProduct = vCA.x * vCB.x + vCA.y * vCB.y;
    const magCA = Math.sqrt(vCA.x*vCA.x + vCA.y*vCA.y);
    const magCB = Math.sqrt(vCB.x*vCB.x + vCB.y*vCB.y);
    
    if (magCA === 0 || magCB === 0) return 0;
    
    const cosAngle = dotProduct / (magCA * magCB);
    const angleRad = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
    return (angleRad * 180) / Math.PI;
  };

  const angleC = getAngleC(ptC);
  // Consider 90 +/- 2 degrees as correct
  const isRightAngled = Math.abs(angleC - 90) < 2;

  useEffect(() => {
    if (isRightAngled && onComplete && !isCompleted) {
      onComplete();
    }
  }, [isRightAngled, onComplete, isCompleted]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isCompleted) return;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || isCompleted) return;
    if (svgRef.current) {
      const CTM = svgRef.current.getScreenCTM();
      if (CTM) {
        let x = (e.clientX - CTM.e) / CTM.a;
        let y = (e.clientY - CTM.f) / CTM.d;
        // Limit to bounds
        x = Math.max(10, Math.min(290, x));
        y = Math.max(10, Math.min(190, y));
        setPtC({ x, y });
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div className="flex flex-col items-center">
      <p className="mb-4 text-center">
        Arrastra el vértice superior <strong className="text-[#C86446]">C</strong> hasta formar un <strong>ángulo recto (90°)</strong>.
      </p>
      
      <svg 
        ref={svgRef}
        width="300" 
        height="200" 
        viewBox="0 0 300 200" 
        className="border border-carbon/20 bg-carbon/5 rounded cursor-crosshair touch-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        {/* Lados */}
        <polygon 
          points={`${ptA.x},${ptA.y} ${ptB.x},${ptB.y} ${ptC.x},${ptC.y}`}
          fill={isRightAngled ? "#2a6a2a30" : "none"}
          stroke={isRightAngled ? "#2a6a2a" : "#666"}
          strokeWidth="2"
        />

        {/* Vértices fijos */}
        <circle cx={ptA.x} cy={ptA.y} r="5" fill="#333" />
        <text x={ptA.x - 15} y={ptA.y + 5} fontSize="12" fill="#333" fontWeight="bold">A</text>
        
        <circle cx={ptB.x} cy={ptB.y} r="5" fill="#333" />
        <text x={ptB.x + 10} y={ptB.y + 5} fontSize="12" fill="#333" fontWeight="bold">B</text>

        {/* Vértice móvil C */}
        <circle 
          cx={ptC.x} cy={ptC.y} r={isDragging ? 8 : 6} 
          fill={isRightAngled ? "#2a6a2a" : "#C86446"} 
          className="transition-all duration-100"
        />
        <text x={ptC.x - 5} y={ptC.y - 12} fontSize="12" fill={isRightAngled ? "#2a6a2a" : "#C86446"} fontWeight="bold">C</text>

        {/* Indicador de ángulo */}
        <text x="10" y="20" fontSize="12" fill="#666">
          Ángulo en C: <tspan fill={isRightAngled ? "#2a6a2a" : "#333"} fontWeight="bold">{angleC.toFixed(1)}°</tspan>
        </text>
      </svg>
    </div>
  );
};
