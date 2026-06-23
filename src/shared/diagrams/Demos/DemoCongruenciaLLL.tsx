import { MathBoard } from '@/features/graph/ui/MathBoard';
import { 
  createPoint, createSegment, createPolygon, createAngle, createTicks 
} from '@/features/graph/ui/MathFactory';
import { StyleManager } from '@/features/graph/ui/MathUtils';

export const DemoCongruenciaLLL = () => {
  return (
    <MathBoard
      boundingbox={[-1, 4, 5, -4]}
      onInit={(board, els, theme) => {
        // Points
        els.A = createPoint(board, [0, 0], { name: "A'", fixed: true }, theme);
        els.B = createPoint(board, [4, 0], { name: "B'", fixed: true }, theme);
        
        // C can be draggable above the x-axis
        els.C = createPoint(board, [1.6, 2], { name: "C'" }, theme);
        
        // C* is the reflection of C over AB
        els.CStar = createPoint(board, [() => els.C.X(), () => -els.C.Y()], { name: "C*", size: 4, visible: false }, theme);

        // Triangles (Polygons for background color)
        els.polyLeft = createPolygon(board, [els.A, els.C, els.CStar], { fillColor: theme.salvia, fillOpacity: 0 }, theme);
        els.polyRight = createPolygon(board, [els.B, els.C, els.CStar], { fillColor: theme.terracota, fillOpacity: 0 }, theme);

        // Segments
        els.segAB = createSegment(board, [els.A, els.B], { name: "" }, theme);
        els.segAC = createSegment(board, [els.A, els.C], { name: "" }, theme);
        els.segBC = createSegment(board, [els.B, els.C], { name: "" }, theme);

        els.segACStar = createSegment(board, [els.A, els.CStar], { dash: 2, visible: false }, theme);
        els.segBCStar = createSegment(board, [els.B, els.CStar], { dash: 2, visible: false }, theme);

        els.segCCStar = createSegment(board, [els.C, els.CStar], { dash: 2, strokeColor: theme.salvia, visible: false }, theme);

        // Ticks
        els.tickAC = createTicks(board, [els.segAC, 1], {}, theme);
        els.tickACStar = createTicks(board, [els.segACStar, 1], { visible: false }, theme);

        els.tickBC = createTicks(board, [els.segBC, 2], {}, theme);
        els.tickBCStar = createTicks(board, [els.segBCStar, 2], { visible: false }, theme);

        // Angles
        els.angC1 = createAngle(board, [els.A, els.C, els.CStar], { radius: 0.6, fillColor: theme.salvia, strokeColor: theme.salvia, fillOpacity: 0, visible: false }, theme);
        els.angCStar1 = createAngle(board, [els.C, els.CStar, els.A], { radius: 0.6, fillColor: theme.salvia, strokeColor: theme.salvia, fillOpacity: 0, visible: false }, theme);
        
        els.angC2 = createAngle(board, [els.CStar, els.C, els.B], { radius: 0.7, fillColor: theme.terracota, strokeColor: theme.terracota, fillOpacity: 0, visible: false }, theme);
        els.angCStar2 = createAngle(board, [els.B, els.CStar, els.C], { radius: 0.7, fillColor: theme.terracota, strokeColor: theme.terracota, fillOpacity: 0, visible: false }, theme);
      }}
      onUpdate={(_board, els, theme, isStep, isHL) => {
        const anyH = ['sideAB', 'sideAC', 'sideBC', 'sideACStar', 'sideBCStar', 'triangleCPrime', 'triangleCStar', 'lineCC', 'isoLeft', 'isoRight', 'angleC'].some(isHL);
        const styler = new StyleManager(isStep, isHL, anyH, theme);

        const actBottom = styler.isStep(['step1', 'step2', 'step3', 'step4']);
        const hlBottom = styler.isHL('triangleCStar');
        const visBottom = actBottom || hlBottom;

        // Points
        els.CStar.setAttribute({ visible: visBottom, fillOpacity: styler.getOp(hlBottom, actBottom), strokeOpacity: styler.getOp(hlBottom, actBottom) });
        if (els.CStar.label) els.CStar.label.setAttribute({ visible: visBottom });

        els.A.setAttribute({ fillOpacity: styler.getOp(styler.isHL(['triangleCPrime', 'triangleCStar', 'sideAB', 'sideAC', 'sideACStar']), true), strokeOpacity: styler.getOp(styler.isHL(['triangleCPrime', 'triangleCStar', 'sideAB', 'sideAC', 'sideACStar']), true) });
        els.B.setAttribute({ fillOpacity: styler.getOp(styler.isHL(['triangleCPrime', 'triangleCStar', 'sideAB', 'sideBC', 'sideBCStar']), true), strokeOpacity: styler.getOp(styler.isHL(['triangleCPrime', 'triangleCStar', 'sideAB', 'sideBC', 'sideBCStar']), true) });
        els.C.setAttribute({ fillOpacity: styler.getOp(styler.isHL(['triangleCPrime', 'sideAC', 'sideBC', 'lineCC', 'angleC']), true), strokeOpacity: styler.getOp(styler.isHL(['triangleCPrime', 'sideAC', 'sideBC', 'lineCC', 'angleC']), true) });

        // Segments
        els.segAB.setAttribute({ strokeWidth: styler.getW(styler.isHL('sideAB')), strokeOpacity: styler.getOp(styler.isHL(['sideAB', 'triangleCPrime', 'triangleCStar']), true), strokeColor: styler.getC(styler.isHL('sideAB'), theme.carbon, theme.terracota) });
        els.segAC.setAttribute({ strokeWidth: styler.getW(styler.isHL('sideAC')), strokeOpacity: styler.getOp(styler.isHL(['sideAC', 'triangleCPrime']), true), strokeColor: styler.getC(styler.isHL('sideAC'), theme.carbon, theme.terracota) });
        els.segBC.setAttribute({ strokeWidth: styler.getW(styler.isHL('sideBC')), strokeOpacity: styler.getOp(styler.isHL(['sideBC', 'triangleCPrime']), true), strokeColor: styler.getC(styler.isHL('sideBC'), theme.carbon, theme.terracota) });
        
        els.segACStar.setAttribute({ visible: visBottom, strokeWidth: styler.getW(styler.isHL('sideACStar')), strokeOpacity: styler.getOp(styler.isHL(['sideACStar', 'triangleCStar']), actBottom), strokeColor: styler.getC(styler.isHL('sideACStar'), theme.carbon, theme.terracota) });
        els.segBCStar.setAttribute({ visible: visBottom, strokeWidth: styler.getW(styler.isHL('sideBCStar')), strokeOpacity: styler.getOp(styler.isHL(['sideBCStar', 'triangleCStar']), actBottom), strokeColor: styler.getC(styler.isHL('sideBCStar'), theme.carbon, theme.terracota) });
        
        const actLineCC = styler.isStep(['step3', 'step4']);
        els.segCCStar.setAttribute({ visible: actLineCC || styler.isHL('lineCC'), strokeWidth: styler.getW(styler.isHL('lineCC')), strokeOpacity: styler.getOp(styler.isHL('lineCC'), actLineCC), strokeColor: styler.getC(styler.isHL('lineCC'), theme.salvia, theme.terracota) });

        // Ticks
        const actTicksBottom = actBottom;
        els.tickAC.setAttribute({ strokeOpacity: styler.getOp(styler.isHL(['sideAC', 'triangleCPrime']), true) });
        els.tickBC.setAttribute({ strokeOpacity: styler.getOp(styler.isHL(['sideBC', 'triangleCPrime']), true) });
        els.tickACStar.setAttribute({ visible: actTicksBottom || hlBottom, strokeOpacity: styler.getOp(styler.isHL(['sideACStar', 'triangleCStar']), actTicksBottom) });
        els.tickBCStar.setAttribute({ visible: actTicksBottom || hlBottom, strokeOpacity: styler.getOp(styler.isHL(['sideBCStar', 'triangleCStar']), actTicksBottom) });

        // Isosceles highlight
        els.polyLeft.setAttribute({ fillOpacity: styler.getOpAng(styler.isHL('isoLeft'), styler.isStep('step3'), 0, 0.3, 0.1), fillColor: styler.getC(styler.isHL('isoLeft'), theme.salvia, theme.terracota) });
        els.polyRight.setAttribute({ fillOpacity: styler.getOpAng(styler.isHL('isoRight'), styler.isStep('step3'), 0, 0.3, 0.1), fillColor: styler.getC(styler.isHL('isoRight'), theme.terracota, theme.terracota) });

        // Angles
        const actAng = styler.isStep('step4');
        const hlAng = styler.isHL('angleC');
        const opAngArea = styler.getOpAng(hlAng, actAng, 0, 0.3, 0.2);
        
        els.angC1.setAttribute({ fillOpacity: opAngArea, strokeOpacity: styler.getOp(hlAng, actAng, 0), visible: actAng || hlAng, fillColor: styler.getC(hlAng, theme.salvia, theme.terracota) });
        els.angCStar1.setAttribute({ fillOpacity: opAngArea, strokeOpacity: styler.getOp(hlAng, actAng, 0), visible: actAng || hlAng, fillColor: styler.getC(hlAng, theme.salvia, theme.terracota) });
        els.angC2.setAttribute({ fillOpacity: opAngArea, strokeOpacity: styler.getOp(hlAng, actAng, 0), visible: actAng || hlAng, fillColor: styler.getC(hlAng, theme.terracota, theme.terracota) });
        els.angCStar2.setAttribute({ fillOpacity: opAngArea, strokeOpacity: styler.getOp(hlAng, actAng, 0), visible: actAng || hlAng, fillColor: styler.getC(hlAng, theme.terracota, theme.terracota) });
      }}
    />
  );
};
