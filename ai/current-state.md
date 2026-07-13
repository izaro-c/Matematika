# Estado actual de la infraestructura IA

**Actualizado:** 2026-07-14

**Fase:** Fase 7 — experiencia visual del editor MDX, en validación.

**Estado:** La experiencia visual de Fase 7 está implementada sobre la única fuente lossless de Fase 6: autoría visual y código coordinado, outline, inserción y reordenación, formularios y bloques por tipo, enlaces semánticos, diagramas y targets, validación integral, preview publicado y diff estructural. La fase permanece en validación hasta repetir el E2E real después del límite temporal del entorno de ejecución.

## Roadmap activo

La fuente canónica del estado es [`phases/editor-authoring/README.md`](phases/editor-authoring/README.md). Las Fases 0, 1, 2, 3, 4, 5 y 6 están cerradas. La [Fase 7 — Experiencia visual del editor MDX](phases/editor-authoring/phase-7-mdx-authoring-ux.md) está en validación.

## Experiencia visual de autoría MDX

- La vista visual y Monaco comparten el mismo source y pueden mostrarse coordinadas; no existe un segundo serializer ni una segunda vía de persistencia.
- El outline navega a cada bloque. La paleta contextual y `Ctrl/⌘ + /` insertan presets generales y perfiles para definiciones, teoremas, demostraciones, ejemplos, ejercicios, casos de uso, modelos y otros tipos.
- Los bloques se reordenan mediante controles y `Alt + ↑/↓`. Definiciones, notas, ejercicios y `ProofStep` disponen de editores estructurados; una demostración conserva un bloque por paso, justificación obligatoria, dependencia y target.
- La creación de páginas cubre todos los tipos expuestos por el formulario, genera metadatos válidos contra el schema autoritativo y persiste mediante el backend atómico ya existente.
- `ConceptLink` y `RefLink` se seleccionan desde el catálogo; los targets se seleccionan desde el registro publicado y se rechazan los destinos de diagrama inexistentes.
- El inspector carga diagramas guardados, su runtime real y sus targets. Texto, navegador y objetos del canvas comparten `MathStore`, por lo que el resaltado funciona en ambos sentidos y con foco de teclado.
- El informe de integridad detecta enlaces rotos, IDs de contenido o JSX duplicados, targets duplicados o ausentes y dependencias propias o cíclicas.
- El preview abre la ruta publicada en un `iframe`; si existen cambios pendientes declara que muestra el último guardado. Las operaciones multirregión y destructivas exigen un diff vigente.
- Los bloques desconocidos se muestran como source preservado de solo lectura visual y siguen editables en código.

## Motor MDX estructural y lossless

- `parseEditorDocument` conserva el source como autoridad y usa los rangos de remark-mdx/ESTree para proyectar imports, exports, contenedores, metadatos y bloques sin serializar de nuevo el documento.
- La proyección segura de `export const metadata` evalúa únicamente literales estáticos, conserva los rangos de cada propiedad y valida el objeto contra los schemas de contenido. Un export ausente o dinámico y un schema inválido se diagnostican sin habilitar escritura destructiva.
- El registro de bloques distingue bloques editables, regiones reconocidas preservadas y sintaxis realmente desconocida opaca. `DemonstrationSection` actúa como contenedor transparente y sus `ProofStep` mantienen rangos y operaciones propias.
- Inserción, sustitución, borrado, duplicación y movimiento producen planes de mutación con fingerprint, bytes esperados, rango afectado y preview antes/después. Las operaciones se rechazan si el documento cambió, atraviesan una región no editable, duplican un ID público o dejan el documento sin parsear.
- Las ediciones de metadatos reemplazan solo el valor o propiedad afectada, preservan imports, exports, comentarios, JSX y espacios, y vuelven a validar el schema y la inmutabilidad del ID antes de aceptar el parche.
- El editor exige aprobación de un diff vigente antes de guardar operaciones amplias o destructivas; los cambios fuera de los rangos declarados se rechazan.

## Corpus y compatibilidad MDX

