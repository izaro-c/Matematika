# Plan hacia el MVP (nov. 2026)

Cada paso cabe en **una sesión** de agente y se puede empezar en un chat nuevo leyendo solo este fichero y la sección del paso. Al terminar, la sesión marca el paso en la tabla de estado, anota en «Notas» lo que el siguiente necesite saber y hace un commit propio.

## Qué es el MVP

**Geometría de Hilbert, de los axiomas a los primeros teoremas, en castellano, euskera e inglés**, publicada en `https://izaro-c.github.io/Matematika/` con:

- todas las demostraciones del núcleo correctas respecto al DAG (sin pasos que no se deduzcan de un nodo);
- ninguna dependencia (`isDependency`) hacia un nodo inexistente;
- enlaces en el texto solo hacia nodos que existen o que están en el plan; el resto, texto plano;
- aviso legal, privacidad, contacto y licencias;
- CI en verde y el despliegue condicionado a él;
- la home y las ramas sin promesas vacías.

Fuera del MVP: rama hiperbólica, usuarios, otros marcos teóricos, el editor como producto público, ramas de álgebra y análisis más allá de lo que la geometría necesite.

## Situación de partida (2026-11-22)

| Indicador | Valor |
|---|---|
| Nodos | 190 por idioma (es/en/eu): 22 axiomas, 88 definiciones, 21 teoremas, 22 demostraciones, 21 matemáticos, 4 sistemas, 4 modelos |
| Ramas | 51M: 79 · 51A: 44 · 01A: 21 · 03*: 25 · 26A: 8 · 08A: 4 · 11A: 3 · 12: 2 · 20: 1 · 54E: 1 |
| Enlaces rotos | 1122 en es (3366 en total) hacia **570 IDs inexistentes** |
| `isDependency` hacia IDs inexistentes | 23: `altura` `angulos-adyacentes` `axioma-separacion` `clase-equivalencia` `conjunto-cociente` `conjunto-convexo` `conjunto-vacio` `cota-inferior` `cota-superior` `cuerpo-ordenado` `distributividad` `dominio-funcion` `familia-indexada` `grupo-abeliano` `intervalo` `inyectividad` `orden-total` `producto-cartesiano` `punto-acumulacion` `relacion` `relacion-binaria` `sobreyectividad` `sucesion-cauchy` |
| Aprobados por la autora | 50 / 190 (`docs/progreso-reescritura.md`); revisión diaria 41 / 190 |
| CI | Rojo desde el 2026-10-29: falla `tests/components/BranchPage.test.tsx` («una rama sin entradas…»). El despliegue no espera al CI. |
| Editor | `EditorPage` (5,9 MB) se publica y se abre en `/:lang/editor` |
| Legal | Sin aviso legal, privacidad, contacto ni `LICENSE` |

Enlaces rotos más frecuentes (es): `elementos-euclides` 30, `medida-angular` 16, `relacion-binaria` 13, `poligono` 13, `clase-equivalencia` 12, `particion` 11, `orden-total` 11, `orden` 11, `conjunto-convexo` 11, `recta-soporte` 9, `klein` 9, `adicion` 9.

Para regenerar las cifras: `npx tsx scripts/core/validate-cross-references.ts > /tmp/refs.txt; grep -c WARN /tmp/refs.txt`.

## Estado

