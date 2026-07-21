const { Project, SyntaxKind } = require('ts-morph');
const project = new Project();
project.addSourceFilesAtPaths('src/widgets/diagrams/**/*.tsx');

let modified = 0;

for (const sourceFile of project.getSourceFiles()) {
  if (sourceFile.getFilePath().includes('DosRectasUnPunto.tsx')) continue;

  let dirty = false;
  const objectLiterals = sourceFile.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression);
  
  for (const obj of objectLiterals) {
    const kindProp = obj.getProperty('kind') || obj.getProperty('"kind"');
    if (kindProp && kindProp.isKind(SyntaxKind.PropertyAssignment)) {
      const init = kindProp.getInitializer();
      if (init && init.isKind(SyntaxKind.StringLiteral)) {
        const kindValue = init.getLiteralValue();
        if (['line', 'segment', 'ray', 'polygon', 'arc', 'circle'].includes(kindValue)) {
          const showLabelProp = obj.getProperty('showLabel') || obj.getProperty('"showLabel"');
          if (showLabelProp) {
             showLabelProp.remove();
             dirty = true;
          }
        }
      }
    }
  }

  if (dirty) {
    sourceFile.saveSync();
    console.log('Fixed', sourceFile.getFilePath());
    modified++;
  }
}

console.log('Total files modified:', modified);
