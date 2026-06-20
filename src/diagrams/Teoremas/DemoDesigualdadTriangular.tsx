
import JXGBoard from '../../components/core/JXGBoard';
import { useMathStore } from '../../store/MathStoreContext';

export const DemoDesigualdadTriangular = () => {
    const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  const logic = (board: any) => {
    // Vértices del triángulo
    const A = board.create('point', [-2, -1], { name: 'A', size: 4, color: '#3b82f6' });
    const B = board.create('point', [3, -2], { name: 'B', size: 4, color: '#3b82f6' });
    const C = board.create('point', [0, 3], { name: 'C', size: 4, color: '#3b82f6' });

    // Lados originales
    const ladoAB = board.create('segment', [A, B], { strokeColor: '#3b82f6', strokeWidth: 2, name: 'c', withLabel: true });
    const ladoBC = board.create('segment', [B, C], { strokeColor: '#3b82f6', strokeWidth: 2, name: 'a', withLabel: true });
    const ladoAC = board.create('segment', [A, C], { strokeColor: '#3b82f6', strokeWidth: 2, name: 'b', withLabel: true });

    // Prolongación de AC más allá de C hasta D tal que CD = BC (a)
    // Para ello creamos un círculo con centro en C y radio BC.
    const circC = board.create('circle', [C, B], { visible: false });
    const rectaAC = board.create('line', [A, C], { visible: false });
    
    // Intersección de recta AC y círculo C. Elegimos la que está "más allá" de C
    const intersections = board.create('intersection', [rectaAC, circC, 0], { visible: false });
    const D = board.create('point', [() => intersections.X(), () => intersections.Y()], { name: 'D', size: 4, color: '#ec4899', visible: false });

    // Segmentos auxiliares
    const ladoCD = board.create('segment', [C, D], { strokeColor: '#ec4899', dash: 2, strokeWidth: 2, visible: false, name: 'a', withLabel: true });
    const ladoBD = board.create('segment', [B, D], { strokeColor: '#10b981', dash: 2, strokeWidth: 2, visible: false });

    // Ángulos
    const angCBD = board.create('angle', [C, B, D], { name: 'α', color: '#f59e0b', radius: 1, visible: false });
    const angCDB = board.create('angle', [C, D, B], { name: 'α', color: '#f59e0b', radius: 1, visible: false });
    const angABD = board.create('angle', [A, B, D], { name: 'β', color: '#8b5cf6', radius: 1.5, visible: false });

    // Atributos para interactividad
    A.setAttribute({ id: 'vertice-a' });
    B.setAttribute({ id: 'vertice-b' });
    C.setAttribute({ id: 'vertice-c' });
    D.setAttribute({ id: 'punto-d' });
    ladoAB.setAttribute({ id: 'lado-ab' });
    ladoBC.setAttribute({ id: 'lado-bc' });
    ladoAC.setAttribute({ id: 'lado-ac' });
    ladoCD.setAttribute({ id: 'lado-cd' });
    ladoBD.setAttribute({ id: 'lado-bd' });
    angCBD.setAttribute({ id: 'angulo-cbd' });
    angCDB.setAttribute({ id: 'angulo-cdb' });
    angABD.setAttribute({ id: 'angulo-abd' });

    board.on('update', () => {
      const hD = isHighlight('punto-d') || isHighlight('triangulo-isosceles') || isHighlight('lado-bd') || isHighlight('lado-cd');
      D.setAttribute({ visible: hD });
      ladoCD.setAttribute({ visible: hD, strokeOpacity: isHighlight('lado-cd') || isHighlight('triangulo-isosceles') ? 1 : 0.4 });
      ladoBD.setAttribute({ visible: hD, strokeOpacity: isHighlight('lado-bd') || isHighlight('triangulo-isosceles') ? 1 : 0.4 });

      const showOrig = !isHighlight('triangulo-isosceles');
      ladoAB.setAttribute({ strokeOpacity: isHighlight('lado-ab') || showOrig ? 1 : 0.3, strokeWidth: isHighlight('lado-ab') ? 3 : 2 });
      ladoBC.setAttribute({ strokeOpacity: isHighlight('lado-bc') || showOrig ? 1 : 0.3, strokeWidth: isHighlight('lado-bc') ? 3 : 2 });
      ladoAC.setAttribute({ strokeOpacity: isHighlight('lado-ac') || showOrig ? 1 : 0.3, strokeWidth: isHighlight('lado-ac') ? 3 : 2 });

      const hIsoAngles = isHighlight('angulo-cbd') || isHighlight('angulo-cdb') || isHighlight('triangulo-isosceles');
      angCBD.setAttribute({ visible: hIsoAngles, fillOpacity: 0.5, strokeOpacity: 1 });
      angCDB.setAttribute({ visible: hIsoAngles, fillOpacity: 0.5, strokeOpacity: 1 });

      const hAbd = isHighlight('angulo-abd');
      angABD.setAttribute({ visible: hAbd, fillOpacity: 0.3, strokeOpacity: 1 });
    });
  };

  return <JXGBoard logic={logic} bounds={[-6, 6, 6, -4]} className="w-full aspect-square" />;
};
