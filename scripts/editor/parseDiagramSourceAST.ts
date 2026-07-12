import ts from 'typescript';
import type {
  VisualDiagramModel, VisualPoint, VisualElement, VisualSlider, VisualStep, ElementKind, ColorToken
} from '../../src/features/editor/diagrams/model/types';
import { type ParseDiagramSourceResult, parseDiagramSourceLocally } from '../../src/features/editor/diagrams/source/parser';
import { KIND_LABELS } from '../../src/features/editor/diagrams/model/commands';

function parseCoords(node?: ts.Expression): { x: number; y: number } | null {
  if (!node || !ts.isArrayLiteralExpression(node)) return null;
  const elements = node.elements;
  if (elements.length < 2) return null;
  const xNode = elements[0];
  const yNode = elements[1];
  let x = 0;
  let y = 0;
  if (ts.isPrefixUnaryExpression(xNode) && xNode.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(xNode.operand)) {
    x = -parseFloat(xNode.operand.text);
  } else if (ts.isNumericLiteral(xNode)) {
    x = parseFloat(xNode.text);
  }
  if (ts.isPrefixUnaryExpression(yNode) && yNode.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(yNode.operand)) {
    y = -parseFloat(yNode.operand.text);
  } else if (ts.isNumericLiteral(yNode)) {
    y = parseFloat(yNode.text);
  }
  return { x, y };
}

function parseObjectProperties(node?: ts.Expression): Record<string, any> {
  const result: Record<string, any> = {};
  if (!node || !ts.isObjectLiteralExpression(node)) return result;
  for (const property of node.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    const name = property.name.getText();
    const valNode = property.initializer;
    if (ts.isStringLiteral(valNode)) {
      result[name] = valNode.text;
    } else if (ts.isNumericLiteral(valNode)) {
      result[name] = parseFloat(valNode.text);
    } else if (valNode.kind === ts.SyntaxKind.TrueKeyword) {
      result[name] = true;
    } else if (valNode.kind === ts.SyntaxKind.FalseKeyword) {
      result[name] = false;
    } else if (ts.isPropertyAccessExpression(valNode)) {
      // e.g. theme.salvia or theme.ocre
      result[name] = valNode.name.text;
    } else if (ts.isObjectLiteralExpression(valNode)) {
      result[name] = parseObjectProperties(valNode);
    }
  }
  return result;
}

function extractElId(node: ts.Expression): string | null {
  if (ts.isElementAccessExpression(node)) {
    const arg = node.argumentExpression;
    if (ts.isStringLiteral(arg)) return arg.text;
  }
  if (ts.isPropertyAccessExpression(node)) {
    if (node.expression.getText() === 'els') {
      return node.name.text;
    }
  }
  return null;
}

function extractRefIds(node: ts.Expression): string[] {
  const refs: string[] = [];
  if (ts.isArrayLiteralExpression(node)) {
    for (const elem of node.elements) {
      const id = extractElId(elem);
      if (id) refs.push(id);
    }
  }
  return refs;
}

