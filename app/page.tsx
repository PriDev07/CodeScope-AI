'use client';

import { useState } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { GitHubIssue, AnalysisResult } from '@/types';
import { RepoInput } from '@/components/features/RepoInput';
import { IssueList } from '@/components/features/IssueList';
import { AnalysisView } from '@/components/features/AnalysisView';

type Step = 'input' | 'issues' | 'analysis';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<Step>('input');
  
  // Input State
  const [repoUrl, setRepoUrl] = useState('');
  const [loadingIssues, setLoadingIssues] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Issues State
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<GitHubIssue | null>(null);
  
  // Analysis State
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const parseRepoUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      const [, owner, repo] = parsed.pathname.split('/');
      if (!owner || !repo) throw new Error();
      return { owner, repo };
    } catch {
      throw new Error('Invalid GitHub repository URL. Format: https://github.com/owner/repo');
    }
  };

  const handleFetchIssues = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIssues([]);
    setLoadingIssues(true);

    try {
      const { owner, repo } = parseRepoUrl(repoUrl);
      const res = await fetch(`/api/issues?owner=${owner}&repo=${repo}`);
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch issues');
      }

      const data = await res.json();
      setIssues(data);
      setCurrentStep('issues');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingIssues(false);
    }
  };

  const handleAnalyzeIssue = async (issue: GitHubIssue) => {
    setSelectedIssue(issue);
    setCurrentStep('analysis');
    setLoadingAnalysis(true);
    setError(null);
    setAnalysisResult(null);
    
    try {
      const { owner, repo } = parseRepoUrl(repoUrl);
      
      setAnalysisStatus('Fetching repository file tree...');
      const treeRes = await fetch(`/api/tree?owner=${owner}&repo=${repo}`);
      if (!treeRes.ok) {
        const data = await treeRes.json();
        throw new Error(data.error || 'Failed to fetch file tree');
      }
      const fileTree = await treeRes.json();

      setAnalysisStatus('Analyzing issue with AI...');
      const analyzeRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: issue.title,
          body: issue.body,
          fileTree,
        }),
      });

      if (!analyzeRes.ok) {
        const data = await analyzeRes.json();
        throw new Error(data.error || 'Failed to analyze issue');
      }

      const result = await analyzeRes.json();
      if (result.error) {
        throw new Error(result.error);
      }
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingAnalysis(false);
      setAnalysisStatus('');
    }
  };

  const resetAnalysis = () => {
    setCurrentStep('issues');
    setSelectedIssue(null);
    setAnalysisResult(null);
    setError(null);
  };

  const resetAll = () => {
    setCurrentStep('input');
    setIssues([]);
    setSelectedIssue(null);
    setAnalysisResult(null);
    setError(null);
    setRepoUrl('');
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Top Action Bar if not on input step */}
      {currentStep !== 'input' && (
        <div className="flex justify-end mb-6">
          <button 
            onClick={resetAll}
            className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 hover:border-gray-700"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Analyze another repo</span>
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-950/50 border border-red-900 text-red-400 p-4 rounded-lg flex items-start space-x-3 mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm whitespace-pre-wrap">{error}</p>
        </div>
      )}

      {currentStep === 'input' && (
        <RepoInput 
          repoUrl={repoUrl} 
          setRepoUrl={setRepoUrl} 
          onSubmit={handleFetchIssues} 
          loading={loadingIssues} 
        />
      )}

      {currentStep === 'issues' && (
        <IssueList 
          issues={issues} 
          repoUrl={repoUrl} 
          onBack={() => setCurrentStep('input')} 
          onSelectIssue={handleAnalyzeIssue} 
          error={error} 
        />
      )}

      {currentStep === 'analysis' && selectedIssue && (
        <AnalysisView 
          issue={selectedIssue} 
          result={analysisResult} 
          loading={loadingAnalysis} 
          statusText={analysisStatus} 
          onBack={resetAnalysis} 
        />
      )}
    </div>
  );
}
