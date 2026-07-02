# Workflows multi-IA

Estos flujos aplican el ciclo de [`docs/ai/protocol.md`](../docs/ai/protocol.md) con el contexto mínimo de [`credit-policy.md`](credit-policy.md). Cada ejecución comienza declarando: objetivo, alcance, archivos permitidos, archivos prohibidos, validaciones y resultado esperado.

## Selección rápida

| Trabajo | Pack | Herramienta principal | Revisión adicional |
|---|---|---|---|
| Cambio de código | [`code-refactor`](context-packs/code-refactor.md) | Codex | Solo si cambia arquitectura o comportamiento crítico |
| Cambio de UI | [`ui-exploration`](context-packs/ui-exploration.md) | Antigravity para explorar; Codex para integrar | Gemini ante una duda visual concreta |
| Creación de contenido | [`content-authoring`](context-packs/content-authoring.md) | OpenCode | Gemini si existe incertidumbre pedagógica |
| Revisión pedagógica | [`pedagogy-review`](context-packs/pedagogy-review.md) | Gemini | OpenCode o Codex aplica correcciones aprobadas |
| Navegación o grafo | [`graph-navigation`](context-packs/graph-navigation.md) | Codex | ChatGPT si hay un trade-off de producto |
| Formalización Lean | [`lean-formalization`](context-packs/lean-formalization.md) | Codex | Revisión independiente para afirmaciones nuevas |
| Tooling o automatización | [`automation-tooling`](context-packs/automation-tooling.md) | Codex | ChatGPT para permisos o recuperación |
| Antes de commit | [`validation-review`](context-packs/validation-review.md) | Codex u OpenCode validator | VS Code para aprobación humana |

## Contrato común

1. Leer `AGENTS.md`, `ai/current-state.md`, un único objetivo y el pack elegido.
2. Cargar una skill solo si coincide con el cambio; los packs no la sustituyen.
3. Inspeccionar estado y diff antes de escribir. No editar generados ni trabajo ajeno.
4. Aplicar el cambio mínimo dentro de los permisos declarados.
5. Ejecutar las validaciones del pack en orden de menor a mayor coste.
6. Entregar objetivo, decisiones, archivos, resultados, deuda y siguiente acción.

Si cambia el alcance, se detiene la escritura y se vuelve a declarar el contrato. La segunda herramienta se añade solo con una hipótesis o riesgo concreto.

## Flujos

### Cambio de código

Codex localiza la frontera afectada con los índices, define el comportamiento preservado, modifica código y tests relacionados y ejecuta tipos, test dirigido y arquitectura. Si el refactor revela otro problema, lo registra como deuda en vez de ampliar el diff.

### Cambio de UI

Antigravity produce una propuesta acotada con estados, interacción, accesibilidad y tokens existentes. Tras aprobación, Codex la integra respetando FSD y valida tipos y tests. Gemini revisa solo cuestiones visuales o de jerarquía aún disputadas.

### Creación de contenido

OpenCode carga `page-creator` y, solo si corresponde, `diagrama` o `lean-formalizer`. Comprueba ID, schema y dependencias antes de crear MDX. La validación cubre referencias, grafo y cualquier puente Lean tocado.

### Revisión pedagógica

Gemini trabaja en solo lectura y separa errores matemáticos, pedagógicos y de estilo. Cada hallazgo incluye evidencia, impacto y corrección propuesta. Las modificaciones se encargan después a una herramienta con escritura y alcance explícito.

### Navegación y grafo

Codex distingue navegación de producto, enlaces semánticos y dependencias lógicas. Usa los índices para localizar fuentes, pero valida contra schemas, código y validadores; nunca edita JSON generado.

### Lean

Codex carga `lean-formalizer`, conserva la pedagogía MDX y trabaja sin Mathlib. Tras compilar, regenera mediante comandos oficiales y verifica grafo, certificados y deuda bridge. `sorry` o `admit` nunca cierran una prueba.

### Tooling y automatización

ChatGPT puede fijar disparador, entradas, salidas, permisos y recuperación; Codex implementa el artefacto idempotente. Se prueba un caso válido y uno fallido, sin despliegues, migraciones ni escrituras externas implícitas.

### Revisión antes de commit

Codex u OpenCode ejecuta `npm run ai:review`, comprueba que el diff respeta el alcance y lanza las validaciones recomendadas. La revisión prioriza defectos y riesgos; VS Code sirve para inspección y aprobación humana. El agente no crea el commit salvo petición explícita.
