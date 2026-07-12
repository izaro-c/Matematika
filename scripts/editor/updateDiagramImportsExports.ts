import ts from 'typescript';

export interface UpdateImportsExportsResult {
  source: string;
  modified: boolean;
}

export function updateMdxImportsExports(
  source: string,
  componentName: string,
  importPath: string,
  mode: 'simulation' | 'diagram' | 'inline'
): UpdateImportsExportsResult {
  const exportName = mode === 'diagram' ? 'Diagram' : 'Simulation';
  const importStatement = `import { ${componentName} } from '${importPath}';`;
  const exportStatement = `export const ${exportName} = ${componentName};`;

  // Parse the source into AST to locate ESM parts
  // MDX source has JSX, imports, and markdown. Standard ts compiler will fail on markdown,
  // so we extract the ESM import/export statements first, or parse them line by line if we can.
  // Wait! In Matematika, MDX files contain imports and exports at the top, like:
  // export const metadata = { ... };
  // import { Pitagoras } from '@/widgets/diagrams/Teoremas/Pitagoras';
  // export const Simulation = Pitagoras;
  // <Capitular letra="E" />l ...
  
  // Let's divide the file into the front/ESM block and the body block.
  // We can locate where MDX tags or body starts.
  // Or, we can parse each statement at the top of the file that matches ts syntax.
  const lines = source.split(/\r?\n/);
  const esmLines: string[] = [];
  const bodyLines: string[] = [];
  let inEsm = true;

  for (const line of lines) {
    const trimmed = line.trim();
    if (inEsm) {
      if (trimmed.startsWith('<') || trimmed.startsWith('#') || (trimmed && !trimmed.startsWith('import') && !trimmed.startsWith('export') && !trimmed.startsWith('const') && !trimmed.startsWith('/*') && !trimmed.startsWith('//') && !trimmed.startsWith('}') && !trimmed.startsWith('{') && !trimmed.startsWith('*') && !trimmed.startsWith('`'))) {
        inEsm = false;
        bodyLines.push(line);
      } else {
        esmLines.push(line);
      }
    } else {
      bodyLines.push(line);
    }
  }

  const esmText = esmLines.join('\n');
  const esmSourceFile = ts.createSourceFile('esm.ts', esmText, ts.ScriptTarget.Latest, true);

  let hasImport = false;
  let hasExport = false;
  let importNodeToReplace: ts.ImportDeclaration | null = null;
  let exportNodeToReplace: ts.VariableStatement | null = null;

  const visit = (node: ts.Node) => {
    // Check imports
    if (ts.isImportDeclaration(node)) {
      const clause = node.importClause;
      if (clause && clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
        for (const specifier of clause.namedBindings.elements) {
          if (specifier.name.text === componentName) {
            hasImport = true;
            // Check if import path matches
            const moduleSpecifier = node.moduleSpecifier;
            if (ts.isStringLiteral(moduleSpecifier) && moduleSpecifier.text !== importPath) {
              importNodeToReplace = node;
            }
          }
        }
      }
    }

    // Check exports of Simulation or Diagram
    if (ts.isVariableStatement(node) && node.declarationList.declarations.length > 0) {
      const isExported = node.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
      if (isExported) {
        for (const decl of node.declarationList.declarations) {
          if (ts.isIdentifier(decl.name) && (decl.name.text === 'Simulation' || decl.name.text === 'Diagram')) {
            hasExport = true;
            if (decl.name.text !== exportName || (decl.initializer && decl.initializer.getText() !== componentName)) {
              exportNodeToReplace = node;
            }
          }
        }
      }
    }

    node.forEachChild(visit);
  };

  visit(esmSourceFile);

  let newEsmText = esmText;
  let modified = false;

  // 1. Handle Import updates
  if (!hasImport) {
    // Add import statement at the end of the ESM block or after existing imports
    const lastImportIndex = esmText.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const nextLineBreak = esmText.indexOf('\n', lastImportIndex);
      newEsmText = esmText.slice(0, nextLineBreak + 1) + importStatement + '\n' + esmText.slice(nextLineBreak + 1);
    } else {
      newEsmText = importStatement + '\n' + esmText;
    }
    modified = true;
  } else if (importNodeToReplace) {
    // Replace import statement path or the whole statement
    const start = (importNodeToReplace as ts.ImportDeclaration).getStart();
    const end = (importNodeToReplace as ts.ImportDeclaration).getEnd();
    newEsmText = esmText.slice(0, start) + importStatement + esmText.slice(end);
    modified = true;
  }

  // 2. Handle Export updates
  if (!hasExport) {
    // Add export statement at the end of ESM block
    newEsmText = newEsmText.trimEnd() + '\n' + exportStatement + '\n';
    modified = true;
  } else if (exportNodeToReplace) {
    // Replace variable statement
    const start = (exportNodeToReplace as ts.VariableStatement).getStart();
    const end = (exportNodeToReplace as ts.VariableStatement).getEnd();
    
    // We want to replace it in newEsmText, but the indices might have shifted if we modified the import.
    // Let's re-parse to be safe if modified, or replace directly if not.
    if (modified) {
      // Re-parse
      const tempSource = ts.createSourceFile('temp.ts', newEsmText, ts.ScriptTarget.Latest, true);
      let targetNode: ts.VariableStatement | null = null;
      const findExport = (n: ts.Node) => {
        if (ts.isVariableStatement(n) && n.declarationList.declarations.length > 0) {
          const isExported = n.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
          if (isExported) {
            for (const d of n.declarationList.declarations) {
              if (ts.isIdentifier(d.name) && (d.name.text === 'Simulation' || d.name.text === 'Diagram')) {
                targetNode = n;
              }
            }
          }
        }
        n.forEachChild(findExport);
      };
      findExport(tempSource);
      if (targetNode) {
        newEsmText = newEsmText.slice(0, (targetNode as ts.VariableStatement).getStart()) + exportStatement + newEsmText.slice((targetNode as ts.VariableStatement).getEnd());
      }
    } else {
      newEsmText = esmText.slice(0, start) + exportStatement + esmText.slice(end);
      modified = true;
    }
  }

  // Ensure export duplicates are cleaned up (e.g. if we switched from Simulation to Diagram, remove the old one)
  const finalEsmSourceFile = ts.createSourceFile('final_esm.ts', newEsmText, ts.ScriptTarget.Latest, true);
  const exportsList: { name: string; node: ts.Node }[] = [];
  const collectExports = (n: ts.Node) => {
    if (ts.isVariableStatement(n) && n.declarationList.declarations.length > 0) {
      const isExported = n.modifiers?.some(m => m.kind === ts.SyntaxKind.ExportKeyword);
      if (isExported) {
        for (const d of n.declarationList.declarations) {
          if (ts.isIdentifier(d.name) && (d.name.text === 'Simulation' || d.name.text === 'Diagram')) {
            exportsList.push({ name: d.name.text, node: n });
          }
        }
      }
    }
    n.forEachChild(collectExports);
  };
  collectExports(finalEsmSourceFile);

  if (exportsList.length > 1) {
    // If both Diagram and Simulation are exported, keep only the one matching exportName
    const redundant = exportsList.filter(item => item.name !== exportName);
    for (const item of redundant) {
      const start = item.node.getStart();
      const end = item.node.getEnd();
      newEsmText = newEsmText.slice(0, start) + newEsmText.slice(end);
      modified = true;
    }
  }

  return {
    source: newEsmText + (newEsmText.endsWith('\n') ? '' : '\n') + bodyLines.join('\n'),
    modified
  };
}