| Paso | Título | Depende de | Quién | Estado |
|---|---|---|---|---|
| 0 | Decisiones de la autora | — | Autora | ☐ |
| 1 | CI en verde y despliegue condicionado | — | Agente | ☑ 2026-11-22 |
| 2 | Editor fuera del build público | 0 | Agente | ☐ |
| 3 | Legal, contacto y licencias | 0 | Agente | ☐ |
| 4 | Clasificar los 570 IDs que faltan | 0 | Agente → Autora aprueba | ☐ |
| 5 | Podar enlaces | 4 | Agente | ☐ |
| 6 | Nodos: relaciones y orden | 4 | Agente (contenido) | ☐ |
| 7 | Nodos: conjuntos y funciones | 4 | Agente (contenido) | ☐ |
| 8 | Nodos: geometría básica | 4 | Agente (contenido) | ☐ |
| 9 | Partir I.27 / I.29 | — | Agente (contenido) | ☐ |
| 10 | Reescribir `demo-angulo-exterior` | 9 | Agente (contenido + diagrama) | ☐ |
| 11 | Reescribir `demo-existencia-bisectriz` | — | Agente (contenido + diagrama) | ☐ |
| 12 | Completar `demo-congruencia-lll` | 8 | Agente (contenido + diagrama) | ☐ |
| 13 | Home y ramas alineadas con el MVP | 0, 5 | Agente | ☐ |
| 14 | Bloqueantes de UI | — | Agente | ☐ |
| 15 | Auditoría de accesibilidad y rendimiento | 13, 14 | Agente | ☐ |
| 16 | Lanzamiento | todos | Agente + Autora | ☐ |
| — | Aprobación del núcleo y revisión del euskera | 6–12 | Autora / revisor nativo | En paralelo |

Orden recomendado: 0 → 1 → 2 → 3 → 4 → 5 → (6, 7, 8, 9, 11, 14 en cualquier orden) → 10 → 12 → 13 → 15 → 16. Los pasos 1 y 9–11 no necesitan las decisiones del paso 0 y pueden empezar ya.

## Reglas para todas las sesiones

- Leer `AGENTS.md`. Los pasos de contenido cargan antes la skill `matematika-content-generator` (y `matematika-diagram-generator` si tocan diagramas).
- Contenido: escribir `es` primero y luego `en` y `eu` con los mismos `targetId`, `isDependency`, componentes y fórmulas. Terminado significa que `node .agents/skills/matematika-content-generator/scripts/validate-nodes.mjs <ids>` imprime `══ TODO OK`. Después, pasar el agente `content-reviewer` sobre los IDs tocados y corregir lo que señale.
- Código: `npm run typecheck`, `npm run test:fast` y el test concreto. Nada de `npm run dev` ni de la suite completa salvo en los pasos 1, 15 y 16.
- No ampliar el alcance: si aparece algo fuera del paso, se anota en «Notas» de este fichero y no se hace.
- Un commit por paso, con el mensaje `mvp(N): <título>`.

---

## Paso 0 · Decisiones de la autora

No es una sesión de agente. Responder aquí debajo, porque los pasos 2, 3, 4 y 13 leen estas respuestas.

1. **Titular** que figura en el aviso legal: nombre o seudónimo; y si se publica email, el NIF o solo el perfil de GitHub.
2. **Contacto**: email, issues de GitHub o ambos.
3. **Licencias**: código (propuesta: MIT) y contenido de `content/` (propuesta: CC BY-SA 4.0).
4. **Editor en producción**: ¿se quita del build público o se mantiene detrás de una opción? El workflow de despliegue pasa `VITE_EDITOR_API_URL`, así que puede que haya un backend en uso. Propuesta: quitarlo y usarlo solo en local.
5. **Ramas fuera de la geometría**: análisis (26A: 8 nodos), números (11A, 12), álgebra (08A, 20), topología (54E). Opciones: (a) se quedan publicadas pero no se amplían ni se enlazan sus huecos; (b) se ocultan de la home hasta después del MVP. Propuesta: (a).
6. **Analítica**: ninguna, o una sin cookies (Cloudflare Web Analytics o GoatCounter).

Respuestas:
1. Izaro (y si se necesita nombre completo, Izaro Cuerdo Larraza).
2. correo matematikaentziklopedia@gmail.com
3. No tengo ninguna licencia
4. El editor se quita del build público por ahora
5. a
6. Sin cookies

- …

---

## Paso 1 · CI en verde y despliegue condicionado

**Objetivo.** `main` en verde y que no se despliegue nada que no pase el CI.

