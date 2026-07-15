# Patrones técnicos de diagramas

> Motor de generación de visualizaciones matemáticas interactivas, bidireccionales
> y coherentes con el sistema de diseño Arts & Crafts.

## Arquitectura vigente (Fase 8, prevalece sobre ejemplos históricos)

- Los componentes publicados viven en `src/widgets/diagrams/`; contrato, core y renderer compartidos viven en `src/shared/diagrams/{spec,core,runtime}/`.
- Crear todo diagrama nuevo como `DiagramSpec v2` y montarlo con `DiagramRenderer`. Editor, preview y página publicada consumen la misma spec.
- Tratar `code-preview` únicamente como clasificación conservadora de fuentes heredadas. No es una salida válida al crear un diagrama ni al modificar uno solicitado: migrar ese diagrama a `visual-exact` antes de cambiarlo.
- Si `DiagramSpec v2` o el workbench no representan alguna parte del diagrama deseado, implementar esa capacidad en el producto antes de crear el diagrama. No sustituirla con TSX manual, SVG opaco, Canvas opaco, HTML opaco ni datos escondidos en `extensions`.
- `board.create` solo se admite para auxiliares invisibles aún no cubiertos por `MathFactory`; un elemento reutilizable se añade primero a `src/shared/diagrams/core/MathFactory.ts`.
- Los únicos colores son `lienzo`, `carbon`, `salvia`, `terracota`, `pizarra`, `ocre`, `pavo`, `granada` y `musgo`: `theme.*` en JSXGraph y `var(--theme-*)` en SVG/CSS, sin hex o RGB locales.
- Todo objeto móvil o control tiene alternativa de teclado, nombre accesible e instrucciones. Los targets responden a foco, Enter o Espacio además de puntero.
- Se verifica foco visible, modo claro/oscuro, `prefers-reduced-motion`, viewport responsive y coste acotado con escenas complejas.

## Contrato obligatorio de autoría visual exacta

Antes de crear o modificar un diagrama, leer [visual-authoring.md](visual-authoring.md) y seguir su protocolo de extensión vertical.

Considerar un diagrama **100% editable visualmente** solo cuando se cumpla todo lo siguiente:

1. La fuente autoritativa es una `DiagramSpec v2` canónica generada por `generateDiagramSource`; `parse → generate` reproduce el TSX byte a byte y el catálogo la clasifica como `visual-exact`.
2. Todo estado con significado —objetos, referencias, restricciones, expresiones, estilos, capas, grupos, orden, pasos, overlays, targets, viewport e interacción— se crea, selecciona, modifica, reordena y elimina desde el workbench, sin editar código.
3. Ningún dato necesario para reconstruir o editar el diagrama queda escondido en callbacks, closures, JSX manual, cadenas opacas o `extensions` sin controles visuales.
4. Undo/redo, guardado, reapertura, validación y conflictos conservan exactamente la spec.
5. El lienzo del editor y la página publicada usan `DiagramRenderer`; no existe un renderer paralelo.
6. Toda operación visual funciona también con teclado, foco visible y nombre accesible, y se comprueba en los viewports y temas exigidos por el proyecto.

### Flujo innegociable

1. Describir la escena deseada como inventario de objetos, relaciones, propiedades, controles, pasos y targets.
2. Comparar el inventario con la spec, el renderer y los controles actuales del workbench.
3. Si falta cualquier capacidad, detener la creación del diagrama y ampliar primero el editor siguiendo `visual-authoring.md`. La ampliación forma parte de la misma tarea y no se aplaza como deuda.
4. Crear el diagrama mediante el modelo visual y el adaptador canónico. No escribir lógica manual en el componente publicado.
5. Reabrir el archivo en el workbench, modificar visualmente al menos una propiedad de cada capacidad nueva, guardar y comprobar el roundtrip exacto.
6. No dar por terminado el trabajo mientras el diagrama aparezca como `code-preview`, requiera tocar la pestaña de código para una operación semántica o pierda información al reabrirse.

Una petición que exija una tecnología aún no modelada —por ejemplo una animación Canvas, una estructura HTML o una primitiva SVG especializada— obliga a añadir una representación declarativa y sus controles visuales a la spec y al editor. El motor concreto queda encapsulado en el renderer compartido; nunca se convierte en una segunda fuente autoritativa.

**Skills hermanas:**
- `project-philosophy` — principios no negociables (cárgala si dudas sobre la filosofía del proyecto)
- `page-creator` — para crear la página MDX que alojará este diagrama (cárgala si necesitas crear el contenido también)

## Índice

