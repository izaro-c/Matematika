# 03 — Instrucciones Estrictas para la IA (Antigravity IDE)

Este archivo es la **memoria institucional** de Matematika. Debe ser leído al inicio de cualquier sesión antes de tocar código o contenido. Las directivas aquí recogidas son el resultado de decisiones arquitectónicas tomadas durante el desarrollo. No son sugerencias.

---

## REGLA 0 — Leer Siempre Este Archivo Primero

Antes de realizar cualquier cambio estructural, preguntar: *¿Esto cumple con el STYLEGUIDE.md y el 02_Arquitectura_Sistemas.md?*

---

## REGLA 1 — Universalidad del Contenido (Tolerancia Cero)

**Prohibido** incluir en el cuerpo de Lecciones, Teoremas, Definiciones o Biografías cualquier referencia a:
- "Selectividad"
- "EBAU"
- "Evaluación de acceso"
- Cualquier currículo, examen o sistema educativo local

Estas referencias solo pueden existir dentro de archivos de `src/content/plans/` (Planes de Estudio concretos). El contenido base de Matematika es **atemporal y universal**.

> **Cómo aplicarlo:** Si encuentras una frase como "este teorema es muy frecuente en Selectividad", reemplázala por una descripción matemática pura de su importancia o aplicabilidad.

---

## REGLA 2 — Sistema de Enlazado Semántico (Obligatorio)

**Prohibido** usar hipervínculos Markdown estándar `[texto](url)` para navegación interna.

### Componentes disponibles (en `MDXBlocks.tsx`):

**`<ConceptLink targetId="slug">`**
- Para conceptos con página propia: Teoremas, Definiciones, Lecciones, Matemáticos.
- Al hacer clic: desliza el `MarginaliaPanel` (panel lateral derecho). NO navega directamente.
- Incluye un botón "Leer artículo completo" dentro del panel para quien quiera ir a la página.

**`<GlossaryLink term="término">`**
- Para términos auxiliares menores que no tienen página propia.
- Muestra un tooltip rápido gestionado por `SymbolDictionaryManager`.

**`<VisualBind color="[token]" element="[id-diagrama]">`**
- Para conectar texto con un elemento específico del diagrama adyacente.
- Al hacer hover, ilumina el elemento `element` en JSXGraph/Three.js y viceversa.
- Los colores deben ser los tokens semánticos (ver Regla 5).

---

## REGLA 3 — Estructura Estándar de Archivos MDX

Todo archivo `.mdx` en `src/content/` debe seguir esta estructura sin excepción:

```mdx
---
// Frontmatter YAML (tipado por schemas.ts)
---
export const metadata = { /* mismos datos que frontmatter, para el ContentStore */ }

import { Simulation } from '../../diagrams/[Rama]/[Visualizer]'; // Si hay simulación
export { Simulation }; // Para que el Layout la detecte

<Capitular letra="P" />

### Primera Sección

Texto con `<ConceptLink>` y `<VisualBind>`.

### Segunda Sección

<Demostracion>
  Pasos de la demostración envueltos en el componente.
</Demostracion>
```

**Componentes de presentación disponibles:**
- `<Capitular letra="X" />` — Capital decorativa al inicio
- `<Separador />` — Divisor entre secciones (en vez de `---`)
- `<Cita author="Nombre">texto</Cita>` — Citas o epígrafes
- `<Demostracion>...</Demostracion>` — Bloque formal de demostración
- `<MedievalStep number={1} title="..." target="...">...</MedievalStep>` — Pasos secuenciales

---

## REGLA 4 — Simulaciones y Diagramas (Obligatorio Siempre que Sea Posible)

**Si un concepto matemático puede representarse visualmente, debe representarse.**

- Geometría: siempre JSXGraph
- Álgebra lineal (vectores, planos, matrices): JSXGraph (2D) o Three.js (3D)
- Estadística: JSXGraph para distribuciones y gráficas
- Lecciones sin ninguna simulación son un fallo del contenido, no una opción válida.

Los visualizadores viven en `src/diagrams/[Rama]/[NombreVisualizer].tsx`.
Se importan y exportan como `Simulation` desde el MDX para que el Layout los detecte automáticamente.

---

## REGLA 5 — Paleta Semántica (Single Source of Truth de Color)

Los colores son semánticos: cada uno tiene un significado matemático fijo.

| Token CSS | Clase Tailwind | Hex | Significado Matemático | Uso UI |
|---|---|---|---|---|
| `--color-lienzo` | `bg-lienzo` | `#F8F6F1` | — | Fondo general de la app |
| `--color-carbon` | `text-carbon` | `#333333` | Ejes (X, Y, Z), marcos de referencia | Texto principal |
| `--color-salvia` | `text-salvia` | `#A2C2A2` | Planos, coeficientes (A, B, C) | Badges, fondos suaves |
| `--color-terracota` | `text-terracota` | `#C86446` | Puntos, vectores, incógnitas (x, y, z) | Hover, CTAs, elementos activos |
| `--color-pizarra` | `text-pizarra` | `#5D7080` | Distancias, resultados | Texto secundario |

