import { NextResponse } from 'next/server';
import { fetchFileTree } from '@/lib/github';
import { FileTreeItem } from '@/types';

const ALLOWED_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.java', '.rs', '.cpp', '.c', '.md'];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const owner = searchParams.get('owner');
  const repo = searchParams.get('repo');

  if (!owner || !repo) {
    return NextResponse.json({ error: 'Missing owner or repo parameter' }, { status: 400 });
  }

  try {
    const tree = await fetchFileTree(owner, repo);
    
    // Filter and extract relevant files
    const sourceFiles = tree
      .filter((item: FileTreeItem) => item.type === 'blob')
      .map((item: FileTreeItem) => item.path)
      .filter((path: string) => {
        if (path.includes('node_modules/') || path.includes('dist/') || path.includes('.git/') || path.includes('lock')) {
          return false;
        }
        return ALLOWED_EXTENSIONS.some(ext => path.endsWith(ext));
      });

    return NextResponse.json(sourceFiles);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
