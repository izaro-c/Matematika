# Equivalencias del Proyecto Matematika para la Defensa

> **Propósito**: justificar la validez del proyecto frente a la plantilla de Ingegneria del Software (Template_IS_2026) y los apuntes de la asignatura (main.pdf), a pesar de no estar implementado en Java.
> Toda decisión arquitectónica tiene su equivalente directo en los conceptos del curso.

---

## Tabla General de Equivalencias Tecnológicas

| Concepto del Curso (Java) | Implementación en Matematika | Justificación |
|---|---|---|
| **Lenguaje principal** | TypeScript (superset tipado de JavaScript) | TypeScript ofrece tipado estático, clases, interfaces, genéricos y modificadores de acceso — el mismo poder expresivo que Java, compilado a JavaScript para ejecución en navegador |
| **JVM / bytecode** | Vite + motor V8 del navegador | No hay «máquina virtual Java» porque la aplicación es una SPA web; el «runtime» es el navegador. Vite es el build tool equivalente a Maven/Gradle |
| **Maven / Gradle** | npm + `package.json` + `vite.config.ts` | Gestión de dependencias (npm), scripts de build (vite build), ejecución de tests (vitest) |
| **Spring Boot / Jakarta EE** | React 19 + Vite | React es el framework UI; Vite es el servidor de desarrollo y empaquetador. No hay backend — es una SPA pura con datos estáticos |
| **JPA / Hibernate** | Zod + `ContentStore` (DAO en memoria) | Zod valida schemas de datos en runtime (equivalente a Bean Validation). ContentStore carga MDX/JSON como «base de datos en memoria» (equivalente a un Repository JPA sin SQL) |
| **Servlets / Controllers** | Zustand stores (`GraphSandboxStore`, `GraphStore`, etc.) | Zustand es un gestor de estado global con patrón flux — equivalente funcional a los @Controller de Spring que orquestan la lógica de negocio |
| **JSP / Thymeleaf** | React componentes (`AxiomSandboxPanel`, `AxiomaticTree`) | React es la capa de presentación. Los componentes son el equivalente a las vistas JSP, pero con reactividad en tiempo real |
| **JDBC / SQL** | `graph_structure.json` + `contentIndex.json` | No hay base de datos relacional. Los datos se almacenan como archivos JSON precomputados (el grafo) y archivos MDX (el contenido). El «DAO» lee de estos archivos |
| **JUnit** | Vitest | Framework de testing para JavaScript/TypeScript con API compatible con Jest. Misma semántica: `describe`, `it`, `expect` |
| **PlantUML** | PlantUML (mismos archivos `.puml`) | Los diagramas UML del proyecto se generan con la misma herramienta que en Java |

---

## 1. Specifiche Informali → Especificaciones del Proyecto

**Qué pide la plantilla**: transcribir el enunciado del proyecto tal cual fue asignado.

**Equivalencia en Matematika**: el §1 del documento describe Matematika como una SPA para explorar conocimiento matemático representado como un DAG. El enunciado es autocontenido (no depende del lenguaje de implementación). La descripción de actores (Studente, Autore) y funcionalidades (7 bullet points) es independiente de Java.

---

## 2. Analisi e Specifica dei Requisiti

### 2.1 Analisi nomi-verbi

**Qué pide**: colorear clases (cian), atributos (verde), funcionalidades (amarillo), actores (rojo).

**Equivalencia**: la técnica de análisis léxico es independiente del lenguaje. Las clases identificadas (Grafo, Nodo, Assioma, Teorema, Prova, Modello, Glossario) se implementan como:
- Clases Java → **clases TypeScript** (`Grafo.ts`, `Nodo.ts`)
- Atributos → **interfaces tipadas** (`GraphNodeMeta`, `ContentIndexEntry`)
- Funcionalidades → **stores Zustand** (`GraphSandboxStore.toggleAxiom()`)

### 2.2 Revisione dei requisiti

**Qué pide**: reescribir cada requisito en forma «Il sistema deve...».

**Equivalencia**: 18 requisitos numerados, todos verificables e independientes del stack. Por ejemplo, RF06 «Il sistema deve ricalcolare la validità topologica del grafo» se implementa en `Grafo.evaluate()`.

### 2.3 Glossario dei termini

**Qué pide**: tabla término/descripción/sinónimos.

**Equivalencia**: 15 términos definidos (Grafo, Nodo, Assioma, Teorema, Sandbox...). La implementación refleja exactamente estos términos:
- `Grafo.ts` → clase que encapsula el DAG
- `Nodo.ts` → value object con `isSatisfiedBy()`
- `GraphSandboxStore` → modo Sandbox