**Hacer**
1. Arreglar `tests/components/BranchPage.test.tsx` › «una rama sin entradas lo dice y remite a su rama madre». El test pinta la rama `15` y busca «Aún no hay entradas en esta rama.» (`branch.noEntries`, `src/content-pages/screens/BranchPage.tsx:139`). Averiguar si cambió el componente (texto partido o rama ya no vacía) o el test, y corregir el que esté mal. No relajar el test sin entender el cambio.
2. Encadenar el despliegue al CI. Propuesta: en `.github/workflows/deploy.yml`, sustituir `on: push` por `workflow_run` del workflow «CI Pipeline (Quality Gates)» con `conclusion == 'success'` en `main`, manteniendo `workflow_dispatch`. Alternativa: un único workflow con `needs: full-check`.
3. Commitear los ficheros pendientes de `docs/reports/revision-diaria/` si siguen sin commitear (preguntar antes), y hacer `git push`.

**Hecho cuando** `npm run test:fast` pasa en local, `gh run list` muestra el CI en verde en `main` y el despliegue se lanza después del CI.

---

## Paso 2 · Editor fuera del build público

**Requiere** la decisión 0.4. Si la autora decide mantenerlo, este paso se limita a confirmar que no se indexa y se cierra.

**Objetivo.** Que el bundle público no incluya `EditorPage` ni Monaco, y que `/:lang/editor` dé la página de «no encontrado».

**Hacer**
1. En `src/app/routes/AppRouter.tsx` (≈ línea 29 y rutas de las líneas 346–356), registrar las rutas del editor solo si `import.meta.env.DEV || import.meta.env.VITE_ENABLE_EDITOR === 'true'`. El `lazy(import(...))` tiene que quedar dentro de la rama condicional para que Rollup elimine el chunk.
2. Comprobar que `scripts/core/prerender.ts` y `scripts/core/generate-sitemap-and-robots.ts` no visitan ni listan rutas del editor.
3. Quitar `VITE_EDITOR_API_URL` de `deploy.yml` si ya no se usa.

**Hecho cuando** tras `npm run build`, `ls dist/assets | grep -iE 'editor|monaco'` no devuelve nada, `npm run dev` sigue abriendo el editor y `npm run editor:test:unit` pasa.

---

## Paso 3 · Legal, contacto y licencias

**Requiere** las decisiones 0.1–0.3 y 0.6.

**Objetivo.** Cumplir los ítems ❌ de `docs/checklist-pre-despliegue.md` §1.2, §1.3, §3.3.

**Hacer**
1. Una página estática con dos secciones (aviso legal y privacidad) en es/eu/en. Rutas propuestas: `/es/aviso-legal`, `/eu/lege-oharra`, `/en/legal-notice`. Si no hay analítica con cookies, la política de cookies es un párrafo que dice que solo se usa `localStorage` para preferencias (tema, idioma, marcapáginas). Textos por i18n o MDX, lo que use ya el resto de páginas fijas.
2. Enlaces en `src/fixed-pages/home/components/HomeFooter.tsx` y en el pie común de las páginas de contenido, si existe: aviso legal, contacto y licencia.
3. `LICENSE` en la raíz (código) y `content/LICENSE` (contenido). Mencionarlos en el README.
4. Añadir las rutas al sitemap y al prerender.
5. Actualizar la tabla de `docs/checklist-pre-despliegue.md`.
6. Revisar el euskera según la memoria `basque-i18n-care`.

**Hecho cuando** las tres rutas se prerenderizan, el pie enlaza a ellas en los tres idiomas y hay un test de render de la página.

---

## Paso 4 · Clasificar los 570 IDs que faltan

**Requiere** la decisión 0.5.

**Objetivo.** Una tabla con una decisión para cada ID enlazado que no existe. Los pasos 5–8 la ejecutan.

