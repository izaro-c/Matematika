# El Grafo de Conocimiento y las relaciones lógicas

El Grafo de Conocimiento organiza todo el contenido de Matematika como una red semántica. En lugar de ser un listado estático de páginas, almacena las relaciones de dependencia entre axiomas, definiciones, teoremas, lemas, corolarios y modelos.

---

## Ordenación topológica y prevención de ciclos

Para evitar inconsistencias (como que un teorema dependa de sí mismo o que una demostración use un corolario posterior), el script [scripts/core/validate-logical-graph.ts](file:///home/izaro/Proiektuak/Matematika_Drafts/scripts/core/validate-logical-graph.ts) clasifica el contenido en una jerarquía por niveles:

| Tipo | Nivel | Regla |
|---|---|---|
| `definicion` (primitiva) | `-1` | **Nodos raíz**: Conceptos básicos sin dependencias requeridas. |
| `axioma` | `0` | Premisas fundamentales. Solo pueden depender de definiciones primitivas. |
| `lema` | `2` | Resultados auxiliares. |
| `definicion` / `teorema` | `3` | Conceptos y teoremas estándar. |
| `corolario` | `4` | Consecuencia directa de un teorema. |
| `demostracion` | `5` | Pasos formales de una prueba. |
| `sistema-axiomatico` | `6` | Conjunto coordinado de axiomas. |
| `modelo` | `7` | Estructuras matemáticas de alto nivel. |

> **Regla de no circularidad (DAG)**: Un nodo de nivel $N$ solo puede depender de nodos con nivel $\le N$. La validación usa una Búsqueda en Profundidad (DFS) para detectar ciclos. Si se encuentra una dependencia circular, el proceso de compilación se detiene inmediatamente con un error.

---

## Manejo de axiomas incompatibles (`alternativeGroup`)

Existen teorías matemáticas con postulados mutuamente exclusivos (por ejemplo, el quinto postulado euclídeo frente a la geometría no euclídea).

Para evitar mezclar axiomas incompatibles dentro del mismo sistema:
- Cada axioma puede especificar la propiedad `alternativeGroup`.
- El script de validación revisa los nodos de tipo `sistema-axiomatico` y comprueba que ningún sistema contenga dos axiomas del mismo `alternativeGroup`.

---

## Lienzo interactivas 2D (`react-force-graph-2d`)

La vista interactiva del grafo ([src/fixed-pages/graph/GraphPage.tsx](file:///home/izaro/Proiektuak/Matematika_Drafts/src/fixed-pages/graph/GraphPage.tsx)) utiliza la librería `react-force-graph-2d`:

- **Cálculos en Web Worker**: La resolución de nodos activos y propagación de verdad ante cambios de axiomas se procesa en un subproceso (`graphWorkerClient.ts`) para mantener la interfaz a 60 FPS sin bloqueos.
- **Resaltado de conexiones**: Al pasar el cursor por encima de un concepto, se destacan sus dependencias (de qué depende) y sus aplicaciones (quién lo utiliza).
- **Buscador y centrado**: Permite buscar cualquier nodo por nombre y centrar la cámara mediante animaciones suaves (`centerAt`).

---

## Archivo estructurado (`graph_structure.json`)

Cada vez que se ejecuta `npm run validate-graph`, se genera `src/data/graph/graph_structure.json`. Este JSON sirve como base de datos precalculada para renderizar el lienzo del grafo y resolver enlaces sin necesidad de escanear los archivos MDX en tiempo de ejecución.
