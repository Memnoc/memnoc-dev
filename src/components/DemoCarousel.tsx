import React, { useState } from 'react';
import AstViewer from './AstViewer';
import ShellPreview from './ShellPreview';

const DEMOS = [
  {
    name: 'shell',
    url: 'https://github.com/Memnoc/codecrafters-shell-rust',
    caption: 'POSIX shell in Rust. Builtins, PATH resolution, REPL loop. This demo mirrors the Rust implementation; piping lands next.',
    Component: ShellPreview,
  },
  {
    name: 'StarScript',
    url: 'https://github.com/Memnoc/StarScript',
    caption: 'Lox-flavored interpreter in C. Type an expression, see the parse tree.',
    Component: AstViewer,
  },
] as const;

export default function DemoCarousel() {
  const [idx, setIdx] = useState(0);
  const demo = DEMOS[idx];

  return (
    <div className="demo-carousel">
      <div className="demo-carousel-header">
        <div className="demo-tabs">
          {DEMOS.map((d, i) => (
            <button
              key={d.name}
              className={`demo-tab${i === idx ? ' active' : ''}`}
              onClick={() => setIdx(i)}
              type="button"
            >
              {d.name}
            </button>
          ))}
        </div>
        <a
          href={demo.url}
          target="_blank"
          rel="noopener noreferrer"
          className="demo-source-link"
        >
          source ↗
        </a>
      </div>
      <p className="section-caption">{demo.caption}</p>
      <demo.Component />
    </div>
  );
}
