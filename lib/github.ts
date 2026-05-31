const GITHUB_API_URL = 'https://api.github.com';

const getHeaders = () => {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: 'application/vnd.github.v3+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function fetchIssues(owner: string, repo: string) {
  let allIssues: any[] = [];
  let page = 1;
  const maxPages = 5; // Limit to 500 issues to prevent timeouts/rate limits

  while (page <= maxPages) {
    const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/issues?state=open&per_page=100&page=${page}`;
    const response = await fetch(url, { headers: getHeaders() });
    
    if (!response.ok) {
      if (page === 1) throw new Error(`Failed to fetch issues: ${response.statusText}`);
      break;
    }
    
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) break;
    
    // Filter out pull requests (they are returned as issues in the GitHub API)
    const issuesOnly = data.filter(item => !item.pull_request);
    allIssues = allIssues.concat(issuesOnly);
    
    const linkHeader = response.headers.get('link');
    if (!linkHeader || !linkHeader.includes('rel="next"')) {
      break;
    }
    page++;
  }
  
  return allIssues;
}

export async function fetchIssueDetails(owner: string, repo: string, issueNumber: number) {
  const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/issues/${issueNumber}`;
  const response = await fetch(url, { headers: getHeaders() });

  if (!response.ok) {
    throw new Error(`Failed to fetch issue details: ${response.statusText}`);
  }

  return response.json();
}

export async function fetchFileTree(owner: string, repo: string) {
  const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/git/trees/HEAD?recursive=1`;
  const response = await fetch(url, { headers: getHeaders() });

  if (!response.ok) {
    throw new Error(`Failed to fetch file tree: ${response.statusText}`);
  }

  const data = await response.json();
  return data.tree || [];
}
