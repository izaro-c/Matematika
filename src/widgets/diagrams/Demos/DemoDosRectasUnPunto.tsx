import { MathBoard } from '@/features/graph/ui/MathBoard';
import { 
  createPoint, createLine, createGlider 
} from '@/features/graph/ui/MathFactory';

export const DemoDosRectasUnPunto = () => {
  return (
    <MathBoard
      boundingbox={[-5, 5, 5, -5]}
      onInit={(board: any, els: any, theme: any) => {
        // Punto central de intersección
        els.P = createPoint(board, [0, 0], { name: 'P', size: 5, showInfobox: false }, theme);

        // Punto para definir la recta l
        els.A = createPoint(board, [-3, -1], { name: '', size: 0, visible: false, fixed: true }, theme);

        els.rectaL = createLine(board, [els.P, els.A], { 
          name: 'l', withLabel: true, label: { position: 'lft', offset: [15, 15] }, strokeWidth: 2.5
        }, theme);

        // Punto Q sobre la recta l (ahora visible por defecto)
        els.Q = createGlider(board, [3, 1, els.rectaL], { 
          name: 'Q', size: 5, strokeColor: theme.terracota, fillColor: theme.terracota, showInfobox: false, visible: true, label: { strokeColor: theme.terracota }
        }, theme);

        // Transformación de rotación para la recta m
        // Se inicializa con un ángulo que luego se animará
        els.angleVar = board.create('slider', [[-4, -4], [2, -4], [0, 0.5, 0.5]], { visible: false });
        
        els.tRot = board.create('transform', [() => els.angleVar.Value(), els.P], { type: 'rotate' });
        els.B = board.create('point', [els.A, els.tRot], { visible: false });

        els.rectaM = createLine(board, [els.P, els.B], { 
          name: 'm', strokeColor: theme.terracota, strokeWidth: 2.5, withLabel: true, label: { position: 'lft', offset: [15, -15], strokeColor: theme.terracota }
        }, theme);
      }}
      onUpdate={(_board, els, _theme, isStep, isHL) => {
        const s1 = isStep('step1');
        const s2 = isStep('step2');
        const s3 = isStep('step3');
        const s4 = isStep('step4');

        const hlL = isHL('rectaL');
        const hlM = isHL('rectaM');
        const hlP = isHL('puntoP');
        const hlQ = isHL('puntoQ');
        const hlRectas = isHL('rectas');

        const anyH = hlL || hlM || hlP || hlQ || hlRectas;
        
        // Base Opacity Logic
        const getOp = (hovered: boolean, activeInStep: boolean) => {
          if (hovered) return 1;
          if (anyH) return 0.2;
          return activeInStep ? 1 : 0.2;
        };

        const getWidth = (hovered: boolean) => hovered ? 4 : 2.5;

        const stepActL = s1 || s2 || s3 || s4;
        els.rectaL.setAttribute({ strokeOpacity: getOp(hlL || hlRectas, stepActL), strokeWidth: getWidth(hlL || hlRectas) });
        if (els.rectaL.label) els.rectaL.label.setAttribute({ strokeOpacity: getOp(hlL || hlRectas, stepActL) });

        const stepActM = s1 || s2 || s3 || s4;
        els.rectaM.setAttribute({ strokeOpacity: getOp(hlM || hlRectas, stepActM), strokeWidth: getWidth(hlM || hlRectas) });
        if (els.rectaM.label) els.rectaM.label.setAttribute({ strokeOpacity: getOp(hlM || hlRectas, stepActM) });

        const stepActP = s1 || s2 || s3 || s4;
        els.P.setAttribute({ fillOpacity: getOp(hlP, stepActP), strokeOpacity: getOp(hlP, stepActP) });
        if (els.P.label) els.P.label.setAttribute({ strokeOpacity: getOp(hlP, stepActP) });
        
        const stepActQ = s1 || s2 || s3 || s4;
        els.Q.setAttribute({ fillOpacity: getOp(hlQ, stepActQ), strokeOpacity: getOp(hlQ, stepActQ) });
        if (els.Q.label) els.Q.label.setAttribute({ strokeOpacity: getOp(hlQ, stepActQ) });

        // Lógica de colapso de la recta m sobre l
        if (s3 || s4) {
          // Valor 0 corresponde a x=-4 en el slider
          els.angleVar.moveTo([-4, -4], 500); 
        } else {
          // Valor 0.5 corresponde a x=2 en el slider
          els.angleVar.moveTo([2, -4], 500);
        }
      }}
    />
  );
};
