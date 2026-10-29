# Rúbrica de revisión de nodos

Para revisar un lote ya escrito, sea propio o de otro agente. Los scripts cubren lo mecánico; esta rúbrica cubre lo que exige leer y entender las matemáticas. Revisa siempre `es` completo y después compara `en` y `eu` con él.

## 0. Primero los scripts

```bash
node .agents/skills/matematika-content-generator/scripts/validate-nodes.mjs <id>...
```

Un `ERROR` ya es un fallo: no hace falta repetirlo en el informe. Los `WARN` de `check-links` y `check-style` son candidatos: confírmalos o descártalos uno a uno con la rúbrica.

## 1. Rigor

- **Enunciado formal correcto.** La fórmula del `<Definicion>` dice exactamente lo mismo que la prosa, con los cuantificadores en orden y sin hipótesis implícitas. Pregúntate: ¿hay un contraejemplo que la cumple y no debería?
- **Cada paso justificado.** En teoremas y demostraciones, cada afirmación remite a una hipótesis, un axioma, una definición o un resultado anterior, y ese antecedente está enlazado con `isDependency={true}`.
- **Frontera epistémica.** Nada de medidas, distancias o áreas antes de que el sistema las tenga (convenciones-proyecto.md §4). En un sistema que no tiene un axioma, no se usa ninguna consecuencia suya.
- **Dependencias completas y mínimas.** Todo antecedente constitutivo lleva `isDependency`; un concepto solo mencionado o un ejemplo no lo lleva.
- **Afirmaciones históricas comprobables.** Atribuciones, fechas y fuentes: si no puedes confirmarlas, márcalas como «sin verificar», no como error.

## 2. Simpleza

- La primera frase define o enuncia. El segundo párrafo aporta algo que el primero no dice; si repite la definición, sobra.
- Cada frase informa. Fuera los adjetivos que valoran («riguroso», «fundamental», «elegante»): el rigor se muestra.
- Las frases largas se dividen. Una frase con más de una subordinada encadenada suele esconder dos ideas.
- `<Nota>` y `<SeccionPropiedades>` solo si aportan algo no trivial (Golden Rules 2 y 17).

## 3. Modularidad

- **Un nodo, un concepto.** Si el texto define en negrita un segundo concepto, ese concepto necesita su propio nodo y aquí solo un `<ConceptLink>`.
- **Sin definiciones inline de conceptos externos** (Golden Rule 12): se nombra y se enlaza, no se explica.
- **Propiedades que son teoremas.** Una propiedad cuya prueba ocupa más de dos frases suele ser un teorema con nodo propio.
- **Teorema y demostración separados.** El teorema enuncia; la prueba vive en su `demo-…`.

## 4. Enlaces

- Todo concepto matemático tiene `<ConceptLink>` en su primera mención, exista o no la página (Pilar 2). Matemáticos citados por nombre también.
- El `targetId` corresponde al sentido usado aquí. `check-links` sugiere por coincidencia de palabras: «estructura» en ℝ no es `estructura-geometrica`. Si el ID correcto aún no existe, propón uno canónico (convenciones-proyecto.md §5).
- No sobre-enlaces: la segunda mención del mismo concepto en el mismo párrafo no necesita enlace.

## 5. Paridad de sentido

`check-parity` compara estructura, no significado. Comprueba que `en` y `eu` dicen lo mismo que `es`: misma afirmación, mismo cuantificador, mismo matiz. En `eu`, revisa además gramática y terminología con [euskara-glossary.md](./euskara-glossary.md).

## 6. Diagrama

Un diagrama merece existir cuando ayuda al lector a entender o a ver el concepto: hace visible lo que la fórmula solo enuncia. La pregunta es «¿qué ve el lector en la figura que no ve en la fórmula?», no «¿qué puede arrastrar?». La interactividad es un añadido cuando enseña algo (por qué hace falta una hipótesis, qué se conserva al mover un punto, cómo avanza una prueba), no un requisito. **Que no se te ocurra una interacción útil no es motivo para descartar el diagrama:** en ese caso, propón una figura estática.

Hay tres formas, de más simple a más compleja. Elige la más simple que enseñe lo que importa:

1. **Figura estática** (`"mode": "diagram"`, objetos fijos). Sirve para lo que se entiende mirando: un ejemplo que cumple la definición junto a otro que no la cumple, con lo que falta marcado en `granada`; una partición en clases; la estructura de un objeto. Es pequeña y se puede escribir a mano. Modelos: `Definiciones/RelacionReflexiva.tsx` (sí / no lado a lado) y `Definiciones/RelacionEquivalencia.tsx` (clases que parten un conjunto).
2. **Figura con pasos o botones.** Sirve cuando el concepto tiene un orden: una construcción, los pasos de una prueba, un antes y un después.
3. **Figura manipulable.** Sirve cuando el lector aprende rompiendo condiciones o moviendo puntos: diagramas de flechas con puntas arrastrables (`FuncionSagital.tsx`), conjuntos arrastrables con panel de resultado (`Interseccion.tsx`), tablas con casillas pulsables (`OperacionBinariaTabla.tsx`).

- **Suele merecerlo:**
  - Definiciones de objetos geométricos, axiomas con figura, teoremas con figura y sus demostraciones (un paso del diagrama por cada paso de la prueba).
  - Definiciones de propiedades de relaciones y funciones (reflexiva, simétrica, transitiva, equivalencia, inyectiva, sobreyectiva, biyección, inversa, composición). Como mínimo, una figura estática con un ejemplo y un contraejemplo. Si además el lector puede romper las condiciones una a una, mejor.
  - Operaciones entre conjuntos (intersección, unión, diferencia, complemento, producto cartesiano).
  - Estructuras algebraicas sobre conjuntos finitos (tabla de la operación, neutro, inversos).
  - Conceptos con una imagen canónica, aunque no sean geométricos: una partición, una sucesión que converge, el grafo de una función, un orden como diagrama de Hasse.
  - Métodos de prueba cuya mecánica se puede animar, como el dominó de la inducción.
- **No suele merecerlo:**
  - Conceptos lógicos o metamatemáticos que no tienen ninguna imagen propia (signatura, concepto primitivo, consistencia), sistemas axiomáticos y biografías.
  - Una página cuyo único dibujo posible ya está en otra página con el mismo contenido. Si la figura cambia de foco (aquí se marca la simetría y allí la equivalencia), no es repetición.
  - Una figura decorativa en la que no se ve nada que la página explique.
- Una demostración reutiliza o extiende con pasos el diagrama de su teorema; no crea uno paralelo.
- Que una figura parecida sirva también a una página hermana no es motivo para dejar esta sin diagrama. Cada página de una familia (reflexiva, simétrica, transitiva) puede tener su figura, centrada en su propiedad.
- Si concluyes «no necesita», di qué figura (estática o no) probaste a imaginar y qué le faltaría al lector para verla útil. «No hay nada que manipular» no basta.

## Formato del informe

Un bloque por nodo, solo con lo que hay que cambiar, ordenado por gravedad:

```
### <id>  — rigor ✗ · simpleza △ · modularidad ✓ · enlaces △ · paridad ✓ · diagrama ✓|△|✗|falta|no necesita
- [rigor] es: «<cita literal>» — <qué falla> → <cambio propuesto>
- [enlaces] es/en/eu: «Georg Cantor» sin enlace → <ConceptLink targetId="cantor">
```

`✓` sin hallazgos, `△` mejoras, `✗` algo falso, injustificado o que rompe una regla. Cita siempre el texto literal: un hallazgo sin cita no se puede aplicar. No reescribas los archivos salvo que te lo pidan.
