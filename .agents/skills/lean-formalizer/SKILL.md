---
name: lean-formalizer
description: Formaliza contenido de Matematika con Lean 4/Mathlib, mantiene leanId, stepTacticMap, bloques de tactica anotados, lean_graph.json/proof_blocks.json y validacion validate-lean. Usar al crear o modificar archivos .lean, enlazar MDX con Lean, revisar divergencias Lean-MDX o scaffold de pruebas verificadas.
---

# Skill: lean-formalizer — Puente Lean 4 para Matematika

## Overview

Usa esta skill cuando una tarea toque la capa formal Lean de Matematika. Lean es la verdad mecanica para las paginas con `leanId`; MDX conserva la pedagogia, enlaces semanticos y visualizaciones.

Skills hermanas:
- `project-philosophy` — principios no negociables.
- `page-creator` — metadata MDX, ConceptLink/RefLink y escritura pedagogica.
- `diagrama` — visualizaciones interactivas, independientes de la traza Lean.

## Workflow

1. Identifica la pagina MDX objetivo y su `metadata.id`.
2. Crea o edita la declaracion Lean en `lean/Matematika/...`.
3. Anota la declaracion con:
   ```lean
   -- @matematika-id "teorema-congruencia-ala" @lean-id "Matematika.Geometry.congruence_ala" @kind "theorem" @deps ["axioma-congruencia-1"]
   ```
4. Agrupa tacticas con bloques nombrados:
   ```lean
   -- @tactic-block-start "ala-step1-transport"
   have h_transport := h
   -- @tactic-block-end "ala-step1-transport"
   ```
5. Actualiza el MDX:
   - `leanId`: declaracion Lean exacta.
   - `leanCommitSha`: SHA o `local-bridge` para trabajo local.
   - `stepTacticMap`: solo en demostraciones, mapeando numero de `MedievalStep` a IDs de bloques.
6. Ejecuta `npm run lean:graph` para regenerar `src/entities/graph/lean_graph.json` y `proof_blocks.json`.
7. Ejecuta `npm run validate-lean`. Si `lake` no esta instalado, instala el toolchain antes de considerar valida la prueba formal.

## Convenciones

- Nombres Lean: namespace `Matematika.<Area>`, snake_case Lean idiomatico para teoremas, `leanId` completo en MDX.
- IDs Matematika: siempre kebab-case y nunca derivados automaticamente si ya existe una pagina.
- Dependencias `@deps`: usa IDs Matematika, no nombres Lean, para comparar con el jardin MDX.
- No inventes `leanId`: si la declaracion no existe, dejalo ausente o crea primero el `.lean`.
- No pongas codigo Lean en el flujo principal de lectura MDX; usa `stepTacticMap` y `ProofStepExpander`.
- No cambies `MathStore.step`, `highlight` ni diagramas para mostrar prueba formal; la traza Lean es textual y colapsada.

## Validacion

Comandos esperados:

```bash
npm run lean:build
npm run lean:graph
npm run validate-lean
npm run generate-index
```

Una divergencia Lean-MDX se corrige cambiando la fuente equivocada:
- Si Lean prueba otra cosa, corrige Lean.
- Si MDX declara otro `leanId` o `stepTacticMap`, corrige metadata.
- Si la pedagogia omite enlaces, conserva `<ConceptLink>` aunque Lean ya verifique la dependencia.