1. [Tecnologías de Renderizado](#1-tecnologías-de-renderizado)
2. [Arquitectura de Comunicación Bidireccional](#2-arquitectura-de-comunicación-bidireccional)
3. [Paleta Arts & Crafts (Completa)](#3-paleta-arts--crafts-completa)
4. [Anatomía de un Buen Diagrama](#4-anatomía-de-un-buen-diagrama)
5. [Convención de Nombres de Elementos Interactivos](#5-convención-de-nombres-de-elementos-interactivos)
6. [Patrón Canonical JSXGraph](#6-patrón-canonical-jsxgraph)
7. [Patrón SVG + React](#7-patrón-svg--react)
8. [Patrón Canvas 2D](#8-patrón-canvas-2d)
9. [Patrón HTML/CSS](#9-patrón-htmlcss)
10. [Diagramas de Modelo](#10-diagramas-de-modelo)
11. [Diagramas de Falacias / Contraejemplos](#11-diagramas-de-falacias--contraejemplos)
12. [Principios de Animación](#12-principios-de-animación)
13. [Conexión con MDX](#13-conexión-con-mdx)
14. [Diseño Responsivo](#14-diseño-responsivo)
15. [Diagramas de Demostración (Split Layout)](#15-diagramas-de-demostración-split-layout)
16. [Modo Oscuro](#16-modo-oscuro)
17. [Accesibilidad](#17-accesibilidad)
18. [Rendimiento](#18-rendimiento)
19. [Organización de Archivos](#19-organización-de-archivos)
20. [Checklist de Calidad](#20-checklist-de-calidad)
21. [Ángulos Rectos Robustos](#21-ángulos-rectos-robustos)
22. [Pies de Perpendicular y Extensiones de Base](#22-pies-de-perpendicular-y-extensiones-de-base)
23. [Semirrectas (Rayos) — Bisectrices y Alturas](#23-semirrectas-rayos--bisectrices-y-alturas)
24. [Restricciones Geométricas con Drag Handlers](#24-restricciones-geométricas-con-drag-handlers)
25. [Marcado de Ángulos Internos en Polígonos Deformables](#25-marcado-de-ángulos-internos-en-polígonos-deformables)
26. [Clasificación Dinámica en Diagramas](#26-clasificación-dinámica-en-diagramas)
27. [Marcas de Congruencia y Paralelismo Diferenciadas](#27-marcas-de-congruencia-y-paralelismo-diferenciadas)
28. [Puntos Derivados (Computados)](#28-puntos-derivados-computados)
29. [Gliders para Lugares Geométricos](#29-gliders-para-lugares-geométricos)
30. [Prevención de Deformación en Diagramas con Puntos Derivados](#30-prevención-de-deformación-en-diagramas-con-puntos-derivados)
31. [Separación infoText / useEffect — Coordinación Limpia](#31-separación-infotext--useeffect--coordinación-limpia)
32. [InteractiveElement Auto-Referente en MDX](#32-interactiveelement-auto-referente-en-mdx)
33. [Gliders sobre Ejes para Ángulos Rectos Forzados](#33-gliders-sobre-ejes-para-ángulos-rectos-forzados)
34. [Arrastre Mutuo entre Puntos Vinculados](#34-arrastre-mutuo-entre-puntos-vinculados)
35. [Atractores para Ángulos Notables](#35-atractores-para-ángulos-notables)
36. [Visibilidad Dependiente de Geometría vs Highlight](#36-visibilidad-dependiente-de-geometría-vs-highlight)
37. [Uso de Refs para Comunicar Highlight a infoText](#37-uso-de-refs-para-comunicar-highlight-a-infotext)
38. [Diagramas de Congruencia: Dos Triángulos Vinculados](#38-diagramas-de-congruencia-dos-triángulos-vinculados)
39. [Visibilidad Condicional por Highlight Global](#39-visibilidad-condicional-por-highlight-global)
40. [Demostraciones sin Diagrama (layout: text)](#40-demostraciones-sin-diagrama-layout-text)
41. [Traza Lean y Diagramas](#41-traza-lean-y-diagramas)
42. [Interfaz y Overlays Estandarizados](#42-interfaz-y-overlays-estandarizados)
---

## 1. Tecnologías de Renderizado

El renderer compartido puede encapsular cuatro enfoques de renderizado. Esta decisión es interna: el archivo publicado siempre conserva una `DiagramSpec v2` visualmente editable.

| Tecnología | Cuándo usar | Interactividad | Mejor para |
|---|---|---|---|
| **JSXGraph** | Construcciones geométricas complejas, matemática de coordenadas, ejes precisos, puntos arrastrables con snapping, gráficas de funciones, vistas 3D | Alta — puntos arrastrables, gliders, sliders, updates reactivos | Geometría, trigonometría, álgebra lineal, cálculo |
| **SVG + React** | Diagramas 2D personalizados, ilustraciones vectoriales, drag/hover simple, escalado responsivo, transiciones animadas | Media — pointer events, state-driven, declarativo | Geometría personalizada, rellenos de áreas, diagramas con estilo preciso |
| **Canvas 2D + rAF** | Animaciones en tiempo real, sistemas de partículas, movimiento continuo, renderizado frame a frame | Media — imperativo, requestAnimationFrame | Animaciones, datos en vivo, simulaciones físicas |
| **HTML/CSS** | Información estructurada (árboles, tarjetas, matrices), datos no espaciales, árboles de probabilidad, lógica paso a paso | Baja-media — click, hover, transiciones CSS | Lógica, probabilidad, estadística, métodos de demostración |

### Árbol de Decisión

```
¿El concepto es geométrico o espacial?
  ├── Sí → ¿Necesita matemática de coordenadas precisa?
  │   ├── Sí → JSXGraph
  │   └── No  → ¿Es una ilustración personalizada?
  │       ├── Sí → SVG
  │       └── No  → HTML/CSS
  └── No  → ¿Es una animación en tiempo real?
      ├── Sí → Canvas 2D
      └── No  → ¿Es estructurada/no espacial?
          ├── Sí → HTML/CSS
          └── No  → SVG
```

Si el árbol conduce a un backend que la spec o el workbench todavía no soportan, ampliar el editor antes de usarlo. No crear directamente un componente SVG, Canvas o HTML en `src/widgets/diagrams/`.

---

## 2. Arquitectura de Comunicación Bidireccional

Todo diagrama interactivo soporta DOS direcciones de comunicación:

```
Texto MDX (panel derecho)
  │
  ├── <InteractiveElement target="ladoA" color="terracota">a</InteractiveElement>
  │     onMouseEnter → MathStore.setVariable('highlight', 'ladoA')
  │     onMouseLeave → MathStore.setVariable('highlight', null)
  │     ▼
  └── El diagrama recibe highlight → ilumina el elemento 'ladoA'

Diagrama (panel izquierdo)
  │
  ├── Arrastrar un punto → board.on('update') → setVariable('distancia', valor)
  │     ▼
  └── El texto MDX u otros componentes leen el valor via useMathStore
```

### 2.1 Store — MathStore ÚNICO

**Hay un solo store para highlight y step:** `MathStore`. La misma vinculación se usa en demostraciones, métodos, ejercicios y cualquier otra página con texto y diagrama sincronizados.

| Store | Variable | Cuándo usar | Escribe | Leído por |
|---|---|---|---|---|
| **MathStore** | `step` | Progreso de la demostración (paso activo) | `ProofStep` (IntersectionObserver) | `DemonstrationSection` (para elegir diagrama), Diagramas (para visibilidad) |
| **MathStore** | `highlight` | Énfasis visual (hover sobre texto) | `InteractiveElement` (hover) | Diagramas (para engrosar/resaltar elementos temporales) |

**Regla de Oro:** El avance de los pasos (`step`) determina qué geometría existe o es visible. El `highlight` determina exclusivamente qué elementos ya visibles reciben énfasis. NUNCA sobreescribir `step` con un `highlight`.

> **Nota sobre variables adicionales:** El `MathStore` es global a la página. Si vas a establecer variables dinámicas interactivas (ej. arrastrar un punto actualiza una variable `area`), asegúrate de **prefijar** la variable si hay riesgo de colisión con otros diagramas en la misma página (ej. `setVariable('demo1-area', valor)` en lugar de `area` a secas). Para el `highlight` no hace falta prefijar si los `target` son únicos.

### 2.2 Highlight como string o array

El valor de `highlight` puede ser:
- `string` — un solo elemento resaltado: `"ladoA"`
- `string[]` — múltiples elementos resaltados simultáneamente: `["cuadrado-a", "cuadrado-b", "cuadrado-c"]`
- `null` — ningún elemento resaltado

Los diagramas DEBEN manejar los tres casos:

```typescript
const highlight = useMathStore(state => state.variables['highlight']);
const isHighlight = (id: string) =>
    Array.isArray(highlight)
        ? (highlight as string[]).includes(id)
        : highlight === id;
```

---

## 3. Paleta Arts & Crafts (Completa)

Todo diagrama DEBE usar los tokens semánticos de color del proyecto. **NUNCA usar colores hex arbitrarios.** Esto es innegociable.

| Token | JSXGraph | SVG / CSS | Significado matemático |
|---|---|---|---|
| `carbon` | `theme.carbon` | `var(--theme-carbon)` | Ejes, bordes, etiquetas, texto principal, grid |
| `salvia` | `theme.salvia` | `var(--theme-salvia)` | Planos, coeficientes, geometría secundaria, líneas de construcción |
| `terracota` | `theme.terracota` | `var(--theme-terracota)` | Puntos, vectores, incógnitas, elementos interactivos primarios |
| `pizarra` | `theme.pizarra` | `var(--theme-pizarra)` | Distancias, resultados, mediciones secundarias, valores calculados |
| `lienzo` | `theme.lienzo` | `var(--theme-lienzo)` | Fondo del diagrama, áreas de relleno |
| `ocre` | `theme.ocre` | `var(--theme-ocre)` | Resaltados, valores especiales, elementos auxiliares |
| `pavo` | `theme.pavo` | `var(--theme-pavo)` | Acento alternativo, elementos terciarios, construcciones alternativas |
| `granada` | `theme.granada` | `var(--theme-granada)` | Errores, contradicciones, elementos de contraejemplo |
| `musgo` | `theme.musgo` | `var(--theme-musgo)` | Aplicaciones, resultados verificados/correctos |

**Convenciones de opacidad:**
- Relleno normal: `fillOpacity: 0.15–0.25`
- Relleno resaltado: `fillOpacity: 0.5–0.8`
- Trazo normal: `strokeWidth: 1.5–3`
- Trazo resaltado: `strokeWidth: 4–6`
- Punto normal: `size: 4`
- Punto resaltado: `size: 8–10`

---

## 4. Anatomía de un Buen Diagrama

Un diagrama en Matematika NO es solo una ilustración — es una **herramienta pedagógica** que debe ser clara, focalizada y elegante.

### 4.1 Jerarquía Visual

Cada diagrama debe tener exactamente **un elemento primario** por estado de vista. La mirada debe ir a lo que importa.

1. **Primario** (terracota, bold) — el elemento geométrico principal en discusión
2. **Secundario** (salvia, más fino) — líneas de construcción, elementos de soporte
3. **Terciario** (carbon, fino) — ejes, grid, etiquetas
4. **Fondo** (lienzo, opacidad baja) — áreas de relleno

### 4.2 Espacio en Blanco y Composición

- **Padding:** Dejar siempre `boundingbox` con 15–20% de margen alrededor del contenido
- **Densidad:** Si un diagrama tiene más de 8–10 elementos etiquetados, considerar dividirlo en múltiples pasos
- **Etiquetas:** Usar `font-serif` para etiquetas matemáticas, estilo cursiva. Posicionar etiquetas para evitar solapamiento con líneas
- **Balance:** Centrar la geometría relevante en el viewport. No forzar al usuario a hacer pan

### 4.3 Tipografía en Diagramas

- Usar **clases CSS** para estilo de texto en JSXGraph: `cssClass: 'font-serif font-bold italic'`
- Etiquetas de puntos: letras mayúsculas cursivas (p. ej. $A$, $B$, $C$)
- Etiquetas de medidas: pequeñas con unidades (p. ej. $a = 5\text{ cm}$)
- Tamaño de fuente: 16–20px para etiquetas de puntos, 14–16px para medidas

### 4.4 Semántica de Color

Cada color DEBE tener un significado consistente dentro de un mismo diagrama:

| Elemento | Color | Ejemplo |
|---|---|---|
| Dado / conocido | `carbon` | Puntos, segmentos dados por hipótesis |
| Incógnita / a encontrar | `terracota` | El lado o ángulo que se busca |
| Construcción | `salvia` | Líneas auxiliares, pasos intermedios |
| Resultado | `pizarra` | Valor calculado, relación demostrada |
| Error / contradicción | `granada` | Elementos inconsistentes, falacias |
| Verificado | `musgo` | Respuesta correcta, condición verificada |

Dentro de un diagrama, un color NO debe usarse para dos roles semánticos diferentes.

---

## 5. Convención de Nombres de Elementos Interactivos

El string `target` en `<InteractiveElement>` DEBE coincidir exactamente con el nombre usado en la lógica de highlight del diagrama.

| Tipo de elemento | Patrón de naming | Ejemplo |
|---|---|---|
| Puntos / vértices | `p<Letra>` | `pA`, `pB`, `pC` |
| Lados / segmentos | `seg<Letras>` | `segAB`, `segBC` |
| Líneas | `line<Nombre>` | `lineAB`, `lineTangente` |
| Ángulos | `angle<Etiqueta>` | `angleC`, `angleGamma`, `angleABC` |
| Arcos | `arc<Nombre>` | `arcAB`, `arcCirculo` |
| Polígonos / áreas | `poly<Nombre>` | `polyTriangulo`, `polyCuadrado` |
| Mediciones | `meas<Nombre>` | `measDistancia`, `measAngulo` |
| Vectores | `vec<Nombre>` | `vecAB`, `vecResultado` |
| Coordenadas | `coord<Nombre>` | `coordX`, `coordY` |
| Sliders / controles | `slider<Nombre>` | `sliderN`, `sliderZoom` |
| Específico de paso | `step<N><Elemento>` | `step1Line`, `step2Point` |

> **Nota:** Los diagramas existentes usan convenciones como `vertice-a`, `lado-ab`, `cuadrado-a`, `altura-c`. Estas son igualmente válidas mientras el `target` del `InteractiveElement` coincida exactamente. Lo importante es la consistencia dentro de cada diagrama.

---

## 6. Patrón Canónico JSXGraph (MathBoard + MathFactory)

Este patrón es **interno al renderer compartido**. Se usa al implementar una nueva primitiva de `DiagramSpec`; no se copia en un componente publicado. El componente final solo exporta la spec canónica y `<DiagramRenderer spec={...} />`. `MathBoard` gestiona el ciclo de vida y `MathFactory` la identidad visual; queda estrictamente prohibido usar `JXGBoard` o `initBoard` directamente.

### 6.1 Estructura Base de un Diagrama

```tsx
import { MathBoard } from '@/shared/diagrams/core/MathBoard';
import { createPoint, createSegment, createPolygon } from '@/shared/diagrams/core/MathFactory';

export const MiDiagrama = () => {
  return (
    <MathBoard
      boundingbox={[-5, 5, 5, -5]}
      onInit={(board, els, theme) => {
        // 1. CREACIÓN DE GEOMETRÍA (Solo se ejecuta una vez)

        // REGLA DE ORO: ¡NO USAR board.create() DIRECTAMENTE PARA ELEMENTOS COMUNES!
        // Usar siempre las funciones de MathFactory para heredar el estilo.
        els.A = createPoint(board, [-2, -2], { name: 'A' }, theme);
        els.B = createPoint(board, [3, -1], { name: 'B' }, theme);
        els.C = createPoint(board, [0, 3], { name: 'C' }, theme);

        els.segAB = createSegment(board, [els.A, els.B], { name: 'c' }, theme);
        els.poly = createPolygon(board, [els.A, els.B, els.C], { fillColor: theme.terracota }, theme);
      }}
      onUpdate={(_board, els, theme, isStep, isHL) => {
        // 2. LÓGICA REACTIVA (Se ejecuta en cada cambio de paso o highlight)

        // Leer pasos activos
        const s1 = isStep('step1');
        const s2 = isStep('step2');

        // Leer hovers
        const hlA = isHL('vertice-a');
        const hlB = isHL('vertice-b');
        const hlAB = isHL('lado-ab');
        const hlTri = isHL('triangulo');

        // Determinar si hay ALGUN hover activo en el diagrama
        const anyH = hlA || hlB || hlAB || hlTri;

        // FUNCIÓN getOp: Resuelve conflictos entre opacidad de Paso y Hover
        const getOp = (hovered: boolean, activeInStep: boolean, base = 0.2, hlOp = 1) => {
            if (hovered) return hlOp;      // Si se hace hover sobre ESTE elemento, máxima opacidad
            if (anyH) return base;         // Si hay hover sobre OTRO elemento, bajar a opacidad base
            return activeInStep ? 1 : base; // Si no hay hovers, depender del paso actual
        };

        // FUNCIÓN getC: Cambiar el color temporalmente al hacer hover
        const getC = (hovered: boolean, defaultColor: string, hoverColor = theme.terracota) =>
            hovered ? hoverColor : defaultColor;

        // FUNCIÓN getW: Cambiar el grosor de línea al hacer hover
        const getW = (hovered: boolean, defaultWidth = 2, hoverWidth = 4) =>
            hovered ? hoverWidth : defaultWidth;

        // 3. APLICAR ATRIBUTOS VISUALES
        const stepAB = s1 || s2;
        els.segAB.setAttribute({
            strokeOpacity: getOp(hlAB || hlTri, stepAB, 0), // Oculto si stepAB=false y base=0
            strokeWidth: getW(hlAB || hlTri, 2, 4),
            strokeColor: getC(hlAB || hlTri, theme.carbon)
        });

        const stepPoly = s2;
        els.poly.setAttribute({
            fillOpacity: getOp(hlTri, stepPoly, 0, 0.4),
            fillColor: getC(hlTri, theme.salvia)
        });

        // Los puntos siempre visibles, pero brillan si se hace hover
        els.A.setAttribute({
            fillColor: getC(hlA || hlTri, theme.carbon),
            strokeColor: getC(hlA || hlTri, theme.carbon)
        });
      }}
    />
  );
};
```

### 6.2 Regla de Cero Hardcoding (MathFactory)

**Prohibición Estricta:** Si un diagrama necesita un elemento geométrico recurrente (una bisectriz, una mediatriz, una circunferencia inscrita, marcas de congruencia, etc.) que **NO** existe actualmente en `MathFactory.ts`, el desarrollador/agente **NO DEBE** crearlo usando la API cruda `board.create('bisector', ...)` dentro del archivo del diagrama.

En su lugar, debe:
1. Ir a `src/shared/diagrams/core/MathFactory.ts`.
2. Crear la función exportada correspondiente (ej. `createBisector`).
3. Aplicarle el estilo por defecto de la paleta Arts & Crafts.
4. Importarla y usarla en el diagrama.

Esto asegura que nuestra librería visual crezca orgánicamente y que todos los elementos compartan la misma identidad visual.

### 6.3 Separación de isStep y isHL

Como se muestra en el código anterior, NUNCA sobreescribas la visibilidad pura basada en pasos con el highlight. Utiliza funciones generadoras como `getOp`, `getC` y `getW` para coordinar limpiamente la opacidad, color y grosor. Esto previene "paralelogramos fantasma", solapamientos visuales sucios y asegura que un elemento que pertenece a un paso siga brillando si se hace hover sobre su link en el texto.

---

## 7. Patrón SVG + React

Patrón interno para ampliar `DiagramRenderer` con una primitiva declarativa. No autorizar SVG manual como fuente de un diagrama publicado: exponer antes todos sus atributos semánticos en la spec y en `DiagramInspector`.

```typescript
import React, { useRef, useState } from 'react';
import { useMathStore } from '../../store/MathStoreContext';

export const MySvgDiagram: React.FC = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dragging, setDragging] = useState<string | null>(null);
    const highlight = useMathStore(state => state.variables['highlight']);
    const isActive = (id: string) =>
        Array.isArray(highlight) ? (highlight as string[]).includes(id) : highlight === id;

    // Mapeo de coordenadas
    const scale = 50;
    const origin = { x: 50, y: 350 };
    const toPx = (x: number, y: number) => ({
        cx: origin.x + x * scale,
        cy: origin.y - y * scale
    });

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!dragging || !svgRef.current) return;
        const rect = svgRef.current.getBoundingClientRect();
        const mathX = (e.clientX - rect.left - origin.x) / scale;
        const mathY = (origin.y - (e.clientY - rect.top)) / scale;
        // Actualizar estado...
    };

    return (
        <div className="w-full h-full min-h-[400px]">
            <svg ref={svgRef}
                viewBox="0 0 400 400"
                className="w-full max-w-[400px] h-auto touch-none"
                onPointerMove={handlePointerMove}
                onPointerUp={() => setDragging(null)}
                role="img"
                aria-label="Diagrama interactivo SVG"
            >
                {/* Grid */}
                <line stroke="var(--theme-carbon)" strokeWidth="1" strokeDasharray="4" />
                {/* Geometría — SIEMPRE usar CSS variables */}
                <line
                    stroke="var(--theme-terracota)"
                    strokeWidth={isActive('miLinea') ? 6 : 3}
                    opacity={isActive('miLinea') ? 1 : 0.5}
                />
                <circle
                    fill="var(--theme-terracota)"
                    r={isActive('miCirculo') ? 10 : 6}
                />
                <text
                    fill="var(--theme-carbon)"
                    className="font-serif font-bold"
                />
            </svg>
        </div>
    );
};
```

**CRÍTICO:** SVG DEBE usar `var(--theme-<token>)` para TODOS los colores. Esto asegura soporte de modo oscuro. **NUNCA usar valores hex directamente en SVG.**

---

## 8. Patrón Canvas 2D

Patrón interno para ampliar `DiagramRenderer`. Modelar visualmente estado, timeline, parámetros e interacción antes de incorporar Canvas; un bitmap o bucle `requestAnimationFrame` opaco no es editable.

```typescript
import { useRef, useEffect } from 'react';
import { useMathStore } from '../../store/MathStoreContext';

export const MyCanvas = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const highlight = useMathStore(state => state.variables['highlight']);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        let animId: number;

        // Leer colores desde CSS variables
        const getVar = (name: string) =>
            getComputedStyle(document.documentElement).getPropertyValue(name).trim();

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const terracota = getVar('--theme-terracota');
            const carbon = getVar('--theme-carbon');

            ctx.strokeStyle = terracota;
            ctx.lineWidth = 3;
            ctx.beginPath();
            // ... dibujar
            ctx.stroke();

            animId = requestAnimationFrame(render);
        };
        animId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animId);
    }, [highlight]);

    return (
        <canvas
            ref={canvasRef}
            className="w-full h-full touch-none"
            width={600}
            height={400}
            role="img"
            aria-label="Animación interactiva"
        />
    );
};
```

---

## 9. Patrón HTML/CSS

Para datos estructurados (árboles, matrices, tarjetas, árboles de probabilidad), añadir primero el tipo declarativo y sus controles al editor. El siguiente patrón solo orienta la implementación interna del renderer:

```typescript
import React from 'react';
import { useMathStore } from '../../store/MathStoreContext';

export const ProbabilityTree: React.FC = () => {
    const highlight = useMathStore(state => state.variables['highlight']);
    const isActive = (id: string) => highlight === id;

    return (
        <div className="w-full p-8 font-serif">
            <div className={`transition-all ${isActive('rama-a') ? 'scale-105 text-terracota' : 'text-carbon'}`}>
                Rama A
            </div>
            {/* ... */}
        </div>
    );
};
```

---

## 10. Diagramas de Modelo

Los diagramas de modelo muestran una **estructura concreta completa**. Si publican targets, también se conectan con `MathStore`; no existe una excepción que permita un runtime o una paleta paralelos.

```typescript
import { DiagramRenderer } from '@/shared/diagrams/runtime/DiagramRenderer';
import type { DiagramSpecV2 } from '@/shared/diagrams/spec';

export const modeloTresPuntosSpec: DiagramSpecV2 = { /* spec validada */ };
export const ModeloTresPuntos = () => <DiagramRenderer spec={modeloTresPuntosSpec} />;
```

**Diagramas de modelo:**
- Usan siempre el renderer compartido; si la escena aún no es representable, se amplía la spec y el workbench.
- Publican targets estables cuando el texto necesita señalarlos.
- Se guardan como `visual-exact`; `code-preview` queda reservado al legado no intervenido.

---

## 11. Diagramas de Falacias / Contraejemplos

Para diagramas que muestran un razonamiento **incorrecto** o una demostración falaz:

- Mostrar el paso incorrecto en `granada` (color de error)
- Mostrar la versión correcta junto a ella en `musgo` (color de verificado)
- Usar anotaciones explicando POR QUÉ es incorrecto

Ejemplo: La "Falacia del triángulo isósceles" muestra una demostración defectuosa de que todos los triángulos son isósceles, con el error resaltado en `granada` y la construcción correcta en `carbon`.

---

## 12. Principios de Animación

### 12.1 Cuándo Animar

- **Reveal:** Mostrar elementos apareciendo uno a uno para coincidir con los pasos de la demostración
- **Transición:** Mover suavemente entre estados (p. ej. arrastrar un punto actualiza mediciones en tiempo real)
- **Énfasis:** Pulsar o resaltar un elemento cuando el usuario pasa el cursor sobre texto relacionado

### 12.2 Cuándo NO Animar

- Rotación u oscilación continua sin propósito pedagógico
- Animaciones más rápidas que 200ms o más lentas que 800ms (incomodidad cognitiva)
- Animaciones que cambian el layout mientras el usuario interactúa
- Efectos gratuitos (partículas, glow, sombras) — violan la estética Arts & Crafts

### 12.3 Patrones de Animación

**Reveal (elementos aparecen al cambiar paso):**
```typescript
useEffect(() => {
    element.setAttribute({ visible: isHighlight('step2') });
    board.update();
}, [highlight]);
```

**Énfasis (pulso al hacer hover):**
```typescript
// Usar CSS transition o setAttribute con un breve setTimeout
```

### 12.4 Rendimiento

- Para JSXGraph: minimizar llamadas `board.update()`. Agrupar cambios en un solo `useEffect`
- Para SVG: usar CSS `transition` en lugar de bucles de animación JavaScript
- Para Canvas: mantener los bucles `requestAnimationFrame` ligeros — sin cómputo pesado por frame
- Evitar animar más de 3–4 elementos simultáneamente

---

## 13. Conexión con MDX

### Paso 1: Crear el componente del diagrama

Archivo: `src/widgets/diagrams/<Categoria>/<Nombre>.tsx`

### Paso 2: En el MDX, importar y exportar

**Para páginas de contenido (`ContentLayout`):**
```typescript
import { MyDiagram } from '@/widgets/diagrams/Categoria/MyDiagram';
export const Simulation = MyDiagram;

export const metadata = {
  ...
  "hasSimulation": true,
};
```

**Para modelos (renderizado inline):**
```typescript
import { ModelDiagram } from '@/widgets/diagrams/Models/ModelDiagram';
export const Diagram = ModelDiagram;

export const metadata = {
  ...
  "hasDiagram": true,
};
```

**Para demostraciones (dentro de Component):**
```typescript
import { MyDiagram } from '../../diagrams/Teoremas/MyDiagram';

export const Component = () => (
    <DemonstrationSection diagrams={{ "default": MyDiagram }}>
        <ProofStep number={1} target="miElemento" title="...">
            <InteractiveElement target="miElemento" color="terracota">texto</InteractiveElement>
        </ProofStep>
    </DemonstrationSection>
);
```

### Paso 3: En el cuerpo MDX, referenciar elementos del diagrama

```mdx
<InteractiveElement target="segAB" color="terracota">
  lado AB
</InteractiveElement>
```

**IMPORTANTÍSIMO:** `InteractiveElement` DEBE importarse desde `../../components/ui/VisualBind`. Es el ÚNICO `InteractiveElement` del proyecto. Escribe en `MathStore.highlight`.

---

## 14. Diseño Responsivo

- **JSXGraph:** Container `min-h-[500px]` + `w-full h-full`. Usar `keepaspectratio: true`.
- **SVG:** `viewBox` + `className="w-full max-w-[400px] h-auto"`. Escala proporcionalmente.
- **Canvas:** Atributos `width`/`height` explícitos + container CSS `w-full h-full`.
- **Siempre usar `touch-none`** en SVG/Canvas para evitar interferencia de scroll en móvil.
- Alturas mínimas: `min-h-[400px]` (SVG/Canvas), `min-h-[500px]` (JSXGraph).

---

## 15. Diagramas de Demostración (Split Layout)

Para demostraciones multi-paso con `layout: "split"`:

### 15.1 Regla Fundamental: Diagrama por Paso

**CADA PASO de una demostración DEBE tener su propio diagrama** que ilustre ese paso específico. Esta es la regla por defecto.

La **excepción** es cuando conviene unificar los diagramas: si varios pasos comparten la misma construcción geométrica y solo cambia qué elemento se resalta, un solo diagrama con highlight reactivo es más claro que múltiples diagramas casi idénticos.

| Patrón | Cuándo usar | Cómo |
|---|---|---|
| **Un diagrama por paso** | POR DEFECTO. Cada paso introduce elementos nuevos o cambia la construcción | `diagrams={{ "step1": Step1, "step2": Step2, ... }}` |
| **Un diagrama unificado** | Los pasos comparten construcción, solo cambia el highlight | `diagrams={{ "default": Shared }}` o `diagram={<Shared />}` |
| **Híbrido** | Algunos pasos comparten, otros introducen elementos | `diagrams={{ "default": Shared, "step3": Step3 }}` |

### 15.2 Transiciones Sticky

Cuando hay varios diagramas (patrón por paso o híbrido), el `DemonstrationSection` implementa **transiciones sticky**:

- El panel izquierdo (diagrama) es **`position: sticky`** — permanece fijo en pantalla mientras el texto scrollea
- Los diagramas cambian con una **transición de fundido suave** (opacity 700ms ease-in-out)
- El diagrama activo se determina por `MathStore.variables['step']`: si el `target` del `ProofStep` visible coincide con una clave de `diagrams`, ese diagrama se muestra
- Si ningún `target` coincide, se muestra el primer diagrama del mapa

Esto asegura que el estudiante siempre vea el diagrama correcto para el paso que está leyendo, sin importar si hace hover con el ratón por otras partes del texto (lo cual altera `highlight`, no `step`).

### 15.3 Referencias al Diagrama — Obligatorias

**TODO en el texto que se refiera a un elemento del diagrama DEBE tener un `<InteractiveElement>` correspondiente.** Sin excepciones.

Esto incluye:
- Puntos, segmentos, ángulos, polígonos mencionados en prosa
- Variables que corresponden a elementos visuales ($a$, $b$, $c$ si son lados visibles)
- **Hipótesis iniciales:** en demostraciones visuales, presentar las condiciones fuera de `<Formula>` como prosa con matemáticas inline y `<InteractiveElement>`. Reservar `<Formula>` para la conclusión; así cada condición puede resaltar el objeto al que se refiere.
- **Referencias dentro de fórmulas**: envolver cada variable en `<InteractiveElement>`:
  ```mdx
  <InteractiveElement target="cateto-a" color="terracota">$a$</InteractiveElement>^2 +
  <InteractiveElement target="cateto-b" color="salvia">$b$</InteractiveElement>^2 =
  <InteractiveElement target="hipotenusa" color="pizarra">$c$</InteractiveElement>^2
  ```
- **Si dentro de una fórmula no se puede** (LaTeX complejo con fracciones, subíndices...), **explicar fuera de la fórmula** a qué se refiere cada símbolo:
  ```mdx
  <Formula>
    $$ \frac{AD}{DB} = \frac{AE}{EC} $$
  </Formula>
  donde <InteractiveElement target="seg-ad">$AD$</InteractiveElement> es el segmento entre $A$ y $D$,
  <InteractiveElement target="seg-db">$DB$</InteractiveElement> entre $D$ y $B$, etc.
  ```

Cada `<ProofStep>` DEBE contener al menos un `<InteractiveElement>`. Si un paso no tiene nada que resaltar en el diagrama, no necesita diagrama (y probablemente pertenece a la sección de análisis, no a un paso de demostración).

### 15.4 Approach A — Un Diagrama por Paso (POR DEFECTO)

Cada paso tiene su propio componente de diagrama:

```mdx
<DemonstrationSection diagrams={{
    "step1": Step1Diagram,
    "step2": Step2Diagram,
    "step3": Step3Diagram
}}>
  <ProofStep number={1} target="step1" title="Construcción">
    Partimos de <InteractiveElement target="punto-a" color="terracota">$A$</InteractiveElement>...
  </ProofStep>
  <ProofStep number={2} target="step2" title="Razonamiento">
    Por la propiedad de <ConceptLink targetId="axioma-congruencia-1">transporte</ConceptLink>,
    el <InteractiveElement target="segmento-cd" color="salvia">segmento $CD$</InteractiveElement>...
  </ProofStep>
  <ProofStep number={3} target="step3" title="Conclusión">
    ... $\blacksquare$
  </ProofStep>
</DemonstrationSection>
```

Cada `StepNDiagram` es un componente independiente que muestra la construcción geométrica tal como está en ese paso del razonamiento.

### 15.5 Approach B — Un Solo Diagrama Unificado (EXCEPCIÓN)

Cuando los pasos comparten la misma construcción y solo cambia el highlight, un solo diagrama con lógica reactiva:

```typescript
onUpdate={(_board, els, theme, _isStep, isHL) => {
    // RESET — TODOS los atributos modificados
    els.lineAB.setAttribute({ strokeWidth: 2, strokeColor: theme.pizarra, strokeOpacity: 1 });
    els.angleC.setAttribute({ fillColor: theme.salvia, fillOpacity: 0.2 });

    // APLICAR highlight sin cambiar el significado cromático
    if (isHL('segAB')) els.lineAB.setAttribute({ strokeWidth: 6 });
    if (isHL('angleC')) els.angleC.setAttribute({ fillOpacity: 0.5 });
}}
```

**CRÍTICO:** Todo atributo modificado por cualquier condición de highlight DEBE restaurarse explícitamente a su valor por defecto en el bloque de reset. Omitir un reset causa highlights "pegados".

### 15.6 Errores Comunes a Evitar (Checklist de Demostraciones)

Al crear o refactorizar diagramas de demostración, **evita estos errores frecuentes**:

1. **Recortes de Bounding Box**: Asegúrate de que el `boundingbox` sea lo suficientemente amplio para alojar polígonos auxiliares grandes (ej. el cuadrado sobre la hipotenusa). Deja siempre un margen holgado.
2. **Targets Genéricos**: Usa `target` granulares en `<InteractiveElement>`. En lugar de `target="cuadrados"`, usa `target="cuadrado-a"`, `target="cuadrado-b"`, etc. Cada elemento geométrico debe tener su propio identificador único para el hover.
3. **Menciones No Envueltas**: ABSOLUTAMENTE TODA mención en el texto a un triángulo, cuadrado, ángulo o vértice (ej. $\triangle ACD$, lado $a$) DEBE estar envuelta en su respectivo `<InteractiveElement>`. El texto debe ser un campo de minas interactivo.
4. **Visibilidad de Puntos Auxiliares**: Los vértices y puntos que no forman parte de la figura inicial (ej. los vértices exteriores de los cuadrados) deben nacer INVISIBLES (`visible: false`). Solo deben mostrarse (a través del `step` o del `highlight`) en el momento en que se utilizan para definir un polígono o segmento auxiliar.
5. **Rigor Matemático y Dependencias Estrictas**:
    - Cada afirmación en una demostración DEBE estar matemáticamente justificada combinando pasos lógicos, axiomas, resultados previos y la hipótesis. (Usa la axiomática de Hilbert).
    - **TODA** dependencia utilizada como justificación (ej. `teorema-construccion-cuadrado`, `propiedad-aditiva-area`, `axioma-congruencia-5`) DEBE estar explícitamente enlazada con `<ConceptLink targetId="..." isDependency={true}>`.
    - Incluso si el concepto no está todavía implementado, **añádelo**. Esto generará un enlace a una página "En construcción" de forma temporal, pero es ABSOLUTAMENTE NECESARIO para que el sistema pueda generar el árbol riguroso de dependencias lógico-matemáticas en el backend.
6. **Diagramas Adecuados y Múltiples**: Si una demostración contiene transformaciones muy distintas (ej. diferentes disposiciones de piezas) o se vuelve visualmente demasiado compleja para un único espacio de dibujo, no intentes forzarlo en un solo diagrama. **Crea y utiliza múltiples diagramas**. Puedes pasar un mapa al `<DemonstrationSection diagrams={{ paso1: <DiagramaA />, paso2: <DiagramaB /> }}>` para que el diagrama cambie dinámicamente conforme el usuario avanza por los pasos.

### 15.7 `DemonstrationSection` — cómo funciona

- Lee `MathStore.variables['step']` para decidir qué diagrama mostrar (transición sticky)
- Si se pasa `diagrams` (mapa), busca el diagrama cuya clave coincide con `step`; si no coincide, muestra el primero
- Si se pasa `diagram` (single), lo muestra siempre
- Layout: panel izquierdo sticky (diagrama), panel derecho scrolleable (texto con ProofSteps)
- Transiciones entre diagramas: opacity 700ms ease-in-out (fundido suave)

---

## 16. Modo Oscuro

Los diagramas DEBEN funcionar en modo claro y oscuro.

### JSXGraph (leer CSS variables en runtime)

```typescript
function getCSSVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// Observar cambios de tema para re-leer colores
useEffect(() => {
    const observer = new MutationObserver(() => {
        if (board) {
            const lienzo = getCSSVar('--theme-lienzo');
            board.renderer.container.style.backgroundColor = lienzo;
            board.update();
        }
    });
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
    });
    return () => observer.disconnect();
}, []);
```

### SVG (usar CSS variables — modo oscuro automático)

SVG usando `var(--theme-*)` se adapta automáticamente al modo oscuro porque las CSS variables cambian cuando se aplica `.dark` al `<html>`.

**NUNCA usar valores hex en SVG.** Siempre usar `var(--theme-<token>)`.

---

## 17. Accesibilidad

### Color y Contraste

- Todos los elementos interactivos DEBEN tener **contraste suficiente** contra el fondo:
  - Texto: ratio de contraste mínimo 4.5:1 contra el fondo
  - Elementos interactivos (puntos, líneas): mínimo 3:1 contra el fondo
- **NO depender solo del color** para transmitir información. Usar forma, tamaño, posición y etiquetas además de color.

### Navegación por Teclado

- Los diagramas DEBERÍAN ser focusables: `<div ref={...} tabIndex={0} role="img" aria-label="...">`
- Para controles interactivos (sliders, puntos arrastrables), asegurar equivalentes de teclado (p. ej. flechas para sliders)
- Los sliders de JSXGraph soportan input de teclado nativamente; asegurar que sean alcanzables vía Tab

### Etiquetas ARIA

```typescript
<div
    ref={boardRef}
    className="w-full h-full min-h-[500px]"
    role="img"
    aria-label="Diagrama interactivo: construcción del triángulo equilátero. Los puntos A, B y C son vértices. Arrastre los puntos para explorar."
    tabIndex={0}
/>
```

---

## 18. Rendimiento

- **JSXGraph:** Minimizar elementos. Eliminar ejes/grid innecesarios. Usar `freeBoard` en cleanup.
- **SVG:** Usar CSS para transiciones (`transition: all 0.3s`) en lugar de bucles de animación JavaScript.
- **Canvas:** Mantener animaciones `requestAnimationFrame` por debajo de 16ms por frame. Usar `will-change: transform` en el container del canvas.
- **General:** Evitar re-renders innecesarios. Memoizar componentes de diagrama con `React.memo` si reciben props estables.
- **Efectos de highlight:** Agrupar todas las llamadas `setAttribute` y llamar `board.update()` una sola vez, no por elemento.

---

## 19. Organización de Archivos

### 19.1 Ubicación FSD

```
src/widgets/diagrams/
  <Categoria>/
    <Nombre>.tsx           (componente del diagrama — PascalCase)
```

Los diagramas viven en `src/widgets/diagrams/` (arquitectura FSD: capa `widgets/`).

### 19.2 Archivos relacionados

| Qué | Dónde |
|---|---|
| Fachada y utilidades | `src/widgets/diagrams/index.ts` |
| Componentes JSXGraph base | `src/shared/diagrams/core/{MathBoard.tsx,MathFactory.ts,MathUtils.ts}` |
| Store para interactividad | `src/shared/lib/MathStoreContext.tsx`; enlaces de paso en `src/shared/ui/StepBinding.tsx` |
| Paleta de colores | `src/app/theme.css`; leer mediante `theme.*`, `getCSSVar('--theme-*')` o `var(--theme-*)` según el renderer |
| Contenido MDX asociado | `src/database/content/{theorems,definitions,axioms,demonstrations}/` |

**Categorías existentes con contenido:**

| Categoría | Contenido | Estado |
|---|---|---|
| `Definiciones/` | Diagramas de definiciones (triángulo, ángulo, circunferencia, etc.) | Activa |
| `Axiomas/` | Visualizaciones de axiomas (incidencia, paralelas, Pasch, SAS) | Activa |
| `Teoremas/` | Diagramas de demostraciones de teoremas (Pitágoras, Tales, etc.) | Activa |
| `Demos/` | Diagramas de demostraciones adicionales | Activa |
| `Theorems/` | Visualizaciones de teoremas (a consolidar con Teoremas/) | Activa |
| `Models/` | Diagramas de modelos (3 puntos, Fano, Poincaré, cartesiano) | Activa |

**Categorías reservadas (vacías, para contenido futuro):**

`Algebra/`, `Analisis/`, `Calculo/`, `CasosUso/`, `Estadistica/`, `Euclides/`, `Ejercicios/`, `Geometria/`, `LinearAlgebra/`, `MetodosDemostracion/`, `Pitagoras/`, `Probabilidad/`

> Al crear un nuevo diagrama, usar la categoría existente más adecuada. Si ninguna encaja, crear una nueva siguiendo el naming PascalCase.

---

## 20. Checklist de Calidad

### Autoría visual exacta — bloqueante

- [ ] La fuente canónica es `DiagramSpec v2` y el archivo se clasifica como `visual-exact`.
- [ ] `parse → generate → parse` conserva fuente y modelo exactamente.
- [ ] Cada propiedad semántica se puede crear y editar desde el workbench sin usar la pestaña de código.
- [ ] Crear, seleccionar, modificar, reordenar y borrar funcionan visualmente con undo/redo.
- [ ] Guardar, cerrar y reabrir conserva toda la spec y sus targets.
- [ ] Editor, preview y publicación usan el mismo `DiagramRenderer`.
- [ ] No hay estado semántico oculto en TSX manual, callbacks o `extensions` sin UI.
- [ ] Si se añadió una capacidad, existen pruebas de schema, renderer, controles visuales y roundtrip.

### Técnico

- [ ] El diagrama usa la tecnología de renderizado correcta (JSXGraph/SVG/Canvas/HTML)
- [ ] TODOS los colores usan la paleta Arts & Crafts (tokens de §3) — sin hex arbitrarios
- [ ] SVG usa `var(--theme-<token>)` CSS variables (nunca hex)
- [ ] JSXGraph tiene `showCopyright: false`, `showNavigation: false` y `keepaspectratio: true`
- [ ] JSXGraph tiene cleanup adecuado (`freeBoard` en return de useEffect)
- [ ] El diagrama tiene clase `touch-none` (SVG/Canvas)
- [ ] Altura mínima adecuada (`min-h-[400px]` SVG, `min-h-[500px]` JSXGraph)

### Interactividad

- [ ] El diagrama lee de `MathStore.variables['highlight']`
- [ ] Maneja highlight como string, string[] y null (usar `isHighlight` helper)
- [ ] Los nombres de elementos/target coinciden exactamente entre diagrama y MDX `<InteractiveElement>`
- [ ] El `useEffect` de highlight restaura CADA atributo modificado en el bloque de reset
- [ ] Cada paso del cuerpo de la demostración tiene al menos un `<InteractiveElement>`
- [ ] Los elementos interactivos tienen feedback visual en hover/highlight
- [ ] El diagrama produce un estado visual distinto para cada valor de target

### Diseño Visual

- [ ] Un elemento primario por estado de vista (jerarquía visual §4.1)
- [ ] Espacio en blanco: 15–20% de margen alrededor del contenido
- [ ] Sin animaciones gratuitas o efectos
- [ ] Las etiquetas usan `font-serif` y están posicionadas para evitar solapamiento
- [ ] Los colores tienen significado semántico consistente dentro del diagrama

### Modo Oscuro

- [ ] SVG usa CSS variables (soporte automático de modo oscuro)
- [ ] JSXGraph tiene MutationObserver para cambios de tema (§16)
- [ ] Todos los colores son legibles en modo claro y oscuro

### Accesibilidad

- [ ] Contraste suficiente (4.5:1 texto, 3:1 elementos interactivos)
- [ ] La información no se transmite solo por color
- [ ] El container del diagrama tiene `role="img"` y `aria-label`
- [ ] Los controles interactivos tienen alternativas de teclado

### Organización

- [ ] El archivo está en el directorio de categoría correcto (§19)
- [ ] El nombre del componente sigue la convención PascalCase
- [ ] Para teoremas/axiomas: exportado como `Simulation` con `"hasSimulation": true`
- [ ] Para modelos: exportado como `Diagram` con `"hasDiagram": true`
- [ ] No hay `\sen` en ningún sitio — LaTeX usa `\sin`, texto plano usa `sin`

---

## 21. Ángulos Rectos Robustos

El `angle` de JSXGraph con `orthotype: 'square'` puede fallar cuando la orientación de los puntos produce un ángulo CCW de 270° en lugar de 90°. Para diagramas donde los puntos se reordenan libremente (ej. triángulos deformables), **NO usar `angle` con `orthotype`**. En su lugar, utiliza la utilidad centralizada en `src/shared/diagrams/core/MathUtils.ts`:
`createRobustRightAngle(board, vertex, pBase, pAlt, size, options, theme)`.
Esta función construye internamente un polígono dinámico cuadrado manual inmune a inversiones de orientación:

```typescript
// Robust right-angle square marker at foot H
const sqSize = 0.5;
const baseDir = () => {
  const mx = (A.X() + B.X()) / 2, my = (A.Y() + B.Y()) / 2;
  const dx = mx - H.X(), dy = my - H.Y();
  const len = Math.hypot(dx, dy);
  if (len < 1e-6) return { x: 1, y: 0 };
  return { x: dx / len, y: dy / len };
};
const altDir = () => {
  const dx = C.X() - H.X(), dy = C.Y() - H.Y();
  const len = Math.hypot(dx, dy);
  if (len < 1e-6) return { x: 0, y: 1 };
  return { x: dx / len, y: dy / len };
};

const sq0 = board.create('point', [() => H.X(), () => H.Y()], { visible: false });
const sq1 = board.create('point', [
  () => { const d = baseDir(); return H.X() + d.x * sqSize; },
  () => { const d = baseDir(); return H.Y() + d.y * sqSize; }
], { visible: false });
const sq2 = board.create('point', [
  () => { const d = baseDir(); const a = altDir(); return H.X() + d.x * sqSize + a.x * sqSize; },
  () => { const d = baseDir(); const a = altDir(); return H.Y() + d.y * sqSize + a.y * sqSize; }
], { visible: false });
const sq3 = board.create('point', [
  () => { const a = altDir(); return H.X() + a.x * sqSize; },
  () => { const a = altDir(); return H.Y() + a.y * sqSize; }
], { visible: false });

const angRecto = board.create('polygon', [sq0, sq1, sq2, sq3], {
  fillColor: C_ORTHO, fillOpacity: 0.3,
  strokeColor: C_ORTHO, strokeWidth: 1.5,
  vertices: { visible: false },
  borders: { strokeColor: C_ORTHO, strokeWidth: 1.5 },
  visible: false
});
```

Este cuadrado se orienta siempre correctamente: `baseDir` apunta hacia el interior del segmento base (calculado desde el punto medio de AB) y `altDir` apunta hacia el vértice opuesto. El polígono es inmune a reordenamientos de puntos.

---

## 22. Pies de Perpendicular y Extensiones de Base

Cuando en un triángulo obtusángulo el **pie de la altura cae fuera del segmento base**, hay que mostrar la extensión de la base para que el estudiante entienda dónde está el pie. Patrón:

```typescript
// extEnd = punto extremo de AB más cercano a H (o H si está dentro)
const extEnd = board.create('point', [
  () => {
    const dx = B.X() - A.X(), dy = B.Y() - A.Y();
    const len2 = dx*dx + dy*dy;
    if (len2 < 1e-10) return A.X();
    const t = ((H.X()-A.X())*dx + (H.Y()-A.Y())*dy) / len2;
    if (t < 0) return A.X();
    if (t > 1) return B.X();
    return H.X();
  },
  () => { /* análogo para Y */ }
], { visible: false });

const baseExtension = board.create('segment', [extEnd, H], {
  dash: 2, strokeWidth: 1.5, strokeColor: C_BASE, visible: false
});

// Gestionar visibilidad en board.on('update'):
const updateExtension = () => {
  const dx = B.X() - A.X(), dy = B.Y() - A.Y();
  const len2 = dx*dx + dy*dy;
  let outside = false;
  if (len2 > 1e-10) {
    const t = ((H.X()-A.X())*dx + (H.Y()-A.Y())*dy) / len2;
    outside = t < -0.001 || t > 1.001;
  }
  baseExtension.setAttribute({ visible: outside });
};
board.on('update', updateExtension);
```

**Regla:** Siempre que un punto de intersección (pie de perpendicular, proyección) pueda caer fuera del segmento visible, añadir una extensión discontinua que una el extremo más cercano al pie. Esto aplica a alturas, medianas, mediatrices y cualquier perpendicular a un lado.

---

## 23. Semirrectas (Rayos) — Bisectrices y Alturas

Cuando la definición matemática habla de **semirrecta**, el diagrama DEBE mostrar una semirrecta, NO una recta infinita ni un segmento. **JSXGraph NO tiene el tipo `ray`** — usar `line` con `straightFirst: false, straightLast: true`:

```typescript
// Bisectriz COMO SEMIRRECTA usando line + straightFirst/straightLast:
const bisecDir = board.create('point', [
  () => {
    // Suma de vectores unitarios BA y BC = dirección de la bisectriz
    const ux = A.X() - B.X(), uy = A.Y() - B.Y();
    const vx = C.X() - B.X(), vy = C.Y() - B.Y();
    const uLen = Math.hypot(ux, uy) || 1, vLen = Math.hypot(vx, vy) || 1;
    const dx = ux/uLen + vx/vLen, dy = uy/uLen + vy/vLen;
    const dLen = Math.hypot(dx, dy) || 1;
    return B.X() + dx/dLen;
  },
  () => { /* análogo */ }
], { visible: false });

const bisectriz = board.create('line', [B, bisecDir], {
  strokeColor: C_BIS, strokeWidth: 2.5, dash: 2,
  straightFirst: false, straightLast: true
});
```

**No usar `board.create('bisector', [A, B, C])`** porque devuelve una línea (recta completa), no una semirrecta. Solo usar el elemento `bisector` nativo para líneas auxiliares invisibles.

**Regla para interactividad en ángulos:** Los puntos que definen los lados del ángulo (A y C en el ejemplo) DEBEN ser visibles y arrastrables para que el estudiante pueda ampliar/reducir el ángulo y comprobar que la bisectriz siempre lo divide en dos mitades congruentes. Añadir texto dinámico que muestre la medida del ángulo total y la mitad.

---

## 24. Restricciones Geométricas con Drag Handlers

Los diagramas de polígonos deformables DEBEN imponer restricciones geométricas mediante handlers de drag para garantizar la corrección matemática del diagrama.

### 24.1 Prevención de Colinealidad

Para vértices de polígonos (triángulos, cuadriláteros), **ningún trío de puntos debe ser colineal**. Implementar con un handler `on('drag')`:

```typescript
const collinear = (p1, p2, p3, tol = 0.01) => {
  const area = (p2.X()-p1.X())*(p3.Y()-p1.Y()) - (p3.X()-p1.X())*(p2.Y()-p1.Y());
  return Math.abs(area) < tol;
};

const nudgeOffLine = (draggedPoint, otherPoints, snapStep = 0.5) => {
  const directions = [[snapStep,0],[-snapStep,0],[0,snapStep],[0,-snapStep],
                      [snapStep,snapStep],[-snapStep,snapStep],[snapStep,-snapStep],[-snapStep,-snapStep]];
  for (const [dx, dy] of directions) {
    const nx = draggedPoint.X() + dx, ny = draggedPoint.Y() + dy;
    let ok = true;
    for (let i = 0; i < otherPoints.length && ok; i++)
      for (let j = i+1; j < otherPoints.length && ok; j++)
        if (collinearXY(nx, ny, otherPoints[i], otherPoints[j])) ok = false;
    if (ok) { draggedPoint.moveTo([snap(nx), snap(ny)], 0); return true; }
  }
  return false;
};
```

### 24.2 Prevención de Auto-Intersección (Cuadriláteros)

Para cuadriláteros, **los lados no deben cruzarse**. Comprobar intersección de segmentos no adyacentes (AB-CD y BC-DA) en el handler de drag y revertir al último punto válido:

```typescript
const segmentsIntersect = (p1, p2, q1, q2) => {
  const d1 = cross(q1,q2,p1), d2 = cross(q1,q2,p2), d3 = cross(p1,p2,q1), d4 = cross(p1,p2,q2);
  return ((d1>0&&d2<0)||(d1<0&&d2>0)) && ((d3>0&&d4<0)||(d3<0&&d4>0));
};
const cross = (o, a, b) => (a.X()-o.X())*(b.Y()-o.Y()) - (a.Y()-o.Y())*(b.X()-o.X());
```

Guardar `lastValid` para cada vértice y revertir si la nueva posición causa intersección o colinealidad. Aplicar snapping a grid (`snapToGrid`) + snap manual para consistencia.

### 24.3 Atractores para Snapping Suave a Formas Especiales

Para diagramas de polígonos deformables con clasificación (triángulos, cuadriláteros), usar **attractors de JSXGraph** para crear un imán suave hacia formas notables. Esto hace que el movimiento sea más fluido y que el estudiante "descubra" las clases especiales al arrastrar:

```typescript
// Thales circles: attract to right angles at opposite vertices
const midAC = board.create('midpoint', [A, C], { visible: false });
const midBD = board.create('midpoint', [B, D], { visible: false });
const thalesAC = board.create('circle', [midAC, A], { visible: false });
const thalesBD = board.create('circle', [midBD, B], { visible: false });

// Perpendicular bisectors: attract to equal adjacent sides (AB=BC, etc.)
const lineAC = board.create('line', [A, C], { visible: false });
const lineBD = board.create('line', [B, D], { visible: false });
const bisectorAC = board.create('perpendicular', [lineAC, midAC], { visible: false });
const bisectorBD = board.create('perpendicular', [lineBD, midBD], { visible: false });

A.setAttribute({ attractors: [thalesBD, bisectorBD], attractorDistance: 0.4, snatchDistance: 0.6 });
B.setAttribute({ attractors: [thalesAC, bisectorAC], attractorDistance: 0.4, snatchDistance: 0.6 });
C.setAttribute({ attractors: [thalesBD, bisectorBD], attractorDistance: 0.4, snatchDistance: 0.6 });
D.setAttribute({ attractors: [thalesAC, bisectorAC], attractorDistance: 0.4, snatchDistance: 0.6 });
```

- `thalesBD` atrae A y C para formar ángulos rectos en esos vértices (∠DAB y ∠BCD).
- `bisectorBD` atrae A y C para lados adyacentes iguales (DA=AB, BC=CD).
- `attractorDistance`: radio de atracción progresiva. `snatchDistance`: distancia de captura instantánea.
- Usar `snapToGrid: true` junto con atractores para máxima fluidez.

**Regla:** Todo diagrama de polígono deformable con clasificación DEBE tener atractores para las formas notables de su taxonomía. Esto transforma el diagrama de una ilustración en una herramienta de descubrimiento.

---

## 25. Marcado de Ángulos Internos en Polígonos Deformables

Para un polígono simple en orden antihorario (CCW), el ángulo interno en cada vértice se obtiene con el orden `[vérticeSiguiente, vértice, vérticeAnterior]`:

```typescript
const angleA = board.create('angle', [B, A, D], { type: 'sector', ... });
const angleB = board.create('angle', [C, B, A], { type: 'sector', ... });
const angleC = board.create('angle', [D, C, B], { type: 'sector', ... });
const angleD = board.create('angle', [A, D, C], { type: 'sector', ... });
```

Este orden funciona para polígonos CCW tanto convexos como cóncavos (el ángulo reflejo >180° se dibuja correctamente como sector mayor). Si el polígono pudiera invertir su orientación, añadir lógica de `swapOrientation` en el handler de `update`.

No obstante, si se previenen las auto-intersecciones (§24.2), la orientación se mantiene constante y el orden `[next, vertex, prev]` produce siempre el ángulo interno.

---

## 26. Clasificación Dinámica en Diagramas

Los diagramas de definiciones con clasificación (triángulos, cuadriláteros, ángulos) DEBEN incluir un **texto dinámico** que actualice en tiempo real la clase del objeto según el usuario arrastra los puntos. Patrón:

```typescript
const infoText = board.create('text', [x, y, function() {
  // Calcular distancias, ángulos, paralelismo...
  let clase = "Trapezoide";
  if (eqSides && rightAngles) clase = "Cuadrado";
  else if (rightAngles) clase = "Rectángulo";
  // ... más condiciones
  return `<div style="font-family: var(--font-serif); ...">
    <strong>${clase}</strong><br/><i>detalles...</i>
  </div>`;
}], { fixed: true });
```

Esto convierte el diagrama de una ilustración pasiva en una **herramienta de exploración**: el estudiante descubre las clases arrastrando los vértices y viendo la clasificación actualizarse.

---

## 27. Marcas de Congruencia y Paralelismo Diferenciadas

Cuando un diagrama muestra **dos pares distintos** de lados congruentes o paralelos, usar marcas visuales diferenciadas para que el estudiante distinga qué lados pertenecen a cada par.

### 27.1 Ticks de congruencia (simple vs doble)

Usar segmentos perpendiculares manuales (§24.3, `mkTick`). **NUNCA usar `board.create('hatch', ...)`** — es inestable en JSXGraph 1.x.

```typescript
const mkTick = (p, q, centerOffset = 0) => {
  // Segmento corto perpendicular en el punto medio (con offset opcional)
  // Retorna un segment visible cuando el lado es congruente
};
// Primer par congruente → tick simple (centerOffset=0)
// Segundo par congruente (longitud ≠ primer par) → tick doble (centerOffset=-0.18,+0.18)
```

Para cada lado, crear tanto el tick simple como el doble. Mostrar uno u otro según a qué grupo de congruencia pertenezca:
- `showCong1(['AB','CD'])` → tick simple en AB y CD
- `showCong2(['BC','DA'])` → tick doble en BC y DA
- Todos los lados iguales (cuadrado, rombo) → tick simple en los 4

### 27.2 Colores distintos por par paralelo

Usar **dos colores distintos** para los dos pares de lados paralelos:
- Primer par (AB ∥ CD) → `terracota` (`C_ACC`)
- Segundo par (BC ∥ DA) → `pavo` (`C_ACC2`)

```typescript
const C_ACC  = getCSSVar('--theme-terracota');
const C_ACC2 = getCSSVar('--theme-pavo');

// En la clasificación:
colorPar1(['AB', 'CD']);  // terracota
colorPar2(['BC', 'DA']);  // pavo
```

### 27.3 Tolerancia de paralelismo

El test de paralelismo debe ser **normalizado** (sin(θ) < tol) para ser independiente de la escala. Usar tolerancia **estricta** (~0.06, ≈ 3.4°) para evitar falsos positivos:

```typescript
const areParallel = (p1, p2, q1, q2) => {
  const dx1 = p2.X()-p1.X(), dy1 = p2.Y()-p1.Y();
  const dx2 = q2.X()-q1.X(), dy2 = q2.Y()-q1.Y();
  const cross = Math.abs(dx1*dy2 - dy1*dx2);
  const len1 = Math.hypot(dx1, dy1) || 1;
  const len2 = Math.hypot(dx2, dy2) || 1;
  return cross / (len1 * len2) < 0.06;
};
```

---

## 28. Puntos Derivados (Computados)

Cuando un punto del diagrama **depende matemáticamente** de otros (no es independiente), debe crearse como punto computado, no como punto libre. Ejemplos:

### 28.1 Cuarto vértice de un paralelogramo

Dados A, B, C libres, D DEBE cumplir AB ∥ CD y BC ∥ AD. Se calcula como intersección de paralelas:

```typescript
const lineAB = board.create('line', [A, B], { visible: false });
const lineBC = board.create('line', [B, C], { visible: false });
const parCD = board.create('parallel', [lineAB, C], { visible: false });
const parAD = board.create('parallel', [lineBC, A], { visible: false });
const D = board.create('intersection', [parCD, parAD, 0], {
  name: 'D', size: 5, fillColor: C_PRIM, strokeColor: C_PRIM
});
```

D se actualiza automáticamente al arrastrar A, B o C. **D NO debe ser arrastrable** (JSXGraph lo marca como dependiente y rechaza el drag). Esto garantiza que el cuadrilátero siempre es un paralelogramo.

### 28.2 Baricentro (intersección de medianas)

```typescript
const medA = board.create('segment', [A, M_BC], { ... });
const medB = board.create('segment', [B, M_CA], { ... });
const G = board.create('intersection', [medA, medB, 0], {
  name: 'G', size: 5, fillColor: C_BAR, strokeColor: C_BAR
});
```

G se recalcula cuando los vértices se mueven. Es un punto derivado, no arrastrable.

---

## 29. Gliders para Lugares Geométricos

Para definiciones basadas en **lugares geométricos** (mediatriz, bisectriz), usar un **glider** sobre la línea/circunferencia para que el estudiante explore la propiedad:

```typescript
const mediatriz = board.create('perpendicular', [segmento, M], {
  strokeColor: C_MED, strokeWidth: 2
});
const P = board.create('glider', [0, 3, mediatriz], {
  name: 'P', size: 4, fillColor: C_EQ, strokeColor: C_EQ
});
const distPA = board.create('segment', [P, A], { strokeColor: C_EQ, dash: 2 });
const distPB = board.create('segment', [P, B], { strokeColor: C_EQ, dash: 2 });
```

El glider P solo puede moverse sobre la mediatriz. Al arrastrarlo, PA y PB se actualizan y el estudiante verifica visualmente que PA = PB para todo P sobre la mediatriz.

**Mostrar texto dinámico** con las distancias para reforzar la propiedad:
```typescript
const infoText = board.create('text', [x, y, () => {
  const dPA = P.Dist(A), dPB = P.Dist(B);
  return `PA = ${dPA.toFixed(2)} &nbsp; PB = ${dPB.toFixed(2)}`;
}], { fixed: true });
```

---

## 30. Prevención de Deformación en Diagramas con Puntos Derivados

Cuando un diagrama tiene **puntos derivados** (ej. D en un paralelogramo, computado desde A, B, C), hay que **impedir que la orientación del polígono se invierta** al arrastrar los puntos libres. Si la orientación cambia (CCW → CW), los sectores de ángulo dibujados con order `[next, vertex, prev]` mostrarán ángulos externos en lugar de internos.

### 30.1 Patrón de enforcement de orientación

```typescript
const orientABC = () => (B.X() - A.X()) * (C.Y() - A.Y()) - (B.Y() - A.Y()) * (C.X() - A.X());
const initialOrient = orientABC();
const lastValid = { A: [A.X(), A.Y()], B: [B.X(), B.Y()], C: [C.X(), C.Y()] };

[A, B, C].forEach((p, idx) => {
  const name = String.fromCharCode(65 + idx);
  p.on('drag', () => {
    const cur = orientABC();
    if (Math.abs(cur) < 0.01 || (initialOrient > 0.01 && cur < 0) || (initialOrient < -0.01 && cur > 0)) {
      p.moveTo([lastValid[name][0], lastValid[name][1]], 0);
    } else {
      lastValid[name][0] = p.X();
      lastValid[name][1] = p.Y();
    }
  });
});
```

Esto garantiza:
- Los 3 puntos libres nunca se vuelven **colineales** (`Math.abs(cur) < 0.01`)
- La **orientación no se invierte** (mismo signo que la inicial)
- Los ángulos `[next, vertex, prev]` siempre muestran ángulos internos
- El polígono nunca se cruza ni se deforma

---

## 31. Separación infoText / useEffect — Coordinación Limpia

**Regla:** El `infoText` (función de texto dinámico en `board.create('text', ...)`) **NUNCA debe llamar a `setAttribute`** sobre elementos del diagrama. Su única responsabilidad es devolver una cadena HTML. La geometría reactiva se actualiza en `board.on('update')`; el highlight se aplica desde `onUpdate` de `MathBoard`.

La gestión geométrica vive en el update del board y el estilo de highlight en `onUpdate`; no se mezclan ambas autoridades:

```typescript
// ❌ INCORRECTO — infoText modifica elementos
const infoText = board.create('text', [x, y, () => {
  if (someCondition) elemento.setAttribute({ visible: true });  // PROHIBIDO
  return '<div>...</div>';
});

// ✅ CORRECTO — infoText solo devuelve HTML
const infoText = board.create('text', [x, y, () => {
  let clase = "Paralelogramo";
  if (allRight) clase = "Rectángulo";
  return `<div><strong>${clase}</strong></div>`;
}]);

// Visibilidad geométrica en el update del board
board.on('update', () => {
  const showAngles = showAll && !isRectOrSquare;
  angleA.setAttribute({ visible: showAngles });
  rightA.setAttribute({ visible: showAll && isRectOrSquare });
});
```

**Motivo:** `infoText` se ejecuta en cada `board.update()`, lo que incluye los updates disparados por el `useEffect` de highlight. Si `infoText` modifica atributos, **sobrescribe** los cambios del highlight, rompiendo la interactividad.

---

## 32. InteractiveElement Auto-Referente en MDX

Cuando un `InteractiveElement` envuelve el nombre de la propia definición (ej. "la mediatriz"), debe incluir también un `ConceptLink` auto-referente para cumplir la regla de oro de enlazar todo concepto:

```mdx
// ✅ CORRECTO — InteractiveElement + ConceptLink auto-referente
<InteractiveElement target="mediatriz">
  <ConceptLink targetId="mediatriz" isDependency={false}>mediatriz</ConceptLink>
</InteractiveElement>

// ❌ INCORRECTO — falta el ConceptLink
<InteractiveElement target="mediatriz">mediatriz</InteractiveElement>
```

El `isDependency={false}` evita un ciclo en el grafo de dependencias (una definición no puede depender de sí misma).

---

## 33. Gliders sobre Ejes para Ángulos Rectos Forzados

Para diagramas que requieren un **ángulo recto garantizado** (ej. teorema de Pitágoras), usar `glider`s sobre líneas perpendiculares que pasan por el vértice del ángulo recto:

```typescript
const C = board.create('point', [0, 0], { fixed: true });
const axisY = board.create('line', [C, [0, 1]], { visible: false });
const axisX = board.create('line', [C, [1, 0]], { visible: false });
const A = board.create('glider', [0, 4, axisY], { name: 'A', ... });
const B = board.create('glider', [3, 0, axisX], { name: 'B', ... });
```

- A solo se desplaza verticalmente, B solo horizontalmente
- El ángulo en C siempre es 90° — **no es necesario forzarlo con atractores**
- Añadir restricción de signo para evitar que crucen el origen: `A.Y() > 0`, `B.X() > 0`
- Para triángulos que DEBEN mantener un ángulo fijo, esta es la solución más robusta

---

## 34. Arrastre Mutuo entre Puntos Vinculados

Cuando dos puntos están vinculados geométricamente (ej. D en AB y E en AC con DE ∥ BC en Tales), ambos deben ser arrastrables pero **manteniendo la restricción**. Usar `glider`s + handlers con flag anti-recursión:

```typescript
const updatingRef = useRef(false);

const D = board.create('glider', [0, 0, segAB], { ... });
const E = board.create('intersection', [parDE, lineCA, 0], { ... });
const Dcomp = board.create('intersection', [parE_line, lineAB, 0], { visible: false });

D.on('drag', () => {
  if (updatingRef.current) return;
  // E se actualiza automáticamente vía parDE
});

E.on('drag', () => {
  if (updatingRef.current) return;
  updatingRef.current = true;
  D.moveTo([Dcomp.X(), Dcomp.Y()], 0);
  updatingRef.current = false;
});
```

**Regla:** Crear los elementos geométricos de soporte (líneas paralelas, intersecciones) como invisibles pero presentes. Usar `intersection` para computar la posición vinculada. El flag `updatingRef` evita bucles infinitos de arrastre.

---

## 35. Atractores para Ángulos Notables

Para diagramas de triángulos donde interesa explorar configuraciones angulares (suma de ángulos, etc.), añadir **círculos de Thales** como atractores para snapping a ángulos rectos:

```typescript
const midAB = board.create('midpoint', [A, B], { visible: false });
const thalesAB = board.create('circle', [midAB, A], { visible: false });
// ... para los tres lados

C.setAttribute({ attractors: [thalesAB], attractorDistance: 0.3, snatchDistance: 0.5 });
A.setAttribute({ attractors: [thalesBC], attractorDistance: 0.3, snatchDistance: 0.5 });
B.setAttribute({ attractors: [thalesCA], attractorDistance: 0.3, snatchDistance: 0.5 });
```

Cuando un punto se aproxima a su Thales correspondiente, el triángulo se vuelve rectángulo en ese vértice. Esto permite al estudiante «descubrir» que los ángulos agudos de un triángulo rectángulo suman 90°.

---

## 36. Visibilidad Dependiente de Geometría vs Highlight

**Regla crítica:** La visibilidad que depende de la **geometría** (clasificación, congruencia, paralelismo) se gestiona en `board.on('update')`, **NUNCA** dentro de `infoText` ni en el efecto de highlight.

```typescript
// ❌ INCORRECTO — los ticks solo se actualizan al cambiar el highlight
useEffect(() => {
  const isIsosc = Math.abs(C.Dist(A) - C.Dist(B)) < 0.15;
  congAC.setAttribute({ visible: isIsosc });
}, [highlight]); // ← solo se ejecuta cuando cambia highlight, no al arrastrar

// ✅ CORRECTO — callback geométrico separado del texto
board.on('update', () => {
  const isIsosc = Math.abs(C.Dist(A) - C.Dist(B)) < 0.15;
  congAC.setAttribute({ visible: isIsosc });
  if (isIsosc) { angleA.setAttribute({ visible: true }); }
  else        { angleA.setAttribute({ visible: false }); }
});

const infoText = board.create('text', [x, y, () => '<div>...</div>']);

// El useEffect de highlight SOLO atenúa/colorea elementos YA visibles:
useEffect(() => {
  if (isHighlight('lados-iguales')) {
    sides.AC.setAttribute({ strokeColor: C_ACC, strokeWidth: 4 }); // resaltar
  }
}, [highlight]);
```

**Principio:**
- `board.on('update')` → visibilidad basada en geometría (qué se muestra según la forma)
- `MathBoard.onUpdate` → estilo basado en hover/paso (cómo se ve lo ya mostrado)

---

## 37. Uso de Refs para Comunicar Highlight a infoText

Cuando el texto dinámico necesita reaccionar al estado de highlight (cambiar color, tamaño), usar un `useRef` que se sincroniza con el highlight:

```typescript
const hlRef = useRef<any>(null);
useEffect(() => { hlRef.current = highlight; }, [highlight]);

const infoText = board.create('text', [x, y, () => {
  const h = hlRef.current;
  const isActive = h === 'desigualdad' || (Array.isArray(h) && h.includes('desigualdad'));
  const col = isActive ? getCSSVar('--theme-terracota') : getCSSVar('--theme-carbon');
  return `<div style="color:${col}; ...">...</div>`;
}]);
```

Esto permite que el texto del panel refleje visualmente qué InteractiveElement está activo, cerrando el circuito de feedback entre el MDX y el diagrama.

---

## 38. Diagramas de Congruencia: Dos Triángulos Vinculados

Para teoremas de congruencia (ALA, LLL), el diagrama DEBE mostrar dos triángulos donde uno es **copia congruente** del otro.

### 38.1 Triángulo 2 como copia computada

El segundo triángulo se construye a partir del primero, NO como elementos independientes:

**Reflexión (válido para ALA cuando la base es horizontal):**
```typescript
const A2 = board.create('point', [0, -3], { fixed: true, ... });
const B2 = board.create('point', [() => A2.X() + A1.Dist(B1), () => A2.Y()], { ... });
const C2 = board.create('point', [
  () => A2.X() + (C1.X() - A1.X()),
  () => A2.Y() - (C1.Y() - A1.Y())  // Y invertida = reflexión
], { ... });
```

**Círculos (LLL):**
```typescript
const circA2 = board.create('circle', [A2, () => A1.Dist(C1)], { visible: false });
const circB2 = board.create('circle', [B2, () => B1.Dist(C1)], { visible: false });
const C2 = board.create('intersection', [circA2, circB2, 0], { ... });
```

### 38.2 Ángulos internos en la copia reflejada

Si el triángulo original está sobre la base (CCW, interior arriba) y la copia está bajo la base (CW, interior abajo), los órdenes de ángulo DEBEN invertirse:

```typescript
// Original (CCW, sobre la base):
const angleA1 = board.create('angle', [B1, A1, C1], { ... });  // [next, vertex, prev] CCW
// Copia (CW, bajo la base):
const angleA2 = board.create('angle', [C2, A2, B2], { ... });  // [prev, vertex, next] CW
```

**Regla:** Para CW, usar `[prev, vertex, next]`. Para CCW, `[next, vertex, prev]`. Si no se invierte, los sectores de la copia mostrarán ángulos exteriores.

### 38.3 Separación vertical

Dejar al menos 3 unidades entre las bases de ambos triángulos para evitar solapamiento al arrastrar:
```typescript
A1 = (0, 0), A2 = (0, -3)  // gap de 3 unidades
```

---

## 39. Visibilidad Condicional por Highlight Global

En diagramas con múltiples propiedades (congruencia de varios pares de lados/ángulos), **por defecto solo se muestran los elementos dados por el teorema**. Las propiedades derivadas se revelan con un highlight «global»:

```typescript
// hGlobal = isHighlight('globalmente-congruentes')
const bright = (target: any) => showAll || target || hGlobal;
const op = (target: any) => bright(target) ? 1 : 0.15;

// Elementos SIEMPRE visibles (dados por el teorema):
ticksAB.forEach(t => t.setAttribute({ visible: true, strokeOpacity: op(hLadoAB) }));
angleA.setAttribute({ visible: true, fillOpacity: (hAngA||hGlobal) ? 0.5 : 0.25 });

// Elementos SOLO con highlight global (consecuencias):
ticksAC.forEach(t => t.setAttribute({ visible: hGlobal, strokeOpacity: op(hGlobal) }));
angleC.setAttribute({ visible: hGlobal });
```

**Principio:** `bright = showAll || target || hGlobal` asegura que cuando el highlight global está activo, **todos** los elementos se iluminan (no solo los del target específico). Esto resuelve el patrón donde varios InteractiveElements comparten elementos visuales.

---

## 40. Demostraciones sin Diagrama (layout: text)

Para demostraciones que no requieren visualización geométrica, usar `layout: "text"` y **NO envolver el contenido en `<DemonstrationSection>`**, ya que este componente reserva espacio para un panel de diagrama aunque no exista:

```mdx
export const metadata = {
  "layout": "text"
};

// ❌ INCORRECTO — DemonstrationSection reserva panel de diagrama
<DemonstrationSection>
  <ProofStep ...>...</ProofStep>
</DemonstrationSection>

// ✅ CORRECTO — ProofSteps directamente en el cuerpo MDX
<ProofStep number={1} title="Suposición">
  ...
</ProofStep>
```

Con `layout: "text"`, el contenido ocupa el ancho completo de la ficha, sin panel lateral reservado.

---

## 41. Traza Lean y Diagramas

La integración Lean es textual y metadata-driven. Los campos `leanId` y `stepTacticMap` alimentan `ProofStepExpander`, no los diagramas.

Reglas:
- No modificar `MathStore.step`, `MathStore.highlight`, `InteractiveElement` ni `DemonstrationSection` para mostrar código Lean.
- No crear estados visuales especiales para bloques Lean; el diagrama sigue respondiendo solo a pasos pedagógicos y highlights.
- Si un `ProofStep` tiene `leanBlocks`, el desplegable "Ver en Lean" debe permanecer colapsado por defecto y no afectar layout ni visibilidad geométrica.

---

## Ejemplos de referencia

Usar como referencia los diagramas `visual-exact` reales enumerados por `npm run editor:diagrams:check`, en especial:

- `src/widgets/diagrams/Definiciones/Paralelogramo.tsx`
- `src/widgets/diagrams/Models/ModeloPoincare.tsx`
- `src/widgets/diagrams/Teoremas/CongruenciaALA.tsx`
- `src/widgets/diagrams/Teoremas/Pitagoras.tsx`

No copiar la spec como sustituto de los controles del editor: toda capacidad empleada debe estar expuesta también en el workbench.

---

## 42. Interfaz y Overlays Estandarizados

Queda estrictamente prohibido codificar divs e inline estilos de Tailwind para títulos y paneles flotantes dentro de los componentes de diagramas. Utiliza siempre los componentes unificados en `src/shared/ui/DiagramOverlay.tsx`:

1. **DiagramTitle**: Para la etiqueta superior izquierda discreta en mayúsculas pequeñas.
   ```tsx
   import { DiagramTitle } from '@/shared/ui/DiagramOverlay';
   // ...
   return (
     <MathBoard ...>
       <DiagramTitle>Título del Diagrama</DiagramTitle>
     </MathBoard>
   );
   ```

2. **DiagramInfoPanel**: Para paneles flotantes con fórmulas y ecuaciones reactivas en tiempo real. Soporta posicionamiento (`position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'`) y adapta automáticamente su contraste al tema oscuro/claro.
   ```tsx
   import { DiagramInfoPanel } from '@/shared/ui/DiagramOverlay';
   // ...
   return (
     <MathBoard ...>
       <DiagramInfoPanel title="Ecuaciones de Pitágoras" position="bottom-right">
         <div>...</div>
       </DiagramInfoPanel>
     </MathBoard>
   );
   ```

3. **Helpers de MathUtils**:
   Para proyecciones de cuadrados y cuadrículas de conteo unitarias, importa siempre `projectSquareVertices` y `createSquareGrid` de `@/shared/diagrams/core/MathUtils` para evitar duplicación.
