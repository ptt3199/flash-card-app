import { Link, useLocation } from 'react-router-dom';
import { AuthButton } from './AuthButton';
import type { FlashcardData } from '../types';

interface NavigationProps {
  flashcards: FlashcardData[];
}

export function Navigation({ flashcards }: NavigationProps) {
  const location = useLocation();
  const hasCards = flashcards.length > 0;
  const isStudyMode = location.pathname === '/study';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              Flashcards
            </Link>
            
            <div className="hidden sm:flex space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Home
              </Link>
              
              <Link
                to="/manage"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === '/manage'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Manage
              </Link>
              
              {hasCards && (
                <Link
                  to="/study"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isStudyMode
                      ? 'bg-green-100 text-green-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  Study ({flashcards.length})
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}