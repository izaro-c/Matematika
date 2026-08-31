# Esquema de Metadatos (`export const metadata`)

Los metadatos se validan en tiempo de compilación según los esquemas definidos en `src/data/content/schemas.ts`. Todo archivo `.mdx` debe exportar un objeto `metadata` que cumpla con los esquemas formales Zod del proyecto.

---

## 1. Campos Comunes (`BaseContentSchemaFields`)

```typescript
export const metadata = {
  id: "identificador-kebab-case",   // Obligatorio. Coincide exactamente con el nombre del archivo
  lang: "es",                       // "es" | "eu" | "en"
  type: "definicion",               // Tipo de nodo (ver tabla de tipos)
  subtype: "derivado",              // Opcional para definiciones ('primitivo' | 'nominal' | 'derivado' | 'fundamentada')
  title: "Título Formal",           // Título principal visible
  description: "Resumen conciso...",// Descripción para resúmenes, SEO y tarjetas
  branch: "51A",                    // Código MSC 2020 canónico registrado en src/data/content/msc2020.ts (ej. "51A", "51M", "03B", "15A")
  branches: ["51A", "51M"],         // Ramas MSC secundarias opcionales (códigos 2 dígitos o 2 dígitos + letra)
  tags: ["geometria", "congruencia"],// Etiquetas temáticas opcionales
  hasSimulation: false,             // true si monta componente interactivo Simulation
  hasDiagram: false,                // true si monta diagrama estático o interactivo
  sources: [                        // Referencias bibliográficas
    {
      title: "Grundlagen der Geometrie",
      author: "David Hilbert",
      locator: "Capítulo I, §5",
      role: "primary"               // "primary" | "secondary" | "formalization"
    }
  ]
};
```

> [!IMPORTANT]
> **Compatibilidad de códigos `branch` y `branches` con la taxonomía del proyecto (`msc2020.ts`):**
> - Los códigos deben pertenecer a la tabla de ramas registradas (`mscNames`, `mscHierarchy` en `src/data/content/msc2020.ts`).
> - Utilizar códigos de **2 dígitos** (`"51"`, `"03"`, `"15"`) o **2 dígitos + 1 letra** (`"51A"`, `"51M"`, `"03B"`, `"15A"`).
> - **Prohibido** emplear subcódigos numéricos de 5 caracteres (como `"51A05"` o `"51M04"`).

---

## 2. Tipos de Contenido y Campos Específicos

| `type` | Campos Específicos Principales | Restricciones y Reglas de Dependencia |
| :--- | :--- | :--- |
| **`definicion`** | `subtype?: 'primitivo' \| 'nominal' \| 'fundamentada' \| 'derivado'`, `statement?: string`, `authors?: string[]` | Noción matemática base o derivada. Admite `<SeccionPropiedades>` para teoremas intrínsecos. |
| **`axioma`** | `axiomSystem?: string`, `axiomFamily?: string`, `statement?: string`, `authors?: string[]` | Postulado atómico e indecomponible. **Prohibido `<SeccionPropiedades>`**. |
| **`teorema`** | `statement?: string`, `authors?: string[]`, `requires?: string[]`, `lemmas?: string[]`, `corollaries?: string[]`, `demos?: string[]`, `examples?: string[]`, `exercises?: string[]`, `difficulty?: 'básico' \| 'intermedio' \| 'avanzado'` | Proposición demostrada. Enlaza `demos: ["demo-..."]`. **Prohibido `isDependency={true}` hacia su propia demostración**. |
| **`lema`** | *(Igual que teorema)* | Proposición auxiliar intermedia. |
| **`corolario`** | `parentTheorem?: string`, *(demás campos de teorema)* | Consecuencia directa de un teorema demostrado. |
| **`demostracion`** | `parentTheorem: string`, `proofMethod?: string` (ej. `"metodo-contradiccion"`, `"metodo-directo"`), `lemmas?: string[]`, `layout?: 'split' \| 'text'`, `dependencias?: string[]`, `authors?: string[]` | Deducción formal paso a paso. Requiere `parentTheorem`. |
| **`sistema-axiomatico`** | `axiomas: string[]`, `models?: string[]`, `authors?: string[]` | Formalización del marco teórico $(\mathcal{S}, \sigma, \mathcal{T})$. |
| **`modelo`** | `satisfies: string \| string[]`, `axioms_verified?: string[]` | Estructura concreta de satisfacción. Requiere `<SeccionPropiedades>`. |
| **`metodo`** | `subtype: 'demostracion' \| 'construccion' \| 'calculo' \| 'algoritmo'`, `difficulty?: 'básico' \| 'intermedio' \| 'avanzado'` | Procedimiento o técnica demostrativa constructiva. |
| **`ejercicio`** / **`ejemplo`** | `difficulty?: 'básico' \| 'intermedio' \| 'avanzado'`, `authors?: string[]` | Aplicación práctica o pedagógica de un concepto o teorema. |
| **`caso-de-uso`** | `domain?: string`, `authors?: string[]` | Aplicación tecnológica o física del concepto (e.g. trilateración GPS). |
| **`matematico`** | `name: string`, `birthYear?: number`, `deathYear?: number`, `country?: string`, `image?: string` | Entrada biográfica histórica. Prohibido `isDependency={true}`. |
