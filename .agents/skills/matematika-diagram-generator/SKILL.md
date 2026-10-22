---
name: matematika-diagram-generator
description: Use whenever creating, modifying, refactoring, fixing or reviewing interactive geometric diagrams in Matematika under content/diagrams/ (v3 DiagramSpec), and whenever binding diagram targets to MDX content (<VisualBind>, <Simulation>, steps). Ensures strict TypeScript/v3 schema compliance, bidirectional visual editor compatibility (lossless / clean envelope), pedagogic clarity with interactive constructions, and trilingual sync (Castellano, Euskara Batua, English).
---

# Generador y Estándar de Diagramas Interactivos — Matematika

Motor interactivo y declarativo de representaciones geométricas y analíticas 2D para la enciclopedia deductiva Matematika, compatible con el **Editor Visual** del proyecto y renderizado en JSXGraph / React.

## Antes de empezar (cualquier agente: Claude, Gemini/Antigravity, Codex)

1. Lee esta página y [spec-v3-schema.md](./references/spec-v3-schema.md). Para estilos, [paleta-y-estilos.md](./references/paleta-y-estilos.md).
2. Parte de un **diagrama de referencia** parecido y cópialo; no escribas el spec desde cero:

   | Necesidad | Referencia |
   | :--- | :--- |
   | Axioma simple, puntos libres y una recta | `content/diagrams/Axiomas/Incidence1.tsx` |
   | Grupos resaltables (`groups` con `target`) | `content/diagrams/Axiomas/SAS.tsx` |
   | Demostración por pasos (`steps`, `objectStates`) | `content/diagrams/Demos/DemoTrianguloIsosceles.tsx` |
   | Animación con deslizador | `content/diagrams/Demos/DemoPitagorasAreas.tsx` |

3. El bloque entre `/* @matematika-diagram-spec:start */` y `/* @matematika-diagram-spec:end */` es **JSON estricto**: comillas dobles, sin comentarios, sin comas finales. El editor visual lo reescribe; cualquier cosa que no sea JSON hace que el diagrama deje de ser editable.
4. Escribe el archivo completo, sin marcadores tipo `...` ni `// resto igual`.
5. Cuando el diagrama tenga texto en un MDX, el trabajo no termina hasta que `validate-nodes.mjs <id>` del nodo (skill de contenido) dé `══ TODO OK`. Pega esa línea en tu informe.

---

## 1. Principios Fundamentales

| Principio | Regla Innegociable |
|---|---|
| **1. Compatibilidad Visual Exacta (`visual-exact`)** | Los diagramas deben ser compatibles con el Editor Visual de Matematika. Importación canónica obligatoria desde **`@/diagrams/public`** (`import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';`). Deben usar la especificación **`v3`** envuelta entre `/* @matematika-diagram-spec:start */` y `/* @matematika-diagram-spec:end */` con `createDiagramSpec(JSON_VALIDO)` y exportar `<DiagramRenderer spec={...Spec} />`. |
| **2. Interactividad Pedagógica** | Salvo necesidad puramente estática, los diagramas deben permitir la exploración activa del alumno: puntos móviles arrastrables con restricciones geométricas coherentes (`free`, `on-support`, `intersection`, `midpoint`, `projection`). |
| **3. Persistencia de la Figura Base** | En demostraciones y teoremas divididos por pasos (`steps`): **NUNCA ocultar la figura base**. La figura completa debe mantenerse visible (`visibleTargets`) y el foco cognitivo debe dirigirse mediante resaltes de énfasis (`objectStates: { id: { emphasis: 'primary' } }`). |
| **4. Sincronización Estricta con MDX** | Todos los elementos resaltables en el texto mediante `<VisualBind element="ID" color="COLOR">` deben corresponderse exactamente 1:1 con un `id` o `targetId` definido en el diagrama (con `target: true`). Mismos identificadores y colores en **Castellano**, **Euskara** e **Inglés**. |
| **5. Paleta de Diseño Oficial** | Utilizar exclusivamente los tokens de color del sistema: `carbon`, `terracota`, `canela`, `mora`, `ocre`, `pavo`, `granada`, `musgo`. |

---

## 2. Anatomía de un Archivo de Diagrama (`content/diagrams/...`)

Cada diagrama es un módulo `.tsx` autónomo estructurado de la siguiente forma canónica:

