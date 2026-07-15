import { useMathStore } from '@/app/providers/MathStoreContext';
import { useStepBinding } from '@/shared/ui/StepBinding';
import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import {
  createPoint, createLine, createSegment, createPolygon, createAngle
} from '@/shared/diagrams/core/MathFactory';






export const DemoSumaAngulos = () => {



  const mathHL = useMathStore(s => s.variables?.['highlight']);
  const { activeStep } = useStepBinding();
  const highlight = mathHL || activeStep;
  const isHL = (id: string) => Array.isArray(highlight) ? (highlight as unknown as string[]).includes(id) : highlight === id;
  void highlight;
  void isHL;

  const onInit = (board: any, els: any, theme: any) => {
      void board; void els; void theme;
      const C_PRIM  = theme.carbon;
    const C_ANG   = theme.salvia;
    const C_PAR   = theme.terracota;
    const C_POL   = theme.pavo;

    const A = createPoint(board, [-3, -2], { name: 'A', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 }, theme);
    const B = createPoint(board, [3, -2], { name: 'B', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 }, theme);
    const C = createPoint(board, [0, 2.5], { name: 'C', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM, showInfobox: false, snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5 }, theme);

    createSegment(board, [A, B], { strokeColor: C_PRIM, strokeWidth: 2.5 }, theme);
    createSegment(board, [A, C], { strokeColor: C_PRIM, strokeWidth: 2 }, theme);
    createSegment(board, [B, C], { strokeColor: C_PRIM, strokeWidth: 2 }, theme);

    const poly = createPolygon(board, [A, B, C], { fillColor: C_POL, fillOpacity: 0.06, borders: { visible: false }, vertices: { visible: false } }, theme);

    const angleA = createAngle(board, [B, A, C], { name: '&alpha;', radius: 0.7, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }, theme) as any;
    const angleB = createAngle(board, [C, B, A], { name: '&beta;',  radius: 0.7, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }, theme) as any;
    const angleC = createAngle(board, [A, C, B], { name: '&gamma;', radius: 0.7, fillColor: C_ANG, strokeColor: C_ANG, fillOpacity: 0.25, type: 'sector', visible: false }, theme) as any;

    const lineAB = createLine(board, [A, B], { visible: false }, theme);
    const paralela = board.create('parallel', [lineAB, C], { strokeColor: C_PAR, strokeWidth: 2.5, dash: 2, visible: false });

    const C_left = createPoint(board, [() => C.X() - 5, () => C.Y()], { visible: false }, theme);
    const C_right = createPoint(board, [() => C.X() + 5, () => C.Y()], { visible: false }, theme);

    const altA = createAngle(board, [C_left, C, A], { name: "&alpha;'", radius: 0.5, fillColor: C_PAR, strokeColor: C_PAR, fillOpacity: 0.3, type: 'sector', visible: false }, theme) as any;
    const altB = createAngle(board, [B, C, C_right], { name: "&beta;'",  radius: 0.5, fillColor: C_PAR, strokeColor: C_PAR, fillOpacity: 0.3, type: 'sector', visible: false }, theme) as any;





    const obs = new MutationObserver(() => { if (board) {   } });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

      // Registrar elementos para interactividad y auditoría
      els.A = A;
        els.B = B;
        els.C = C;
        els.poly = poly;
        els.angleA = angleA;
        els.angleB = angleB;
        els.angleC = angleC;
        els.paralela = paralela;
        els.C_left = C_left;
        els.C_right = C_right;
        els.altA = altA;
        els.altB = altB;
    };;

  const onUpdate = (board: any, els: any, theme: any, isStep: any, isHL: any) => {
      const isHighlight = isHL;
      void board; void els; void theme; void isStep; void isHL; void isHighlight;
      const { A, B, C, poly, angleA, angleB, angleC, paralela, altA, altB } = els;
      if (!els.board) return;


    const hTri = isHL('triangulo') || isHL('base-ab');
    const hPar = isHL('paralela');
    const hAngA = isHL('angulo-a');
    const hAngB = isHL('angulo-b');
    const hAngC = isHL('angulo-c');
    const hAltA = isHL('alterno-a');
    const hAltB = isHL('alterno-b');
    const hLano = isHL('angulo-llano');
    const hVertC = isHL('vertice-c');
    const anyH = hTri || hPar || hAngA || hAngB || hAngC || hAltA || hAltB || hLano || hVertC;
    const showAll = !anyH;

    const op = (t: any) => t || showAll ? 1 : 0.12;

    [A, B, C].forEach((p: any) => p.setAttribute({ strokeOpacity: op(showAll), fillOpacity: op(showAll), size: hVertC && p === C ? 7 : 5 }));
    poly.setAttribute({ fillOpacity: hTri ? 0.18 : 0.06 });

    paralela.setAttribute({ visible: showAll || hPar || hAltA || hAltB || hLano, strokeOpacity: hPar ? 1 : 0.4 });
    angleA.setAttribute({ visible: showAll || hTri || hAngA || hAltA || hLano, fillOpacity: hAngA||hAltA ? 0.45 : 0.25, strokeOpacity: op(hAngA||hAltA) });
    angleB.setAttribute({ visible: showAll || hTri || hAngB || hAltB || hLano, fillOpacity: hAngB||hAltB ? 0.45 : 0.25, strokeOpacity: op(hAngB||hAltB) });
    angleC.setAttribute({ visible: showAll || hTri || hAngC || hLano, fillOpacity: 0.25, strokeOpacity: op(hAngC) });
    altA.setAttribute({ visible: showAll || hAltA || hLano, fillOpacity: hAltA||hLano ? 0.45 : 0.2 });
    altB.setAttribute({ visible: showAll || hAltB || hLano, fillOpacity: hAltB||hLano ? 0.45 : 0.2 });
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
