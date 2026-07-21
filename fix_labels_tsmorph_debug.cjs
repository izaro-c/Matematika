const { Project, SyntaxKind } = require('ts-morph');
const project = new Project();
project.addSourceFilesAtPaths('src/widgets/diagrams/Definiciones/Triangulo.tsx');

const sourceFile = project.getSourceFiles()[0];
const objectLiterals = sourceFile.getDescendantsOfKind(SyntaxKind.ObjectLiteralExpression);

for (const obj of objectLiterals) {
  const kindProp = obj.getProperty('kind') || obj.getProperty('"kind"');
  if (kindProp && kindProp.isKind(SyntaxKind.PropertyAssignment)) {
    const init = kindProp.getInitializer();
    if (init && init.isKind(SyntaxKind.StringLiteral)) {
      const kindValue = init.getLiteralValue();
      if (kindValue === 'segment' || kindValue === 'line') {
         console.log('Found', kindValue);
         const props = obj.getProperties().map(p => {
            if (p.isKind(SyntaxKind.PropertyAssignment)) return p.getName();
            return 'unknown';
         });
         console.log('Props:', props);
         if (props.includes('showLabel') || props.includes('"showLabel"')) {
            console.log('HAS SHOW LABEL!!!');
         }
      }
    }
  }
}