```tsx
import { createDiagramSpec, DiagramRenderer } from '@/diagrams/public';

/* @matematika-diagram-spec:start */
export const NombreDiagramaSpec = createDiagramSpec(
{
  "version": 3,
  "renderer": "matematika-diagram-renderer-v3",
  "title": "Título en castellano",
  "componentId": "nombre-diagrama",
  "category": "Teoremas",
  "mode": "simulation",
  "axis": false,
  "grid": false,
  "viewport": {
    "bounds": [-5, 5, 5, -5],
    "home": [-5, 5, 5, -5],
    "minZoom": 0.5,
    "maxZoom": 4,
    "padding": 0.1
  },
  "layers": [
    { "id": "geometry", "label": "Geometría", "order": 0, "visible": true, "locked": false },
    { "id": "construction", "label": "Construcción", "order": 1, "visible": true, "locked": false }
  ],
  "groups": [],
  "objects": [
    {
      "id": "pA",
      "label": "A",
      "color": "carbon",
      "layerId": "geometry",
      "order": 10,
      "visible": true,
      "locked": false,
      "groupIds": [],
      "selection": { "selectable": true, "role": "primary", "ariaLabel": "Vértice A" },
      "target": true,
      "targetId": "pA",
      "objectType": "point",
      "definition": { "type": "coordinates", "x": -2, "y": -1 },
      "mobility": { "type": "free" },
      "appearance": { "size": 6, "labelVisible": true }
    }
  ],
  "relations": [],
  "steps": [],
  "note": "Nota explicativa para el alumno",
  "translations": {
    "eu": {
      "title": "Izenburua euskaraz",
      "note": "Ikaslearentzako oharra"
    },
    "en": {
      "title": "Title in English",
      "note": "Student exploration note"
    }
  }
}
);
/* @matematika-diagram-spec:end */

export const NombreDiagrama = () => <DiagramRenderer spec={NombreDiagramaSpec} />;
```

`category` es una de `"Axiomas"`, `"Definiciones"`, `"Teoremas"`, `"Demos"`, `"Ejercicios"`, `"CasosUso"`, y coincide con la carpeta de `content/diagrams/`.

---

## 3. Vinculación con los Artículos MDX (`content/mdx/...`)

### En el MDX:
1. En los metadatos:
   ```yaml
   hasSimulation: true
   ```
2. Import y export del componente de simulación:
   ```tsx
   import { NombreDiagrama } from '@content/diagrams/Categoria/NombreDiagrama';
   export const Simulation = NombreDiagrama;
   ```
3. En el cuerpo del texto, atar fórmulas o términos clave al diagrama:
   ```tsx
   el vértice <VisualBind element="pA" color="carbon">$A$</VisualBind> y el lado <VisualBind element="segBC" color="terracota">$\overline{BC}$</VisualBind>
   ```

### Cómo se resuelve un `<VisualBind element="X">`
- `X` es la **clave de destino** de un objeto o de un grupo con `"target": true`: su `targetId` si lo tiene, si no su `id`. Un objeto con `"target": false` no se puede resaltar desde el texto.
- Cada clave es única en el diagrama. Dos objetos que publican el mismo `targetId` dejan el resaltado ambiguo (pasó en `Bisectriz.tsx`, con el vértice O publicado como `pC`).
- Para resaltar varias piezas a la vez (los dos lados de un criterio, un triángulo entero), crea un `group` con `memberIds`, `"target": true` y su `targetId`, como en `SAS.tsx`.
- En demostraciones, `<ProofStep diagramStep="stepN">` activa el paso `stepN` de `spec.steps` al hacer scroll. Cada `diagramStep` del MDX debe existir en `steps`, con el mismo `id`, en los tres idiomas.

---

## 4. Flujo de Trabajo para Crear o Refactorizar un Diagrama

```
1. Analizar MDX y Necesidad Pedagógica → 2. Diseñar Geometría v3 → 3. Validar con Scripts → 4. Comprobar Sincronización Trilingüe
```

1. **Requisitos pedagógicos:**
   - ¿Qué concepto demuestra?
   - ¿Cuáles son los puntos generadores libres y cuáles los construidos/dependientes?
   - Si tiene pasos (`steps`), definir qué se añade o resalta en cada fase sin ocultar la figura original.

2. **Tipos de objetos geométricos (`objectType`):**
   - `point`: coordenadas directas, punto medio (`midpoint`), intersección (`intersection`), proyección perpendicular (`projection`).
   - `path`: segmentos (`segment`), rectas (`line`), semirrectas (`ray`), polígonos (`polygon`), circunferencias (`circle`), arcos (`arc`).
   - `angle`: medido entre tres puntos, con marcador de arco o cuadrado (`marker: 'square'`).
   - `region` / `area`: descomposiciones de áreas o semiplanos.

3. **Validación:**
   Desde la raíz del repositorio:
   - Verificación rápida y focalizada de un diagrama individual:
     ```bash
     npx tsx .agents/skills/matematika-diagram-generator/scripts/verify-diagram.ts <ruta-al-diagrama.tsx>
     ```
     Comprueba que el spec sea `visual-exact`, que las claves de destino sean únicas, que `visibleTargets` y `objectStates` de cada paso nombren objetos existentes y que `translations.eu` y `translations.en` tengan `title` y todos los pasos.
   - Sincronía con el texto (`VisualBind`, `diagramStep`, colores) en los tres idiomas del nodo que lo usa:
     ```bash
     node .agents/skills/matematika-content-generator/scripts/validate-nodes.mjs <id-del-nodo>
     ```
   - Verificación global de la suite de diagramas y tipado:
     ```bash
     npx tsx scripts/editor/check-diagrams-support.ts
     npm run typecheck
     ```
   Asegurar que el recurso esté en **Edición visual exacta (`visual-exact`)** y que no haya recursos inválidos.

