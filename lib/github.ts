const GITHUB_API_URL = 'https://api.github.com';

const getHeaders = () => {
  const token = process.env.GITHUB_TOKEN;
  return {
    Accept: 'application/vnd.github.v3+json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export async function fetchIssues(owner: string, repo: string) {
  const url = `${GITHUB_API_URL}/repos/${owner}/${repo}/issues?state=open&per_page=20`;
  const response = await fetch(url, { headers: getHeaders() });
  
  if (!response.ok) {
    throw new Error(`Failed to fetch issues: ${response.statusText}`);
  }
  
  return response.json();
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
