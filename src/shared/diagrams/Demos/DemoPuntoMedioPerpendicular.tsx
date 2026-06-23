import { MathBoard } from '@/features/graph/ui/MathBoard';
import { 
  createPoint, createSegment, createMidpoint, createTicks, 
  createPerpendicular, createRightAngle, createGlider, 
  createPolygon, createCircle, createIntersection 
} from '@/features/graph/ui/MathFactory';

export const DemoPuntoMedioPerpendicular = () => {
  return (
    <MathBoard
      boundingbox={[-4, 5, 4, -5]}
      onInit={(board, els, theme) => {
        // Puntos A y B
        els.A = createPoint(board, [-2, 0], { name: 'A' }, theme);
        els.B = createPoint(board, [2, 0], { name: 'B', label: { offset: [5, -15] } }, theme);

        // Segmento AB
        els.segAB = createSegment(board, [els.A, els.B], {}, theme);

        // Punto Medio M
        els.M = createMidpoint(board, [els.A, els.B], { name: 'M' }, theme);

        // Marcas de congruencia
        createTicks(board, [board.create('segment', [els.A, els.M], { visible: false }), 1], {}, theme);
        createTicks(board, [board.create('segment', [els.M, els.B], { visible: false }), 1], {}, theme);

        // Mediatriz l
        els.lineL = createPerpendicular(board, [els.segAB, els.M], { name: 'l', withLabel: true, label: { position: 'rt', offset: [10, 10] } }, theme);

        // Ángulo recto
        els.rightAngle = createRightAngle(board, [els.B, els.M, board.create('point', [() => els.M.X(), () => els.M.Y() + 1], { visible: false })], { visible: true }, theme);

        // --- DIRECCIÓN 1 ---
        els.P = createGlider(board, [0, 2.5, els.lineL], { name: 'P' }, theme);
        
        els.polyPAM = createPolygon(board, [els.P, els.A, els.M], { fillColor: theme.salvia }, theme);
        els.polyPBM = createPolygon(board, [els.P, els.B, els.M], { fillColor: theme.terracota }, theme);
        
        els.segPA = createSegment(board, [els.P, els.A], { strokeColor: theme.salvia, dash: 2, visible: false }, theme);
        els.segPB = createSegment(board, [els.P, els.B], { strokeColor: theme.terracota, dash: 2, visible: false }, theme);

        // --- DIRECCIÓN 2 ---
        els.circA = createCircle(board, [els.A, els.B], { visible: false }, theme);
        els.circB = createCircle(board, [els.B, els.A], { visible: false }, theme);

        els.intersections = createIntersection(board, [els.circA, els.circB], {});
        
        els.C = createPoint(board, [() => els.intersections.X(0), () => els.intersections.Y(0)], { name: 'C', visible: false, fillColor: theme.terracota, strokeColor: theme.terracota, label: { strokeColor: theme.terracota } }, theme);
        els.D = createPoint(board, [() => els.intersections.X(1), () => els.intersections.Y(1)], { name: 'D', visible: false, fillColor: theme.terracota, strokeColor: theme.terracota, label: { strokeColor: theme.terracota, offset: [10, -15] } }, theme);

        els.polyCAM = createPolygon(board, [els.C, els.A, els.M], { fillColor: theme.salvia }, theme);
        els.polyCBM = createPolygon(board, [els.C, els.B, els.M], { fillColor: theme.terracota }, theme);

        els.segCA = createSegment(board, [els.C, els.A], { strokeColor: theme.salvia, dash: 2, visible: false }, theme);
        els.segCB = createSegment(board, [els.C, els.B], { strokeColor: theme.terracota, dash: 2, visible: false }, theme);
      }}
      onUpdate={(_board, els, theme, isStep, isHL) => {
        const s1 = isStep('step1');
        const s2 = isStep('step2');
        const s3 = isStep('step3');
        const s4 = isStep('step4');
        const s5 = isStep('step5');

        const hlTriPAM = isHL('trianglePAM');
        const hlTriPBM = isHL('trianglePBM');
        const hlTriCAM = isHL('triangleCAM');
        const hlTriCBM = isHL('triangleCBM');
        const hlLineCD = isHL('lineCD');
        const hlAB = isHL('segmentAB');
        const hlA = isHL('pointA');
        const hlB = isHL('pointB');
        const hlM = isHL('pointM');
        const hlP = isHL('pointP');
        const hlC = isHL('pointC');
        const hlRightAng = isHL('rightAngle');
        const hlCircA = isHL('circleA');
        const hlCircB = isHL('circleB');
        const hlInter = isHL('intersections');

        const anyH = hlTriPAM || hlTriPBM || hlTriCAM || hlTriCBM || hlLineCD || hlAB || hlA || hlB || hlM || hlP || hlC || hlRightAng || hlCircA || hlCircB || hlInter;

        const getOp = (hovered: boolean, activeInStep: boolean, base = 0.2, hlOp = 1) => {
            if (hovered) return hlOp;
            if (anyH) return base;
            return activeInStep ? 1 : base;
        };

        const getW = (hovered: boolean, w1 = 2, w2 = 4) => hovered ? w2 : w1;
        const getC = (hovered: boolean, c1: string, c2 = theme.terracota) => hovered ? c2 : c1;

        // Visibility variables
        const isPart2 = s3 || s4 || s5;
        const visP = (!isPart2 && (s1 || s2)) || hlTriPAM || hlTriPBM || hlP;
        const visCD = isPart2 || hlTriCAM || hlTriCBM || hlC || hlInter;
        const visCirc = isPart2 || hlCircA || hlCircB;

        // Points
        els.A.setAttribute({ fillOpacity: getOp(hlA, true), strokeOpacity: getOp(hlA, true), size: hlA ? 7 : 5, fillColor: getC(hlA, theme.carbon), strokeColor: getC(hlA, theme.carbon) });
        els.B.setAttribute({ fillOpacity: getOp(hlB, true), strokeOpacity: getOp(hlB, true), size: hlB ? 7 : 5, fillColor: getC(hlB, theme.carbon), strokeColor: getC(hlB, theme.carbon) });
        els.M.setAttribute({ fillOpacity: getOp(hlM, true), strokeOpacity: getOp(hlM, true), size: hlM ? 6 : 4, fillColor: getC(hlM, theme.carbon), strokeColor: getC(hlM, theme.carbon) });
        
        els.P.setAttribute({ visible: visP, fillOpacity: getOp(hlP || hlTriPAM || hlTriPBM, visP), strokeOpacity: getOp(hlP || hlTriPAM || hlTriPBM, visP), size: hlP ? 8 : 5 });
        
        els.C.setAttribute({ visible: visCD, fillOpacity: getOp(hlC || hlTriCAM || hlTriCBM || hlInter, visCD), strokeOpacity: getOp(hlC || hlTriCAM || hlTriCBM || hlInter, visCD), size: hlC || hlInter ? 8 : 5 });
        els.D.setAttribute({ visible: visCD, fillOpacity: getOp(hlC || hlInter, visCD), strokeOpacity: getOp(hlC || hlInter, visCD), size: hlC || hlInter ? 8 : 5 });

        // Line and Segment
        els.segAB.setAttribute({ strokeWidth: getW(hlAB), strokeOpacity: getOp(hlAB, true), strokeColor: getC(hlAB, theme.carbon) });
        els.lineL.setAttribute({ strokeWidth: getW(hlLineCD, s5 ? 4 : 2, 5), strokeOpacity: getOp(hlLineCD, true), strokeColor: getC(hlLineCD || s5, theme.carbon) });
        
        // Right Angle
        const actRA = s1 || s2;
        els.rightAngle.setAttribute({ strokeOpacity: getOp(hlRightAng, true), fillOpacity: getOp(hlRightAng, true, 0), strokeColor: getC(hlRightAng || actRA, theme.carbon), fillColor: getC(hlRightAng || actRA, theme.carbon) });

        // Polygons and segments PAM, PBM
        const actPA = s1 || s2;
        const hlPA = hlTriPAM;
        els.segPA.setAttribute({ visible: actPA || hlPA, strokeOpacity: getOp(hlPA, actPA), strokeWidth: getW(hlPA, s2 ? 3 : 2, 4) });
        els.polyPAM.setAttribute({ fillOpacity: hlPA ? 0.3 : (anyH ? 0 : (s2 ? 0.15 : (s1 ? 0.1 : 0))), fillColor: getC(hlPA, theme.salvia) });

        const actPB = s1 || s2;
        const hlPB = hlTriPBM;
        els.segPB.setAttribute({ visible: actPB || hlPB, strokeOpacity: getOp(hlPB, actPB), strokeWidth: getW(hlPB, s2 ? 3 : 2, 4) });
        els.polyPBM.setAttribute({ fillOpacity: hlPB ? 0.3 : (anyH ? 0 : (s2 ? 0.15 : (s1 ? 0.1 : 0))), fillColor: getC(hlPB, theme.terracota) });

        // Polygons and segments CAM, CBM
        const actCA = isPart2;
        const hlCA = hlTriCAM;
        els.segCA.setAttribute({ visible: actCA || hlCA, strokeOpacity: getOp(hlCA, actCA), strokeWidth: getW(hlCA, s4 ? 3 : 2, 4) });
        els.polyCAM.setAttribute({ fillOpacity: hlCA ? 0.3 : (anyH ? 0 : (s4 ? 0.15 : (isPart2 ? 0.1 : 0))), fillColor: getC(hlCA, theme.salvia) });

        const actCB = isPart2;
        const hlCB = hlTriCBM;
        els.segCB.setAttribute({ visible: actCB || hlCB, strokeOpacity: getOp(hlCB, actCB), strokeWidth: getW(hlCB, s4 ? 3 : 2, 4) });
        els.polyCBM.setAttribute({ fillOpacity: hlCB ? 0.3 : (anyH ? 0 : (s4 ? 0.15 : (isPart2 ? 0.1 : 0))), fillColor: getC(hlCB, theme.terracota) });

        // Circles
        els.circA.setAttribute({ visible: visCirc, strokeOpacity: getOp(hlCircA, isPart2, 0, 0.5), strokeWidth: hlCircA ? 2 : 1, strokeColor: getC(hlCircA, theme.pizarra, theme.salvia) });
        els.circB.setAttribute({ visible: visCirc, strokeOpacity: getOp(hlCircB, isPart2, 0, 0.5), strokeWidth: hlCircB ? 2 : 1, strokeColor: getC(hlCircB, theme.pizarra, theme.terracota) });
      }}
    >
      <div className="absolute bottom-2 right-2 text-xs font-serif text-carbon/50 pointer-events-none">
        Arrastra los puntos A y B, o el punto P sobre la mediatriz
      </div>
    </MathBoard>
  );
};
