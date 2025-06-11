import { StudyMode } from './StudyMode';
import { ManagementMode } from './ManagementMode';
import { AuthButton } from './AuthButton';
import Link from 'next/link';
import { useFlashcardsLocal } from '../hooks/useFlashcardsLocal';
import { ArrowLeft } from 'lucide-react';
import { SignInButton } from '@clerk/clerk-react';

interface LocalAppProps {
  onBackToHome: () => void;
}

export function LocalApp({ onBackToHome }: LocalAppProps) {
  const {
    cards,
    currentIndex,
    mode,
    isFlipped,
    currentCard,
    hasCards,
    isLoading,
    error,
    viewedHistory,
    historyIndex,
    addCard,
    updateCard,
    deleteCard,
    setMode,
    flipCard,
    nextCard,
    previousCard,
    clearError,
  } = useFlashcardsLocal();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Hidden in study mode */}
      {!(mode === 'study' && hasCards && currentCard) && (
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                            <Link href="/">
              <h1 className="text-xl font-semibold text-gray-900 cursor-pointer">
                Flash Card
                <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  Trial Mode
                </span>
              </h1>
            </Link>
                <span className="ml-4 text-sm text-gray-500">
                  {hasCards ? `${mode === 'study' ? 'Study' : 'Manage'} Mode` : 'Getting Started'}
                </span>
              </div>
              
              <div className="flex items-center gap-4">
                {hasCards && (
                  <nav className="flex gap-2">
                    <button
                      onClick={() => setMode('study')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        mode === 'study'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Study
                    </button>
                    <button
                      onClick={() => setMode('management')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        mode === 'management'
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      Manage
                    </button>
                  </nav>
                )}

                {/* Upgrade prompt */}
                <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                    <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
                        Sign In
                    </button>
                </SignInButton>
                  
                  <button
                    onClick={onBackToHome}
                    className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={clearError}
                  className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {mode === 'study' && hasCards && currentCard ? (
        <StudyMode
          cards={cards}
          currentIndex={currentIndex}
          isFlipped={isFlipped}
          viewedHistory={viewedHistory}
          historyIndex={historyIndex}
          onFlip={flipCard}
          onNext={nextCard}
          onPrevious={previousCard}
          onExit={() => setMode('management')}
        />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Trial Mode Info Banner */}
          {!hasCards && (
            <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">You&apos;re in Trial Mode</h3>
                  <p className="text-gray-600 mb-3">
                    Your flashcards are saved locally on this device. Sign in to sync across devices and never lose your progress.
                  </p>
                  <AuthButton />
                </div>
              </div>
            </div>
          )}

          <ManagementMode
            cards={cards}
            onAddCard={addCard}
            onUpdateCard={updateCard}
            onDeleteCard={deleteCard}
            onStartStudy={() => setMode('study')}
            isLoading={isLoading}
          />
        </main>
      )}
    </div>
  );
} 