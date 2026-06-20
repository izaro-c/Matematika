
import JXGBoard from '../../components/core/JXGBoard';
import { useMathStore } from '../../store/MathStoreContext';

export const Paralelas = () => {
    const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  const logic = (board: any) => {
    // Definimos la primera recta
    const A = board.create('point', [-3, -2], { name: 'A', visible: false });
    const B = board.create('point', [3, -1], { name: 'B', visible: false });
    const recta1 = board.create('line', [A, B], { strokeColor: '#059669', strokeWidth: 2, name: 'L1', withLabel: true });

    // Definimos un punto libre para la paralela
    const C = board.create('point', [-2, 2], { name: 'P', size: 4, color: '#059669' });

    // Definimos la recta paralela
    const paralela = board.create('parallel', [recta1, C], { strokeColor: '#10b981', strokeWidth: 2, name: 'L2', withLabel: true });

    // Identificadores para VisualBind
    recta1.setAttribute({ id: 'recta-base' });
    C.setAttribute({ id: 'punto-p' });
    paralela.setAttribute({ id: 'recta-paralela' });

    // Actualización visual reactiva
    board.on('update', () => {
      const hBase = isHighlight('recta-base');
      const hPar = isHighlight('recta-paralela');
      const hP = isHighlight('punto-p');
      const showAll = !hBase && !hPar && !hP;

      recta1.setAttribute({ strokeOpacity: hBase || showAll ? 1 : 0.3, strokeWidth: hBase ? 3 : 2 });
      paralela.setAttribute({ strokeOpacity: hPar || showAll ? 1 : 0.3, strokeWidth: hPar ? 3 : 2 });
      C.setAttribute({ strokeOpacity: hP || showAll ? 1 : 0.3, fillOpacity: hP || showAll ? 1 : 0.3 });
    });
  };

  return <JXGBoard logic={logic} bounds={[-4, 4, 4, -4]} className="w-full aspect-square" />;
};
