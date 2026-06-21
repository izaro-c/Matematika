import JXGBoard from '@/boundary/components/core/JXGBoard';
import { Colors } from '@/boundary/utils/theme';

export const ContradictionSimulation = () => {
  const drawLogic = (board: any) => {
    // Escenario hipotético: Dos rectas distintas que se cortan en DOS puntos (absurdo)
    
    // Puntos A y B
    const p1 = board.create('point', [-2, 0], { name: 'A', size: 4, color: Colors.palette.primary });
    const p2 = board.create('point', [2, 0], { name: 'B', size: 4, color: Colors.palette.primary });

    // "Recta" 1 (realmente una curva para simular que pasa por A y B dos veces)
    board.create('functiongraph', [
      (x: number) => 0.5 * (x*x - 4), -3, 3
    ], { strokeColor: Colors.palette.secondary, strokeWidth: 3, name: 'Recta 1 (hipotética)', withLabel: true });

    // Recta 2 (una línea real)
    board.create('line', [p1, p2], { strokeColor: Colors.palette.tertiary, strokeWidth: 3, name: 'Recta 2', withLabel: true });
    
    // Etiqueta de absurdo
    board.create('text', [0, 2, '¡ABSURDO! Violan el Axioma de Incidencia 1'], {
      fontSize: 16, strokeColor: 'red', anchorX: 'middle'
    });
  };

  return (
    <div className="w-full flex flex-col items-center my-8">
      <div className="text-center italic mb-4 text-pizarra text-sm">Visualización de la suposición absurda: "Dos rectas distintas se cortan en dos puntos A y B"</div>
      <JXGBoard logic={drawLogic} bounds={[-4, 4, 4, -4]} className="w-full max-w-lg aspect-video rounded-md border-2 border-red-900/30 shadow-lg" />
    </div>
  );
};
