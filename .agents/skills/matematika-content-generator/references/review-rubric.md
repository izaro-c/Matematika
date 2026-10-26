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

Un diagrama merece existir cuando manipularlo enseña algo que el texto solo afirma: por qué hace falta una hipótesis, qué se conserva al mover un punto, qué condición se rompe y dónde, cómo avanza una prueba. Lo que decide es esa manipulación, no la rama de la matemática.

- **Suele merecerlo:**
  - Definiciones de objetos geométricos, axiomas con figura, teoremas con figura y sus demostraciones (un paso del diagrama por cada paso de la prueba).
  - Definiciones con condiciones que el lector puede romper una a una: función (totalidad y unicidad), inyectividad, sobreyectividad, biyección, función inversa, composición, relaciones de equivalencia sobre conjuntos finitos. Se ilustran con un diagrama de flechas entre conjuntos donde el lector arrastra las flechas y ve qué condición falla. El modelo es `content/diagrams/Definiciones/FuncionSagital.tsx`.
  - Operaciones entre conjuntos (intersección, unión, diferencia): conjuntos como regiones arrastrables con elementos dentro, y un panel que calcula el resultado. El modelo es `content/diagrams/Definiciones/Interseccion.tsx`.
  - Métodos de prueba cuya mecánica se puede animar, como el dominó de la inducción.
- **No suele merecerlo:**
  - Conceptos lógicos o metamatemáticos sin nada que manipular (signatura, concepto primitivo), sistemas axiomáticos y biografías.
  - Métodos de prueba que otro nodo ya ilustra.
  - Una página cuyo diagrama sería una figura estática que repite la definición.
- Una demostración reutiliza o extiende con pasos el diagrama de su teorema; no crea uno paralelo.
- El sistema de diagramas no es solo geométrico: tiene flechas, posiciones discretas (`on-points`), botones y paneles de estado. Que un concepto sea «de teoría de conjuntos» o «no geométrico» no basta para descartarlo. Si concluyes «no necesita», di qué manipulación probaste a imaginar y por qué no enseña nada nuevo.

## Formato del informe

Un bloque por nodo, solo con lo que hay que cambiar, ordenado por gravedad:

```
### <id>  — rigor ✗ · simpleza △ · modularidad ✓ · enlaces △ · paridad ✓ · diagrama ✓|△|✗|falta|no necesita
- [rigor] es: «<cita literal>» — <qué falla> → <cambio propuesto>
- [enlaces] es/en/eu: «Georg Cantor» sin enlace → <ConceptLink targetId="cantor">
```

`✓` sin hallazgos, `△` mejoras, `✗` algo falso, injustificado o que rompe una regla. Cita siempre el texto literal: un hallazgo sin cita no se puede aplicar. No reescribas los archivos salvo que te lo pidan.
