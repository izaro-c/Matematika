# Guida al Codice Sorgente - Elaborato di Ingegneria del Software

Questa guida è stata pensata per aiutarti (e aiutare la professoressa in fase di valutazione) a trovare l'implementazione pratica di quanto descritto teoricamente nel documento LaTeX, in particolare per il mapping dell'architettura **BCED**.

Tutto il nucleo del caso d'uso *"Valutazione Grafo Attivo"* si trova ora nella directory:
👉 `src/bced/`

## Corrispondenza Architettura (Capitolo 5)

1. **Package Database (5.1)**
   - **Path:** `src/bced/database/graph_structure.json`
   - **Descrizione:** File JSON che agisce come persistence layer statico contenente tutti i teoremi e assiomi (Modello serverless-like).

2. **Package Entity (5.2)**
   - **Path:** `src/bced/entity/graphTypes.ts`
   - **Descrizione:** Interfacce pure TypeScript (es. `GraphStructure`) che descrivono il modello di dominio matematico indipendentemente dalla vista.

3. **Package Controller (5.3)**
   - **Path:** `src/bced/controller/useGraphSandboxStore.ts`
   - **Path:** `src/bced/controller/graphUtils.ts`
   - **Descrizione:** Qui risiede l'intelligenza. L'algoritmo di Topological Sorting descritto nel CFG è la funzione `evaluateActiveGraph` dentro `graphUtils.ts`.

4. **Package Boundary (5.4)**
   - **Path:** `src/bced/boundary/TheoremPage.tsx`
   - **Descrizione:** Componenti React incaricati di raccogliere il click sull'attivazione dell'assioma e inviare la richiesta al Controller.

5. **Package DTO (5.5)**
   - **Path:** `src/bced/dto/GraphDTO.ts`
   - **Descrizione:** Contiene l'oggetto `GraphEvaluationDTO`. È stato creato appositamente per far sì che la vista React non manipoli strutture Set matematiche complesse ma semplici array.

## Riferimenti per i Test (Capitolo 6)

- **Test Strutturale / Vitest (6.1 & 6.2):**
  - **Path:** `tests/cpt.test.tsx` (oppure una suite specifica equivalente in `tests/math-utils.test.ts`). Lì troverai i test unitari e funzionali (come il rilevamento del ciclo infinito) che dimostrano il raggiungimento della Complessità Ciclomatica testata.
