import { MathBoard } from '@/features/graph/ui/MathBoard';
import { 
  createPoint, createLine, createSegment, createAngle, createPolygon, createTicks, createGlider 
} from '@/features/graph/ui/MathFactory';
import { StyleManager } from '@/features/graph/ui/MathUtils';

export const DemoTrianguloIsosceles = () => {
  return (
    <MathBoard
      boundingbox={[-4, 4, 4, -2]}
      onInit={(board, els, theme) => {
        // Eje vertical para restringir el movimiento de A y mantener isósceles
        els.yAxis = createLine(board, [[0, 0], [0, 1]], { visible: false }, theme);

        els.A = createGlider(board, [0, 2, els.yAxis], { 
          name: 'A', label: { offset: [-5, 15] }
        }, theme);

        els.B = createPoint(board, [-2, -1], { 
          name: 'B', fixed: true, label: { offset: [-15, -15] }
        }, theme);

        els.C = createPoint(board, [2, -1], { 
          name: 'C', fixed: true, label: { offset: [5, -15] }
        }, theme);

        // Lados del triángulo
        els.segAB = createSegment(board, [els.A, els.B], { name: '', strokeWidth: 2 }, theme);
        els.segAC = createSegment(board, [els.A, els.C], { name: '', strokeWidth: 2 }, theme);
        els.segBC = createSegment(board, [els.B, els.C], { name: '', strokeWidth: 2 }, theme);

        // Bisectriz / Mediana
        els.D = createPoint(board, [0, -1], { 
          name: 'D', size: 4, fixed: true, label: { offset: [-5, -20] }
        }, theme);

        els.bisectriz = createSegment(board, [els.A, els.D], { name: '', strokeColor: theme.terracota, strokeWidth: 2, dash: 2 }, theme);

        // Ángulos
        els.angBAD = createAngle(board, [els.B, els.A, els.D], { 
          radius: 1, fillColor: theme.terracota, fillOpacity: 0.2, strokeColor: theme.terracota, strokeWidth: 2 
        }, theme);

        els.angCAD = createAngle(board, [els.D, els.A, els.C], { 
          radius: 1, fillColor: theme.salvia, fillOpacity: 0.2, strokeColor: theme.salvia, strokeWidth: 2 
        }, theme);

        els.angB = createAngle(board, [els.C, els.B, els.A], { 
          radius: 0.8, fillColor: theme.terracota, fillOpacity: 0.2, strokeColor: theme.terracota, strokeWidth: 2 
        }, theme);

        els.angC = createAngle(board, [els.A, els.C, els.B], { 
          radius: 0.8, fillColor: theme.salvia, fillOpacity: 0.2, strokeColor: theme.salvia, strokeWidth: 2 
        }, theme);

        // Polígonos para las áreas de los triángulos congruentes
        els.polyIzq = createPolygon(board, [els.A, els.B, els.D], { 
          borders: { visible: false }, vertices: { visible: false }, fillColor: theme.terracota, fillOpacity: 0 
        }, theme);

        els.polyDer = createPolygon(board, [els.A, els.C, els.D], { 
          borders: { visible: false }, vertices: { visible: false }, fillColor: theme.salvia, fillOpacity: 0 
        }, theme);

        // Marcas de congruencia (tick marks en AB y AC)
        els.tickAB = createTicks(board, [els.segAB, 1], { strokeWidth: 2 }, theme);
        els.tickAC = createTicks(board, [els.segAC, 1], { strokeWidth: 2 }, theme);
      }}
      onUpdate={(_board, els, theme, isStep, isHL) => {
        const anyH = ['triangulo-abc', 'triangulo-izq', 'triangulo-der', 'bisectriz', 'punto-d', 'angulo-bad', 'angulo-cad', 'angulo-b', 'angulo-c', 'lado-ab', 'lado-ac', 'lado-ad'].some(isHL);
        const styler = new StyleManager(isStep, isHL, anyH, theme);

        // Puntos
        const actA = styler.isStep(['triangulo-abc', 'lado-ab', 'lado-ac', 'bisectriz', 'angulo-bad', 'angulo-cad', 'triangulo-izq', 'triangulo-der', 'lado-ad']);
        const hlA = styler.isHL(['triangulo-abc', 'lado-ab', 'lado-ac', 'bisectriz', 'angulo-bad', 'angulo-cad', 'triangulo-izq', 'triangulo-der', 'lado-ad']);
        els.A.setAttribute({ strokeOpacity: styler.getOp(hlA, actA, 0.3), fillOpacity: styler.getOp(hlA, actA, 0.3) });
        
        const actB = styler.isStep(['triangulo-abc', 'lado-ab', 'angulo-b', 'triangulo-izq']);
        const hlB_pt = styler.isHL(['triangulo-abc', 'lado-ab', 'angulo-b', 'triangulo-izq']);
        els.B.setAttribute({ strokeOpacity: styler.getOp(hlB_pt, actB, 0.3), fillOpacity: styler.getOp(hlB_pt, actB, 0.3) });
        
        const actC = styler.isStep(['triangulo-abc', 'lado-ac', 'angulo-c', 'triangulo-der']);
        const hlC_pt = styler.isHL(['triangulo-abc', 'lado-ac', 'angulo-c', 'triangulo-der']);
        els.C.setAttribute({ strokeOpacity: styler.getOp(hlC_pt, actC, 0.3), fillOpacity: styler.getOp(hlC_pt, actC, 0.3) });

        const actD = styler.isStep(['punto-d', 'bisectriz', 'lado-ad', 'triangulo-izq', 'triangulo-der']);
        const hlD_pt = styler.isHL(['punto-d', 'bisectriz', 'lado-ad', 'triangulo-izq', 'triangulo-der']);
        const visD = actD || hlD_pt || styler.isStep(['angulo-bad', 'angulo-cad']) || styler.isHL(['angulo-bad', 'angulo-cad']);
        els.D.setAttribute({ 
          strokeOpacity: styler.getOp(hlD_pt, actD, 0.3), 
          fillOpacity: styler.getOp(hlD_pt, actD, 0.3),
          visible: visD
        });
        if (els.D.label) els.D.label.setAttribute({ visible: visD });

        // Lados perimetrales
        const actAB = styler.isStep(['triangulo-abc', 'lado-ab', 'triangulo-izq']);
        const hl_AB = styler.isHL(['triangulo-abc', 'lado-ab', 'triangulo-izq']);
        els.segAB.setAttribute({ 
          strokeOpacity: styler.getOp(hl_AB, actAB, 0.3), 
          strokeWidth: styler.getW(styler.isHL('lado-ab')),
          strokeColor: styler.getC(styler.isHL('lado-ab'), theme.carbon, theme.terracota) 
        });
        els.tickAB.setAttribute({ strokeOpacity: styler.getOp(hl_AB, actAB, 0.3) });

        const actAC = styler.isStep(['triangulo-abc', 'lado-ac', 'triangulo-der']);
        const hl_AC = styler.isHL(['triangulo-abc', 'lado-ac', 'triangulo-der']);
        els.segAC.setAttribute({ 
          strokeOpacity: styler.getOp(hl_AC, actAC, 0.3), 
          strokeWidth: styler.getW(styler.isHL('lado-ac')),
          strokeColor: styler.getC(styler.isHL('lado-ac'), theme.carbon, theme.salvia) 
        });
        els.tickAC.setAttribute({ strokeOpacity: styler.getOp(hl_AC, actAC, 0.3) });

        const actBC = styler.isStep(['triangulo-abc', 'triangulo-izq', 'triangulo-der']);
        const hl_BC = styler.isHL(['triangulo-abc', 'triangulo-izq', 'triangulo-der']);
        els.segBC.setAttribute({ strokeOpacity: styler.getOp(hl_BC, actBC, 0.3) });

        // Segmento interior AD
        const actAD = styler.isStep(['bisectriz', 'lado-ad', 'triangulo-izq', 'triangulo-der']);
        const hl_AD = styler.isHL(['bisectriz', 'lado-ad', 'triangulo-izq', 'triangulo-der']);
        const visAD = actAD || styler.isStep(['angulo-bad', 'angulo-cad', 'punto-d']) || hl_AD || styler.isHL(['angulo-bad', 'angulo-cad', 'punto-d']);
        els.bisectriz.setAttribute({ 
          strokeOpacity: styler.getOp(hl_AD, actAD, 0.3),
          visible: visAD,
          strokeWidth: styler.getW(styler.isHL(['bisectriz', 'lado-ad'])),
          strokeColor: styler.getC(styler.isHL('lado-ad'), theme.terracota, theme.carbon)
        });

        // Ángulos
        const actBAD = styler.isStep(['angulo-bad', 'triangulo-izq', 'bisectriz']);
        const hl_BAD = styler.isHL(['angulo-bad', 'triangulo-izq', 'bisectriz']);
        els.angBAD.setAttribute({ 
          fillOpacity: styler.getOpAng(hl_BAD, actBAD, 0, 0.3, 0.2), 
          strokeOpacity: styler.getOp(hl_BAD, actBAD, 0),
          visible: actBAD || hl_BAD 
        });

        const actCAD = styler.isStep(['angulo-cad', 'triangulo-der', 'bisectriz']);
        const hl_CAD = styler.isHL(['angulo-cad', 'triangulo-der', 'bisectriz']);
        els.angCAD.setAttribute({ 
          fillOpacity: styler.getOpAng(hl_CAD, actCAD, 0, 0.3, 0.2), 
          strokeOpacity: styler.getOp(hl_CAD, actCAD, 0),
          visible: actCAD || hl_CAD 
        });

        const actB_ang = styler.isStep(['angulo-b', 'triangulo-izq']);
        const hl_B_ang = styler.isHL(['angulo-b', 'triangulo-izq']);
        els.angB.setAttribute({ 
          fillOpacity: styler.getOpAng(hl_B_ang, actB_ang, 0, 0.3, 0.2), 
          strokeOpacity: styler.getOp(hl_B_ang, actB_ang, 0),
          visible: actB_ang || hl_B_ang 
        });

        const actC_ang = styler.isStep(['angulo-c', 'triangulo-der']);
        const hl_C_ang = styler.isHL(['angulo-c', 'triangulo-der']);
        els.angC.setAttribute({ 
          fillOpacity: styler.getOpAng(hl_C_ang, actC_ang, 0, 0.3, 0.2), 
          strokeOpacity: styler.getOp(hl_C_ang, actC_ang, 0),
          visible: actC_ang || hl_C_ang 
        });

        // Polígonos para resaltado de áreas
        els.polyIzq.setAttribute({ fillOpacity: styler.isHL('triangulo-izq') ? 0.15 : 0 });
        els.polyDer.setAttribute({ fillOpacity: styler.isHL('triangulo-der') ? 0.15 : 0 });
      }}
    />
  );
};
