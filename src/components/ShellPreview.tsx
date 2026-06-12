import React from 'react';

export default function ShellPreview() {
  return (
    <div className="shell-preview">
      <div className="shell-lines">
        <div className="shell-line"><span className="sh-prompt">$ </span><span className="sh-cmd">echo hello world</span></div>
        <div className="shell-line sh-out">hello world</div>
        <div className="shell-line"><span className="sh-prompt">$ </span><span className="sh-cmd">type echo</span></div>
        <div className="shell-line sh-out">echo is a shell builtin</div>
        <div className="shell-line"><span className="sh-prompt">$ </span><span className="sh-cmd">type git</span></div>
        <div className="shell-line sh-out">git is /usr/bin/git</div>
        <div className="shell-line"><span className="sh-prompt">$ </span><span className="sh-cmd">foobar</span></div>
        <div className="shell-line sh-out sh-err">foobar: command not found</div>
        <div className="shell-line"><span className="sh-prompt">$ </span><span className="sh-cursor" aria-hidden="true">█</span></div>
      </div>
    </div>
  );
}