- El corpus de aceptación incluye 12 documentos reales representativos con metadatos, imports, exports, comentarios, Markdown, matemáticas, tablas, demostraciones anidadas, JSX conocido y JSX desconocido.
- La auditoría completa cubre los 120 documentos: 120 metadatos legibles y válidos, 120 documentos totalmente editables, 0 parciales, 0 de solo lectura, 0 no soportados y 0 regiones opacas en el corpus actual.
- Los informes `editor-roundtrip-baseline` y `editor-lossless-compatibility` registran fingerprint, esquema, recuentos de bloques y compatibilidad por documento. El gate exige roundtrip byte a byte y un parche reversible localizado.
- La sintaxis reconocida pero sin editor visual específico permanece preservada en código. Solo un nodo no registrado se trata como opaco, y nunca se reescribe al editar otra región.

## Casos reales migrados

- **Pitágoras:** conserva `triangulo`, `cuadrado-a`, `cuadrado-b` y `cuadrado-c`; incluye tres cuadrados cuadriculados, áreas e identidad dinámicas, gliders sobre semirrectas positivas y tres pasos con resaltados.
- **Disco de Poincaré:** muestra la frontera completa, una geodésica principal, dos paralelas límite y cuatro ultraparalelas como arcos ortogonales; los extremos permanecen en la frontera y el punto interior se restringe al disco.
- **Congruencia ALA:** conserva `globalmente-congruentes`, `lado-ab`, `angulo-a` y `angulo-b`; incluye dos triángulos dependientes, seis ángulos, seis marcas de congruencia, dos cotas y textos reactivos.
- **Paralelogramo:** conserva `paralelogramo`, `lados-opuestos`, `angulos-opuestos` y `diagonales`; deriva `D` y el punto medio `M`, mantiene siete capas, tres pasos y clasificación reactiva de paralelogramo, rombo, rectángulo y cuadrado.

## Correcciones del modelo común

- Los grupos publican targets estables y trasladan su resaltado a todos sus miembros sin cambiar IDs públicos.
- La restricción `sameSide`, los estilos visuales persistibles y las reglas `visibleWhen`/`textRules` amplían el lenguaje común; no hay parches exclusivos de un caso.
- `MathBoard` observa un contenedor estable, distingue resize programático de pan/zoom y evita mutar el viewport al abrir. `DiagramRenderer` y `StepNavigator` reutilizan el `MathProvider` exterior o crean uno solo para previews aislados.
- Los textos JSXGraph se mantienen como HTML fuera de las capas SVG; áreas, cotas y paneles reactivos tienen dimensiones visibles reales. El disco preserva su relleno translúcido y los paneles de pasos no se superponen.

## Autoría visual de secuencias

- El editor incluye una línea temporal ordenada con creación, selección, duplicado profundo, borrado y movimiento de pasos.
- Cada paso conserva etiqueta, descripción y duración, además de visibilidad, énfasis primario o secundario, etiqueta temporal, interactividad y valor temporal de cada objeto.
- La matriz objetos × pasos resume el comportamiento completo con celdas accesibles; el inspector de celda expone los cambios sin exigir lectura del código fuente.
- Los overlays por objeto admiten título, contenido, posición, unidad, precisión y expresiones reactivas. Las expresiones usan la DSL matemática segura de la Fase 3 y muestran un fallback explícito si no se pueden evaluar.
- `StepNavigator` proporciona reinicio, anterior, reproducción, pausa y siguiente en el editor y en el runtime que lo solicite. Por decisión de producto, no se muestra en `DemonstrationSection`: las páginas de demostración conservan su lectura y scrollytelling por `ProofStep` sin una barra adicional.

## Estado temporal y stores

- `MathStore` mantiene de forma separada `step`/`step:<componentId>` y `highlight`/`highlight:<componentId>`. Cambiar de paso no borra el resaltado externo y el resaltado no muta el estado temporal.
- El renderer vuelve a calcular la escena desde el paso activo; al abandonarlo restituye etiquetas, valores, interactividad y overlays de la especificación base, sin residuos.
- `LessonStore` permanece reservado a ejercicios y simulaciones existentes. No se duplicó en él la semántica de demostración.
- La reproducción se modela mediante un reducer puro con selección, avance, pausa, tick y reinicio; al llegar al final se detiene.

