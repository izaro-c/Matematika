import React, { useEffect, useState } from 'react';
import type { VisualDiagramModel } from '../../model/types';
import { generateDiagramSource } from '../../source/generator';
import { useI18n } from '@/i18n';
import { Button, Modal, Tabs, controlClassName } from '@/fixed-pages/editor/ui/primitives';

interface CodeModalProps {
  isOpen: boolean;
  model: VisualDiagramModel | null;
  componentName: string;
  sandboxMode?: boolean;
  source?: string;
  onSourceChange?: (source: string) => void;
  onClose: () => void;
}

export const CodeModal: React.FC<CodeModalProps> = ({
  isOpen,
  model,
  componentName,
  sandboxMode = true,
  source = '',
  onSourceChange,
  onClose,
}) => {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'tsx' | 'json'>('tsx');
  const [sourceDraft, setSourceDraft] = useState(source);

  useEffect(() => {
    if (isOpen) setSourceDraft(source);
  }, [isOpen, source]);

  if (!isOpen || !model) return null;

  const generated = generateDiagramSource(model, componentName || 'DiagramaCustom');
  const generationErrorLines = (generated.diagnostics || []).map(d => `// - ${d.message}`).join('\n');
  const codeTSX = generated.ok
    ? generated.source
    : `// Error al generar fuente TSX\n${generationErrorLines}`;
  const jsonSpec = JSON.stringify(model, null, 2);

  const contentToCopy = activeTab === 'tsx' ? codeTSX : jsonSpec;
  const canApplySource = !sandboxMode && Boolean(onSourceChange) && sourceDraft.trim().length > 0;

  const handleCopy = async () => {
    let success = false;
    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        await navigator.clipboard.writeText(contentToCopy);
        success = true;
      }
    } catch {
      success = false;
    }

    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = contentToCopy;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch {
        success = false;
      }
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const filename = `${componentName || 'Diagrama'}.${activeTab === 'tsx' ? 'tsx' : 'json'}`;
    const blob = new Blob([contentToCopy], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={t('editor.diagramModals.sourceCodeAndSpecification')}
      size="lg"
      footer={
        <>
          <span className="mr-auto text-sm italic text-carbon/65">
            {generated.ok
              ? sandboxMode
                ? t('editor.diagramModals.sandboxReadOnlyNote')
                : t('editor.diagramModals.applyAnalysisNote')
              : t('editor.diagramModals.generationFailed')}
          </span>
          <Button onClick={handleDownload} disabled={!generated.ok && activeTab === 'tsx'}>
            {t('editor.diagramModals.downloadAs', { ext: activeTab })}
          </Button>
          <Button variant={sandboxMode ? 'primary' : 'secondary'} onClick={handleCopy}>
            {copied ? t('editor.diagramModals.copied') : t('editor.diagramModals.copy')}
          </Button>
          {!sandboxMode && (
            <Button variant="primary" onClick={() => onSourceChange?.(sourceDraft)} disabled={!canApplySource}>
              {t('editor.diagramModals.applySource')}
            </Button>
          )}
        </>
      }
    >
      <Tabs
        aria-label={t('editor.diagramModals.sourceCodeAndSpecification')}
        activeTab={activeTab}
        onTabChange={id => setActiveTab(id as typeof activeTab)}
        tabs={[
          { id: 'tsx', label: t('editor.diagramModals.diagramSource') },
          { id: 'json', label: t('editor.diagramModals.specification') },
        ]}
      />
      <textarea
        aria-label={t('editor.diagramModals.sourceSpecAria')}
        value={sandboxMode ? contentToCopy : sourceDraft}
        readOnly={sandboxMode}
        onChange={event => {
          if (!sandboxMode) setSourceDraft(event.target.value);
        }}
        onClick={event => (event.target as HTMLTextAreaElement).select()}
        spellCheck={false}
        className={`${controlClassName} mt-3 h-[50vh] font-mono text-xs leading-relaxed`}
      />
    </Modal>
  );
};
