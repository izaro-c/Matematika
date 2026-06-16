# STYLEGUIDE — Memoria Institucional de Matematika

Este archivo es la **fuente de verdad única** para la IA y cualquier desarrollador. Se debe revisar al inicio de cualquier sesión de trabajo. Contiene las decisiones arquitectónicas y estéticas acordadas y no negociables del proyecto.

---

## 1. Filosofía y Objetivos Fundamentales

- **Jardín Digital, no PDF interactivo:** Cada concepto es un nodo navegable en una red de conocimiento. La lectura puede ser lineal o exploratoria.
- **Universalidad absoluta:** El contenido matemático base no tiene país, currículo ni sistema educativo. Es atemporal.
- **Interactividad como norma:** Si un concepto puede visualizarse, se visualiza. Si un ejercicio puede hacerse interactivo, lo es.
- **Elegante y limpio:** El diseño sirve a las matemáticas, no compite con ellas.

---

## 2. Regla de Universalidad (Tolerancia Cero)

El tono debe ser puramente matemático y universal. **Eliminar** de las lecciones generales cualquier alusión a currículos específicos ("Selectividad", "EBAU", "Evaluación de acceso"). Esas alusiones deben relegarse únicamente a los `Study Plans` en `src/content/plans/`.

---

## 3. Sistema de Enlazado Semántico (Obligatorio)

Bajo ninguna circunstancia se usarán hipervínculos Markdown estándar `[texto](url)` para navegación interna. Se utilizarán exclusivamente los siguientes componentes de `MDXBlocks.tsx`:

- `<ConceptLink targetId="slug">texto</ConceptLink>` → Abre el **MarginaliaPanel** por la derecha con un preview del nodo. (No navega directamente.)
- `<GlossaryLink term="término">texto</GlossaryLink>` → Tooltip rápido para términos auxiliares menores.
- `<VisualBind color="[token]" element="[id]">texto</VisualBind>` → Conecta texto con elemento del diagrama adyacente. Al hover: ilumina el elemento. Los tokens de color son: `terracota`, `salvia`, `pizarra`, `carbon`, `granada`.

---

## 4. Estructura Estándar de Páginas MDX

```
export const metadata = { id, title, branch, ... }
import/export del Simulation (si aplica)

<Capitular letra="X" />
Introducción breve.
<Separador />
### Sección 1
...
<Demostracion> ... </Demostracion>
<Separador />
### Sección 2
<MedievalStep number={1} title="..." target="..."> ... </MedievalStep>
```

**Reglas:**
- Siempre `<Capitular>` al inicio.
- Siempre `<Separador>` entre secciones (nunca `---`).
- Las demostraciones siempre dentro de `<Demostracion>`.
- Las citas/epígrafes con `<Cita author="...">`.

---

## 5. Paleta Semántica (Single Source of Truth)

| Token | Clase Tailwind | Hex | Significado matemático |
|---|---|---|---|
| `--color-lienzo` | `bg-lienzo` | `#F8F6F1` | Fondo general |
| `--color-carbon` | `text-carbon` | `#333333` | Ejes, bordes, texto principal |
| `--color-salvia` | `text-salvia` | `#A2C2A2` | Planos, coeficientes |
| `--color-terracota` | `text-terracota` | `#C86446` | Puntos, vectores, incógnitas |
| `--color-pizarra` | `text-pizarra` | `#5D7080` | Distancias, resultados, secundario |

La relación texto ↔ gráfico en color es **1:1 e inmutable**.

---

## 6. Naming Conventions

- **Slugs / IDs de contenido:** `snake_case` en minúsculas. Ej: `teorema_pitagoras`.
- **Archivos de contenido:** `snake_case.mdx`.
- **Componentes React:** `PascalCase.tsx`. Ej: `LinearSystemVisualizer.tsx`.
- **Imports de diagramas:** rutas relativas explícitas. Ej: `../../diagrams/LinearAlgebra/MatrixVisualizer`.

---

## 7. Protocolo de Modificaciones Masivas

Para cambios transversales a múltiples archivos `.mdx`:
1. Escribir un script Node.js en `scripts/` (extensión `.cjs`).
2. Ejecutarlo y verificar resultados.
3. Revisar una muestra de los archivos modificados.

**Prohibido:** editar 10+ archivos MDX individualmente con `replace_file_content`.

---

## 8. Componentes de Presentación Disponibles

| Componente | Uso |
|---|---|
| `<Capitular letra="X" />` | Primera letra decorativa al inicio de la página |
| `<Separador />` | Divisor visual entre secciones |
| `<Cita author="Nombre">texto</Cita>` | Epígrafes y citas |
| `<Demostracion>...</Demostracion>` | Bloque formal de demostración matemática |
| `<MedievalStep number={N} title="..." target="...">` | Paso en un proceso secuencial |
| `<ConceptLink targetId="...">` | Enlace semántico a nodo con página propia |
| `<GlossaryLink term="...">` | Tooltip para término auxiliar |
| `<VisualBind color="..." element="...">` | Binding texto-diagrama |

---

## 9. Checklist Antes de Dar Algo por Terminado

- [ ] ¿Hay referencias a "Selectividad" o "EBAU" en contenido base? → **Eliminar.**
- [ ] ¿Hay links Markdown `[texto](url)` internos? → **Reemplazar por `<ConceptLink>`.**
- [ ] ¿El nodo tiene simulación visual? Si podría tenerla y no la tiene → **Añadirla.**
- [ ] ¿Los colores del diagrama usan los tokens semánticos del texto? → **Verificar.**
- [ ] ¿El slug del archivo = `id` del frontmatter = `targetId` de los links que apuntan a él? → **Confirmar.**
- [ ] ¿Hay `<Capitular>` al inicio y `<Separador>` entre secciones? → **Confirmar.**
