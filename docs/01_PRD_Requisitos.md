# 01 — PRD: Visión y Objetivos del Producto

**Proyecto:** Matematika — Interactive Digital Garden  
**Stack:** React 19 / Vite / TypeScript / Tailwind CSS v4 / MDX / JSXGraph / Three.js / Zustand / Wouter / KaTeX  
**Fecha de creación:** 2026-06-13 · **Revisión:** 2026-06-15

---

## Propósito

Matematika es una enciclopedia matemática interactiva y modular. No es una plataforma de exámenes. No es un PDF interactivo. Es un **Jardín Digital** donde cada concepto matemático existe como un nodo independiente dentro de una red de conocimiento navegable.

El estudiante no lee páginas estáticas. **Interactúa** con ellas, **explora** ramificaciones y **descubre** conexiones entre conceptos.

---

## Público Objetivo

Cualquier persona con interés en las matemáticas. El proyecto es **agnóstico de cualquier currículo educativo local** (español, europeo, etc.). Las referencias a planes de estudio concretos (como la EBAU o Selectividad) solo pueden existir en los "Study Plans" — nunca en el cuerpo teórico de lecciones, definiciones o teoremas.

---

## Principios Inviolables del Producto

### 1. Universalidad y Modularidad del Contenido
- Cada nodo (Teorema, Definición, Lección, Biografía) debe contener **exclusivamente** lo pertinente a su título.
- Un nodo nunca explica otro nodo en su interior. Enlaza a él.
- La capa de currículos (EBAU, etc.) es un grafo *sobre* la base universal, no *dentro* de ella.

### 2. Interactividad como Requisito, no como Extra
- **Toda** lección o teorema que lo permita matemáticamente debe llevar una simulación o visualización adjunta (JSXGraph en 2D o Three.js en 3D).
- Los ejercicios no son preguntas de texto. Son **interacciones**: el alumno rellena variables en la fórmula, arrastra puntos en el plano, o responde inline.

### 3. Exploración por Curiosidad (Marginalia)
- La navegación cruzada entre conceptos ocurre sin cambiar de página. Al clicar en un `<ConceptLink>`, se desliza el **Panel Lateral Derecho (MarginaliaPanel)** con la información contextual del nodo destino.
- Esto evita el problema de los popups recortados en los bordes (bug resuelto el 2026-06-15) y mantiene el flujo de lectura.

### 4. Data-Binding Visual (Texto ↔ Gráfico)
- El texto matemático y la simulación gráfica son hermanos que comparten estado vía Zustand. Son semánticamente inseparables.
- Los colores en el texto y en el gráfico son el mismo token. Si el plano $\pi$ se dibuja en Verde Salvia, en el texto también va en Verde Salvia.

---

## Tipos de Contenido (Taxonomía)

| Tipo | Ruta URL | Carpeta MDX | Descripción |
|---|---|---|---|
| Lección | `/:id` | `src/content/lessons/` | Exposición narrativa de un tema con simulación |
| Teorema | `/teorema/:id` | `src/content/theorems/` | Enunciado formal + demostración + visualizador |
| Definición | `/definicion/:id` | `src/content/definitions/` | Concepto atómico bien definido |
| Ejemplo | `/ejemplo/:id` | `src/content/examples/` | Caso concreto resuelto paso a paso |
| Ejercicio | `/ejercicio/:id` | `src/content/exercises/` | Actividad interactiva con feedback inmediato |
| **Caso de Uso Real** | `/caso/:id` | `src/content/usecases/` | **Página propia** mostrando una aplicación del mundo real de un concepto matemático |
| Biografía | `/bio/:slug` | `src/content/mathematicians/` | Vida y aportaciones de un matemático |
| Plan de Estudio | `/plan/:id` | `src/content/plans/` | Grafo de nodos para un currículo concreto |
| Rama | `/rama/:id` | Generado dinámicamente | Vista agrupada por área matemática |
| Grafo del Conocimiento | `/grafo` | — | Vista visual de todos los nodos como red navegable |

---

## Funcionalidades Requeridas

1. **Rutas dinámicas:** Generadas por `import.meta.glob` desde `ContentStore.ts`. No se registran rutas a mano en `App.tsx`.
2. **Buscador Universal (Omnibar):** Accesible con `Cmd/Ctrl+K`. Filtra sobre todo el ContentStore. ⚠️ *Bug conocido: actualmente muestra el `id` en vez del `title` en los resultados. Pendiente de arreglar.*
3. **Panel Marginalia:** Barra lateral derecha para navegación contextual sin cambio de ruta.
4. **Glosario de Símbolos:** Tooltips rápidos para términos menores (operado por `SymbolDictionaryManager`).
5. **Ejercicios Interactivos:** Cualquier tipo de ejercicio que ayude a comprender mejor el tema. Prioridad en interactividad: fill-in-the-blank, selección múltiple, manipulación gráfica, feedback dinámico con explicación del error común.
6. **Scripts de Automatización:** Para crear y modificar contenido MDX en lote sin editar código React.
7. **Páginas de Casos de Uso Real:** Páginas propias (tipo `/caso/:id`) que muestran aplicaciones del mundo real de un concepto. Son independientes de la lección — no están integradas dentro de ella.
8. **Auto-linking de Matemáticos:** Cuando se menciona un matemático en cualquier página, se debe crear automáticamente un `<ConceptLink>` y, si no existe una página de ese matemático en `src/content/mathematicians/`, se crea automáticamente una página vacía con solo los metadatos mínimos.
9. **Grafo del Conocimiento Visual:** Vista especial donde todos los nodos del ContentStore se muestran como una red navegable (D3.js o similar).
10. **Seguimiento de Progreso:** Via `localStorage`, marcar nodos como leídos/completados. Visible en roadmaps y planes de estudio.
11. **Modo Concentración (Focus Mode):** Botón para ocultar sidebar, panel de navegación y controles, dejando solo el contenido y la simulación.
12. **Editor con Herramienta de Diagramas:** En la página de editor (`/editor`), integrar un link o embed a una herramienta de terceros para generar diagramas interactivos visualmente (e.g., Excalidraw, draw.io).
