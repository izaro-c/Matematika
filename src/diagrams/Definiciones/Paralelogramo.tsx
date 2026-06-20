import JXGBoard from '../../components/core/JXGBoard';
import { useMathStore } from '../../store/MathStoreContext';
import { Colors } from '../../utils/theme';

export const Paralelogramo = () => {
  const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  const drawLogic = (board: any) => {
    const A = board.create('point', [-3, -2], { name: 'A', id: 'vertice-A', ...Colors.point, fixed: false });
    const B = board.create('point', [2, -2], { name: 'B', id: 'vertice-B', ...Colors.point, fixed: false });
    const C = board.create('point', [4, 2], { name: 'C', id: 'vertice-C', ...Colors.point, fixed: false });
    
    // To make a parallelogram, D is C + (A - B) -> A + (C - B). Or intersection of parallel lines
    const lineAB = board.create('line', [A, B], { visible: false });
    const lineBC = board.create('line', [B, C], { visible: false });
    const parCD = board.create('parallel', [lineAB, C], { visible: false });
    const parAD = board.create('parallel', [lineBC, A], { visible: false });
    
    const D = board.create('intersection', [parCD, parAD, 0], { name: 'D', id: 'vertice-D', ...Colors.point });

    const poly = board.create('polygon', [A, B, C, D], { 
      id: 'paralelogramo', 
      borders: { ...Colors.line }, 
      fillColor: Colors.palette.primary, 
      fillOpacity: 0.1,
      vertices: { visible: false }
    });

    const diagAC = board.create('segment', [A, C], { dash: 2, ...Colors.line, strokeWidth: 1, visible: false });
    const diagBD = board.create('segment', [B, D], { dash: 2, ...Colors.line, strokeWidth: 1, visible: false });
    const center = board.create('intersection', [diagAC, diagBD, 0], { name: 'M', ...Colors.point, size: 2, visible: false });

    board.create('angle', [B, A, D], { id: 'angulo-A', name: '\\alpha', radius: 1, ...Colors.angle, visible: false });
    board.create('angle', [D, C, B], { id: 'angulo-C', name: '\\alpha', radius: 1, ...Colors.angle, visible: false });
    board.create('angle', [C, B, A], { id: 'angulo-B', name: '\\beta', radius: 0.8, ...Colors.angle, visible: false });
    board.create('angle', [A, D, C], { id: 'angulo-D', name: '\\beta', radius: 0.8, ...Colors.angle, visible: false });

    board.on('update', () => {
      const isPara = isHighlight('paralelogramo');
      const isLados = isHighlight('lados-opuestos');
      const isAngulos = isHighlight('angulos-opuestos');
      const isDiagonales = isHighlight('diagonales');

      poly.borders.forEach((b: any) => {
        b.setAttribute({
            strokeColor: isLados ? Colors.palette.primary : Colors.palette.text,
            strokeWidth: isLados ? 3 : 2
        });
      });

      ['angulo-A', 'angulo-B', 'angulo-C', 'angulo-D'].forEach(id => {
        const ang = board.elementsByName[id] || board.elements[id];
        if (ang) {
            ang.setAttribute({
                visible: isAngulos,
            });
        }
      });

      diagAC.setAttribute({ visible: isDiagonales });
      diagBD.setAttribute({ visible: isDiagonales });
      center.setAttribute({ visible: isDiagonales });

      poly.setAttribute({
        fillOpacity: (isPara || !highlight) ? 0.2 : 0.0
      });
    });
  };

  return <JXGBoard logic={drawLogic} bounds={[-5, 5, 6, -4]} />;
};
