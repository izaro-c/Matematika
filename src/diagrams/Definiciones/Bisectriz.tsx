
import JXGBoard from '../../components/core/JXGBoard';
import { useMathStore } from '../../store/MathStoreContext';

export const Bisectriz = () => {
    const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  const logic = (board: any) => {
    // Definimos el ángulo
    const A = board.create('point', [3, -1], { name: 'A', visible: false });
    const B = board.create('point', [0, 0], { name: 'Vértice', size: 4, color: '#f59e0b' });
    const C = board.create('point', [1, 3], { name: 'C', visible: false });

    // Lados del ángulo
    const lado1 = board.create('segment', [B, A], { strokeColor: '#f59e0b', strokeWidth: 2 });
    const lado2 = board.create('segment', [B, C], { strokeColor: '#f59e0b', strokeWidth: 2 });

    // Bisectriz
    const bisectriz = board.create('bisector', [A, B, C], { strokeColor: '#ec4899', strokeWidth: 2, name: 'Bisectriz', withLabel: true });

    // Punto auxiliar en la bisectriz para mostrar los ángulos
    const P = board.create('glider', [2, 1, bisectriz], { visible: false });

    // Ángulos resultantes
    const a1 = board.create('angle', [P, B, C], { name: 'α', color: '#ec4899', radius: 1 });
    const a2 = board.create('angle', [A, B, P], { name: 'α', color: '#ec4899', radius: 1.2 });

    // Identificadores
    B.setAttribute({ id: 'vertice' });
    lado1.setAttribute({ id: 'angulo' });
    lado2.setAttribute({ id: 'angulo' });
    bisectriz.setAttribute({ id: 'bisectriz' });
    a1.setAttribute({ id: 'angulos-congruentes' });
    a2.setAttribute({ id: 'angulos-congruentes' });

    board.on('update', () => {
      const hAngulo = isHighlight('angulo');
      const hBis = isHighlight('bisectriz');
      const hCong = isHighlight('angulos-congruentes');
      const hVert = isHighlight('vertice');
      const showAll = !hAngulo && !hBis && !hCong && !hVert;

      lado1.setAttribute({ strokeOpacity: hAngulo || showAll ? 1 : 0.3 });
      lado2.setAttribute({ strokeOpacity: hAngulo || showAll ? 1 : 0.3 });
      B.setAttribute({ strokeOpacity: hVert || showAll ? 1 : 0.3, fillOpacity: hVert || showAll ? 1 : 0.3 });
      bisectriz.setAttribute({ strokeOpacity: hBis || showAll ? 1 : 0.3, strokeWidth: hBis ? 3 : 2 });
      
      a1.setAttribute({ fillOpacity: hCong ? 0.5 : 0.2, strokeOpacity: hCong || showAll ? 1 : 0.3 });
      a2.setAttribute({ fillOpacity: hCong ? 0.5 : 0.2, strokeOpacity: hCong || showAll ? 1 : 0.3 });
    });
  };

  return <JXGBoard logic={logic} bounds={[-2, 4, 4, -2]} className="w-full aspect-square" />;
};
