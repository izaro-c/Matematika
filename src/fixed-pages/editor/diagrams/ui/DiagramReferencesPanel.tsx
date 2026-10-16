import React, { useMemo, useState } from 'react';
import { getDiagramUsages } from '../references/usageIndex';
import { useI18n } from '@/i18n';
import { renderRichText } from '@/fixed-pages/editor/diagrams/ui/primitives/richText';

interface DiagramReferencesPanelProps {
  filePath: string | null;
  diagramMode?: 'simulation' | 'diagram' | 'inline';
  onLinkToMdxPage?: (mdxPath: string, mode: 'simulation' | 'diagram' | 'inline') => void | Promise<void>;
}

export const DiagramReferencesPanel: React.FC<DiagramReferencesPanelProps> = ({
  filePath,
  diagramMode = 'diagram',
  onLinkToMdxPage,
}) => {
  const { t } = useI18n();
  const [mdxPath, setMdxPath] = useState('');
  const usages = useMemo(() => {
    if (!filePath) return [];
    return getDiagramUsages(filePath);
  }, [filePath]);

  return (
    <section className="rounded border border-carbon/10 bg-lienzo p-3 h-full overflow-y-auto">
      <h4 className="ac-label ac-label--sm ac-label--soft border-b border-carbon/10 pb-1 mb-3">
        {t('editor.diagramEditors.diagramReferences')}
      </h4>

      {filePath && onLinkToMdxPage && (
        <form
          className="mb-4 space-y-2 rounded border border-carbon/10 bg-carbon/[0.02] p-3"
          onSubmit={(event) => {
            event.preventDefault();
            const trimmedPath = mdxPath.trim();
            if (!trimmedPath) return;
            void onLinkToMdxPage(trimmedPath, diagramMode);
          }}
        >
          <label className="block text-[10px] font-bold text-carbon/55">
            {t('editor.diagramEditors.mdxPagePath')}
            <input
              type="text"
              value={mdxPath}
              onChange={event => setMdxPath(event.target.value)}
              placeholder="database/content/definitions/ejemplo.mdx"
              className="mt-1 min-h-10 w-full rounded border border-carbon/15 bg-lienzo px-2 font-mono text-xs"
            />
          </label>
          <button
            type="submit"
            className="min-h-10 rounded border border-pavo/20 bg-pavo/10 px-3 text-[10px] font-bold text-pavo hover:bg-pavo/15"
          >
            {t('editor.diagramEditors.linkToMdxPage')}
          </button>
        </form>
      )}

      {usages.length === 0 ? (
        <p className="text-xs italic text-carbon/55">
          {t('editor.diagramEditors.noReferencesNotice')}
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-[11px] text-carbon/60 mb-2">
            {renderRichText(t(usages.length === 1 ? 'editor.diagramEditors.referencedInPagesOne' : 'editor.diagramEditors.referencedInPagesOther', { count: usages.length }), { b: content => <span className="font-bold text-carbon">{content}</span> })}
          </p>
          <ul className="space-y-1.5">
            {usages.map((u, i) => (
              <li
                key={i}
                className="flex flex-col gap-0.5 rounded border border-carbon/10 bg-carbon/5 p-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-carbon truncate max-w-[180px]">{u.contentId}</span>
                  <span className={`ac-editor-badge rounded-full px-1.5 py-0.5 ${
                    u.referenceKind === 'Simulation'
                      ? 'bg-pavo/15 text-pavo'
                      : u.referenceKind === 'Diagram'
                        ? 'bg-canela/15 text-canela'
                        : 'bg-mora/15 text-mora'
                  }`}>
                    {u.referenceKind}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-carbon/45 truncate mt-0.5">{u.contentPath}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
export default DiagramReferencesPanel;
