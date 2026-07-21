const fs = require('fs');
const ts = require('typescript');

let file = 'src/widgets/diagrams/Teoremas/DemoSumaAngulos.tsx';
let content = fs.readFileSync(file, 'utf8');

const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);

let nodesToModify = [];
function collect(node) {
  if (ts.isObjectLiteralExpression(node)) {
    let isLineLike = false;
    let showLabelProp = null;
    for (const prop of node.properties) {
      if (ts.isPropertyAssignment(prop)) {
        let name = '';
        if (ts.isStringLiteral(prop.name)) name = prop.name.text;
        else if (ts.isIdentifier(prop.name)) name = prop.name.text;

        if (name === 'kind' && ts.isStringLiteral(prop.initializer)) {
          const kind = prop.initializer.text;
          if (['line', 'segment', 'ray', 'polygon', 'arc', 'circle'].includes(kind)) {
            isLineLike = true;
          }
        }
        if (name === 'showLabel' && prop.initializer.kind === ts.SyntaxKind.TrueKeyword) {
          showLabelProp = prop;
        }
      }
    }
    if (isLineLike && showLabelProp) {
      nodesToModify.push({start: showLabelProp.getStart(sourceFile), end: showLabelProp.getEnd()});
    }
  }
  ts.forEachChild(node, collect);
}

collect(sourceFile);
console.log("Found:", nodesToModify.length);
