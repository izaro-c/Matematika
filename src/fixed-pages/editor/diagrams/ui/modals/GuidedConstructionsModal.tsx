import { modelPoints } from '../../model/scene/objectLists';
import React, { useState } from 'react';
import type { ConstructionKind, ConstructionRefKey, VisualDiagramModel } from '../../model/types';
import { CONSTRUCTION_OPTIONS } from '../../model';
import { applyGuidedConstruction, validConstructionRefs } from '../../model/tools/guidedConstructions';
import { useI18n } from '@/i18n';
import { Button, Field, Modal } from '@/fixed-pages/editor/ui/primitives';

interface GuidedConstructionsModalProps {
  isOpen: boolean;
  model: VisualDiagramModel | null;
  onClose: () => void;
  onUpdateModel: (nextModel: VisualDiagramModel, label: string) => void;
}

export const GuidedConstructionsModal: React.FC<GuidedConstructionsModalProps> = ({
  isOpen,
  model,
  onClose,
  onUpdateModel,
}) => {
  const { t } = useI18n();
  const [kind, setKind] = useState<ConstructionKind>('mediatriz');
  const [refs, setRefs] = useState<Record<ConstructionRefKey, string>>({
    a: '',
    b: '',
    c: '',
  });
  const [error, setError] = useState('');

  if (!isOpen || !model) return null;

  const selectedOption = CONSTRUCTION_OPTIONS.find(o => o.value === kind) || CONSTRUCTION_OPTIONS[0];

  const handleKindChange = (newKind: ConstructionKind) => {
    setKind(newKind);
    setRefs({ a: '', b: '', c: '' });
    setError('');
  };

  const isReady = validConstructionRefs(kind, refs);

  const handleCreate = () => {
    if (!validConstructionRefs(kind, refs)) {
      setError(t('editor.diagramModals.distinctPointsError'));
      return;
    }
    const { model: nextModel } = applyGuidedConstruction(model, kind, refs);
    onUpdateModel(nextModel, `Construcción guiada: ${selectedOption.label}`);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={t('editor.diagramModals.guidedConstructions')}
      footer={
        <>
          <Button onClick={onClose}>{t('editor.diagramModals.cancel')}</Button>
          <Button variant="primary" onClick={handleCreate} disabled={!isReady}>
            {t('editor.diagramModals.createItem', { label: selectedOption.label })}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p>
          {t('editor.diagramModals.guidedIntro')}
        </p>

        <Field label={t('editor.diagramModals.constructionType')} help={selectedOption.description}>
          <select
            value={kind}
            onChange={e => handleKindChange(e.target.value as ConstructionKind)}
          >
            {CONSTRUCTION_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </Field>

        <div className="space-y-2.5">
          {selectedOption.slots.map((slot, index) => (
            <Field key={slot.key} label={`${index + 1}. ${slot.label}:`}>
              <select
                value={refs[slot.key] || ''}
                onChange={e => setRefs(prev => ({ ...prev, [slot.key]: e.target.value }))}
              >
                <option value="">{t('editor.diagramModals.selectPointPlaceholder')}</option>
                {modelPoints(model).map(p => (
                  <option key={p.id} value={p.id}>
                    {p.label || p.id} ({p.id})
                  </option>
                ))}
              </select>
            </Field>
          ))}
        </div>
        {error && <p className="text-sm text-granada" role="alert">{error}</p>}
      </div>
    </Modal>
  );
};
