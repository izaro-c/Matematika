export class DiagramExpressionError extends Error {
  readonly position: number;

  constructor(message: string, position = 0) {
    super(`${message} (posición ${position})`);
    this.name = 'DiagramExpressionError';
    this.position = position;
  }
}

type TokenKind = 'number' | 'identifier' | 'operator' | 'leftParen' | 'rightParen' | 'comma' | 'eof';

interface Token {
  kind: TokenKind;
  value: string;
  position: number;
}

export type DiagramExpressionNode =
  | { kind: 'number'; value: number }
  | { kind: 'variable'; name: string }
  | { kind: 'unary'; operator: '+' | '-'; value: DiagramExpressionNode }
  | { kind: 'binary'; operator: '+' | '-' | '*' | '/' | '^'; left: DiagramExpressionNode; right: DiagramExpressionNode }
  | { kind: 'call'; name: string; args: DiagramExpressionNode[] };

const MAX_EXPRESSION_LENGTH = 512;
const MAX_TOKENS = 256;
const SAFE_FUNCTIONS = new Set([
  'abs', 'acos', 'asin', 'atan', 'atan2', 'ceil', 'cos', 'exp', 'floor', 'hypot',
  'ln', 'log', 'max', 'min', 'round', 'sign', 'sin', 'sqrt', 'tan',
  'and', 'approx', 'eq', 'gt', 'gte', 'lt', 'lte', 'not', 'or',
]);

function tokenize(source: string): Token[] {
  if (source.length > MAX_EXPRESSION_LENGTH) throw new DiagramExpressionError('La expresión supera 512 caracteres');
  const tokens: Token[] = [];
  let index = 0;
  const push = (kind: TokenKind, value: string, position: number) => {
    tokens.push({ kind, value, position });
    if (tokens.length > MAX_TOKENS) throw new DiagramExpressionError('La expresión contiene demasiados símbolos', position);
  };

  while (index < source.length) {
    const character = source[index];
    if (/\s/.test(character)) {
      index += 1;
      continue;
    }
    if (/[0-9.]/.test(character)) {
      const start = index;
      const match = source.slice(index).match(/^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/);
      if (!match) throw new DiagramExpressionError('Número no válido', start);
      index += match[0].length;
      push('number', match[0], start);
      continue;
    }
    if (/[A-Za-z_]/.test(character)) {
      const start = index;
      const match = source.slice(index).match(/^[A-Za-z_]\w*(?:\.[A-Za-z_]\w*)*/);
      if (!match) throw new DiagramExpressionError('Identificador no válido', start);
      index += match[0].length;
      push('identifier', match[0], start);
      continue;
    }
    if ('+-*/^'.includes(character)) push('operator', character, index);
    else if (character === '(') push('leftParen', character, index);
    else if (character === ')') push('rightParen', character, index);
    else if (character === ',') push('comma', character, index);
    else throw new DiagramExpressionError(`El símbolo ${JSON.stringify(character)} no está permitido`, index);
    index += 1;
  }
  tokens.push({ kind: 'eof', value: '', position: source.length });
  return tokens;
}

class Parser {
  private index = 0;
  private readonly tokens: Token[];

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  parse(): DiagramExpressionNode {
    const expression = this.additive();
    const token = this.peek();
    if (token.kind !== 'eof') throw new DiagramExpressionError(`Símbolo inesperado ${JSON.stringify(token.value)}`, token.position);
    return expression;
  }

  private peek(): Token {
    return this.tokens[this.index];
  }

  private take(): Token {
    const token = this.peek();
    this.index += 1;
    return token;
  }

  private additive(): DiagramExpressionNode {
    let node = this.multiplicative();
    while (this.peek().kind === 'operator' && ['+', '-'].includes(this.peek().value)) {
      const operator = this.take().value as '+' | '-';
      node = { kind: 'binary', operator, left: node, right: this.multiplicative() };
    }
    return node;
  }

  private multiplicative(): DiagramExpressionNode {
    let node = this.unary();
    while (this.peek().kind === 'operator' && ['*', '/'].includes(this.peek().value)) {
      const operator = this.take().value as '*' | '/';
      node = { kind: 'binary', operator, left: node, right: this.unary() };
    }
    return node;
  }

  private unary(): DiagramExpressionNode {
    if (this.peek().kind === 'operator' && ['+', '-'].includes(this.peek().value)) {
      const operator = this.take().value as '+' | '-';
      return { kind: 'unary', operator, value: this.unary() };
    }
    return this.power();
  }

  private power(): DiagramExpressionNode {
    const left = this.primary();
    if (this.peek().kind === 'operator' && this.peek().value === '^') {
      this.take();
      return { kind: 'binary', operator: '^', left, right: this.unary() };
    }
    return left;
  }

