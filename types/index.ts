export interface GitHubIssue {
  number: number;
  title: string;
  body: string | null;
  labels: { name: string; color: string }[];
  comments: number;
  created_at: string;
  user: { login: string };
}

export interface FileTreeItem {
  path: string;
  type: 'blob' | 'tree';
}

export interface AnalysisResult {
  startingFile: string;
  startingReason: string;
  relevantFiles: { path: string; reason: string }[];
  investigationSteps: string[];
  summary: string;
}
