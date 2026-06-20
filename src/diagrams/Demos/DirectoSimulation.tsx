import JXGBoard from '../../components/core/JXGBoard';
import { Colors } from '../../utils/theme';

export const DirectoSimulation = () => {
  const drawLogic = (board: any) => {
    // Escenario de deducción secuencial: P -> P1 -> P2 -> Q
    // Simulado visualmente como pasos que se revelan
    
    // Hipótesis P: Un triángulo isósceles
    const A = board.create('point', [-3, -1], { name: 'P (Hipótesis)', size: 5, color: Colors.palette.primary, fixed: true });
    
    // Deducciones intermedias
    const P1 = board.create('point', [-1, 2], { name: 'P₁', size: 4, color: Colors.palette.secondary, fixed: true });
    const P2 = board.create('point', [1, 2], { name: 'P₂', size: 4, color: Colors.palette.secondary, fixed: true });
    
    // Conclusión Q
    const Q = board.create('point', [3, -1], { name: 'Q (Tesis)', size: 5, color: Colors.palette.tertiary, fixed: true });

    // Enlaces de implicación
    board.create('arrow', [A, P1], { strokeColor: Colors.palette.text, strokeWidth: 2 });
    board.create('arrow', [P1, P2], { strokeColor: Colors.palette.text, strokeWidth: 2 });
    board.create('arrow', [P2, Q], { strokeColor: Colors.palette.text, strokeWidth: 2 });
  };

  return (
    <div className="w-full flex flex-col items-center my-8">
      <div className="text-center italic mb-4 text-pizarra text-sm">Visualización del Método Directo: Cadena de implicaciones lógicas ($P \implies P_1 \implies P_2 \implies Q$)</div>
      <JXGBoard logic={drawLogic} bounds={[-4, 4, 4, -2]} className="w-full max-w-lg aspect-video rounded-md border-2 border-carbon/10 shadow-md" />
    </div>
  );
};
