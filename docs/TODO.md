# TODO — Matematika

Última actualización: 2026-10-16 (a partir de la valoración general del proyecto).
Prioridad: 🔴 bloqueante para publicar · 🟠 importante · 🟡 mejora.

## 🔴 Bloqueantes para publicar

### Legal y titularidad (ver `docs/checklist-pre-despliegue.md`)
- [ ] Definir el titular (nombre / entidad) y qué datos figuran en el aviso legal
- [ ] Páginas de Aviso Legal, Privacidad y Cookies en es / eu / en (`/es/aviso-legal`, `/eu/lege-oharra`…)
- [ ] Enlaces permanentes a esas páginas en `HomeFooter.tsx` y en el menú global
- [ ] Contacto visible (`mailto:` o perfil de GitHub) en el footer
- [ ] Añadir `LICENSE` (código) y declarar la licencia del contenido (`content/`)
- [ ] Si se añade analítica (ver más abajo): aviso de cookies / alternativa sin cookies

### Contenido
- [ ] Reducir los enlaces rotos: ~957 warnings por idioma (2871 en total) de `ConceptLink` / `PropiedadItem` hacia páginas inexistentes ("En construcción")
    - [ ] Escribir los conceptos más enlazados: `elementos-euclides` (51), `teorema` (48), `secante`, `continuidad`, `conjunto` (42), `medida-angular` (39), `axioma` (39), `distancia`, `consistencia-logica`, `congruencia-triangulos` (36), `coplanaridad` (33), `sistema-axiomatico` (30)
    - [ ] O dejar de enlazar lo que no vaya a existir a corto plazo
- [ ] Revisar y aprobar los 70 nodos "reescritos en espera de revisión" (`docs/progreso-reescritura.md`; hoy 50/120 aprobados)
- [ ] Confirmar que las correcciones matemáticas de `docs/reports/auditoria-2026-10-tareas.md` están aplicadas (Hilbert I.4, modelos Fano / tres puntos, "independencia de los cinco grupos", `plano` sin "curvatura", etc.)
- [ ] Revisión del euskera por una persona nativa (gramática y terminología)
- [ ] Alinear la home con el contenido real (dice "50 entradas" y hay 120 nodos; secciones MSC2020 casi vacías → marcarlas como "próximamente")
- [ ] Diagramas declarados en los teoremas: hoy 7 de 11
- [ ] Corrector ortográfico en CI (`cspell` con es / eu / en + vocabulario matemático)
- [ ] Pasar un corrector a las cadenas de `src/i18n/languages/*.ts`

## 🟠 Importantes

### UI / UX
- [ ] Texto de instrucción del diagrama cortado en escritorio: los botones de idioma / tema / búsqueda se superponen al panel del diagrama (p. ej. `/es/teorema/teorema-triangulo-isosceles`)
- [ ] Texto de instrucción del diagrama demasiado pequeño y con poco contraste (sobre todo en móvil)
- [ ] Grafo en móvil: la cabecera "MATEMATIKA" queda tapada por el botón de idioma y el grafo es ilegible a 390 px
- [ ] Revisar la home: las 4 tarjetas de colores saturados desentonan con el resto del estilo
- [ ] Error de consola `Manifest: Syntax error` en cada página (ruta del manifest con base `/Matematika/`)
- [ ] Auditoría real de accesibilidad (axe / Lighthouse, contraste, teclado) y de rendimiento; el checklist las da por "cumplidas" sin medición
- [ ] Probar la experiencia de diagramas JSXGraph en móvil
- [ ] Modo de impresión

### Técnico
- [ ] Corregir los tipos en `tests/` (~390 errores; no se comprueban porque no hay tsconfig que los cubra)
    - [x] `scripts/` (`tsconfig.scripts.json`, incluido en `typecheck`)
    - [ ] Crear `tsconfig.test.json` (`tests`, tipos `vitest/globals`) y añadirlo a `references` de `tsconfig.json`
    - [ ] Corregir los errores de los tests progresivamente
- [ ] Decidir qué hace el editor en producción (GitHub Pages sin backend): `EditorPage` pesa 4,5 MB en el bundle público; valorar excluirlo del build público
- [ ] Trocear los ficheros muy grandes: `useBoardLifecycle.ts` (1309 líneas), `MdxWorkbench.tsx` (1164), `DiagramWorkbench.tsx` (1096), `GroupsAndLayersManager.tsx` (1028), `MathFactory.ts` (1129)
- [ ] Eliminar los 38 warnings de ESLint (casi todos `no-explicit-any`, p. ej. `I18nContext.tsx`, `ExerciseContext.tsx`) y bajar el presupuesto de `editor:lint` (`--max-warnings=23`)
- [ ] Commitear / cerrar el trabajo en curso (18 ficheros modificados: i18n y UI del editor)
- [ ] Actualizar el README (cita `react-force-graph-2d`, pero se usa `@xyflow/react`)
- [ ] Versionado real (`package.json` sigue en `0.0.0`) y, si se aceptan colaboradores, `CONTRIBUTING.md`
- [ ] Separar la documentación de proceso (informes de auditoría, planes de agentes) de la documentación de usuario / colaborador

## 🟡 Funcionalidad y mejoras

### Grafo y enlaces
- [ ] Arreglar las dependencias de los axiomas en el DAG (las definiciones no pueden tener dependencias de ese tipo)
- [ ] Detectar enlaces sin resolver (se han inventado IDs y puede haberse usado el mismo ID para conceptos distintos)
- [ ] Permitir páginas en los enlaces de LaTeX
- [ ] Permitir referenciar elementos distintos en los enlaces de LaTeX

### Producto
- [ ] Estadísticas de visitas (monitorización); alta en Google Search Console (el sitemap ya se genera)
- [ ] Usuarios
- [ ] Marcos teóricos distintos

### Editor
- [ ] Bloques MDX y páginas distintas
- [ ] Permitir editar los `referenceId` en los diagramas
- [ ] Mejorar las URLs (p. ej. `/Matematika/eu/editor/axioma/axioma-congruencia-2`)
