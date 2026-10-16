import React from 'react';
import { isCurveObject, type CurvePath } from '@/diagrams';
import type { ElementPanelProps } from '../../types';
import { parseOptionalNumber } from '../../../workbenchSelection';
import { modelPoints } from '@/fixed-pages/editor/diagrams/model';
import { useI18n } from '@/i18n';
import { renderRichText } from '@/fixed-pages/editor/diagrams/ui/primitives/richText';

type CurveGeometryPatch = Partial<{
  expression: string;
  x: string;
  y: string;
  domain: [number, number];
  areaFill: 'none' | 'interior' | 'half-plane';
  areaSide: string | undefined;
}>;

/** Aplica un parche a la geometría de una curva; las claves ajenas a su tipo se ignoran. */
function withCurveGeometry(curve: CurvePath, patch: CurveGeometryPatch): CurvePath {
  const geometry = curve.geometry;
  const { areaSide, ...rest } = patch;
  const next = { ...geometry } as Record<string, unknown>;
  Object.entries(rest).forEach(([key, value]) => {
    if (geometry.type === 'function' && (key === 'x' || key === 'y')) return;
    if (geometry.type === 'parametric' && key === 'expression') return;
    next[key] = value;
  });
  if ('areaSide' in patch) {
    if (areaSide) next.areaSide = areaSide;
    else delete next.areaSide;
  }
  return { ...curve, geometry: next as CurvePath['geometry'] };
}

/** Propiedades: expression, xExpression, yExpression, domain, areaFill, refs[0] para semiplano */
export const ElementCurveSection: React.FC<ElementPanelProps> = ({
  model,
  element,
  onUpdateElement,
}) => {
  const { t } = useI18n();
  if (!isCurveObject(element)) return null;
  const geometry = element.geometry;
  const update = (patch: CurveGeometryPatch) => onUpdateElement(element.id, current => (
    isCurveObject(current) ? withCurveGeometry(current, patch) : current
  ));
  return (
  <div className="space-y-3">
    {geometry.type === 'function' && (
      <div>
        <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
          {renderRichText(t('editor.diagramInspector.expressionOf', { name: 'f(x)' }), { code: c => <code className="font-mono text-[10px] text-canela">{c}</code> })}
        </label>
        <input
          type="text"
          aria-label={t('editor.diagramInspector.expressionFX')}
          value={geometry.type === 'function' ? geometry.expression : ''}
          onChange={e =>
            update({ expression: e.target.value })
          }
          placeholder={t('editor.diagramInspector.functionExample')}
          className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 font-mono text-xs font-bold text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20 placeholder-carbon/30"
        />
      </div>
    )}

    {geometry.type === 'parametric' && (
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
            {renderRichText(t('editor.diagramInspector.expressionOf', { name: 'x(t)' }), { code: c => <code className="font-mono text-[10px] text-canela">{c}</code> })}
          </label>
          <input
            type="text"
            aria-label={t('editor.diagramInspector.expressionXT')}
            value={geometry.type === 'parametric' ? geometry.x : ''}
            onChange={e =>
              update({ x: e.target.value })
            }
            placeholder={t('editor.diagramInspector.xtExample')}
            className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 font-mono text-xs font-bold text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20 placeholder-carbon/30"
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
            {renderRichText(t('editor.diagramInspector.expressionOf', { name: 'y(t)' }), { code: c => <code className="font-mono text-[10px] text-canela">{c}</code> })}
          </label>
          <input
            type="text"
            aria-label={t('editor.diagramInspector.expressionYT')}
            value={geometry.type === 'parametric' ? geometry.y : ''}
            onChange={e =>
              update({ y: e.target.value })
            }
            placeholder={t('editor.diagramInspector.ytExample')}
            className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 font-mono text-xs font-bold text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20 placeholder-carbon/30"
          />
        </div>
      </div>
    )}

    <div className="grid grid-cols-2 gap-2.5 pt-1">
      <div>
        <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
          {t('editor.diagramInspector.domainMinimum')}
        </label>
        <input
          type="number"
          step="0.5"
          aria-label={t('editor.diagramInspector.domainMinimum')}
          value={geometry.domain[0]}
          onChange={e => {
            const minVal = parseOptionalNumber(e.target.value, -5);
            const maxVal = geometry.domain[1];
            update({ domain: [minVal, maxVal] });
          }}
          className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
        />
      </div>
      <div>
        <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">
          {t('editor.diagramInspector.domainMaximum')}
        </label>
        <input
          type="number"
          step="0.5"
          aria-label={t('editor.diagramInspector.domainMaximum')}
          value={geometry.domain[1]}
          onChange={e => {
            const minVal = geometry.domain[0];
            const maxVal = parseOptionalNumber(e.target.value, 5);
            update({ domain: [minVal, maxVal] });
          }}
          className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20"
        />
      </div>
    </div>

    <div className="pt-2.5 border-t border-carbon/10 space-y-2.5">
      <div>
        <label className="block text-[11px] font-bold text-carbon/75 tracking-tight mb-1">{t('editor.diagramInspector.areaFillTitle')}</label>
        <select
          value={geometry.areaFill || 'none'}
          onChange={e =>
            update({ areaFill: e.target.value as 'none' | 'interior' | 'half-plane', })
          }
          className="w-full rounded-lg border border-carbon/15 bg-lienzo px-3 py-1.5 text-xs font-bold text-carbon shadow-2xs transition-colors focus:border-canela focus:outline-none focus:ring-2 focus:ring-canela/20 cursor-pointer"
        >
          <option value="none">{t('editor.diagramInspector.noAreaFill')}</option>
          <option value="interior">{t('editor.diagramInspector.fillToXAxis')}</option>
          <option value="half-plane">{t('editor.diagramInspector.halfPlaneFill')}</option>
        </select>
      </div>

      {geometry.areaFill === 'half-plane' && (
        <div className="p-2.5 rounded-lg border border-canela/20 bg-canela/5 space-y-1">
          <label className="block text-[10px] font-bold text-canela uppercase tracking-wider mb-1">{t('editor.diagramInspector.halfPlaneReferencePoint')}</label>
          <select
            value={geometry.areaSide || ''}
            onChange={e => update({ areaSide: e.target.value || undefined })}
            className="w-full rounded-md border border-canela/20 bg-lienzo px-2.5 py-1 text-xs font-mono font-bold text-carbon focus:border-canela focus:outline-none"
          >
            <option value="">{t('editor.diagramInspector.selectPoint')}</option>
            {modelPoints(model).map(p => (
              <option key={p.id} value={p.id}>
                {t('editor.diagramInspector.pointLabelId', { label: p.label || p.id, id: p.id })}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  </div>
  );
};
