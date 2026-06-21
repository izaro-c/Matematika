/**
 * @fileoverview DTO per il trasferimento dello stato del grafo 
 * dal Controller (Zustand) alla Boundary (React View).
 * 
 * Questo DTO previene l'accoppiamento stretto tra la vista
 * e l'entità complessa GraphStructure.
 */

export interface GraphEvaluationDTO {
    /** 
     * Elenco dei nodi attivi e dimostrati.
     * Trasformato da Set<string> a Array per facile iterazione nella UI.
     */
    validNodesList: string[];
    
    /** 
     * Stato degli assiomi attualmente selezionati dall'utente.
     */
    activeAxiomsMap: Record<string, boolean>;

    /**
     * Flag che indica se il sistema ha riscontrato un ciclo infinito.
     */
    hasCyclicError: boolean;
}
