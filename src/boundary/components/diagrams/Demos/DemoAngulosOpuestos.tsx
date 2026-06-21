import { MathBoard } from '@/boundary/components/graph/MathBoard';
import { 
  createPoint, createLine, createAngle, createGlider 
} from '../../graph/MathFactory';
import { StyleManager } from '@/boundary/components/graph/MathUtils';

export const DemoAngulosOpuestos = () => {
  return (
    <MathBoard
      boundingbox={[-5, 4, 5, -4]}
      onInit={(board, els, theme) => {
        // Origen
        els.O = createPoint(board, [0, 0], { name: 'O', size: 4, fixed: true }, theme);

        // Puntos para la recta l (horizontal fija)
        els.pA = createPoint(board, [3, 0], { name: '', size: 0, visible: false, fixed: true }, theme);
        els.pB = createPoint(board, [-3, 0], { name: '', size: 0, visible: false, fixed: true }, theme);
        els.rectaL = createLine(board, [els.pA, els.pB], { 
          name: 'l', withLabel: true, label: { position: 'rt', offset: [10, 10] }, strokeWidth: 2.5
        }, theme);

        // Circulo invisible para limitar a pC y que no se acerque demasiado al origen
        els.pRight = createPoint(board, [2.5, 0], { visible: false }, theme);
        els.pLeft = createPoint(board, [-2.5, 0], { visible: false }, theme);
        els.arc = board.create('arc', [els.O, els.pRight, els.pLeft], { visible: false });
        
        // Punto arrastrable para la recta m
        els.pC = createGlider(board, [2, 2, els.arc], { name: '', withLabel: false }, theme);

        // Punto opuesto en m
        els.pD = createPoint(board, [() => -els.pC.X(), () => -els.pC.Y()], { name: '', size: 0, visible: false }, theme);
        els.rectaM = createLine(board, [els.pC, els.pD], { 
          name: 'm', strokeColor: theme.terracota, strokeWidth: 2.5, withLabel: true, label: { position: 'rt', offset: [10, 15], strokeColor: theme.terracota }
        }, theme);

        // Ángulos
        els.ang1 = createAngle(board, [els.pA, els.O, els.pC], { name: '1', radius: 1, fillColor: theme.terracota, fillOpacity: 0.1, strokeColor: theme.terracota, strokeWidth: 2, label: { fontSize: 16, strokeColor: theme.terracota } }, theme);
        els.ang2 = createAngle(board, [els.pC, els.O, els.pB], { name: '2', radius: 1, fillColor: theme.salvia, fillOpacity: 0.1, strokeColor: theme.salvia, strokeWidth: 2, label: { fontSize: 16, strokeColor: theme.salvia } }, theme);
        els.ang3 = createAngle(board, [els.pB, els.O, els.pD], { name: '3', radius: 1, fillColor: theme.terracota, fillOpacity: 0.1, strokeColor: theme.terracota, strokeWidth: 2, label: { fontSize: 16, strokeColor: theme.terracota } }, theme);
        els.ang4 = createAngle(board, [els.pD, els.O, els.pA], { name: '4', radius: 1, fillColor: theme.salvia, fillOpacity: 0.1, strokeColor: theme.salvia, strokeWidth: 2, label: { fontSize: 16, strokeColor: theme.salvia } }, theme);
      }}
      onUpdate={(_board, els, theme, isStep, isHL) => {
        const anyH = ['lineL', 'lineM', 'angle1', 'angle2', 'angle3', 'angle4', 'supp12', 'supp23', 'congruence13'].some(isHL);
        const styler = new StyleManager(isStep, isHL, anyH, theme);

        // Steps
        const s1 = styler.isStep(['lineL', 'lineM', 'angle1', 'angle2', 'angle3', 'angle4']);
        const s2 = styler.isStep(['supp12', 'supp23']);
        const s3 = styler.isStep('congruence13');

        // Actualizar líneas
        const stepActL = s1 || s2 || s3 || styler.isStep('supp12');
        const actHL_L = styler.isHL(['lineL', 'supp12']);
        els.rectaL.setAttribute({ strokeOpacity: styler.getOp(actHL_L, stepActL), strokeWidth: styler.getW(actHL_L, 2.5) });
        if (els.rectaL.label) els.rectaL.label.setAttribute({ strokeOpacity: styler.getOp(actHL_L, stepActL) });

        const stepActM = s1 || s2 || s3 || styler.isStep('supp23');
        const actHL_M = styler.isHL(['lineM', 'supp23']);
        els.rectaM.setAttribute({ strokeOpacity: styler.getOp(actHL_M, stepActM), strokeWidth: styler.getW(actHL_M, 2.5) });
        if (els.rectaM.label) els.rectaM.label.setAttribute({ strokeOpacity: styler.getOp(actHL_M, stepActM) });

        // ang1
        const hA1 = styler.isHL(['angle1', 'supp12', 'congruence13']);
        const sA1 = styler.isStep(['angle1', 'supp12', 'congruence13']);
        els.ang1.setAttribute({ 
          fillOpacity: styler.getOpAng(hA1, sA1), 
          strokeOpacity: styler.getOp(hA1, sA1, 0.1),
          fillColor: styler.getC(styler.isHL('supp12'), theme.salvia, theme.terracota),
          strokeColor: styler.getC(styler.isHL('supp12'), theme.salvia, theme.terracota),
          strokeWidth: styler.getW(hA1, 2, 3)
        });
        if (els.ang1.label) els.ang1.label.setAttribute({ strokeColor: styler.getC(styler.isHL('supp12'), theme.salvia, theme.terracota) });
        
        // ang2
        const hA2 = styler.isHL(['angle2', 'supp12', 'supp23']);
        const sA2 = styler.isStep(['angle2', 'supp12', 'supp23']);
        els.ang2.setAttribute({ 
          fillOpacity: styler.getOpAng(hA2, sA2), 
          strokeOpacity: styler.getOp(hA2, sA2, 0.1),
          fillColor: theme.salvia,
          strokeColor: theme.salvia,
          strokeWidth: styler.getW(hA2, 2, 3)
        });
        
        // ang3
        const hA3 = styler.isHL(['angle3', 'supp23', 'congruence13']);
        const sA3 = styler.isStep(['angle3', 'supp23', 'congruence13']);
        els.ang3.setAttribute({ 
          fillOpacity: styler.getOpAng(hA3, sA3), 
          strokeOpacity: styler.getOp(hA3, sA3, 0.1),
          fillColor: styler.getC(styler.isHL('supp23'), theme.salvia, theme.terracota),
          strokeColor: styler.getC(styler.isHL('supp23'), theme.salvia, theme.terracota),
          strokeWidth: styler.getW(hA3, 2, 3)
        });
        if (els.ang3.label) els.ang3.label.setAttribute({ strokeColor: styler.getC(styler.isHL('supp23'), theme.salvia, theme.terracota) });

        // ang4
        const hA4 = styler.isHL('angle4');
        const sA4 = styler.isStep('angle4');
        els.ang4.setAttribute({ 
          fillOpacity: styler.getOpAng(hA4, sA4), 
          strokeOpacity: styler.getOp(hA4, sA4, 0.1),
          strokeWidth: styler.getW(hA4, 2, 3)
        });
      }}
    >
      <div className="absolute bottom-2 right-2 text-xs font-serif text-carbon/50 pointer-events-none">
        Arrastra el punto de la recta m
      </div>
    </MathBoard>
  );
};
