import { useMathStore } from '@/app/providers/MathStoreContext';
import { useStepBinding } from '@/shared/ui/StepBinding';
import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine, createSegment, createGlider, createPolygon
} from '@/shared/diagrams/core/MathFactory';






export const DemoTales = () => {



  const mathHL = useMathStore(s => s.variables?.['highlight']);
  const { activeStep } = useStepBinding();
  const highlight = mathHL || activeStep;
  const isHL = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;
  void highlight;
  void isHL;

  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const C_PRIM = theme.carbon;
    const C_ACC  = theme.terracota;
    const C_PAR  = theme.salvia;
    const C_H    = theme.ocre;

    const A = createPoint(board, [-3, -2], { name: 'A', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 }, theme);
    const B = createPoint(board, [3, -2], { name: 'B', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 }, theme);
    const C = createPoint(board, [4, 3], { name: 'C', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 }, theme);

    createSegment(board, [A, B], { strokeColor: C_PRIM, strokeWidth: 2.5 }, theme);
    createSegment(board, [B, C], { strokeColor: C_PRIM, strokeWidth: 2.5 }, theme);
    createSegment(board, [C, A], { strokeColor: C_PRIM, strokeWidth: 2.5 }, theme);
    const polyABC = createPolygon(board, [A, B, C], { fillColor: C_PRIM, fillOpacity: 0.06, borders: { visible: false }, vertices: { visible: false } }, theme);

    const segAB = createSegment(board, [A, B], { visible: false }, theme);
    const D = createGlider(board, [-1, -2, segAB], { name: 'D', size: 4, fillColor: C_ACC, strokeColor: C_ACC, showInfobox: false }, theme);

    const lineBC = createLine(board, [B, C], { visible: false }, theme);
    const lineCA = createLine(board, [C, A], { visible: false }, theme);
    const parDE = board.create('parallel', [lineBC, D], { visible: false });
    const E = board.create('intersection', [parDE, lineCA, 0], { name: 'E', size: 4, fillColor: C_ACC, strokeColor: C_ACC, showInfobox: false });

    const segDE = createSegment(board, [D, E], { strokeColor: C_PAR, strokeWidth: 2.5, dash: 2 }, theme);
    createSegment(board, [B, E], { strokeColor: C_PRIM, strokeWidth: 1, dash: 1, visible: false }, theme);
    createSegment(board, [C, D], { strokeColor: C_PRIM, strokeWidth: 1, dash: 1, visible: false }, theme);

    const polyADE = createPolygon(board, [A, D, E], { fillColor: C_H, fillOpacity: 0, borders: { visible: false }, vertices: { visible: false } }, theme);
    const polyBDE = createPolygon(board, [B, D, E], { fillColor: C_H, fillOpacity: 0, borders: { visible: false }, vertices: { visible: false } }, theme);
    const polyCDE = createPolygon(board, [C, D, E], { fillColor: C_H, fillOpacity: 0, borders: { visible: false }, vertices: { visible: false } }, theme);

    const lineAB = createLine(board, [A, B], { visible: false }, theme);
    const H1 = board.create('intersection', [lineAB, board.create('perpendicular', [lineAB, E], { visible: false }), 0], { visible: false });
    const segH1 = createSegment(board, [E, H1], { strokeColor: C_H, strokeWidth: 2, dash: 2, visible: false }, theme);

    const H2 = board.create('intersection', [lineCA, board.create('perpendicular', [lineCA, D], { visible: false }), 0], { visible: false });
    const segH2 = createSegment(board, [D, H2], { strokeColor: C_H, strokeWidth: 2, dash: 2, visible: false }, theme);





    const obs = new MutationObserver(() => { if (board) {   } });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

      // Registrar elementos para interactividad y auditoría
      els.A = A;
        els.B = B;
        els.C = C;
        els.D = D;
        els.E = E;
        els.polyABC = polyABC;
        els.polyADE = polyADE;
        els.polyBDE = polyBDE;
        els.polyCDE = polyCDE;
        els.segDE = segDE;
        els.segH1 = segH1;
        els.segH2 = segH2;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { A, B, C, D, E, polyABC, polyADE, polyBDE, polyCDE, segDE, segH1, segH2 } = els;
      if (!els.board) return;


    const hTri = isHL('triangulo-abc');
    const hDE = isHL('recta-de');
    const hADE = isHL('triangulo-ade');
    const hBDE = isHL('triangulo-bde');
    const hCDE = isHL('triangulo-cde');
    const hH1 = isHL('altura-h1');
    const hH2 = isHL('altura-h2');
    const hProp = isHL('proporcion');
    const anyH = hTri || hDE || hADE || hBDE || hCDE || hH1 || hH2 || hProp;
    const showAll = !anyH;

    const op = (t: any) => t || showAll ? 1 : 0.12;

    polyABC.setAttribute({ fillOpacity: hTri ? 0.18 : 0.06 });
    segDE.setAttribute({ strokeOpacity: op(hDE || showAll), strokeWidth: hDE ? 3.5 : 2.5 });

    polyADE.setAttribute({ fillOpacity: hADE ? 0.15 : 0, borders: { visible: false } });
    polyBDE.setAttribute({ fillOpacity: hBDE ? 0.15 : 0, borders: { visible: false } });
    polyCDE.setAttribute({ fillOpacity: hCDE ? 0.15 : 0, borders: { visible: false } });

    segH1.setAttribute({ visible: hH1 || showAll, strokeOpacity: hH1 ? 1 : 0.4 });
    segH2.setAttribute({ visible: hH2 || showAll, strokeOpacity: hH2 ? 1 : 0.4 });

    [A, B, C].forEach((p: any) => p.setAttribute({ strokeOpacity: op(showAll), fillOpacity: op(showAll) }));
    [D, E].forEach((p: any) => p.setAttribute({ strokeOpacity: op(hDE||hADE||hBDE||hCDE||showAll), fillOpacity: op(hDE||hADE||hBDE||hCDE||showAll), size: hADE||hBDE||hCDE ? 6 : 4 }));
    };;

  return (
    <MathBoard
      boundingbox={[-5, 5, 5, -5]}
      axis={false}
      grid={false}
      onInit={onInit}
      onUpdate={onUpdate}
    >

    </MathBoard>
  );
};
