const fs = require('fs');
const path = require('path');

const statements = {
  "distribucion_normal.mdx": "La suma de variables aleatorias independientes tiende a una distribución normal (Campana de Gauss) a medida que aumenta el tamaño de la muestra.",
  "distancia_punto_plano.mdx": "La distancia más corta desde un punto P(x₀,y₀,z₀) a un plano Ax+By+Cz+D=0 viene dada por la proyección ortogonal del punto sobre el plano: d = |Ax₀+By₀+Cz₀+D|/sqrt(A²+B²+C²).",
  "teorema_bayes.mdx": "Si A y B son sucesos y P(B) ≠ 0, la probabilidad condicional de A dado B es: P(A|B) = P(B|A)P(A)/P(B).",
  "teorema_fundamental_calculo.mdx": "La derivación y la integración son operaciones inversas. Si f es continua, la derivada de su integral definida respecto a su límite superior es igual a f(x).",
  "teorema_tales.mdx": "Si dos rectas cualesquiera se cortan por varias rectas paralelas, los segmentos determinados en una de las rectas son proporcionales a los segmentos correspondientes en la otra.",
  "regla_cramer.mdx": "Si un sistema de n ecuaciones con n incógnitas tiene determinante no nulo, el sistema tiene solución única y el valor de cada incógnita xi es det(Ai)/det(A).",
  "teorema_rouche_frobenius.mdx": "Un sistema de ecuaciones lineales es compatible si y solo si el rango de la matriz de coeficientes es igual al rango de la matriz ampliada.",
  "lema_invarianza_area.mdx": "El área de un paralelogramo (o un triángulo) no cambia si desplazamos uno de sus lados paralelos a lo largo de su recta directriz.",
  "teorema_pitagoras.mdx": "En un triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos: a² + b² = c².",
  "corolario_trigonometria.mdx": "Para cualquier ángulo α, la suma del cuadrado del seno y el cuadrado del coseno es siempre igual a 1: sin²(α) + cos²(α) = 1."
};

const dir = path.join(__dirname, '../src/content/theorems');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (!content.includes('statement:')) {
    const statement = statements[file];
    if (statement) {
      content = content.replace(/(description:\s*".*",)/, `$1\n  statement: "${statement}",`);
      fs.writeFileSync(filePath, content);
      console.log(`Updated ${file}`);
    }
  }
}
