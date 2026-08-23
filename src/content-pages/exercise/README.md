# Domain: `exercise`

Componentes y lógica interactiva para ejercicios, preguntas, pasos estructurados y retroalimentación didáctica con diseño Arts & Crafts.

---

## Arquitectura Modular

```
src/content-pages/exercise/
├── index.ts                      # Punto de entrada y exportaciones públicas
├── types.ts                      # Tipos e interfaces de dominio
├── constants.ts                  # Tiempos de animación e intentos máximos
├── README.md                     # Documentación arquitectónica
├── hooks/
│   ├── useExerciseQuestion.ts    # Hook unificado de estado, validación y shake
│   └── useSubcomponents.ts      # Parser memoizado de <ErrorComun> y <Resolucion>
└── ui/
    ├── shared/
    │   └── ExerciseCard.tsx      # Contenedor Arts & Crafts con marcapáginas y tabs
    ├── questions/
    │   ├── Pregunta.tsx          # Opción múltiple / simple
    │   ├── Hueco.tsx             # Rellenar huecos numéricos o algebraicos
    │   ├── Emparejar.tsx         # Correspondencia con conectores Bézier
    │   ├── Clasificador.tsx      # Clasificación drag-and-drop por categorías
    │   ├── Ordenacion.tsx        # Reordenación de deducciones secuenciales
    │   ├── MatrizInteractiva.tsx # Cuadrícula de álgebra matricial
    │   └── CanvasInteractivo.tsx # Wrapper para diagramas interactivos
    ├── steps/
    │   ├── ExerciseStep.tsx      # Paso interactivo con dependencias y badges
    │   ├── Paso.tsx              # Paso de ejemplo con revelado progresivo
    │   └── PasoContext.ts        # Contexto de paso completado
    ├── feedback/
    │   ├── ErrorComun.tsx        # Bloque de advertencia conceptual frecuente
    │   ├── Resolucion.tsx        # Explicación del paso tras completarlo
    │   ├── Solucion.tsx          # Bloque desplegable de solución completa
    │   └── Apoyo.tsx             # Nota al margen Arts & Crafts para ayuda contextual
    └── widgets/
        └── DeslizadorEnLine.tsx  # Control dinámico de variables en línea
```

---

## Uso en MDX

### 1. Paso Interactivo con Pregunta y Error Común Integrado

```mdx
<ExerciseStep
  id="p1"
  numero={1}
  titulo="Planteamiento de la Ecuación"
  questionIds={["p1_q1"]}
>
  Plantea la ecuación adecuada:

  <Pregunta
    id="p1_q1"
    correct="opt_correcta"
    texto="¿Cuál es la relación de áreas?"
    opciones={[
      { value: 'opt_correcta', texto: "$a^2 + b^2 = c^2$" },
      { value: 'opt_err', texto: "$a^2 = b^2 + c^2$", feedback: "Revisa la hipotenusa." }
    ]}
  >
    <Pregunta.ErrorComun titulo="Sumar catetos en vez de restar">
      Un cateto jamás puede ser más largo que la hipotenusa.
    </Pregunta.ErrorComun>

    <Pregunta.Resolucion>
      Sustituyendo los datos obtenemos la ecuación canónica.
    </Pregunta.Resolucion>
  </Pregunta>

  <Apoyo titulo="¿Quieres repasar el teorema?">
    Revisa la definición de triángulo rectángulo.
  </Apoyo>
</ExerciseStep>
```

### 2. Rellenar Huecos (Inline y Bloque)

```mdx
{/* En línea dentro de fórmulas */}
<Formula>
  $$ a = \sqrt{36} \implies a = \text{ } $$
  <Hueco id="p2_q1" correct="6" pista="¿Qué número al cuadrado da 36?" />
</Formula>

{/* Como bloque independiente */}
<Hueco
  id="p2_q2"
  pregunta="Calcula el valor numérico del discriminante:"
  correct="49"
  pista="Aplica b² - 4ac."
/>
```

---

## Principios de Diseño
1. **DRY estricto**: Toda la interacción de contexto, intentos, sacudida visual (`isShaking`) y pestañas de marcapáginas está delegada en [`useExerciseQuestion`](./hooks/useExerciseQuestion.ts) y [`useSubcomponents`](./hooks/useSubcomponents.ts).
2. **Estilo Arts & Crafts consistente**: Paleta semántica (`carbon`, `terracota`, `musgo`, `canela`), tipografía serif, marcapáginas con corte (|/\|) y micro-animaciones fluidas.
3. **Composición limpia**: Consumidores (`MDXBlocks.tsx`, `ExercisePage.tsx`) importan desde `@/content-pages/exercise`.
