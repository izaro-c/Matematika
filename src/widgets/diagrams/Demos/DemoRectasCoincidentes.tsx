import { MathBoard } from '@/features/graph/ui/MathBoard';
import { 
  createPoint, createLine 
} from '@/features/graph/ui/MathFactory';

export const DemoRectasCoincidentes = () => {
  return (
    <MathBoard
      boundingbox={[-5, 5, 5, -5]}
      onInit={(board: any, els: any, theme: any) => {
        // Punto auxiliar para controlar la rotación sin romper el moveTo
        els.angleVar = createPoint(board, [0, 0.4], { visible: false }, theme);

        els.A = createPoint(board, [-2, 0], { name: 'A', fixed: true, label: { position: 'ul', offset: [-10, 15] } }, theme);
        els.B = createPoint(board, [2, 0], { name: 'B', fixed: true, label: { position: 'ul', offset: [-10, 15] } }, theme);

        els.rectaL = createLine(board, [els.A, els.B], {
          name: 'l', withLabel: true, label: { position: 'rt', offset: [10, 10] }, strokeWidth: 2
        }, theme);

        els.tRot = board.create('transform', [() => els.angleVar.Y(), els.A], { type: 'rotate' });
        els.bpRot = board.create('point', [els.B, els.tRot], { visible: false });
        
        els.rectaM = createLine(board, [els.A, els.bpRot], {
          name: 'm', strokeColor: theme.terracota, strokeWidth: 2, withLabel: true, label: { position: 'rt', offset: [10, -10], strokeColor: theme.terracota }
        }, theme);
      }}
      onUpdate={(_board: any, els: any, theme: any, isStep: any, isHL: any) => {
        const s4 = isStep('step4');
        const s5 = isStep('step5');

        const hlL = isHL('rectaL');
        const hlM = isHL('rectaM');
        const hlA = isHL('puntoA');
        const hlB = isHL('puntoB');

        const anyH = hlL || hlM || hlA || hlB;

        const getOp = (hovered: boolean, activeInStep: boolean, base = 0.2) => {
            if (hovered) return 1;
            if (anyH) return base;
            return activeInStep ? 1 : base;
        };

        const getW = (hovered: boolean, w1 = 2, w2 = 4) => hovered ? w2 : w1;
        const getC = (hovered: boolean, c1: string, c2 = theme.terracota) => hovered ? c2 : c1;

        // Points
        els.A.setAttribute({ fillOpacity: getOp(hlA, true), strokeOpacity: getOp(hlA, true), size: hlA ? 8 : 5, fillColor: getC(hlA, theme.carbon, theme.salvia), strokeColor: getC(hlA, theme.carbon, theme.salvia) });
        els.B.setAttribute({ fillOpacity: getOp(hlB, true), strokeOpacity: getOp(hlB, true), size: hlB ? 8 : 5, fillColor: getC(hlB, theme.carbon, theme.salvia), strokeColor: getC(hlB, theme.carbon, theme.salvia) });

        // Animation logic
        if (s4 || s5) {
          els.angleVar.moveTo([0, 0], 500);
        } else {
          els.angleVar.moveTo([0, 0.4], 500);
        }

        // Lines
        const collapse = s4 || s5;
        els.rectaL.setAttribute({ strokeWidth: getW(hlL, collapse ? 3 : 2, 5), strokeOpacity: getOp(hlL, true), strokeColor: getC(hlL, theme.carbon) });
        els.rectaM.setAttribute({ strokeWidth: getW(hlM, collapse ? 3 : 2, 5), strokeOpacity: getOp(hlM, true, collapse ? 0.6 : 1), strokeColor: theme.terracota }); // Keep terracota base for differentiation
      }}
    />
  );
};
