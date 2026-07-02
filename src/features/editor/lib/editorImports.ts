import type { FileNode } from '@/features/editor/lib/editorContracts';

interface GenerateImportsInput {
  body: string;
  currentImports: string;
  currentFile: string;
  files: FileNode[];
}

interface GenerateImportsResult {
  imports: string;
  added: number;
}

export function generateMissingComponentImports({
  body,
  currentImports,
  currentFile,
  files,
}: GenerateImportsInput): GenerateImportsResult {
  const tags = Array.from(body.matchAll(/<([A-Z][a-zA-Z0-9]*)/g), match => match[1]);
  const uniqueTags = [...new Set(tags)];
  const depth = currentFile.split('/').length - 1;
  const backPath = Array(depth).fill('..').join('/');

  let imports = currentImports;
  let added = 0;

  for (const tag of uniqueTags) {
    if (imports.includes(tag)) continue;

    const componentFile = files.find(file => file.name === `${tag}.tsx`);
    if (!componentFile) continue;

    const importPath = componentFile.path.replace(/\.tsx$/, '');
    const statement = `import { ${tag} } from '${backPath}/${importPath}';`;
    if (imports.includes(statement)) continue;

    imports += (imports ? '\n' : '') + statement;
    added++;
  }

  return { imports, added };
}
