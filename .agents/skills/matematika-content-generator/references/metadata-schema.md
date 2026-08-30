# Esquema de Metadatos (`export const metadata`)

Los metadatos se validan en tiempo de compilación según los esquemas definidos en `src/data/content/schemas.ts`. Todo archivo `.mdx` debe exportar un objeto `metadata` que cumpla con los esquemas formales Zod del proyecto.

---

## 1. Campos Comunes (`BaseContentSchemaFields`)

```typescript
export const metadata = {
  id: "identificador-kebab-case",   // Obligatorio. Coincide con el nombre del archivo
  lang: "es",                       // "es" | "eu" | "en" (por defecto "es")
  type: "definicion",               // Tipo de nodo (ver tabla de tipos)
  subtype: "primitivo",             // Opcional para definiciones ('primitivo' | 'nominal' | 'derivado' | etc.)
  title: "Título Formal",           // Título principal visible
  description: "Resumen conciso...",// Descripción para resúmenes, SEO y tarjetas
  branch: "51A",                    // Código MSC 2020 canónico registrado en src/data/content/msc2020.ts (ej. "51A", "51M", "15A", "03B")
  branches: ["51A", "51M", "03B"],  // Ramas MSC secundarias opcionales (códigos 2 dígitos o 2 dígitos + letra)
  tags: ["geometria", "incidencia"],// Etiquetas temáticas opcionales
  hasSimulation: true,              // true si monta componente interactivo
  hasDiagram: false,                // true si monta diagrama estático/interactivo
  sources: [                        // Referencias bibliográficas opcionales
    {
      title: "Grundlagen der Geometrie",
      author: "David Hilbert",
      locator: "Capítulo I, §1",
      role: "primary"               // "primary" | "secondary" | "formalization"
    }
  ]
};
```

> [!IMPORTANT]
> **Compatibilidad de códigos `branch` y `branches` con la taxonomía del proyecto (`msc2020.ts`):**
> - Los códigos deben pertenecer a la tabla de ramas registradas (`mscNames`, `mscHierarchy` en `src/data/content/msc2020.ts`).
> - Utilizar códigos de **2 dígitos** (`"51"`, `"03"`, `"15"`) o **2 dígitos + 1 letra** (`"51A"`, `"51M"`, `"03B"`, `"15A"`).
> - **Prohibido** emplear subcódigos numéricos de 5 caracteres (como `"51A05"` o `"51M04"`) como valor de `branch`, ya que no están indexados en las tablas de nombres multilenguaje y rompen la navegación por migas de pan (*breadcrumbs*) y el árbol taxonómico de ramas.

---

## 2. Tipos de Contenido y Campos Específicos

| `type` | Campos Específicos Principales | Descripción y Restricciones Estructurales |
| :--- | :--- | :--- |
| **`definicion`** | `subtype?: 'primitivo' \| 'nominal' \| 'fundamentada' \| 'derivado' \| 'algebraico' \| 'analitico'`, `statement?: string`, `authors?: string[]`, `color?: string` | Noción matemática base o derivada. Admite `<SeccionPropiedades>` para teoremas intrínsecos. |
| **`axioma`** | `axiomSystem?: string`, `axiomFamily?: string`, `alternativeGroup?: string`, `statement?: string`, `authors?: string[]` | Postulado atómico e indecomponible. **Prohibido `<SeccionPropiedades>`**. |
| **`teorema`** | `statement?: string`, `authors?: string[]`, `requires?: string[]`, `lemmas?: string[]`, `corollaries?: string[]`, `demos?: string[]`, `examples?: string[]`, `exercises?: string[]`, `difficulty?: 'básico' \| 'intermedio' \| 'avanzado'` | Proposición demostrable principal dentro de una teoría. |
| **`lema`** | *(Igual que teorema)* | Proposición auxiliar intermedia para la demostración de un teorema. |
| **`corolario`** | `parentTheorem?: string`, *(demás campos de teorema)* | Consecuencia directa e inmediata de un teorema demostrado. |
| **`demostracion`** | `parentTheorem?: string`, `proofMethod?: string` (ej. `"metodo-contradiccion"`), `lemmas?: string[]`, `layout?: 'split' \| 'text'`, `dependencias?: string[]`, `authors?: string[]` | Demostración paso a paso con justificación axiomática. |
| **`sistema-axiomatico`** | `axiomas: string[]`, `models?: string[]`, `authors?: string[]` | Formalización del marco teórico ($\mathcal{S}, \sigma, \mathcal{T}$). Sin demostraciones en su cuerpo. |
| **`modelo`** | `satisfies: string \| string[]`, `axioms_verified?: string[]`, `hasDiagram?: boolean` | Estructura concreta que satisface un sistema. Requiere `<SeccionPropiedades>` para satisfacción e invariantes. |
| **`metodo`** | `subtype: 'demostracion' \| 'construccion' \| 'calculo' \| 'algoritmo'`, `links?: string[]`, `seeAlso?: string[]`, `requires?: string[]`, `difficulty?: 'básico' \| 'intermedio' \| 'avanzado'` | Procedimiento matemático o técnica demostrativa constructiva. |
| **`matematico`** | `name: string`, `birthYear?: number`, `deathYear?: number`, `country?: string`, `image?: string` | Entrada biográfica histórica y contextualización epistemológica. |
