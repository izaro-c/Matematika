import fs from 'fs';
import path from 'path';

function checkNoMathlib(dir: string): boolean {
  let ok = true;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      if (!checkNoMathlib(fullPath)) ok = false;
    } else if (file.name.endsWith('.lean') || file.name.endsWith('.mdx') || file.name.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('import Mathlib')) {
        console.error(`❌ Error: Mathlib import found in ${fullPath}`);
        ok = false;
      }
    }
  }
  return ok;
}

console.log('Verificando eliminación de Mathlib en el proyecto...');
const dirsToCheck = ['lean/Matematika', 'src'];
let allOk = true;

for (const dir of dirsToCheck) {
  if (fs.existsSync(dir)) {
    if (!checkNoMathlib(dir)) allOk = false;
  }
}

if (!allOk) {
  console.error('\n🚨 Fallo: Quedan restos de Mathlib activos en el core. Se deben eliminar para cumplir la regla Axiom-First.');
  process.exit(1);
}

console.log('✅ Verificación completada: Ningún rastro de Mathlib en el core.');