### 2.4 Classificazione dei requisiti

**Qué pide**: clasificar en funcionales (RF), datos (RD), calidad (RQ-QUAL), restricciones (V).

**Equivalencia**: 15 RF, 3 RD, 5 RQ-QUAL, 2 V. La trazabilidad requisito→código se mantiene:
- RF06 → `Grafo.evaluate()`
- RD01 → `graph_structure.json`
- RQ-QUAL-01 (rendimiento < 500ms) → `graph.worker.ts` (Web Worker para no bloquear UI)
- V01 (TypeScript) → `tsconfig.json`

### 2.5 Modellazione dei casi d'uso

**Qué pide**: diagrama UML de casos de uso + escenarios detallados.

**Equivalencia**: 9 casos de uso y 3 inclusiones. El caso de uso seleccionado para desarrollo completo es **UC6: ValutaGrafoAttivo**. Su implementación recorre exactamente la arquitectura BCED:
- Boundary → `AxiomSandboxPanel.tsx` (React)
- Controller → `GraphSandboxStore.ts` (Zustand)
- Entity → `Grafo.ts`, `Nodo.ts`
- Database → `ContentStore.ts`, `graph_structure.json`

### 2.6 Diagramma delle classi (analisi)

**Qué pide**: diagrama de clases de análisis (Domain Model).

**Equivalencia**: el Domain Model identifica 5 clases principales (SistemaMatematika, Grafo, Glossario, Modello, Nodo) con responsabilidades justificadas mediante patrones GRASP:
| Clase Análisis | Implementación | Patrón GRASP |
|---|---|---|
| SistemaMatematika | `App.tsx` + stores Zustand | **Controller** (orquesta el sistema) |
| Grafo | `Grafo.ts` | **Information Expert** (conoce la topología) |
| Glossario | `GlossaryStore.ts` | **Information Expert** (conoce los términos) |
| Modello | `modelo-*.mdx` + `ModelSchema` | **Creator** (contiene datos del modelo) |
| Nodo | `Nodo.ts` | **Pure Fabrication** (evalúa satisfacibilidad) |

### 2.7 Diagrammi di sequenza (analisi)

**Qué pide**: SSD (System Sequence Diagram) caja negra.

**Equivalencia**: el SSD para ValutaGrafoAttivo muestra la interacción Studente↔Sistema sin revelar componentes internos. La implementación en React sigue el mismo flujo: `onClick` → `toggleAxiom()` → `evaluate()` → re-render.

---

## 3. Piano di Test Funzionale

**Qué pide**: Category Partition Testing con parámetros, categorías, restricciones y casos de prueba.

**Equivalencia**: 3 parámetros (Assiomi Attivi A1/A2/A3, Tipo Dipendenza D1/D2/D3, Integrità Grafo I1/I2), 3 restricciones, 5 casos de prueba. La técnica CPT es independiente del lenguaje. Los tests se implementan en:
- **Vitest** (`tests/entity/grafo.test.ts`) en lugar de JUnit
- Misma estructura: `describe` ↔ `@Test`, `expect` ↔ `assertThat`

---

## 4. Progettazione (BCED)

**Esta es la sección más crítica para la defensa.** La plantilla asume arquitectura BCED en Java con Spring. Matematika implementa BCED con TypeScript/React/Zustand.

### 4.1 Traducción de Clases de Análisis a BCED

| Capa BCED | En Java (Spring) | En Matematika | Equivalencia |
|---|---|---|---|
| **B**oundary | `@RestController` + JSP/Thymeleaf | `AxiomSandboxPanel.tsx`, `AxiomaticTree.tsx` (React) | Ambos son la capa de presentación. React añade reactividad en tiempo real que JSP no tiene |
| **C**ontroller | `@Service` / `@Controller` | `GraphSandboxStore.ts`, `GraphStore.ts` (Zustand) | Zustand stores gestionan el estado y la lógica de aplicación. Mismo rol que los servicios Spring: orquestar entidades |
| **E**ntity | Clases POJO con JPA | `Grafo.ts`, `Nodo.ts`, `graphTypes.ts` | Clases TypeScript con tipos estáticos. Sin ORM porque los datos son JSON/MDX, no SQL |
| **D**atabase | `@Repository` + JDBC/JPA | `ContentStore.ts` (DAO), `graph_structure.json`, `contentIndex.json` | El DAO carga datos de archivos en lugar de SQL. Zod valida schemas (equivalente a Bean Validation + DDL) |