**Hacer**
1. Script en `scripts/content/` (o ampliar `validate-cross-references.ts` con `--report`) que saque un TSV `docs/reports/mvp-enlaces.tsv` con `id`, `enlaces_es`, `es_dependencia` (sí/no), `ficheros_que_enlazan` y `propuesta`.
2. Propuesta por ID:
   - `escribir`: dependencia de un nodo del MVP, o concepto de geometría hilbertiana o de conjuntos que el núcleo usa. Indicar el paso (6, 7 u 8).
   - `renombrar`: ID no canónico de un nodo que existe o que se va a escribir (p. ej. `altura` → `altura-triangulo`; buscar sinónimos con nombres parecidos).
   - `desenlazar`: todo lo demás (otras ramas, matemáticos sin biografía, geometría proyectiva, Klein, Poincaré, GPS…).
3. Las 23 dependencias rotas de la tabla de situación no pueden quedar en `desenlazar`: o se escriben, o se renombran, o se rehace el razonamiento del nodo que depende de ellas (anotarlo).
4. Repartir los `escribir` entre los pasos 6, 7 y 8 con un máximo de **8 nodos por paso**. Si salen más, añadir pasos 8b, 8c… a la tabla de estado.

**Hecho cuando** el TSV existe y la autora lo ha aprobado (marcar aquí la fecha). La sesión termina presentando el resumen: cuántos `escribir`, `renombrar` y `desenlazar`, y la lista completa de `escribir`.

---

## Paso 5 · Podar enlaces

**Requiere** el TSV aprobado del paso 4.

**Objetivo.** Aplicar `renombrar` y `desenlazar` en los tres idiomas.

**Hacer**
1. Script (no a mano) que, para cada `desenlazar`, sustituya `<ConceptLink targetId="X">texto</ConceptLink>` por `texto` en `content/mdx/{es,en,eu}`, y para cada `renombrar` cambie el `targetId`. Los `PropiedadItem` hacia IDs desenlazados se quitan o se dejan sin enlace según cómo esté hecho el componente.
2. No tocar los `escribir`: siguen rotos hasta su paso.
3. `npm run content:lint` y `npm run validate-references`.
4. Revisar a mano una muestra de 10 ficheros por idioma: que no queden espacios dobles ni mayúsculas raras.

**Hecho cuando** los WARN de `validate-references` solo apuntan a IDs `escribir` y `content:lint` no da errores nuevos.

---

## Pasos 6, 7 y 8 · Nodos que faltan

Una sesión por paso, con los IDs que el paso 4 les asignó (máx. 8). Orientación de partida, a confirmar con el TSV:

- **6. Relaciones y orden**: `relacion`, `relacion-binaria`, `clase-equivalencia`, `conjunto-cociente`, `particion`, `orden`, `orden-total`, `cota-superior`/`cota-inferior`.
- **7. Conjuntos y funciones**: `conjunto-vacio`, `producto-cartesiano`, `familia-indexada`, `dominio-funcion`, `inyectividad`, `sobreyectividad`, `composicion-funciones`, `intervalo`.
- **8. Geometría básica**: `medida-angular`, `angulos-adyacentes`, `conjunto-convexo`, `altura-triangulo`, `poligono`, `recta-soporte`, `diagonal`, `elementos-euclides` (es una obra: decidir el tipo de nodo con la skill antes de escribirlo).

**Hacer en cada uno**
1. Cargar la skill `matematika-content-generator`. Escribir en orden del DAG: primero los nodos que otros del lote usan.
2. es → en → eu. Cada nodo enlaza a todos los conceptos que usa; si alguno no existe y no está en el TSV como `escribir`, va como texto plano.
3. Diagramas solo si la skill dice que el nodo los necesita; si hace falta uno grande, anotarlo en «Notas» y no hacerlo en este paso.
4. Añadir los nodos nuevos a `docs/progreso-reescritura.md` como «en espera de revisión».

