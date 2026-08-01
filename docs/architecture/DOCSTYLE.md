# DOCSTYLE — documentación in-code

Fuente de verdad para comentarios y API docs generada.

## Generar

```bash
npm run docs:build    # TypeDoc → docs/api/
npm run docs:check    # TypeDoc con warnings como error (cuando haya barrels públicos en src)
```

## Qué documentar

| Símbolo | Requisito |
|---|---|
| Export público (función, tipo, clase, constante de API) | TSDoc con resumen |
| Barrel / `public.ts` | `@packageDocumentation` o bloque de módulo |
| API interna reexportada solo por tests | `@internal` |
| Comportamiento no obvio / techo consciente | párrafo corto o `ponytail:` |

No documentar getters triviales ni re-exports mecánicos.

## Formato TSDoc

- Primera línea = resumen
- `@param`, `@returns`, `@throws`, `@example` cuando aporten
- Inglés en símbolos de API (ecosistema TypeDoc); READMEs de dominio pueden ir en español
- Enlaces: `{@link SymbolName}`

## Dónde vive la prosa de arquitectura

| Tipo | Sitio |
|---|---|
| Mapa “dónde edito X” | `docs/architecture/CODEMAP.md` |
| Este estilo | `docs/architecture/DOCSTYLE.md` |
| Dominio (propósito, entrypoints) | `src/<domain>/README.md` |
| API navegable | `docs/api/` (generada; no editar a mano) |

## Migración

Código nuevo en `src/` debe cumplir este estilo **en el mismo PR** que lo introduce. El legado en `src/` se documenta al reescribirlo, no en masa antes.