---

## 5. Animaciones Continuas y Transiciones entre Pasos

Los diagramas soportan animaciones fluidas y desplazamientos de piezas mediante tres mecanismos complementarios:

### A. Deslizador de Control / Parámetro de Animación (`control` / `slider`)
Se define un objeto `control` con variante `slider` (típicamente `animT` con rango de `0` a `1` y paso `0.01`):
```json
{
  "id": "animT",
  "label": "t",
  "color": "terracota",
  "layerId": "annotations",
  "order": 0,
  "visible": true,
  "locked": false,
  "groupIds": [],
  "selection": { "selectable": true, "role": "primary", "ariaLabel": "Control de animación" },
  "target": false,
  "objectType": "control",
  "variant": "slider",
  "position": [1.2, -1.7],
  "range": { "min": 0, "max": 1, "step": 0.01 },
  "value": 0
}
```

### B. Geometría Interpolada y Reactiva (`expression`)
Puntos y posiciones se parametrizan en función del deslizador mediante expresiones matemáticas analíticas (interpolación lineal o transformaciones):
```json
{
  "id": "pMovil",
  "label": "P",
  "objectType": "point",
  "definition": {
    "type": "expression",
    "x": "xIni + (xFin - xIni) * animT",
    "y": "yIni + (yFin - yIni) * animT",
    "fallback": [0, 0]
  },
  "mobility": { "type": "fixed" }
}
```

### C. Visibilidad Condicional Reactiva (`visibleWhen`)
Para mostrar/ocultar cotas, áreas o elementos auxiliares en momentos precisos de la animación (por ejemplo, sólo al inicio o al finalizar el desplazamiento):
```json
{
  "id": "cotaFinal",
  "visible": false,
  "visibleWhen": "gt(animT, 0.98)"
}
```
*(Funciones soportadas: `gt(a, b)`, `lt(a, b)`, `gte(a, b)`, `lte(a, b)`, `eq(a, b)`, etc.)*

### D. Duración y Asignación de Deslizador por Paso (`steps`)
Al pasar de un paso a otro en la demostración:
1. **`durationMs`**: Duración en milisegundos de la transición suave entre pasos (ej. `1000` o `1200` ms).
2. **`objectStates[sliderId].value`**: Asigna el valor objetivo del deslizador en dicho paso. El motor interpola suavemente el valor del deslizador durante `durationMs`, ejecutando la animación de todas las piezas dependientes.
```json
{
  "id": "paso-reordenacion",
  "label": "Desplazamiento a la segunda configuración",
  "description": "Las piezas se deslizan suavemente...",
  "durationMs": 1200,
  "visibleTargets": ["figuraBase", "pMovil", "poligonoMovil"],
  "objectStates": {
    "animT": { "value": 1 },
    "figuraBase": { "emphasis": "primary" }
  }
}
```
### E. Controles Genéricos y Modelado de Causalidad Didáctica
1. **Controles y Deslizadores (`control` con variant `slider`)**:
   - `width`: Anchura / longitud visual configurable en unidades de coordenadas (por defecto `2.6`). En simulaciones con múltiples parámetros o botones compactos, usar valores entre `1.4` y `1.8` para no saturar el viewport.
   - **Reactividad instantánea**: Los deslizadores disparan actualizaciones de forma continua durante el arrastre (`drag`) y al soltar (`up`), permitiendo respuestas visuales fluidas.
   - Editable interactivamente desde el inspector del Editor Visual (`SliderInspector`).
2. **Causalidad Didáctica en Cadenas Lógicas (ej. Inducción Matemática / Efecto Dominó)**:
   - Al modelar dependencias deductivas (como $P(1) \land [P(k) \implies P(k+1)] \implies \forall n\, P(n)$):
     - El **caso base** $P(1)$ debe activar el impulso inicial de la cadena.
     - La **hipótesis/paso inductivo** $P(k) \implies P(k+1)$ debe modelar el *puente de transmisión* (ej. separación geométrica entre fichas tal que si el paso no está probado, la distancia $d > H$ impide el contacto y la propagación se interrumpe).
     - Solo cuando ambos controles son verdaderos la cadena se propaga íntegramente hacia el infinito.

---

## 6. Referencias Técnicas Adicionales
- [spec-v3-schema.md](./references/spec-v3-schema.md): Especificación detallada del esquema Zod de objetos, geometrías, controles y relaciones.
- [paleta-y-estilos.md](./references/paleta-y-estilos.md): Sistema de diseño, tokens de color y **estilo del chrome** (botones, paneles, anotaciones). **Leer antes de cambiar cualquier estilo visual de diagramas.**
