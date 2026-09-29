export const builtEntries = [
  {
    name: "CodeAtlas",
    repository: "Memnoc/CodeAtlas",
    expectedDefaultBranch: "main",
    blurb:
      "Maps a repository into an interactive knowledge graph of files, symbols, imports, and calls.",
    tags: ["Rust", "TypeScript", "Code intelligence"],
    status: "Original",
    sourcePaths: [
      "Cargo.toml",
      "crates/codeatlas/src/main.rs",
      "dashboard/src/main.tsx",
    ],
    cleanBuild: {
      type: "github-workflow",
      workflow: "ci.yml",
    },
    evidenceDocuments: [
      {
        label: "runnable instructions",
        path: "README.md",
        patterns: [/## Install/i, /cargo build --release/i, /codeatlas scan/i],
      },
      {
        label: "license",
        path: "LICENSE",
        patterns: [/MIT License/i, /Matteo Stara/i],
      },
      {
        label: "known limitations",
        path: "docs/SECURITY.md",
        patterns: [/## Honest limitations/i],
      },
      {
        label: "original-work account",
        path: "README.md",
        patterns: [
          /## Thanks/i,
          /strongly inspired by/i,
          /execution was shaped throughout by studying/i,
        ],
      },
    ],
  },
  {
    name: "Northstar",
    repository: "Memnoc/northstar",
    expectedDefaultBranch: "main",
    blurb:
      "Adapts Matt Pocock’s engineering skill system into a local-first workflow, adding decision records, test-first tickets, two-axis review, and guided specialist tools.",
    tags: ["Shell", "Agent workflows"],
    status: "Adapted and extended",
    sourcePaths: ["install.sh", "skills/adr/SKILL.md", "skills/tdd/SKILL.md"],
    cleanBuild: {
      type: "repository-commands",
      commands: [
        ["bash", "tests/validate-skills.sh"],
        ["bash", "tests/test-install.sh"],
      ],
    },
    evidenceDocuments: [
      {
        label: "runnable instructions",
        path: "README.md",
        patterns: [/## Install/i, /bash install\.sh/i, /## Start here/i],
      },
      {
        label: "license",
        path: "LICENSE",
        patterns: [
          /MIT License/i,
          /Matt Pocock \(original work/i,
          /Matteo Stara \(modifications/i,
        ],
      },
      {
        label: "known limitations",
        path: "README.md",
        patterns: [/## Known limitations/i],
      },
      {
        label: "adaptation account",
        path: "NOTICE",
        patterns: [
          /began as an adaptation of Matt Pocock's engineering skill system/i,
          /Full credit for\s+that original design belongs to him/i,
          /Every skill has since been rewritten, renamed, merged, extended, or replaced,\s+and the set has diverged wholesale/i,
        ],
      },
    ],
  },
] as const;

export const currentWork = {
  name: "StarScript",
  blurb:
    "At its last publicly verified stage, an early bytecode VM in C building a hand-built instruction chunk, following Crafting Interpreters as a learning path.",
  tags: ["C", "Bytecode VM"],
  status: "Current work",
  repository: "Memnoc/StarScript",
} as const;

export type BuiltStatus = (typeof builtEntries)[number]["status"];

export function repositoryUrl(repository: string) {
  return `https://github.com/${repository}`;
}
