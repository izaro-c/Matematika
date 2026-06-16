const fs = require('fs');
const path = require('path');

const statements = {
  "matriz.mdx": "Una matriz $A$ de dimensión $m \\times n$ es un arreglo rectangular de escalares dispuestos en $m$ filas y $n$ columnas.",
  "determinante.mdx": "El determinante de una matriz cuadrada $A$ de orden $n$, denotado como $\\det(A)$ o $|A|$, es un valor escalar que resume ciertas propiedades de la matriz, como su invertibilidad y el factor de escala de la transformación lineal que representa.",
  "definicion_derivada.mdx": "La derivada de una función $f(x)$ en un punto $x$ se define como el límite: $f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}$.",
  "producto_vectorial.mdx": "El producto vectorial de dos vectores $\\vec{u}$ y $\\vec{v}$ en $\\mathbb{R}^3$ es un nuevo vector ortogonal a ambos, cuya magnitud es $|\\vec{u} \\times \\vec{v}| = |\\vec{u}||\\vec{v}|\\sin(\\theta)$.",
  "limite.mdx": "Se dice que $\\lim_{x \\to a} f(x) = L$ si para todo $\\epsilon > 0$ existe un $\\delta > 0$ tal que si $0 < |x - a| < \\delta$, entonces $|f(x) - L| < \\epsilon$."
};

const dir = path.join(__dirname, '../src/content/definitions');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));

for (const file of files) {
  const statement = statements[file];
  if (statement) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const statementLine = `statement: "${statement.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}",`;
    
    if (content.includes('statement:')) {
      content = content.replace(/statement:\s*".*?",/, statementLine);
    } else {
      content = content.replace(/(description:\s*".*?",)/, `$1\n  ${statementLine}`);
    }
    fs.writeFileSync(filePath, content);
    console.log(`Updated math statement in ${file}`);
  }
}
