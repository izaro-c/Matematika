---
description: Crear nueva página de concepto matemático (MDX)
agent: content-writer
---
Crea una nueva página de contenido matemático en MDX.
PRIMERO carga la skill page-creator.
PREGUNTA al usuario: 1) tipo de contenido (teorema/definicion/axioma/etc), 2) título, 3) dependencias lógicas.
USA la plantilla MDX correspondiente de src/shared/templates/.
VALIDA los metadatos contra el Zod schema de src/entities/content/schemas.ts.
VERIFICA que el ID está en kebab-case y es único.
CREA el archivo en src/database/content/{tipo}s/.