  private primary(): DiagramExpressionNode {
    const token = this.take();
    if (token.kind === 'number') return { kind: 'number', value: Number(token.value) };
    if (token.kind === 'identifier') {
      if (this.peek().kind !== 'leftParen') return { kind: 'variable', name: token.value };
      if (!SAFE_FUNCTIONS.has(token.value)) throw new DiagramExpressionError(`La función ${token.value} no está permitida`, token.position);
      this.take();
      const args: DiagramExpressionNode[] = [];
      if (this.peek().kind !== 'rightParen') {
        args.push(this.additive());
        while (this.peek().kind === 'comma') {
          this.take();
          args.push(this.additive());
        }
      }
      const closing = this.take();
      if (closing.kind !== 'rightParen') throw new DiagramExpressionError('Falta cerrar el paréntesis de la función', closing.position);
      return { kind: 'call', name: token.value, args };
    }
    if (token.kind === 'leftParen') {
      const expression = this.additive();
      const closing = this.take();
      if (closing.kind !== 'rightParen') throw new DiagramExpressionError('Falta cerrar el paréntesis', closing.position);
      return expression;
    }
    throw new DiagramExpressionError('Se esperaba un número, variable o paréntesis', token.position);
  }
}

export function parseMathExpression(source: string): DiagramExpressionNode {
  if (!source.trim()) throw new DiagramExpressionError('La expresión está vacía');
  return new Parser(tokenize(source)).parse();
}

function callSafeFunction(name: string, args: number[]): number {
  if (name === 'abs') return Math.abs(args[0]);
  if (name === 'acos') return Math.acos(args[0]);
  if (name === 'asin') return Math.asin(args[0]);
  if (name === 'atan') return Math.atan(args[0]);
  if (name === 'atan2') return Math.atan2(args[0], args[1]);
  if (name === 'ceil') return Math.ceil(args[0]);
  if (name === 'cos') return Math.cos(args[0]);
  if (name === 'exp') return Math.exp(args[0]);
  if (name === 'floor') return Math.floor(args[0]);
  if (name === 'hypot') return Math.hypot(...args);
  if (name === 'ln' || name === 'log') return Math.log(args[0]);
  if (name === 'max') return Math.max(...args);
  if (name === 'min') return Math.min(...args);
  if (name === 'round') return Math.round(args[0]);
  if (name === 'sign') return Math.sign(args[0]);
  if (name === 'sin') return Math.sin(args[0]);
  if (name === 'sqrt') return Math.sqrt(args[0]);
  if (name === 'tan') return Math.tan(args[0]);
  if (name === 'and') return args.every(Boolean) ? 1 : 0;
  if (name === 'or') return args.some(Boolean) ? 1 : 0;
  if (name === 'not') return args[0] ? 0 : 1;
  if (name === 'eq') return args[0] === args[1] ? 1 : 0;
  if (name === 'approx') return Math.abs(args[0] - args[1]) <= Math.abs(args[2] ?? 1e-8) ? 1 : 0;
  if (name === 'gt') return args[0] > args[1] ? 1 : 0;
  if (name === 'gte') return args[0] >= args[1] ? 1 : 0;
  if (name === 'lt') return args[0] < args[1] ? 1 : 0;
  if (name === 'lte') return args[0] <= args[1] ? 1 : 0;
  throw new DiagramExpressionError(`La función ${name} no está permitida`);
}

function evaluateNode(node: DiagramExpressionNode, variables: Readonly<Record<string, number>>): number {
  if (node.kind === 'number') return node.value;
  if (node.kind === 'variable') {
    if (node.name === 'pi') return Math.PI;
    if (node.name === 'e') return Math.E;
    const value = variables[node.name];
    if (typeof value !== 'number') throw new DiagramExpressionError(`La variable ${node.name} no tiene valor`);
    return value;
  }
  if (node.kind === 'unary') {
    const value = evaluateNode(node.value, variables);
    return node.operator === '-' ? -value : value;
  }
  if (node.kind === 'binary') {
    const left = evaluateNode(node.left, variables);
    const right = evaluateNode(node.right, variables);
    if (node.operator === '+') return left + right;
    if (node.operator === '-') return left - right;
    if (node.operator === '*') return left * right;
    if (node.operator === '/') return left / right;
    return left ** right;
  }
  return callSafeFunction(node.name, node.args.map(argument => evaluateNode(argument, variables)));
}

const expressionCache = new Map<string, DiagramExpressionNode>();

export function evaluateMathExpression(source: string, variables: Readonly<Record<string, number>> = {}): number {
  let node = expressionCache.get(source);
  if (!node) {
    node = parseMathExpression(source);
    expressionCache.set(source, node);
  }
  const value = evaluateNode(node, variables);
  if (!Number.isFinite(value)) throw new DiagramExpressionError('La expresión no produce un número finito');
  return value;
}

export function extractMathExpressionIdentifiers(source: string): string[] {
  const identifiers = new Set<string>();
  const visit = (node: DiagramExpressionNode) => {
    if (node.kind === 'variable' && node.name !== 'pi' && node.name !== 'e') identifiers.add(node.name);
    else if (node.kind === 'unary') visit(node.value);
    else if (node.kind === 'binary') {
      visit(node.left);
      visit(node.right);
    } else if (node.kind === 'call') node.args.forEach(visit);
  };
  visit(parseMathExpression(source));
  return [...identifiers];
}
