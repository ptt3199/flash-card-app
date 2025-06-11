import Link from 'next/link';
import { useRouter } from 'next/router';
import { AuthButton } from './AuthButton';
import { useFlashcards } from '../contexts/FlashcardContext';
import { Settings } from 'lucide-react';

export function Header() {
  const router = useRouter();
  const { hasCards } = useFlashcards();

  const getLinkClassName = (path: string) => {
    return `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      router.pathname.startsWith(path)
        ? 'bg-blue-600 text-white'
        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
    }`;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/manage">
              <h1 className="text-xl font-semibold text-gray-900 cursor-pointer">Flash Card</h1>
            </Link>
            {hasCards && (
              <span className="ml-4 text-sm text-gray-500">
                {router.pathname.startsWith('/study') ? 'Study' :
                 router.pathname.startsWith('/manage') ? 'Manage' :
                 router.pathname.startsWith('/settings') ? 'Settings' : ''} Mode
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {hasCards && (
              <nav className="flex gap-2">
                <Link href="/study" className={getLinkClassName('/study')}>
                  Study
                </Link>
                <Link href="/manage" className={getLinkClassName('/manage')}>
                  Manage
                </Link>
              </nav>
            )}
            <Link
              href="/settings"
              className={`p-2 rounded-md text-sm font-medium transition-colors ${
                router.pathname.startsWith('/settings')
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <div className="h-6 w-px bg-gray-200"></div>
            <AuthButton />
          </div>
        </div>
      </div>
    </header>
  );
}