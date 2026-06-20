
import JXGBoard from '../../components/core/JXGBoard';
import { useMathStore } from '../../store/MathStoreContext';

export const DemoPitagorasEuclides = () => {
    const highlight = useMathStore((state) => state.variables['highlight']);
  const isHighlight = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;

  const logic = (board: any) => {
    // Vértices del triángulo rectángulo (C es el ángulo recto)
    const C = board.create('point', [0, 0], { name: 'C', size: 4, color: '#0ea5e9' });
    const A = board.create('point', [0, 3], { name: 'A', size: 4, color: '#0ea5e9' });
    const B = board.create('point', [4, 0], { name: 'B', size: 4, color: '#0ea5e9' });

    // Lados del triángulo (catetos a, b e hipotenusa c)
    board.create('polygon', [A, B, C], { fillColor: '#0ea5e9', fillOpacity: 0.1 });
    
    // Función auxiliar para crear cuadrados sobre lados
    const createSquare = (p1: any, p2: any, color: string, id: string) => {
        const sq = board.create('regularpolygon', [p1, p2, 4], {
            fillColor: color, fillOpacity: 0.1, borders: { strokeColor: color, strokeWidth: 2 }
        });
        sq.setAttribute({ id: id });
        sq.borders.forEach((b: any) => b.setAttribute({ id: id }));
        return sq;
    };

    // Cuadrados sobre los catetos
    const sqb = createSquare(C, A, '#ef4444', 'cuadrado-b'); // Sobre AC (lado b)
    const sqa = createSquare(B, C, '#f59e0b', 'cuadrado-a'); // Sobre BC (lado a)
    // Cuadrado sobre la hipotenusa
    const sqc = createSquare(A, B, '#10b981', 'cuadrado-c'); // Sobre AB (lado c)

    // Altura desde C hacia AB
    const lineAB = board.create('line', [A, B], { visible: false });
    const perpC = board.create('perpendicular', [lineAB, C], { visible: false });
    const intAB = board.create('intersection', [lineAB, perpC, 0], { visible: false });
    // Prolongamos la altura para dividir el cuadrado c
    const pOpposite = board.create('point', [
        () => intAB.X() + (intAB.X() - C.X()) * 2,
        () => intAB.Y() + (intAB.Y() - C.Y()) * 2
    ], { visible: false });
    const splitLine = board.create('segment', [C, pOpposite], { strokeColor: '#8b5cf6', dash: 2, strokeWidth: 2 });

    // Ids generales
    A.setAttribute({ id: 'vertice' });
    B.setAttribute({ id: 'vertice' });
    C.setAttribute({ id: 'vertice' });
    splitLine.setAttribute({ id: 'altura-c' });

    board.on('update', () => {
      const showAll = !isHighlight('cuadrado-a') && !isHighlight('cuadrado-b') && !isHighlight('cuadrado-c');
      
      const setSq = (sq: any, id: string) => {
          const h = isHighlight(id);
          sq.setAttribute({ fillOpacity: h || showAll ? 0.3 : 0.05 });
          sq.borders.forEach((b: any) => b.setAttribute({ strokeOpacity: h || showAll ? 1 : 0.2 }));
      };

      setSq(sqa, 'cuadrado-a');
      setSq(sqb, 'cuadrado-b');
      setSq(sqc, 'cuadrado-c');

      const hAlt = isHighlight('altura-c');
      splitLine.setAttribute({ visible: hAlt || showAll, strokeOpacity: hAlt ? 1 : 0.3 });
    });
  };

  return <JXGBoard logic={logic} bounds={[-4, 7, 8, -5]} className="w-full aspect-square" />;
};
