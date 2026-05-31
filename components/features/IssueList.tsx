import { ArrowLeft, MessageSquare } from 'lucide-react';
import { GitHubIssue } from '@/types';

interface IssueListProps {
  issues: GitHubIssue[];
  repoUrl: string;
  onBack: () => void;
  onSelectIssue: (issue: GitHubIssue) => void;
  error?: string | null;
}

export function IssueList({ issues, repoUrl, onBack, onSelectIssue, error }: IssueListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-400" />
        </button>
        <div>
          <h2 className="text-xl font-semibold text-gray-100">Open Issues</h2>
          <p className="text-sm text-gray-500">{repoUrl}</p>
        </div>
      </div>

      {issues.length === 0 && !error ? (
        <div className="text-center py-12 text-gray-500 border border-gray-800 rounded-lg border-dashed">
          No open issues found in this repository.
        </div>
      ) : (
        <div className="grid gap-4">
          {issues.map((issue) => (
            <button
              key={issue.number}
              onClick={() => onSelectIssue(issue)}
              className="flex flex-col text-left p-5 bg-gray-900 border border-gray-800 rounded-lg hover:border-gray-600 transition-all group"
            >
              <div className="flex items-start justify-between w-full mb-2">
                <h3 className="text-lg font-medium text-gray-200 group-hover:text-blue-400 transition-colors">
                  {issue.title}
                </h3>
                <span className="text-sm text-gray-500 ml-4 flex-shrink-0">
                  #{issue.number}
                </span>
              </div>
              
              <div className="flex items-center space-x-4 text-xs text-gray-500 mt-auto pt-2">
                <span className="flex items-center">
                  <MessageSquare className="w-3 h-3 mr-1" />
                  {issue.comments}
                </span>
                <span>By {issue.user.login}</span>
                <span>{new Date(issue.created_at).toLocaleDateString()}</span>
              </div>
              
              {issue.labels.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {issue.labels.map(label => (
                    <span 
                      key={label.name} 
                      className="px-2 py-0.5 rounded-full text-xs"
                      style={{ 
                        backgroundColor: `#${label.color}20`,
                        color: `#${label.color}`,
                        border: `1px solid #${label.color}40`
                      }}
                    >
                      {label.name}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
