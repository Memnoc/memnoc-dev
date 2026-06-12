import React, { useState, useCallback } from 'react';

// ——— AST types ———

type AstNode =
  | { kind: 'binary'; op: string; left: AstNode; right: AstNode }
  | { kind: 'unary'; op: string; right: AstNode }
  | { kind: 'literal'; value: string }
  | { kind: 'grouping'; expr: AstNode }
  | { kind: 'variable'; name: string };

function nodeLabel(node: AstNode): string {
  switch (node.kind) {
    case 'binary':   return node.op;
    case 'unary':    return node.op;
    case 'literal':  return node.value;
    case 'grouping': return '(·)';
    case 'variable': return node.name;
  }
}

function nodeChildren(node: AstNode): AstNode[] {
  switch (node.kind) {
    case 'binary':   return [node.left, node.right];
    case 'unary':    return [node.right];
    case 'grouping': return [node.expr];
    case 'literal':
    case 'variable': return [];
  }
}

// ——— Tokenizer ———

type TT =
  | 'NUMBER' | 'STRING' | 'IDENT'
  | 'TRUE' | 'FALSE' | 'NIL'
  | 'PLUS' | 'MINUS' | 'STAR' | 'SLASH'
  | 'BANG' | 'BANG_EQ' | 'EQ_EQ'
  | 'LT' | 'LT_EQ' | 'GT' | 'GT_EQ'
  | 'LPAREN' | 'RPAREN'
  | 'EOF';

interface Token { type: TT; lexeme: string }

const KEYWORDS: Record<string, TT> = { true: 'TRUE', false: 'FALSE', nil: 'NIL' };

function tokenize(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (/\s/.test(c)) { i++; continue; }
    if (/\d/.test(c)) {
      let v = '';
      while (i < src.length && /[\d.]/.test(src[i])) v += src[i++];
      out.push({ type: 'NUMBER', lexeme: v });
      continue;
    }
    if (c === '"') {
      let v = '"'; i++;
      while (i < src.length && src[i] !== '"') v += src[i++];
      v += '"'; i++;
      out.push({ type: 'STRING', lexeme: v });
      continue;
    }
    if (/[a-zA-Z_]/.test(c)) {
      let v = '';
      while (i < src.length && /[a-zA-Z0-9_]/.test(src[i])) v += src[i++];
      out.push({ type: KEYWORDS[v] ?? 'IDENT', lexeme: v });
      continue;
    }
    switch (c) {
      case '+': out.push({ type: 'PLUS',   lexeme: '+' }); break;
      case '-': out.push({ type: 'MINUS',  lexeme: '-' }); break;
      case '*': out.push({ type: 'STAR',   lexeme: '*' }); break;
      case '/': out.push({ type: 'SLASH',  lexeme: '/' }); break;
      case '(': out.push({ type: 'LPAREN', lexeme: '(' }); break;
      case ')': out.push({ type: 'RPAREN', lexeme: ')' }); break;
      case '<':
        if (src[i + 1] === '=') { out.push({ type: 'LT_EQ', lexeme: '<=' }); i++; }
        else out.push({ type: 'LT', lexeme: '<' });
        break;
      case '>':
        if (src[i + 1] === '=') { out.push({ type: 'GT_EQ', lexeme: '>=' }); i++; }
        else out.push({ type: 'GT', lexeme: '>' });
        break;
      case '!':
        if (src[i + 1] === '=') { out.push({ type: 'BANG_EQ', lexeme: '!=' }); i++; }
        else out.push({ type: 'BANG', lexeme: '!' });
        break;
      case '=':
        if (src[i + 1] === '=') { out.push({ type: 'EQ_EQ', lexeme: '==' }); i++; }
        break;
    }
    i++;
  }
  out.push({ type: 'EOF', lexeme: '' });
  return out;
}

// ——— Parser (recursive descent, Lox expression grammar) ———

class Parser {
  private pos = 0;
  constructor(private tokens: Token[]) {}

  private peek()    { return this.tokens[this.pos]; }
  private prev()    { return this.tokens[this.pos - 1]; }
  private advance() { return this.tokens[this.pos++]; }
  private check(t: TT) { return this.peek().type === t; }

  private match(...types: TT[]): boolean {
    for (const t of types) { if (this.check(t)) { this.advance(); return true; } }
    return false;
  }

  parse(): AstNode {
    const expr = this.expression();
    if (!this.check('EOF'))
      throw new Error(`unexpected: "${this.peek().lexeme}"`);
    return expr;
  }

  private expression() { return this.equality(); }

  private equality(): AstNode {
    let left = this.comparison();
    while (this.match('EQ_EQ', 'BANG_EQ')) {
      left = { kind: 'binary', op: this.prev().lexeme, left, right: this.comparison() };
    }
    return left;
  }

  private comparison(): AstNode {
    let left = this.term();
    while (this.match('LT', 'LT_EQ', 'GT', 'GT_EQ')) {
      left = { kind: 'binary', op: this.prev().lexeme, left, right: this.term() };
    }
    return left;
  }

  private term(): AstNode {
    let left = this.factor();
    while (this.match('PLUS', 'MINUS')) {
      left = { kind: 'binary', op: this.prev().lexeme, left, right: this.factor() };
    }
    return left;
  }

