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

## Formato del informe

Un bloque por nodo, solo con lo que hay que cambiar, ordenado por gravedad:

```
### <id>  — rigor ✗ · simpleza △ · modularidad ✓ · enlaces △ · paridad ✓
- [rigor] es: «<cita literal>» — <qué falla> → <cambio propuesto>
- [enlaces] es/en/eu: «Georg Cantor» sin enlace → <ConceptLink targetId="cantor">
```

`✓` sin hallazgos, `△` mejoras, `✗` algo falso, injustificado o que rompe una regla. Cita siempre el texto literal: un hallazgo sin cita no se puede aplicar. No reescribas los archivos salvo que te lo pidan.
