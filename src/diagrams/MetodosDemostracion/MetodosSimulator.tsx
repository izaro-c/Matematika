
import { useMathStore } from '../../store/MathStoreContext';
import { DirectProofVisualizer } from './DirectProofVisualizer';
import { ContradictionVisualizer } from './ContradictionVisualizer';
import { InductionVisualizer } from './InductionVisualizer';
import { ContrapositionVisualizer } from './ContrapositionVisualizer';

export const MetodosSimulator = () => {
    const highlight = useMathStore(state => state.variables['highlight']);

    // Por defecto, mostrar una bienvenida lógica si no hay nada resaltado
    if (!highlight) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center font-serif text-carbon">
                <div className="w-24 h-24 mb-6 border-4 border-carbon/20 rounded-full flex items-center justify-center text-4xl font-bold text-carbon/20">
                    ?
                </div>
                <h2 className="text-3xl mb-4 text-pizarra">Mecanismos del Razonamiento</h2>
                <p className="text-xl italic max-w-sm">Pasa el ratón por encima de los métodos en el texto para visualizar su estructura lógica.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex items-center justify-center bg-lienzo transition-all duration-300">
            {highlight === 'directa' && <DirectProofVisualizer />}
            {highlight === 'absurdo' && <ContradictionVisualizer />}
            {highlight === 'induccion' && <InductionVisualizer />}
            {highlight === 'contraposicion' && <ContrapositionVisualizer />}
        </div>
    );
};