export function parseDiagramSourceAST(source: string, metadataType = ''): ParseDiagramSourceResult {
  const diagnostics: any[] = [];
  let sourceFile: ts.SourceFile;
  try {
    sourceFile = ts.createSourceFile('diagram.tsx', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  } catch (error) {
    return {
      status: 'invalid',
      diagnostics: [{
        code: 'typescript-parse-error',
        severity: 'error',
        message: error instanceof Error ? error.message : 'Error de sintaxis TypeScript.',
        source: 'source',
      }]
    };
  }

  // Since we don't compile full project imports here, let's look for syntactic diagnostics only
  const syntaxDiag = (sourceFile as any).parseDiagnostics;
  if (syntaxDiag && syntaxDiag.length > 0) {
    return {
      status: 'invalid',
      diagnostics: (syntaxDiag as any[]).map((d: any) => ({
        code: 'typescript-syntax-error',
        severity: 'error',
        message: d.messageText.toString(),
        source: 'source',
      }))
    };
  }

  // Model construction
  let title = 'Diagrama';
  let componentId = 'diagrama-interactivo';
  let category = 'Teoremas';
  let mode: 'simulation' | 'diagram' | 'inline' = 'simulation';
  let axis = false;
  let grid = false;
  let boundingBox: [number, number, number, number] = [-5, 5, 5, -5];
  let note = '';

  const points: VisualPoint[] = [];
  const elements: VisualElement[] = [];
  const sliders: VisualSlider[] = [];
  let steps: VisualStep[] = [];

  const visit = (node: ts.Node) => {
    // 1. Component Name and ID
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer && ts.isArrowFunction(node.initializer)) {
      const name = node.name.text;
      componentId = name.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, '');
      title = name.replace(/([A-Z])/g, ' $1').trim();
    }

    // 2. JSX Elements (MathBoard, DiagramTitle, DiagramInfoPanel)
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const name = node.tagName.getText();
      if (name === 'MathBoard') {
        for (const attr of node.attributes.properties) {
          if (!ts.isJsxAttribute(attr)) continue;
          const attrName = attr.name.getText();
          const initializer = attr.initializer;
          if (attrName === 'boundingbox' && initializer && ts.isJsxExpression(initializer) && initializer.expression && ts.isArrayLiteralExpression(initializer.expression)) {
            const elements = initializer.expression.elements;
            if (elements.length === 4) {
              const box: number[] = [];
              for (const elem of elements) {
                if (ts.isPrefixUnaryExpression(elem) && elem.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(elem.operand)) {
                  box.push(-parseFloat(elem.operand.text));
                } else if (ts.isNumericLiteral(elem)) {
                  box.push(parseFloat(elem.text));
                }
              }
              if (box.length === 4) boundingBox = box as [number, number, number, number];
            }
          }
          if (attrName === 'axis') axis = true;
          if (attrName === 'grid') grid = true;
        }
      }
    }

    if (ts.isJsxElement(node)) {
      const opening = node.openingElement;
      const tagName = opening.tagName.getText();
      if (tagName === 'DiagramTitle') {
        const textNode = node.children[0];
        if (textNode && ts.isJsxExpression(textNode) && textNode.expression && ts.isStringLiteral(textNode.expression)) {
          title = textNode.expression.text;
        } else {
          title = node.children.map(c => c.getText()).join('').trim().replace(/^{"|}$/g, '');
        }
      }
      if (tagName === 'DiagramInfoPanel') {
        const spanNode = node.children.find(c => ts.isJsxElement(c) && c.openingElement.tagName.getText() === 'span') as ts.JsxElement | undefined;
        if (spanNode) {
          const textNode = spanNode.children[0];
          if (textNode && ts.isJsxExpression(textNode) && textNode.expression && ts.isStringLiteral(textNode.expression)) {
            note = textNode.expression.text;
          } else {
            note = spanNode.children.map(c => c.getText()).join('').trim().replace(/^{"|}$/g, '');
          }
        }
      }
    }

    // 3. onInit geometry block
    if (ts.isJsxAttribute(node) && node.name.getText() === 'onInit' && node.initializer && ts.isJsxExpression(node.initializer) && node.initializer.expression && (ts.isArrowFunction(node.initializer.expression) || ts.isFunctionExpression(node.initializer.expression))) {
      const initializer = node.initializer.expression;
      const body = initializer.body;
      if (ts.isBlock(body)) {
        for (const stmt of body.statements) {
          // Look for assignments like: els["pA"] = createPoint(...)
          if (ts.isExpressionStatement(stmt) && ts.isBinaryExpression(stmt.expression) && stmt.expression.operatorToken.kind === ts.SyntaxKind.EqualsToken) {
            const left = stmt.expression.left;
            const right = stmt.expression.right;
            const id = extractElId(left);
            if (id && ts.isCallExpression(right)) {
              const helper = right.expression.getText();
              const args = right.arguments;
              if (helper === 'createPoint' && args.length >= 2) {
                const coords = parseCoords(args[1]);
                const opts = parseObjectProperties(args[2]);
                if (coords) {
                  points.push({
                    id,
                    label: opts.name || id.replace(/^p/, ''),
                    x: coords.x,
                    y: coords.y,
                    fixed: opts.fixed === true,
                    color: (opts.fillColor || opts.strokeColor || 'terracota') as ColorToken,
                    target: opts.target !== false,
                    constraint: opts.fixed === true ? 'fixed' : 'free',
                  });
                }
              } else if (helper === 'createGlider' && args.length >= 2) {
                const coords = parseCoords(args[1]);
                const supportArr = args[1];
                let gliderTarget = '';
                if (ts.isArrayLiteralExpression(supportArr) && supportArr.elements.length >= 3) {
                  const targetExpr = supportArr.elements[2];
                  const supportId = extractElId(targetExpr);
                  if (supportId) gliderTarget = supportId;
                }
                const opts = parseObjectProperties(args[2]);
                if (coords) {
                  points.push({
                    id,
                    label: opts.name || id.replace(/^p/, ''),
                    x: coords.x,
                    y: coords.y,
                    fixed: false,
                    color: (opts.fillColor || 'ocre') as ColorToken,
                    target: opts.target !== false,
                    constraint: 'glider',
                    gliderTarget,
                  });
                }
              } else if (helper === 'createSlider' && args.length >= 3) {
                // createSlider(board, [[x, y], [x2, y2]], [min, val, max], opts)
                const rangeArr = args[2];
                let min = 0;
                let val = 1;
                let max = 10;
                if (ts.isArrayLiteralExpression(rangeArr) && rangeArr.elements.length >= 3) {
                  const parseNum = (n: ts.Expression) => {
                    if (ts.isPrefixUnaryExpression(n) && n.operator === ts.SyntaxKind.MinusToken && ts.isNumericLiteral(n.operand)) return -parseFloat(n.operand.text);
                    if (ts.isNumericLiteral(n)) return parseFloat(n.text);
                    return 0;
                  };
                  min = parseNum(rangeArr.elements[0]);
                  val = parseNum(rangeArr.elements[1]);
                  max = parseNum(rangeArr.elements[2]);
                }
                const coordsArr = args[1];
                let sx = -4;
                let sy = -4;
                if (ts.isArrayLiteralExpression(coordsArr) && coordsArr.elements.length > 0) {
                  const startCoords = parseCoords(coordsArr.elements[0]);
                  if (startCoords) {
                    sx = startCoords.x;
                    sy = startCoords.y;
                  }
                }
                const opts = parseObjectProperties(args[3]);
                sliders.push({
                  id,
                  label: opts.name || id,
                  x: sx,
                  y: sy,
                  min,
                  max,
                  value: val,
                  step: opts.snapWidth || 0.1,
                  color: (opts.fillColor || 'pavo') as ColorToken,
                  target: opts.target !== false,
                });
              } else {
                // A normal geometric element
                let kind: ElementKind;
                let refs: string[] = [];
                if (helper === 'createSegment') {
                  kind = 'segment';
                  refs = extractRefIds(args[1]);
                } else if (helper === 'createLine') {
                  kind = 'line';
                  refs = extractRefIds(args[1]);
                } else if (helper === 'createRay') {
                  kind = 'ray';
                  refs = extractRefIds(args[1]);
                } else if (helper === 'createPolygon') {
                  kind = 'polygon';
                  refs = extractRefIds(args[1]);
                } else if (helper === 'createCircle') {
                  kind = 'circle';
                  refs = extractRefIds(args[1]);
                } else if (helper === 'createMidpoint') {
                  kind = 'midpoint';
                  refs = extractRefIds(args[1]);
                } else if (helper === 'createPerpendicularFoot') {
                  kind = 'perpendicularFoot';
                  refs = extractRefIds(args[1]);
                } else if (helper === 'createBaseExtensionToFoot') {
                  kind = 'baseExtension';
                  refs = extractRefIds(args[1]);
                } else if (helper === 'createPerpendicularLine') {
                  kind = 'perpendicular';
                  refs = extractRefIds(args[1]);
                } else if (helper === 'createParallelLine') {
                  kind = 'parallel';
                  refs = extractRefIds(args[1]);
                } else if (helper === 'createAngleBisectorRay') {
                  kind = 'angleBisector';
                  refs = extractRefIds(args[1]);
                } else if (helper === 'createAngle') {
                  kind = 'angle';
                  refs = extractRefIds(args[1]);
                } else if (helper === 'createRightAngleMarker') {
                  kind = 'rightAngle';
                  refs = extractRefIds(args[1]);
                } else if (helper === 'createText') {
                  kind = 'text';
                  const anchorArr = args[1];
                  // Text coordinates array might contain els["pA"].X() function calls or values
                  if (ts.isArrayLiteralExpression(anchorArr) && anchorArr.elements.length > 0) {
                    // Try to find helper els["pA"] orels.pA reference inside the text coordinates callback functions
                    let anchorId = '';
                    const visitAnchor = (n: ts.Node) => {
                      const found = extractElId(n as ts.Expression);
                      if (found) anchorId = found;
                      else n.forEachChild(visitAnchor);
                    };
                    anchorArr.elements[0].forEachChild(visitAnchor);
                    if (anchorId) refs = [anchorId];
                  }
                } else {
                  continue;
                }
                const opts = parseObjectProperties(args[2]);
                elements.push({
                  id,
                  label: opts.name || KIND_LABELS[kind],
                  kind,
                  refs,
                  color: (opts.strokeColor || opts.fillColor || opts.color || 'carbon') as ColorToken,
                  target: opts.target !== false,
                  dashed: opts.dash !== undefined || opts.dashed === true,
                  text: opts.text || (helper === 'createText' && ts.isStringLiteral(args[1]) ? args[1].text : undefined),
                });
              }
            }
          }
        }
      }
    }

    // 4. onUpdate steps mapping
    if (ts.isJsxAttribute(node) && node.name.getText() === 'onUpdate' && node.initializer && ts.isJsxExpression(node.initializer) && node.initializer.expression && (ts.isArrowFunction(node.initializer.expression) || ts.isFunctionExpression(node.initializer.expression))) {
      const initializer = node.initializer.expression;
      const body = initializer.body;
      if (ts.isBlock(body)) {
        for (const stmt of body.statements) {
          if (ts.isVariableStatement(stmt)) {
            for (const decl of stmt.declarationList.declarations) {
              if (decl.name.getText() === 'stepTargets' && decl.initializer && ts.isObjectLiteralExpression(decl.initializer)) {
                const targetObj = parseObjectProperties(decl.initializer);
                steps = Object.entries(targetObj).map(([stepId, targetsList]) => {
                  return {
                    id: stepId,
                    label: stepId.replace(/^step/, 'Paso '),
                    description: `Paso ${stepId}`,
                    visibleTargets: Array.isArray(targetsList) ? targetsList : [],
                  };
                });
              }
            }
          }
        }
      }
    }

    node.forEachChild(visit);
  };

  visit(sourceFile);

  // If steps were parsed, let's normalize their labels/descriptions from any model JSON block comment
  const embedded = parseDiagramSourceLocally(source, metadataType);
  if (embedded) {
    if (steps.length === 0) steps = embedded.steps;
    else {
      steps = steps.map(s => {
        const found = embedded.steps.find(item => item.id === s.id);
        return found ? { ...s, label: found.label, description: found.description } : s;
      });
    }
    mode = embedded.mode;
    category = embedded.category;
    note = note || embedded.note;
  }

  const resultModel: VisualDiagramModel = {
    title,
    componentId,
    category,
    mode,
    axis,
    grid,
    boundingBox,
    points,
    elements,
    sliders,
    steps,
    note,
  };

  const status = points.length > 0 ? 'supported' : 'unsupported';
  return {
    status,
    model: resultModel,
    diagnostics,
  };
}
