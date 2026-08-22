import { db } from '@/data/content';
import { getGlossaryDictionary } from '@/lib/stores/GlossaryStore';
import { TYPE_STYLES } from '@/lib/theme/constants';

export interface ResolvedJustification {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  href?: string;
  isStepLink?: boolean;
  stepNumber?: number;
  isGlossary?: boolean;
  glossaryKey?: string;
}

/**
 * Resuelve cualquier identificador de justificación contra la base de datos de contenido,
 * pasos previos de demostración, leyes de lógica formal y reglas algebraicas/aritméticas.
 */
export function resolveJustification(
  id: string,
  lang: string = 'es',
  getLocalizedPath: (p: string) => string = (p) => p,
): ResolvedJustification | null {
  if (!id || typeof id !== 'string') return null;
  const cleanId = id.trim();
  if (!cleanId) return null;

  // 1. Paso previo en la demostración (ej: 'paso-1', 'step-1', '1')
  const stepMatch = cleanId.match(/^(?:paso|step)[-_]?(\d+)$/i) || cleanId.match(/^(\d+)$/);
  if (stepMatch) {
    const num = parseInt(stepMatch[1], 10);
    return {
      id: cleanId,
      title: lang === 'eu' ? `${num}. urratsa` : `Paso ${num}`,
      badge: lang === 'eu' ? 'URRATSA' : 'PASO',
      badgeColor: 'var(--theme-canela)',
      isStepLink: true,
      stepNumber: num,
    };
  }

  // 2. Axioma
  const axiom = db.getAxiom(cleanId, lang) || db.axioms.get(cleanId);
  if (axiom) {
    return {
      id: cleanId,
      title: axiom.title,
      badge: TYPE_STYLES.axioma?.badge ?? 'AXIOMA',
      badgeColor: TYPE_STYLES.axioma?.bg ?? 'var(--theme-granada)',
      href: getLocalizedPath(`/axioma/${axiom.id || cleanId}`),
    };
  }

  // 3. Teorema / Lema / Corolario
  const theorem = db.getTheorem(cleanId, lang) || db.theorems.get(cleanId);
  if (theorem) {
    const type = theorem.type || 'teorema';
    const typeStyle = TYPE_STYLES[type];
    return {
      id: cleanId,
      title: theorem.title,
      badge: typeStyle?.badge ?? 'TEOREMA',
      badgeColor: typeStyle?.bg ?? 'var(--theme-mora)',
      href: getLocalizedPath(`/teorema/${theorem.id || cleanId}`),
    };
  }

  // 4. Definición
  const definition = db.getDefinition(cleanId, lang) || db.definitions.get(cleanId);
  if (definition) {
    const typeStyle = TYPE_STYLES.definicion;
    return {
      id: cleanId,
      title: definition.title,
      badge: typeStyle?.badge ?? 'DEFINICION',
      badgeColor: typeStyle?.bg ?? 'var(--theme-mora)',
      href: getLocalizedPath(`/definicion/${definition.id || cleanId}`),
    };
  }

  // 5. Sistema axiomático
  const system = db.getAxiomaticSystem(cleanId, lang) || db.axiomaticSystems.get(cleanId);
  if (system) {
    const typeStyle = TYPE_STYLES['sistema-axiomatico'];
    return {
      id: cleanId,
      title: system.title,
      badge: typeStyle?.badge ?? 'SISTEMA',
      badgeColor: typeStyle?.bg ?? 'var(--theme-terracota)',
      href: getLocalizedPath(`/sistema/${system.id || cleanId}`),
    };
  }

  // 6. Método de demostración
  const method = db.getMethod(cleanId, lang) || db.methods.get(cleanId);
  if (method) {
    const typeStyle = TYPE_STYLES.metodo;
    return {
      id: cleanId,
      title: method.title,
      badge: typeStyle?.badge ?? 'MÉTODO',
      badgeColor: typeStyle?.bg ?? 'var(--theme-canela)',
      href: getLocalizedPath(`/metodo/${method.id || cleanId}`),
    };
  }

  // 7. Modelo
  const model = db.getModel(cleanId, lang) || db.models.get(cleanId);
  if (model) {
    const typeStyle = TYPE_STYLES.modelo;
    return {
      id: cleanId,
      title: model.title,
      badge: typeStyle?.badge ?? 'MODELO',
      badgeColor: typeStyle?.bg ?? 'var(--theme-pavo)',
      href: getLocalizedPath(`/modelo/${model.id || cleanId}`),
    };
  }

  // 8. Demostración
  const demo = db.getDemo(cleanId, lang) || db.demos.get(cleanId);
  if (demo) {
    const typeStyle = TYPE_STYLES.demostracion;
    return {
      id: cleanId,
      title: demo.title,
      badge: typeStyle?.badge ?? 'DEMO',
      badgeColor: typeStyle?.bg ?? 'var(--theme-demostracion)',
      href: getLocalizedPath(`/demo/${demo.id || cleanId}`),
    };
  }

  // 9. Hipótesis explícita
  if (/^hip[oó]tesis$/i.test(cleanId) || /^hypothesis$/i.test(cleanId)) {
    return {
      id: cleanId,
      title: lang === 'eu' ? 'Hipotesia' : 'Hipótesis',
      badge: lang === 'eu' ? 'HIPOTESIA' : 'HIPÓTESIS',
      badgeColor: 'var(--theme-carbon)',
    };
  }

  // 10. Término de Glosario (Leyes de lógica formal, reglas algebraicas, etc.)
  const dict = getGlossaryDictionary(lang);
  const dictKey = cleanId in dict
    ? cleanId
    : cleanId.replace(/-/g, '_') in dict
      ? cleanId.replace(/-/g, '_')
      : cleanId.replace(/_/g, '-') in dict
        ? cleanId.replace(/_/g, '-')
        : undefined;

  if (dictKey && dict[dictKey]) {
    const entry = dict[dictKey];
    const cat = entry.category?.toLowerCase() || '';

    let badge = lang === 'eu' ? 'GLOSARIOA' : 'GLOSARIO';
    let badgeColor = 'var(--theme-ocre)';

    if (cat.includes('lóg') || cat.includes('logik')) {
      badge = lang === 'eu' ? 'LOGIKA' : 'LÓGICA';
      badgeColor = 'var(--theme-mora)';
    } else if (cat.includes('álg') || cat.includes('aljeb')) {
      badge = lang === 'eu' ? 'ALJEBRA' : 'ÁLGEBRA';
      badgeColor = 'var(--theme-pavo)';
    } else if (cat.includes('geom')) {
      badge = lang === 'eu' ? 'GEOMETRIA' : 'GEOMETRÍA';
      badgeColor = 'var(--theme-musgo)';
    } else if (cat.includes('fundament') || cat.includes('oinarri') || cat.includes('concep') || cat.includes('kontzep')) {
      badge = lang === 'eu' ? 'KONTZEPTUA' : 'CONCEPTO';
      badgeColor = 'var(--theme-canela)';
    }

    return {
      id: cleanId,
      title: entry.title,
      badge,
      badgeColor,
      isGlossary: true,
      glossaryKey: dictKey,
      href: getLocalizedPath(`/glosario#${dictKey}`),
    };
  }

  // 11. Fallback legible
  const humanized = cleanId
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    id: cleanId,
    title: humanized,
    badge: lang === 'eu' ? 'ARAUA' : 'REGLA',
    badgeColor: 'var(--theme-carbon)',
  };
}