**Hecho cuando** `validate-nodes.mjs <ids>` da `══ TODO OK`, el `content-reviewer` no deja nada sin resolver y los WARN de `validate-references` hacia esos IDs han desaparecido.

---

## Paso 9 · Partir I.27 / I.29

**Objetivo.** Que la parte absoluta del teorema no dependa del axioma de las paralelas.

**Hacer**
1. Partir `teorema-angulos-alternos-internos` en dos nodos:
   - I.27, absoluto: ángulos alternos internos congruentes ⇒ rectas paralelas. Sin Playfair.
   - I.29, euclídeo: rectas paralelas ⇒ ángulos alternos internos congruentes. Depende de Playfair.
   
   Decidir los IDs con la skill; conservar el ID actual en el que tenga más enlaces entrantes, o redirigir.
2. Separar también las demostraciones y los `<VisualBind>` / diagramas asociados.
3. Actualizar los nodos que lo enlazan para que apunten al que de verdad usan.
4. Comprobar en `/axiomas` que al desactivar el grupo IV la parte de I.27 sigue encendida.

**Hecho cuando** `validate-nodes` da OK en los nodos tocados, `npm run validate-graph` pasa y la comprobación de `/axiomas` está hecha con captura.

---

## Paso 10 · Reescribir `demo-angulo-exterior`

**Requiere** el paso 9.

**Problema** (auditoría del 2026-10-22): usa `punto-medio`, que no tiene nodo y cuya existencia es un teorema, y justifica una congruencia con la *definición* `angulos-opuestos-vertice` en vez de con `teorema-angulos-opuestos-verticales`.

**Hacer.** Reescribirla a partir de I.27 (paso 9) y del teorema de la travesaña, sin punto medio. Rehacer los pasos del diagrama (`content/diagrams/Demos/`) para que sigan la nueva prueba, respetando las memorias de diagramas (`diagram-handles-where-grabbed`, `diagram-no-limbo-states`). Los tests de `tests/diagrams/DemoAnguloExternoRayStability.full.test.tsx` deben seguir pasando o adaptarse.

**Hecho cuando** `validate-nodes` da OK, el test del diagrama pasa y cada paso de la prueba cita un nodo existente.

---

## Paso 11 · Reescribir `demo-existencia-bisectriz`

**Problema**: construye el triángulo equilátero de Euclides I.1, que exige cortar dos circunferencias y no se deduce de ningún nodo. Además, da por supuesto que $C$ está en el interior del ángulo.

**Hacer.** Nueva prueba: tomar $OA \cong OB$ y $OA' \cong OB'$ en los lados, obtener el punto de corte de $AB'$ y $A'B$ por Pasch (o el teorema de la travesaña) y concluir con LAL. Justificar que el punto está en el interior. Rehacer el diagrama `DemoExistenciaBisectriz` con los pasos nuevos.

**Hecho cuando** `validate-nodes` da OK, el diagrama compila y pasa sus tests, y ningún paso usa circunferencias.

---

## Paso 12 · Completar `demo-congruencia-lll`

**Requiere** el paso 8 (`angulos-adyacentes`).

**Problema**: solo trata el caso en que $C'C^*$ corta $\overline{A'B'}$ por dentro. Faltan los casos en que pasa por un vértice o por fuera (ángulo obtuso), y la suma de ángulos congruentes no tiene nodo.

**Hacer.** Añadir los casos que faltan. Si la suma de ángulos congruentes hace falta, escribirla como lema propio. Añadir pasos o un selector de caso al diagrama; según `diagram-no-limbo-states`, un cambio discreto de caso va con un botón, no con un arrastre.

**Hecho cuando** `validate-nodes` da OK en la demo y en el lema y el diagrama muestra los tres casos.

---

## Paso 13 · Home y ramas alineadas con el MVP

**Requiere** la decisión 0.5 y el paso 5.

