# Guida al Codice Sorgente - Elaborato di Ingegneria del Software

Questa guida è stata pensata per aiutare la professoressa in fase di valutazione a trovare l'implementazione pratica di quanto descritto teoricamente nel documento LaTeX, in particolare per il mapping dell'architettura **BCED**.

Tutto il nucleo del caso d'uso *"Valutazione Grafo Attivo"* si trova nella directory:
`s src/`

## Corrispondenza Architettura (Capitolo 5)

1. **Package Database (5.1)**
   - **Path:** `src/database/dao/content/ContentStore.ts`
   - **Path:** `src/database/graph_structure.json`
   - **Descrizione:** `ContentStore` (DAO Singleton) carica e valida i contenuti MDX. `graph_structure.json` contiene la struttura DAG pre-calcolata.

2. **Package Entity (5.2)**
   - **Path:** `src/entity/Grafo.ts`
   - **Path:** `src/entity/Nodo.ts`
   - **Path:** `src/entity/graphTypes.ts`
   - **Descrizione:** `Grafo` incapsula la struttura DAG e fornisce `evaluate()`, `isDagValid()` e `computeDisabledAxiomsFromModels()`. `Nodo` è il value object con `isSatisfiedBy()`. `graphTypes.ts` definisce le interfacce del dominio.

3. **Package Controller (5.3)**
   - **Path:** `src/controller/store/GraphSandboxStore.ts`
   - **Descrizione:** Store Zustand che orchestra il caso d'uso ValutaGrafoAttivo. Istanzia `Grafo` e chiama `grafo.evaluate()` a ogni toggle di un assioma.

4. **Package Boundary (5.4)**
   - **Path:** `src/boundary/components/ui/AxiomSandboxPanel.tsx`
   - **Descrizione:** Componente React che mostra gli assiomi e invia l'evento `toggleAxiom()` al Controller.

## Riferimenti per i Test (Capitolo 6)

- **Test Strutturale / Vitest (6.1 & 6.2):**
  - **Path:** `tests/entity/grafo.test.ts`
  - **Descrizione:** Test unitari per `Grafo.evaluate()` e `Grafo.computeDisabledAxiomsFromModels()`, corrispondenti ai test case derivati nel Capitolo 3.
