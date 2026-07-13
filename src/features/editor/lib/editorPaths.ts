import {
  normalizeContentId,
  type FileNode,
} from '@/features/editor/lib/editorContracts';

export function buildContentPath(folder: string, fileName: string): string {
  const normalizedFolder = folder
    .split('/')
    .map(segment => normalizeContentId(segment))
    .filter(Boolean)
    .join('/');
  const extension = fileName.match(/\.(mdx|tsx)$/i)?.[0].toLowerCase() ?? '';
  const stem = extension ? fileName.slice(0, -extension.length) : fileName;
  return `database/content/${normalizedFolder}/${normalizeContentId(stem)}${extension}`;
}

export function buildTemplatePath(templateName: string): string {
  return `shared/templates/${normalizeContentId(templateName)}.template.mdx`;
}

export function getTemplateName(wizardType: string): string {
  return wizardType === 'lessons' ? 'lesson' : wizardType.slice(0, -1);
}

export function getInternalLinkUrl(fileNode: FileNode): string {
  const id = getContentId(fileNode);
  switch (fileNode.type) {
    case 'theorems': return `/teorema/${id}`;
    case 'lessons': return `/${id}`;
    case 'demonstrations': return `/demo/${id}`;
    case 'mathematicians': return `/bio/${id.toLowerCase()}`;
    default: return '';
  }
}

export function getContentId(fileNode: FileNode): string {
  return normalizeContentId(fileNode.name.replace(/\.(mdx|tsx)$/i, ''));
}

export function buildDiagramPath(category: string, fileName: string): string {
  const normalizedCategory = category
    .split('/')
    .map(segment => normalizeContentId(segment))
    .filter(Boolean)
    .join('/');
  return `widgets/diagrams/${normalizedCategory}/${normalizeContentId(fileName.replace(/\.(tsx|mdx)$/i, ''))}.tsx`;
}

export function buildDiagramTemplatePath(templateType: string): string {
  return `shared/templates/diagrams/${normalizeContentId(templateType)}.template.tsx`;
}
