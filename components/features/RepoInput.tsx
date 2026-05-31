import { Search, Loader2 } from 'lucide-react';

interface RepoInputProps {
  repoUrl: string;
  setRepoUrl: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
}

export function RepoInput({ repoUrl, setRepoUrl, onSubmit, loading }: RepoInputProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-2xl mx-auto mt-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">CodeScope AI</h1>
        <p className="text-gray-400">Discover where to start working on issues with AI-assisted repository context.</p>
      </div>
      <div className="relative">
        <input
          id="repo"
          type="url"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
          placeholder="https://github.com/owner/repo"
          required
          className="w-full bg-gray-900 border border-gray-800 rounded-xl pl-4 pr-14 py-4 text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
        />
        <button
          type="submit"
          disabled={loading || !repoUrl}
          className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </button>
      </div>
    </form>
  );
}
