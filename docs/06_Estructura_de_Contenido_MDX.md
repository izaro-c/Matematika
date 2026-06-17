# Guía de Creación de Contenido MDX y Tipos de Páginas

El proyecto Matematika utiliza un sistema de grafos lógicos para relacionar diferentes conceptos matemáticos. Cada nodo de este grafo se define mediante un archivo MDX que contiene tanto el contenido enriquecido como los metadatos necesarios para validar la estructura lógica.

A continuación, se detalla la estructura, ubicación y propiedades requeridas para cada tipo de página.

---

## 1. Metadatos Comunes (Base)

Todos los archivos `.mdx` ubicados en `src/content/` deben exportar de manera explícita una constante `metadata`. La estructura base compartida por la mayoría de las entidades es la siguiente:

```javascript
export const metadata = {
  id: "identificador-unico", // String: ID único (formato slug, ej. "teorema-pitagoras")
  type: "tipo",              // String: 'axioma', 'definicion', 'teorema', etc.
  title: "Título Legible",   // String: Título principal de la página
  description: "Resumen",    // String (Opcional): Breve descripción del concepto
  tags: ["Geometría"],       // Array de Strings (Opcional): Ramas o categorías taxonómicas
  authors: ["pitagoras"],    // Array de Strings (Opcional): IDs de matemáticos asociados
  color: "terracota"         // String (Opcional): Color temático (ej. terracota, salvia, pavo)
};
```

---

## 2. Tipos de Entidades y Propiedades Específicas

### 2.1 Definición (`type: 'definicion'`)
**Ubicación:** `src/content/definitions/`

Define los bloques fundamentales de construcción (objetos y propiedades geométricas o algebraicas).

- **Propiedades Extra:**
  - `statement` (String): El enunciado formal de la definición.
  - `usedBy` (Array de Strings): Lista de IDs (teoremas, lemas) que dependen de esta definición (para grafos bidireccionales explícitos).

### 2.2 Axioma (`type: 'axioma'`)
**Ubicación:** `src/content/axioms/`

Define postulados y afirmaciones aceptadas sin demostración en un sistema formal.

- **Propiedades Extra:**
  - `statement` (String): El enunciado del axioma.
  - `links` (Array de Strings): Referencias hacia otros conceptos o axiomas.

### 2.3 Teorema (`type: 'teorema'`)
**Ubicación:** `src/content/theorems/`

Proposiciones matemáticas que pueden y deben ser demostradas a partir de axiomas y definiciones previas.

- **Propiedades Extra:**
  - `corollaries` (Array de Strings): IDs de los corolarios derivados de este teorema.
  - `demos` (Array de Strings): IDs de las demostraciones asociadas (las demostraciones son páginas independientes).
  - `hasSimulation` (Boolean): Indica `true` si el archivo exporta componentes reactivos de simulación (`export const Simulation = ...`).

### 2.4 Demostración (`type: 'demostracion'`)
**Ubicación:** `src/content/demonstrations/`

Desarrollo secuencial y argumentativo de un teorema. **Sometidas a validaciones estrictas del DAG lógico** para evitar ciclos (una demostración no puede depender de teoremas superiores).

- **Propiedades Extra:**
  - `parentTheorem` (String): **(Obligatorio)** ID del teorema que está demostrando. Sin esto, el validador emitirá un _WARNING_.
  - `lemmas` (Array de Strings): IDs de los lemas utilizados como pasos intermedios.
  - `proofMethod` (String): Etiqueta metodológica (ej. `"metodo-directo"`, `"reduccion-absurdo"`).
  - `layout` (String): Especifica el diseño visual en React (ej. `"split"` para vista en dos columnas texto/diagrama).

### 2.5 Modelo (`type: 'modelo'`)
**Ubicación:** `src/content/models/`

Actúa como el contenedor ontológico raíz (ej. Modelo Euclidiano). Al activarse, valida un conjunto de axiomas específicos.

- **Propiedades Extra:**
  - `axiomas` (Array de Strings): **(Obligatorio)** Lista de IDs de los axiomas base del modelo.

### 2.6 Otras Entidades Soportadas
La validación jerárquica del sistema y la carpeta `src/content/` soportan además las siguientes entidades:

- **Lema (`type: 'lema'`) / Corolario (`type: 'corolario'`)**: Ubicados en `theorems/` (o estructura propia). Estructura similar a los Teoremas.
- **Ejemplo (`type: 'ejemplo'`) / Ejercicio (`type: 'ejercicio'`)**: En `examples/` y `exercises/`. Referenciados en el material práctico de las definiciones y teoremas.
- **Caso de Uso (`type: 'caso_de_uso'`)**: En `usecases/`. Aplicaciones en el mundo real.
- **Matemático (`type: 'matematico'`)**: En `mathematicians/`. Biografía y listado de aportes.
- **Plan de Estudio (`type: 'plan_de_estudio'`)**: En `plans/`. Rutas guiadas de aprendizaje.
- **Lección (`type: 'leccion'`)**: En `lessons/`.

---

## 3. Jerarquía Lógica (DAG)

El script `validate-logical-graph.ts` se asegura de que no haya ciclos lógicos verificando los niveles de dependencia (`HIERARCHY_LEVEL`):

0. `axioma`
1. `definicion`
2. `lema`
3. `teorema`
4. `corolario`
5. `demostracion`
10. `matematico`, `ejercicio`, `ejemplo`, etc.

**Regla de Oro:** 
- Las dependencias (detectadas automáticamente mediante etiquetas `<ConceptLink targetId="...">` o referencias directas) **deben apuntar hacia un nivel igual o inferior en jerarquía**. 
- Por ejemplo, un *teorema* (Nivel 3) puede citar un *lema* (Nivel 2) o una *definición* (Nivel 1), pero una *definición* (Nivel 1) no debe depender de un *teorema* (Nivel 3) a nivel lógico para no introducir ciclos (si ocurre, el verificador topológico podría detectar una dependencia circular y el script de validación se quebrará).

---

## 4. Componentes y UI en MDX

Los archivos MDX de Matematika tienen acceso a un conjunto de componentes de la UI diseñados para visualización rica. Los siguientes son importables directamente o disponibles globalmente:

- `<Capitular letra="E" />`: Letra capital ornamentada al inicio del texto (estilo medieval/matemático clásico).
- `<ConceptLink targetId="id-del-nodo">Texto</ConceptLink>`: Genera un enlace a otro nodo lógico del grafo y es fundamental porque **el script de validación infiere las dependencias extrayendo el `targetId` de estas etiquetas**.
- `<Formula title="Título (Opcional)">...</Formula>`: Contenedor destacado para ecuaciones de LaTeX.
- `<EquationRow>`: Fila con alineación especial dentro de las fórmulas.
- `<Nota>`: Bloque de aviso estilo "aside" para contexto histórico u observaciones.
- `<Separador />`: Línea divisoria elegante (`hr` adaptado al estilo del sitio).
- `<InteractiveElement target="variable-store" color="salvia">...</InteractiveElement>`: Permite la interactividad ligando el texto a un estado (Zustand) que el `Simulation` escucha para resaltar diagramas.
- `<DemonstrationSection diagram={<Componente />}>` y `<MedievalStep number={1} title="..." />`: Componentes exclusivos para formatear los pasos interactivos dentro de una **Demostración**.
