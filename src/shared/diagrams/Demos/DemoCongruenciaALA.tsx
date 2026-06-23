import { MathBoard } from '@/features/graph/ui/MathBoard';
import { 
  createPoint, createPolygon, createAngle, createLine 
} from '@/features/graph/ui/MathFactory';

export const DemoCongruenciaALA = () => {
  return (
    <MathBoard
      boundingbox={[-4, 3, 5, -2]}
      onInit={(board, els, theme) => {
        // Triángulo 1 (Interactivo)
        els.B = createPoint(board, [-3, -1], { name: 'B', fixed: true }, theme);
        els.A = createPoint(board, [-2, 2], { name: 'A', label: { offset: [-5, 15] } }, theme);
        els.C = createPoint(board, [-1, -1], { name: 'C', label: { offset: [15, -15] } }, theme);

        els.poly1 = createPolygon(board, [els.A, els.B, els.C], {}, theme);

        // Triángulo 2 (Clon rígido desplazado +4 en X)
        els.B_prim = createPoint(board, [() => els.B.X() + 4, () => els.B.Y()], { name: "B'", fixed: true }, theme);
        els.A_prim = createPoint(board, [() => els.A.X() + 4, () => els.A.Y()], { name: "A'", fixed: true, label: { offset: [-5, 15] } }, theme);
        els.C_prim = createPoint(board, [() => els.C.X() + 4, () => els.C.Y()], { name: "C'", fixed: true, label: { offset: [15, -15] } }, theme);

        els.poly2 = createPolygon(board, [els.A_prim, els.B_prim, els.C_prim], {}, theme);

        // Ángulos
        els.angA1 = createAngle(board, [els.B, els.A, els.C], { name: '', fillOpacity: 0, strokeWidth: 0 }, theme);
        els.angA2 = createAngle(board, [els.B_prim, els.A_prim, els.C_prim], { name: '', fillOpacity: 0, strokeWidth: 0 }, theme);

        els.angB1 = createAngle(board, [els.C, els.B, els.A], { name: '', fillOpacity: 0, strokeWidth: 0 }, theme);
        els.angB2 = createAngle(board, [els.C_prim, els.B_prim, els.A_prim], { name: '', fillOpacity: 0, strokeWidth: 0 }, theme);

        // Semirrecta A'C'
        els.rayAC_prim = createLine(board, [els.A_prim, els.C_prim], { 
          straightFirst: false, straightLast: true, strokeColor: theme.salvia, strokeWidth: 3, dash: 2, visible: false 
        }, theme);

        // Punto C* (se superpone a C')
        els.C_star = createPoint(board, [() => els.C.X() + 4, () => els.C.Y()], { 
          name: "C*", size: 6, fillColor: theme.salvia, strokeColor: theme.salvia, fixed: true, visible: false, label: { offset: [15, 10], strokeColor: theme.salvia }
        }, theme);
      }}
      onUpdate={(_board, els, theme, isStep, isHL) => {
        // --- 0. RESET ---
        els.poly1.setAttribute({ fillOpacity: 0.05 });
        els.poly1.borders.forEach((b: any) => b.setAttribute({ strokeColor: theme.carbon, strokeWidth: 2, strokeOpacity: 1 }));
        
        els.poly2.setAttribute({ fillOpacity: 0.05 });
        els.poly2.borders.forEach((b: any) => b.setAttribute({ strokeColor: theme.carbon, strokeWidth: 2, strokeOpacity: 1 }));

        els.angA1.setAttribute({ strokeWidth: 0, fillOpacity: 0 });
        els.angA2.setAttribute({ strokeWidth: 0, fillOpacity: 0 });
        els.angB1.setAttribute({ strokeWidth: 0, fillOpacity: 0 });
        els.angB2.setAttribute({ strokeWidth: 0, fillOpacity: 0 });

        els.rayAC_prim.setAttribute({ visible: false, strokeWidth: 3 });
        els.C_star.setAttribute({ visible: false, size: 6 });

        // --- 1. APLICAR VISIBILIDAD BASE (STEP) ---
        if (isStep('step1')) {
            els.rayAC_prim.setAttribute({ visible: true });
            els.C_star.setAttribute({ visible: true });
        }

        if (isStep('step2')) {
            els.poly1.setAttribute({ fillOpacity: 0.1 });
            els.poly2.setAttribute({ fillOpacity: 0.1 });
            
            els.poly1.borders[0].setAttribute({ strokeWidth: 4, strokeColor: theme.terracota });
            els.poly2.borders[0].setAttribute({ strokeWidth: 4, strokeColor: theme.terracota });
            
            els.poly1.borders[2].setAttribute({ strokeWidth: 4, strokeColor: theme.terracota });
            els.poly2.borders[2].setAttribute({ strokeWidth: 4, strokeColor: theme.terracota });

            els.angA1.setAttribute({ strokeWidth: 2, fillOpacity: 0.2 });
            els.angA2.setAttribute({ strokeWidth: 2, fillOpacity: 0.2 });
            
            els.C_star.setAttribute({ visible: true });
        }

        if (isStep('step3')) {
            els.poly1.setAttribute({ fillOpacity: 0.2 });
            els.poly2.setAttribute({ fillOpacity: 0.2 });
            
            els.angB1.setAttribute({ strokeWidth: 2, fillOpacity: 0.2 });
            els.angB2.setAttribute({ strokeWidth: 2, fillOpacity: 0.2 });
            
            els.C_star.setAttribute({ visible: true });
        }

        // --- 2. APLICAR ÉNFASIS (HIGHLIGHT HOVER) ---
        if (isHL('triangle1')) els.poly1.setAttribute({ fillOpacity: 0.3 });
        if (isHL('triangle2')) els.poly2.setAttribute({ fillOpacity: 0.3 });
        if (isHL('sideAB')) {
            els.poly1.borders[0].setAttribute({ strokeWidth: 5, strokeColor: theme.terracota });
            els.poly2.borders[0].setAttribute({ strokeWidth: 5, strokeColor: theme.terracota });
        }
        if (isHL('angleA')) {
            els.angA1.setAttribute({ strokeWidth: 3, fillOpacity: 0.4 });
            els.angA2.setAttribute({ strokeWidth: 3, fillOpacity: 0.4 });
        }
        if (isHL('angleB')) {
            els.angB1.setAttribute({ strokeWidth: 3, fillOpacity: 0.4 });
            els.angB2.setAttribute({ strokeWidth: 3, fillOpacity: 0.4 });
        }
        if (isHL('rayAC')) els.rayAC_prim.setAttribute({ visible: true, strokeWidth: 4 });
        if (isHL('pointC')) els.C_star.setAttribute({ visible: true, size: 8 });
      }}
    />
  );
};
