
import JXGBoard from '../../components/core/JXGBoard';
import { useMathStore } from '../../store/MathStoreContext';

export const Altura = () => {
    const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  const logic = (board: any) => {
    const A = board.create('point', [-2, -2], { name: 'A', size: 4, color: '#0ea5e9' });
    const B = board.create('point', [3, -1], { name: 'B', size: 4, color: '#0ea5e9' });
    const C = board.create('point', [0, 3], { name: 'Vértice', size: 4, color: '#0ea5e9' });

    const poly = board.create('polygon', [A, B, C], {
      fillColor: '#0ea5e9', fillOpacity: 0.1, borders: { strokeWidth: 2, strokeColor: '#0ea5e9' }
    });

    const baseAB = board.create('line', [A, B], { visible: false });

    // Altura desde C al lado AB
    const H = board.create('intersection', [
      baseAB, board.create('perpendicular', [baseAB, C], { visible: false }), 0
    ], { name: 'H', size: 3, color: '#ef4444' });

    const alturaSegment = board.create('segment', [C, H], { strokeColor: '#ef4444', strokeWidth: 2, dash: 2 });

    // Angulo recto en la base
    const pOnBase = board.create('point', [() => B.X(), () => B.Y()], { visible: false });
    const angRecto = board.create('angle', [C, H, pOnBase], { radius: 1, type: 'sectordot', color: '#10b981' });

    A.setAttribute({ id: 'vertice' });
    B.setAttribute({ id: 'vertice' });
    C.setAttribute({ id: 'vertice-opuesto' });
    poly.borders[0].setAttribute({ id: 'lado-opuesto' });
    alturaSegment.setAttribute({ id: 'altura' });
    H.setAttribute({ id: 'pie' });
    angRecto.setAttribute({ id: 'ortogonal' });

    board.on('update', () => {
      const hVert = isHighlight('vertice-opuesto');
      const hLado = isHighlight('lado-opuesto');
      const hAlt = isHighlight('altura');
      const hOrt = isHighlight('ortogonal');
      const showAll = !hVert && !hLado && !hAlt && !hOrt;

      C.setAttribute({ strokeOpacity: hVert || showAll ? 1 : 0.3, fillOpacity: hVert || showAll ? 1 : 0.3 });
      poly.borders[0].setAttribute({ strokeOpacity: hLado || showAll ? 1 : 0.3, strokeWidth: hLado ? 4 : 2 });
      alturaSegment.setAttribute({ strokeOpacity: hAlt || showAll ? 1 : 0.3, strokeWidth: hAlt ? 4 : 2 });
      
      angRecto.setAttribute({ 
        strokeOpacity: hOrt || showAll || hAlt ? 1 : 0.2, 
        fillOpacity: hOrt ? 0.5 : 0.2 
      });
      H.setAttribute({ strokeOpacity: hOrt || hAlt || showAll ? 1 : 0.3, fillOpacity: hOrt || hAlt || showAll ? 1 : 0.3 });
    });
  };

  return <JXGBoard logic={logic} bounds={[-4, 4, 4, -4]} className="w-full aspect-square" />;
};