### 4.2 Diagramma delle classi (progettazione)

**Qué pide**: BCED class diagram con paquetes.

**Equivalencia**: el diagrama muestra la misma separación en 4 capas. Las asociaciones entre Boundary→Controller→Entity→Database se implementan como:
- Boundary → Controller: `useGraphSandboxStore()` (hook React)
- Controller → Entity: `new Grafo(structure)` + `grafo.evaluate()`
- Entity → Database: `ContentStore` carga `graph_structure.json`

### 4.3 Diagrammi di sequenza (progettazione)

**Qué pide**: diagrama de secuencia de diseño con objetos BCED.

**Equivalencia**: el flujo `Studente → AxiomSandboxPanel → GraphSandboxStore → Grafo → Nodo` muestra exactamente la misma coreografía BCED que en Java. La diferencia es sintáctica: en Java serían llamadas a métodos; en TypeScript/React son hooks + dispatchers.

---

## 5. Implementazione

**Qué pide**: describir paquetes (Database, Entity, Controller, Boundary) con código Java.

### 5.1 Package Database

| Java (Spring/JPA) | Matematika |
|---|---|
| `@Entity` + `@Table` | Zod schemas (`AxiomSchema`, `TheoremSchema`) |
| `@Repository` + `findById()` | `ContentStore.getTheorem(id)` |
| `application.properties` | `contentIndex.json` (mapea IDs a rutas) |
| Flyway / migraciones | `npm run generate-index` (regenera el índice) |

**Fragmento clave** (`ContentStore.ts`):
```typescript
// Equivalente a: @Repository public class ContentStore {
//   @PersistenceContext private EntityManager em;
//   public Theorem getTheorem(String id) { return em.find(Theorem.class, id); }
// }
getTheorem(id: string): Theorem | undefined {
  return this.theorems.get(id);
}
```

### 5.2 Package Entity

| Java (POJO) | Matematika |
|---|---|
| `public class Grafo { ... }` | `export class Grafo { ... }` |
| `public boolean evaluate(...)` | `evaluate(activeAxioms): Set<string>` |
| `private final Map<String, Nodo> nodi` | `private readonly nodi: ReadonlyMap<string, Nodo>` |
| `List<String> topologicalOrder` | `private readonly order: string[]` |

**Equivalencia de modificadores de acceso**:
| Java | TypeScript |
|---|---|
| `private` | `private` |
| `public` | `public` (por defecto) |
| `final` | `readonly` |
| `Map<String, Nodo>` | `ReadonlyMap<string, Nodo>` |
| `Set<String>` | `Set<string>` |

### 5.3 Package Controller

| Java (Spring) | Matematika |
|---|---|
| `@RestController` | No aplica (SPA sin backend) |
| `@Service` + lógica de negocio | `GraphSandboxStore` (Zustand store) |
| `@Transactional` | No aplica (datos in-memory) |
| Inyección de dependencias (`@Autowired`) | Hooks React (`useGraphSandboxStore()`) |

**Fragmento clave** (`GraphSandboxStore.ts`):
```typescript
// Equivalente a: @Service public class GraphSandboxService {
//   public Set<String> toggleAxiom(String axiomId) { ... }
// }
toggleAxiom: (axiomId: string) => {
  const newAxioms = { ...get().activeAxioms, [axiomId]: !get().activeAxioms[axiomId] };
  const validNodes = grafo.evaluate(newAxioms);
  set({ activeAxioms: newAxioms, validNodes });
}
```

### 5.4 Package Boundary

| Java (Spring MVC) | Matematika |
|---|---|
| `@GetMapping("/axiomi")` + ModelAndView | `<AxiomSandboxPanel />` (componente React) |
| `<form:checkbox>` JSP | `<input type="checkbox">` JSX |
| `onSubmit()` → Controller | `onClick()` → `toggleAxiom()` vía hook |
| Renderizado en servidor | Renderizado en cliente (React Virtual DOM) |

### 5.5 Package DTO

**Qué pide la plantilla**: Data Transfer Objects para desacoplar entidades de la UI.

**Equivalencia en Matematika**: no se implementa un paquete DTO explícito porque:
- Los datos viajan del `ContentStore` (DAO) directamente a los componentes React como props
- No hay serialización/deserialización (no hay red entre capas — todo está en memoria)
- Las interfaces TypeScript (`GraphNodeMeta`, `ContentIndexEntry`) cumplen el rol de DTO al definir la forma de los datos que cruzan las capas

### 5.6 Diagramma di Deployment

