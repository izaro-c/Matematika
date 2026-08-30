# Estándares de Notación KaTeX y Símbolos Canónicos Modernos (ISO 80000-2)

Toda fórmula y notación matemática en Matematika debe seguir rigurosamente los estándares internacionales contemporáneos fijados por la comunidad matemática global y la norma **ISO 80000-2**.

---

## 1. Principios Notacionales Fundamentales

- **Universalidad y modernidad:** Utilizar **siempre** los símbolos matemáticos contemporáneos e internacionalmente estandarizados.
- **Cero notaciones arcaicas o ambiguas:**
  - **Congruencia geométrica:** Utilizar **siempre `\cong` ($\cong$)** para figuras, segmentos y ángulos ($\overline{AB} \cong \overline{CD}$, $\angle ABC \cong \angle DEF$). Prohibido usar `\equiv` ($\equiv$) para congruencia geométrica (salvo citas textuales históricas con aclaración), ya que colisiona con la aritmética modular y la equivalencia lógica.
  - **Congruencia angular y aridad formal:** En Hilbert §1, los ángulos se definen por pares de semirrectas no colineales concurrentes (o ternas de puntos con vértice común). La congruencia angular se denota $\angle ABC \cong \angle DEF$ o $\angle(h,k) \cong \angle(h',k')$, y su aridad de primer orden es $\cong_{\angle} \, \subseteq \mathcal{P}^6$. Prohibido $\angle A \cong \angle B$.
  - **Segmento abierto vs. cerrado:** Emplear $\operatorname{seg}(AB)$ para el segmento abierto (excluyendo extremos $A$ y $B$), y $\overline{AB}$ para el segmento cerrado o clausura geométrica.
  - **Semejanza geométrica:** Utilizar **`\sim` ($\sim$)** ($\triangle ABC \sim \triangle DEF$).
  - **Paralelismo y perpendicularidad:** Utilizar **`\parallel` ($\parallel$)** y **`\perp` ($\perp$)**.

---

## 2. Catálogo Completo de Símbolos Canónicos vs. Desaconsejados

| Concepto Matemático | Símbolo Canónico | Comando KaTeX | Ejemplo de Uso | Prohibido / Desaconsejado |
| :--- | :---: | :--- | :--- | :--- |
| **Congruencia geométrica** | $\cong$ | `\cong` | $\overline{AB} \cong \overline{CD}$, $\angle ABC \cong \angle DEF$ | $\equiv$ *(reservado a aritmética modular / lógica)* |
| **Congruencia angular** | $\angle ABC \cong \angle DEF$ | `\angle ABC \cong \angle DEF` | $\angle(h,k) \cong \angle(h',k')$ | $\angle A \cong \angle B$ *(sesgo puntual)* |
| **Semejanza geométrica** | $\sim$ | `\sim` | $\triangle ABC \sim \triangle A'B'C'$ | $\approx$ *(reservado a aproximación numérica)* |
| **Paralelismo** | $\parallel$ | `\parallel` | $\ell \parallel m$ | $\slash\slash$, $\parallel\mkern-2mu\parallel$ |
| **Perpendicularidad** | $\perp$ | `\perp` | $\ell \perp m$ | $\top$, $\bot$ *(reservado a lógica: falsedad)* |
| **Incidencia sintética** | $\mathbf{I}$ | `\mathbf{I}` | $P \, \mathbf{I} \, \ell$, $P \, \mathbf{I} \, \pi$ | $I$ cursiva ambigua, $\in$ (entre primitivos) |
| **Traza de incidencia puntual** | $\operatorname{tr}$ | `\operatorname{tr}` | $\operatorname{tr}(\ell) \subseteq \operatorname{tr}(\pi)$ | $\ell \subseteq \pi$ *(colapso de tipos)* |
| **Pertenencia conjuntista** | $\in$ | `\in` | $P \in \mathcal{P}$, $x \in X$ | $\epsilon$ (letra griega épsilon) |
| **Intermediación / Orden** | $*$ o $\mathbf{B}$ | `*` o `\mathbf{B}` | $A * B * C$, $\mathbf{B}(A, B, C)$ | $B(A,B,C)$ sin negrita |
| **Segmento abierto** | $\operatorname{seg}(AB)$ | `\operatorname{seg}(AB)` | $\operatorname{seg}(AB) \cap \ell = \emptyset$ | $(A,B)$ *(ambiguo con pares ordenados)* |
| **Segmento cerrado** | $\overline{AB}$ | `\overline{AB}` | $\overline{AB} = \operatorname{seg}(AB) \cup \{A, B\}$ | $\underline{AB}$, $AB$ sin barra para el conjunto |
| **Semirrecta (Rayo)** | $\overrightarrow{AB}$ | `\overrightarrow{AB}` | $\overrightarrow{AB}$ (origen $A$, pasa por $B$) | $\vec{AB}$ *(reservado a vectores)* |
| **Recta generada** | $\overleftrightarrow{AB}$ | `\overleftrightarrow{AB}` | $\overleftrightarrow{AB}$ (recta que une $A$ y $B$) | $\overline{AB}$ *(colisión con segmento)* |
| **Ángulo** | $\angle ABC$ | `\angle ABC` | $\angle ABC$ o $\widehat{ABC}$ | $<ABC$ |
| **Triángulo** | $\triangle ABC$ | `\triangle ABC` | $\triangle ABC$ | $\Delta ABC$ *(delta griega mayúscula)* |
| **Partición del universo** | $\sqcup$ | `\sqcup` | $\mathcal{U} = \mathcal{P} \sqcup \mathcal{L} \sqcup \Pi$ | $\cup$ simple sin disyunción |
| **Doble implicación** | $\iff$ | `\iff` | $A \sim_\ell B \iff \operatorname{seg}(AB) \cap \ell = \emptyset$ | $\leftrightarrow$, `<=>` |
| **Implicación directa** | $\implies$ | `\implies` | $P \implies Q$ | `->`, $\to$ *(reservado a funciones)* |
| **Conjunto vacío** | $\emptyset$ | `\emptyset` | $A \cap B = \emptyset$ | $\Phi$, $\phi$, $\{\}$ |
| **Conjuntos numéricos** | $\mathbb{N}, \mathbb{Z}, \mathbb{Q}, \mathbb{R}, \mathbb{C}$ | `\mathbb{R}`, etc. | $x \in \mathbb{R}^n$ | $\mathbf{R}$, $R$ cursiva |
| **Cardinalidad** | $\lvert S \rvert$ o $\text{card}(S)$ | `\lvert S \rvert` | $\dim(V) = \lvert B \rvert$ | `\card`, $|S|$ *(sin balanceo de barras)* |
| **Tablas KaTeX** | $\mid$ o $\lvert \dots \rvert$ | `\mid` | $S = \{ x \in \mathbb{R} \mid x > 0 \}$ | `|` directo *(rompe el parser Markdown)* |
