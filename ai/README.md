# Capa operativa de IA

`ai/` convierte el gobierno común en paquetes pequeños de trabajo diario. Es neutral respecto a la herramienta y contiene contexto mutable, no reglas globales.

## Índice

| Ruta | Uso |
|---|---|
| [`current-state.md`](current-state.md) | Fase activa, decisiones recientes, bloqueos y siguiente paso |
| [`credit-policy.md`](credit-policy.md) | Presupuesto de contexto y escalado entre herramientas |
| [`goals/`](goals/) | Criterios de éxito estables por área |
| [`tools/`](tools/) | Papel y forma de uso de cada herramienta |
| `phases/` | Planes acotados de fases; se crea cuando exista una fase |
| `prompts/` | Prompts reutilizables, sin reglas duplicadas |
| `indexes/` | Inventarios ligeros generados o mantenidos para localizar contexto |
| `reports/` | Relevos y auditorías con fecha; no logs completos |
| `automation/` | Especificaciones de automatización antes de llevarlas a scripts |

Las cuatro últimas carpetas se crean solo cuando tengan contenido útil.

## Índices generados

`indexes/` contiene mapas JSON compactos para localizar arquitectura, contenido, grafo, componentes, diseño, Lean, comandos y deuda sin cargar árboles completos. Se regeneran con `npm run ai:index`; son inventarios deterministas y no sustituyen las fuentes de verdad ni sus validadores.

## Revisión del working tree

`npm run ai:review` inspecciona cambios unstaged, staged y untracked, los clasifica por ruta y recomienda las validaciones mínimas disponibles en `package.json`. El comando es determinista y de solo lectura: no ejecuta validadores ni modifica archivos. Sus warnings señalan, entre otros, MDX, Lean, gobierno multi-IA y artefactos generados que requieren revisión humana.

## Inicio de sesión

1. Leer `AGENTS.md`.
2. Leer `current-state.md`.
3. Elegir un solo archivo de `goals/`.
4. Consultar `tools/` para asignar la herramienta.
5. Cargar skills y archivos de producto únicamente cuando la tarea los requiera.

Al cerrar una fase se actualiza `current-state.md` y se deja un informe breve si otra sesión necesita continuar. Los detalles formales no se duplican desde `docs/ai/`.
