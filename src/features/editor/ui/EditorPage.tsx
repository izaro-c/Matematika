import React, { useEffect, useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useLocation, Link } from 'wouter';
import { useNavigationStore } from '@/features/search/NavigationStore';
import { ThemeToggle } from '@/widgets/navigation/ThemeToggle';
import { Logo } from '@/shared/ui/Logo';
import { routePath } from '@/shared/lib/routeHelper';
import { KatexText } from '@/shared/ui/KatexText';
import { useEditorCore } from '../core/useEditorCore';
import { MetadataInspector } from './components/MetadataInspector';
import { ValidationPanel } from './components/ValidationPanel';
import { FormulaBlock } from './blocks/FormulaBlock';
import { DemonstrationBlock } from './blocks/DemonstrationBlock';
import { SemanticLinker } from './components/SemanticLinker';
import { DiagramWorkbench } from './diagrams/DiagramWorkbench';
import { Block, BlockType, createBlockId, parseAttributes, parseInlineNodes } from '../core/parser';
import type { DiagramSpec, DiagramTargetRegistry } from '../core/editorTypes';
import type { FileNode } from '../lib/editorContracts';

const LATEX_SYMBOLS = [
  { label: '∀', code: '\\forall ' },
  { label: '∃', code: '\\exists ' },
  { label: '⟹', code: '\\implies ' },
  { label: '∈', code: '\\in ' },
  { label: '≅', code: '\\cong ' },
  { label: 'AB', code: '\\overline{AB}' },
  { label: '∠', code: '\\angle ' },
  { label: '△', code: '\\triangle ' },
  { label: '⊥', code: '\\perp ' },
  { label: '∥', code: '\\parallel ' }
];

type BlockPreset = {
  label: string;
  type: BlockType;
  content: string;
  metadata?: Record<string, any>;
  group?: 'general' | 'profile';
};

const GENERAL_BLOCK_PRESETS: BlockPreset[] = [
  { label: 'Párrafo', type: 'paragraph', content: '' },
  { label: 'Título', type: 'heading', content: 'Nueva sección', metadata: { level: 3 } },
  { label: 'Lista', type: 'list', content: 'Primer elemento\nSegundo elemento', metadata: { ordered: false } },
  { label: 'Tabla', type: 'table', content: '| Magnitud | Valor |\n|---|---|\n| a | $1$ |' },
  { label: 'Fórmula', type: 'formula', content: '$$ x = y $$' },
  { label: 'Definición', type: 'definition_box', content: 'Se define con precisión el objeto matemático.', metadata: { title: 'Definición' } },
  { label: 'Nota', type: 'note', content: 'Observación, caso límite o aclaración breve.' },
  { label: 'Cita', type: 'citation', content: 'Texto de la cita.', metadata: { author: '' } },
  { label: 'Separador', type: 'separator', content: '' },
  { label: 'Demostración', type: 'demonstration', content: '', metadata: { steps: [] } },
];

const PAGE_PROFILE_PRESETS: Record<string, BlockPreset[]> = {
  definicion: [
    { label: 'Motivación', type: 'heading', content: 'Motivación', metadata: { level: 3 }, group: 'profile' },
    { label: 'Definición formal', type: 'definition_box', content: 'Se especifican las condiciones necesarias y suficientes.', metadata: { title: 'Definición formal' }, group: 'profile' },
    { label: 'Casos límite', type: 'note', content: 'Se aclara qué ocurre en los casos degenerados o frontera.', group: 'profile' },
  ],
  teorema: [
    { label: 'Hipótesis', type: 'paragraph', content: 'Bajo las hipótesis indicadas en el enunciado formal, se consideran los objetos relevantes.', group: 'profile' },
    { label: 'Conclusión', type: 'formula', content: '$$ \\text{conclusión simbólica} $$', group: 'profile' },
    { label: 'Demostración asociada', type: 'paragraph', content: 'La demostración formal se enlaza como página independiente mediante un identificador de demostración en metadatos.', group: 'profile' },
  ],
  demostracion: [
    { label: 'Paso lógico', type: 'demonstration', content: '', metadata: { steps: [{ number: 1, title: 'Paso lógico', justificacion: 'Por hipótesis o por resultado previo especificado.', target: '', body: 'Se escribe la afirmación del paso con sus enlaces semánticos e interactivos.' }] }, group: 'profile' },
  ],
  ejercicio: [
    {
      label: 'Pregunta interactiva',
      type: 'exercise',
      content: `Identifica la relación matemática adecuada.\n\n<Pregunta\n  id="p1_q1"\n  correct="a"\n  texto="¿Qué afirmación es correcta?"\n  opciones={[\n    { value: "a", texto: "Respuesta correcta" },\n    { value: "b", texto: "Distractor razonable" }\n  ]}\n/>\n\n<Resolucion>\n  Se justifica la respuesta paso a paso.\n</Resolucion>`,
      metadata: { component: 'PasoEjercicio', id: 'p1', numero: 1, titulo: 'Planteamiento', questionIds: ['p1_q1'] },
      group: 'profile',
    },
    { label: 'Hueco', type: 'advancedMdx', content: '', metadata: { component: 'Hueco', id: 'q1', correct: 'respuesta', pista: 'Pista breve.' }, group: 'profile' },
    { label: 'Solución revelable', type: 'advancedMdx', content: 'Se desarrolla la solución completa con pasos justificados.', metadata: { component: 'Solucion', label: 'Ver solución' }, group: 'profile' },
  ],
  'caso-de-uso': [
    { label: 'Situación', type: 'heading', content: 'Situación', metadata: { level: 3 }, group: 'profile' },
    { label: 'Modelo matemático', type: 'definition_box', content: 'Se identifica el objeto matemático que modela la situación.', metadata: { title: 'Modelo matemático' }, group: 'profile' },
    { label: 'Cálculo', type: 'formula', content: '$$ \\text{cálculo} $$', group: 'profile' },
    { label: 'Interpretación', type: 'note', content: 'Se interpreta el resultado y se declaran los límites del modelo.', group: 'profile' },
  ],
  matematico: [
    { label: 'Contribución', type: 'heading', content: 'Contribución', metadata: { level: 3 }, group: 'profile' },
    { label: 'Conceptos asociados', type: 'list', content: '<ConceptLink targetId="concepto" isDependency={false}>concepto relacionado</ConceptLink>', metadata: { ordered: false }, group: 'profile' },
    { label: 'Obra', type: 'list', content: 'Obra o resultado principal', metadata: { ordered: false }, group: 'profile' },
  ],
  modelo: [
    { label: 'Estructura concreta', type: 'definition_box', content: 'Se describe el universo y las relaciones que forman el modelo.', metadata: { title: 'Estructura concreta' }, group: 'profile' },
    { label: 'Axiomas satisfechos', type: 'list', content: '<ConceptLink targetId="axioma" isDependency={false}>axioma verificado</ConceptLink>', metadata: { ordered: false }, group: 'profile' },
  ],
};

const insertSymbol = (textareaId: string, symbol: string) => {
  const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
  if (!textarea) return;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const val = textarea.value;
  const newVal = val.substring(0, start) + symbol + val.substring(end);
  textarea.value = newVal;
  textarea.focus();
  textarea.setSelectionRange(start + symbol.length, start + symbol.length);
  // Disparar evento de input para actualizar estado React
  const event = new Event('input', { bubbles: true });
  textarea.dispatchEvent(event);
};

interface PageDiagramLink {
  componentName: string;
  importSource?: string;
  path?: string;
  role: 'Simulation' | 'Diagram' | 'Inline' | 'Imported';
  targets?: DiagramTargetRegistry;
}

function normalizeDiagramImportPath(source: string): string | undefined {
  const withoutExtension = source.replace(/\.tsx$/, '');
  if (withoutExtension.startsWith('@/')) return `${withoutExtension.slice(2)}.tsx`;

  const sharedIndex = withoutExtension.indexOf('shared/diagrams/');
  if (sharedIndex >= 0) return `${withoutExtension.slice(sharedIndex)}.tsx`;

  const widgetsIndex = withoutExtension.indexOf('widgets/diagrams/');
  if (widgetsIndex >= 0) return `${withoutExtension.slice(widgetsIndex)}.tsx`;

  return undefined;
}

function findDiagramFile(files: FileNode[], componentName: string, importSource?: string): FileNode | undefined {
  const normalizedPath = importSource ? normalizeDiagramImportPath(importSource) : undefined;
  return files.find(file => (
    file.path === normalizedPath ||
    file.path.endsWith(`/${componentName}.tsx`) ||
    file.name === `${componentName}.tsx`
  ));
}

function parseMarkdownTable(content: string): string[][] {
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.startsWith('|'))
    .filter(line => !/^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$/.test(line))
    .map(line => line.replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim()));
}

