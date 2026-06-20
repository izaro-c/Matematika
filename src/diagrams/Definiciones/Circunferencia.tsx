
import JXGBoard from '../../components/core/JXGBoard';
import { useMathStore } from '../../store/MathStoreContext';

export const Circunferencia = () => {
    const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  const logic = (board: any) => {
    // Definimos el centro
    const O = board.create('point', [0, 0], { name: 'O (Centro)', size: 4, color: '#10b981' });
    // Definimos un punto libre en la circunferencia
    const P = board.create('point', [3, 0], { name: 'P', size: 4, color: '#10b981' });

    // Definimos la circunferencia
    const circ = board.create('circle', [O, P], {
      strokeColor: '#10b981',
      strokeWidth: 2,
      fillColor: '#10b981',
      fillOpacity: 0.1,
    });

    // Segmento radio OP
    const radio = board.create('segment', [O, P], {
      strokeColor: '#10b981',
      strokeWidth: 2,
      dash: 2,
      name: 'Radio',
      withLabel: true,
    });

    // Guardamos los IDs de los elementos
    O.setAttribute({ id: 'centro' });
    P.setAttribute({ id: 'punto-periferia' });
    circ.setAttribute({ id: 'circunferencia' });
    radio.setAttribute({ id: 'radio' });

    // Actualización visual reactiva
    board.on('update', () => {
      const opacity = (id: string) => isHighlight(id) ? 1 : (isHighlight('circunferencia') ? 1 : 0.3);
      const strokeWidth = (id: string) => isHighlight(id) || isHighlight('circunferencia') ? 3 : 2;

      O.setAttribute({ strokeOpacity: opacity('centro'), fillOpacity: opacity('centro') });
      P.setAttribute({ strokeOpacity: opacity('punto-periferia'), fillOpacity: opacity('punto-periferia') });
      
      radio.setAttribute({ 
        strokeOpacity: opacity('radio'), 
        strokeWidth: strokeWidth('radio')
      });

      circ.setAttribute({
        strokeOpacity: opacity('circunferencia'),
        strokeWidth: strokeWidth('circunferencia'),
        fillOpacity: isHighlight('circunferencia') ? 0.2 : 0.05
      });
    });
  };

  return <JXGBoard logic={logic} bounds={[-5, 5, 5, -5]} className="w-full aspect-square" />;
};