**Regla inmutable:** Si en el MDX un `<VisualBind color="terracota">` describe el punto $P$, el diagrama JSXGraph/Three.js DEBE dibujar ese punto en `#C86446`. La correlación es 1:1 y nunca puede romperse.

---

## REGLA 6 — Nomenclatura (Naming Conventions)

- **IDs de contenido / slugs:** `snake_case` en minúsculas. Ej: `teorema_pitagoras`, `regla_cramer`.
- **Nombres de archivo de contenido:** `snake_case.mdx`. Ej: `sistemas_ecuaciones_lineales.mdx`.
- **Componentes React:** `PascalCase.tsx`. Ej: `LinearSystemVisualizer.tsx`.
- **`targetId` en `<ConceptLink>`:** debe coincidir **exactamente** con el `id` del frontmatter del archivo destino.

---

## REGLA 7 — Modificaciones Masivas via Scripts

**Prohibido** editar 10+ archivos `.mdx` manualmente uno por uno con `replace_file_content`.

Si se necesita un cambio transversal (ej. añadir un campo a todos los teoremas, cambiar el nombre de un componente), se debe:
1. Escribir un script Node.js en `scripts/` (`.cjs`).
2. Ejecutarlo y verificar los resultados.
3. Revisar una muestra representativa de los archivos modificados.

Los scripts `auto_maths.cjs` y `populate_maths.cjs` son los puntos de entrada existentes.

---

## REGLA 8 — Ejercicios y Ejemplos (No son Texto Estático)

- **Ejemplos:** Narrativa de resolución paso a paso usando `<MedievalStep>`. Con su visualizador JSXGraph mostrando el caso concreto.
- **Ejercicios:** El alumno interactúa activamente. Cualquier tipo que ayude a comprender mejor el tema es válido: fill-in-the-blank, selección múltiple, manipulación de puntos en el gráfico, preguntas de reflexión. El feedback es inmediato. Si el alumno falla, el sistema debe explicar el **error común** asociado (no solo decir "incorrecto").
  > **Directiva de Innovación Interactiva:** Al generar contenido para nuevos ejercicios, debes estar **extremadamente atento** a proponer de forma proactiva nuevos componentes interactivos MDX (ej: balanzas algebraicas, selectores lógicos). No te conformes con los componentes existentes si la explicación pedagógica pide a gritos una nueva mecánica en lugar de texto estático.
- **Casos de Uso Real:** Son páginas **propias** (`/caso/:id`, en `src/content/usecases/`). No se integran dentro de las lecciones. Muestran cómo un concepto matemático aparece en la vida real (ingeniería, economía, naturaleza, etc.).

---

## REGLA 9 — Auto-linking de Matemáticos (Obligatorio)

Cuando en cualquier página MDX se mencione el nombre de un matemático, se debe:
1. Envolver el nombre en un `<ConceptLink targetId="[slug_del_matematico]">Nombre</ConceptLink>`.
2. Verificar que existe `src/content/mathematicians/[slug].mdx`. Si **no existe**, crear inmediatamente una página con metadatos mínimos (nombre, años de vida, nacionalidad, stub de contribuciones). El cuerpo puede estar vacío de momento.

Esto garantiza que el Jardín Digital no tenga *enlaces rotos* y que cualquier matemático mencionado sea navegable desde el primer momento.

---

## REGLA 10 — Tipografía Dual

- **Interfaz (UI):** Fuente Sans-Serif (Inter). Menús, buscador, controles, paneles.
- **Contenido Académico (MDX):** Fuente Serif (Playfair Display / EB Garamond). Todo el texto teórico de lecciones, teoremas y biografías.
- Las variables matemáticas en el flujo del texto van siempre entre `$...$` para que KaTeX las renderice.

---

## CHECKLIST PRE-COMMIT (IA)

Antes de dar por terminado cualquier bloque de trabajo, verificar:

- [ ] ¿El contenido nuevo menciona "Selectividad" o "EBAU"? → Eliminar.
- [ ] ¿Se usa `[texto](url)` para navegación interna? → Reemplazar por `<ConceptLink>`.
- [ ] ¿El nodo tiene una simulación? Si no la tiene, ¿es matemáticamente imposible o simplemente no se ha hecho? → Añadirla.
- [ ] ¿Los colores del diagrama coinciden con los tokens semánticos del texto?
- [ ] ¿El slug del archivo y el `id` en el frontmatter son idénticos?
- [ ] ¿Se usó `<Capitular>` al inicio y `<Separador>` entre secciones?
- [ ] Para ejercicios: ¿Se podría enseñar mejor el concepto con un nuevo tipo de componente interactivo en vez de texto estático? (Proponerlo proactivamente).
