
import JXGBoard from '../../components/core/JXGBoard';
import { useMathStore } from '../../store/MathStoreContext';

export const DemoSumaAngulos = () => {
    const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  const logic = (board: any) => {
    // Vértices del triángulo
    const A = board.create('point', [-3, -2], { name: 'A', size: 4, color: '#2563eb' });
    const B = board.create('point', [3, -2], { name: 'B', size: 4, color: '#2563eb' });
    const C = board.create('point', [1, 2], { name: 'C', size: 4, color: '#2563eb' });

    // Lados del triángulo
    const baseAB = board.create('segment', [A, B], { strokeColor: '#2563eb', strokeWidth: 2 });
    const ladoAC = board.create('segment', [A, C], { strokeColor: '#2563eb', strokeWidth: 2 });
    const ladoBC = board.create('segment', [B, C], { strokeColor: '#2563eb', strokeWidth: 2 });

    // Recta paralela a AB pasando por C
    const rectaAB = board.create('line', [A, B], { visible: false });
    const paralelaC = board.create('parallel', [rectaAB, C], { strokeColor: '#10b981', dash: 2, name: 'L', withLabel: true });

    // Puntos extendidos sobre la paralela para definir los ángulos alternos
    const P1 = board.create('glider', [-4, 2, paralelaC], { visible: false });
    const P2 = board.create('glider', [5, 2, paralelaC], { visible: false });

    // Ángulos interiores
    const angA = board.create('angle', [B, A, C], { name: 'α', color: '#f59e0b', radius: 1 });
    const angB = board.create('angle', [C, B, A], { name: 'β', color: '#ef4444', radius: 1 });
    const angC = board.create('angle', [A, C, B], { name: 'γ', color: '#8b5cf6', radius: 1 });

    // Ángulos alternos internos formados por la paralela
    const altA = board.create('angle', [P1, C, A], { name: "α'", color: '#f59e0b', radius: 1 });
    const altB = board.create('angle', [B, C, P2], { name: "β'", color: '#ef4444', radius: 1 });

    // Identificadores
    A.setAttribute({ id: 'vertice' });
    B.setAttribute({ id: 'vertice' });
    C.setAttribute({ id: 'vertice-c' });
    baseAB.setAttribute({ id: 'base-ab' });
    ladoAC.setAttribute({ id: 'transversal-ac' });
    ladoBC.setAttribute({ id: 'transversal-bc' });
    paralelaC.setAttribute({ id: 'paralela' });
    angA.setAttribute({ id: 'angulo-a' });
    angB.setAttribute({ id: 'angulo-b' });
    angC.setAttribute({ id: 'angulo-c' });
    altA.setAttribute({ id: 'alterno-a' });
    altB.setAttribute({ id: 'alterno-b' });

    board.on('update', () => {
      const hBase = isHighlight('base-ab');
      const hPar = isHighlight('paralela');
      const hTransAC = isHighlight('transversal-ac');
      const hTransBC = isHighlight('transversal-bc');

      baseAB.setAttribute({ strokeOpacity: hBase || isHighlight('triangulo') ? 1 : 0.3, strokeWidth: hBase ? 3 : 2 });
      ladoAC.setAttribute({ strokeOpacity: hTransAC || isHighlight('triangulo') ? 1 : 0.3, strokeWidth: hTransAC ? 3 : 2 });
      ladoBC.setAttribute({ strokeOpacity: hTransBC || isHighlight('triangulo') ? 1 : 0.3, strokeWidth: hTransBC ? 3 : 2 });
      
      paralelaC.setAttribute({ strokeOpacity: hPar ? 1 : (isHighlight('triangulo') ? 0.3 : 0) });

      const hAngA = isHighlight('angulo-a');
      const hAngB = isHighlight('angulo-b');
      const hAngC = isHighlight('angulo-c');
      const hAltA = isHighlight('alterno-a');
      const hAltB = isHighlight('alterno-b');
      const hLlano = isHighlight('angulo-llano');

      angA.setAttribute({ fillOpacity: hAngA || hLlano ? 0.6 : 0.2, strokeOpacity: hAngA || hLlano ? 1 : 0.3 });
      angB.setAttribute({ fillOpacity: hAngB || hLlano ? 0.6 : 0.2, strokeOpacity: hAngB || hLlano ? 1 : 0.3 });
      angC.setAttribute({ fillOpacity: hAngC || hLlano ? 0.6 : 0.2, strokeOpacity: hAngC || hLlano ? 1 : 0.3 });

      altA.setAttribute({ 
        fillOpacity: hAltA || hLlano ? 0.6 : 0, 
        strokeOpacity: hAltA || hLlano ? 1 : 0,
        visible: hAltA || hLlano
      });
      altB.setAttribute({ 
        fillOpacity: hAltB || hLlano ? 0.6 : 0, 
        strokeOpacity: hAltB || hLlano ? 1 : 0,
        visible: hAltB || hLlano
      });
    });
  };

  return <JXGBoard logic={logic} bounds={[-5, 4, 6, -3]} className="w-full aspect-square" />;
};
