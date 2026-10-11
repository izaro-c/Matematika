---
name: matematika-diagram-generator
description: Use whenever creating, modifying, refactoring, fixing or reviewing interactive geometric diagrams in Matematika under content/diagrams/ (v3 DiagramSpec), and whenever binding diagram targets to MDX content (<VisualBind>, <Simulation>, steps). Ensures strict TypeScript/v3 schema compliance, bidirectional visual editor compatibility (lossless / clean envelope), pedagogic clarity with interactive constructions, and trilingual sync (Castellano, Euskara Batua, English).
---

# Generador y Estándar de Diagramas Interactivos — Matematika

Motor interactivo y declarativo de representaciones geométricas y analíticas 2D para la enciclopedia deductiva Matematika, compatible con el **Editor Visual** del proyecto y renderizado en JSXGraph / React.

---

## 1. Principios Fundamentales

| Principio | Regla Innegociable |
|---|---|
| **1. Compatibilidad Visual Exacta (`visual-exact`)** | Los diagramas deben ser compatibles con el Editor Visual de Matematika. Deben usar la especificación **`v3`** envuelta entre `/* @matematika-diagram-spec:start */` y `/* @matematika-diagram-spec:end */` con `createDiagramSpec(JSON_VALIDO)` y exportar `<DiagramRenderer spec={...Spec} />`. |
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
  "category": "Teoremas", // "Axiomas" | "Definiciones" | "Teoremas" | "Demos" | "Ejercicios" | "CasosUso"
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
   ```bash
   npx tsx scripts/editor/check-diagrams-support.ts
   npm run typecheck
   ```
   Asegurar que el recurso esté en **Edición visual exacta (`visual-exact`)** y que no haya recursos inválidos.

---

## 5. Referencias Técnicas Adicionales
- [spec-v3-schema.md](./references/spec-v3-schema.md): Especificación detallada del esquema Zod de objetos, geometrías y relaciones.
- [paleta-y-estilos.md](./references/paleta-y-estilos.md): Sistema de diseño, tokens de color y roles de selección.
- [pedagogia-geometria.md](./references/pedagogia-geometria.md): Buenas prácticas en didáctica matemática interactiva.
