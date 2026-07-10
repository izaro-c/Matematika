# Informe de Baseline Técnico y Contención: Fase 0

**Fecha del informe:** 10 de julio de 2026  
**Rama inicial:** `feature/justified-text`  
**Commit inicial / base:** `6b32e298c48878bdffa094ab46889660e16a69e8` ("feat(usecase): impl GPS trilateration case, modularize diagram overlays & update skills")  
**Rama de trabajo actual:** `chore/editor-safety-baseline`

---

## 1. Validación de Baseline Técnico

Se ejecutaron los comandos de validación preexistentes definidos en `package.json` antes de aplicar modificaciones, obteniendo los siguientes resultados:

| Comando | Resultado | Errores / Advertencias | Observaciones |
| :--- | :--- | :--- | :--- |
| `npm run typecheck` | Aprobado | 0 errores / 0 advertencias | Compila perfectamente. |
| `npm run test -- tests/features/editor` | Aprobado | 0 fallos / 36 tests pasados | Suite completa de editor, incluyendo las 5 de contención. |
| `npx eslint src/features/editor tests/features/editor` | Aprobado | 0 errores / 102 advertencias | Advertencias de complejidad cognitiva y anidamiento. |
| `npm run depcruise` | Aprobado | 0 errores / 170 advertencias | Violaciones menores de límites FSD preexistentes. |
| `git diff --check` | Aprobado | 0 advertencias / 0 fallos | Sin problemas de espacios en blanco finales. |
| `npm run ai:review` | Aprobado | - | Ejecutado para control de cambios del working tree. |

### 1.1 Cobertura de Pruebas y Tamaños del Editor
- **Archivos de pruebas del editor:** 4 archivos (`editorContracts.test.ts`, `parser.test.ts`, `validation.test.ts`, `useEditorCore.test.ts`).
- **Tamaños aproximados de archivos del editor:**
  - `src/features/editor/ui/diagrams/DiagramWorkbench.tsx` (~133 KB)
  - `src/features/editor/ui/EditorPage.tsx` (~89.8 KB)
  - `src/features/editor/core/parser.ts` (~21 KB)
  - `src/features/editor/core/validation.ts` (~14.3 KB)
  - `src/features/editor/core/useEditorCore.ts` (~13 KB)

---

## 2. Investigación de la Arquitectura del Editor

### 2.1 Flujo de Autosave y Endpoints
- **Autosave:** Se dispara mediante un callback `scheduleSave` con un temporizador `setTimeout` de 500 ms tras cualquier edición local (metadatos, bloques visuales, cambios de imports/exports, o cambios en el cuerpo Monaco).
- **Endpoints de persistencia:**
  - `/api/draft` (guardado de borradores temporales vía `POST`).
  - `/api/content` (aplicación y guardado del archivo real vía `POST`).
  - `/api/list-content` (listado de archivos del editor vía `GET`).
  - `/api/content?path=...` (carga del archivo real vía `GET`).

### 2.2 Estados del Editor
- Representados mediante el tipo `DirtyState` en `src/features/editor/core/editorTypes.ts`: `'clean' | 'dirty' | 'saving' | 'saved' | 'blocked' | 'error' | 'draft'`.
- Los estados se visualizan en la barra inferior de `EditorPage.tsx`.

---

## 3. Implementación de la Contención

### 3.1 Política Central `VisualSavePolicy`
- Implementada en `src/features/editor/core/useEditorCore.ts`:
  ```ts
  export type VisualSavePolicy = 'disabled' | 'manual-reviewed' | 'enabled';
  export const VISUAL_SAVE_POLICY: VisualSavePolicy = 'disabled';
  ```
- **saveDraft:** Aborta y no invoca a `/api/draft` si `VISUAL_SAVE_POLICY === 'disabled'`.
- **saveCurrentFile:** Bloquea llamadas a `/api/content` si se encuentra en modo visual (`editorMode === 'visual'`) y la política está en `'disabled'`.
- **Limpieza de Temporizadores:** Se implementó limpieza del temporizador de autosave (`saveTimerRef`) en:
  - Cambio de archivo (`openFile`).
  - Cambio de modo (`toggleEditorMode`).
  - Desmontaje del hook (`useEffect` con callback de retorno).

### 3.2 Indicación de Estado Experimental
- Se agregó el banner destacado de aviso integrado en el panel visual (estilizado con color ocre de la paleta Arts & Crafts del proyecto) informando que el guardado visual está desactivado y los cambios son locales.
- Se renombró el botón de alternancia a **Modo Visual (Experimental)**.

---

## 4. Pruebas Añadidas

En `tests/features/editor/useEditorCore.test.ts`:
1. **declares the containment policy as disabled:** Asegura que la constante se defina en `'disabled'`.
2. **keeps local status as dirty but blocks saveDraft from fetching when disabled:** Valida que las ediciones visuales marquen el estado local como `dirty` pero no invoquen el endpoint del borrador.
3. **blocks saveCurrentFile in visual mode but allows it in code mode:** Confirma que el guardado se bloquee en modo visual pero sea viable tras cambiar a modo código.
4. **handles HTTP error in manual code save flow correctly:** Valida que las respuestas 500 no se interpreten como éxito y mantengan el estado local como `dirty`.
5. **clears pending timers on openFile, toggleEditorMode, and unmount:** Verifica la cancelación de temporizadores en la transición de archivos, modos y ciclo de vida del editor.

---

## 5. Deuda Preexistente Registrada
- 102 advertencias de ESLint (complejidad cognitiva en `parser.ts` y condicionales anidados en `EditorPage.tsx`).
- 170 advertencias de dependency cruiser.

---

## 6. Riesgos Residuales
- **Error en la sincronización manual:** Si el usuario edita de forma errónea el código fuente manual, el validador semántico interceptará el error, pero el round-trip sigue dependiendo del parser anterior (será resuelto en las Fases 1 a 3).