**Qué pide**: arquitectura física de despliegue.

**Equivalencia**: Matematika se despliega en **GitHub Pages** (hosting estático). No hay servidor de aplicaciones (Tomcat/WildFly) porque es una SPA pura. El pipeline de CI/CD es **GitHub Actions** (equivalente a Jenkins):
```yaml
# .github/workflows/deploy.yml
- run: npm ci        # Equivalente a: mvn clean install
- run: npm run build # Equivalente a: mvn package
- uses: peaceiris/actions-gh-pages # Equivalente a: scp al servidor
```

---

## 6. Testing

### 6.1 Test Strutturale (Caja Blanca)

**Qué pide**: Control Flow Graph, complejidad ciclomática (McCabe), caminos independientes.

**Equivalencia**: el CFG de `Grafo.evaluate()` tiene 8 nodos de decisión, V(G)=9, 10 caminos elementales. La técnica de McCabe es independiente del lenguaje — se aplica igual a un método Java que a una función TypeScript.

| Java | TypeScript |
|---|---|
| `if (cond) { ... }` | `if (cond) { ... }` — mismo nodo de decisión |
| `for (String id : order)` | `for (const nodeId of this.order)` — mismo bucle |
| `return result;` | `return validNodes;` — mismo nodo de salida |

### 6.2 Test di Unità (JUnit → Vitest)

**Equivalencia directa**:
```java
// JUnit 5
@Test
public void testToggleAxiom_OR_Logic() {
    Grafo grafo = Grafo.from(structure);
    Map<String, Boolean> axioms = Map.of("axioma-incidencia-1", true);
    Set<String> result = grafo.evaluate(axioms);
    assertTrue(result.contains("teorema-dos-rectas-un-punto"));
}
```

```typescript
// Vitest (tests/entity/grafo.test.ts)
it('should validate theorem with at least one proof satisfied (OR logic)', () => {
    const grafo = Grafo.from(structure);
    const axioms = { 'axioma-incidencia-1': true };
    const result = grafo.evaluate(axioms);
    expect(result.has('teorema-dos-rectas-un-punto')).toBe(true);
});
```

### 6.3 Test Funzionale (Caja Negra)

**Qué pide**: tabla de resultados con PASS/FAIL.

**Equivalencia**: los 5 casos de prueba (TC_01 a TC_05) se ejecutan con Vitest. La tabla de resultados muestra todos PASS. La técnica de Category Partition es independiente del lenguaje.

---

## 7. Conceptos del Curso (main.pdf) aplicados al proyecto

### 7.1 Naturaleza del Software

**Concepto del curso**: el software es el motor de la sociedad de la información. La paradoja de los costes: el mantenimiento (60-80%) supera al desarrollo inicial.

**Aplicación en Matematika**: el proyecto se diseñó para ser **mantenible**. Cada teorema, demostración y definición es un archivo MDX independiente (modularidad). El sistema de skills (.agents/skills/) permite a una IA generar nuevo contenido siguiendo estándares. La arquitectura BCED desacopla presentación, lógica, entidades y datos.

### 7.2 La Crisis del Software y la Ingeniería como Disciplina

**Concepto del curso**: el software debe construirse con el mismo rigor que los puentes.

**Aplicación en Matematika**:
- **Validación automática**: `npm run typecheck` (TypeScript) + `npm run validate-graph` (DAG sin ciclos) + `npm run lint` (ESLint)
- **Schemas Zod**: validación en runtime de todos los metadatos (equivalente a XML Schema / DTD)
- **Tests automatizados**: Vitest para tests unitarios + CI/CD via GitHub Actions
- **Control de versiones**: Git + commits atómicos

### 7.3 Proceso de Desarrollo

**Concepto del curso**: ciclo de vida en cascada vs. iterativo.

**Aplicación en Matematika**: desarrollo iterativo con:
- Fase 0: Skills de IA para generación asistida de contenido matemático
- Fase 1: Contenido (teoremas, demostraciones, axiomas)
- Fase 2: Interactividad (JSXGraph, modo sandbox)
- Fase 3: Refinamiento (validación del grafo, testing)

### 7.4 Requisitos y su Clasificación

**Concepto del curso**: requisitos funcionales, no funcionales, de dominio.

**Aplicación en Matematika**: 15 RF, 3 RD, 5 RQ-QUAL, 2 V. Clasificación según ISO 25010 para calidad. Trazabilidad completa requisito→código→test.

### 7.5 UML y Modelado

**Concepto del curso**: diagramas de casos de uso, clases, secuencia.

