import React, { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';

const BUILTINS = ['echo', 'type', 'clear', 'exit', 'help'];

const FAKE_PATH: Record<string, string> = {
  git:   '/usr/bin/git',
  ls:    '/bin/ls',
  cat:   '/bin/cat',
  pwd:   '/bin/pwd',
  grep:  '/usr/bin/grep',
  find:  '/usr/bin/find',
  curl:  '/usr/bin/curl',
  vim:   '/usr/bin/vim',
  nvim:  '/usr/local/bin/nvim',
  cargo: '/home/memnoc/.cargo/bin/cargo',
  rustc: '/home/memnoc/.cargo/bin/rustc',
  gcc:   '/usr/bin/gcc',
  clang: '/usr/bin/clang',
  make:  '/usr/bin/make',
};

type Entry =
  | { kind: 'cmd'; text: string }
  | { kind: 'out'; text: string }
  | { kind: 'err'; text: string };

function run(raw: string): { entries: Entry[]; clear?: boolean } {
  const trimmed = raw.trim();
  if (!trimmed) return { entries: [] };

  const space = trimmed.indexOf(' ');
  const verb = space === -1 ? trimmed : trimmed.slice(0, space);
  const args = space === -1 ? '' : trimmed.slice(space + 1).trim();
  const cmd: Entry = { kind: 'cmd', text: raw };

  switch (verb) {
    case 'echo':
      return { entries: [cmd, { kind: 'out', text: args }] };
    case 'type': {
      if (!args) return { entries: [cmd, { kind: 'err', text: 'type: missing argument' }] };
      if (BUILTINS.includes(args)) return { entries: [cmd, { kind: 'out', text: `${args} is a shell builtin` }] };
      if (FAKE_PATH[args])         return { entries: [cmd, { kind: 'out', text: `${args} is ${FAKE_PATH[args]}` }] };
      return { entries: [cmd, { kind: 'err', text: `${args}: not found` }] };
    }
    case 'clear':
      return { entries: [], clear: true };
    case 'exit':
      return { entries: [cmd, { kind: 'out', text: 'logout' }] };
    case 'help':
      return { entries: [cmd, { kind: 'out', text: `builtins: ${BUILTINS.join('  ')}` }] };
    default:
      return { entries: [cmd, { kind: 'err', text: `${verb}: command not found` }] };
  }
}

export default function ShellPreview() {
  const [history, setHistory] = useState<Entry[]>([]);
  const [input, setInput]     = useState('');
  const [cmdHist, setCmdHist] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef     = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  function submit() {
    if (!input.trim()) return;
    const { entries, clear } = run(input);
    setHistory(h => clear ? [] : [...h, ...entries]);
    setCmdHist(h => [input, ...h]);
    setHistIdx(-1);
    setInput('');
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') { submit(); return; }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(histIdx + 1, cmdHist.length - 1);
      setHistIdx(next);
      setInput(cmdHist[next] ?? '');
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx <= 0) { setHistIdx(-1); setInput(''); }
      else { const next = histIdx - 1; setHistIdx(next); setInput(cmdHist[next] ?? ''); }
    }
  }

  return (
    <div className="shell-preview" ref={containerRef} onClick={() => inputRef.current?.focus()}>
      <div className="shell-lines">
        {history.map((entry, i) =>
          entry.kind === 'cmd' ? (
            <div key={i} className="shell-line">
              <span className="sh-prompt">$ </span>
              <span className="sh-cmd">{entry.text}</span>
            </div>
          ) : (
            <div key={i} className={`shell-line sh-out${entry.kind === 'err' ? ' sh-err' : ''}`}>
              {entry.text}
            </div>
          )
        )}
        <div className="shell-line shell-input-line">
          <span className="sh-prompt">$ </span>
          <input
            ref={inputRef}
            className="shell-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="shell input"
          />
        </div>
      </div>
    </div>
  );
}