**Hacer**
1. Recuentos y textos de la home que sigan el contenido real (sin cifras fijas en i18n).
2. Ramas y secciones MSC vacías: «En preparación», sin enlace a páginas vacías (ya existe el estilo de tomos vacíos; comprobar que se aplica en todas).
3. Según 0.5, ocultar o dejar las ramas no geométricas.
4. En `/axiomas` y donde se ofrezca la geometría hiperbólica: si no hay ningún nodo solo hiperbólico, que no se presente como rama con contenido.

**Hecho cuando** ninguna navegación desde la home acaba en una página vacía. Comprobarlo con capturas en es/eu/en a 390 px y 1366 px.

---

## Paso 14 · Bloqueantes de UI

Los que quedan del TODO; verificar cada uno antes de tocarlo, porque varios pueden estar resueltos por la cabecera de marcapáginas (`docs/reports/plan-ui-2026-10.md`).

1. Error de consola `Manifest: Syntax error` (ruta del manifest con base `/Matematika/`).
2. Texto de instrucción del diagrama cortado o tapado en escritorio (p. ej. `/es/teorema/teorema-triangulo-isosceles`).
3. Texto de instrucción del diagrama pequeño y con poco contraste en móvil.
4. Grafo ilegible a 390 px.
5. Diagramas JSXGraph en móvil: probar arrastre y pasos en 3 diagramas de demostración.

**Hecho cuando** cada punto está resuelto o marcado como «ya resuelto» con captura, y `npm run test:fast` pasa.

---

## Paso 15 · Auditoría de accesibilidad y rendimiento

**Hacer.** Lighthouse (móvil y escritorio) y axe sobre home, una rama, una definición, un teorema con diagrama, `/grafo` y `/axiomas`, en el build de producción (`npm run build && npm run preview`). Corregir lo que sea error de axe o contraste; anotar en «Notas» lo que sea mejora. Actualizar §4 y §7 de `docs/checklist-pre-despliegue.md` con las cifras medidas.

**Hecho cuando** axe no da errores en las 6 páginas y Lighthouse da ≥ 90 en accesibilidad.

---

## Paso 16 · Lanzamiento

**Hacer**
1. Recorrido como usuario nuevo en modo incógnito, en los tres idiomas: home → rama → definición → teorema → demostración con diagrama → grafo.
2. README al día (stack real, licencias, cómo contribuir) y `package.json` a `1.0.0`. Tag `v1.0.0`.
3. Alta en Google Search Console y envío del sitemap (lo hace la autora; el agente prepara el fichero de verificación o la meta).
4. Analítica según 0.6.
5. Cerrar este plan: tabla de estado completa y lo pendiente pasado a `docs/TODO.md`.

---

## En paralelo: aprobación y euskera

No son sesiones de agente.

- **Núcleo a aprobar antes del lanzamiento**: los axiomas I–IV, las definiciones que usan, los 21 teoremas y sus demostraciones, y los nodos nuevos de los pasos 6–12. La revisión diaria (`docs/reports/revision-diaria/COLA.md`) puede reordenarse para poner estos primero. También hay 35 propuestas pendientes en `PROPUESTAS.md`.
- **Revisión del euskera por una persona nativa** del mismo núcleo, empezando por las cadenas de `src/i18n/languages/eu.ts` que se ven en todas las páginas.

## Notas

(Las sesiones añaden aquí lo que el siguiente paso necesite saber.)

- **Paso 1 (2026-11-22).** El componente estaba bien: el test usaba la rama `15`, que dejó de estar vacía cuando `dimension` pasó a `15A` (ce326b16, 28-oct). Ahora usa `geometria-algebraica` (→ 14), hija directa de «Álgebra y Teoría de Números» y fuera del MVP; si algún día recibe entradas, el test volverá a fallar por el mismo motivo. `deploy.yml` se lanza por `workflow_run` del CI (solo `push` a `main` con `success`) o a mano, y hace checkout del `head_sha` que pasó el CI. Del CI solo fallaba «Full Check»; `npm run full-check` pasa en local (35 avisos de lint, 0 errores).
