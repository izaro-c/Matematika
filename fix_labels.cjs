const fs = require('fs');
const glob = require('glob');
const files = glob.sync('src/widgets/diagrams/**/*.tsx');

files.forEach(file => {
  if (file.includes('DosRectasUnPunto.tsx')) return; // skip the one they want
  let content = fs.readFileSync(file, 'utf8');
  let dirty = false;

  // We can just use a regex for the JSON blocks. Or even simpler:
  // Since it's formatted JSON, we can look for blocks.
  // Actually, we can just replace "showLabel": true with "showLabel": false for line/segment/etc?
  // Let's parse the AST.
  const ts = require('typescript');
  const sourceFile = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
  
  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      let isLineLike = false;
      let showLabelProp = null;
      for (const prop of node.properties) {
        if (ts.isPropertyAssignment(prop) && ts.isStringLiteral(prop.name) && prop.name.text === 'kind') {
          if (ts.isStringLiteral(prop.initializer)) {
            const kind = prop.initializer.text;
            if (['line', 'segment', 'ray', 'polygon', 'arc', 'circle'].includes(kind)) {
              isLineLike = true;
            }
          }
        }
        if (ts.isPropertyAssignment(prop) && ts.isStringLiteral(prop.name) && prop.name.text === 'showLabel') {
          if (prop.initializer.kind === ts.SyntaxKind.TrueKeyword) {
            showLabelProp = prop;
          }
        }
      }
      if (isLineLike && showLabelProp) {
        // We found a target! Let's modify the file content
        const start = showLabelProp.getStart(sourceFile);
        const end = showLabelProp.getEnd();
        // Just remove the line. We can do it by replacing it with a comment or deleting.
        // It's safer to just change it to false!
        content = content.substring(0, start) + '"showLabel": false' + content.substring(end);
        dirty = true;
        // since we modify the string, we have to reload the AST if there are multiple. 
        // But doing it backwards or re-parsing is better. Let's just do it backwards.
        return true;
      }
    }
    return ts.forEachChild(node, visit);
  }

  // To do it properly backwards:
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
  if (nodesToModify.length > 0) {
    nodesToModify.sort((a, b) => b.start - a.start);
    for (const n of nodesToModify) {
      // Instead of removing, just replace true with false or delete the line
      // Better to delete the property to keep it clean.
      // Let's just replace the whole property with a space.
      content = content.substring(0, n.start) + '/* showLabel removed */' + content.substring(n.end);
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log('Fixed', file);
  }
});
