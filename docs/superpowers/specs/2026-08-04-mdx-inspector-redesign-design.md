# MDX Inspector Redesign

**Date:** 2026-08-04  
**Status:** Approved

## Goal

Make the MDX editor right panel intuitive and familiar by matching the diagram workbench aside pattern, with a shared tab shell.

## Decisions

- Shared chrome: `WorkbenchAsideTabs` used by DiagramWorkbench and MdxWorkbenchInspector.
- MDX tabs (flat, one level): `Página | Diagramas | Avisos`.
- Links/connections (texto↔diagrama, leanId, semantic notes) live under **Diagramas**.
- Inside Diagramas: accordion sections (reuse diagram `AccordionSection`).
- Remove nested tabs, Conexiones tab, duplicated validation, duplicate headers/close buttons.
- `EditorShell` layout/resize unchanged. Bottom diagnostics stay unused (`null`).
- `SemanticLinker` remains a modal for in-text insertion.

## MDX tab contents

| Tab | Content |
|---|---|
| Página | `MetadataInspector` only |
| Diagramas | Linked diagrams, published targets, text↔diagram connections, Lean/semantic summary |
| Avisos | Issues list + persistence session (from diagnostics panel, no inner close) |

## Diagram consumer

Diagram aside keeps `Objetos | Propiedades | Pasos | Salud`; only the tab chrome moves into the shared component.

## Out of scope

- Contextual block-selection inspector for MDX
- Changing SemanticLinker modal UX
- Bottom diagnostics drawer reactivation