## Targets estables y varios diagramas

- Cada objeto puede publicar un `targetId` estable distinto de su ID interno. Renombrar el objeto interno conserva el target público.
- El registro compartido agrupa targets por `componentId`; la forma cualificada `componentId:targetId` resuelve ambigüedades cuando una página contiene varios diagramas.
- Los targets no cualificados siguen funcionando cuando son únicos. Si se repiten entre diagramas se informa la ambigüedad; los duplicados dentro de un mismo diagrama son error.
- El selector visual permite publicar, renombrar y copiar targets de objetos y pasos. La validación de página revisa `ConceptLink`, elementos interactivos y `ProofStep`, e informa referencias inexistentes o ambiguas.
- `VisualBind` opera con ratón, foco, Enter y Espacio, conserva roles y nombres accesibles, y solo modifica el resaltado externo.

## Demostraciones y Lean

- `ProofStep` acepta uno o varios targets y mantiene atributos estables para el scrollytelling y las justificaciones pedagógicas.
- El parser/editor conserva `leanBlocks` y expresiones de `stepTacticMap`. Cuando existen, se muestran como traza de solo lectura junto al paso.
- La interfaz declara que la traza Lean complementa la comprobación mecánica y no sustituye la justificación Greenberg/Hilbert.
- La página publicada de demostración no incorpora `StepNavigator`; la sincronización texto-diagrama existente sigue gobernada por el scroll y `MathStore`.

## Evidencia de aceptación

- Las suites nuevas de Fase 7 aprueban 12/12 casos de motor estructural, creación por tipo, metadatos, outline responsive, paleta, teclado, bloques preservados, enlaces y targets. La regresión del renderer añade interacción objeto → referencia MDX.
- `editor:test:integration` aprueba 79/79; TypeScript, `editor:lint` con 119/119 advertencias permitidas, `git diff --check` y el build directo de Vite aprueban.
- El E2E real declara 17 flujos e incluye creación de una definición compleja, diagrama exacto, conexión, diff, guardado, reapertura, comparación byte a byte, preview y responsive. La primera ejecución dejó 13 flujos verdes y señaló cuatro expectativas de diff anteriores; se corrigieron. La repetición quedó impedida por el límite temporal del entorno, no por un fallo observado del código.
- `editor:test:unit` aprueba 167/169; las dos regresiones restantes son las históricas de Fase 5 en el fingerprint de Poincaré y la proyección del glider de Pitágoras.

- `phase6LosslessEngine.test.ts` cubre roundtrip exacto, lectura y parche de metadatos, imports y exports contiguos, comentarios, bloques anidados, JSX desconocido, CRUD, reordenación, diff previo y recuperación ante parseo, metadata dinámica o schema inválido.
- Las suites dirigidas del documento, núcleo y diff aprueban 56/56 pruebas; `editor:test:integration` aprueba 79/79. `editor:roundtrip:check` y `editor:lossless:check` aprueban los 120 documentos.
- `editor:lint` aprueba con 114 advertencias dentro del presupuesto de 119 y 0 errores; TypeScript y el build de producción aprueban. Dependency Cruiser informa 0 errores y 56 advertencias históricas; el gate de seguridad no detecta patrones inseguros.
- Referencias, DAG de 120 nodos, Lean, cobertura de contenido y auditoría bridge aprueban. Lean compila 12 trabajos, conserva 66 nodos verificados y 9 bloques; la cobertura es 24/24 páginas y 25/25 demostraciones.
- `full-check` alcanzó lint y TypeScript y ejecutó 656 pruebas: 650 aprobaron. Las seis regresiones restantes pertenecen a cambios de diagramas de Fase 5 ya presentes en el árbol (`ModeloPoincare` y la restricción del glider de `Pitagoras`); no afectan al motor MDX y se conservaron sin modificación.

