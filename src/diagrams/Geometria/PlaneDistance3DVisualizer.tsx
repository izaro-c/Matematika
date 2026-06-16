import React, { useEffect, useRef } from 'react';
import { useLessonStore } from '../../store/LessonStore';

/**
 * PlaneDistance3DVisualizer
 *
 * Componente de visualización matemática. Renderiza un diagrama interactivo 
 * o estático para apoyar el contenido de las lecciones.
 */
export const PlaneDistance3DVisualizer: React.FC = () => {
  const { activeStep } = useLessonStore();
  const containerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const boardRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const containerId = 'jxgbox-3d-plane';
    containerRef.current.id = containerId;

    if (!window.JXG) {
      console.error("JSXGraph is not loaded.");
      return;
    }

    const JXG = window.JXG;

    // Initialize board
    boardRef.current = JXG.JSXGraph.initBoard(containerId, {
      boundingbox: [-10, 10, 10, -10],
      keepaspectratio: true,
      axis: false,
      showNavigation: false,
      showCopyright: false
    });

    const board = boardRef.current;

    // Create 3D View
    const view = board.create('view3d',
      [
        [-8, -6], [16, 16], // 2D window [x, y], [w, h]
        [[-4, 4], [-4, 4], [-4, 4]] // 3D bounding box
      ],
      {
        xAngle: 0.8,
        zAngle: 0.3,
        axesPosition: 'center',
        xAxis: { strokeColor: 'var(--color-carbon)', strokeWidth: 1, strokeOpacity: 0.2 },
        yAxis: { strokeColor: 'var(--color-carbon)', strokeWidth: 1, strokeOpacity: 0.2 },
        zAxis: { strokeColor: 'var(--color-carbon)', strokeWidth: 1, strokeOpacity: 0.2 }
      }
    );

    // Plane equation: z = 0 for simplicity, or slightly angled
    // Let's make an angled plane: x + y + z - 2 = 0 => z = 2 - x - y
    // Let's make an angled plane: x + y + z - 2 = 0 => z = 2 - x - y

    // Highlight logic
    const isPlaneActive = activeStep === 'plano' || !activeStep;
    const isPActive = activeStep === 'punto_p' || !activeStep;
    const isQActive = activeStep === 'proyeccion' || !activeStep;
    const isDistActive = activeStep === 'distancia' || !activeStep;

    // Create the plane as a 3D wireframe mesh using curve3d
    for (let i = -3; i <= 3; i++) {
      // Lines with constant x = i
      view.create('curve3d', [
        () => i,
        (t: number) => t,
        (t: number) => 2 - i - t,
        [-3, 3]
      ], { 
        strokeColor: isPlaneActive ? 'var(--color-salvia)' : 'var(--color-carbon)', 
        strokeWidth: isPlaneActive ? 2 : 1, 
        strokeOpacity: isPlaneActive ? 0.6 : 0.1 
      });
      
      // Lines with constant y = i
      view.create('curve3d', [
        (t: number) => t,
        () => i,
        (t: number) => 2 - t - i,
        [-3, 3]
      ], { 
        strokeColor: isPlaneActive ? 'var(--color-salvia)' : 'var(--color-carbon)', 
        strokeWidth: isPlaneActive ? 2 : 1, 
        strokeOpacity: isPlaneActive ? 0.6 : 0.1 
      });
    }

    // The point P outside the plane
    // P = (3, 3, 4)
    const pX = 3;
    const pY = 3;
    const pZ = 4;
    const P = view.create('point3d', [pX, pY, pZ], { 
      name: 'P', 
      size: isPActive ? 6 : 4, 
      color: isPActive ? 'var(--color-granada)' : 'var(--color-carbon)',
      strokeColor: isPActive ? 'var(--color-granada)' : 'var(--color-carbon)',
      strokeOpacity: isPActive ? 1 : 0.3,
      fillOpacity: isPActive ? 1 : 0.3,
      label: { offset: [10, 10], strokeColor: isPActive ? 'var(--color-granada)' : 'var(--color-carbon)' }
    });

    // To find the projection Q on the plane x + y + z - 2 = 0
    // Normal vector n = (1, 1, 1). 
    // Line eq: L = P + t*n = (3+t, 3+t, 4+t)
    // Substitute into plane: (3+t) + (3+t) + (4+t) - 2 = 0 => 3t + 8 = 0 => t = -8/3
    // Q = (3 - 8/3, 3 - 8/3, 4 - 8/3) = (1/3, 1/3, 4/3)
    const t = -8/3;
    const Q = view.create('point3d', [pX + t, pY + t, pZ + t], { 
      name: 'Q', 
      size: 4, 
      color: isQActive ? 'var(--color-pizarra)' : 'var(--color-carbon)',
      strokeColor: isQActive ? 'var(--color-pizarra)' : 'var(--color-carbon)',
      strokeOpacity: isQActive ? 1 : 0.3,
      fillOpacity: isQActive ? 1 : 0.3,
      face: 'cross',
      label: { offset: [10, -10], strokeColor: isQActive ? 'var(--color-pizarra)' : 'var(--color-carbon)' }
    });

    // The distance vector PQ
    view.create('line3d', [P, Q], {
      strokeColor: isDistActive ? 'var(--color-terracota)' : 'var(--color-carbon)',
      strokeWidth: isDistActive ? 4 : 2,
      strokeOpacity: isDistActive ? 1 : 0.2,
      dash: 2,
      point1: { visible: false },
      point2: { visible: false }
    });

    // Text showing distance
    // d = |Ax+By+Cz+D| / sqrt(A^2+B^2+C^2)
    // A=1, B=1, C=1, D=-2. P=(3,3,4)
    // d = |3+3+4-2| / sqrt(3) = 8 / sqrt(3) = 4.618
    const dist = (8 / Math.sqrt(3)).toFixed(2);
    
    board.create('text', [-9, 8, `d(P, π) = ${dist}`], {
      fontSize: 20,
      strokeColor: isDistActive ? 'var(--color-terracota)' : 'var(--color-carbon)',
      cssClass: 'font-sans font-bold',
      visible: isDistActive
    });

    return () => {
      if (boardRef.current) {
        JXG.JSXGraph.freeBoard(boardRef.current);
      }
    };
  }, [activeStep]);

  return (
    <div className="w-full bg-white p-6 rounded-lg shadow-sm border border-carbon/10 mb-8 mt-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-pizarra font-serif mb-2">Simulador 3D: Distancia Punto-Plano</h3>
        <p className="text-sm text-carbon/70">
          Arrastra con el ratón o con dos dedos sobre la caja para rotar la cámara 3D. 
          Observa el plano $\pi$ y el punto $P$. La línea discontinua es la proyección perpendicular sobre el plano.
        </p>
      </div>
      <div 
        ref={containerRef} 
        style={{ width: '100%', height: '400px' }} 
        className="jxgbox rounded border border-carbon/10"
      />
    </div>
  );
};
