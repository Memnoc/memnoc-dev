import snapshot from './data/projects.json' with { type: 'json' };

export interface ProjectMetadata {
  description: string | null;
  pushedAt: string | null;
  release: { tag: string; url: string } | null;
  checkedAt: string;
}

export type SyncedRepository = 'Memnoc/CodeAtlas' | 'Memnoc/tmux-drudwyn';

export const savedProjects: Partial<Record<SyncedRepository, ProjectMetadata>> = snapshot;
