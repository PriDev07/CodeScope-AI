import Image from 'next/image';
import Link from 'next/link';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 transition-opacity hover:opacity-80">
          <div className="bg-gray-900 border border-gray-800 p-1.5 rounded-lg">
            <Image src="/logo_square.png" alt="CodeScope AI Logo" width={24} height={24} className="rounded-md" />
          </div>
          <span className="text-lg font-bold text-gray-100 tracking-tight">CodeScope AI</span>
        </Link>
        <div className="flex items-center space-x-4">
          <a
            href="https://github.com/PriDev07/CodeScope-AI"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-gray-400 hover:text-gray-100 transition-colors flex items-center space-x-2"
          >
            <span className="hidden sm:inline-block">Star on GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
