
import JXGBoard from '../../components/core/JXGBoard';
import { useMathStore } from '../../store/MathStoreContext';

export const Triangulo = () => {
    const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  const logic = (board: any) => {
    // Definimos tres puntos libres
    const A = board.create('point', [-2, -2], { name: 'A', size: 4, color: '#3b82f6' });
    const B = board.create('point', [3, -1], { name: 'B', size: 4, color: '#3b82f6' });
    const C = board.create('point', [0, 3], { name: 'C', size: 4, color: '#3b82f6' });

    // Definimos el polígono (triángulo)
    const poly = board.create('polygon', [A, B, C], {
      fillColor: '#3b82f6',
      fillOpacity: 0.1,
      borders: { strokeWidth: 2, strokeColor: '#3b82f6' },
      vertices: { visible: false } // usamos los puntos explícitos
    });

    // Guardamos los IDs de los elementos
    A.setAttribute({ id: 'vertice-a' });
    B.setAttribute({ id: 'vertice-b' });
    C.setAttribute({ id: 'vertice-c' });
    poly.borders[0].setAttribute({ id: 'lado-ab' });
    poly.borders[1].setAttribute({ id: 'lado-bc' });
    poly.borders[2].setAttribute({ id: 'lado-ca' });
    poly.setAttribute({ id: 'triangulo' });

    // Actualización visual reactiva
    board.on('update', () => {
      // Si no hay nada resaltado, mostramos normal
      const opacity = (id: string) => isHighlight(id) ? 1 : (isHighlight('triangulo') ? 1 : 0.3);
      const strokeWidth = (id: string) => isHighlight(id) || isHighlight('triangulo') ? 3 : 2;

      A.setAttribute({ strokeOpacity: opacity('vertice-a'), fillOpacity: opacity('vertice-a') });
      B.setAttribute({ strokeOpacity: opacity('vertice-b'), fillOpacity: opacity('vertice-b') });
      C.setAttribute({ strokeOpacity: opacity('vertice-c'), fillOpacity: opacity('vertice-c') });
      
      poly.borders[0].setAttribute({ 
        strokeOpacity: opacity('lado-ab'), 
        strokeWidth: strokeWidth('lado-ab')
      });
      poly.borders[1].setAttribute({ 
        strokeOpacity: opacity('lado-bc'), 
        strokeWidth: strokeWidth('lado-bc') 
      });
      poly.borders[2].setAttribute({ 
        strokeOpacity: opacity('lado-ca'), 
        strokeWidth: strokeWidth('lado-ca') 
      });

      poly.setAttribute({
        fillOpacity: isHighlight('triangulo') ? 0.3 : 0.1
      });
    });
  };

  return <JXGBoard logic={logic} bounds={[-5, 5, 5, -5]} className="w-full aspect-square" />;
};