**Aplicación en Matematika**: todos los diagramas UML se generan con PlantUML (misma herramienta que en Java). Los diagramas reflejan fielmente la arquitectura implementada.

### 7.6 Arquitectura BCED

**Concepto del curso**: separación en Boundary, Controller, Entity, Database.

**Aplicación en Matematika**: implementación completa de BCED con TypeScript/React/Zustand. La separación de responsabilidades es idéntica a la de una aplicación Java/Spring.

| Principio BCED | Java/Spring | Matematika |
|---|---|---|
| Separación de capas | Paquetes `boundary`, `controller`, `entity`, `database` | Carpetas `src/boundary/`, `src/controller/`, `src/entity/`, `src/database/` |
| B no conoce E | Controlador nunca accede a la BD directamente | Los componentes React nunca importan `Grafo.ts` — usan el store |
| C orquesta | `@Service` llama a `@Repository` y devuelve DTOs | `GraphSandboxStore` llama a `Grafo.evaluate()` y actualiza el estado |
| D es intercambiable | Cambiar de MySQL a PostgreSQL sin tocar Entity | Cambiar de JSON estático a API REST sin tocar `Grafo.ts` |

### 7.7 Principios SOLID y GRASP

**Aplicación en Matematika**:

| Principio | Ejemplo en el código |
|---|---|
| **S**ingle Responsibility | `Grafo.ts` solo evalúa el DAG; `Nodo.ts` solo verifica satisfacibilidad |
| **O**pen/Closed | Nuevos tipos de contenido se añaden como archivos MDX sin modificar el motor |
| **L**iskov | Las interfaces (`GraphNodeMeta`) son implementadas por todas las entidades |
| **I**nterface Segregation | `GraphStructure` no obliga a conocer detalles de renderizado |
| **D**ependency Inversion | `Grafo` depende de la abstracción `GraphStructure`, no de archivos concretos |

| Patrón GRASP | Ejemplo |
|---|---|
| **Information Expert** | `Grafo` conoce la topología → `evaluate()` está en `Grafo` |
| **Controller** | `GraphSandboxStore` orquesta el caso de uso |
| **Creator** | `ContentStore` crea instancias de `Grafo` desde JSON |
| **High Cohesion** | `Nodo` solo tiene responsabilidades de evaluación lógica |
| **Low Coupling** | `Grafo` no conoce React ni el DOM |

### 7.8 Testing y Calidad

**Concepto del curso**: pruebas de caja blanca (cobertura de caminos), caja negra (partición de categorías), unitarias.

**Aplicación en Matematika**:
- Caja blanca: CFG de `Grafo.evaluate()` con V(G)=9 y 10 caminos
- Caja negra: CPT con 3 parámetros y 5 casos de prueba
- Unitarias: Vitest con `describe`/`it`/`expect`
- Cobertura: 5 casos de prueba cubren los 10 caminos del CFG

### 7.9 DevOps y CI/CD

**Concepto del curso**: integración continua, despliegue continuo.

**Aplicación en Matematika**:
- **GitHub Actions**: `npm run typecheck` + `npm run lint` + `npm run validate-graph` en cada push
- **GitHub Pages**: despliegue automático de la SPA
- **Husky**: git hooks para validación pre-commit

---

## 8. Resumen para la Defensa

**¿Por qué Matematika NO está en Java?**

Porque es una **Single Page Application** (SPA) que se ejecuta en el navegador. Java no es el lenguaje nativo del navegador — JavaScript/TypeScript sí lo es. Implementar una SPA en Java requeriría un servidor (Spring Boot + Thymeleaf o similar) que generase HTML en el servidor, perdiendo la interactividad en tiempo real que Matematika necesita (diagramas JSXGraph arrastrables, modo sandbox con validación instantánea).

**¿Cumple Matematika todos los requisitos de Ingegneria del Software?**

Sí. El proyecto:
1. Sigue el **proceso completo** del template: especificación → análisis → diseño (BCED) → implementación → testing
2. Implementa la **arquitectura BCED** con separación estricta de capas
3. Aplica **patrones GRASP y principios SOLID**
4. Incluye **tests estructurales y funcionales** con métricas de cobertura
5. Utiliza **control de versiones, CI/CD y validación automática**
6. Genera toda la **documentación UML** con PlantUML

La elección de TypeScript/React/Zustand sobre Java/Spring es una decisión de **diseño arquitectónico** justificada por los requisitos no funcionales del sistema (interactividad en tiempo real, ejecución en navegador, sin backend). Los conceptos de ingeniería del software son **independientes del lenguaje**.
