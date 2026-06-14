# Product Requirements Document (PRD)
**Proyecto:** Matematika (Interactive Digital Garden)
**Target Audience:** Estudiantes de 1º y 2º de Bachillerato (Preparación EBAU/Selectividad).
**Objetivo Principal:** Desarrollar una SPA (Single Page Application) educativa que relacione los conceptos matemáticos de Bachillerato visualmente, demostrando que el Álgebra, Análisis, Geometría y Estadística son ramas interconectadas.

## 1. Visión del Producto
El estudiante no debe leer "páginas estáticas". Cada concepto (Nodo) forma parte de un Grafo Acíclico Dirigido (DAG). Si un estudiante lee sobre "Optimización", el sistema debe exigirle y mostrarle las dependencias de "Derivadas" y "Cálculo de Máximos/Mínimos". 

## 2. Historias de Usuario (User Stories)
*   **Como estudiante**, quiero interactuar con las fórmulas matemáticas (hacer clic en variables) para ver cómo reacciona el plano 2D/3D en tiempo real.
*   **Como estudiante**, quiero navegar desde una "Definición" a un "Teorema" visualizando el hilo conductor lógico de los conceptos.
*   **Como desarrollador/arquitecto**, quiero que cada lección esté escrita en formato Markdown (MDX) para separar el contenido teórico del código de renderizado y simulación.

## 3. Requisitos Funcionales
1.  **Parseo de Grafos MDX:** La aplicación debe leer archivos `.mdx` y extraer su `Frontmatter` (YAML) para construir el índice de navegación de forma dinámica.
2.  **Interactividad Bidireccional:** El texto matemático (KaTeX) debe tener *listeners* de eventos. Al interactuar con el texto, el simulador gráfico adyacente debe actualizarse y viceversa.
3.  **Simulación Modular:** Los componentes de simulación gráfica deben estar desacoplados. Un nodo MDX decidirá si invoca un simulador en 2D (JSXGraph) o en 3D (Three.js).

## 4. Requisitos No Funcionales
1.  **Performance:** Al ser simulaciones matemáticas, se exige un uso mínimo de re-renderizados en React. El estado debe gestionarse atómicamente.
2.  **Mantenibilidad:** Separación estricta (Separation of Concerns). El motor de renderizado 3D no debe conocer la lógica de negocio; solo debe leer el estado y dibujarlo.
3.  **Accesibilidad:** Codificación estricta de color (Design Tokens) aplicada uniformemente a UI, Ecuaciones y Lienzo para reducir la carga cognitiva.
