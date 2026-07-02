# Matematika — instrucciones globales para agentes

Matematika es un jardín digital enciclopédico para explorar matemáticas como una red semántica navegable. Estas reglas son comunes a ChatGPT, Gemini, Codex, OpenCode, Antigravity y cualquier asistente integrado en el repositorio.

## Carga mínima de contexto

1. Leer siempre este archivo.
2. Para ejecutar trabajo, leer `ai/current-state.md` y solo el objetivo de `ai/goals/` relacionado con la tarea.
3. Cargar la skill de `.agents/skills/` que corresponda antes de actuar.
4. Consultar `docs/ai/` únicamente para gobierno, conflictos o cambios de protocolo.
5. No cargar directorios completos ni copiar reglas entre capas.

## Jerarquía

| Ruta | Autoridad |
|---|---|
| `AGENTS.md` | Reglas globales y orden de lectura |
| `docs/ai/` | Gobierno multi-IA y protocolo formal |
| `ai/` | Estado, objetivos, fases, prompts, índices, informes y automatización operativa |
| `.agents/skills/` | Procedimientos reutilizables cargados bajo demanda |
| `.opencode/` | Adaptador oficial de OpenCode; no define política común |
| `.auxiliary/` | Material histórico o duplicado; nunca fuente de verdad |

Ante un conflicto, prevalecen en este orden: petición explícita del usuario, este archivo, gobierno en `docs/ai/`, skill aplicable y capa operativa `ai/`. Un adaptador de herramienta no puede redefinir las reglas comunes.

## Principios no negociables

- Jardín digital, no PDF interactivo: cada concepto es autónomo y navegable.
- Universalidad: sin currículos, países ni secuencias educativas como marco.
- Interactividad cuando aporte comprensión matemática.
- Diseño elegante y limpio al servicio de las matemáticas.
- Rigor Greenberg/Hilbert: toda afirmación se justifica; nunca por apariencia visual.
- Orden topológico: ninguna dependencia puede apoyarse en un resultado posterior.
- Exposición comprensible, precisa y en tercera persona impersonal.

Para interpretar estos principios, cargar `project-philosophy`.

## Invariantes técnicas

- Los IDs de contenido son kebab-case, inmutables y no se traducen.
- `src/entities/content/schemas.ts` es la autoridad de metadatos.
- El contenido MDX vive en `src/database/content/`; para modificarlo se carga `page-creator`.
- Las demostraciones viven en páginas separadas y mantienen sus justificaciones pedagógicas aunque exista prueba Lean.
- Matematika Core no usa Mathlib. Para Lean o el puente Lean-MDX se carga `lean-formalizer`.
- Los diagramas viven en `src/shared/diagrams/`; para modificarlos se carga `diagrama`.
- Solo se usa la paleta Arts & Crafts: `lienzo`, `carbon`, `salvia`, `terracota`, `pizarra`, `ocre`, `pavo`, `granada` y `musgo`. En diagramas se leen variables `--theme-*`.
- Se respetan las dependencias FSD: `shared` no depende de capas superiores; `entities` no depende de `features`, `widgets` ni `pages`; `features` no depende de `pages` ni `app`; `widgets` no depende de `features`.
- No se editan archivos generados. Se conserva cualquier cambio del usuario ajeno a la tarea.

## Flujo de trabajo

1. Confirmar alcance y estado del árbol de trabajo.
2. Leer solo el contexto necesario y declarar supuestos relevantes.
3. Realizar el cambio mínimo coherente.
4. Validar en proporción al alcance.
5. Entregar cambios, decisiones, validaciones, deuda y siguiente paso.

Para cambios solo documentales o de configuración IA, ejecutar al menos:

```bash
git diff --check
```

Para cambios de producto, usar el orden definido por `npm run full-check`: lint, tipos, tests, arquitectura, referencias, grafo, Lean, cobertura de contenido y auditoría bridge.

No se ejecutan migraciones, despliegues, escrituras externas ni cambios fuera del alcance sin autorización explícita.
