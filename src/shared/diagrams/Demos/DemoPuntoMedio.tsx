import { MathBoard } from '@/features/graph/ui/MathBoard';
import { 
  createPoint, createSegment, createPolygon, createAngle, createTicks 
} from '@/features/graph/ui/MathFactory';

export const DemoPuntoMedio = () => {
  return (
    <MathBoard
      boundingbox={[-1, 3, 5, -3]}
      onInit={(board, els, theme) => {
        // Base points
        els.A = createPoint(board, [0, 0], { name: 'A' }, theme);
        els.B = createPoint(board, [4, 0], { name: 'B' }, theme);
        
        // Aux points
        els.C = createPoint(board, [1, 2], { name: 'C', visible: false }, theme);
        
        els.M = createPoint(board, [
          () => (els.A.X() + els.B.X()) / 2, 
          () => (els.A.Y() + els.B.Y()) / 2
        ], { name: 'M' }, theme);

        els.D = createPoint(board, [
          () => els.A.X() + els.B.X() - els.C.X(),
          () => els.A.Y() + els.B.Y() - els.C.Y()
        ], { name: 'D', visible: false }, theme);

        // Polygons
        els.polyCAB = createPolygon(board, [els.C, els.A, els.B], { fillColor: theme.salvia, fillOpacity: 0 }, theme);
        els.polyDBA = createPolygon(board, [els.D, els.B, els.A], { fillColor: theme.salvia, fillOpacity: 0 }, theme);
        els.polyCAD = createPolygon(board, [els.C, els.A, els.D], { fillColor: theme.terracota, fillOpacity: 0 }, theme);
        els.polyDBC = createPolygon(board, [els.D, els.B, els.C], { fillColor: theme.terracota, fillOpacity: 0 }, theme);
        els.polyCAM = createPolygon(board, [els.C, els.A, els.M], { fillColor: theme.terracota, fillOpacity: 0 }, theme);
        els.polyDBM = createPolygon(board, [els.D, els.B, els.M], { fillColor: theme.salvia, fillOpacity: 0 }, theme);

        // Segments
        els.segAB = createSegment(board, [els.A, els.B], { name: '', strokeWidth: 6, strokeOpacity: 0 }, theme);
        els.segAM = createSegment(board, [els.A, els.M], { name: '', strokeWidth: 3 }, theme);
        els.segMB = createSegment(board, [els.M, els.B], { name: '', strokeWidth: 3 }, theme);

        els.segAC = createSegment(board, [els.A, els.C], { name: '', dash: 2, strokeColor: theme.pizarra, visible: false }, theme);
        els.segBD = createSegment(board, [els.B, els.D], { name: '', dash: 2, strokeColor: theme.pizarra, visible: false }, theme);
        els.segCD = createSegment(board, [els.C, els.D], { name: '', strokeColor: theme.pizarra, visible: false }, theme);
        els.segBC = createSegment(board, [els.B, els.C], { name: '', strokeWidth: 1, visible: false }, theme);
        els.segAD = createSegment(board, [els.A, els.D], { name: '', strokeWidth: 1, visible: false }, theme);

        // Angles (A sweeps from AB to AC, B sweeps from BA to BD)
        els.angA = createAngle(board, [els.B, els.A, els.C], { radius: 0.8, fillColor: theme.terracota, strokeColor: theme.terracota, visible: false }, theme);
        els.angB = createAngle(board, [els.A, els.B, els.D], { radius: 0.8, fillColor: theme.salvia, strokeColor: theme.salvia, visible: false }, theme);

        // Congruence marks
        els.tickAM = createTicks(board, [els.segAM, 1], { strokeColor: theme.terracota, visible: false }, theme);
        els.tickMB = createTicks(board, [els.segMB, 1], { strokeColor: theme.terracota, visible: false }, theme);

        // M' (Contradicción)
        els.MPrime = createPoint(board, [3.2, 0], { name: "M'", strokeColor: theme.salvia, fillColor: theme.salvia, label: { strokeColor: theme.salvia }, visible: false }, theme);
        
        // Artificial ticks for M'
        els.pMPrimeT1Top = board.create('point', [
          () => (els.A.X() + els.MPrime.X()) / 2, 
          () => (els.A.Y() + els.MPrime.Y()) / 2 + 0.2
        ], { visible: false });
        els.pMPrimeT1Bot = board.create('point', [
          () => (els.A.X() + els.MPrime.X()) / 2, 
          () => (els.A.Y() + els.MPrime.Y()) / 2 - 0.2
        ], { visible: false });
        els.tickAMPrime = board.create('segment', [els.pMPrimeT1Top, els.pMPrimeT1Bot], { strokeColor: theme.salvia, dash: 2, strokeWidth: 2, visible: false });

        els.pMPrimeT2Top = board.create('point', [
          () => (els.MPrime.X() + els.B.X()) / 2, 
          () => (els.MPrime.Y() + els.B.Y()) / 2 + 0.2
        ], { visible: false });
        els.pMPrimeT2Bot = board.create('point', [
          () => (els.MPrime.X() + els.B.X()) / 2, 
          () => (els.MPrime.Y() + els.B.Y()) / 2 - 0.2
        ], { visible: false });
        els.tickMPrimeB = board.create('segment', [els.pMPrimeT2Top, els.pMPrimeT2Bot], { strokeColor: theme.salvia, dash: 2, strokeWidth: 2, visible: false });
      }}
      onUpdate={(_board, els, theme, isStep, isHL) => {
        const s1 = isStep('step1');
        const s2 = isStep('step2');
        const s3 = isStep('step3');
        const s4 = isStep('step4');
        const s5 = isStep('step5');

        // Hovers
        const hlAM = isHL('segmentAM');
        const hlMB = isHL('segmentMB');
        const hlM = isHL('pointM');
        const hlMPrime = isHL('pointMPrime');
        const hlAB = isHL('segmentAB');
        const hlAux = isHL('auxiliar');
        const hlCAB = isHL('triangulo-cab');
        const hlDBA = isHL('triangulo-dba');
        const hlCAD = isHL('triangulo-cad');
        const hlDBC = isHL('triangulo-dbc');
        const hlCAM = isHL('triangulo-cam');
        const hlDBM = isHL('triangulo-dbm');
        const hlAC = isHL('ladoAC');
        const hlBD = isHL('ladoBD');
        const hlCD = isHL('ladoCD');
        const hlBC = isHL('ladoBC');
        const hlAD = isHL('ladoAD');
        const hlAngA = isHL('anguloA');
        const hlAngB = isHL('anguloB');
        const hlCong = isHL('congruence');

        const anyH = hlAM || hlMB || hlM || hlMPrime || hlAB || hlAux || hlCAB || hlDBA || hlCAD || hlDBC || hlCAM || hlDBM || hlAC || hlBD || hlCD || hlBC || hlAD || hlAngA || hlAngB || hlCong;

        const getOp = (hovered: boolean, activeInStep: boolean, base = 0.2, hlOp = 1) => {
            if (hovered) return hlOp;
            if (anyH) return base;
            return activeInStep ? 1 : base;
        };

        const getW = (hovered: boolean, w1 = 2, w2 = 4) => hovered ? w2 : w1;
        const getC = (hovered: boolean, c1: string, c2 = theme.terracota) => hovered ? c2 : c1;

        const showMPrime = s4 || s5;

        // Animation logic for M' -> M
        const mX = (els.A.X() + els.B.X()) / 2;
        const mY = (els.A.Y() + els.B.Y()) / 2;
        const mPrimeStartX = els.A.X() + 0.8 * (els.B.X() - els.A.X());
        const mPrimeStartY = els.A.Y() + 0.8 * (els.B.Y() - els.A.Y());

        if (showMPrime && !s5) {
          els.MPrime.moveTo([mPrimeStartX, mPrimeStartY]);
        } else if (s5) {
          els.MPrime.moveTo([mX, mY], 500);
        }

        // Polygon opacity (Only highlight large triangles on hover to avoid a muddy parallelogram in step 2)
        els.polyCAB.setAttribute({ fillOpacity: hlCAB ? 0.4 : 0, fillColor: getC(hlCAB, theme.salvia) });
        els.polyDBA.setAttribute({ fillOpacity: hlDBA ? 0.4 : 0, fillColor: getC(hlDBA, theme.salvia) });
        els.polyCAD.setAttribute({ fillOpacity: hlCAD ? 0.4 : 0, fillColor: getC(hlCAD, theme.terracota) });
        els.polyDBC.setAttribute({ fillOpacity: hlDBC ? 0.4 : 0, fillColor: getC(hlDBC, theme.terracota) });
        els.polyCAM.setAttribute({ fillOpacity: hlCAM ? 0.5 : (anyH ? 0 : (s3 ? 0.2 : 0)), fillColor: getC(hlCAM, theme.terracota) });
        els.polyDBM.setAttribute({ fillOpacity: hlDBM ? 0.5 : (anyH ? 0 : (s3 ? 0.2 : 0)), fillColor: getC(hlDBM, theme.salvia, theme.terracota) });

        // Aux visibility
        const stepAux = s1 || s2 || s3;
        els.C.setAttribute({ visible: stepAux || hlAux });
        els.D.setAttribute({ visible: stepAux || hlAux });
        if (els.C.label) els.C.label.setAttribute({ visible: stepAux || hlAux });
        if (els.D.label) els.D.label.setAttribute({ visible: stepAux || hlAux });

        els.segAC.setAttribute({ visible: stepAux || hlAux, strokeOpacity: getOp(hlAC || hlAux, stepAux, 0), strokeWidth: getW(hlAC || hlAux), strokeColor: getC(hlAC || hlAux, theme.pizarra) });
        els.segBD.setAttribute({ visible: stepAux || hlAux, strokeOpacity: getOp(hlBD || hlAux, stepAux, 0), strokeWidth: getW(hlBD || hlAux), strokeColor: getC(hlBD || hlAux, theme.pizarra) });
        els.segCD.setAttribute({ visible: stepAux || hlAux, strokeOpacity: getOp(hlCD || hlAux, stepAux, 0), strokeWidth: getW(hlCD || hlAux), strokeColor: getC(hlCD || hlAux, theme.pizarra) });
        
        // BC and AD are only really part of step 2
        const stepCross = s2;
        els.segBC.setAttribute({ visible: stepCross || hlAux || hlBC, strokeOpacity: getOp(hlBC || hlAux, stepCross, 0), strokeWidth: getW(hlBC || hlAux, 1, 3), strokeColor: getC(hlBC || hlAux, theme.carbon) });
        els.segAD.setAttribute({ visible: stepCross || hlAux || hlAD, strokeOpacity: getOp(hlAD || hlAux, stepCross, 0), strokeWidth: getW(hlAD || hlAux, 1, 3), strokeColor: getC(hlAD || hlAux, theme.carbon) });

        const hlAngArea = (h: boolean) => h ? 0.3 : (anyH ? 0 : (stepAux ? 0.1 : 0));
        els.angA.setAttribute({ visible: stepAux || hlAux, fillOpacity: hlAngArea(hlAngA), strokeOpacity: getOp(hlAngA, stepAux, 0) });
        els.angB.setAttribute({ visible: stepAux || hlAux, fillOpacity: hlAngArea(hlAngB), strokeOpacity: getOp(hlAngB, stepAux, 0) });

        // Base segments
        els.segAB.setAttribute({ strokeColor: hlAB ? theme.terracota : 'transparent', strokeOpacity: 1 });

        const amHover = hlAM || (hlCong && !showMPrime);
        const mbHover = hlMB || (hlCong && !showMPrime);
        
        const stepAM = true; 
        els.segAM.setAttribute({ strokeOpacity: getOp(amHover, stepAM), strokeWidth: getW(amHover, 3, 5), strokeColor: amHover ? theme.terracota : theme.carbon });
        els.segMB.setAttribute({ strokeOpacity: getOp(mbHover, stepAM), strokeWidth: getW(mbHover, 3, 5), strokeColor: mbHover ? theme.terracota : theme.carbon });

        // Congruence
        const stepCong = s3 || s4 || s5;
        els.tickAM.setAttribute({ visible: stepCong, strokeOpacity: getOp(hlCong && !showMPrime, stepCong, 0) });
        els.tickMB.setAttribute({ visible: stepCong, strokeOpacity: getOp(hlCong && !showMPrime, stepCong, 0) });

        // Point M
        const stepM = s1 || s2 || s3 || s4 || s5;
        els.M.setAttribute({ visible: stepM || hlM, strokeOpacity: getOp(hlM, stepM), fillOpacity: getOp(hlM, stepM), fillColor: hlM ? theme.terracota : theme.carbon, strokeColor: hlM ? theme.terracota : theme.carbon });
        if (els.M.label) els.M.label.setAttribute({ visible: stepM || hlM, strokeColor: hlM ? theme.terracota : theme.carbon });
        
        // Point MPrime
        const hlMPrimeOrCong = hlMPrime || hlCong;
        els.MPrime.setAttribute({ visible: showMPrime || hlMPrime, fillOpacity: getOp(hlMPrimeOrCong, showMPrime, 0), strokeOpacity: getOp(hlMPrimeOrCong, showMPrime, 0) });
        if (els.MPrime.label) els.MPrime.label.setAttribute({ visible: showMPrime || hlMPrime });
        els.tickAMPrime.setAttribute({ visible: (showMPrime || hlMPrime) && stepCong, strokeOpacity: getOp(hlCong, showMPrime, 0) });
        els.tickMPrimeB.setAttribute({ visible: (showMPrime || hlMPrime) && stepCong, strokeOpacity: getOp(hlCong, showMPrime, 0) });
      }}
    />
  );
};
