import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const resultsPath = path.resolve(rootDir, 'test-results.json');
const markdownPath = path.resolve(rootDir, 'docs/testing/Category_Partition_Tests.md');
const defsPath = path.resolve(__dirname, 'test-definitions.json');

console.log('Ejecutando pruebas CPT en Vitest...');

try {
  execSync('npx vitest run tests/cpt.test.tsx --reporter=json --outputFile=test-results.json', {
    cwd: rootDir,
    stdio: 'ignore'
  });
  console.log('Pruebas exitosas. Parseando JSON...');
} catch (error) {
  console.log('Algunas pruebas fallaron, procesando resultados...');
}

if (!fs.existsSync(resultsPath) || !fs.existsSync(defsPath)) {
  console.error('Error: Faltan archivos JSON (test-results o test-definitions).');
  process.exit(1);
}

const rawResults = fs.readFileSync(resultsPath, 'utf8');
const rawDefs = fs.readFileSync(defsPath, 'utf8');

let testResults, testDefs;
try {
  testResults = JSON.parse(rawResults);
  testDefs = JSON.parse(rawDefs);
} catch(e) {
  console.error('Error parseando JSON:', e);
  process.exit(1);
}

// Mapear los resultados de Vitest por ID (asumiendo que el ID viene en el título del aserto)
const resultMap: Record<string, any> = {};
testResults.testResults.forEach((suite: any) => {
  suite.assertionResults.forEach((assertion: any) => {
    // Buscar TC-X.X en el título
    const match = assertion.title.match(/(TC-\d+\.\d+)/);
    if (match) {
      resultMap[match[1]] = assertion;
    }
  });
});

// Agrupar defs por Caso de Uso (UseCase)
const groupedDefs: Record<string, any[]> = {};
testDefs.forEach((def: any) => {
  if (!groupedDefs[def.useCase]) groupedDefs[def.useCase] = [];
  groupedDefs[def.useCase].push(def);
});

// Construir la nueva sección de Markdown
let generatedMarkdown = '';

for (const [useCase, defs] of Object.entries(groupedDefs)) {
  generatedMarkdown += `### ${useCase}\n\n`;
  generatedMarkdown += `| ID | Descripción | Clases Equivalencia | Precondiciones | Input | Output Esperado | Post Esperadas | Output Obtenido | Estado |\n`;
  generatedMarkdown += `|---|---|---|---|---|---|---|---|---|\n`;

  defs.forEach((def: any) => {
    const vitestResult = resultMap[def.id];
    let outputObtenido = 'N/A';
    let estado = '⚠️ **PENDING**';

    if (vitestResult) {
      const isPassed = vitestResult.status === 'passed';
      estado = isPassed ? '✅ **PASS**' : '❌ **FAIL**';
      
      if (isPassed) {
        outputObtenido = 'Coincide con esperado';
      } else {
        // Truncar el error para que quepa en la tabla
        const errMsg = vitestResult.failureMessages?.[0]?.replace(/\n/g, ' ') || 'Falló aserción';
        outputObtenido = errMsg.substring(0, 50) + '...';
      }
    }

    generatedMarkdown += `| **${def.id}** | ${def.description} | ${def.equivalenceClasses} | ${def.preconditions} | ${def.input} | ${def.expectedOutput} | ${def.expectedPostconditions} | ${outputObtenido} | ${estado} |\n`;
  });
  generatedMarkdown += '\n';
}

console.log('Actualizando Category_Partition_Tests.md...');
let mdContent = fs.readFileSync(markdownPath, 'utf8');

const startMarker = '<!-- TEST_TABLES_START -->';
const endMarker = '<!-- TEST_TABLES_END -->';

const startIndex = mdContent.indexOf(startMarker);
const endIndex = mdContent.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newContent = mdContent.substring(0, startIndex + startMarker.length) +
                     '\n\n' + generatedMarkdown +
                     mdContent.substring(endIndex);
  fs.writeFileSync(markdownPath, newContent, 'utf8');
  console.log('Documentación actualizada exitosamente con tablas detalladas.');
} else {
  console.error('No se encontraron los marcadores TEST_TABLES_START/END en el archivo Markdown.');
}

if (fs.existsSync(resultsPath)) fs.unlinkSync(resultsPath);
