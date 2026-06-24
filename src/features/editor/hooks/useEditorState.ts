import { useState, useRef, useCallback } from 'react';
import { parseMDX, stringifyMDX } from '@/shared/lib/mdxParser';

export interface WizardData {
  type: string;
  id: string;
  title: string;
  description: string;
  era: string;
  birth: string;
  death: string;
  color: string;
  authors: string;
  tags: string;
  corollaries: string;
  demos: string;
  parentTheorem: string;
  proofMethod: string;
  lemmas: string;
  satisfies: string;
  axioms_verified: string;
  hasDiagram: boolean;
}

export interface FileNode {
  path: string;
  name: string;
  type: string;
}

export const useEditorState = () => {
  const [files, setFiles] = useState<FileNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentFile, setCurrentFile] = useState<string | null>(null);
  
  // Editor State
  const [metadata, setMetadata] = useState<Record<string, unknown>>({});
  const [imports, setImports] = useState('');
  const [body, setBody] = useState('');

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  // Timer for draft preview
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [leftWidth, setLeftWidth] = useState(50); // percentage 10-90
  const isDraggingRef = useRef(false);
  
  // Layout State
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'content' | 'metadata' | 'imports'>('content');
  const [searchQuery, setSearchQuery] = useState('');

  // Monaco Editor Ref
  const editorRef = useRef<unknown>(null);

  // Link Modal State
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkSelection, setLinkSelection] = useState({ startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 });
  const [linkModalText, setLinkModalText] = useState('');
  const [linkTarget, setLinkTarget] = useState('');

  // Ref Modal State
  const [refModalOpen, setRefModalOpen] = useState(false);
  const [refSelection, setRefSelection] = useState({ startLineNumber: 1, startColumn: 1, endLineNumber: 1, endColumn: 1 });
  const [refText, setRefText] = useState('');
  const [refTarget, setRefTarget] = useState('');
  const [refColor, setRefColor] = useState('salvia');

  // Component Gallery State
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [blocksModalOpen, setBlocksModalOpen] = useState(false);

  // New File Wizard State
  const [wizardModalOpen, setWizardModalOpen] = useState(false);
  const [wizardData, setWizardData] = useState<WizardData>({
    type: 'theorems',
    id: '',
    title: '',
    description: '',
    era: '',
    birth: '',
    death: '',
    color: 'terracota',
    authors: '',
    tags: '',
    corollaries: '',
    demos: '',
    parentTheorem: '',
    proofMethod: '',
    lemmas: '',
    satisfies: '',
    axioms_verified: '',
    hasDiagram: false
  });

  const loadFileList = async () => {
    try {
      const res = await fetch('/api/list-content');
      const data = await res.json();
      setFiles(data);
    } catch (e) {
      console.error(e);
    }
  };

  const saveDraft = useCallback(async (meta: Record<string, unknown>, imp: string, bod: string, file: string) => {
    if (file === 'nuevo_archivo.mdx') return;
    try {
      const content = file.endsWith('.mdx') ? stringifyMDX(meta, imp, bod) : bod;
      await fetch('/api/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: file, content })
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const scheduleDraft = (newMeta: Record<string, unknown>, newImp: string, newBod: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (currentFile) saveDraft(newMeta, newImp, newBod, currentFile);
    }, 400);
  };

  const getPreviewUrl = () => {
    if (!currentFile || (!metadata.id && currentFile.endsWith('.mdx'))) return '';
    if (currentFile.startsWith('content/theorems')) return `/teorema/${metadata.id}`;
    if (currentFile.startsWith('content/definitions')) return `/definicion/${metadata.id}`;
    if (currentFile.startsWith('content/lessons')) {
      const slug = currentFile.split('/').pop()?.replace('.mdx', '').replace(/Demo$/, '').toLowerCase();
      return `/${slug}`;
    }
    if (currentFile.startsWith('content/demonstrations')) return `/demo/${metadata.id}`;
    if (currentFile.startsWith('content/mathematicians')) {
      const slug = currentFile.split('/').pop()?.replace('.mdx', '').toLowerCase();
      return `/bio/${slug}`;
    }
    return '';
  };

  const openFile = async (path: string) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/content?path=${encodeURIComponent(path)}`);
      const text = await res.text();
      if (path.endsWith('.mdx')) {
        const parsed = parseMDX(text);
        setMetadata(parsed.metadata);
        setImports(parsed.imports);
        setBody(parsed.body);
      } else {
        setMetadata({});
        setImports('');
        setBody(text);
      }
      setCurrentFile(path);
      const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
         iframe.contentWindow.location.reload();
      }
    } catch (e) {
      console.error(e);
      setMessage('Error cargando el archivo');
    }
    setLoading(false);
  };

  const updateMetadata = (key: string, value: unknown) => {
    const newMeta = { ...metadata, [key]: value };
    setMetadata(newMeta);
    scheduleDraft(newMeta, imports, body);
  };

  const updateBody = (newBody: string) => {
    setBody(newBody);
    scheduleDraft(metadata, imports, newBody);
  };

  const updateImports = (newImports: string) => {
    setImports(newImports);
    scheduleDraft(metadata, newImports, body);
  };

  return {
    files, setFiles, loading, setLoading, currentFile, setCurrentFile,
    metadata, setMetadata, imports, setImports, body, setBody,
    saving, setSaving, message, setMessage, timerRef,
    leftWidth, setLeftWidth, isDraggingRef, isSidebarOpen, setIsSidebarOpen,
    activeTab, setActiveTab, searchQuery, setSearchQuery, editorRef,
    linkModalOpen, setLinkModalOpen, linkSelection, setLinkSelection,
    linkModalText, setLinkModalText, linkTarget, setLinkTarget,
    refModalOpen, setRefModalOpen, refSelection, setRefSelection,
    refText, setRefText, refTarget, setRefTarget, refColor, setRefColor,
    galleryModalOpen, setGalleryModalOpen, blocksModalOpen, setBlocksModalOpen,
    wizardModalOpen, setWizardModalOpen, wizardData, setWizardData,
    loadFileList, saveDraft, scheduleDraft, getPreviewUrl, openFile,
    updateMetadata, updateBody, updateImports
  };
};
