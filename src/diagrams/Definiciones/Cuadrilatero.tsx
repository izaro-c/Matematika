import JXGBoard from '../../components/core/JXGBoard';
import { useMathStore } from '../../store/MathStoreContext';
import { Colors } from '../../utils/theme';

export const Cuadrilatero = () => {
  const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  const drawLogic = (board: any) => {
    const A = board.create('point', [-3, -2], { name: 'A', id: 'vertice-A', ...Colors.point, fixed: false });
    const B = board.create('point', [3, -2], { name: 'B', id: 'vertice-B', ...Colors.point, fixed: false });
    const C = board.create('point', [4, 3], { name: 'C', id: 'vertice-C', ...Colors.point, fixed: false });
    const D = board.create('point', [-2, 2], { name: 'D', id: 'vertice-D', ...Colors.point, fixed: false });

    const poly = board.create('polygon', [A, B, C, D], { 
      id: 'poligono', 
      borders: { ...Colors.line }, 
      fillColor: Colors.palette.primary, 
      fillOpacity: 0.1,
      vertices: { visible: false }
    });

    board.create('angle', [B, A, D], { id: 'angulo-A', name: '\\alpha', radius: 1, ...Colors.angle });
    board.create('angle', [C, B, A], { id: 'angulo-B', name: '\\beta', radius: 1, ...Colors.angle });
    board.create('angle', [D, C, B], { id: 'angulo-C', name: '\\gamma', radius: 1, ...Colors.angle });
    board.create('angle', [A, D, C], { id: 'angulo-D', name: '\\delta', radius: 1, ...Colors.angle });

    board.on('update', () => {
      const isVertice = isHighlight('vertices');
      const isLados = isHighlight('lados');
      const isAngulos = isHighlight('angulos');
      const isPoli = isHighlight('poligono');

      [A, B, C, D].forEach(p => p.setAttribute({ 
        visible: isVertice || !highlight,
        strokeColor: isVertice ? Colors.palette.primary : Colors.palette.text,
        fillColor: isVertice ? Colors.palette.primary : Colors.palette.text,
        size: isVertice ? 4 : 3
      }));

      poly.borders.forEach((b: any) => b.setAttribute({
        strokeColor: isLados ? Colors.palette.primary : Colors.palette.text,
        strokeWidth: isLados ? 3 : 2
      }));

      ['angulo-A', 'angulo-B', 'angulo-C', 'angulo-D'].forEach(id => {
        const ang = board.elementsByName[id] || board.elements[id];
        if (ang) {
            ang.setAttribute({
                visible: isAngulos || !highlight,
                fillColor: isAngulos ? Colors.palette.primary : Colors.palette.text,
                strokeColor: isAngulos ? Colors.palette.primary : Colors.palette.text
            });
        }
      });

      poly.setAttribute({
        fillOpacity: (isPoli || !highlight) ? 0.2 : 0.0
      });
    });
  };

  return <JXGBoard logic={drawLogic} bounds={[-5, 5, 5, -4]} />;
};
