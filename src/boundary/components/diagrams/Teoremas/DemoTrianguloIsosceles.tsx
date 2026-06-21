import JXGBoard from '@/boundary/components/core/JXGBoard';
import { useMathStore } from '@/boundary/contexts/MathStoreContext';
import { Colors } from '@/boundary/utils/theme';

export const DemoTrianguloIsosceles = () => {
  const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  const drawLogic = (board: any) => {
    // Create an isosceles triangle
    const B = board.create('point', [-3, -2], { name: 'B', id: 'vertice-B', ...Colors.point, fixed: true });
    const C = board.create('point', [3, -2], { name: 'C', id: 'vertice-C', ...Colors.point, fixed: true });
    const M = board.create('midpoint', [B, C], { visible: false });
    const perp = board.create('perpendicular', [board.create('line', [B, C], {visible: false}), M], { visible: false });
    
    // Point A constrained to the perpendicular bisector makes it isosceles
    const A = board.create('glider', [0, 4, perp], { name: 'A', id: 'vertice-A', ...Colors.point });

    const ladoAB = board.create('segment', [A, B], { id: 'lado-ab', ...Colors.line });
    const ladoAC = board.create('segment', [A, C], { id: 'lado-ac', ...Colors.line });
    const ladoBC = board.create('segment', [B, C], { id: 'lado-bc', ...Colors.line });

    const polyABC = board.create('polygon', [A, B, C], { id: 'triangulo-abc', borders: { visible: false }, fillColor: Colors.palette.primary, fillOpacity: 0.1, vertices: { visible: false } });

    // Bisectriz / Altura / Mediana are all the same line here
    const bisectriz = board.create('segment', [A, M], { id: 'bisectriz', dash: 2, ...Colors.line, strokeWidth: 1.5, visible: false });
    const puntoD = board.create('point', [()=>M.X(), ()=>M.Y()], { name: 'D', id: 'punto-d', ...Colors.point, size: 2, visible: false });

    // Angles
    const anguloBAD = board.create('angle', [M, A, B], { id: 'angulo-bad', name: '', radius: 1, ...Colors.angle, visible: false });
    const anguloCAD = board.create('angle', [C, A, M], { id: 'angulo-cad', name: '', radius: 1, ...Colors.angle, visible: false });

    const anguloB = board.create('angle', [C, B, A], { id: 'angulo-b', name: '\\beta', radius: 1, ...Colors.angle, visible: false });
    const anguloC = board.create('angle', [A, C, B], { id: 'angulo-c', name: '\\gamma', radius: 1, ...Colors.angle, visible: false });

    // Inner triangles
    const polyABD = board.create('polygon', [A, B, puntoD], { id: 'triangulo-izq', borders: { visible: false }, fillColor: Colors.palette.secondary, fillOpacity: 0.3, visible: false, vertices: { visible: false } });
    const polyACD = board.create('polygon', [A, C, puntoD], { id: 'triangulo-der', borders: { visible: false }, fillColor: Colors.palette.tertiary, fillOpacity: 0.3, visible: false, vertices: { visible: false } });

    board.on('update', () => {
      const isTriangulo = isHighlight('triangulo-abc');
      const isLadoAB = isHighlight('lado-ab');
      const isLadoAC = isHighlight('lado-ac');
      const isLadoBC = isHighlight('lado-bc');
      const isBisectriz = isHighlight('bisectriz');
      const isPuntoD = isHighlight('punto-d');
      const isAnguloBAD = isHighlight('angulo-bad');
      const isAnguloCAD = isHighlight('angulo-cad');
      const isLadoAD = isHighlight('lado-ad');
      const isTriIzq = isHighlight('triangulo-izq');
      const isTriDer = isHighlight('triangulo-der');
      const isAngB = isHighlight('angulo-b');
      const isAngC = isHighlight('angulo-c');

      polyABC.setAttribute({ fillOpacity: isTriangulo ? 0.3 : (highlight ? 0.0 : 0.1) });
      
      ladoAB.setAttribute({ strokeColor: isLadoAB ? Colors.palette.primary : Colors.palette.text, strokeWidth: isLadoAB ? 3 : 2 });
      ladoAC.setAttribute({ strokeColor: isLadoAC ? Colors.palette.primary : Colors.palette.text, strokeWidth: isLadoAC ? 3 : 2 });
      ladoBC.setAttribute({ strokeColor: isLadoBC ? Colors.palette.primary : Colors.palette.text, strokeWidth: isLadoBC ? 3 : 2 });

      bisectriz.setAttribute({ visible: isBisectriz || isLadoAD || isTriIzq || isTriDer || isAnguloBAD || isAnguloCAD || isPuntoD || isAngB });
      bisectriz.setAttribute({ strokeColor: isLadoAD ? Colors.palette.primary : Colors.palette.text, strokeWidth: isLadoAD ? 3 : 1.5 });
      
      puntoD.setAttribute({ visible: isPuntoD || isBisectriz || isTriIzq || isTriDer || isLadoAD || isAnguloBAD || isAnguloCAD || isAngB });
      
      anguloBAD.setAttribute({ visible: isAnguloBAD });
      anguloCAD.setAttribute({ visible: isAnguloCAD });
      
      polyABD.setAttribute({ visible: isTriIzq });
      polyACD.setAttribute({ visible: isTriDer });

      anguloB.setAttribute({ visible: isAngB });
      anguloC.setAttribute({ visible: isAngC });
    });
  };

  return <JXGBoard logic={drawLogic} bounds={[-5, 6, 5, -3]} />;
};
