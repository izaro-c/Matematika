import JXGBoard from '../../components/core/JXGBoard';
import { useMathStore } from '../../store/MathStoreContext';
import { Colors } from '../../utils/theme';

export const DemoTales = () => {
  const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  const drawLogic = (board: any) => {
    const A = board.create('point', [0, 4], { name: 'A', id: 'vertice-A', ...Colors.point });
    const B = board.create('point', [-3, -2], { name: 'B', id: 'vertice-B', ...Colors.point });
    const C = board.create('point', [4, -2], { name: 'C', id: 'vertice-C', ...Colors.point });

    const polyABC = board.create('polygon', [A, B, C], { id: 'triangulo-abc', borders: { ...Colors.line }, fillColor: Colors.palette.primary, fillOpacity: 0.05, vertices: { visible: false } });

    // Let's create D on AB and E on AC such that DE is parallel to BC.
    // Easiest is to make a glider on AB and draw a parallel to BC.
    const segmentAB = board.elements[polyABC.borders[0].id];
    const D = board.create('glider', [-1.5, 1, segmentAB], { name: 'D', id: 'punto-d', ...Colors.point });

    const lineBC = board.create('line', [B, C], { visible: false });
    const lineDE_inf = board.create('parallel', [lineBC, D], { visible: false });
    
    // Find E
    const lineAC = board.create('line', [A, C], { visible: false });
    const E = board.create('intersection', [lineDE_inf, lineAC, 0], { name: 'E', id: 'punto-e', ...Colors.point });
    
    const segmentDE = board.create('segment', [D, E], { id: 'recta-de', ...Colors.line, strokeWidth: 2 });

    // Inner triangles ADE, BDE, CDE
    const polyADE = board.create('polygon', [A, D, E], { id: 'triangulo-ade', borders: { visible: false }, fillColor: Colors.palette.secondary, fillOpacity: 0.3, visible: false, vertices: { visible: false } });
    const polyBDE = board.create('polygon', [B, D, E], { id: 'triangulo-bde', borders: { visible: false }, fillColor: Colors.palette.tertiary, fillOpacity: 0.3, visible: false, vertices: { visible: false } });
    const polyCDE = board.create('polygon', [C, D, E], { id: 'triangulo-cde', borders: { visible: false }, fillColor: Colors.palette.primary, fillOpacity: 0.3, visible: false, vertices: { visible: false } });

    // Crossed lines BE and CD
    const lineBE = board.create('segment', [B, E], { dash: 2, ...Colors.line, strokeWidth: 1, visible: false });
    const lineCD = board.create('segment', [C, D], { dash: 2, ...Colors.line, strokeWidth: 1, visible: false });

    // Heights
    const lineAB = board.create('line', [A, B], { visible: false });
    const h1 = board.create('perpendicular', [lineAB, E], { visible: false });
    const h1_int = board.create('intersection', [h1, lineAB, 0], { visible: false });
    const seg_h1 = board.create('segment', [E, h1_int], { id: 'altura-h1', dash: 1, strokeColor: Colors.palette.secondary, visible: false });

    const h2 = board.create('perpendicular', [lineAC, D], { visible: false });
    const h2_int = board.create('intersection', [h2, lineAC, 0], { visible: false });
    const seg_h2 = board.create('segment', [D, h2_int], { id: 'altura-h2', dash: 1, strokeColor: Colors.palette.primary, visible: false });

    // Proporcion text
    const propText = board.create('text', [0, 5, 'AD / DB = AE / EC'], { id: 'proporcion', fontSize: 16, visible: false, strokeColor: Colors.palette.text, anchorX: 'middle' });

    board.on('update', () => {
      const isABC = isHighlight('triangulo-abc');
      const isDE = isHighlight('recta-de');
      const isADE = isHighlight('triangulo-ade');
      const isBDE = isHighlight('triangulo-bde');
      const isCDE = isHighlight('triangulo-cde');
      const isH1 = isHighlight('altura-h1');
      const isH2 = isHighlight('altura-h2');
      const isProp = isHighlight('proporcion');

      polyABC.setAttribute({ fillOpacity: isABC ? 0.3 : (highlight ? 0.0 : 0.05) });
      segmentDE.setAttribute({ strokeColor: isDE ? Colors.palette.primary : Colors.palette.text, strokeWidth: isDE ? 3 : 2 });
      
      polyADE.setAttribute({ visible: isADE });
      polyBDE.setAttribute({ visible: isBDE });
      polyCDE.setAttribute({ visible: isCDE });

      lineBE.setAttribute({ visible: isBDE || isADE });
      lineCD.setAttribute({ visible: isCDE || isADE });

      seg_h1.setAttribute({ visible: isH1 });
      seg_h2.setAttribute({ visible: isH2 });

      propText.setAttribute({ visible: isProp });
    });
  };

  return <JXGBoard logic={drawLogic} bounds={[-6, 6, 6, -3]} />;
};
