
import JXGBoard from '../../components/core/JXGBoard';
import { useMathStore } from '../../store/MathStoreContext';

export const Mediana = () => {
    const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  const logic = (board: any) => {
    // Vértices del triángulo
    const A = board.create('point', [-2, -2], { name: 'A', size: 4, color: '#2563eb' });
    const B = board.create('point', [3, -1], { name: 'B', size: 4, color: '#2563eb' });
    const C = board.create('point', [0, 3], { name: 'C', size: 4, color: '#2563eb' });

    // Lados
    const ladoAB = board.create('segment', [A, B], { strokeColor: '#2563eb' });
    const ladoBC = board.create('segment', [B, C], { strokeColor: '#2563eb' });
    const ladoCA = board.create('segment', [C, A], { strokeColor: '#2563eb' });

    // Puntos medios
    const M_AB = board.create('midpoint', [A, B], { name: 'M_c', size: 3, color: '#d97706' });
    const M_BC = board.create('midpoint', [B, C], { name: 'M_a', size: 3, color: '#d97706' });
    const M_CA = board.create('midpoint', [C, A], { name: 'M_b', size: 3, color: '#d97706' });

    // Medianas
    const medA = board.create('segment', [A, M_BC], { strokeColor: '#d97706', strokeWidth: 2, dash: 2 });
    const medB = board.create('segment', [B, M_CA], { strokeColor: '#d97706', strokeWidth: 2, dash: 2 });
    const medC = board.create('segment', [C, M_AB], { strokeColor: '#d97706', strokeWidth: 2, dash: 2 });

    // Baricentro
    const baricentro = board.create('intersection', [medA, medB, 0], { name: 'Baricentro (G)', size: 5, color: '#dc2626' });

    // Identificadores
    A.setAttribute({ id: 'vertice' });
    B.setAttribute({ id: 'vertice' });
    C.setAttribute({ id: 'vertice' });
    ladoAB.setAttribute({ id: 'lado' });
    ladoBC.setAttribute({ id: 'lado' });
    ladoCA.setAttribute({ id: 'lado' });
    M_AB.setAttribute({ id: 'punto-medio' });
    M_BC.setAttribute({ id: 'punto-medio' });
    M_CA.setAttribute({ id: 'punto-medio' });
    medA.setAttribute({ id: 'mediana' });
    medB.setAttribute({ id: 'mediana' });
    medC.setAttribute({ id: 'mediana' });
    baricentro.setAttribute({ id: 'baricentro' });

    board.on('update', () => {
      const hVertice = isHighlight('vertice');
      const hMedio = isHighlight('punto-medio');
      const hMediana = isHighlight('mediana');
      const hBaricentro = isHighlight('baricentro');
      const hLado = isHighlight('lado');
      const showAll = !hVertice && !hMedio && !hMediana && !hBaricentro && !hLado;

      [A, B, C].forEach(v => {
        v.setAttribute({ strokeOpacity: hVertice || showAll ? 1 : 0.3, fillOpacity: hVertice || showAll ? 1 : 0.3 });
      });

      [M_AB, M_BC, M_CA].forEach(m => {
        m.setAttribute({ strokeOpacity: hMedio || showAll || hMediana ? 1 : 0.2, fillOpacity: hMedio || showAll || hMediana ? 1 : 0.2 });
      });

      [ladoAB, ladoBC, ladoCA].forEach(l => {
        l.setAttribute({ strokeOpacity: hLado || showAll ? 1 : 0.2 });
      });

      [medA, medB, medC].forEach(m => {
        m.setAttribute({ strokeOpacity: hMediana || showAll || hBaricentro ? 1 : 0.2, strokeWidth: hMediana ? 3 : 2 });
      });

      baricentro.setAttribute({ 
        strokeOpacity: hBaricentro || showAll ? 1 : 0.2, 
        fillOpacity: hBaricentro || showAll ? 1 : 0.2 
      });
    });
  };

  return <JXGBoard logic={logic} bounds={[-4, 4, 4, -4]} className="w-full aspect-square" />;
};
