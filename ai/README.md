# Capa operativa de IA

Contexto mutable y artefactos generados. Gobierno estable: [`docs/ai/`](../docs/ai/). Procedimientos: [`.agents/skills/`](../.agents/skills/).

| Ruta | Uso |
|---|---|
| [`current-state.md`](current-state.md) | Fase, bloqueos, siguiente paso |
| [`credit-policy.md`](credit-policy.md) | Paquete mínimo, rutas de trabajo, escalado |
| [`goals.md`](goals.md) | Criterios de éxito (una fila por sesión) |
| `indexes/` | Mapas generados (`npm run ai:index`) |
| `reports/` | `debt-report`, baselines roundtrip/lossless |

## Sesión

1. `AGENTS.md` → `current-state.md` → una fila de `goals.md`
2. Ruta en `credit-policy.md` + skill si aplica
3. Validar lo mínimo; al cerrar, actualizar `current-state.md` si cambió el estado