export function renderFormattedText(
  text: string,
  blockId: string,
  onEditLink?: (blockId: string, rawMarkup: string, text: string, attrs: any, tag: string, e: React.MouseEvent) => void
): React.ReactNode[] | string {
  const parts = parseInlineNodes(text).map((node, index) => {
    const key = `${blockId}-${index}`;
    if (node.type === 'text') return node.value;
    if (node.type === 'bold') return <strong key={key} className="font-bold text-carbon">{node.value}</strong>;
    if (node.type === 'italic') return <em key={key} className="italic text-carbon/85">{node.value}</em>;
    if (node.type === 'inlineLatex') {
      return <KatexText key={key} text={`$${node.value}$`} className="rounded bg-ocre/5 px-1 py-0.5 text-carbon" />;
    }

    if (node.type === 'conceptLink' || node.type === 'refLink') {
      const tag = node.type === 'conceptLink' ? 'ConceptLink' : 'RefLink';
      const colorClass = node.type === 'conceptLink'
        ? 'text-salvia border-b border-dashed border-salvia/30'
        : 'text-pavo border-b border-dashed border-pavo/30';
      const targetLabel = Array.isArray(node.attrs.targetId) ? node.attrs.targetId.join(', ') : node.attrs.targetId || '';
      return (
        <span
          key={key}
          onClick={(e) => onEditLink && onEditLink(blockId, node.raw, node.value, node.attrs, tag, e)}
          className={`${colorClass} font-bold cursor-pointer hover:bg-salvia/10 px-0.5 transition-colors relative group/link`}
          title={`Vínculo a: ${targetLabel} (Click para editar)`}
        >
          {renderFormattedText(node.value, `${key}-inner`, onEditLink)}
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/link:block bg-carbon text-lienzo text-[9px] px-1.5 py-0.5 rounded shadow-md whitespace-nowrap z-30 font-sans">
            Concepto: {targetLabel || 'sin destino'}
          </span>
        </span>
      );
    }

    const color = node.attrs.color || 'salvia';
    const colorClass = `text-${color} border-b border-dashed border-${color}/30`;
    return (
      <span
        key={key}
        onClick={(e) => onEditLink && onEditLink(blockId, node.raw, node.value, node.attrs, 'InteractiveElement', e)}
        className={`${colorClass} font-bold cursor-pointer hover:bg-carbon/10 px-0.5 transition-colors relative group/link`}
        title={`Resalta en gráfico: ${node.attrs.target || ''} (Click para editar)`}
      >
        {renderFormattedText(node.value, `${key}-inner`, onEditLink)}
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover/link:block bg-carbon text-lienzo text-[9px] px-1.5 py-0.5 rounded shadow-md whitespace-nowrap z-30 font-sans">
          Resalta: {node.attrs.target || ''} ({color})
        </span>
      </span>
    );
  });

  return parts.length > 0 ? parts : text;
}

