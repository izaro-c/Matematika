
import JXGBoard from '../../components/core/JXGBoard';
import { useMathStore } from '../../store/MathStoreContext';

export const Mediatriz = () => {
    const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  const logic = (board: any) => {
    // Extremos del segmento
    const A = board.create('point', [-3, -1], { name: 'A', size: 4, color: '#f59e0b' });
    const B = board.create('point', [3, 1], { name: 'B', size: 4, color: '#f59e0b' });

    // Segmento original
    const segmento = board.create('segment', [A, B], {
      strokeColor: '#f59e0b', strokeWidth: 2
    });

    // Punto medio
    const M = board.create('midpoint', [A, B], { name: 'M (Punto Medio)', size: 4, color: '#ef4444' });

    // La mediatriz
    const mediatriz = board.create('perpendicular', [segmento, M], {
      strokeColor: '#ef4444', strokeWidth: 2, name: 'Mediatriz', withLabel: true
    });

    // Punto libre sobre la mediatriz para mostrar equidistancia
    const P = board.create('glider', [0, 3, mediatriz], { name: 'P', size: 4, color: '#8b5cf6' });

    // Distancias desde P a los extremos
    const distPA = board.create('segment', [P, A], { strokeColor: '#8b5cf6', dash: 2 });
    const distPB = board.create('segment', [P, B], { strokeColor: '#8b5cf6', dash: 2 });

    // IDs
    A.setAttribute({ id: 'extremo' });
    B.setAttribute({ id: 'extremo' });
    segmento.setAttribute({ id: 'segmento' });
    M.setAttribute({ id: 'punto-medio' });
    mediatriz.setAttribute({ id: 'mediatriz' });
    P.setAttribute({ id: 'punto-p' });
    distPA.setAttribute({ id: 'equidistancia' });
    distPB.setAttribute({ id: 'equidistancia' });

    // Update
    board.on('update', () => {
      const isEq = isHighlight('equidistancia') || isHighlight('punto-p');
      distPA.setAttribute({ strokeOpacity: isEq ? 1 : 0.2, strokeWidth: isEq ? 3 : 1 });
      distPB.setAttribute({ strokeOpacity: isEq ? 1 : 0.2, strokeWidth: isEq ? 3 : 1 });
      P.setAttribute({ strokeOpacity: isEq ? 1 : 0.3, fillOpacity: isEq ? 1 : 0.3 });

      const isMed = isHighlight('mediatriz');
      mediatriz.setAttribute({ strokeOpacity: isMed || isHighlight('punto-p') ? 1 : 0.3, strokeWidth: isMed ? 3 : 2 });
      
      const isSeg = isHighlight('segmento');
      segmento.setAttribute({ strokeOpacity: isSeg ? 1 : 0.3, strokeWidth: isSeg ? 3 : 2 });
      
      const isMid = isHighlight('punto-medio');
      M.setAttribute({ strokeOpacity: isMid || isMed ? 1 : 0.3, fillOpacity: isMid || isMed ? 1 : 0.3 });
    });
  };

  return <JXGBoard logic={logic} bounds={[-5, 5, 5, -5]} className="w-full aspect-square" />;
};
