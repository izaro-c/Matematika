
import JXGBoard from '../../components/core/JXGBoard';
import { useMathStore } from '../../store/MathStoreContext';

export const Perpendicular = () => {
    const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  const logic = (board: any) => {
    const A = board.create('point', [-3, -1], { name: 'A', visible: false });
    const B = board.create('point', [3, 1], { name: 'B', visible: false });
    const recta1 = board.create('line', [A, B], { strokeColor: '#1d4ed8', strokeWidth: 2, name: 'L1', withLabel: true });

    const C = board.create('point', [0, 0], { name: 'Punto Intersección', size: 4, color: '#000000' });
    const recta2 = board.create('perpendicular', [recta1, C], { strokeColor: '#b91c1c', strokeWidth: 2, name: 'L2', withLabel: true });

    // Puntos en las rectas para definir los angulos
    const P1 = board.create('glider', [2, 2/3, recta1], { visible: false });
    const P2 = board.create('glider', [-2, -2/3, recta1], { visible: false });
    const P3 = board.create('glider', [-1, 3, recta2], { visible: false });
    const P4 = board.create('glider', [1, -3, recta2], { visible: false });

    // Angulos
    const a1 = board.create('angle', [P1, C, P3], { name: '90°', color: '#10b981', radius: 1, type: 'sectordot' });
    const a2 = board.create('angle', [P3, C, P2], { name: '90°', color: '#10b981', radius: 1, type: 'sectordot' });
    const a3 = board.create('angle', [P2, C, P4], { name: '90°', color: '#10b981', radius: 1, type: 'sectordot' });
    const a4 = board.create('angle', [P4, C, P1], { name: '90°', color: '#10b981', radius: 1, type: 'sectordot' });

    // Ids
    recta1.setAttribute({ id: 'recta' });
    recta2.setAttribute({ id: 'perpendicular' });
    a1.setAttribute({ id: 'angulos-rectos' });
    a2.setAttribute({ id: 'angulos-rectos' });
    a3.setAttribute({ id: 'angulos-rectos' });
    a4.setAttribute({ id: 'angulos-rectos' });

    board.on('update', () => {
      const showRectas = isHighlight('recta') || isHighlight('perpendicular');
      recta1.setAttribute({ strokeOpacity: isHighlight('recta') || !showRectas ? 1 : 0.3 });
      recta2.setAttribute({ strokeOpacity: isHighlight('perpendicular') || !showRectas ? 1 : 0.3 });

      const showAngles = isHighlight('angulos-rectos');
      [a1, a2, a3, a4].forEach(a => {
        a.setAttribute({ 
          fillOpacity: showAngles ? 0.5 : 0.2, 
          strokeOpacity: showAngles ? 1 : 0.5 
        });
      });
    });
  };

  return <JXGBoard logic={logic} bounds={[-4, 4, 4, -4]} className="w-full aspect-square" />;
};