export const EditorPage: React.FC = () => {
  const {
    files,
    loading,
    currentFile,
    editorMode,
    metadata,
    imports,
    exports,
    blocks,
    rawBody,
    saving,
    dirtyState,
    validation,
    message,
    loadFileList,
    openFile,
    toggleEditorMode,
    updateRawBody,
    updateBlock,
    removeBlock,
    addBlock,
    moveBlock,
    saveCurrentFile,
    setMetadata,
    setImports,
    setExports,
    setBlocks,
    compatibility,
    compatibilityReasons
  } = useEditorCore();

  const isReadOnly = compatibility === 'read-only';

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isInspectorOpen, setIsInspectorOpen] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({
    theorems: true,
    definitions: true,
    lessons: true
  });
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);

  const CATEGORY_MAP: Record<string, string> = {
    theorems: 'Teoremas y Lemas',
    definitions: 'Definiciones',
    demonstrations: 'Demostraciones',
    lessons: 'Lecciones de Estudio',
    exercises: 'Ejercicios Prácticos',
    mathematicians: 'Biografías',
    axioms: 'Axiomas',
    'axiomatic-systems': 'Sistemas Axiomáticos',
    models: 'Modelos',
    usecases: 'Casos de Uso',
    components: 'Componentes y Diagramas'
  };

  const formatFileName = (name: string) => {
    let clean = name.replace(/\.(mdx|tsx)$/, '');
    clean = clean.replace(/^(teorema|lema|corolario|definicion|axioma|ejercicio|ejemplo|modelo)-/, '');
    clean = clean.replace(/-/g, ' ');
    return clean.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const toggleFolder = (folderKey: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderKey]: !prev[folderKey]
    }));
  };

  // Estado para el enlazador semántico
  const [linkerState, setLinkerState] = useState<{
    isOpen: boolean;
    blockId: string;
    selectedText: string;
    selectionStart: number;
    selectionEnd: number;
    editingMarkup?: string;
    editingTag?: string;
    initialAttrs?: Record<string, any>;
  }>({
    isOpen: false,
    blockId: '',
    selectedText: '',
    selectionStart: 0,
    selectionEnd: 0
  });
  const [linkerPosition, setLinkerPosition] = useState({ top: 0, left: 0 });

  // Estado para el constructor visual de diagramas
  const [diagramBuilderOpen, setDiagramBuilderOpen] = useState(false);
  const [activeDiagramBlockId, setActiveDiagramBlockId] = useState<string | null>(null);
  const [activeDiagramIndex, setActiveDiagramIndex] = useState<number | null>(null);
  const [diagramLinkedPages, setDiagramLinkedPages] = useState<FileNode[]>([]);

  const [, setLocation] = useLocation();
  const { toggleSearch } = useNavigationStore();
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  // Sincronizar el modo oscuro mediante MutationObserver
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Escuchar evento personalizado de búsqueda para abrir archivos de forma reactiva e inmediata
  useEffect(() => {
    const handleOpenConcept = (e: Event) => {
      const customEvent = e as CustomEvent<{ href: string }>;
      const queryHref = customEvent.detail.href;
      if (queryHref && files.length > 0) {
        const slug = queryHref.split('/').pop()?.toLowerCase();
        const matchedFile = files.find(f => {
          const fileSlug = f.path.split('/').pop()?.replace('.mdx', '').toLowerCase();
          return fileSlug === slug;
        });
        if (matchedFile) {
          openFile(matchedFile.path);
        }
      }
    };
    window.addEventListener('editor-open-concept', handleOpenConcept);
    return () => window.removeEventListener('editor-open-concept', handleOpenConcept);
  }, [files, openFile]);

  useEffect(() => {
    loadFileList();
  }, [loadFileList]);

  const isDiagramFile = currentFile?.endsWith('.tsx') ?? false;
  const currentDiagramName = currentFile?.split('/').pop()?.replace(/\.tsx$/, '') || '';

  useEffect(() => {
    let cancelled = false;

    const loadLinkedPages = async () => {
      if (!isDiagramFile || !currentFile || !currentDiagramName || files.length === 0) {
        setDiagramLinkedPages([]);
        return;
      }

      const diagramImportStem = currentFile.replace(/\.tsx$/, '');
      const mdxFiles = files.filter(file => file.path.endsWith('.mdx'));
      const matches: FileNode[] = [];

      await Promise.all(mdxFiles.map(async file => {
        try {
          const response = await fetch(`/api/content?path=${encodeURIComponent(file.path)}`);
          if (!response.ok) return;
          const source = await response.text();
          if (source.includes(currentDiagramName) || source.includes(diagramImportStem)) {
            matches.push(file);
          }
        } catch {
          // La relación es una ayuda visual; si una lectura falla, no bloquea el editor.
        }
      }));

      if (!cancelled) setDiagramLinkedPages(matches);
    };

    loadLinkedPages();
    return () => {
      cancelled = true;
    };
  }, [currentFile, currentDiagramName, files, isDiagramFile]);

  const handleMetadataChange = (key: string, value: any) => {
    setMetadata(prev => ({ ...prev, [key]: value }));
  };

  const handleRemoveMetadataField = (key: string) => {
    setMetadata(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  const handleAddCustomMetadataField = () => {
    const key = prompt('Introduce el nombre del nuevo campo:');
    if (key) {
      setMetadata(prev => ({ ...prev, [key]: '' }));
    }
  };

  const diagramTargets: DiagramTargetRegistry = blocks.flatMap(block => {
    if (block.type !== 'diagram') return [];
    return Array.isArray(block.metadata?.targets) ? block.metadata.targets : [];
  });
  const activeDiagramBlock = activeDiagramBlockId
    ? blocks.find(block => block.id === activeDiagramBlockId)
    : null;

  const pageDiagramLinks = useMemo<PageDiagramLink[]>(() => {
    if (!currentFile?.endsWith('.mdx')) return [];

    const links = new Map<string, PageDiagramLink>();
    const importRegex = /import\s+\{\s*([^}]+)\s*\}\s+from\s+['"]([^'"]+)['"]/g;
    let match: RegExpExecArray | null;

    while ((match = importRegex.exec(imports)) !== null) {
      const names = match[1].split(',').map(name => name.trim()).filter(Boolean);
      const importSource = match[2];
      for (const name of names) {
        const componentName = name.split(/\s+as\s+/i)[0].trim();
        if (!componentName) continue;
        const role = exports.includes(`Simulation = ${componentName}`)
          ? 'Simulation'
          : exports.includes(`Diagram = ${componentName}`)
            ? 'Diagram'
            : 'Imported';
        const diagramFile = findDiagramFile(files, componentName, importSource);
        links.set(componentName, {
          componentName,
          importSource,
          path: diagramFile?.path ?? normalizeDiagramImportPath(importSource),
          role,
        });
      }
    }

    for (const block of blocks) {
      if (block.type !== 'diagram') continue;
      const existing = links.get(block.content);
      links.set(block.content, {
        componentName: block.content,
        importSource: typeof block.metadata?.importPath === 'string' ? block.metadata.importPath : existing?.importSource,
        path: typeof block.metadata?.path === 'string' ? block.metadata.path : existing?.path,
        role: existing?.role === 'Simulation' || existing?.role === 'Diagram' ? existing.role : 'Inline',
        targets: Array.isArray(block.metadata?.targets) ? block.metadata.targets : existing?.targets,
      });
    }

    return [...links.values()].filter(link => (
      link.path?.includes('diagrams') ||
      link.role === 'Simulation' ||
      link.role === 'Diagram' ||
      link.role === 'Inline'
    ));
  }, [blocks, currentFile, exports, files, imports]);

  const getPreviewPath = () => {
    const id = String(metadata.id || '').trim();
    if (!id) return null;
    const type = String(metadata.type || '');
    if (type === 'definicion') return `/definicion/${id}`;
    if (type === 'teorema' || type === 'lema' || type === 'corolario') return `/teorema/${id}`;
    if (type === 'demostracion') return `/demo/${id}`;
    if (type === 'axioma') return `/axioma/${id}`;
    if (type === 'modelo') return `/modelo/${id}`;
    if (type === 'ejemplo') return `/ejemplo/${id}`;
    if (type === 'ejercicio') return `/ejercicio/${id}`;
    if (type === 'caso-de-uso') return `/caso/${id}`;
    if (type === 'plan-de-estudio') return `/plan/${id}`;
    return null;
  };

  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>, blockId: string) => {
    const target = e.target as HTMLTextAreaElement;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    const text = target.value.substring(start, end).trim();

    if (text.length > 0) {
      const rect = target.getBoundingClientRect();
      setLinkerPosition({
        top: rect.top + window.scrollY - 130,
        left: rect.left + window.scrollX + (target.clientWidth / 4)
      });
      setLinkerState({
        isOpen: true,
        blockId,
        selectedText: text,
        selectionStart: start,
        selectionEnd: end
      });
    }
  };

  const handleLinkCreated = (linkMarkup: string) => {
    const { blockId, selectionStart, selectionEnd, editingMarkup } = linkerState;
    if (!blockId) return;

    const block = blocks.find(b => b.id === blockId);
    if (!block) return;

    const newContent = editingMarkup
      // Reemplazar la instancia exacta del marcado viejo por el nuevo
      ? block.content.replace(editingMarkup, linkMarkup)
      : `${block.content.substring(0, selectionStart)}${linkMarkup}${block.content.substring(selectionEnd)}`;

    updateBlock(blockId, newContent);
    setLinkerState({ isOpen: false, blockId: '', selectedText: '', selectionStart: 0, selectionEnd: 0 });
  };

  const handleEditLink = (
    blockId: string,
    rawMarkup: string,
    text: string,
    attrs: any,
    tag: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation(); // Evitar click en bloque párrafo completo
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setLinkerPosition({
      top: rect.top + window.scrollY - 180,
      left: rect.left + window.scrollX + (rect.width / 2) - 160
    });
    setLinkerState({
      isOpen: true,
      blockId,
      selectedText: text,
      selectionStart: 0,
      selectionEnd: 0,
      editingMarkup: rawMarkup,
      editingTag: tag,
      initialAttrs: attrs
    });
  };

  const handleConfirmDiagram = (spec: DiagramSpec) => {
    if (currentFile?.endsWith('.tsx')) {
      updateRawBody(spec.source);
      setDiagramBuilderOpen(false);
      setActiveDiagramBlockId(null);
      setActiveDiagramIndex(null);
      return;
    }

    const importLine = `import { ${spec.componentName} } from '${spec.importPath}';`;
    setImports(prev => prev.includes(importLine) || prev.includes(spec.componentName)
      ? prev
      : `${prev.trim()}\n${importLine}`.trim()
    );

    const exportName = spec.mode === 'diagram' ? 'Diagram' : 'Simulation';
    const exportLine = `export const ${exportName} = ${spec.componentName};`;
    setExports(prev => {
      const withoutSameExport = prev
        .split('\n')
        .filter(line => !new RegExp(`^\\s*export\\s+const\\s+${exportName}\\s*=`).test(line))
        .join('\n')
        .trim();
      return `${withoutSameExport}\n${exportLine}`.trim();
    });

    setMetadata(prev => ({
      ...prev,
      hasDiagram: true,
      hasSimulation: spec.mode !== 'diagram',
      layout: String(prev.type) === 'demostracion' ? 'split' : prev.layout,
    }));

    const diagramMetadata = {
      path: spec.path,
      importPath: spec.importPath,
      targets: spec.targets,
      generatedBy: 'DiagramWorkbench',
      visualModel: spec.visualModel,
    };

    if (activeDiagramBlockId) {
      updateBlock(activeDiagramBlockId, spec.componentName, diagramMetadata);
    } else if (activeDiagramIndex !== null) {
      const newBlock: Block = {
        id: createBlockId(),
        type: 'diagram',
        content: spec.componentName,
        metadata: diagramMetadata
      };
      setBlocks(prev => {
        const updated = [...prev];
        updated.splice(activeDiagramIndex, 0, newBlock);
        return updated;
      });
    }
    setDiagramBuilderOpen(false);
    setActiveDiagramBlockId(null);
    setActiveDiagramIndex(null);
  };

  const insertInteractiveTargetParagraph = (target: { id: string; label?: string; color?: string }) => {
    const label = target.label || target.id;
    const color = target.color || 'salvia';
    const newBlock: Block = {
      id: createBlockId(),
      type: 'paragraph',
      content: `<InteractiveElement target="${target.id}" color="${color}">${label}</InteractiveElement>`,
    };
    setBlocks(prev => [...prev, newBlock]);
  };

  const insertPresetAt = (index: number, preset: BlockPreset) => {
    const newBlock: Block = {
      id: createBlockId(),
      type: preset.type,
      content: preset.content,
      metadata: preset.metadata,
    };
    setBlocks(prev => {
      const updated = [...prev];
      updated.splice(index, 0, newBlock);
      return updated;
    });
  };
  const insertPresetAtEnd = (preset: BlockPreset) => insertPresetAt(blocks.length, preset);
  const profilePresets = PAGE_PROFILE_PRESETS[String(metadata.type || '')] || [];
  const pageConnectionSummary = useMemo(() => {
    const text = blocks.map(block => block.content).join('\n');
    const conceptHighlights = [...text.matchAll(/<ConceptLink\b([^>]*?)>([\s\S]*?)<\/ConceptLink>/g)]
      .map(match => ({ attrs: parseAttributes(match[1] || ''), label: match[2].replace(/<[^>]+>/g, '').trim() }))
      .filter(item => item.attrs.highlightTarget);
    const interactiveTargets = [...text.matchAll(/<InteractiveElement\b([^>]*?)>([\s\S]*?)<\/InteractiveElement>/g)]
      .map(match => ({ attrs: parseAttributes(match[1] || ''), label: match[2].replace(/<[^>]+>/g, '').trim() }))
      .filter(item => item.attrs.target);
    const connectedTargetIds = new Set<string>([
      ...conceptHighlights.map(item => String(item.attrs.highlightTarget)),
      ...interactiveTargets.map(item => String(item.attrs.target)),
    ]);
    const missingTargets = diagramTargets.filter(target => !connectedTargetIds.has(target.id));

    return {
      connected: [
        ...conceptHighlights.map(item => ({
          target: String(item.attrs.highlightTarget),
          label: item.label,
          kind: 'concepto + diagrama',
        })),
        ...interactiveTargets.map(item => ({
          target: String(item.attrs.target),
          label: item.label,
          kind: 'diagrama',
        })),
      ],
      missingTargets,
    };
  }, [blocks, diagramTargets]);

  const applyInlineTransform = (
    block: Block,
    wrap: (selected: string) => string,
    fallback = 'texto'
  ) => {
    const active = document.activeElement as HTMLTextAreaElement | HTMLInputElement | null;
    if (!active || typeof active.selectionStart !== 'number' || typeof active.selectionEnd !== 'number') return;
    const start = active.selectionStart;
    const end = active.selectionEnd;
    const selected = active.value.substring(start, end) || fallback;
    const next = `${block.content.substring(0, start)}${wrap(selected)}${block.content.substring(end)}`;
    updateBlock(block.id, next, block.metadata);
    requestAnimationFrame(() => {
      active.focus();
      const cursor = start + wrap(selected).length;
      active.setSelectionRange(cursor, cursor);
    });
  };

  const openLinkerFromActiveSelection = (block: Block) => {
    const active = document.activeElement as HTMLTextAreaElement | HTMLInputElement | null;
    if (!active || typeof active.selectionStart !== 'number' || typeof active.selectionEnd !== 'number') return;
    const start = active.selectionStart;
    const end = active.selectionEnd;
    const text = active.value.substring(start, end).trim();
    if (!text) return;
    const rect = active.getBoundingClientRect();
    setLinkerPosition({
      top: rect.top + window.scrollY - 130,
      left: rect.left + window.scrollX + (active.clientWidth / 4)
    });
    setLinkerState({
      isOpen: true,
      blockId: block.id,
      selectedText: text,
      selectionStart: start,
      selectionEnd: end
    });
  };

  const renderInlineToolbar = (block: Block) => (
    <div className="flex flex-wrap items-center gap-1 rounded border border-carbon/10 bg-lienzo px-2 py-1 shadow-sm">
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => applyInlineTransform(block, value => `**${value}**`, 'énfasis')} className="h-6 min-w-6 rounded px-1.5 text-[10px] font-bold text-carbon hover:bg-carbon/5" title="Negrita">B</button>
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => applyInlineTransform(block, value => `*${value}*`, 'énfasis')} className="h-6 min-w-6 rounded px-1.5 text-[10px] italic text-carbon hover:bg-carbon/5" title="Cursiva">I</button>
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => applyInlineTransform(block, value => `$${value}$`, 'x')} className="h-6 rounded px-1.5 font-mono text-[10px] text-ocre hover:bg-ocre/10" title="LaTeX inline">$x$</button>
      <button type="button" onMouseDown={(event) => event.preventDefault()} onClick={() => openLinkerFromActiveSelection(block)} className="h-6 rounded px-1.5 text-[10px] font-bold text-salvia hover:bg-salvia/10" title="Conectar a concepto o diagrama">Vínculo</button>
    </div>
  );

  const renderPageDiagramPanel = () => {
    if (pageDiagramLinks.length === 0) {
      return (
        <section className="border-t border-carbon/15 p-4">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-carbon/55">Diagramas</h3>
          <div className="mt-3 rounded border border-dashed border-carbon/20 bg-carbon/5 p-3">
            <p className="text-xs italic text-carbon/55">Esta página aún no tiene diagramas enlazados.</p>
            <button
              type="button"
              onClick={() => {
                setActiveDiagramIndex(blocks.length);
                setActiveDiagramBlockId(null);
                setDiagramBuilderOpen(true);
              }}
              className="mt-3 rounded bg-pavo/10 px-3 py-1 text-[10px] font-bold text-pavo hover:bg-pavo/20"
            >
              Crear diagrama
            </button>
          </div>
        </section>
      );
    }

    return (
      <section className="border-t border-carbon/15 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-carbon/55">Diagramas de esta página</h3>
          <button
            type="button"
            onClick={() => {
              setActiveDiagramIndex(blocks.length);
              setActiveDiagramBlockId(null);
              setDiagramBuilderOpen(true);
            }}
            className="rounded bg-pavo/10 px-2 py-1 text-[9px] font-bold text-pavo hover:bg-pavo/20"
          >
            Añadir
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {pageDiagramLinks.map(link => (
            <div key={`${link.componentName}-${link.path || link.importSource}`} className="rounded border border-carbon/10 bg-carbon/5 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-serif text-xs font-bold text-carbon">{link.componentName}</p>
                  <p className="mt-1 truncate font-mono text-[9px] text-carbon/45">{link.path || link.importSource || 'Sin archivo detectado'}</p>
                </div>
                <span className="rounded bg-salvia/10 px-1.5 py-0.5 text-[9px] font-bold text-salvia">{link.role}</span>
              </div>
              {link.targets && link.targets.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {link.targets.slice(0, 6).map(target => (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => insertInteractiveTargetParagraph(target)}
                      className="rounded border border-carbon/10 bg-lienzo px-1.5 py-0.5 font-mono text-[9px] text-carbon/60 hover:border-salvia/30 hover:text-salvia"
                      title={`Insertar texto interactivo para ${target.label}`}
                    >
                      {target.id}
                    </button>
                  ))}
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  disabled={!link.path}
                  onClick={() => link.path && openFile(link.path)}
                  className="rounded border border-carbon/20 px-2 py-1 text-[10px] font-bold text-carbon/60 hover:bg-carbon/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Abrir TSX
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const block = blocks.find(item => item.type === 'diagram' && item.content === link.componentName);
                    setActiveDiagramBlockId(block?.id ?? null);
                    setActiveDiagramIndex(block ? null : blocks.length);
                    setDiagramBuilderOpen(true);
                  }}
                  className="rounded bg-salvia/10 px-2 py-1 text-[10px] font-bold text-salvia hover:bg-salvia/20"
                >
                  Reemplazar
                </button>
              </div>
            </div>
          ))}
        </div>
        {(pageConnectionSummary.connected.length > 0 || pageConnectionSummary.missingTargets.length > 0) && (
          <div className="mt-4 rounded border border-carbon/10 bg-carbon/5 p-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-carbon/50">Conexiones texto-diagrama</h4>
            {pageConnectionSummary.connected.length > 0 && (
              <div className="mt-2 space-y-1">
                {pageConnectionSummary.connected.slice(0, 8).map((connection, index) => (
                  <div key={`${connection.target}-${index}`} className="flex items-center justify-between gap-2 rounded bg-lienzo px-2 py-1 text-[10px]">
                    <span className="truncate font-serif font-bold text-carbon">{connection.label || connection.target}</span>
                    <span className="shrink-0 font-mono text-[9px] text-salvia">{connection.target}</span>
                  </div>
                ))}
              </div>
            )}
            {pageConnectionSummary.missingTargets.length > 0 && (
              <div className="mt-3">
                <p className="text-[10px] italic text-carbon/50">Targets del diagrama aún sin mención conectada:</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {pageConnectionSummary.missingTargets.slice(0, 10).map(target => (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => insertInteractiveTargetParagraph(target)}
                      className="rounded border border-carbon/10 bg-lienzo px-1.5 py-0.5 font-mono text-[9px] text-carbon/60 hover:border-salvia/30 hover:text-salvia"
                      title={`Insertar referencia interactiva para ${target.label}`}
                    >
                      {target.id}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    );
  };

  const renderDiagramSourcePanel = () => (
    <div className="w-80 shrink-0 overflow-hidden border-l border-carbon/15 bg-lienzo">
      <div className="border-b border-carbon/15 bg-carbon/5 p-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-carbon/60">Diagrama TSX</h3>
        <p className="mt-1 font-mono text-[10px] text-carbon/45">{currentFile}</p>
      </div>
      <section className="p-4">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-carbon/55">Páginas conectadas</h4>
        {diagramLinkedPages.length === 0 ? (
          <p className="mt-3 rounded border border-dashed border-carbon/20 bg-carbon/5 p-3 text-xs italic text-carbon/55">
            No se ha encontrado ninguna página MDX que importe este diagrama.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {diagramLinkedPages.map(page => (
              <button
                key={page.path}
                type="button"
                onClick={() => openFile(page.path)}
                className="block w-full rounded border border-carbon/10 bg-carbon/5 px-3 py-2 text-left hover:border-salvia/30 hover:bg-salvia/5"
              >
                <span className="block truncate font-serif text-xs font-bold text-carbon">{formatFileName(page.name)}</span>
                <span className="mt-1 block truncate font-mono text-[9px] text-carbon/45">{page.path}</span>
              </button>
            ))}
          </div>
        )}
      </section>
      <section className="border-t border-carbon/15 p-4">
        <button
          type="button"
          onClick={() => {
            setActiveDiagramBlockId(null);
            setActiveDiagramIndex(null);
            setDiagramBuilderOpen(true);
          }}
          className="mb-3 w-full rounded bg-salvia/10 px-3 py-2 text-xs font-bold text-salvia hover:bg-salvia/20"
        >
          Editar visualmente
        </button>
        <p className="text-xs italic text-carbon/55">
          Si el archivo contiene un modelo generado por el editor, se reabrirá en modo visual. Si es manual, se conserva como TSX avanzado.
        </p>
      </section>
    </div>
  );

  // Componente del Editor de Bloques Visuales
  const renderVisualBlocks = () => {
    const showStatement = ['teorema', 'lema', 'corolario', 'definicion', 'axioma'].includes(String(metadata.type));

    const renderHeader = () => {
      if (!currentFile) return null;
      return (
        <div className="mb-8 pb-6 border-b border-carbon/15 space-y-4">
          <div>
            <span className="text-[10px] uppercase tracking-widest font-bold text-salvia">
              {String(metadata.type || 'Concepto')}
            </span>
            <textarea
              value={String(metadata.title || '')}
              disabled={isReadOnly}
              onChange={(e) => handleMetadataChange('title', e.target.value)}
              className="w-full bg-transparent border-none outline-none font-serif font-bold text-3xl text-carbon p-0 mt-1 resize-none focus:ring-0 placeholder-carbon/20"
              placeholder="Título del Concepto"
              rows={1}
              style={{ height: 'auto' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
            <textarea
              value={String(metadata.description || '')}
              disabled={isReadOnly}
              onChange={(e) => handleMetadataChange('description', e.target.value)}
              className="w-full bg-transparent border-none outline-none font-serif italic text-base text-carbon/70 p-0 mt-2 resize-none focus:ring-0 placeholder-carbon/30"
              placeholder="Añada una breve descripción motivacional..."
              rows={2}
              style={{ height: 'auto' }}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = 'auto';
                target.style.height = `${target.scrollHeight}px`;
              }}
            />
          </div>

          {showStatement && (
            <div className="p-4 border-l-4 border-ocre/50 bg-ocre/5 rounded-r space-y-2">
              <div className="flex justify-between items-center select-none">
                <div className="text-[9px] uppercase tracking-widest font-bold text-ocre/70">Enunciado Formal</div>
                <div className="flex gap-1 items-center">
                  <span className="text-[8px] font-sans text-carbon/40 uppercase mr-1">Insertar:</span>
                  {LATEX_SYMBOLS.map(sym => (
                    <button
                      key={sym.label}
                      type="button"
                      onClick={() => insertSymbol('statement-editor', sym.code)}
                      className="px-1 bg-carbon/5 hover:bg-carbon/10 text-carbon text-[9px] rounded font-mono transition-colors"
                    >
                      {sym.label}
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                id="statement-editor"
                value={String(metadata.statement || '')}
                onChange={(e) => handleMetadataChange('statement', e.target.value)}
                className="w-full bg-transparent border-none outline-none font-serif text-sm text-carbon leading-relaxed p-0 resize-none focus:ring-0 placeholder-carbon/30"
                placeholder="Escriba el enunciado formal o definición exacta..."
                rows={2}
                style={{ height: 'auto' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
            </div>
          )}
        </div>
      );
    };

    if (blocks.length === 0) {
      return (
        <div className="max-w-2xl mx-auto py-8">
          {renderHeader()}
          <div className="flex flex-col items-center justify-center h-64 border border-dashed border-carbon/25 rounded p-8 text-center bg-carbon/5">
            <p className="text-sm font-serif italic text-carbon/60">El documento está vacío. Añada contenido.</p>
            <button
              onClick={() => addBlock(0, 'paragraph')}
              className="mt-4 px-4 py-1.5 bg-salvia text-lienzo rounded text-xs font-serif font-bold hover:bg-salvia/80 transition-all shadow-sm"
            >
              Añadir Párrafo
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 max-w-2xl mx-auto py-8 font-serif">
        {renderHeader()}

        {blocks.map((block, index) => {
          const isFirstParagraph = index === blocks.findIndex(b => b.type === 'paragraph');
          return (
            <div key={block.id} className="relative group/block bg-transparent border border-transparent hover:bg-carbon/5 hover:border-carbon/15 rounded p-3 transition-all">
              {/* Controles de orden y eliminación del bloque */}
              {!isReadOnly && (
                <div className="absolute -left-12 top-2 flex flex-col items-center gap-1 opacity-0 group-hover/block:opacity-100 transition-opacity">
                  <button
                    disabled={index === 0}
                    onClick={() => moveBlock(index, index - 1)}
                    className="w-6 h-6 flex items-center justify-center bg-lienzo border border-carbon/20 rounded hover:bg-carbon/5 text-[10px] text-carbon disabled:opacity-30"
                    title="Subir Bloque"
                  >
                    ↑
                  </button>
                  <button
                    disabled={index === blocks.length - 1}
                    onClick={() => moveBlock(index, index + 1)}
                    className="w-6 h-6 flex items-center justify-center bg-lienzo border border-carbon/20 rounded hover:bg-carbon/5 text-[10px] text-carbon disabled:opacity-30"
                    title="Bajar Bloque"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeBlock(block.id)}
                    className="w-6 h-6 flex items-center justify-center bg-terracota text-lienzo rounded hover:bg-terracota/80 text-[10px] mt-2"
                    title="Eliminar Bloque"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Renderizado condicional según el tipo de bloque */}
              {block.type === 'paragraph' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">Párrafo</label>
                    <span className="text-[8px] text-carbon/30 italic font-sans">
                      {editingBlockId === block.id ? 'Subraye texto para vincular concepto' : 'Haga clic para editar'}
                    </span>
                  </div>
                  {editingBlockId === block.id ? (
                    <div className="space-y-2">
                      {renderInlineToolbar(block)}
                      <textarea
                        autoFocus
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        onSelect={(e) => handleTextareaSelect(e, block.id)}
                        onBlur={() => setEditingBlockId(null)}
                        className="w-full bg-transparent resize-none focus:outline-none text-base leading-relaxed text-carbon font-serif min-h-[40px] focus:ring-0 p-0"
                        placeholder="Escriba prosa explicativa o notas aquí..."
                        style={{ height: 'auto' }}
                        onInput={(e) => {
                          const target = e.target as HTMLTextAreaElement;
                          target.style.height = 'auto';
                          target.style.height = `${target.scrollHeight}px`;
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => !isReadOnly && setEditingBlockId(block.id)}
                      className="w-full text-base leading-relaxed text-carbon font-serif cursor-text py-1 select-text"
                    >
                      {isFirstParagraph ? (
                        <>
                          <span className="float-left text-5xl font-serif font-bold text-salvia mr-2 leading-none mt-1 select-none">
                            {block.content.charAt(0).toUpperCase()}
                          </span>
                          {renderFormattedText(block.content.substring(1), block.id, handleEditLink) || (
                            <span className="text-carbon/25 italic">Escriba prosa explicativa o notas aquí...</span>
                          )}
                        </>
                      ) : (
                        renderFormattedText(block.content, block.id, handleEditLink) || (
                          <span className="text-carbon/25 italic">Escriba prosa explicativa o notas aquí...</span>
                        )
                      )}
                    </div>
                  )}
                </div>
              )}

              {block.type === 'heading' && (
                <div className="space-y-1 py-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">Título</label>
                    <span className="text-[8px] text-carbon/30 italic font-sans">Haga clic para editar</span>
                  </div>
                  {editingBlockId === block.id ? (
                    <input
                      autoFocus
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      onBlur={() => setEditingBlockId(null)}
                      placeholder="Escriba el título de sección..."
                      className="w-full bg-transparent border-none outline-none font-serif font-bold text-xl text-carbon p-0 focus:ring-0"
                    />
                  ) : (
                    <h3
                      onClick={() => !isReadOnly && setEditingBlockId(block.id)}
                      className={`font-serif font-bold text-carbon mt-1 cursor-text ${
                        block.metadata?.level === 2 ? 'text-2xl border-b border-carbon/15 pb-2' : 'text-xl'
                      }`}
                    >
                      {block.content || <span className="text-carbon/25 italic">Título de sección...</span>}
                    </h3>
                  )}
                </div>
              )}

              {block.type === 'list' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">Lista</label>
                    <label className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-widest text-carbon/35">
                      Numerada
                      <input
                        type="checkbox"
                        checked={block.metadata?.ordered === true}
                        onChange={(event) => updateBlock(block.id, block.content, { ...block.metadata, ordered: event.target.checked })}
                      />
                    </label>
                  </div>
                  {editingBlockId === block.id ? (
                    <div className="space-y-2">
                      {renderInlineToolbar(block)}
                      <textarea
                        autoFocus
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        onSelect={(e) => handleTextareaSelect(e, block.id)}
                        onBlur={() => setEditingBlockId(null)}
                        className="min-h-24 w-full resize-none rounded border border-carbon/15 bg-carbon/5 p-3 text-sm leading-relaxed text-carbon outline-none focus:border-salvia"
                        placeholder="Un elemento por línea..."
                      />
                    </div>
                  ) : (
                    <div onClick={() => setEditingBlockId(block.id)} className="cursor-text rounded border border-carbon/10 bg-carbon/5 p-4">
                      {block.metadata?.ordered === true ? (
                        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed text-carbon">
                          {block.content.split('\n').filter(Boolean).map((item, itemIndex) => (
                            <li key={`${block.id}-${itemIndex}`}>{renderFormattedText(item, block.id, handleEditLink)}</li>
                          ))}
                        </ol>
                      ) : (
                        <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-carbon">
                          {block.content.split('\n').filter(Boolean).map((item, itemIndex) => (
                            <li key={`${block.id}-${itemIndex}`}>{renderFormattedText(item, block.id, handleEditLink)}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              )}

              {block.type === 'table' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">Tabla</label>
                    <span className="text-[8px] text-carbon/30 italic font-sans">Haga clic para editar Markdown de tabla</span>
                  </div>
                  {editingBlockId === block.id ? (
                    <div className="space-y-2">
                      {renderInlineToolbar(block)}
                      <textarea
                        autoFocus
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        onSelect={(e) => handleTextareaSelect(e, block.id)}
                        onBlur={() => setEditingBlockId(null)}
                        className="min-h-32 w-full resize-none rounded border border-carbon/15 bg-carbon/5 p-3 font-mono text-xs leading-relaxed text-carbon outline-none focus:border-salvia"
                        placeholder="| Columna | Valor |\n|---|---|\n| a | $1$ |"
                      />
                    </div>
                  ) : (
                    <div onClick={() => setEditingBlockId(block.id)} className="overflow-x-auto rounded border border-carbon/15 bg-lienzo cursor-text">
                      <table className="w-full border-collapse text-sm text-carbon">
                        <tbody>
                          {parseMarkdownTable(block.content).map((row, rowIndex) => (
                            <tr key={`${block.id}-${rowIndex}`} className={rowIndex === 0 ? 'bg-carbon/5' : 'border-t border-carbon/10'}>
                              {row.map((cell, cellIndex) => {
                                const Cell = rowIndex === 0 ? 'th' : 'td';
                                return (
                                  <Cell key={`${block.id}-${rowIndex}-${cellIndex}`} className="px-3 py-2 text-left align-top">
                                    {renderFormattedText(cell, block.id, handleEditLink)}
                                  </Cell>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {block.type === 'separator' && (
                <div className="py-2 select-none">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">Separador</label>
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-carbon/15 to-transparent my-4" />
                </div>
              )}

              {block.type === 'note' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans font-serif">Nota</label>
                    <span className="text-[8px] text-carbon/30 italic font-sans">Haga clic para editar</span>
                  </div>
                  {editingBlockId === block.id ? (
                    <div className="space-y-2">
                      {renderInlineToolbar(block)}
                      <div className="p-4 bg-carbon/5 border-l-4 border-carbon/40 rounded-r">
                        <textarea
                          autoFocus
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, e.target.value)}
                          onSelect={(e) => handleTextareaSelect(e, block.id)}
                          onBlur={() => setEditingBlockId(null)}
                          className="w-full bg-transparent border-none outline-none font-serif text-sm text-carbon leading-relaxed p-0 resize-none focus:ring-0 min-h-[40px]"
                          placeholder="Escriba la nota aclaratoria..."
                        />
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setEditingBlockId(block.id)}
                      className="p-4 bg-carbon/5 border-l-4 border-carbon/40 rounded-r font-serif text-sm text-carbon leading-relaxed cursor-text italic"
                    >
                      {renderFormattedText(block.content, block.id, handleEditLink) || <span className="text-carbon/25 italic">Escriba una nota aclaratoria aquí...</span>}
                    </div>
                  )}
                </div>
              )}

              {block.type === 'citation' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">Cita</label>
                    <span className="text-[8px] text-carbon/30 italic font-sans">Haga clic para editar</span>
                  </div>
                  {editingBlockId === block.id ? (
                    <div className="py-3 px-5 border-l-2 border-salvia/30 bg-salvia/5 rounded-r space-y-2">
                      {renderInlineToolbar(block)}
                      <textarea
                        autoFocus
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        onSelect={(e) => handleTextareaSelect(e, block.id)}
                        className="w-full bg-transparent border-none outline-none font-serif italic text-sm text-carbon p-0 resize-none focus:ring-0"
                        placeholder="Texto de la cita..."
                      />
                      <input
                        value={block.metadata?.author || ''}
                        onChange={(e) => updateBlock(block.id, block.content, { author: e.target.value })}
                        onBlur={() => setEditingBlockId(null)}
                        className="w-full bg-transparent border-none outline-none text-[10px] font-sans text-carbon/60 p-0 focus:ring-0 text-right"
                        placeholder="Autor de la cita..."
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => setEditingBlockId(block.id)}
                      className="py-4 px-6 border-l-2 border-salvia/30 italic text-carbon/85 font-serif text-sm leading-relaxed cursor-text relative"
                    >
                      <p>"{renderFormattedText(block.content, block.id, handleEditLink) || 'Escriba la cita aquí...'}"</p>
                      {block.metadata?.author && (
                        <p className="text-right text-[10px] text-carbon/50 not-italic mt-1">— {block.metadata.author}</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {block.type === 'definition_box' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">Definición Inline</label>
                    <span className="text-[8px] text-carbon/30 italic font-sans">Haga clic para editar</span>
                  </div>
                  {editingBlockId === block.id ? (
                    <div className="p-4 border border-salvia/20 bg-salvia/5 rounded-sm space-y-2">
                      <input
                        value={block.metadata?.title || ''}
                        onChange={(e) => updateBlock(block.id, block.content, { title: e.target.value })}
                        className="w-full bg-transparent border-none outline-none text-xs font-serif font-bold text-salvia p-0 focus:ring-0"
                        placeholder="Título de la definición..."
                      />
                      {renderInlineToolbar(block)}
                      <textarea
                        autoFocus
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        onSelect={(e) => handleTextareaSelect(e, block.id)}
                        onBlur={() => setEditingBlockId(null)}
                        className="w-full bg-transparent border-none outline-none font-serif text-sm text-carbon p-0 resize-none focus:ring-0"
                        placeholder="Escriba la definición formal..."
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => setEditingBlockId(block.id)}
                      className="p-4 border border-salvia/20 bg-salvia/5 rounded-sm font-serif text-sm text-carbon cursor-text"
                    >
                      <div className="text-[10px] uppercase font-bold text-salvia tracking-widest mb-1 select-none">
                        Definición: {block.metadata?.title || 'Sin Título'}
                      </div>
                      <div>{renderFormattedText(block.content, block.id, handleEditLink) || <span className="text-carbon/25 italic">Cuerpo de la definición...</span>}</div>
                    </div>
                  )}
                </div>
              )}

              {block.type === 'formula' && (
                <div className="space-y-1">
                  <div className="flex justify-between items-center opacity-0 group-hover/block:opacity-100 transition-opacity select-none">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">Fórmula Destacada</label>
                    <div className="flex gap-1 items-center">
                      <span className="text-[8px] font-sans text-carbon/40 uppercase mr-1">Insertar:</span>
                      {LATEX_SYMBOLS.map(sym => (
                        <button
                          key={sym.label}
                          type="button"
                          onClick={() => insertSymbol('formula-editor-' + block.id, sym.code)}
                          className="px-1 bg-carbon/5 hover:bg-carbon/10 text-carbon text-[9px] rounded font-mono transition-colors"
                        >
                          {sym.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <FormulaBlock
                    id={'formula-editor-' + block.id}
                    content={block.content}
                    onChange={(newContent) => updateBlock(block.id, newContent)}
                  />
                </div>
              )}

              {block.type === 'demonstration' && (
                <DemonstrationBlock
                  steps={block.metadata?.steps || []}
                  diagramTargets={diagramTargets}
                  onChange={(updatedSteps) => updateBlock(block.id, '', { steps: updatedSteps })}
                />
              )}

              {block.type === 'exercise' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-carbon/10 pb-1 opacity-0 group-hover/block:opacity-100 transition-opacity">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">
                      Paso de ejercicio interactivo
                    </label>
                    <span className="font-mono text-[9px] text-carbon/35">{block.metadata?.id || 'sin-id'}</span>
                  </div>
                  <div className="rounded border border-ocre/20 bg-ocre/5 p-4">
                    <div className="mb-3 grid gap-2 sm:grid-cols-3">
                      <input
                        value={block.metadata?.id || ''}
                        onChange={(e) => updateBlock(block.id, block.content, { ...block.metadata, id: e.target.value })}
                        className="rounded border border-carbon/15 bg-lienzo px-2 py-1 text-xs text-carbon outline-none focus:border-ocre"
                        placeholder="id del paso"
                      />
                      <input
                        type="number"
                        value={block.metadata?.numero || 1}
                        onChange={(e) => updateBlock(block.id, block.content, { ...block.metadata, numero: Number(e.target.value) || 1 })}
                        className="rounded border border-carbon/15 bg-lienzo px-2 py-1 text-xs text-carbon outline-none focus:border-ocre"
                        placeholder="número"
                      />
                      <input
                        value={block.metadata?.titulo || ''}
                        onChange={(e) => updateBlock(block.id, block.content, { ...block.metadata, titulo: e.target.value })}
                        className="rounded border border-carbon/15 bg-lienzo px-2 py-1 text-xs text-carbon outline-none focus:border-ocre"
                        placeholder="título del paso"
                      />
                    </div>
                    {editingBlockId === block.id ? (
                      <div className="space-y-2">
                        {renderInlineToolbar(block)}
                        <textarea
                          autoFocus
                          value={block.content}
                          onChange={(e) => updateBlock(block.id, e.target.value)}
                          onSelect={(e) => handleTextareaSelect(e, block.id)}
                          onBlur={() => setEditingBlockId(null)}
                          className="min-h-56 w-full resize-y rounded border border-carbon/15 bg-lienzo p-3 font-mono text-xs leading-relaxed text-carbon outline-none focus:border-ocre"
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingBlockId(block.id)}
                        className="block w-full rounded border border-dashed border-carbon/15 bg-lienzo/70 p-3 text-left font-serif text-sm leading-relaxed text-carbon hover:border-ocre/30"
                      >
                        <span className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-ocre/75">
                          {block.metadata?.titulo || 'Paso interactivo'}
                        </span>
                        <span className="line-clamp-6 whitespace-pre-wrap">{renderFormattedText(block.content, block.id, handleEditLink)}</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {block.type === 'advancedMdx' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-carbon/10 pb-1 opacity-0 group-hover/block:opacity-100 transition-opacity">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">
                      Componente MDX avanzado
                    </label>
                    <span className="font-mono text-[9px] text-carbon/35">{block.metadata?.component || 'MDX'}</span>
                  </div>
                  <div className="rounded border border-pavo/20 bg-pavo/5 p-4">
                    <p className="mb-3 text-xs italic text-carbon/55">
                      Este componente se conserva como MDX válido. Puede editarse aquí o ajustarse con más precisión en código fuente.
                    </p>
                    <textarea
                      value={block.content}
                      onChange={(e) => updateBlock(block.id, e.target.value)}
                      onSelect={(e) => handleTextareaSelect(e, block.id)}
                      className="min-h-32 w-full resize-y rounded border border-carbon/15 bg-lienzo p-3 font-mono text-xs leading-relaxed text-carbon outline-none focus:border-pavo"
                    />
                  </div>
                </div>
              )}

              {block.type === 'diagram' && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b border-carbon/10 pb-1 opacity-0 group-hover/block:opacity-100 transition-opacity">
                    <label className="block text-[8px] font-bold text-carbon/40 uppercase tracking-widest font-sans">
                      Diagrama canónico ({block.content})
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveDiagramBlockId(block.id);
                        setActiveDiagramIndex(null);
                        setDiagramBuilderOpen(true);
                      }}
                      className="text-[9px] bg-salvia/10 text-salvia hover:bg-salvia/20 px-2 py-0.5 rounded font-serif font-bold transition-all"
                    >
                      Reemplazar
                    </button>
                  </div>
                  <div className="rounded border border-carbon/15 bg-carbon/5 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-serif text-sm font-bold text-carbon">{block.content}</p>
                        <p className="mt-1 font-mono text-[10px] text-carbon/50">{block.metadata?.path || 'Diagrama heredado sin archivo asociado'}</p>
                      </div>
                      <span className="rounded bg-salvia/10 px-2 py-1 text-[10px] font-bold text-salvia">shared/diagrams</span>
                    </div>
                    {Array.isArray(block.metadata?.targets) && block.metadata.targets.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {block.metadata.targets.map((target: { id: string; label: string }) => (
                          <span key={target.id} className="rounded border border-carbon/10 bg-lienzo px-2 py-0.5 font-mono text-[10px] text-carbon/65" title={target.label}>
                            {target.id}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Botón flotante para insertar bloque debajo */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover/block:opacity-100 transition-opacity z-10 flex gap-1 bg-lienzo border border-carbon/25 rounded-full p-1 shadow-sm shrink-0 whitespace-nowrap">
                <button
                  onClick={() => addBlock(index + 1, 'paragraph')}
                  className="px-2 py-0.5 text-[8px] font-bold text-salvia hover:bg-salvia/10 rounded-full font-serif"
                >
                  + Párrafo
                </button>
                <button
                  onClick={() => addBlock(index + 1, 'heading')}
                  className="px-2 py-0.5 text-[8px] font-bold text-pizarra hover:bg-pizarra/10 rounded-full font-serif"
                >
                  + Título
                </button>
                <button
                  onClick={() => addBlock(index + 1, 'list')}
                  className="px-2 py-0.5 text-[8px] font-bold text-pavo hover:bg-pavo/10 rounded-full font-serif"
                >
                  + Lista
                </button>
                <button
                  onClick={() => addBlock(index + 1, 'table')}
                  className="px-2 py-0.5 text-[8px] font-bold text-ocre hover:bg-ocre/10 rounded-full font-serif"
                >
                  + Tabla
                </button>
                <button
                  onClick={() => addBlock(index + 1, 'formula')}
                  className="px-2 py-0.5 text-[8px] font-bold text-ocre hover:bg-ocre/10 rounded-full font-serif"
                >
                  + Fórmula
                </button>
                <button
                  onClick={() => addBlock(index + 1, 'separator')}
                  className="px-2 py-0.5 text-[8px] font-bold text-carbon hover:bg-carbon/10 rounded-full font-serif"
                >
                  + Separador
                </button>
                <button
                  onClick={() => addBlock(index + 1, 'note')}
                  className="px-2 py-0.5 text-[8px] font-bold text-ocre hover:bg-ocre/10 rounded-full font-serif"
                >
                  + Nota
                </button>
                <button
                  onClick={() => addBlock(index + 1, 'citation')}
                  className="px-2 py-0.5 text-[8px] font-bold text-salvia hover:bg-salvia/10 rounded-full font-serif"
                >
                  + Cita
                </button>
                <button
                  onClick={() => addBlock(index + 1, 'definition_box')}
                  className="px-2 py-0.5 text-[8px] font-bold text-terracota hover:bg-terracota/10 rounded-full font-serif"
                >
                  + Def Inline
                </button>
                <button
                  onClick={() => addBlock(index + 1, 'demonstration')}
                  className="px-2 py-0.5 text-[8px] font-bold text-terracota hover:bg-terracota/10 rounded-full font-serif"
                >
                  + Demo
                </button>
                <button
                  onClick={() => {
                    setActiveDiagramIndex(index + 1);
                    setActiveDiagramBlockId(null);
                    setDiagramBuilderOpen(true);
                  }}
                  className="px-2 py-0.5 text-[8px] font-bold text-pavo hover:bg-pavo/10 rounded-full font-serif"
                >
                  + Diagrama
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-lienzo text-carbon font-sans overflow-hidden transition-colors duration-200">
      {/* SIDEBAR IZQUIERDO: Navegador de Archivos Organizado en Carpetas */}
      {isSidebarOpen && (
        <div className="w-64 bg-lienzo border-r border-carbon/15 flex flex-col shrink-0">
          <div className="p-4 border-b border-carbon/15 flex justify-between items-center bg-carbon/5">
            <h2 className="text-xs font-serif font-bold tracking-wider uppercase text-carbon/70">Documentos</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="text-xs text-carbon/40 hover:text-carbon font-bold">Ocultar</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {files.length === 0 ? (
              <p className="text-xs italic text-carbon/40 p-4 font-serif">Cargando biblioteca...</p>
            ) : (
              Object.entries(
                files.reduce<Record<string, typeof files>>((acc, file) => {
                  const type = file.type || 'others';
                  if (!acc[type]) acc[type] = [];
                  acc[type].push(file);
                  return acc;
                }, {})
              ).map(([folderKey, folderFiles]) => {
                const isExpanded = !!expandedFolders[folderKey];
                const folderLabel = CATEGORY_MAP[folderKey] || folderKey.charAt(0).toUpperCase() + folderKey.slice(1);

                return (
                  <div key={folderKey} className="space-y-1">
                    <button
                      onClick={() => toggleFolder(folderKey)}
                      className="w-full flex items-center justify-between px-2 py-1.5 rounded-sm hover:bg-carbon/5 text-xs text-carbon font-serif font-bold transition-all text-left"
                    >
                      <span>{folderLabel}</span>
                      <span className="text-[10px] text-carbon/30 font-mono">{isExpanded ? '▾' : '▸'}</span>
                    </button>

                    {isExpanded && (
                      <div className="pl-3 border-l border-carbon/10 space-y-0.5 ml-1 animate-in fade-in slide-in-from-top-1 duration-100">
                        {folderFiles.map(file => (
                          <button
                            key={file.path}
                            onClick={() => openFile(file.path)}
                            className={`w-full text-left px-2 py-1 rounded text-xs transition-all truncate block ${
                              currentFile === file.path
                                ? 'text-salvia font-serif font-bold bg-salvia/5 border-l border-salvia pl-3'
                                : 'hover:bg-carbon/5 text-carbon/60 hover:text-carbon'
                            }`}
                          >
                            {formatFileName(file.name)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ÁREA PRINCIPAL: Editor */}
      <div className="flex-1 flex flex-col h-full bg-lienzo relative overflow-hidden">
        {/* Cabecera del Editor */}
        <div className="h-14 bg-lienzo border-b border-carbon/15 flex justify-between items-center px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-1 text-carbon/50 hover:text-carbon text-sm mr-2"
                title="Mostrar archivos"
              >
                ▸
              </button>
            )}
            <div>
              <h1 className="text-sm font-serif font-bold text-carbon">
                {currentFile ? currentFile.split('/').pop() : 'Seleccionar Archivo'}
              </h1>
              <p className="text-[10px] text-carbon/40 font-serif italic">
                {saving ? 'Guardando...' : message || (dirtyState === 'clean' ? 'Archivo sin cambios pendientes' : 'Borrador local actualizado')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {currentFile && (
              <>
                {!isDiagramFile ? (
                  <div className="flex bg-carbon/5 border border-carbon/15 rounded-sm p-0.5">
                    <button
                      onClick={() => editorMode === 'code' && toggleEditorMode()}
                      className={`px-3 py-1 text-xs rounded-sm transition-all font-bold font-serif ${
                        editorMode === 'visual'
                          ? 'bg-lienzo text-carbon shadow-sm'
                          : 'text-carbon/60 hover:text-carbon'
                      }`}
                    >
                      Modo Visual (Experimental)
                    </button>
                    <button
                      onClick={() => editorMode === 'visual' && toggleEditorMode()}
                      className={`px-3 py-1 text-xs rounded-sm transition-all font-bold font-serif ${
                        editorMode === 'code'
                          ? 'bg-lienzo text-carbon shadow-sm'
                          : 'text-carbon/60 hover:text-carbon'
                      }`}
                    >
                      Código Fuente
                    </button>
                  </div>
                ) : (
                  <span className="rounded border border-pavo/20 bg-pavo/10 px-3 py-1 text-xs font-serif font-bold text-pavo">
                    Diagrama TSX
                  </span>
                )}

                <div className={`text-[10px] font-bold uppercase tracking-wider ${validation.canSave ? 'text-salvia' : 'text-granada'}`}>
                  {validation.canSave ? `${validation.warningCount} avisos` : `${validation.errorCount} errores`}
                </div>

                <button
                  type="button"
                  onClick={() => saveCurrentFile()}
                  disabled={saving || !validation.canSave}
                  className="rounded bg-salvia px-3 py-1 text-xs font-serif font-bold text-lienzo shadow-sm transition-colors hover:bg-salvia/80 disabled:cursor-not-allowed disabled:opacity-40"
                  title={isDiagramFile ? 'Guardar el archivo TSX del diagrama' : validation.canSave ? 'Guardar en el archivo real' : 'Corrige los errores críticos para poder aplicar'}
                >
                  {isDiagramFile ? 'Guardar TSX' : 'Guardar'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const previewPath = getPreviewPath();
                    if (previewPath) setLocation(routePath(previewPath));
                  }}
                  disabled={isDiagramFile || !getPreviewPath()}
                  className="rounded border border-carbon/25 px-3 py-1 text-xs font-serif font-bold text-carbon transition-colors hover:bg-carbon/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Ver como estudiante
                </button>

                {/* Toggle del Panel Lateral Derecho */}
                {!isDiagramFile && (
                  <button
                    onClick={() => setIsInspectorOpen(!isInspectorOpen)}
                    className="text-xs border border-carbon/25 px-3 py-1 rounded-sm hover:bg-carbon/5 text-carbon font-serif font-bold transition-all"
                  >
                    {isInspectorOpen ? 'Ocultar Metadatos' : 'Mostrar Metadatos'}
                  </button>
                )}
              </>
            )}

            {/* Controles de Navegación y Tema Global del Editor */}
            <div className="flex items-center gap-2 border-l border-carbon/15 pl-4">
              <Link
                href={routePath('/')}
                className="w-12 h-12 flex items-center justify-center elegant-panel text-carbon"
                title="Volver a la Biblioteca"
              >
                <Logo className="w-8 h-8" />
              </Link>
              <button
                onClick={toggleSearch}
                className="w-12 h-12 flex items-center justify-center elegant-panel text-carbon"
                title="Buscar (Cmd + K)"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Zona de Edición */}
        <div className="flex-1 flex overflow-hidden">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center italic text-carbon/50 font-serif">
              <span>Cargando contenido...</span>
            </div>
          ) : !currentFile ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-carbon/5">
              <h3 className="text-lg font-serif font-bold text-carbon">Editor del Archivo</h3>
              <p className="text-xs text-carbon/50 max-w-sm mt-2 font-serif italic">
                Seleccione un documento en el panel izquierdo para comenzar a editar.
              </p>
            </div>
          ) : (
            <>
              {/* PANEL CENTRAL: Editor Híbrido */}
              <div className="flex-1 overflow-y-auto p-8">
                {!isDiagramFile && (
                  <div className="mx-auto mb-4 max-w-3xl space-y-2">
                    {editorMode === 'visual' && (
                      <div className="rounded border border-ocre/30 bg-ocre/5 p-3 text-xs text-carbon shadow-sm">
                        <span className="font-bold text-ocre">⚠️ Modo Visual Experimental:</span> El guardado visual y el autoguardado de borrador están desactivados temporalmente por seguridad. Puedes previsualizar y editar bloques visualmente, pero para aplicar y guardar tus cambios de forma segura en el archivo real, debes cambiar a **Código Fuente** y pulsar **Guardar**.
                      </div>
                    )}
                    {compatibility === 'read-only' && editorMode === 'visual' && (
                      <div className="rounded border border-pavo/30 bg-pavo/5 p-3 text-xs text-carbon shadow-sm">
                        <span className="font-bold text-pavo">ℹ️ Documento de Solo Lectura Visual:</span> Este documento contiene importaciones o exportaciones ESM. Puedes ver los bloques pero no editarlos visualmente.
                      </div>
                    )}
                    {compatibility === 'partially-editable' && editorMode === 'visual' && (
                      <div className="rounded border border-salvia/30 bg-salvia/5 p-3 text-xs text-carbon shadow-sm">
                        <span className="font-bold text-salvia">🛡️ Compatibilidad Parcial:</span> Este documento contiene bloques opacos (JSX, listas, fórmulas) que se preservan intactos. Solo los párrafos y títulos son editables visualmente.
                      </div>
                    )}
                    {compatibility === 'unsupported' && (
                      <div className="rounded border border-terracota/30 bg-terracota/5 p-3 text-xs text-carbon shadow-sm">
                        <span className="font-bold text-terracota">❌ Modo Visual no Disponible:</span> Este archivo contiene sintaxis compleja o expresiones matemáticas con llaves <code>{`{}`}</code> que impiden el parseo seguro en modo visual.
                        {compatibilityReasons.length > 0 && (
                          <div className="mt-1 font-mono text-[10px] text-carbon/70">
                            {compatibilityReasons.join(' ')}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                {!isDiagramFile && editorMode === 'visual' && !isReadOnly && (
                  <>
                    <div className="sticky top-0 z-20 mx-auto mb-4 max-w-3xl rounded border border-carbon/15 bg-lienzo/95 p-2 shadow-sm backdrop-blur">
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      {GENERAL_BLOCK_PRESETS.map(preset => (
                        <button
                          key={`${preset.type}-${preset.label}`}
                          type="button"
                          onClick={() => insertPresetAtEnd(preset)}
                          className="rounded px-2 py-1 text-[10px] font-bold text-carbon/65 hover:bg-carbon/5 hover:text-carbon"
                        >
                          {preset.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveDiagramIndex(blocks.length);
                          setActiveDiagramBlockId(null);
                          setDiagramBuilderOpen(true);
                        }}
                        className="rounded bg-pavo/10 px-2 py-1 text-[10px] font-bold text-pavo hover:bg-pavo/20"
                      >
                        Diagrama
                      </button>
                    </div>
                    {profilePresets.length > 0 && (
                      <div className="mt-2 flex flex-wrap items-center justify-center gap-1 border-t border-carbon/10 pt-2">
                        <span className="mr-1 text-[9px] font-bold uppercase tracking-widest text-carbon/40">
                          {String(metadata.type)}
                        </span>
                        {profilePresets.map(preset => (
                          <button
                            key={`${preset.type}-${preset.label}`}
                            type="button"
                            onClick={() => insertPresetAtEnd(preset)}
                            className="rounded border border-salvia/20 bg-salvia/5 px-2 py-1 text-[10px] font-bold text-salvia hover:bg-salvia/10"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  </>
                )}
                {!isDiagramFile && editorMode === 'visual' ? (
                  renderVisualBlocks()
                ) : (
                  <div className="h-full border border-carbon/15 rounded overflow-hidden bg-lienzo shadow-inner">
                    <Editor
                      height="100%"
                      defaultLanguage={isDiagramFile ? 'typescript' : 'mdx'}
                      theme={isDark ? 'vs-dark' : 'vs-light'}
                      value={rawBody}
                      onChange={(val) => updateRawBody(val || '')}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        fontFamily: 'Fira Code, monospace',
                        lineNumbers: 'on',
                        wordWrap: 'on',
                        automaticLayout: true,
                      }}
                    />
                  </div>
                )}
              </div>

              {/* PANEL DERECHO: Inspector de Metadatos */}
              {isInspectorOpen && currentFile.endsWith('.mdx') && (
                <div className="w-80 bg-lienzo border-l border-carbon/15 flex flex-col shrink-0 overflow-hidden">
                  <div className="p-4 border-b border-carbon/15 bg-carbon/5">
                    <h3 className="text-xs uppercase tracking-widest font-bold text-carbon/60">Configuración</h3>
                  </div>
                  <MetadataInspector
                    metadata={metadata}
                    onChange={handleMetadataChange}
                    onRemove={handleRemoveMetadataField}
                    onAddCustom={handleAddCustomMetadataField}
                  />
                  {renderPageDiagramPanel()}
                  <ValidationPanel validation={validation} />
                </div>
              )}
              {isDiagramFile && renderDiagramSourcePanel()}
            </>
          )}
        </div>
      </div>
    {/* Enlazador Semántico Popover Flotante */}
      <SemanticLinker
        isOpen={linkerState.isOpen}
        onClose={() => setLinkerState(prev => ({ ...prev, isOpen: false }))}
        files={files}
        selectedText={linkerState.selectedText}
        onLinkCreated={handleLinkCreated}
        position={linkerPosition}
        initialAttrs={linkerState.initialAttrs}
        editingTag={linkerState.editingTag}
        editingMarkup={linkerState.editingMarkup}
        diagramTargets={diagramTargets}
      />

      {/* Constructor Visual de Diagramas */}
      <DiagramWorkbench
        isOpen={diagramBuilderOpen}
        currentFile={currentFile}
        metadataType={String(metadata.type || '')}
        initialModel={activeDiagramBlock?.metadata?.visualModel as Record<string, unknown> | undefined}
        initialSource={isDiagramFile ? rawBody : undefined}
        onClose={() => {
          setDiagramBuilderOpen(false);
          setActiveDiagramBlockId(null);
          setActiveDiagramIndex(null);
        }}
        onConfirm={handleConfirmDiagram}
      />
    </div>
  );
};
export default EditorPage;
