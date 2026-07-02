# Contrato operativo del guardrail FSD

**Fecha:** 2026-07-02

**Fase:** 8 — calibración del guardrail arquitectónico

**Alcance:** `.dependency-cruiser.js` y documentación del contrato. No se ha movido código ni se han cambiado imports de producto.

## Contrato FSD operativo

El contrato ejecutable actual es:

| Capa | Restricción vigilada |
| --- | --- |
| `app` | Es la capa de composición raíz; no tiene una prohibición FSD de salida. |
| `pages` | Una page no importa otra slice de `pages`; sí puede importar dentro de su propia slice. Esta fase no cambia sus relaciones con otras capas. |
| `widgets` | `widgets → features` permanece como deuda visible en `warn`. Esta fase no amplía la regla a otros destinos. |
| `features` | No importa `app` ni `pages`; los cruces entre features distintas permanecen visibles. |
| `entities` | No importa `app`, `pages`, `widgets` ni `features`; esta frontera ya es `error`. |
| `shared` | No importa `app`, `pages`, `widgets`, `features` ni `entities`. |

Una slice es el primer segmento bajo `src/features/` o `src/pages/`. En `pages`, un archivo plano constituye su propia slice y un directorio como `pages/Home/` constituye una slice completa. Los imports internos de una misma slice son válidos y no son cruces arquitectónicos.

Las reglas FSD con deuda preexistente se mantienen en `warn`. Esta fase no eleva severidades ni bloquea el baseline.

## Reglas calibradas

### `fsd-features-cross-imports`

La regla captura el nombre de la feature origen y excluye únicamente su propio subárbol en el destino. Ya no marca imports internos de `editor`, `graph`, `exercises` u otras features, pero sigue marcando cualquier destino bajo una feature distinta.

### `fsd-pages-no-cross-imports`

La regla captura la slice de page, tanto para archivos planos como para directorios. Los imports `pages/Home → pages/Home/components` dejan de ser warnings; un import desde `Home` hacia otra page, o entre dos pages planas, continúa cubierto.

### `fsd-shared-no-upper-layers`

La lista de destinos prohibidos incluye ahora explícitamente `app`, además de `pages`, `widgets`, `features` y `entities`. Así se hacen visibles los 56 imports `shared → app` existentes.

### Excepciones acotadas

Las excepciones ya no se representan mediante reglas que produzcan warnings por el mero hecho de ser conocidas:

- `src/shared/ui/MDXBlocks.tsx` puede componer `features` y `widgets`. Una regla separada impide que la excepción se amplíe hacia `app`, `pages` o `entities`.
- `src/shared/ui/ModelBadge.tsx` solo puede reexportar `src/features/graph/ui/ModelBadge.tsx`.
- `src/shared/ui/MaterialPracticoSection.tsx` solo puede reexportar `src/widgets/content/MaterialPracticoSection.tsx`.

Las rutas están enumeradas con archivo y destino exactos. No existe una allowlist global ni una exclusión de directorio completa.

## Warnings antes y después

Baseline reproducido sobre 262 módulos y 745 dependencias:

| Regla | Antes | Después | Lectura |
| --- | ---: | ---: | --- |
| `fsd-features-cross-imports` | 66 | 6 | Se eliminan 60 imports internos de la misma feature. |
| `fsd-pages-no-cross-imports` | 3 | 0 | Se eliminan 3 imports internos de `pages/Home`. |
| `fsd-shared-no-upper-layers` | 57 | 113 | Se añaden 56 cruces reales `shared → app` antes invisibles. |
| `fsd-exception-mdxblocks` | 20 | — | Retirada como fuente de warnings; sustituida por una excepción acotada. |
| `fsd-exception-shims` | 2 | — | Retirada como fuente de warnings; sustituida por dos contratos exactos. |
| `fsd-features-no-upper-layers` | 2 | 2 | Deuda real sin cambios. |
| `fsd-widgets-no-features` | 8 | 8 | Deuda real sin cambios. |
| `no-orphans` | 8 | 8 | Candidatos sin cambios. |
| **Total** | **166** | **137** | **0 errors en ambos casos.** |

Se eliminaron 85 warnings sin señal arquitectónica y se incorporaron 56 violaciones reales que estaban en un punto ciego. La reducción neta es de 29 warnings; no es un objetivo artificial de cero.

## Deuda real que queda visible

### Cruces entre features

Los seis cruces reales permanecen bajo `fsd-features-cross-imports`:

- `exercises → dynamic-vars`: `DeslizadorEnLine.tsx → DynamicVarStore.ts`.
- `exercises → lessons`: `Paso.tsx`, `Pregunta.tsx` y `Solucion.tsx → LessonStore.ts`.
- `glossary → progress`: `ConceptLink.tsx` y `RefLink.tsx → UserProgressStore.ts`.

### Otras fronteras

- 113 warnings `shared → capas superiores`: 56 hacia `app`, 54 hacia `features` y 3 hacia `entities`.
- De los 113, 107 nacen en `shared/diagrams`, 2 en `shared/hooks` y 4 en `shared/ui`.
- 2 warnings `features → app`: `MathBoard → MathStoreContext` y `StudyTask → StudyPlanContext`.
- 8 warnings `widgets → features`.
- 8 módulos marcados por `no-orphans`.

La concentración de `shared → app` en diagramas confirma deuda de ubicación o de inyección de estado; esta fase solo la vuelve medible.

## Excepciones conocidas y retirada

`MDXBlocks` es actualmente el composition root de MDX aunque viva en `shared/ui`. La excepción se retirará cuando la composición suba a una capa apropiada o exista un puerto que elimine sus imports hacia `features` y `widgets`.

Los dos shims preservan rutas legacy. Cada excepción se retirará cuando sus consumidores importen la implementación canónica y el reexport deje de ser necesario.

Hasta entonces, cualquier destino adicional desde esos tres archivos debe considerarse una regresión. Cambiar el nombre, patrón o alcance de una excepción requiere actualizar este documento y justificar el nuevo borde exacto.

## Qué no se ha tocado

- Ningún archivo bajo `src/`, `tests/` o `lean/`.
- Ningún import ni comportamiento de producto.
- Ningún MDX, script npm, `package.json`, lockfile, índice o informe generado.
- Ninguna severidad se ha elevado a `error`.
- No se han corregido ni ocultado los warnings reales existentes.

## Criterio para futuras regresiones

Mientras el baseline no sea bloqueante:

1. Un import interno de la misma slice no debe producir warning.
2. Todo cruce nuevo entre slices de `features` o `pages` debe revisarse como regresión.
3. Todo nuevo import desde `shared` hacia una capa superior debe producir warning.
4. Las excepciones solo aceptan los bordes exactos documentados; no se amplían mediante regex de directorio.
5. No debe aceptarse una subida del conjunto de aristas por regla aunque el total global baje por otra limpieza.
6. Una reducción del baseline debe conservarse en el siguiente cambio.

La ratchet futura debería comparar el conjunto exacto de aristas por regla a partir de la salida JSON de Dependency Cruiser: la deuda conocida puede seguir temporalmente en `warn`, pero una arista nueva debe fallar en CI. No se activa todavía porque esta tarea no modifica scripts, tests ni comandos npm.
