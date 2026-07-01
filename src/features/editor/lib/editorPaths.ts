import type { FileNode } from '@/features/editor/hooks/useEditorState';

export function buildContentPath(folder: string, fileName: string): string {
  return `database/content/${folder}/${fileName}`;
}

export function buildTemplatePath(templateName: string): string {
  return `shared/templates/${templateName}.template.mdx`;
}

export function getTemplateName(wizardType: string): string {
  return wizardType === 'lessons' ? 'lesson' : wizardType.slice(0, -1);
}

export function getInternalLinkUrl(fileNode: FileNode): string {
  const id = fileNode.name.replace('.mdx', '');
  switch (fileNode.type) {
    case 'theorems': return `/teorema/${id}`;
    case 'lessons': return `/${id}`;
    case 'demonstrations': return `/demo/${id}`;
    case 'mathematicians': return `/bio/${id.toLowerCase()}`;
    default: return '';
  }
}
