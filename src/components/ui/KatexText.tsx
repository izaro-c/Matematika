import React, { useLayoutEffect, useRef, useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Propiedades para KatexText
 */
interface KatexTextProps {
  /** Texto en crudo que contiene expresiones matemáticas entre $ o $$ */
  text: string;
  className?: string;
}

const VALID_THEME_COLORS = new Set([
  'carbon',
  'terracota',
  'canela',
  'mora',
  'ocre',
  'pavo',
  'granada',
  'musgo',
] as const);

type ThemeColor = typeof VALID_THEME_COLORS extends Set<infer T> ? T : never;

const katexCache = new Map<string, string>();
const MAX_CACHE_SIZE = 500;

/**
 * Convierte texto mixto con expresiones $...$ o $$...$$ en HTML seguro de KaTeX.
 * Mantenida por compatibilidad con módulos consumidores del proyecto.
 */
export function renderKatexTextToHtml(text: string): string {
  if (!text) return '';

  const cached = katexCache.get(text);
  if (cached !== undefined) return cached;

  // 1. Escapado preventivo de etiquetas HTML crudas
  let html = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const unescapeMath = (math: string) =>
    math
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');

  // 2. Renderizado de fórmulas en bloque
  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (match, math) => {
    try {
      return katex.renderToString(unescapeMath(math), {
        displayMode: true,
        throwOnError: false,
        trust: false, // Bloquea javascript: en \href
        strict: 'warn',
      });
    } catch {
      return match;
    }
  });

  // 3. Renderizado de fórmulas inline
  html = html.replace(/\$([^$\n]+?)\$/g, (match, math) => {
    try {
      return katex.renderToString(unescapeMath(math), {
        displayMode: false,
        throwOnError: false,
        trust: false, // Bloquea javascript: en \href
        strict: 'warn',
      });
    } catch {
      return match;
    }
  });

  // 4. Formato de texto y paleta de colores validada contra allowlist
  const result = html
    .replace(/\n/g, '<br/>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/_([^_]+)_/g, '<em>$1</em>')
    .replace(/\[([a-z]+):([^\]]+)\]/g, (match, colorName, innerText) => {
      if (VALID_THEME_COLORS.has(colorName as ThemeColor)) {
        return `<span style="color: var(--theme-${colorName})">${innerText}</span>`;
      }
      return match;
    });

  if (katexCache.size >= MAX_CACHE_SIZE) {
    const firstKey = katexCache.keys().next().value;
    if (firstKey !== undefined) katexCache.delete(firstKey);
  }
  katexCache.set(text, result);

  return result;
}

/**
 * Nodo hoja que utiliza katex.render directamente sobre el DOM real.
 * No genera strings HTML intermedios y no usa dangerouslySetInnerHTML.
 */
const SafeMathNode: React.FC<{ math: string; displayMode: boolean }> = React.memo(
  ({ math, displayMode }) => {
    const containerRef = useRef<HTMLSpanElement>(null);

    useLayoutEffect(() => {
      if (!containerRef.current) return;

      try {
        katex.render(math, containerRef.current, {
          displayMode,
          throwOnError: false,
          trust: false,
          strict: 'warn',
        });
      } catch {
        if (containerRef.current) {
          containerRef.current.textContent = math;
        }
      }
    }, [math, displayMode]);

    return (
      <span
        ref={containerRef}
        className={displayMode ? 'katex-display-wrapper' : 'katex-inline-wrapper'}
        aria-label={math}
      />
    );
  }
);

SafeMathNode.displayName = 'SafeMathNode';

/**
 * Parsea el texto plano y genera un árbol de React Nodes puros sin dangerouslySetInnerHTML.
 */
function tokenizeToReactNodes(rawText: string): React.ReactNode[] {
  if (!rawText) return [];

const MATH_PATTERN = '\\$\\$[\\s\\S]+?\\$\\$|\\$[^$\\n]+?\\$';
const COLOR_PATTERN = '\\[\\w+:[^\\]]+\\]';
const STYLE_PATTERN = '\\*\\*[^*]+?\\*\\*|\\*[^*\\n]+?\\*';

const tokenizer = new RegExp(
  `(${MATH_PATTERN}|${COLOR_PATTERN}|${STYLE_PATTERN}|\\n)`,
  'g'
);
const tokens = rawText.split(tokenizer);

  return tokens.map((token, index) => {
    if (!token) return null;

    if (token.startsWith('$$') && token.endsWith('$$') && token.length >= 4) {
      return <SafeMathNode key={index} math={token.slice(2, -2)} displayMode={true} />;
    }

    if (token.startsWith('$') && token.endsWith('$') && token.length >= 2) {
      return <SafeMathNode key={index} math={token.slice(1, -1)} displayMode={false} />;
    }

    if (token.startsWith('**') && token.endsWith('**') && token.length >= 4) {
      return <strong key={index}>{token.slice(2, -2)}</strong>;
    }

    if (token.startsWith('*') && token.endsWith('*') && token.length >= 2) {
      return <em key={index}>{token.slice(1, -1)}</em>;
    }

    if (token === '\n') {
      return <br key={index} />;
    }

    if (token.startsWith('[') && token.endsWith(']')) {
      const colonIndex = token.indexOf(':');
      if (colonIndex > 1) {
        const potentialColor = token.slice(1, colonIndex);
        const innerText = token.slice(colonIndex + 1, -1);

        if (VALID_THEME_COLORS.has(potentialColor as ThemeColor)) {
          return (
            <span
              key={index}
              style={{ color: `var(--theme-${potentialColor})` }}
            >
              {innerText}
            </span>
          );
        }
      }
    }

    return <React.Fragment key={index}>{token}</React.Fragment>;
  });
}

/**
 * Componente que renderiza expresiones matemáticas de LaTeX y tokens de texto.
 * Convierte strings como `$x^2$` en nodos de KaTeX mediante DOM directo.
 * Soporta negrita, cursiva y colores tipados (`[terracota:texto]`).
 */
export const KatexText: React.FC<KatexTextProps> = ({ text, className = '' }) => {
  const content = useMemo(() => tokenizeToReactNodes(text), [text]);
  return <span className={className}>{content}</span>;
};

export default KatexText;