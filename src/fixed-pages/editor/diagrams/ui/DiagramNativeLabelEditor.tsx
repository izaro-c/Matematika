import React from 'react';
import { useI18n } from '@/i18n';
import { controlClassName } from '@/fixed-pages/editor/ui/primitives';

interface DiagramNativeLabelEditorProps {
  label: string;
  visible: boolean;
  size: number;
  offset?: [number, number];
  position?: number | string;
  alongPath?: boolean;
  onVisibleChange: (visible: boolean) => void;
  onStyleChange: (update: { labelSize?: number; labelOffset?: [number, number]; labelPosition?: number | string }) => void;
}

const COMPASS_POSITIONS = [
  ['', 'editor.diagramEditors.positionAuto'],
  ['top', 'editor.diagramEditors.positionTop'],
  ['bot', 'editor.diagramEditors.positionBottom'],
  ['lft', 'editor.diagramEditors.positionLeft'],
  ['rt', 'editor.diagramEditors.positionRight'],
  ['ulft', 'editor.diagramEditors.positionTopLeft'],
  ['urt', 'editor.diagramEditors.positionTopRight'],
  ['llft', 'editor.diagramEditors.positionBottomLeft'],
  ['lrt', 'editor.diagramEditors.positionBottomRight'],
] as const;

export const DiagramNativeLabelEditor: React.FC<DiagramNativeLabelEditorProps> = ({
  label,
  visible,
  size,
  offset = [0, 0],
  position,
  alongPath = false,
  onVisibleChange,
  onStyleChange,
}) => {
  const { t } = useI18n();
  return (
  <section className="border-t border-carbon/10 pt-3" aria-label={t('editor.diagramEditors.nativeLabelOf', { label })}>
    <label className="flex min-h-10 items-center gap-2 text-xs font-bold text-carbon">
      <input type="checkbox" aria-label={t('editor.diagramEditors.showNativeLabelOf', { label })} checked={visible} onChange={event => onVisibleChange(event.target.checked)} />
      {t('editor.diagramEditors.showNameOnCanvas')}
    </label>
    {visible && <div className="mt-2 space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <label className="text-[10px] font-bold text-carbon/60">{t('editor.diagramEditors.size')}
          <input type="number" min="6" max="72" step="1" aria-label={t('editor.diagramEditors.labelSizeOf', { label })} className={`${controlClassName} mt-1`} value={size} onChange={event => onStyleChange({ labelSize: Number(event.target.value) })} />
        </label>
        {alongPath ? <label className="text-[10px] font-bold text-carbon/60">{t('editor.diagramEditors.positionPercent', { percent: Math.round((typeof position === 'number' ? position : 0.5) * 100) })}
          <input type="range" min="0" max="1" step="0.01" aria-label={t('editor.diagramEditors.labelPositionOf', { label })} className="mt-2 w-full accent-ocre" value={typeof position === 'number' ? position : 0.5} onChange={event => onStyleChange({ labelPosition: Number(event.target.value) })} />
        </label> : <label className="text-[10px] font-bold text-carbon/60">{t('editor.diagramEditors.position')}
          <select aria-label={t('editor.diagramEditors.labelPositionOf', { label })} className={`${controlClassName} mt-1`} value={typeof position === 'string' ? position : ''} onChange={event => onStyleChange({ labelPosition: event.target.value || undefined })}>
            {COMPASS_POSITIONS.map(([value, text]) => <option key={value} value={value}>{t(text)}</option>)}
          </select>
        </label>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="text-[10px] font-bold text-carbon/60">{t('editor.diagramEditors.xOffset')}
          <input type="number" min="-200" max="200" step="1" aria-label={t('editor.diagramEditors.labelOffsetXOf', { label })} className={`${controlClassName} mt-1`} value={offset[0]} onChange={event => onStyleChange({ labelOffset: [Number(event.target.value), offset[1]] })} />
        </label>
        <label className="text-[10px] font-bold text-carbon/60">{t('editor.diagramEditors.yOffset')}
          <input type="number" min="-200" max="200" step="1" aria-label={t('editor.diagramEditors.labelOffsetYOf', { label })} className={`${controlClassName} mt-1`} value={offset[1]} onChange={event => onStyleChange({ labelOffset: [offset[0], Number(event.target.value)] })} />
        </label>
      </div>
      <p className="text-[9px] leading-relaxed text-carbon/45">{t('editor.diagramEditors.offsetHint')}</p>
    </div>}
  </section>
);
};

export default DiagramNativeLabelEditor;
