const fs = require('fs');
const path = require('path');

const statements = {
  "distancia_punto_plano.mdx": "La distancia más corta desde un punto $P(x_0,y_0,z_0)$ a un plano $Ax+By+Cz+D=0$ viene dada por la proyección ortogonal del punto sobre el plano: $d = \\frac{|Ax_0+By_0+Cz_0+D|}{\\sqrt{A^2+B^2+C^2}}$.",
  "teorema_bayes.mdx": "Si $A$ y $B$ son sucesos y $P(B) \\neq 0$, la probabilidad condicional de $A$ dado $B$ es: $P(A|B) = \\frac{P(B|A)P(A)}{P(B)}$.",
  "teorema_fundamental_calculo.mdx": "La derivación y la integración son operaciones inversas. Si $f$ es continua, la derivada de su integral definida respecto a su límite superior es: $\\frac{d}{dx} \\int_a^x f(t) dt = f(x)$.",
  "regla_cramer.mdx": "Si un sistema de $n$ ecuaciones con $n$ incógnitas tiene determinante no nulo, el sistema tiene solución única dada por $x_i = \\frac{\\det(A_i)}{\\det(A)}$.",
  "teorema_rouche_frobenius.mdx": "Un sistema de ecuaciones lineales es compatible si y solo si el rango de la matriz de coeficientes es igual al rango de la matriz ampliada: $\\text{rg}(A) = \\text{rg}(A|b)$.",
  "teorema_pitagoras.mdx": "En un triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos: $a^2 + b^2 = c^2$.",
  "corolario_trigonometria.mdx": "Para cualquier ángulo $\\alpha$, la suma del cuadrado del seno y el cuadrado del coseno es siempre igual a 1: $\\sin^2(\\alpha) + \\cos^2(\\alpha) = 1$."
};

const dir = path.join(__dirname, '../src/content/theorems');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));

for (const file of files) {
  const statement = statements[file];
  if (statement) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    // Regex para reemplazar el campo statement completo en frontmatter
    content = content.replace(/statement:\s*".*?",/, `statement: "${statement.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}",`);
    fs.writeFileSync(filePath, content);
    console.log(`Updated math statement in ${file}`);
  }
}
