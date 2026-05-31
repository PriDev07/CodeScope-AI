import ReactMarkdown from 'react-markdown';
import { Loader2, ArrowLeft, FileCode2, PlayCircle, LayoutList } from 'lucide-react';
import { GitHubIssue, AnalysisResult } from '@/types';

interface AnalysisViewProps {
  issue: GitHubIssue;
  result: AnalysisResult | null;
  loading: boolean;
  statusText: string;
  onBack: () => void;
}

export function AnalysisView({ issue, result, loading, statusText, onBack }: AnalysisViewProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Nav */}
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-sm text-gray-400 hover:text-gray-100 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to issues</span>
      </button>

      {/* Issue Header */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="text-sm text-gray-500 mb-2">Issue #{issue.number}</div>
        <h2 className="text-2xl font-bold text-gray-100 mb-4">{issue.title}</h2>
        <div className="prose prose-invert max-w-none text-sm text-gray-400 max-h-60 overflow-y-auto pr-4 custom-scrollbar">
          <ReactMarkdown>{issue.body || 'No description provided.'}</ReactMarkdown>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 bg-gray-900 border border-gray-800 rounded-xl border-dashed">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="text-gray-400 animate-pulse">{statusText}</p>
        </div>
      ) : result ? (
        <div className="space-y-6">
          
          {/* Summary */}
          <div className="bg-blue-950/20 border border-blue-900/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center">
              <Loader2 className="w-5 h-5 mr-2" /> AI Summary
            </h3>
            <p className="text-gray-300 leading-relaxed">{result.summary}</p>
          </div>

          {/* Starting Point */}
          <div className="bg-green-950/20 border border-green-900/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center">
              <PlayCircle className="w-5 h-5 mr-2" /> Where to start
            </h3>
            <div className="bg-gray-950 border border-gray-800 rounded-md p-4 mb-3">
              <code className="text-green-300 font-bold">{result.startingFile}</code>
            </div>
            <p className="text-gray-300 text-sm">{result.startingReason}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Relevant Files */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col max-h-[500px]">
              <h3 className="text-lg font-semibold text-purple-400 mb-4 flex items-center shrink-0">
                <FileCode2 className="w-5 h-5 mr-2" /> Relevant Files
              </h3>
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {result.relevantFiles.map((file, idx) => (
                  <div key={idx} className="border-l-2 border-purple-500/30 pl-4">
                    <code className="block text-sm text-purple-300 mb-1">{file.path}</code>
                    <p className="text-xs text-gray-500">{file.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Implementation Steps */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 flex flex-col max-h-[500px]">
              <h3 className="text-lg font-semibold text-orange-400 mb-4 flex items-center shrink-0">
                <LayoutList className="w-5 h-5 mr-2" /> Investigation Strategy
              </h3>
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                {result.investigationSteps.map((step, idx) => (
                  <div key={idx} className="flex">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-gray-300">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      ) : null}
    </div>
  );
}