- `Phase5AcceptanceMigrations.test.ts` fija snapshots estructurales de los cuatro diagramas, roundtrip byte a byte, targets MDX reales, restricciones, geodésicas ortogonales, dependencias, capas, pasos y clasificación.
- Las regresiones del renderer montan el componente y el editor de pasos reales de Pitágoras sin `MathProvider` exterior; `MathBoardViewport.test.tsx` separa cambios de usuario y ajustes programáticos.
- `npm run test:e2e:phase5` abre las cuatro rutas publicadas en Chromium, exige boards no colapsados, escenas completas, textos reactivos visibles y ausencia de errores; después recorre catálogo → Pitágoras → edición visual exacta y comprueba estado sincronizado.
- La inspección visual real se realizó a 1440 × 900 y la del editor a 1600 × 1100. Poincaré, paralelogramo, ALA y Pitágoras muestran el diagrama completo; el editor de Pitágoras conserva `[-8, 8, 8, -8]` al abrir.
- Tres suites nuevas cubren CRUD y reordenación, separación paso/resaltado, targets estables, referencias ausentes o duplicadas, overlays reactivos, reproducción, accesibilidad, múltiples diagramas y trazas Lean.
- La prueba de persistencia construye una secuencia compleja con estados y overlays, genera TSX, lo vuelve a abrir con el parser y exige regeneración byte a byte idéntica.
- La regresión de demostraciones comprueba que `ProofStep` sigue presente y que no existe una navegación `StepNavigator` en la página.
- `editor:full-check`, ejecutado con índice Git temporal aislado: artefactos deterministas actualizados, roundtrip lossless 120/120, lint dirigido, 157 pruebas unitarias, 79 de integración, arquitectura, seguridad, TypeScript y build aprobados.
- `editor:lint`: 119 advertencias dentro del presupuesto máximo de 119 y 0 errores.
- Dependency Cruiser: 56 advertencias históricas, 0 errores, 360 módulos y 1027 dependencias.
- `full-check`: lint sin errores, TypeScript, 67 archivos y 649 pruebas, arquitectura, referencias, grafo, Lean, cobertura y bridge aprobados.
- Lean compila 12 trabajos; el grafo conserva 66 nodos verificados y 9 bloques, y la cobertura Lean-MDX permanece en 24/24 páginas y 25/25 demostraciones.

## Límites y deuda explícita

- La Fase 7 no se cierra hasta repetir en Chromium el flujo E2E corregido y ejecutar los gates basados en `tsx`; el sandbox negó el socket IPC y el segundo permiso no pudo concederse por el límite de uso del entorno.
- Los helpers antiguos de presentación inline permanecen por compatibilidad, pero no intervienen en la proyección, mutación ni persistencia estructural del documento.
- El `full-check` global no queda verde mientras las dos regresiones preexistentes de los casos de aceptación de Fase 5 sigan en el árbol; deben resolverse en su alcance propio sin relajar las garantías lossless.

- No se realizó una migración masiva de los 85 diagramas; solo los cuatro casos de aceptación cuentan con evidencia de fidelidad y edición visual exacta en esta fase.
- Las extensiones temporales de `DiagramSpec v2` son opcionales y no cambian su versión literal ni normalizan escenas anteriores de forma destructiva.
- Los targets no cualificados duplicados entre diagramas se mantienen como broadcast compatible en runtime, pero el editor exige la forma cualificada para una conexión inequívoca.
- El presupuesto dirigido de lint queda agotado en 119 advertencias. El build conserva avisos históricos de chunks superiores a 500 kB y del `eval` interno de JessieCode/JSXGraph; la DSL de overlays no usa esas vías.
- La skill `diagrama` conserva rutas y patrones anteriores al renderer compartido. Su actualización requiere propuesta y aprobación separadas; no se modificó durante esta fase.

## Veredicto

`FASE 7 EN VALIDACIÓN — EXPERIENCIA VISUAL IMPLEMENTADA SOBRE EL MOTOR LOSSLESS; CIERRE PENDIENTE DE REPETIR E2E Y GATES TSX`