  private factor(): AstNode {
    let left = this.unary();
    while (this.match('STAR', 'SLASH')) {
      left = { kind: 'binary', op: this.prev().lexeme, left, right: this.unary() };
    }
    return left;
  }

  private unary(): AstNode {
    if (this.match('BANG', 'MINUS')) {
      return { kind: 'unary', op: this.prev().lexeme, right: this.unary() };
    }
    return this.primary();
  }

  private primary(): AstNode {
    if (this.match('TRUE'))            return { kind: 'literal', value: 'true' };
    if (this.match('FALSE'))           return { kind: 'literal', value: 'false' };
    if (this.match('NIL'))             return { kind: 'literal', value: 'nil' };
    if (this.match('NUMBER', 'STRING')) return { kind: 'literal', value: this.prev().lexeme };
    if (this.match('IDENT'))           return { kind: 'variable', name: this.prev().lexeme };
    if (this.match('LPAREN')) {
      const expr = this.expression();
      if (!this.check('RPAREN')) throw new Error('expected ")"');
      this.advance();
      return { kind: 'grouping', expr };
    }
    const tok = this.peek();
    throw new Error(tok.type === 'EOF' ? 'unexpected end of input' : `unexpected: "${tok.lexeme}"`);
  }
}

// ——— SVG tree layout ———

interface NodeLayout {
  node: AstNode;
  x: number;
  y: number;
  label: string;
}

const PAD    = 24;
const UNIT_W = 88;
const ROW_H  = 72;
const NODE_R = 22;
const MAX_LABEL = 6;

function subtreeWidth(node: AstNode): number {
  const ch = nodeChildren(node);
  return ch.length === 0 ? 1 : ch.reduce((s, c) => s + subtreeWidth(c), 0);
}

function collectLayouts(node: AstNode, depth: number, left: number, out: NodeLayout[]) {
  const w = subtreeWidth(node);
  const x = PAD + (left + w / 2) * UNIT_W;
  const y = PAD + depth * ROW_H + NODE_R;
  const raw = nodeLabel(node);
  const label = raw.length > MAX_LABEL ? raw.slice(0, MAX_LABEL - 1) + '…' : raw;
  out.push({ node, x, y, label });
  let childLeft = left;
  for (const child of nodeChildren(node)) {
    collectLayouts(child, depth + 1, childLeft, out);
    childLeft += subtreeWidth(child);
  }
}

function maxDepth(node: AstNode): number {
  const ch = nodeChildren(node);
  return ch.length === 0 ? 0 : 1 + Math.max(...ch.map(maxDepth));
}

// ——— Parse helper ———

type ParseResult =
  | { ok: true; layouts: NodeLayout[] }
  | { ok: false; error: string };

function parseInput(src: string): ParseResult {
  const trimmed = src.trim();
  if (!trimmed) return { ok: true, layouts: [] };
  try {
    const ast = new Parser(tokenize(trimmed)).parse();
    const layouts: NodeLayout[] = [];
    collectLayouts(ast, 0, 0, layouts);
    return { ok: true, layouts };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

// ——— Component ———

const DEFAULT_INPUT = '1 + 2 * 3';

export default function AstViewer() {
  const [input, setInput] = useState(DEFAULT_INPUT);
  const [result, setResult] = useState<ParseResult>(() => parseInput(DEFAULT_INPUT));

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);
    setResult(parseInput(val));
  }, []);

  const layouts = result.ok ? result.layouts : [];
  const error   = result.ok ? null : result.error;

  const totalWidth  = layouts.length > 0
    ? Math.max(...layouts.map(l => l.x)) + NODE_R + PAD
    : 300;
  const maxD = layouts.length > 0
    ? Math.max(...layouts.map(l => l.y))
    : NODE_R;
  const totalHeight = maxD + NODE_R + PAD;

  // Build edge list from parent → child
  const edges: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (const layout of layouts) {
    for (const child of nodeChildren(layout.node)) {
      const cl = layouts.find(l => l.node === child);
      if (cl) edges.push({ x1: layout.x, y1: layout.y, x2: cl.x, y2: cl.y });
    }
  }

  return (
    <div className="ast-viewer">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="1 + 2 * 3"
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
      />
      {error && <p className="ast-error">{error}</p>}
      {!error && layouts.length > 0 && (
        <div className="ast-svg-wrap">
          <svg
            width={totalWidth}
            height={totalHeight}
            viewBox={`0 0 ${totalWidth} ${totalHeight}`}
            aria-label="Abstract syntax tree"
          >
            {edges.map((e, i) => (
              <line
                key={i}
                x1={e.x1} y1={e.y1}
                x2={e.x2} y2={e.y2}
                className="ast-edge"
              />
            ))}
            {layouts.map((l, i) => (
              <g key={i} className={`ast-node ast-node-${l.node.kind}`}>
                <title>{nodeLabel(l.node)}</title>
                <circle cx={l.x} cy={l.y} r={NODE_R} />
                <text x={l.x} y={l.y} textAnchor="middle" dominantBaseline="central">
                  {l.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      )}
    </div>
  );
}
